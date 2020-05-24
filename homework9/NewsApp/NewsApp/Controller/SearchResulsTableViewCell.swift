//
//  SearchResulsTableViewCell.swift
//  NewsApp
//
//  Created by YIming on 5/4/20.
//  Copyright © 2020 Yiming. All rights reserved.
//

import UIKit



class SearchResulsTableViewCell: UITableViewCell {
    
    var delegate : CellDelegate?
    var indexPath : IndexPath?
    @IBOutlet weak var imageLabel: UIImageView!
    @IBOutlet weak var newTitleLabel: UILabel!
    @IBOutlet weak var dataLabel: UILabel!
    @IBOutlet weak var sectionLabel: UILabel!
    @IBOutlet weak var bookmarkBut: UIButton!
    override func awakeFromNib() {
        super.awakeFromNib()
        // Initialization code
    }

    override func setSelected(_ selected: Bool, animated: Bool) {
        super.setSelected(selected, animated: animated)

        // Configure the view for the selected state
    }
    @IBAction func buttonPressed(_ sender: UIButton) {
        self.delegate?.bookmarkPressed(indexPath: indexPath!)
    }
    
}
