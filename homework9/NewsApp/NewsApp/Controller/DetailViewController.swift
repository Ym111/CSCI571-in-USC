//
//  DetailViewController.swift
//  NewsApp
//
//  Created by YIming on 5/3/20.
//  Copyright © 2020 Yiming. All rights reserved.
//

import UIKit
import SwiftyJSON
import SwiftSpinner

class DetailViewController: UIViewController{

    @IBOutlet weak var bmBT: UIBarButtonItem!
    @IBOutlet weak var scrollView: UIScrollView!
    @IBOutlet weak var imageLabel: UIImageView!
    @IBOutlet weak var titleLabel: UILabel!
    @IBOutlet weak var articleLabel: UILabel!
    @IBOutlet weak var sectionLabel: UILabel!
    @IBOutlet weak var dateLabel: UILabel!
    //bookmark
    var savedNewsArray = [NewsItem]()
    let defaults = UserDefaults.standard
    //time
    var timeago = TimeAge()
    
    
    
    
    
    var articleID : String?
    var newsManager  = NewsManager()
    var news = NewsItem(title: "1", date: "2", desc: "3", webURL: "4", articleID: "5", imageURL: "6", section: "7")
    override func viewDidLoad() {
        super.viewDidLoad()
        print(articleID!)
        // Do any additional setup after loading the view.
        // fetch details
        newsManager.delegate = self
        newsManager.fetchSingleNews(articleID: articleID!)
        SwiftSpinner.show("Loading Detailed Article..")
    }


}



extension DetailViewController :NewsManagerDelegate {
    func didUpdataNews(newsManager: NewsManager, file: JSON) {
        news.articleID = file["article_id"].string!
        news.date = file["date"].string!
        news.title = file["title"].string!
        news.desc = file["desc"].string!
        news.imageURL = file["image_url"].string!
        news.section = file["section"].string!
        news.webURL = file["web_url"].string!
       //print(news)
        update()
        checkBM()
        SwiftSpinner.hide()
    }
}

extension DetailViewController {
    func update(){
        navigationItem.title = news.title
        titleLabel.text = news.title
        let txt = news.desc.data(using: String.Encoding.utf8)
        try? articleLabel.attributedText = NSAttributedString(data: txt!,
                   options: [.documentType:NSAttributedString.DocumentType.html],
        documentAttributes: nil)
        imageLabel.af.setImage(withURL: NSURL(string: news.imageURL)! as URL  , placeholderImage: UIImage(named: "default-guardian"))
        
        sectionLabel.text = news.section
        print(news.date)
        dateLabel.text = timeago.timeEng(timeAgo: news.date)
    }
}
//jump out
extension DetailViewController{
    @IBAction func viewArticleBT(_ sender: UIButton) {
        //print("jump")
        UIApplication.shared.open(URL(string: news.webURL)!)
    }
}

//share and twitter
extension DetailViewController {
    @IBAction func bookmarkBT(_ sender: UIBarButtonItem) {
        let found = savedNewsArray.filter{ $0.articleID == news.articleID}.count
        if found > 0 {
            let index = savedNewsArray.firstIndex{ $0.articleID == news.articleID}!
            savedNewsArray.remove(at: index)
            self.view.makeToast("Article Removed from Bookmarks", duration: 2.0, position: .bottom)
            storeData()
            
        }else{
            savedNewsArray.append(news)
            self.view.makeToast("Article Bookmarkd, Check out the Bookmarks tab to view", duration: 2.0, position: .bottom)
            storeData()
        }
        checkBM()
        
    }
    @IBAction func twitterShareBT(_ sender: UIBarButtonItem) {
//        if let addURL = news.webURL.addingPercentEncoding(withAllowedCharacters: .urlHostAllowed){
//            var shareurl = "http://twitter.com/share?text=Check Out the Article&url=" + addURL + " goes here&hashtags=CSCI_571_NewsApp"
//
//            UIApplication.shared.open(URL(string: shareurl)!)
//        }
        
        var shareurl = "http://twitter.com/share?text=Check%20Out%20the%20Article%21&url=" + news.webURL + "&hashtags=CSCI_571_NewsApp"
            UIApplication.shared.open(URL(string: shareurl)!)
        //}
        
        
        
    }
}
//bookmark
extension DetailViewController {
    override func viewWillAppear(_ animated: Bool) {
        
        if let savedNews = defaults.object(forKey: "SavedNews") as? Data {
            let decoder = JSONDecoder()
            if let loadedNews = try?  decoder.decode([NewsItem].self, from: savedNews){
                savedNewsArray = loadedNews
            }
        }
        checkBM()
        
    }
    func storeData(){
        let encoder = JSONEncoder()
        if let encoded = try? encoder.encode(savedNewsArray){
            defaults.set(encoded, forKey: "SavedNews")
        }
    }
    func checkBM() {
        let found = savedNewsArray.filter{ $0.articleID == news.articleID}.count
        if found > 0 {
            bmBT.setBackgroundImage(UIImage(systemName: "bookmark.fill"), for: .normal, barMetrics: .default)
        }else{
             bmBT.setBackgroundImage(UIImage(systemName: "bookmark"), for: .normal, barMetrics: .default)
        }
    }
}
