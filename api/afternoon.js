// export
module.exports = {
    Begin: begin,
    End  : end,
};

// imports
// model = require('./../model');
evening = require('./evening');


// vate
module.exports.Vote = function(io,village){
    return function(data){

    };
};

//// emit
// begin
function begin(io, socket, village){
    // shift phase
    phase = village.shiftPhase(model.Phase.GamePhase.AFTERNOON);
    io.sockets.emit("phaseChange", {
        phase:     phase.gamePhase,
        dayCount:  phase.dayCount,
        timeCount: phase.secCount,
    });

    //

};

// end
function end(io, socket, village){
    evening.Begin(io, socket, village);
};
