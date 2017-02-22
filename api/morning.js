// export
module.exports = {
    Begin: begin,
    End  : end,
};

// import
GamePhaseMorning = require('../village/phase').GamePhase.MORNING;
dayTime = require("./daytime");


// begin
function begin(io, socket, village){
    console.log("morning b");
    // shift phase
    phase = village.shiftPhase(GamePhaseMorning);
    io.sockets.emit("phaseChange", {
        phase:     phase.gamePhase,
        dayCount:  phase.dayCount,
        timeCount: phase.secCount,
    });

    // morning result
    result = village.evalAction();
    io.sockets.emit("actionResult", result);
};

// end
function end(io, socket, village){
    console.log("morning e");
    dayTime.Begin(io, socket, village);
};
