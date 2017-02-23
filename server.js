var server = require('http').createServer(doReq);
var io = require('socket.io')(server);

server.listen(3000) // connect

//// util
function randomString(length) {
    return Math.round((Math.pow(36, length + 1) - Math.random() * Math.pow(36, length))).toString(36).slice(1);
};

//// global village
var village = require('./village/');
var vil = village.Village(randomString(32));

// socket
var api = require("./api/");
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
    socket.on('phaseShiftTest', api.common.PhaseShift(io,socket, vil));

    // maybe arg socket is innecessary
    // before game
    socket.on('joinRoom',   api.before_game.JoinRoom(io,socket, vil));
    socket.on('exitRoom',   api.before_game.ExitRoom(io,socket, vil));
    socket.on('changeRule', api.before_game.ChangeRule(io,socket, vil));
    socket.on('startGame',  api.before_game.StartGame(io,socket, vil));

    // morning
    // daytime
    // afternoon
    socket.on('vote', api.afternoon.Vote(io,socket, vil))

    // evening
    // night
    socket.on('chat', api.night.Chat(io,socket, vil))
    socket.on('action', api.night.Action(io,socket, vil))

    // common
    socket.on('readyToShift', api.common.ReadyToShift(io,socket, vil))
});

console.log('Server running!');



// GET "/"
var fs = require('fs');
function doReq(req, res){
    res.writeHead(200, {'Content-Type' : 'text/html'});
    res.end(fs.readFileSync(__dirname + '/index.html', 'utf-8'));
}
