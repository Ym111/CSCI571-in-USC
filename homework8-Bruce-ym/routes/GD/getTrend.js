const axios = require('axios');
const express = require('express');
const config = require('config');
const router = express.Router();
//@route    Get api/auths
//@desc     get the news
//@access   Public
router.get('/word', async (req, res) => {
    const key = config.get('GUARDIN_KEY');
    const myId = req.query.q;
    console.log(myId)
    const googleTrends = require('google-trends-api');
    //const url = config.get('GUARDIN_URL') + "/search?q=" + myId + "&api-key=" + key + "&show-blocks=all";

    googleTrends.interestOverTime({keyword: myId , startTime : new Date('2019-06-01')}, function(err, results){
        if(err) console.error('Google Trend eroor :', err);
        else {
            
            const file = JSON.parse(results).default.timelineData
            
            var ans = [] 
            for (var i = 0; i< file.length;i++){
                ans.push(file[i].value[0])
            }
            res.json(ans);
            //console.log( file);
        }
      })

    //const file = await axios.get(url);
    //console.log(url)
    //const doc = file.data;
   
    console.log("return Google Trend ：" + myId);
});

module.exports = router;
