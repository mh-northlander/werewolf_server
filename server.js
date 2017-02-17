var server = require('http').createServer(doReq);
var io = require('socket.io')(server);

server.listen(3000) // connect

//// util
function randomString(length) {
    return Math.round((Math.pow(36, length + 1) - Math.random() * Math.pow(36, length))).toString(36).slice(1);
};

//// global village
var village = require('./village/')
var vil = village.Village(randomString(32));

// socket
var bg = require('./api/before_game')
var mr = require('./api/morning')
var af = require('./api/afternoon')
var ev = require('./api/evening')
var ni = require('./api/night')
var co = require('./api/common')
/* // memo io
   io = require("socket.io")()               // io: Server
   io.on("connection", function(soc){ ~~ }); // soc: Socket

   var hoge = io.of('roomName'); // make namespace (something like ./hoge/fuga)

   soc.join('roomName')  // join room
   soc.leave('roomName') // leave

   soc.id // identifier of client

   io.emit() == io.sockets.emit() // all w/ self
   io.to('roomName').emit()       // in room w/ self
   io.to(socket.id).emit()        // one
   soc.emit()                     // a client
   soc.to("roomName").emit()      // in room w/o self
   soc.broadcast.emit()           // all w/o self
*/
io.on('connection', function(socket) {
    socket.emit('connectionEstablished', {});
    socket.on('disconnection', function(){});

    // for test
    socket.on('phaseShiftTest', co.PhaseShift(io,socket, vil));
    socket.on('ackTest1', function(){
        console.log("acktest1")
        // use in client side will logs server side
        socket.emit('ackTest2', function(data){ console.log(data); })
    });

    // maybe arg socket is innecessary
    // before game
    socket.on('joinRoom',   bg.JoinRoom(io,socket, vil));
    socket.on('exitRoom',   bg.ExitRoom(io,socket, vil));
    socket.on('changeRule', bg.ChangeRule(io,socket, vil));
    socket.on('startGame',  bg.StartGame(io,socket, vil));

    // morning
    // socket.on('morningResultChecked', mr.MorningResultChecked(io, vil))

    // daytime
    // afternoon
    socket.on('vote', af.Vote(io,socket, vil))

    // evening
    // night
    socket.on('chat', ni.Chat(io,socket, vil))
    socket.on('action', ni.Action(io,socket, vil))

    // common
    socket.on('readyToShift', co.ReadyToShift(io,socket, vil))
});

console.log('Server running!');


// GET "/"
var fs = require('fs');
function doReq(req, res){
    res.writeHead(200, {'Content-Type' : 'text/html'});
    res.end(fs.readFileSync(__dirname + '/index.html', 'utf-8'));
}
