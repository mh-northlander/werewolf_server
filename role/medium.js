// exports
module.exports = Medium;

// imports
const common = require('./common');
const Role = require('./role');


// medium
Medium.Name = "Medium";

function Medium(){
    const medium = Object.create(Medium.prototype);
    Object.assign(medium, Role(Medium.Name))

    return medium;
}

Medium.prototype = {
    team       : common.type.HUMAN,
    species    : common.type.HUMAN,
    fromSeer   : common.type.HUMAN,
    fromMedium : common.type.HUMAN,

    actionResult: function(village, selfId){
        // first night
        if(village.phase.dayCount === 0){ return {}; }

        return {}; // TODO: vote log

        const objectId  = village.log[village.phase.dayCount].execution.executedId;
        const fromMed = village.users.get(objectId).role.fromMedium;
        return {
            objectId : objectId,
            result   : fromMed===common.type.WEREWOLF ? fromMed : common.type.HUMAN,
        };
    },
}

// isMedium
Medium.isMedium = function(obj){
    return Role.isRole(obj, Medium.Name);
};

// Medium inherits Role
Object.setPrototypeOf(Medium.prototype, Role.prototype);
