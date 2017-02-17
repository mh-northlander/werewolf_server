// exports
module.exports = {
    ReadyToShift: readyToShift,
    PhaseShift: phaseShift,
};

// imports
// model = require('./../model');

// readyToShift
function readyToShift(io,village) {
    return function(data){

    };
};

// for debug >>>>
function phaseShift(io, village){
    return function(){
        console.log("shift..");
        village.phase.phaseShift(village.phase.nextPhase());
        io.emit('phaseShiftTest', {name : village.phase.gamePhase});

        if(village.phase.secCount > 0){
            console.log("start count" + village.phase.secCount);
            setTimeout(() => {
                phaseShift(io, village)();
            }, village.phase.secCount*1000);
        }
    }
};
// <<<< for debug
