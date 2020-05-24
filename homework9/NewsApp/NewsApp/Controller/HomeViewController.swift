//
//  FirstViewController.swift
//  NewsApp
//
//  Created by YIming on 5/2/20.
//  Copyright © 2020 Yiming. All rights reserved.
//

import UIKit
import CoreLocation
import Alamofire
import AlamofireImage
import SwiftyJSON
import Toast_Swift
import SwiftSpinner


class HomeViewController: UIViewController, CLLocationManagerDelegate {
    
    //TODO
    /*
     
     
     5 picture cache
     */
    var locationManager: CLLocationManager!
    var newsManager = NewsManager()
    
    @IBOutlet weak var newsTableView: UITableView!
    @IBOutlet weak var autoSugTableView: UITableView!
    let searchBar = UISearchController(searchResultsController: nil)
    
    var newsArray = [NewsItem]()
    var autoSugArray = [String]()
    var constValue = ContValue()
    var locCity:String = "Los Angeles1"
    var locState: String = "California1"
    var locTemp:Float = 16.0
    var locWeather: String  = "Rain"
    
    //bookmark
    var savedNewsArray = [NewsItem]()
    let defaults = UserDefaults.standard
    //time change
    var timeago = TimeAge()
    
    
    override func viewDidLoad() {
        super.viewDidLoad()
        // location -> weather
        locationManager = CLLocationManager()
        locationManager.delegate = self;
        locationManager.desiredAccuracy = kCLLocationAccuracyBest
        locationManager.requestAlwaysAuthorization()
        locationManager.startUpdatingLocation()
        //weather cell
        newsTableView.register(UINib(nibName: "WeatherTableViewCell", bundle: nil), forCellReuseIdentifier: "weatherItem")
        newsTableView.delegate = self
        newsTableView.dataSource = self
        //news cell
        newsTableView.register(UINib(nibName: "NewsTableViewCell", bundle: nil), forCellReuseIdentifier: "newsItem")
        newsManager.delegate = self
        newsManager.fetchHome()
        //search bar
        searchBar.delegate = self
        searchBar.searchResultsUpdater = self
        searchBar.obscuresBackgroundDuringPresentation = false
        searchBar.navigationItem.hidesSearchBarWhenScrolling = true
        navigationItem.searchController = searchBar
        autoSugTableView.isHidden = true
        autoSugTableView.delegate = self
        autoSugTableView.dataSource = self
        //spinner
        SwiftSpinner.show("Loading Home Page..")
        //pull-down refresh
        let refreshControl = UIRefreshControl()
        refreshControl.addTarget(self, action: #selector(refreshfun), for: .valueChanged)
        newsTableView.refreshControl = refreshControl
        
        
        
        
    }
    
    override func viewWillAppear(_ animated: Bool) {
        //bookmark -> load data
        if let savedNews = defaults.object(forKey: "SavedNews") as? Data {
            let decoder = JSONDecoder()
            if let loadedNews = try?  decoder.decode([NewsItem].self, from: savedNews){
                savedNewsArray = loadedNews
                //print(savedNewsArray)
            }
        }
        newsTableView.reloadData()
    }
    
}



// fetch location & weather
extension HomeViewController {
    
    func locationManager(_ manager: CLLocationManager, didUpdateLocations locations: [CLLocation]) {
        locationManager.stopUpdatingLocation()
        if let lastLocation = self.locationManager.location {
            let geocoder = CLGeocoder()
            
            // Look up the location and pass it to the completion handler
            geocoder.reverseGeocodeLocation(lastLocation,
                                            completionHandler: { (placemarks, error) in
                                                if error == nil {
                                                    let firstLocation = placemarks?[0]
                                                    //completionHandler(firstLocation)
                                                    if let loccity = firstLocation?.locality , let locstate = firstLocation?.administrativeArea{
                                                        self.locCity = loccity
                                                        self.locState = locstate
                                                    }
                                                    self.getWeather(location: firstLocation)
                                                }
                                                else {
                                                    // An error occurred during geocoding.
                                                    print("Location: An error occurred during geocoding.")
                                                }
            })
        }
        else {
            // No location was available.
            print("Location: No location was available.")
        }
        
    }
    
    func getWeather(location: CLPlacemark? ){
        // AF request
        let weatherURL = "https://api.openweathermap.org/data/2.5/weather?q=" + locCity.addingPercentEncoding(withAllowedCharacters: .urlHostAllowed)! + "&units=metric&appid=" + constValue.weatherKEY
        AF.request(weatherURL).response { response in
            if let file = response.data  {
                let json = JSON(file)
                self.locWeather = json["weather"][0]["main"].string!
                self.locTemp = json["main"]["temp"].float!
                self.newsTableView.reloadData()
            }
        }
    }
    
    
}






//For table view control
extension HomeViewController : UITableViewDataSource{
    
    func numberOfSections(in tableView: UITableView) -> Int {
        if tableView == newsTableView{
            return 2
        }else {
            return 1
        }
    }
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        if tableView == newsTableView{
            if section == 0 {
                return 1
            }else{
                return newsArray.count
            }
        }else{
            return autoSugArray.count
        }
    }
    
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        if tableView == newsTableView {
            if indexPath.section == 0{
                // weather
                let cell = tableView.dequeueReusableCell(withIdentifier: "weatherItem", for: indexPath) as! WeatherTableViewCell
                
                cell.cityLabel.text = locCity
                cell.stateLabel.text = locState
                cell.weatherLabel.text = locWeather
                cell.tempLabel.text = locTemp.description + "°C"
                switch locWeather {
                case "Clouds":
                    cell.backgroundImg.image = UIImage(named: "cloudy_weather")
                    break
                case "Clear":
                    cell.backgroundImg.image = UIImage(named: "clear_weather")
                    break
                case "Snow":
                    cell.backgroundImg.image = UIImage(named: "snowy_weather")
                    break
                case "Rain":
                    cell.backgroundImg.image = UIImage(named: "rainy_weather")
                    break
                case "Thunderstorm":
                    cell.backgroundImg.image = UIImage(named: "thunder_weather")
                    break
                default:
                    cell.backgroundImg.image = UIImage(named: "sunny_weather")
                    break
                }
                
                return cell
            }else{
                let cell = tableView.dequeueReusableCell(withIdentifier: "newsItem", for: indexPath) as! NewsTableViewCell
                cell.selectionStyle = UITableViewCell.SelectionStyle.none
                let news = newsArray[indexPath.row]
                //set cell
                cell.cateLabel.text = news.section
                cell.imageLabel.af.setImage(withURL: NSURL(string: news.imageURL)! as URL  , placeholderImage: UIImage(named: "default-guardian"))
                cell.newtitleLabel.text = news.title
                cell.timestampLabel.text = timeago.timeInterval(timeAgo: news.date)
                cell.indexPath = indexPath
                cell.delegate = self
                // bookmark part
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
            
        }else{
            let cell = tableView.dequeueReusableCell(withIdentifier: "autoSugItem",for: indexPath)
            cell.textLabel?.text = autoSugArray[indexPath.row]
            return cell
        }
        
    }
    func tableView(_ tableView: UITableView, heightForRowAt indexPath: IndexPath) -> CGFloat {
        if tableView != autoSugTableView {
            return 130
        }else{
            return UITableView.automaticDimension
        }
    }
}

// Segue from home to detail
extension HomeViewController : UITableViewDelegate{
    func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        if tableView == newsTableView{
            if indexPath.section == 1 {
                performSegue(withIdentifier: "goToDetailFromHome", sender: self)
            }
        }else{
            // autoSuggestion -> search result
            performSegue(withIdentifier: "goToSearchFromHome", sender: self)
        }
    }
    func tableView(_ tableView: UITableView, contextMenuConfigurationForRowAt indexPath: IndexPath, point: CGPoint) -> UIContextMenuConfiguration? {
        if indexPath.section == 0 {
            return nil
        }
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
                let cell = self.newsTableView.cellForRow(at: indexPath) as! NewsTableViewCell
                cell.bookmarkBut.isSelected = false
                self.view.makeToast("Article Removed from Bookmarks", duration: 2.0, position: .bottom)
                self.storeData()
            }
            return UIMenu(title: "Menu", children: [twitterShare, bookMarks])
        }else{// not found
            let bookMarks = UIAction(title: "Bookmark", image: UIImage(systemName: "bookmark")) { action in
                self.savedNewsArray.append(self.newsArray[indexPath.row])
                let cell = self.newsTableView.cellForRow(at: indexPath) as! NewsTableViewCell
                cell.bookmarkBut.isSelected = true
                self.view.makeToast("Article Bookmarkd, Check out the Bookmarks tab to view", duration: 2.0, position: .bottom)
                self.storeData()
            }
            return UIMenu(title: "Menu", children: [twitterShare, bookMarks])
        }
        
    }
    
    
    
    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
        if segue.identifier == "goToDetailFromHome" {
            if let indexPath = newsTableView.indexPathForSelectedRow{
                let destination = segue.destination as! DetailViewController
                destination.articleID = newsArray[indexPath.row].articleID
            }
        }else{
            if let indexPath = autoSugTableView.indexPathForSelectedRow{
                let destination = segue.destination as! SearchResultsViewController
                destination.searchWord = autoSugArray[indexPath.row]
            }
        }
    }
}


//Fetch news
extension HomeViewController : NewsManagerDelegate{
    
    func didUpdataNews(newsManager: NewsManager, file: JSON) {
        //JSON to newsArray
        for index in 0..<10 {
            let newsItem = NewsItem(title: file[index]["title"].string!, date: file[index]["date"].string!, desc: file[index]["desc"].string!, webURL: file[index]["web_url"].string!, articleID: file[index]["article_id"].string!, imageURL: file[index]["image_url"].string!, section: file[index]["section"].string!)
            newsArray.append(newsItem)
        }
        //UI reload
        self.newsTableView.reloadData()
        SwiftSpinner.hide()
    }
}

//Search function
extension HomeViewController : UISearchControllerDelegate, UISearchResultsUpdating{
    func updateSearchResults(for searchController: UISearchController) {
        newsTableView.isHidden = true
        autoSugTableView.isHidden = false
        if let word = searchController.searchBar.text{
            fetchAutoSug(word: word)
        }
    }
    func willDismissSearchController(_ searchController: UISearchController) {
        DispatchQueue.main.async {
            self.newsTableView.isHidden = false
            self.autoSugTableView.isHidden = true
        }
        
    }
    // handle autoSugTableView
    func fetchAutoSug( word :String){
        if word.count >= 3{
            let autoSugURL = constValue.AUTOSUGADDRESS + "?q=" + word
            let key = constValue.autoSugKEY
            AF.request(autoSugURL,
                       headers:["Ocp-Apim-Subscription-Key": key]
            ).response { response in
                if let file = response.data  {
                    let json = JSON(file)
                    let sg = json["suggestionGroups"][0]["searchSuggestions"]
                    self.autoSugArray.removeAll()
                    for  index in 0 ..< sg.count {
                        self.autoSugArray.append(sg[index]["displayText"].string!)
                    }
                    self.autoSugTableView.reloadData()
                }
            }
        }else{
            self.autoSugArray.removeAll()
            self.autoSugTableView.reloadData()
        }
    }
    
}


extension HomeViewController : CellDelegate  {
    func bookmarkPressed(indexPath: IndexPath) {
        let news = newsArray[indexPath.row]
        let found = savedNewsArray.filter{ $0.articleID == news.articleID}
        if found.count > 0 {// find it
            
            let index = savedNewsArray.firstIndex{ $0.articleID == news.articleID}!
            savedNewsArray.remove(at: index)
            let cell = self.newsTableView.cellForRow(at: indexPath) as! NewsTableViewCell
            cell.bookmarkBut.isSelected = false
            self.view.makeToast("Article Removed from Bookmarks", duration: 2.0, position: .bottom)
        }else{// not found
            
            
            savedNewsArray.append(newsArray[indexPath.row])
            let cell = self.newsTableView.cellForRow(at: indexPath) as! NewsTableViewCell
            cell.bookmarkBut.isSelected = true
            self.view.makeToast("Article Bookmarkd, Check out the Bookmarks tab to view", duration: 2.0, position: .bottom)
        }
        storeData()
    }
    
    
}

//encode savedNews Array and store it in userdefaults
extension HomeViewController{
    func storeData(){
        let encoder = JSONEncoder()
        if let encoded = try? encoder.encode(savedNewsArray){
            defaults.set(encoded, forKey: "SavedNews")
        }
    }
}

//refresh func
extension HomeViewController {
    @objc func refreshfun(){
        newsManager.fetchHome()
        newsTableView.refreshControl?.endRefreshing()
    }
}

