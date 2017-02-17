module.exports = {
    Action: action,
    Chat: chat,

    NightProcess: nightProcess,
};

// import
model = require('./../model');

//// listen
// action
function action(io, socket, village){
    return function(act){

    };
};

// chat
function chat(io, socket, village){
    return function(message){

    };
};


//// emit
// night
function nightProcess(io, socket, village){
    actionCandidates(io, socket, village);

    // timer
    console.log("start count: " + phase.secCount);
    setTimeout(() => {
        nPhase = village.shiftPhase(model.Phase.GamePhase.MORNING);
        io.sockets.emit("phaseChange", {
            phase:     nPhase.gamePhase,
            dayCount:  nPhase.dayCount,
            timeCount: nPhase.secCount,
        });
    }, phase.secCount*1000);
};

// action candidate
function actionCandidates(io, socket, village){
    for(var userId in village.users){
        io.emit("antionCandidates", village.listActionCandidates(userId));
    }
};
