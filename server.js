var app  = require('express')();
var http = require('http').Server(app);
var io   = require('socket.io')(http);

http.listen(3000)

app.get("/", doReq);

// var server = http.createServer(doReq).listen(portNum);

var fs = require('fs');

// socket
var bg = require('./api/before_game')

io.on('connection', function(socket) {
    socket.on('joinRoom', bg.JoinRoom(io));

    socket.on('exitRoom', function(data) {
        io.emit('server_to_client', {value : "fuga"});
    });
});

console.log('Server running!');


// GET "/"
function doReq(req, res){
    res.writeHead(200, {'Content-Type' : 'text/html'});
    res.end(fs.readFileSync(__dirname + '/index.html', 'utf-8'));
}
