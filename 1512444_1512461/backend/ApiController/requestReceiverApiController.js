var express = require('express'),
    moment = require('moment'),
    low = require('lowdb'),
    fileSync = require('lowdb/adapters/FileSync');

// var adapter = new fileSync('./db/db.json');
// var db = low(adapter);

var router = express.Router();

router.post('/',(req,res)=>{
    var name = req.body.name;
    var phone = req.body.phone;
    var address = req.body.address;
    var note = req.body.note;

    res.json({
        name,
        phone,
        address,
        note
    })
});

module.exports = router;