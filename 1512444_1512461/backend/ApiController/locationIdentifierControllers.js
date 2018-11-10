var express = require('express');
var moment = require('moment');

var event = require('../event');
var requestRepo = require('../repos/eventRepo');

var router = express.Router();

router.get('/getAll',(req,res)=>{

    requestRepo.loadAll()
        .then(rows=>{
            res.json(rows);
        }).catch(err=>{
            console.log(err);
            res.statusCode = 500;
            res.end('View error log on console');
    });

});

router.get('/getRequestReceiver',(req,res)=>{

    requestRepo.loadAll()
        .then(rows=>{
            res.json(rows);
        }).catch(err=>{
            res.statusCode = 500;
            res.end('View error log on console');
    })

});

module.exports = router;