// imports

// exports
module.exports = Phase;

// Phase
function Phase(){
    var phase = Object.create(Phase.prototype);

    phase.phase = "before_game";
    phase.dayCount = 0;
    phase.secCount = -1;

    return phase;
}

Phase.prototype = {
    phaseShift : function(sec){

    },
};

Phase.isPhase = function(obj,type){
    if(!Phase.prototype.isPrototypeOf(obj)){
        return false;
    }
    return type ? obj.type === type : true;
};
