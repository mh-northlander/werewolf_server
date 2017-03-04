// exports
module.exports = {
    ReadyToShift: readyToShift,
};

// imports
const GamePhase = require("../village/phase").GamePhase;
const before_game = require("./before_game");
const morning   = require("./morning");
const daytime   = require("./daytime");
const afternoon = require("./afternoon");
const evening   = require("./evening");


// readyToShift
function readyToShift(io, socket, village) {
    return function(){
        const userId = village.socketIdToUserId(socket.id)
        village.users.get(userId).readyToShift = true;

        console.log(village.users.get(userId).name + " is ready");

        if(village.readyToShift()){
            switch(village.phase.gamePhase){
            case GamePhase.BEFOREGAME:
                before_game.StartGame(io, village)();
                break;
            case GamePhase.MORNING:
                morning.End(io, village);
                break;
            case GamePhase.DAYTIME:
                daytime.End(io, village);
                break;
            case GamePhase.AFTERNOON:
                afternoon.End(io, village);
                break;
            case GamePhase.EVENING:
                evening.End(io, village);
                break;
            default:
                console.log("error: readyToShift with phase " + village.phase.gamePhase);
                break;
            }
        }
    }
};
