var server = require('http').createServer(doReq);
var io = require('socket.io')(server);

server.listen(3000) // connect

// socket
var api = require("./api/");
api.mountAPIs(io);

console.log('Server running!');

// GET "/"
var fs = require('fs');
function doReq(req, res){
    res.writeHead(200, {'Content-Type' : 'text/html'});
    res.end(fs.readFileSync(__dirname + '/index.html', 'utf-8'));
}
