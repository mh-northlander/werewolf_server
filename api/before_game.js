// exports
module.exports = {
    JoinRoom:  joinRoom,
    ExitRoom:  exitRoom,
    ChangeRule:changeRule,

    StartGame: startGame,
};

// imports
night = require("./night")

// join room
function joinRoom(io, socket, village){
    return function(data){
        village.addUser(data.userId, socket.id, data.name);

        // list of {id,name}
        io.sockets.emit("memberChanged", village.listUsers());
    }
};

// exit room
function exitRoom(io, socket, village){
    return function(){
        userId = village.socketIdToUserId(socket.id)
        village.removeUser(userId);

        // list of {id,name}
        io.sockets.emit("memberChanged", village.listUsers());
    }
};

// change rule
function changeRule(io, socket, village){
    return function(rule){
        village.changeRule(rule);
        io.sockets.emit('ruleChanged', village.Rule);
    }
};

// start game
function startGame(io, village){
    return function(){
        // set role : TODO
        for(var [id,user] of village.users){
            io.to(user.socketId).emit("toleAck", user.role.type);
        }

        // set chat room : TODO

        // next phase
        night.Begin(io, village);
    }
};
