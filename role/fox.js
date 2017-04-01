// exports
module.exports = Fox;

// imports
const common = require('./common');
const Role = require('./role');


// fox
Fox.Name = "Fox";

function Fox(){
    const fox = Object.create(Fox.prototype);
    Object.assign(fox, Role(Fox.Name))

    return fox;
}

Fox.prototype = {
    team       : common.type.FOX,
    species    : common.type.OTHER,
    fromSeer   : common.type.HUMAN,
    fromMedium : common.type.HUMAN,

    mountEvents: function(village){
        // die when saw
        const oldSaw = village.event_saw;
        village.event_saw = function(subjectId, objectId, result={}){
            if(Fox.isFox(village.users.get(objectId).role)){
                if(!result.deadIds){ result.deadIds = []; }
                result.deadIds.push(objectId);

                result = village.event_died(objectId, result);
            }
            return oldSaw(objectId, result);
        };

        // won't die when bited
        const oldBited = village.event_bited;
        village.event_bited = function(subjectId, objectId, success, result={}){
            if(Fox.isFox(village.users.get(objectId).role)){
                return oldBited(subjectId, objectId, false, result);
            }
            return oldBited(subjectId, objectId, success, result);
        };
    },
}

// isFox
Fox.isFox = function(obj){
    return Role.isRole(obj, Fox.Name);
};

// Fox inherits Role
Object.setPrototypeOf(Fox.prototype, Role.prototype);
