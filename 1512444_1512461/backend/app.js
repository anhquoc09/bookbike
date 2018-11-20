// password root mySQL : 1234
// password user SQL : 1234
var express = require('express'),
    bodyParser = require('body-parser'),
    morgan = require('morgan'),
    cors = require('cors'),
    demo = require('./repos/userRepo');

var requestReiverApiCtrl = require('./ApiController/requestReceiverApiController');
var userControllers = require('./ApiController/userControllers');
var locationIdentifierControllers = require('./ApiController/locationIdentifierControllers');
var requestManagementControllers = require('./ApiController/requestManagementControllers');
var events = require('./event');

var verifyAccessToken = require('./repos/authRepo').verifyAccessToken;

var app = express();

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

app.use('/requestReceiver',verifyAccessToken, requestReiverApiCtrl);
app.use('/userController',userControllers);
app.use('/locaIdController',verifyAccessToken,locationIdentifierControllers);
app.use('/requestManagement',verifyAccessToken,requestManagementControllers);

app.use('/requestAddedEvent',events.subcribeEventAdded);
app.use('/requestRemoveEvent',events.subcribeEventRemove);


var PORT = process.env.PORT || 3000;

app.listen(PORT, ()=>{
    console.log(`API running on PORT ${PORT}`);
});