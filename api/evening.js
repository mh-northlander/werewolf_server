// export
module.exports = {
    Begin: begin,
    End  : end,
};


// import
const GamePhaseEvening = require('../village/phase').GamePhase.EVENING;
const night = require('./night');

// eveningResult

//// emit
// begin
function begin(io, village){
    console.log("evening begin");
    // shift phase
    const phase = village.shiftPhase(GamePhaseEvening);
    io.sockets.emit("phaseChanged", {
        phase:     phase.gamePhase,
        dayCount:  phase.dayCount,
        timeCount: phase.secCount,
    });

    // evening result
    io.sockets.emit("voteResult", village.evalVote());
};

// end
function end(io, village){
    console.log("evening end");
    night.Begin(io, village);
};
