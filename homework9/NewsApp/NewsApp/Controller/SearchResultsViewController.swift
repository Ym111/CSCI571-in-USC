//
//  SearchResultsViewController.swift
//  NewsApp
//
//  Created by YIming on 5/3/20.
//  Copyright © 2020 Yiming. All rights reserved.
//

import UIKit
import SwiftyJSON
import SwiftSpinner

class SearchResultsViewController: UIViewController{
    

    var searchWord :String?
    @IBOutlet weak var searchResultsTableView: UITableView!
    var newsArray  = [NewsItem]()
    var newsManager = NewsManager()
    //bookmark
    var savedNewsArray = [NewsItem]()
    let defaults = UserDefaults.standard
    //time
    var timeago = TimeAge()
    
    override func viewDidLoad() {
        
        super.viewDidLoad()
        //fetch news
        newsManager.delegate = self
        newsManager.fetchNews(keyWord: searchWord!)
        // table view control
        searchResultsTableView.register(UINib(nibName: "NewsTableViewCell", bundle: nil), forCellReuseIdentifier: "searchResultsItem")
        searchResultsTableView.delegate = self
        searchResultsTableView.dataSource = self
        //spinner
        SwiftSpinner.show("Loading Search Results..")
        //pull-down refresh
        let refreshControl = UIRefreshControl()
        refreshControl.addTarget(self, action: #selector(refreshfun), for: .valueChanged)
        searchResultsTableView.refreshControl = refreshControl
  
    }
    override func viewWillAppear(_ animated: Bool) {
        
        if let savedNews = defaults.object(forKey: "SavedNews") as? Data {
            let decoder = JSONDecoder()
            if let loadedNews = try?  decoder.decode([NewsItem].self, from: savedNews){
                savedNewsArray = loadedNews
            }
        }
        searchResultsTableView.reloadData()
    }
    

}

// news fetch
extension SearchResultsViewController : NewsManagerDelegate{
    func didUpdataNews(newsManager: NewsManager, file: JSON) {
        for index in 0 ..< file.count {
            let tmp = file[index]
            let news = NewsItem(title: tmp["title"].string!, date: tmp["date"].string!, desc: tmp["desc"].string!, webURL: tmp["web_url"].string!, articleID: tmp["article_id"].string!, imageURL: tmp["image_url"].string!, section: tmp["section"].string!)
            newsArray.append(news)
        }
        //print(newsArray)
        searchResultsTableView.reloadData()
        SwiftSpinner.hide()
    }
    
    
    
}

// table view controller

extension SearchResultsViewController : UITableViewDelegate, UITableViewDataSource {
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return newsArray.count
    }
    
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell  = tableView.dequeueReusableCell(withIdentifier: "searchResultsItem", for: indexPath) as! NewsTableViewCell
        let news = newsArray[indexPath.row]
        cell.selectionStyle = UITableViewCell.SelectionStyle.none
        cell.timestampLabel.text = timeago.timeInterval(timeAgo: news.date)
        cell.imageLabel.af.setImage(withURL: NSURL(string: news.imageURL)! as URL  , placeholderImage: UIImage(named: "default-guardian"))
        cell.newtitleLabel.text = news.title
        cell.cateLabel.text = news.section
        //bookmark
        cell.indexPath = indexPath
        cell.delegate = self
        cell.bookmarkBut.setImage(UIImage(systemName: "bookmark"), for: .normal)
        cell.bookmarkBut.setImage(UIImage(systemName: "bookmark.fill"), for: .selected)
        let found = savedNewsArray.filter{ $0.articleID == news.articleID}.count
        if found > 0 {
            cell.bookmarkBut.isSelected = true;
        }else{
            cell.bookmarkBut.isSelected = false;
        }
        
        return cell
    }
    func tableView(_ tableView: UITableView, heightForRowAt indexPath: IndexPath) -> CGFloat {
        return 130
    }
    //3d touch
    func tableView(_ tableView: UITableView, contextMenuConfigurationForRowAt indexPath: IndexPath, point: CGPoint) -> UIContextMenuConfiguration? {

        return UIContextMenuConfiguration(identifier: nil, previewProvider: nil, actionProvider: { suggestedActions in
            return self.makeContextMenu(indexPath: indexPath)
        })
    }
    func makeContextMenu(indexPath : IndexPath) -> UIMenu {
        let news = self.newsArray[indexPath.row]
        let twitterShare = UIAction(title: "Share with Twitter", image: UIImage(named: "twitter")) { action in
            var shareurl = "http://twitter.com/share?text=Check%20Out%20the%20Article%21&url=" + news.webURL + "&hashtags=CSCI_571_NewsApp"
            UIApplication.shared.open(URL(string: shareurl)!)
            
        }
        //check the news ->
        let found = savedNewsArray.filter{ $0.articleID == news.articleID}
        if found.count > 0 {// find it
            let index = savedNewsArray.firstIndex{ $0.articleID == news.articleID}!
            let bookMarks = UIAction(title: "Remove Bookmark", image: UIImage(systemName: "bookmark.fill")) { action in
                self.savedNewsArray.remove(at: index)
                let cell = self.searchResultsTableView.cellForRow(at: indexPath) as! NewsTableViewCell
                cell.bookmarkBut.isSelected = false
                self.view.makeToast("Article Removed from Bookmarks", duration: 2.0, position: .bottom)
                self.storeData()
            }
            return UIMenu(title: "Menu", children: [twitterShare, bookMarks])
        }else{// not found
            let bookMarks = UIAction(title: "Bookmark", image: UIImage(systemName: "bookmark")) { action in
                self.savedNewsArray.append(self.newsArray[indexPath.row])
                let cell = self.searchResultsTableView.cellForRow(at: indexPath) as! NewsTableViewCell
                cell.bookmarkBut.isSelected = true
                self.view.makeToast("Article Bookmarkd, Check out the Bookmarks tab to view", duration: 2.0, position: .bottom)
                self.storeData()
            }
            return UIMenu(title: "Menu", children: [twitterShare, bookMarks])
        }
        
    }
    // jump
    func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        performSegue(withIdentifier: "goToDetailFromSearch", sender: self)
    }
    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
        if let indexPath = searchResultsTableView.indexPathForSelectedRow{
            let destination = segue.destination as! DetailViewController
            destination.articleID = newsArray[indexPath.row].articleID
        }
        
    }
    
}

extension SearchResultsViewController : CellDelegate {
    
    func bookmarkPressed(indexPath: IndexPath) {
        let news = newsArray[indexPath.row]
        let found = savedNewsArray.filter{ $0.articleID == news.articleID}
        if found.count > 0 {// find it
            let index = savedNewsArray.firstIndex{ $0.articleID == news.articleID}!
            savedNewsArray.remove(at: index)
            let cell = self.searchResultsTableView.cellForRow(at: indexPath) as! NewsTableViewCell
            cell.bookmarkBut.isSelected = false
            self.view.makeToast("Article Removed from Bookmarks", duration: 2.0, position: .bottom)
        }else{// not found
            savedNewsArray.append(newsArray[indexPath.row])
            let cell = self.searchResultsTableView.cellForRow(at: indexPath) as! NewsTableViewCell
            cell.bookmarkBut.isSelected = true
            self.view.makeToast("Article Bookmarkd, Check out the Bookmarks tab to view", duration: 2.0, position: .bottom)
        }
        storeData()
    }
    
    
}

//encode savedNews Array and store it in userdefaults
extension SearchResultsViewController{
    func storeData(){
        let encoder = JSONEncoder()
        if let encoded = try? encoder.encode(savedNewsArray){
            defaults.set(encoded, forKey: "SavedNews")
        }
    }
}

extension SearchResultsViewController{
    @objc func refreshfun(){
        newsManager.fetchNews(keyWord: searchWord!)
        searchResultsTableView.refreshControl?.endRefreshing()
    }
}
