var jwt = require('jsonwebtoken'),
    rndToken = require('rand-token'),
    moment = require('moment'),
    userRepo = require('../repos/userRepo');

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
    var token = req.headers['token'];
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
        var sql = `delete from userRefreshTokenExt where iduser=${userId}`;

        db.insert(sql) //delete
            .then(value=> {
                var rdt = moment().format('YYYY-MM-DD HH:mm:ss');
                sql = `insert into userRefreshTokenExt values(${userId},'${rfToken}','${rdt}')`;
                return db.insert(sql);
            })
            .then(value => resolve(value))
            .catch(err => reject(err));
    })
};

exports.refreshAccessToken = (rfToken) =>{
    return new Promise((resolve ,reject)=>{
        var sql = `select * from userRefreshTokenExt where rf_token = '${rfToken}`;
        db.load(sql)
            .then(rows=>{
                if(rows.length > 0){
                    userRepo.getUserInfo(rows[0].iduser).then(info=>{
                        var payload = {
                            user:  info,
                            info: 'more info'
                        };

                        var token = jwt.sign(payload,SECRET,{
                            expiresIn: AC_LIFETIME
                        });

                        resolve(token);
                    })
                }else{
                    reject();
                }
            })
    })
}