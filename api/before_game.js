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

// for debug >>>>
function phaseShift(io, village){
    return function(){
        console.log("shift..");
        village.phase.phaseShift(village.phase.nextPhase());
        io.emit('phaseShiftTest', {name : village.phase.gamePhase});

        if(village.phase.secCount > 0){
            console.log("start count" + village.phase.secCount);
            setTimeout(() => {
                phaseShift(io, village)();
            }, village.phase.secCount*1000);
        }
    }
}
// <<<< for debug

// join room
function joinRoom(io, village, socketId){
    return function(data){
        village.addUser(data.userId, new model.User(data.name, socketId));
        io.emit('joinRoom', {value : village.getUserNameList()});
    }
}

// exit room
function exitRoom(io, village){
    return function(data){
        io.emit('exitRoom', {value : "fuga"});
    }
}

// change rule
function changeRule(io, village){
    return function(data){
        io.emit('changeRule', {value : "piyo"});
    }
}

// start game
function startGame(io, village){
    return function(data){
        for(var userId in village.users){
            var userSocketId = village.users[userId].socketId;
            var userRole = village.users[userId].role;
            io.to(userSocketId).emit('startGame', {value : userRole});
        }

        // phaseShift(next, dayTime, nightTime)
        console.log(village.phase.nextPhase());
        village.phase.phaseShift(village.phase.nextPhase());
        io.emit('phaseShiftTest', {name : village.phase.gamePhase});
    }
}

// userInfoMap
var userInfoMap = {};
