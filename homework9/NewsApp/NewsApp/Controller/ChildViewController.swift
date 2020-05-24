//
//  Child1WorldViewController.swift
//  NewsApp
//
//  Created by YIming on 5/5/20.
//  Copyright © 2020 Yiming. All rights reserved.
//

import UIKit
import XLPagerTabStrip
import SwiftyJSON
import SwiftSpinner

class ChildViewController: UIViewController,IndicatorInfoProvider{
    var pageTitle : String?
    var newsManager = NewsManager()
    var newsArray = [NewsItem]()
    @IBOutlet weak var showNewsTableView: UITableView!
    //bookmark
    var savedNewsArray = [NewsItem]()
    let defaults = UserDefaults.standard
    //time
    var timeage = TimeAge()
    
    
    override func viewDidLoad() {
        super.viewDidLoad()

        // Do any additional setup after loading the view.
        newsManager.delegate = self
        newsManager.fetchCateNews(cate: pageTitle!)
        //table view controller
        showNewsTableView.register(UINib(nibName: "NewsTableViewCell", bundle: nil), forCellReuseIdentifier: "showNewsItem")
        showNewsTableView.delegate = self
        showNewsTableView.dataSource = self
        //spinner
        SwiftSpinner.show("Loading \(pageTitle!.uppercased()) Headlines..")
        //pull-down refresh
        let refreshControl = UIRefreshControl()
        refreshControl.addTarget(self, action: #selector(refreshfun), for: .valueChanged)
        showNewsTableView.refreshControl = refreshControl
        
        
    }
    override func viewWillAppear(_ animated: Bool) {
        
        if let savedNews = defaults.object(forKey: "SavedNews") as? Data {
            let decoder = JSONDecoder()
            if let loadedNews = try?  decoder.decode([NewsItem].self, from: savedNews){
                savedNewsArray = loadedNews
            }
        }
        showNewsTableView.reloadData()
    }
    func indicatorInfo(for pagerTabStripController: PagerTabStripViewController) -> IndicatorInfo {
        return IndicatorInfo(title: pageTitle!)
    }
    
    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
    }
}

// news fetch
extension ChildViewController :NewsManagerDelegate {
    func didUpdataNews(newsManager: NewsManager, file: JSON) {
        newsArray.removeAll()
        for index in 0 ..< file.count {
            let tmp = file[index]
            let news = NewsItem(title: tmp["title"].string!, date: tmp["date"].string!, desc: tmp["desc"].string!, webURL: tmp["web_url"].string!, articleID: tmp["article_id"].string!, imageURL: tmp["image_url"].string!, section: tmp["section"].string!)
            newsArray.append(news)
        }
        //print(newsArray)
        showNewsTableView.reloadData()
        SwiftSpinner.hide()
    }
}

//handle table view
extension ChildViewController :UITableViewDelegate, UITableViewDataSource {
    func tableView(_ tableView: UITableView, heightForRowAt indexPath: IndexPath) -> CGFloat {
        return 130
    }
    
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return newsArray.count
    }
    
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell  = tableView.dequeueReusableCell(withIdentifier: "showNewsItem", for: indexPath) as! NewsTableViewCell
        let news = newsArray[indexPath.row]
        cell.selectionStyle = UITableViewCell.SelectionStyle.none
        cell.timestampLabel.text = timeage.timeInterval(timeAgo: news.date)
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
                let cell = self.showNewsTableView.cellForRow(at: indexPath) as! NewsTableViewCell
                cell.bookmarkBut.isSelected = false
                self.view.makeToast("Article Removed from Bookmarks", duration: 2.0, position: .bottom)
                self.storeData()
            }
            return UIMenu(title: "Menu", children: [twitterShare, bookMarks])
        }else{// not found
            let bookMarks = UIAction(title: "Bookmark", image: UIImage(systemName: "bookmark")) { action in
                self.savedNewsArray.append(self.newsArray[indexPath.row])
                let cell = self.showNewsTableView.cellForRow(at: indexPath) as! NewsTableViewCell
                cell.bookmarkBut.isSelected = true
                self.view.makeToast("Article Bookmarkd, Check out the Bookmarks tab to view", duration: 2.0, position: .bottom)
                self.storeData()
            }
            return UIMenu(title: "Menu", children: [twitterShare, bookMarks])
        }
        
    }
    // jump
    func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        performSegue(withIdentifier: "goToDetailsFromHeadlines", sender: self)
    }
    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
        if let indexPath = showNewsTableView.indexPathForSelectedRow{
            let destination = segue.destination as! DetailViewController
            destination.articleID = newsArray[indexPath.row].articleID
        }
        
    }
    
    
}

extension ChildViewController : CellDelegate {
    
    func bookmarkPressed(indexPath: IndexPath) {
        let news = newsArray[indexPath.row]
        let found = savedNewsArray.filter{ $0.articleID == news.articleID}
        if found.count > 0 {// find it
            let index = savedNewsArray.firstIndex{ $0.articleID == news.articleID}!
            savedNewsArray.remove(at: index)
            let cell = self.showNewsTableView.cellForRow(at: indexPath) as! NewsTableViewCell
            cell.bookmarkBut.isSelected = false
            self.view.makeToast("Article Removed from Bookmarks", duration: 2.0, position: .bottom)
        }else{// not found
            savedNewsArray.append(newsArray[indexPath.row])
            let cell = self.showNewsTableView.cellForRow(at: indexPath) as! NewsTableViewCell
            cell.bookmarkBut.isSelected = true
            self.view.makeToast("Article Bookmarkd, Check out the Bookmarks tab to view", duration: 2.0, position: .bottom)
        }
        storeData()
    }
    
    
}

//encode savedNews Array and store it in userdefaults
extension ChildViewController{
    func storeData(){
        let encoder = JSONEncoder()
        if let encoded = try? encoder.encode(savedNewsArray){
            defaults.set(encoded, forKey: "SavedNews")
        }
    }
}
//refresh
extension ChildViewController {
    @objc func refreshfun(){
        newsManager.fetchCateNews(cate: pageTitle!)
        showNewsTableView.refreshControl?.endRefreshing()
    }
}
