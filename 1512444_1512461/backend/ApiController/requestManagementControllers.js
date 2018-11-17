var express = require('express');

var router = express.Router();
var managementRepo = require('../repos/managementRepo');
var authRepo = require('../repos/authRepo');

router.get('/getAllRequest', (req, res) => {
    var result = [];
    var drivername = "";
    managementRepo.getAllReq()
        .then(rows => {
            res.json(rows);
        })
        .catch(err => {
            console.log(err);
            res.statusCode = 500;
            res.end('View error log on console');
        });
});

router.post('/login', (req, res) => {
    managementRepo.login(req.body)
        .then(rows => {
            if (rows.length > 0) {
                var userentity = rows[0];
                var acToken = authRepo.generateAccessToken();
                var rfToken = authRepo.generateRefreshToken();

                authRepo.updateRefreshToken(userentity.iduser, rfToken)
                    .then(value => {
                        res.json({
                            auth: true,
                            user: userentity,
                            access_token: acToken,
                            refresh_token: rfToken
                        });
                    })
                    .catch(err => {
                        console.log(err);
                        res.statusCode = 500;
                        res.end("View error log on console !!! ");
                    })
            } else {
                res.json({
                    auth: false,
                })
            }
        })
        .catch(err=>{
            console.log(err);
            res.statusCode = 500;
            res.json("Vew error log on console !!!");
        })
});

router.post('/rfToken',(req,res)=>{
    authRepo.refreshAccessToken(req.body.rfToken)
        .then(value => {
            console.log(value);
            res.statusCode = 201;
            res.json({access_token : value});
        })
        .catch(err=>{
            console.log(err);
            res.statusCode = 401;
            res.end("View error log on console !!");
        })
});

module.exports = router;