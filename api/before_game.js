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
function joinRoom(io, socket, village){
    return function(data){
        village.addUser(data.userId, data.name, socket.id);
        io.sockets.emit('memberChanged', {value : village.getUserNameList()});
    }
};

// exit room
function exitRoom(io, socket, village){
    return function(data){
        village.removeUser(data.userId);
        io.sockets.emit("memberChanged", {value : village.getUserNameList()});
    }
};

// change rule
function changeRule(io, socket, village){
    return function(data){
        io.sockets.emit('ruleChanged', village.Rule);
    }
};

// start game
function startGame(io, socket, village){
    return function(data){
        //
        for(var userId in village.users){
            var userSocketId = village.users[userId].socketId;
            var userRole = village.users[userId].role;
            io.to(userSocketId).emit('startGame', {value : userRole});
        }

        // shift
        phase = village.shiftPhase(model.Phase.GamePhase.NIGHT)
        io.sockets.emit("phaseChange", {
            phase:     phase.gamePhase,
            dayCount:  phase.dayCount,
            timeCount: phase.secCount,
        });

        // timer (first night)
        console.log("start count: " + phase.secCount);
        setTimeout(() => {
            nPhase = village.shiftPhase(phase.nextPhase());
            io.sockets.emit("phaseChange", {
                phase:     nPhase.gamePhase,
                dayCount:  nPhase.dayCount,
                timeCount: nPhase.secCount,
            });
        }, phase.secCount*1000);
    }
};
