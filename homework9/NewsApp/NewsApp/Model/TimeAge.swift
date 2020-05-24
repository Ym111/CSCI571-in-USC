//
//  TimeAge.swift
//  NewsApp
//
//  Created by YIming on 5/7/20.
//  Copyright © 2020 Yiming. All rights reserved.
//

import Foundation

class TimeAge {
    //date change
    let dateFormat  = "yyyy-MM-dd'T'HH:mm:ssZ"
    
    func timeInterval(timeAgo:String) -> String
    {
        let df = DateFormatter()

        df.dateFormat = dateFormat
        let dateWithTime = df.date(from: timeAgo)
        let calendar = Calendar.current

        let interval = calendar.dateComponents([.hour, .minute, .second], from: dateWithTime!, to: Date())

        if let hour = interval.hour, hour > 0 {
            return hour == 1 ? "\(hour)"  + "h ago" : "\(hour)"  + "h ago"
        }else if let minute = interval.minute, minute > 0 {
            return minute == 1 ? "\(minute)"  + "m ago" : "\(minute)"  + "m ago"
        }else if let second = interval.second, second > 0 {
            return second == 1 ? "\(second)"  + "s ago" : "\(second)" + "s ago"
        } else {
            return "a moment ago"

        }
    }
    
    func timeEng(timeAgo:String) -> String
    {
        let df = DateFormatter()
        df.dateFormat = dateFormat
        let dateWithTime = df.date(from: timeAgo)

        df.dateFormat = "dd MMM yyyy"
        //df.dateStyle = .medium
        
        return  df.string(from: dateWithTime!)

    }
    
    func timeBM(timeAgo:String) -> String
    {
        let df = DateFormatter()
        df.dateFormat = dateFormat
        let dateWithTime = df.date(from: timeAgo)

        df.dateFormat = "dd MMM"
        //df.dateStyle = .medium
        
        return  df.string(from: dateWithTime!)

    }
}
    

