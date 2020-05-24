const axios = require('axios');
const express = require('express');
const config = require('config');
const router = express.Router();


//@route    GET /homenews
//@desc     get the homepage news
//@access   Public
router.get('/:section', async (req, res) => {
    const key = config.get('NYTIMES_KEY');
    let url = "";
    if (req.params.section == "Home") {
        url = config.get('NYTIMES_URL') + "/home.json?api-key=" + key;
    } else {
        mySection = req.params.section.toLowerCase();
        //if (mySection == "sports") mySection = "sport";
        url = config.get('NYTIMES_URL') + "/" + mySection + ".json?api-key=" + key;
    }
    //console.log(url)
    //console.log(url);
    const file = await axios.get(url);
    const doc = file.data;
    if (doc.status == "OK") {
        //handle data 
        //results = {};
        ans = [];
        for (var i = 0; i < doc.results.length; i++) {
            tmp = { 'title': doc.results[i].title };
            tmp['article_id'] = doc.results[i].url;
            tmp['section'] = doc.results[i].section.toLowerCase();
            tmp['date'] = doc.results[i].published_date.substr(0,10);
            tmp['desc'] = doc.results[i].abstract;
            tmp['source'] = "NYTIMES";
            tmp['web_url'] = doc.results[i].url;
            // make a judgement about image 
            if (doc.results[i].multimedia === undefined || doc.results[i].multimedia === null) {
                tmp['image_url'] = "https://upload.wikimedia.org/wikipedia/commons/0/0e/Nytimes_hq.jpg";
            } else {
                //find the width >2000
                let tmp_url = "";
                for (var j = 0; j < doc.results[i].multimedia.length; j++) {
                    if (doc.results[i].multimedia[j].width >= 2000) {
                        tmp_url = doc.results[i].multimedia[j].url;
                        break;
                    }
                }
                if (tmp_url == "") {
                    tmp_url = "https://upload.wikimedia.org/wikipedia/commons/0/0e/Nytimes_hq.jpg";
                }

                tmp['image_url'] = tmp_url;
            }
            ans.push(tmp);
        }
        res.json(ans);
    } else {
        res.send("Cannot get news");
    }

    console.log("return NY " + req.params.section + " news");
});


module.exports = router;
