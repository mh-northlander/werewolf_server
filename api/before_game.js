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
const phase = require("../village/phase")
const role = require("../role")
const night = require("./night")

// join room
function joinRoom(io, socket, village){
    return function(data){
        if(phaseCheck(io, socket, village)){
            village.addUser(data.userId, socket.id, data.name);

            // list of {id,name}
            io.sockets.emit("memberChanged", village.listUsers());
        }
    }
};

// exit room
function exitRoom(io, socket, village){
    return function(){
        if(phaseCheck(io, socket, village)){}
        const userId = village.socketIdToUserId(socket.id)
        village.removeUser(userId);

        // list of {id,name}
        io.sockets.emit("memberChanged", village.listUsers());
    }
};

// change name
function changeName(io, socket, village){
    return function(ruleObj){
        village.addUser(data.userId, socket.id, data.name);
        io.sockets.emit("memberChanged", village.listUsers());
    }
};

// change rule
function changeRule(io, socket, village){
    return function(ruleObj){
        village.updateRule(ruleObj);
        io.sockets.emit('ruleChanged', village.Rule.toJSON());
    }
};


// start game
function startGame(io, village){
    return function(){
        // set role
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
            io.to(user.chatRoom).emit("debug", "chat room:" + user.chatRoom);
        }

        // next phase
        night.Begin(io, village);
    }
};

function phaseCheck(io, socket, village, eventName){
    if(village.phase.gamePhase === phase.GamePhase.BEFOREGAME){
        return true
    } else {
        console.log("badRequest: ");
        io.to(socket.id).emit("error", {statusCode:400, message:"badRequest"})
        return false
    }
}
