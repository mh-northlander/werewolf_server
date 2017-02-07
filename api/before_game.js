// requires
model = require('./../model')

// exports
module.exports = {
    JoinRoom: joinRoom,
    ExitRoom: exitRoom,
    ChangeRule:changeRule,
    StartGame: startGame,
}


// join room
function joinRoom(io, socketId){
    return function(data){
        village.addUser(data.userId, new model.User(data.name, socketId));
        io.emit('joinRoom', {value : village.getUserNameList()});
    }
}

// exit room
function exitRoom(io){
    return function(data){
        io.emit('exitRoom', {value : "fuga"});
    }
}

// change rule
function changeRule(io){
    return function(data){
        io.emit('changeRule', {value : "piyo"});
    }
}

// start game
function startGame(io){
    return function(data){
        for(var userId in village.users){
            var userSocketId = village.users[userId].socketId;
            var userRole = village.users[userId].role;
            io.to(userSocketId).emit('startGame', {value : userRole});
        }
    }
}

//// vars
var village = new model.Village(0);

// userInfoMap
var userInfoMap = {};
