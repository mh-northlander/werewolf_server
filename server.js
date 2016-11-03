var app  = require('express')();
var http = require('http').Server(app);
var io   = require('socket.io')(http);

http.listen(3000)

app.get("/", doReq);
// var server = http.createServer(doReq).listen(portNum);

// socket
var bg = require('./api/before_game')

io.on('connection', function(socket) {
    // before game
    socket.on('joinRoom',   bg.JoinRoom(io));
    socket.on('exitRoom',   bg.ExitRoom(io));
    socket.on('changeRule', bg.ChangeRule(io));
    socket.on('startGame',  bg.StartGame(io));
});

console.log('Server running!');


// GET "/"
var fs = require('fs');
function doReq(req, res){
    res.writeHead(200, {'Content-Type' : 'text/html'});
    res.end(fs.readFileSync(__dirname + '/index.html', 'utf-8'));
}
