// export
module.exports = {
    Vote : vote,

    Begin: begin,
    End  : end,
};

// imports
GamePhaseAfternoon = require('../village/phase').GamePhase.AFTERNOON;
common = require('./common');
evening = require('./evening');


// vate
function vote(io, socket, village){
    return function(vote){
        // vote: {userId:[]}
        userId = village.socketIdToUserId(socket.id);
        village.addVote(userId, vote);

        // check
        common.ReadyToShift(io,socket,village)();
    };
};

//// emit
// begin
function begin(io, socket, village){
    console.log("afternoon b");
    // shift phase
    phase = village.shiftPhase(GamePhaseAfternoon);
    io.sockets.emit("phaseChange", {
        phase:     phase.gamePhase,
        dayCount:  phase.dayCount,
        timeCount: phase.secCount,
    });

    //
};

// end
function end(io, socket, village){
    console.log("afternoon e");
    evening.Begin(io, socket, village);
};
