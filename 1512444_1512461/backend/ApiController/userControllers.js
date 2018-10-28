var express = require('express');
var userRepo = require('../repos/userRepo');

var router = express.Router();

//add user
router.post('/',(req,res)=>{
    // userRepo.loadAll()
    //     .then(rows => {
    //         res.json(rows);
    //     }).catch(err => {
    //     console.log(err);
    //     res.statusCode = 500;
    //     res.end('View error log on console');
    // })
    userRepo.addUser(req.body)
        .then(value=>{
            console.log(value);
            res.statusCode = 201;
            res.json(req.body);
        })
        .catch(err => {
            console.log(err);
            res.statusCode = 500;
            res.end('View error log on console');
        });
});

module.exports = router;