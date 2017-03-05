let server = require('http').createServer(doReq);
let io = require('socket.io')(server);

server.listen(3000) // connect

// socket
let api = require("./api/");
api.mountAPIs(io);

console.log('Server running!');



// index.html
// GET "/"
let fs = require('fs');
function doReq(req, res){
    res.writeHead(200, {'Content-Type' : 'text/html'});
    res.end(fs.readFileSync(__dirname + '/index.html', 'utf-8'));
}
