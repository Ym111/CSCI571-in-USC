const express = require('express');
const router = express.Router();

//@route    Get api/contacts
//@desc     get all users contact
//@access   Private
router.get('/',(req,res) => {
    res.send('get contacts');
});



module.exports = router;
