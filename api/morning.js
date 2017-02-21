// export
module.exports = {
    MorningResultChecked: morningResultChecked,

    Begin: begin,
    End  : end,
};

// import
GamePhaseMorning = require('../village/phase').GamePhase.MORNING;
dayTime = require("./daytime");


//// listen
// morningResultChecked
function morningResultChecked(io, socket, village){
    return function(userId){
        village.users[userId].actionDone = True;
        village.finishPhase(io)
    }
};


//// emit
// begin
function begin(io, socket, village){
    // shift phase
    phase = village.shiftPhase(GamePhaseMorning);
    io.sockets.emit("phaseChange", {
        phase:     phase.gamePhase,
        dayCount:  phase.dayCount,
        timeCount: phase.secCount,
    });

    // morning result

};

// end
function end(io, socket, village){
    dayTime.Begin(io, socket, village);
};
