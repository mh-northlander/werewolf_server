// export
module.exports = {
    Begin: begin,
    End  : end,
};

// import
const GamePhaseMorning = require('../village/phase').GamePhase.MORNING;
const dayTime = require("./daytime");


// begin
function begin(io, village){
    console.log("morning begin");
    // shift phase
    const phase = village.shiftPhase(GamePhaseMorning);
    io.sockets.emit("phaseChanged", {
        phase:     phase.gamePhase,
        dayCount:  phase.dayCount,
        timeCount: phase.secCount,
    });

    // morning result
    io.sockets.emit("actionResult", village.evalActionMorning());
};

// end
function end(io, village){
    console.log("morning end");
    dayTime.Begin(io, village);
};
