"use strict";

// exports
module.exports = Medium;

// imports
const common = require('./common');
const Role = require('./role');


// medium
Medium.Name = "Medium";

function Medium(){
    let medium = Object.create(Medium.prototype);
    Object.assign(medium, Role(Medium.Name))

    medium.executedId = "";

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

        const fromMed = village.users.get(this.executedId).role.fromMedium;
        return {
            objectId : executedId,
            result   : fromMed===common.type.WEREWOLF ? fromMed : common.type.HUMAN,
        };
    },

    mountEvents: function(village){
        // log execute
        const oldExec = village.event_executed;
        village.event_executed = function(objectId, result={}){
            this.executedId = objectId;
            return oldExec.call(village, objectId, result);
        };
    },
}

// isMedium
Medium.isMedium = function(obj){
    return Role.isRole(obj, Medium.Name);
};

// Medium inherits Role
Object.setPrototypeOf(Medium.prototype, Role.prototype);
