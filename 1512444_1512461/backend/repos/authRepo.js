var jwt = require('jsonwebtoken'),
    rndToken = require('rand-token'),
    moment = require('moment');

var db = require('../fn/mysql-db');

const SECRET = "ABCDEF";
const AC_LIFETIME = 600;

exports.generateAccessToken = userEntity => {
    var payload = {
        user: userEntity,
        info: "more info"
    };

    var token = jwt.sign(payload, SECRET, {
        expiresIn: AC_LIFETIME
    });

    return token;
};

exports.verifyAccessToken = (req, res, next) => {
    var token = req.header['x-access-token'];
    console.log(token);

    if (token) {
        jwt.verify(token, SECRET, (err, payload) => {
            if(err){
                res.statusCode = 401;
                res.json({
                    msg: 'INVALID TOKEN',
                    error: err
                })
            }else{
                req.token_payload = payload;
                next();
            }
        });
    }else {
        res.statusCode = 403;
        res.json({
            msg: 'NO_TOKEN'
        });
    }
};

exports.generateRefreshToken = () =>{
    const SIZE = 80;
    return rndToken.generate(SIZE);
};

exports.updateRefreshToken = (userId, rfToken)=>{
    return new Promise((resolve, reject) => {
        var sql = `UPDATE users SET rfToken = '${rfToken}' where iduser = '${userId}'`;

        return db.sqlcommon(sql);
    })
};