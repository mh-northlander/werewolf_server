// imports

// exports
module.exports = Phase;

// const
const dayTime = 7;
const nightTime = 7;

// info, talk, vote, act
const gamePhaseList = ["before", "during", "after"];
const dayPhaseList = ["morning", "afternoon", "evening", "night"];

// Phase
function Phase(){
    var phase = Object.create(Phase.prototype);

    phase.phase = "before";
    phase.phaseId = -1;

    phase.dayCount = 0;
    phase.secCount = -1;

    return phase;
}

Phase.prototype = {
    phaseShift : function(){
        // phase
        if(this.phase == "before"){
            this.phase = "during";
            this.phaseId = 0;
        } else {
            this.phaseId = (this.phaseId+1) % 4;
        }

        // day count
        if(this.phaseId == 0){
            this.dayCount += 1;
        }

        // sec count
        if(this.phaseId == 1){
            this.secCount = dayTime;
        } else if(this.phaseId == 3){
            this.secCount = nightTime;
        } else {
            this.secCount = -1;
        }
    },

    dayPhaseName : function(){
        return dayPhaseList[this.phaseId];
    }
};

Phase.isPhase = function(obj,type){
    if(!Phase.prototype.isPrototypeOf(obj)){
        return false;
    }
    return type ? obj.type === type : true;
};
