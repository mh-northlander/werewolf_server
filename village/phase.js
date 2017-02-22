// exports
module.exports = Phase;

// imports

// const
const DefaultDayTime = 7;   // sec
const DefaultNightTime = 7; // sec

const GamePhase = {
    BEFORE    : "before",     // setting
    NIGHT     : "night",      // action
    MORNING   : "morning",    // action result
    DAYTIME   : "daytime",    // talk
    AFTERNOON : "afternoon",  // vote
    EVENING   : "evening",    // vote result
    AFTER     : "after",      // game end
};
Phase.GamePhase = GamePhase

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
            return GamePhase.NIGHT;
            break;
        case GamePhase.NIGHT:
            return GamePhase.MORNING;
            break;
        case GamePhase.MORNING:
            return GamePhase.DAYTIME;
            break;
        case GamePhase.DAYTIME:
            return GamePhase.AFTERNOON;
            break;
        case GamePhase.AFTERNOON:
            return GamePhase.EVENING;
            break;
        case GamePhase.EVENING:
            return GamePhase.NIGHT;
            break;
        default:
        }
    },

    phaseShift : function(nextPhase, dayTime, nightTime){
        // phase shift
        this.gamePhase = nextPhase;

        // day count
        if(nextPhase == GamePhase.MORNING){
            this.dayCount += 1;
        }

        // set sec count
        switch(nextPhase){
        case GamePhase.NIGHT:
            this.secCount = nightTime ? nightTime : DefaultNightTime;
            break;
        case GamePhase.DAYTIME:
            this.secCount = dayTime ? dayTime : DefaultDayTime;
            break;
        default:
            this.secCount = -1;
            break;
        }
    },
};

Phase.isPhase = function(obj,type){
    if(!Phase.prototype.isPrototypeOf(obj)){
        return false;
    }
    return type ? obj.type === type : true;
};
