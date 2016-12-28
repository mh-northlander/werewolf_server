model = require('./../model')

// join room
function joinRoom(io, socketId){
    return function(data){
        room.addUser(data.userId, new model.user.User(data.name, socketId));
        io.emit('joinRoom', {value : room.getUserNameList()});
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
        io.emit('startGame', {value : "pohe"});
    }
}

//// vars
var room = new model.room.Room(0)
// userInfoMap
var userInfoMap = {};

// export
module.exports = {
    JoinRoom: joinRoom,
    ExitRoom: exitRoom,
    ChangeRule:changeRule,
    StartGame: startGame,
}
