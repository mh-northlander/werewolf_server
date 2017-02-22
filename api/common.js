// exports
module.exports = {
    ReadyToShift: readyToShift,
    PhaseShift: phaseShift,
};

// imports
GamePhase = require("../village/phase").GamePhase;
morning = require("./morning");
daytime = require("./daytime");
afternoon = require("./afternoon");
evening = require("./evening");


// readyToShift
function readyToShift(io, socket, village) {
    return function(){
        userId = village.socketIdToUserId(socket.id)
        village.users[userId].readyToShift = true;

        console.log(village.users[userId].name + " is ready");

        if(village.readyToShift()){
            switch(village.phase.gamePhase){
            case GamePhase.MORNING:
                morning.End(io, socket, village);
                break;
            case GamePhase.DAYTIME:
                daytime.End(io, socket, village);
                break;
            case GamePhase.AFTERNOON:
                afternoon.End(io, socket, village);
                break;
            case GamePhase.EVENING:
                evening.End(io, socket, village);
                break;
            default:
                console.log("error: readyToShift");
                break;
            }
        }
    }
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
