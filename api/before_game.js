"use strict";

// exports
module.exports = {
    JoinRoom : joinRoom,
    ExitRoom : exitRoom,

    ChangeName : changeName,
    ChangeRule : changeRule,

    StartGame : startGame,
};

// imports
const rule = require("../village/rule");
const GamePhaseBeforeGame = require("../village/phase").GamePhase.BEFOREGAME
const role = require("../role")
const night = require("./night")
const common = require("./common")

// join room
function joinRoom(io, socket, village){
    return function(data){
        if(common.IsValidPhase(io, socket, village, GamePhaseBeforeGame, "joinRoom") !== true){
            return
        }
        village.addUser(data.userId, socket.id, data.name);

        // list of {id,name}
        io.sockets.emit("memberChanged", village.listUsers());
    }
};

// exit room
function exitRoom(io, socket, village){
    return function(){
        if(common.IsValidPhase(io, socket, village, GamePhaseBeforeGame, "exitRoom") !== true){
            return
        }
        const userId = village.socketIdToUserId(socket.id)
        village.removeUser(userId);

        // list of {id,name}
        io.sockets.emit("memberChanged", village.listUsers());
    }
};

// change name
function changeName(io, socket, village){
    return function(ruleObj){
        if(common.IsValidPhase(io, socket, village, GamePhaseBeforeGame, "changeName") !== true){
            return
        }
        village.addUser(data.userId, socket.id, data.name);
        io.sockets.emit("memberChanged", village.listUsers());
    }
};

// change rule
function changeRule(io, socket, village){
    return function(ruleObj){
        if(common.IsValidPhase(io, socket, village, GamePhaseBeforeGame, "changeRule") !== true){
            return
        }
        village.updateRule(ruleObj);
        io.sockets.emit('ruleChanged', village.Rule.toJSON());
    }
};

// start game
function startGame(io,socket, village){
    return function(){
        if(common.IsValidPhase(io, socket, village, GamePhaseBeforeGame, "startGame") !== true){
            return
        }
        // set role
        village.rule.roleSet.set("Villager", village.users.size - village.rule.villageSize());
        let roleList = village.rule.suffledRoleList();
        let idx = 0;
        for(const [userId,user] of village.users){
            user.role = role[roleList[idx]]();
            user.role.mountEvents(village);

            io.to(user.socketId).emit("roleAck", user.role.type);

            idx++;
        }

        // set chat room
        for(const [userId,user] of village.users){
            if(user.role.chatType === role.common.chatType.PERSONAL){
                user.chatRoom = userId;
            } else if(user.role.chatType === role.common.chatType.GROUP){
                user.chatRoom = user.role.chatGroup;
            }

            io.sockets.sockets[user.socketId].join(user.chatRoom);
            io.to(user.socketId).emit("debug", "chat room:" + user.chatRoom);
        }

        // next phase
        night.Begin(io, village);
    }
};
