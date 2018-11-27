var express = require('express');
var haversine = require('haversine');

var userRepo = require('../repos/userRepo');
var requestRepo = require('../repos/eventRepo');

var router = express.Route();

router.get('/',(req,res)=>{
   var requests =  requestRepo.loadReceiverNotStatus();
   Promise.all([requests]).then(([reqRows])=>{
       var iduser = 0;
       var distance = 0;
       reqRows.forEach(reqReceiver => {
           var coordReq = {
               lat: parseFloat(reqReceiver.lat),
               lng: parseFloat(reqReceiver.lng)
           };

           var drivers = userRepo.getDriverAllReady();
           Promise.all([drivers]).then(([driverRows])=>{
               driverRows.forEach(driver=>{
                   var coordDriver = {
                       lat: parseFloat(driver.lat),
                       lng: parseFloat(driver.lng),
                   };

                   iduser = driver.iduser;
                   distance = haversine(coordReq,coordDriver,{unit:'meter'});
                   if(haversine(coordReq,coordDriver,{unit:'meter'})<distance){
                       distance = haversine(coordReq,coordDriver,{unit: 'meter'});
                       iduser = driver.iduser;
                   }
               })
           })
       });
       console.log(iduser);
       console.log(distance);
    });
});

router.post('/currentPos',(req,res)=>{
    var iduser = req.body.iduser;
    var pos = req.body.currentPos;
    userRepo.updatePosDriver(iduser,pos)
        .then(value=>{
            res.json(value);
        })
        .catch(err => {
            console.log(err);
            res.statusCode = 500;
            res.end('View error log on console ');
        });
});

router.post('/status',(req,res)=>{
    var iduser = req.body.iduser;
    var status = req.body.status;

    userRepo.updateStatusDriver(iduser,status)
        .then(value => {
            res.json(value);
        })
        .catch(err =>{
            console.log(err);
            res.statusCode = 500;
            res.end('View error log on console');
        })
})

module.exports = router;