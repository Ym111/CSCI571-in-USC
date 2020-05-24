//
//  NewsTableViewCell.swift
//  NewsApp
//
//  Created by YIming on 5/3/20.
//  Copyright © 2020 Yiming. All rights reserved.
//

import UIKit


protocol CellDelegate {
    func bookmarkPressed(indexPath : IndexPath)
}

class NewsTableViewCell: UITableViewCell {
    var delegate : CellDelegate?
    var indexPath : IndexPath?
    @IBOutlet weak var imageLabel: UIImageView!
    @IBOutlet weak var newtitleLabel: UILabel!
    @IBOutlet weak var timestampLabel: UILabel!
    @IBOutlet weak var cateLabel: UILabel!
    @IBOutlet weak var bookmarkBut: UIButton!
    @IBOutlet weak var bgViewLabel: UIStackView!
    @IBOutlet weak var bgLabel: UIView!
    
    
    override func awakeFromNib() {
        super.awakeFromNib()
        // Initialization code
        imageLabel.layer.cornerRadius = 10;
        imageLabel.layer.masksToBounds = true;
        bgLabel.backgroundColor = UIColor(red: 0.90, green: 0.90, blue: 0.90, alpha: 1.00)
        bgLabel.layer.cornerRadius = 10;
        bgLabel.layer.masksToBounds = true;
        bgLabel.layer.borderWidth = 1.0
        bgLabel.layer.borderColor = UIColor.lightGray.cgColor
    }

    override func setSelected(_ selected: Bool, animated: Bool) {
        super.setSelected(selected, animated: animated)

        // Configure the view for the selected state
    }
    @IBAction func bookmarkBT(_ sender: Any) {
        self.delegate?.bookmarkPressed(indexPath: indexPath!)
    }
    
}
