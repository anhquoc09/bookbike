var md5 = require('crypto-js/md5');

var db = require('../fn/mysql-db');

exports.addUser = userEntity =>{
    // userEntity = {
    //     Username: 1,
    //     Password: 'raw pwd',
    //     Name: 'name',
    //     Email: 'email',
    //     DOB: '2000-09-01',
    //     Permission: 0,
    //     Phone: '3456...'
    // }

    var md5_pwd = md5(userEntity.password);
    var sql = `insert into users(username, password, name, email, DOB, permission, phone,status) values('${userEntity.username}', '${md5_pwd}', '${userEntity.name}', '${userEntity.email}', '${userEntity.DOB}', '${userEntity.permission}','${userEntity.phone}','${0}')`;

    return db.insert(sql);
};

exports.login = loginEntity =>{
    var md5_pwd = md5(loginEntity.password);
    var sql = `SELECT * FROM users WHERE username = '${loginEntity.username}' and password = '${md5_pwd}' and permission = '${0}'`;
    return db.load(sql);
};

exports.adminlogin = loginEntity =>{
    var md5_pwd = md5(loginEntity.password);
    var sql = `SELECT * FROM users WHERE username = '${loginEntity.username}' and password = '${md5_pwd}' and permission = '${1}'`;
    return db.load(sql);
};

exports.receiverLogin = loginEntity =>{
  var md5_pwd = md5(loginEntity.password);
  var sql = `SELECT * FROM users WHERE username = '${loginEntity.username}' and password = '${md5_pwd}' and permission = '${2}'`;
  return db.load(sql);
};

exports.addReceiver = userEntity => {
    var md5_pwd = md5(userEntity.password);
    var sql = `insert into users(username, password, name, email, DOB, permission, phone) values('${userEntity.username}', '${md5_pwd}', '${userEntity.name}', '${userEntity.email}', '${userEntity.DOB}', '${userEntity.permission}','${userEntity.phone}')`;
    return db.load(sql);
};

exports.getDriverAllReady = () =>{
    //status == 0 : chưa có xe status == 1: đã có xe
    var sql = `select * from users where status = '${0}'`;
    return db.load(sql);
};

exports.updatePosDriver = (iduser,currenpos)=>{
  var sql = `update users set lat = '${currenpos.lat}', lng= '${currenpos.lng}' where iduser = '${iduser}'`;
  return db.insert(sql);
};

// exports.loadAll = () =>{
//     var sql = 'select * from city';
//     console.log(db.load(sql));
//     return db.load(sql);
// };