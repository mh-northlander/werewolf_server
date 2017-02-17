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
/* // memo
  var room = io.of('roomName'); // make namespace
  socket.join('roomName') // join room
  socket.leave('roomName') // leave
  io.to('roomName').emit(~~)

  io.to(socket.id).emit(~~)
*/
io.on('connection', function(socket) {
    io.emit('connectionEstablished', {}) // 通知
    socket.on('disconnection', function(){})

    // for test
    socket.on('phaseShiftTest', co.PhaseShift(io, vil));
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
    // socket.on('morningResultChecked', mr.MorningResultChecked(io, vil))

    // daytime
    // afternoon
    socket.on('vote', af.Vote(io,vil))

    // evening
    // night
    socket.on('chat', ni.Chat(io,vil))
    socket.on('action', ni.Action(io,vil))

    // common
    socket.on('readyToShift', co.ReadyToShift(io,vil))
});

console.log('Server running!');


// GET "/"
var fs = require('fs');
function doReq(req, res){
    res.writeHead(200, {'Content-Type' : 'text/html'});
    res.end(fs.readFileSync(__dirname + '/index.html', 'utf-8'));
}
