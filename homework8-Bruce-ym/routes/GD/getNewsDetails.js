const axios = require('axios');
const express = require('express');
const config = require('config');
const router = express.Router();
//@route    Get api/auths
//@desc     get the news
//@access   Public
router.get('/article', async (req, res) => {
    const key = config.get('GUARDIN_KEY');
    const myId = req.query.id;
    // console.log(myId)
    const url = "https://content.guardianapis.com/" + myId +"?api-key=" + key + "&show-blocks=all"
    //const url = config.get('GUARDIN_URL') + "/" + myId + "?api-key=" + key + "&show-blocks=all";
    const file = await axios.get(url);
    //console.log(url)
    const doc = file.data;
    if (doc.response.status == "ok") {
        tmp = { 'title': doc.response.content.webTitle };
        //tmp['article_id'] = doc.response.content.id;
        //tmp['section'] = doc.response.results[i].sectionId;
        tmp['date'] = doc.response.content.webPublicationDate;
        tmp['source'] = "GUARDIAN";
        let txt = ""
        for (var index = 0; index < doc.response.content.blocks.body.length;index ++ ){
            txt += doc.response.content.blocks.body[index].bodyHtml
        }
        tmp['desc']= txt
        tmp['article_id'] = doc.response.content.id;
        tmp['section'] = doc.response.content.sectionId.toLowerCase();
        tmp['web_url'] = doc.response.content.webUrl;
        // make a judgement about image 
        if ((doc.response.content.blocks.main) === undefined || (doc.response.content.blocks.main.elements) === undefined || (doc.response.content.blocks.main.elements[0]) === undefined || (doc.response.content.blocks.main.elements[0].assets[doc.response.content.blocks.main.elements[0].assets.length - 1]) === undefined) {
            tmp['image_url'] = "!";
        } else {
            tmp['image_url'] = doc.response.content.blocks.main.elements[0].assets[doc.response.content.blocks.main.elements[0].assets.length - 1].file;
        }

        res.json(tmp);
    } else {
        res.send("Cannot get news details");
    }
    console.log("return GD id news");
});

module.exports = router;
