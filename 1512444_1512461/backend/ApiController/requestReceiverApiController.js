var express = require('express'),
    moment = require('moment'),
    low = require('lowdb'),
    fileSync = require('lowdb/adapters/FileSync'),
    eventRepo = require('../repos/eventRepo'),
    event = require('../event');

// var adapter = new fileSync('./db/db.json');
// var db = low(adapter);

var router = express.Router();

router.post('/',(req,res)=>{
    entity = {
        name: req.body.name,
        phone: req.body.phone,
        address: req.body.address,
        note: req.body.note,
        time: moment().format("YYYY-MM-DD HH:mm:ss"),
        status: 1 // chưa được định vị
    };

    eventRepo.addEvent(entity).then((value)=>{
        entity.id_request = value.insertId;
        event.publishEventAdded(entity);
    }).catch(err => {
        console.log(err);
    });

    res.json(entity);
});

module.exports = router;