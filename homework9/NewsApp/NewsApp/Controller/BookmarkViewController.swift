//
//  BookmarkViewController.swift
//  NewsApp
//
//  Created by YIming on 5/6/20.
//  Copyright © 2020 Yiming. All rights reserved.
//

import UIKit


//TODO
/*
 1 none result -> another view
 2 bookmark -> collection view
 
 */


class BookmarkViewController: UIViewController {
    
    //bookmark
    var savedNewsArray = [NewsItem]()
    let defaults = UserDefaults.standard
    //
    @IBOutlet weak var bookmarkCollectView: UICollectionView!
    @IBOutlet weak var emptyBGLabel: UIView!
    //time
    var timeage = TimeAge()
    
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        // Do any additional setup after loading the view.
        bookmarkCollectView.register(UINib(nibName: "BKCollectionViewCell", bundle: nil), forCellWithReuseIdentifier: "bookmarkItem")
        bookmarkCollectView.delegate = self
        bookmarkCollectView.dataSource = self
    }
    
    
    //bookmark -> reload
    override func viewWillAppear(_ animated: Bool) {
        
        if let savedNews = defaults.object(forKey: "SavedNews") as? Data {
            let decoder = JSONDecoder()
            if let loadedNews = try?  decoder.decode([NewsItem].self, from: savedNews){
                savedNewsArray = loadedNews
            }
        }
        bookmarkCollectView.reloadData()
    }

}

extension BookmarkViewController : UICollectionViewDelegate, UICollectionViewDataSource , UICollectionViewDelegateFlowLayout {
    
    
    func collectionView(_ collectionView: UICollectionView, layout collectionViewLayout: UICollectionViewLayout, sizeForItemAt indexPath: IndexPath) -> CGSize {
        return CGSize(width: 200, height: 280)
    }
    
    
    func collectionView(_ collectionView: UICollectionView, numberOfItemsInSection section: Int) -> Int {
        if savedNewsArray.count == 0 {
            emptyBGLabel.isHidden = false
            bookmarkCollectView.isHidden = true
        }else{
            emptyBGLabel.isHidden = true
            bookmarkCollectView.isHidden = false
        }
        return savedNewsArray.count
    }
    
    func collectionView(_ collectionView: UICollectionView, cellForItemAt indexPath: IndexPath) -> UICollectionViewCell {
        let cell = collectionView.dequeueReusableCell(withReuseIdentifier: "bookmarkItem", for: indexPath) as! BKCollectionViewCell
        let news = savedNewsArray[indexPath.row]
        
        cell.dateLabel.text = timeage.timeBM(timeAgo: news.date) 
        cell.imageLabel.af.setImage(withURL: NSURL(string: news.imageURL)! as URL  , placeholderImage: UIImage(named: "default-guardian"))
        cell.titleLabel.text = news.title
        cell.sectionLabel.text = news.section
        
        //bookmark
        cell.indexPath = indexPath
        cell.delegate = self
        
        return cell
    }
    //3d touch
    func collectionView(_ collectionView: UICollectionView, contextMenuConfigurationForItemAt indexPath: IndexPath, point: CGPoint) -> UIContextMenuConfiguration? {
        return UIContextMenuConfiguration(identifier: nil, previewProvider: nil, actionProvider: { suggestedActions in
            return self.makeContextMenu(indexPath: indexPath)
        })
    }
    func makeContextMenu(indexPath : IndexPath) -> UIMenu {
           let news = self.savedNewsArray[indexPath.row]
           let twitterShare = UIAction(title: "Share with Twitter", image: UIImage(named: "twitter")) { action in
               var shareurl = "http://twitter.com/share?text=Check%20Out%20the%20Article%21&url=" + news.webURL + "&hashtags=CSCI_571_NewsApp"
               UIApplication.shared.open(URL(string: shareurl)!)
               
           }
           //check the news ->
            let bookMarks = UIAction(title: "Remove Bookmark", image: UIImage(systemName: "bookmark.fill")) { action in
                
                self.bookmarkPressed(indexPath: indexPath)
               }
               return UIMenu(title: "Menu", children: [twitterShare, bookMarks])
           
           
       }
    
    // jump
    func collectionView(_ collectionView: UICollectionView, didSelectItemAt indexPath: IndexPath) {
        performSegue(withIdentifier: "goToDetailFromBookmark", sender: self)
    }
    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
        if let indexPath = bookmarkCollectView.indexPathsForSelectedItems?[0]{
            let destination = segue.destination as! DetailViewController
            destination.articleID = savedNewsArray[indexPath.row].articleID
        }
        
    }
}



//
extension BookmarkViewController : CellDelegate{
    //bookmark
    func bookmarkPressed(indexPath: IndexPath) {
        savedNewsArray.remove(at: indexPath.row)
        self.view.makeToast("Article Removed from Bookmarks", duration: 2.0, position: .bottom)
        bookmarkCollectView.reloadData()
        storeData()
    }
    
    func storeData(){
        let encoder = JSONEncoder()
        if let encoded = try? encoder.encode(savedNewsArray){
            defaults.set(encoded, forKey: "SavedNews")
        }
    }
}
