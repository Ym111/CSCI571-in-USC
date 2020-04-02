const express = require('express');
const router = express.Router();

//@route Get api/auths
//@desc  get  logged om user
//@access Public
router.get('/',(req,res) => {
    res.send('Get logged ');
});

//@route Post api/auths
//@desc  auth user
//@access Public
router.get('/',(req,res) => {
    res.send('Log in user ');
});


module.exports = router;
