// export
module.exports = {
    Begin: begin,
    End  : end,
};


// import
GamePhaseEvening = require('../village/phase').GamePhase.EVENING;
night = require('./night');

// eveningResult

//// emit
// begin
function begin(io, socket, village){
    // shift phase
    phase = village.shiftPhase(GamePhaseEvening);
    io.sockets.emit("phaseChange", {
        phase:     phase.gamePhase,
        dayCount:  phase.dayCount,
        timeCount: phase.secCount,
    });

    //

};

// end
function end(io, socket, village){
    night.Begin(io, socket, village);
};
