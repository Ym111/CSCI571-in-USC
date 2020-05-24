const axios = require('axios');
const express = require('express');
const config = require('config');
const router = express.Router();
//@route    Get api/auths
//@desc     get the news
//@access   Public
router.get('/article', async (req, res) => {
    const key = config.get('NYTIMES_KEY');
    const myId = req.query.id;
    // console.log(myId)
    //https://api.nytimes.com/svc/search/v2/articlesearch.json?fq=web_url:(
    const url = config.get('NYTIMES_SEARCH_URL') + "?fq=web_url:(\"" + myId + "\")&api-key=" + key;
    //console.log(url)
    const file = await axios.get(url);
    const doc = file.data;
    if (doc.status == "OK") {
        tmp = { 'title': doc.response.docs[0].headline.main };
        //tmp['article_id'] = doc.response.content.id;
        //tmp['section'] = doc.response.results[i].sectionId;
        tmp['date'] = doc.response.docs[0].pub_date.substr(0,10);
        tmp['desc'] = doc.response.docs[0].abstract;
        tmp['source'] = "NYTIMES";
        tmp['article_id'] = doc.response.docs[0].web_url;
        tmp['section'] = doc.response.docs[0].news_desk.toLowerCase();
        tmp['web_url'] = doc.response.docs[0].web_url;
        // make a judgement about image 
        if (doc.response.docs[0].multimedia === undefined || doc.response.docs[0].multimedia === null) {
            tmp['image_url'] = "https://upload.wikimedia.org/wikipedia/commons/0/0e/Nytimes_hq.jpg";
        } else {
            //find the width >2000
            let tmp_url = "";
            for (var j = 0; j < doc.response.docs[0].multimedia.length; j++) {
                if (doc.response.docs[0].multimedia[j].width >= 2000) {
                    tmp_url = "https://www.nytimes.com/" + doc.response.docs[0].multimedia[j].url;
                    break;
                }
            }
            if (tmp_url == "") {
                tmp_url = "https://upload.wikimedia.org/wikipedia/commons/0/0e/Nytimes_hq.jpg";
            }

            tmp['image_url'] = tmp_url;
        }

        res.json(tmp);
    } else {
        res.send("Cannot get NY news details");
    }
    console.log("return NY id news");
});

module.exports = router;
