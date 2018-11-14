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
    var sql = `insert into users(username, password, name, email, DOB, permission, phone) values('${userEntity.username}', '${md5_pwd}', '${userEntity.name}', '${userEntity.email}', '${userEntity.DOB}', '${userEntity.permission}','${userEntity.phone}')`;

    return db.insert(sql);
};

exports.login = loginEntity =>{
    var md5_pwd = md5(loginEntity.password);
    var sql = `SELECT * FROM users WHERE username = '${loginEntity.username}' and password = '${md5_pwd}'`;
    console.log(db.load(sql));
    return db.load(sql);
};

// exports.loadAll = () =>{
//     var sql = 'select * from city';
//     console.log(db.load(sql));
//     return db.load(sql);
// };