module.exports = {
    Action: action,
    Chat: chat,

    Begin: begin,
    End  : end,
};

// import
GamePhaseNight = require('../village/phase').GamePhase.NIGHT;
morning = require("./morning");

//// listen
// action
function action(io, socket, village){
    return function(act){
        userId = village.socketIdToUserId(socket.id);
        resp = village.addAction(userId, act);
        io.to(village.users[userId].chatRoom).emit("actionResult", resp);
    };
};

// chat
function chat(io, socket, village){
    return function(message){
        // TODO
    };
};


//// emit
// begin
function begin(io, socket, village){
    console.log("night b");
    // shift
    phase = village.shiftPhase(GamePhaseNight);
    io.sockets.emit("phaseChange", {
        phase:     phase.gamePhase,
        dayCount:  phase.dayCount,
        timeCount: phase.secCount,
    });

    // action candidates
    for(var userId in village.users){
        socket.emit("antionCandidates", village.listActionCandidates(userId));
    }

    // timer
    console.log("start count: " + phase.secCount);
    setTimeout(() => {
        end(io, socket, village);
    }, phase.secCount*1000);
};

// end
function end(io, socket, village){
    console.log("night e");
    // TODO 未決定行動のランダム決定
    morning.Begin(io, socket, village);
};
