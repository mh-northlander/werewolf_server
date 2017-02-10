// exports
module.exports = {
    JoinRoom: joinRoom,
    ExitRoom: exitRoom,
    ChangeRule:changeRule,
    StartGame: startGame,

    PhaseShift: phaseShift,
}

// imports
model = require('./../model')

// for test
function phaseShift(io){
    return function(){
        console.log("shift..");
        village.phase.phaseShift();
        io.emit('phaseShiftTest', {name : village.phase.dayPhaseName()});

        if(village.phase.secCount > 0){
            console.log("start count" + village.phase.secCount);
            setTimeout(() => {
                phaseShift(io)();
            }, village.phase.secCount*1000);
        }
    }
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

        village.phase.phaseShift();
        io.emit('phaseShiftTest', {name : village.phase.dayPhaseName()});
    }
}

//// global vars
var village = model.Village.Village(0);

// userInfoMap
var userInfoMap = {};
