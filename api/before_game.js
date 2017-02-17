// exports
module.exports = {
    JoinRoom: joinRoom,
    ExitRoom: exitRoom,
    ChangeRule:changeRule,
    StartGame: startGame,
};

// imports
model = require('../model/');
night = require("./night")

// join room
function joinRoom(io, socket, village){
    return function(data){
        village.addUser(data.userId, socket.id, data.name);
        io.sockets.emit("memberChanged",
                        Object.keys(village.users).reduce((ret,key)=>{
                            ret.push(village.users[key].name);
                            return ret
                        }, []));
    }
};

// exit room
function exitRoom(io, socket, village){
    return function(data){
        village.removeUser(data.userId);
        io.sockets.emit("memberChanged",
                        Object.keys(village.users).reduce((ret,key)=>{
                            ret.push(village.users[key].name);
                            return ret
                        }, []));
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
function startGame(io, socket, village){
    return function(data){
        // set role : TODO
        for(var userId in village.users){
            var userSocketId = village.users[userId].socketId;
            var userRole = village.users[userId].role;
            io.to(userSocketId).emit('roleAck', userRole.type);
        }

        // shift to first night
        phase = village.shiftPhase(model.Phase.GamePhase.NIGHT)
        io.sockets.emit("phaseChange", {
            phase:     phase.gamePhase,
            dayCount:  phase.dayCount,
            timeCount: phase.secCount,
        });

        // inform
        night.NightProcess(io, socket, village);
    }
};
