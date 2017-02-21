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
        village.log.action[village.getUserIdFromSocketId(socket.id)] = act;
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
    morning.Begin(io, socket, village);
};
