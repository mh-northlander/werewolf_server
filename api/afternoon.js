// export
module.exports = {
    Vote : vote,

    Begin: begin,
    End  : end,
};

// imports
const GamePhaseAfternoon = require('../village/phase').GamePhase.AFTERNOON;
const shared = require('./shared');
const evening = require('./evening');


// vate
function vote(io, socket, village){
    return function(vote){
        // vote: [userId]
        console.log(village.users.get(village.socketIdToUserId(socket.id)).name +
                    " votes to " + village.users.get(vote[0]).name);

        const userId = village.socketIdToUserId(socket.id);
        if(!village.users.get(userId).readyToShift){
            village.addVote(userId, vote);
        }

        // check
        shared.ReadyToShift(io,socket,village)();
    };
};

// begin
function begin(io, village){
    console.log("afternoon begin");
    // shift phase
    const phase = village.shiftPhase(GamePhaseAfternoon);
    io.sockets.emit("phaseChanged", {
        phase:     phase.gamePhase,
        dayCount:  phase.dayCount,
        timeCount: phase.secCount,
    });

    // vote candidate
    for(const [id,user] of village.users){
        const candidates = village.voteCandidates(id);
        io.to(village.userIdToSocketId(id)).emit("voteCandidates", candidates);
    }
};

// end
function end(io, village){
    console.log("afternoon end");
    evening.Begin(io, village);
};
