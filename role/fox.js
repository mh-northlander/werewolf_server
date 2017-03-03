// exports
module.exports = Fox;

// imports
common = require('./common');
Role = require('./role');


// fox
Fox.Name = "Fox";

function Fox(){
    var fox = Object.create(Fox.prototype);
    Object.assign(fox, Role(Fox.Name))

    return fox;
}

Fox.prototype = {
    team       : common.type.OTHER,
    species    : common.type.OTHER,
    fromSeer   : common.type.HUMAN,
    fromMedium : common.type.HUMAN,

    mountEvents: function(village){
        // die when saw
        oldSaw = village.event_saw;
        village.event_saw = function(subjectId, objectId, result={}){
            if(Fox.isFox(village.users.get(objectId).role)){
                if(!result.deadIds){ result.deadIds = []; }
                result.deadIds.push(objectId);

                let res = village.event_died(objectId, result);
            }
            return oldSaw(objectId, res);
        };

        // won't die when bited
        oldBited = village.event_bited;
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
