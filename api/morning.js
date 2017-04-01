// export
module.exports = {
    MorningResultChecked: morningResultChecked,

    Begin: begin,
    End  : end,
};

// import
const GamePhaseMorning = require('../village/phase').GamePhase.MORNING;
const dayTime = require("./daytime");
const after_game = require("./after_game");


// morningResultChecked
function morningResultChecked(io, socket, village){
    return function(){
        const userId = village.socketIdToUserId(socket.id);
        const user = village.users.get(userId);
        user.readyToShift = true;

        console.log("morning result checked: " + user.name);
        if(village.readyToShift()){
            end(io, village);
        }
    };
}

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
    io.sockets.emit("morningResult", village.evalActionMorning());

    if(village.isGameFinished()){
        after_game.Begin(io, village);
    }
};

// end
function end(io, village){
    console.log("morning end");
    dayTime.Begin(io, village);
};
