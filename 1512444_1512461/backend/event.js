var eventEmitter = require('eventemitter3');
var emitter = new eventEmitter();

var subscribeEvent = (req, res, event) => {
    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
    });

    var hearBeat = setInterval(() => {
        res.write('\n');
    }, 15000);

    var handler = data => {
        var json = JSON.stringify(data);
        res.write(`retry: 500\n`);
        res.write(`event: ${event}\n`);
        res.write(`data: ${json}\n`);
        res.write(`\n`);
    };

    emitter.on(event, handler);

    req.on('close', () => {
        clearInterval(hearBeat);
        emitter.removeListener(event, handler);
    });
};

// event pub-sub

var EVENT_ADDED = 'EVENT_ADDED';
var EVENT_REMOVE = 'EVENT_REMOVE';

var subcribeEventAdded = (req, res) => {
    subscribeEvent(req, res, EVENT_ADDED);
};

var subcribeEventRemove = (req, res) => {
    subscribeEvent(req, res, EVENT_REMOVE);
};

var publishEventAdded = requestObj =>{
    emitter.emit(EVENT_ADDED,requestObj);
};

var publishEventRemove = requestObj =>{
    emitter.emit(EVENT_REMOVE,requestObj);
};

module.exports = {
    subcribeEventAdded,
    publishEventAdded,
    subcribeEventRemove,
    publishEventRemove
};