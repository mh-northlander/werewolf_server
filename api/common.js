// exports
module.exports = {
    ReadyToShift: readyToShift,
    PhaseShift: phaseShift,
};

// imports

// readyToShift
function readyToShift(io, socket, village) {
    return function(data){

    };
};

// for debug >>>>
function phaseShift(io, socket, village){
    return function(){
        phase = village.shiftPhase(village.phase.nextPhase());
        io.sockets.emit("phaseChange", {
            phase:     phase.gamePhase,
            dayCount:  phase.dayCount,
            timeCount: phase.secCount,
        });

        if(village.phase.secCount > 0){
            console.log("start count: " + phase.secCount);
            setTimeout(() => {
                nPhase = village.shiftPhase(phase.nextPhase());
                io.sockets.emit("phaseChange", {
                    phase:     nPhase.gamePhase,
                    dayCount:  nPhase.dayCount,
                    timeCount: nPhase.secCount,
                });
            }, phase.secCount*1000);
        }
    }
};
// <<<< for debug
