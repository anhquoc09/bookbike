var db = require('../fn/mysql-db');

exports.loadAll = () => {
    var sql = 'select * from requestevent';
    return db.load(sql);
};
exports.loadReceiverNotStatus=()=>{
    var sql = `select id_request,name,phone,address,note,status,addressReverse ,DATE_FORMAT(time, "%d/%m/%Y %H:%i:%s")AS time from requestevent where status='${1}'`;

    return db.load(sql);
};

exports.addEvent = userEntity => {
    var sql = `insert into requestevent(name,phone,address,note,time,status,idreceiver) values('${userEntity.name}','${userEntity.phone}','${userEntity.address}','${userEntity.note}','${userEntity.time}','${userEntity.status}','${userEntity.iduser}')`;
    return db.insert(sql);
};

exports.receiveRequest  = (iduser,id_request,geocoder) =>{
    var sql =  `update requestevent set iduser = '${iduser}', status = '${0}' where id_request = '${id_request}'`;
    return db.insert(sql);
};

exports.reverseAddress = (id_request,addressReverse,geocoder)=>{
    var sql = `update requestevent set addressReverse = '${addressReverse}', lat = '${geocoder.lat}', lng = '${geocoder.lng}' where id_request = '${id_request}'`;
    return db.insert(sql);
};