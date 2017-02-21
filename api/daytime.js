// export
module.exports = {
    Begin: begin,
    End  : end,
};

// import
GamePhaseDaytime = require('../village/phase').GamePhase.DAYTIME;
afternoon = require("./afternoon");


//// listen


//// emit
// begin
function begin(io, socket, village){
    // shift phase
    phase = village.shiftPhase(GamePhaseDaytime);
    io.sockets.emit("phaseChange", {
        phase:     phase.gamePhase,
        dayCount:  phase.dayCount,
        timeCount: phase.secCount,
    });

    //

};

// end
function end(io, socket, village){
    afternoon.Begin(io, socket, village);
};
