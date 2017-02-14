var server = require('http').createServer(doReq);
var io = require('socket.io')(server);

server.listen(3000) // connect


// socket
var bg = require('./api/before_game')

/* // memo
  var room = io.of('roomName'); // make namespace
  socket.join('roomName') // join room
  socket.leave('roomName') // leave
  io.to('roomName').emit(~~)

  io.to(socket.id).emit(~~)
*/

//// util
function randomString(length) {
    return Math.round((Math.pow(36, length + 1) - Math.random() * Math.pow(36, length))).toString(36).slice(1);
};

//// global village
var village = require('./village/')
var vil = village.Village(randomString(32));

io.on('connection', function(socket) {
    io.emit('connectionEstablished', {}) // 通知
    socket.on('disconnection', function(){})

    // for test
    socket.on('phaseShiftTest', bg.PhaseShift(io, vil));
    socket.on('ackTest1', function(){
        console.log("acktest1")
        // use in client side will logs server side
        socket.emit('ackTest2', function(data){ console.log(data); })
    })

    // before game
    socket.on('joinRoom',   bg.JoinRoom(io, vil, socket));
    socket.on('exitRoom',   bg.ExitRoom(io, vil));
    socket.on('changeRule', bg.ChangeRule(io, vil));
    socket.on('startGame',  bg.StartGame(io, vil));

    // morning
    // afternoon
    // evening
    // night
});

console.log('Server running!');


// GET "/"
var fs = require('fs');
function doReq(req, res){
    res.writeHead(200, {'Content-Type' : 'text/html'});
    res.end(fs.readFileSync(__dirname + '/index.html', 'utf-8'));
}
