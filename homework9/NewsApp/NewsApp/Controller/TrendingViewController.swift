//
//  TrendingViewController.swift
//  NewsApp
//
//  Created by YIming on 5/5/20.
//  Copyright © 2020 Yiming. All rights reserved.
//

import UIKit
import Charts
import Alamofire
import SwiftyJSON


class TrendingViewController: UIViewController {



    @IBOutlet weak var chartLabel: LineChartView!
    @IBOutlet weak var textLabel: UITextField!
    //data
    var lineChartEntry = [ChartDataEntry]()
    var constValue = ContValue()
    var lineCharData = LineChartData()
    //color
    let myColor = UIColor(red: 0.07, green: 0.45, blue: 0.87, alpha: 1.00)
    
    override func viewDidLoad() {
        super.viewDidLoad()

        // Do any additional setup after loading the view.
        fetchTrend(kw: "Coronavirus")
    }
    override func didReceiveMemoryWarning() {
    }
    @IBAction func enterLabel(_ sender: Any) {
        if let word = textLabel.text {
            print(word)
            fetchTrend(kw: word)
        }
    }

}
//fetch results
extension TrendingViewController {
    func fetchTrend(kw:String){
        let url = constValue.HOSTADDRESS + "/GD/searchTrend/word?q=" + kw.addingPercentEncoding(withAllowedCharacters: .urlHostAllowed)!
        AF.request(url).response { response in
            if let file = response.data  {
                let json = JSON(file)
                //handle json file -> chart
                //print(json)
                self.lineChartEntry.removeAll()
                for index in 0 ..< json.count {
                    let value = json[index].int
                    self.lineChartEntry.append(ChartDataEntry(x: Double(index), y: Double(value!)))
                }
                let line1 = LineChartDataSet(entries: self.lineChartEntry, label: "Trending Chart for " + kw)
                line1.colors = [self.myColor]
                line1.circleColors = [self.myColor]
                line1.circleRadius = 5.0
                line1.circleHoleColor = self.myColor
                let data = LineChartData()
                data.addDataSet(line1)
                self.chartLabel.data = data
                
            }
        }
        
    }
}

extension TrendingViewController {
    func updateCharts(){
    
    }
}
