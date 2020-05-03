//
//  FirstViewController.swift
//  NewsApp
//
//  Created by YIming on 5/2/20.
//  Copyright © 2020 Yiming. All rights reserved.
//

import UIKit
import CoreLocation


class HomeViewController: UIViewController, CLLocationManagerDelegate {
    var locationManager: CLLocationManager!
    @IBOutlet weak var newsTableView: UITableView!
    
    
    
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
    }
    
    func locationManager(_ manager: CLLocationManager, didUpdateLocations locations: [CLLocation]) {
        let locValue:CLLocationCoordinate2D = manager.location!.coordinate
        print("locations = \(locValue.latitude) \(locValue.longitude)")
        locationManager.stopUpdatingLocation()
        // convert to user-friendly place
        if let lastLocation = self.locationManager.location {
            let geocoder = CLGeocoder()
                
            // Look up the location and pass it to the completion handler
            geocoder.reverseGeocodeLocation(lastLocation,
                        completionHandler: { (placemarks, error) in
                if error == nil {
                    let firstLocation = placemarks?[0]
                    //completionHandler(firstLocation)
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
        
    }


}

