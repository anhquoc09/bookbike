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

    var md5_pwd = md5(userEntity.Password);
    var sql = `insert into users(f_Username, f_Password, f_Name, f_Email, f_DOB, f_Permission, f_Phone) values('${userEntity.Username}', '${md5_pwd}', '${userEntity.Name}', '${userEntity.Email}', '${userEntity.DOB}', '${userEntity.Permission}','${userEntity.Phone}')`;
};

// exports.loadAll = () =>{
//     var sql = 'select * from city';
//     console.log(db.load(sql));
//     return db.load(sql);
// };