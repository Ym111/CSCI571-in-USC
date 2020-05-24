//
//  BKCollectionViewCell.swift
//  NewsApp
//
//  Created by YIming on 5/6/20.
//  Copyright © 2020 Yiming. All rights reserved.
//

import UIKit

class BKCollectionViewCell: UICollectionViewCell {

    
    var delegate : CellDelegate?
    var indexPath : IndexPath?
    @IBOutlet weak var imageLabel: UIImageView!
    @IBOutlet weak var titleLabel: UILabel!
    @IBOutlet weak var dateLabel: UILabel!
    @IBOutlet weak var sectionLabel: UILabel!
    @IBOutlet weak var bookmarkLabel: UIButton!
    @IBOutlet weak var bgLabel: UIView!
    override func awakeFromNib() {
        super.awakeFromNib()
        // Initialization code
        bgLabel.backgroundColor = UIColor(red: 0.90, green: 0.90, blue: 0.90, alpha: 1.00)
        bgLabel.layer.cornerRadius = 10;
        bgLabel.layer.masksToBounds = true;
        bgLabel.layer.borderWidth = 1.0
    }
    @IBAction func bookmarkPressed(_ sender: Any) {
        self.delegate?.bookmarkPressed(indexPath: indexPath!)
    }
    
}
