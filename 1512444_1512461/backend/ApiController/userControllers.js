var express = require('express');
var userRepo = require('../repos/userRepo');
var authRepo = require('../repos/authRepo');

var router = express.Router();

//add user
router.post('/',(req,res)=>{
    //load het user
    //lay username so sanhs trung thif loai
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

router.post('/login',(req,res)=>{

    // req.body = {
    // 	user: 'nndkhoa',
    // 	pwd: 'nndkhoa'
    // }


    userRepo.login(req.body)
        .then(rows => {
            if(rows.length > 0){
                console.log(rows[0]);   
                var userEntity = rows[0];
                var acToken = authRepo.generateAccessToken();
                var rfToken = authRepo.generateRefreshToken();

                authRepo.updateRefreshToken(userEntity.iduser,rfToken)
                    .then(value=>{
                        res.json({
                            auth: true,
                            user: userEntity,
                            access_token : acToken,
                            refresh_token : rfToken
                        });
                    })
                    .catch(err =>{
                        console.log(err);
                        res.statusCode = 500;
                        res.end("View error log on console ");
                    })
            }else{
                res.json({
                    auth: false
                });
            }
        })
        .catch(err=>{
            console.log(err);
            res.statusCode = 500;
            res.end('View error log on console');
        })
});

router.post('/rfToken',(req,res)=>{

    authRepo.refreshAccessToken(req.body.rfToken)
        .then(value => {
            console.log(value);
            res.statusCode = 201;
            res.json({access_token: value});

        })
        .catch(err =>{
            console.log(err);
            res.statusCode = 401;
            res.end('View error log on console');
        })
});

module.exports = router;