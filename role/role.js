"use strict";

// exports
module.exports = Role;

// imports
const common = require('./common');


// Role
Role.Name = "Role"
function Role(type = Role.Name){
    const role = Object.create(Role.prototype);

    role.type = type;

    return role;
}

Role.prototype = {
    // team represents how to win. (human / werewolf / fox / lover(TODO) / other)
    team : common.type.NONE,

    // speacies represents head count for game-end check. (human / werewolf/ other)
    // only (villager / werewolf) will be counted (other type will be ignored)
    species : common.type.NONE,

    // fromSeer represents how ze looks from seers. (human / werewolf / other)
    fromSeer : common.type.NONE,

    // fromMedium represents how ze looks from mediums. (human / werewolf / other)
    fromMedium : common.type.NONE,

    // chatType represents which chat room ze will join
    // chatGroup will be used only if chatType === GROUP
    chatType  : common.chatType.PERSONAL,
    chatGroup : "none",

    // actionCandidates returns option-list for a night action.
    // type: (village, selfId) => [userId].
    // return [] to do nothing
    actionCandidates: (village, selfId) => { return []; },

    // actionResult returns result for definite action.
    // type: (village, selfId) => result { subjectId, objectId, type, .. }.
    // return {} to do nothing
    actionResult: (village, selfId) => { return {}; },

    // evalActionNight returns result of action and/or stack it until morning
    // return {} to do nothing in the night (stacking still work)
    evalActionNight: (village, userId, act) => { return {}; },

    // mountEvents mounts event functions
    mountEvents: function(village){},

    // hasWon returns whether ze has won this game, assuming game has already finished.
    // implement this if team===other
    hasWon: (village, selfId, winTeam) => { return winTeam === this.team; },
};

/* memo
   var vil = Villager() // inherits Role, then:
   Role.isRole(vil)     // returns true
*/
Role.isRole = function(obj,type){
    if(!Role.prototype.isPrototypeOf(obj)){
        return false;
    }
    return type ? obj.type === type : true;
};
