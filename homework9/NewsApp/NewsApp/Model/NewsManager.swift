//
//  NewsManager.swift
//  NewsApp
//
//  Created by YIming on 5/3/20.
//  Copyright © 2020 Yiming. All rights reserved.
//

import Foundation
import Alamofire
import SwiftyJSON

protocol NewsManagerDelegate {
    func didUpdataNews(newsManager: NewsManager , file : JSON)
}
struct NewsManager {
    var delegate :NewsManagerDelegate?
    var constValue = ContValue()
    func fetchHome(){
        let url = constValue.HOSTADDRESS + "/GD/getNews/Home"
        fetchURL(url: url)
    }
    func fetchCateNews(cate : String) {
        let url = constValue.HOSTADDRESS + "/GD/getNews/" + cate.lowercased()
        fetchURL(url: url)
    }
    
    func fetchSingleNews(articleID : String){
        let url = constValue.HOSTADDRESS + "/GD/searchNews/article?id=" + articleID
        fetchURL(url: url)
    }
    
    func fetchNews(keyWord : String) {
        let url = constValue.HOSTADDRESS + "/GD/searchByQuery/news?q=" + keyWord.addingPercentEncoding(withAllowedCharacters: .urlHostAllowed)!
        fetchURL(url: url)
    }
    
    
    func fetchURL (url : String ) {
       AF.request(url).response { response in
            if let file = response.data  {
                let json = JSON(file)
                self.delegate?.didUpdataNews(newsManager: self, file: json)
            }
        }
    }
}
