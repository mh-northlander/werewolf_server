// export
module.exports = {
    Begin: begin,
    End  : end,
};

// import
const GamePhaseDaytime = require('../village/phase').GamePhase.DAYTIME;
const afternoon = require("./afternoon");


// begin
function begin(io, village){
    console.log("daytime begin");
    // shift phase
    const phase = village.shiftPhase(GamePhaseDaytime);
    io.sockets.emit("phaseChanged", {
        phase:     phase.gamePhase,
        dayCount:  phase.dayCount,
        timeCount: phase.secCount,
    });

    // timer
    console.log("start count: " + phase.secCount);
    setTimeout(() => { end(io, village); }, phase.secCount*1000);
};

// end
function end(io, village){
    console.log("daytime end");
    afternoon.Begin(io, village);
};
