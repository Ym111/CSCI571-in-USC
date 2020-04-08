const axios = require('axios');
const express = require('express');
const config = require('config');
const router = express.Router();
//@route    Get api/auths
//@desc     get the news
//@access   Public
router.get('/news', async (req, res) => {
    const key = config.get('NYTIMES_KEY');
    const myId = req.query.q;
    console.log(myId)
    const url = config.get('NYTIMES_SEARCH_URL') + "?q=" + myId + "&api-key=" + key;
    console.log(url)
    const file = await axios.get(url);
    const doc = file.data;
    if (doc.status == "OK") {
        //handle data 
        //results = {};
        ans = [];

        tmp = { 'title': doc.response.docs[0].headline.main };
        //tmp['article_id'] = doc.response.content.id;
        //tmp['section'] = doc.response.results[i].sectionId;

        for (var i = 0; i < doc.response.docs.length; i++) {
            tmp = { 'title':doc.response.docs[i].headline.main };
            tmp['article_id'] = doc.response.docs[i].web_url;
            tmp['section'] = doc.response.docs[i].news_desk;
            tmp['date'] = doc.response.docs[i].pub_date.substr(0,10);
            tmp['desc'] = doc.response.docs[i].abstract;
            tmp['source'] = "NYTIMES";
            tmp['web_url'] = doc.response.docs[i].web_url;
            // make a judgement about image 
            if (doc.response.docs[i].multimedia === undefined || doc.response.docs[i].multimedia === null) {
                tmp['image_url'] = "https://upload.wikimedia.org/wikipedia/commons/0/0e/Nytimes_hq.jpg";
            } else {
                //find the width >2000
                let tmp_url = "";
                for (var j = 0; j < doc.response.docs[i].multimedia.length; j++) {
                    if (doc.response.docs[i].multimedia[j].width >= 2000) {
                        tmp_url = "https://www.nytimes.com/" + doc.response.docs[i].multimedia[j].url;
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
        res.send("Cannot search NY news");
    }
    console.log("return NY search news：" + myId);
});

    module.exports = router;
