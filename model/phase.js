// exports
module.exports = Phase;

// imports

// const
const DefaultDayTime = 7;   // sec
const DefaultNightTime = 7; // sec

const GamePhase = {
    BEFORE    : "before",     // setting
    FNIGHT    : "firstNight",
    MORNING   : "morning",
    AFTERNOON : "afternoon",  // talk
    EVENING   : "evening",    // vote
    NIGHT     : "night",      // action
    AFTER     : "after",      // game end
};

// Phase
function Phase(){
    var phase = Object.create(Phase.prototype);

    phase.gamePhase = GamePhase.BEFORE;

    phase.dayCount = 0;
    phase.secCount = -1; // existing time of current phase (night and afternoon)

    return phase;
}

Phase.prototype = {
    nextPhase : function(){
        switch(this.gamePhase){
        case GamePhase.BEFORE:
            return GamePhase.FNIGHT;
            break;
        case GamePhase.FNIGHT:
            return GamePhase.MORNING;
            break;
        case GamePhase.MORNING:
            return GamePhase.AFTERNOON;
            break;
        case GamePhase.AFTERNOON:
            return GamePhase.EVENING;
            break;
        case GamePhase.EVENING:
            return GamePhase.NIGHT;
            break;
        case GamePhase.NIGHT:
            return GamePhase.MORNING;
            break;
        default:
        }
    },

    phaseShift : function(nextP, dayTime, nightTime){
        // phase shift
        this.gamePhase = nextP;

        // day count
        if(nextP == GamePhase.MORNING){
            this.dayCount += 1;
        }

        // set sec count
        if(nextP == GamePhase.NIGHT){
            this.secCount = dayTime ? dayTime : DefaultNightTime;
        } else if (nextP == GamePhase.AFTERNOON){
            this.secCount = nightTime ? nightTime : DefaultDayTime;
        } else {
            this.secCount = -1;
        }
    },
};

Phase.isPhase = function(obj,type){
    if(!Phase.prototype.isPrototypeOf(obj)){
        return false;
    }
    return type ? obj.type === type : true;
};
