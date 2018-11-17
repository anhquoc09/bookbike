var db = require('../fn/mysql-db');
var md5 = require('crypto-js/md5');

exports.getAllReq = () => {
    var sql = `select requestevent.id_request, requestevent.name,requestevent.phone,requestevent.address,requestevent.status,users.name as drivername,requestevent.iduser from users, requestevent group by requestevent.id_request`;
    return db.load(sql);
};

exports.login = loginEntity => {
    var md5_pwd = md5(loginEntity.password);
    var sql = `SELECT * FROM users WHERE username = '${loginEntity.username}' and password = '${md5_pwd}' and permission = '${1}'`;
    console.log(db.load(sql));
    return db.load(sql);
};