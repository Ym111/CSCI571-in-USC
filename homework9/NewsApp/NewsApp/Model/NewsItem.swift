//
//  NewsItem.swift
//  NewsApp
//
//  Created by YIming on 5/2/20.
//  Copyright © 2020 Yiming. All rights reserved.
//

import Foundation

struct NewsItem : Codable {
    var title: String
    var date: String
    var desc: String
    var webURL: String
    var articleID : String
    var imageURL : String
    var section : String
}
