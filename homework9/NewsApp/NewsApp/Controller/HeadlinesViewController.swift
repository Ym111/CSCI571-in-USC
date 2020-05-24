//
//  SecondViewController.swift
//  NewsApp
//
//  Created by YIming on 5/2/20.
//  Copyright © 2020 Yiming. All rights reserved.
//

import UIKit
import XLPagerTabStrip
import Alamofire
import SwiftyJSON


class HeadlinesViewController : ButtonBarPagerTabStripViewController {

    //@IBOutlet weak var scrollView: UIScrollView!
    //@IBOutlet weak var barView: ButtonBarView!
    @IBOutlet weak var autoSugTableView: UITableView!
    var autoSugArray = [String]()
    let purpleInspireColor = UIColor(red: 0.07, green: 0.45, blue: 0.87, alpha: 1.00)
    
    let searchBar = UISearchController(searchResultsController: nil)
    var constValue = ContValue()
    //change time
    
    
    
    override func viewDidLoad() {
        
        // Pagetabscrip
        settings.style.buttonBarBackgroundColor = .white
        settings.style.buttonBarItemBackgroundColor = .white
        settings.style.selectedBarBackgroundColor = purpleInspireColor
        settings.style.buttonBarItemFont = .boldSystemFont(ofSize: 14)
        settings.style.selectedBarHeight = 2.0
        settings.style.buttonBarMinimumLineSpacing = 0
        settings.style.buttonBarItemTitleColor = purpleInspireColor
        settings.style.buttonBarItemsShouldFillAvailableWidth = true
        settings.style.buttonBarLeftContentInset = 0
        settings.style.buttonBarRightContentInset = 0
        
        changeCurrentIndexProgressive = { [weak self] (oldCell: ButtonBarViewCell?, newCell: ButtonBarViewCell?, progressPercentage: CGFloat, changeCurrentIndex: Bool, animated: Bool) -> Void in
        guard changeCurrentIndex == true else { return }
        oldCell?.label.textColor = .gray
            newCell?.label.textColor = self?.purpleInspireColor
        }
        
        //
        super.viewDidLoad()
        //search bar
        searchBar.delegate = self
        searchBar.searchResultsUpdater = self
        searchBar.obscuresBackgroundDuringPresentation = false
        navigationItem.searchController = searchBar
        autoSugTableView.isHidden = true
        autoSugTableView.delegate = self
        autoSugTableView.dataSource = self
        
       
        
    }
    
    
    //
    override func viewControllers(for pagerTabStripController: PagerTabStripViewController) -> [UIViewController] {
        let child_world = UIStoryboard(name: "Main", bundle: nil).instantiateViewController(withIdentifier: "child") as! ChildViewController
        child_world.pageTitle = "WORLD"
        let child_business = UIStoryboard(name: "Main", bundle: nil).instantiateViewController(withIdentifier: "child") as! ChildViewController
        child_business.pageTitle = "BUSINESS"
        let child_politics = UIStoryboard(name: "Main", bundle: nil).instantiateViewController(withIdentifier: "child") as! ChildViewController
        child_politics.pageTitle = "POLITICS"
        let child_sports = UIStoryboard(name: "Main", bundle: nil).instantiateViewController(withIdentifier: "child") as! ChildViewController
        child_sports.pageTitle = "SPORTS"
        let child_technology = UIStoryboard(name: "Main", bundle: nil).instantiateViewController(withIdentifier: "child") as! ChildViewController
        child_technology.pageTitle = "TECHNOLOGY"
        let child_science = UIStoryboard(name: "Main", bundle: nil).instantiateViewController(withIdentifier: "child") as! ChildViewController
        child_science.pageTitle = "SCIENCE"
    return [child_world,child_business,child_politics,child_sports,child_technology,child_science]
    }
    


}
//search bar
extension HeadlinesViewController :UISearchResultsUpdating, UISearchControllerDelegate , UITableViewDelegate, UITableViewDataSource {
    
    
    func updateSearchResults(for searchController: UISearchController) {
        containerView.isHidden = true
        //barView.isHidden = true
        buttonBarView.isHidden = true
        autoSugTableView.isHidden = false
        if let word = searchController.searchBar.text{
            fetchAutoSug(word: word)
        }
    }
    
    func willDismissSearchController(_ searchController: UISearchController) {
        DispatchQueue.main.async {
            self.containerView.isHidden = false
            self.buttonBarView.isHidden = false
            //self.barView.isHidden = false
            self.autoSugTableView.isHidden = true
        }
    }
    //fetch auto suggest
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return autoSugArray.count
    }
    
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCell(withIdentifier: "autoSugItem",for: indexPath)
        cell.textLabel?.text = autoSugArray[indexPath.row]
        return cell
    }
    // jump to results
    func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
         performSegue(withIdentifier: "goToSearchFromHeadlines", sender: self)
    }
    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
        if let indexPath = autoSugTableView.indexPathForSelectedRow{
            let destination = segue.destination as! SearchResultsViewController
            destination.searchWord = autoSugArray[indexPath.row]
        }
    }
    
}
//fetch autosuggestions
extension HeadlinesViewController  {
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
                //print(self.autoSugArray)
            }
        }
        }else{
            self.autoSugArray.removeAll()
            self.autoSugTableView.reloadData()
        }
    }
    
    
}

