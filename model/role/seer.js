// exports
module.exports = Seer;

// imports
common = require('./common');
Role = require('./role');


// seer
Seer.Name = "seer";

function Seer(){
    var vil = Object.create(Seer.prototype);
    Object.assign(vil, Role(Seer.Name))

    return vil;
}

Seer.prototype = {
    team   : common.type.HUMAN,
    isWolf : false,

    fromSeer   : common.type.HUMAN,
    fromMedium : common.type.HUMAN,

    candidateCondition: ()=>{
        return {
            alive: true,
            except: this.actionLog.reduce((ret,val)=>{
                ret.push(val.userId);
                return ret;
            }, []),
        };
    },
}

// isSeer
Seer.isSeer = function(obj){
    return Role.isRole(obj, Seer.Name);
};

// Seer inherits Role
Object.setPrototypeOf(Seer.prototype, Role.prototype);
