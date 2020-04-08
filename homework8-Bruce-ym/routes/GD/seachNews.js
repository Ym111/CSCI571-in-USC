const axios = require('axios');
const express = require('express');
const config = require('config');
const router = express.Router();
//@route    Get api/auths
//@desc     get the news
//@access   Public
router.get('/news', async (req, res) => {
    const key = config.get('GUARDIN_KEY');
    const myId = req.query.q;
    //console.log(myId)
    const url = config.get('GUARDIN_URL') + "/search?q=" + myId + "&api-key=" + key + "&show-blocks=all";
    const file = await axios.get(url);
    //console.log(url)
    const doc = file.data;
    if (doc.response.status == "ok") {
        //handle data 
        //results = {};
        ans = [];
        for (var i = 0; i < doc.response.results.length; i++) {
            tmp = { 'title': doc.response.results[i].webTitle };
            tmp['article_id'] = doc.response.results[i].id;
            tmp['section'] = doc.response.results[i].sectionId;
            tmp['date'] = doc.response.results[i].webPublicationDate.substr(0,10);
            tmp['source'] = "GUARDIAN";
            tmp['desc'] = doc.response.results[i].blocks.body[0].bodyTextSummary;
            tmp['web_url'] = doc.response.results[i].webUrl;
            // make a judgement about image 

            if ((doc.response.results[i].blocks.main) === undefined || (doc.response.results[i].blocks.main.elements) === undefined || (doc.response.results[i].blocks.main.elements[0]) === undefined || (doc.response.results[i].blocks.main.elements[0].assets[doc.response.results[i].blocks.main.elements[0].assets.length - 1]) === undefined) {
                tmp['image_url'] = "https://assets.guim.co.uk/images/eada8aa27c12fe2d5afa3a89d3fbae0d/fallback-logo.png";
            } else {
                tmp['image_url'] = doc.response.results[i].blocks.main.elements[0].assets[doc.response.results[i].blocks.main.elements[0].assets.length - 1].file;
            }
            ans.push(tmp);
        }
        res.json(ans);
    } else {
        res.send("Cannot search GD news");
    }
    console.log("return GD search news：" + myId);
});

module.exports = router;
