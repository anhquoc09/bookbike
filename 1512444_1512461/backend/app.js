// password root mySQL : 1234
// password user SQL : 1234
var express = require('express'),
    bodyParser = require('body-parser'),
    morgan = require('morgan'),
    cors = require('cors'),
    demo = require('./repos/userRepo');

var requestReiverApiCtrl = require('./ApiController/requestReceiverApiController');
var userControllers = require('./ApiController/userControllers');

var app = express();

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(cors());

app.use('/requestReceiver',requestReiverApiCtrl);
app.use('/userController',userControllers);

var PORT = process.env.PORT || 3000;

app.listen(PORT, ()=>{
    console.log(`API running on PORT ${PORT}`);
});