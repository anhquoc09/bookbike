var db = require('../fn/mysql-db');

exports.loadAll = () => {
    var sql = 'select * from requestevent';
    return db.load(sql);
};
exports.loadAllRequestApp1=()=>{
    var sql = `select id_reqest,name,phone,address,note,status ,DATE_FORMAT(time, "%d/%m/%Y %H:%i:%s")AS time from request where status='${1}'`;

    return db.load(sql);
};

exports.updateGeocoder=(id,lat,lng)=>{
    var sql = `update request set lat = '${lat}',
                                    lng = '${lng}',
    								status =  '${2}'
    								where id_request ='${id}'`;

    return db.insert(sql);
};

exports.addEvent = userEntity => {
    var sql = `insert into requestevent(name,phone,address,note,time,status) values('${userEntity.name}','${userEntity.phone}','${userEntity.address}','${userEntity.note}','${userEntity.time}','${userEntity.status}')`;
    return db.insert(sql);
};