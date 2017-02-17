// exports
module.exports = {
    JoinRoom: joinRoom,
    ExitRoom: exitRoom,
    ChangeRule:changeRule,
    StartGame: startGame,
};

// imports
model = require('../model/');


// join room
function joinRoom(io, village, socket){
    return function(data){
        village.addUser(data.userId, data.name, socket.id);
        io.emit('memberChanged', {value : village.getUserNameList()});
    }
};

// exit room
function exitRoom(io, village){
    return function(data){
        village.removeUser(data.userId);
    }
};

// change rule
function changeRule(io, village){
    return function(data){
        io.broadcast.emit('ruleChanged', village.Rule);
    }
};

// start game
function startGame(io, village){
    return function(data){
        for(var userId in village.users){
            var userSocketId = village.users[userId].socketId;
            var userRole = village.users[userId].role;
            io.to(userSocketId).emit('startGame', {value : userRole});
        }

        village.shiftPhase(io, model.Phase.GamePhase.NIGHT)
    }
};
