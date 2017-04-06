"use strict";

// exports
module.exports = Seer;

// imports
const common = require('./common');
const Role = require('./role');
const Fox = require("./fox");

// seer
Seer.Name = "Seer";

function Seer(){
    const seer = Object.create(Seer.prototype);
    Object.assign(seer, Role(Seer.Name))

    seer.log = [];

    return seer;
}

Seer.prototype = {
    team       : common.type.HUMAN,
    species    : common.type.HUMAN,
    fromSeer   : common.type.HUMAN,
    fromMedium : common.type.HUMAN,

    actionCandidates: function(village, selfId){
                // first night
        if(village.phase.dayCount === 0){
            console.log("first night see");
            switch(village.rule.firstNightSee){
            case Seer.firstNightSee.None:
            case Seer.firstNightSee.Given:  return [];
            case Seer.firstNightSee.Choice: break;
            default:
                console.log("error: invalid first night seer");
            }
        }

        return village.listUserIdsWithCondition({
            alive  : true,
            except : this.log.reduce((ret,userId)=>{
                ret.push(userId);
                return ret
            }, [selfId])
        });
    },

    actionResult: function(village, selfId){
        // only first night && firstNightGiven
        if(village.phase.dayCount !== 0){ return {}; }
        if(village.rule.firstNightSee !== Seer.firstNightSee.Given){ return {}; }

        const cIds = village.listUserIdsWithCondition({
            alive  : true,
            except : [selfId],
            exceptFunc : user => {
                return (user.role.fromSeer === common.type.WEREWOLF) || (Fox.isFox(user.role));
            },
        });
        const cId = cIds[Math.floor(Math.random() * cIds.length)];

        return this.evalActionNight(village, selfId, { type: "see", userId: cId });
    },

    evalActionNight: function(village, selfId, act){
        console.log("seer");

        // act: { type:"see", userId }
        // log
        this.log.push(act.userId);

        if(!village.actionMap.has("see")){ village.actionMap.set("see", []); }
        village.actionMap.get("see").push({
            subjectId : selfId,
            objectId  : act.userId,
        });

        const fromSeer = village.users.get(act.userId).role.fromSeer;
        return {
            objectId : act.userId,
            type     : fromSeer===common.type.WEREWOLF ? fromSeer : common.type.HUMAN,
        };
    },
}

//
Seer.firstNightSee = {
    None   : "firstNightSee_none",
    Choice : "firstNightSee_choice",
    Given  : "firstNightSee_given",
};

// isSeer
Seer.isSeer = function(obj){
    return Role.isRole(obj, Seer.Name);
};

// Seer inherits Role
Object.setPrototypeOf(Seer.prototype, Role.prototype);
