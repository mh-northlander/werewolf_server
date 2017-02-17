// exports
module.exports = Seer;

// imports
consts = require('./constants');
Role = require('./role');


// seer
Seer.Name = "seer";

function Seer(){
    var vil = Object.create(Seer.prototype);
    Object.assign(vil, Role(Seer.Name))

    return vil;
}

Seer.prototype = {
    team       : consts.team.Human,
    fromSeer   : consts.fromSeer.Human,
    fromMedium : consts.fromSeer.Human,
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
