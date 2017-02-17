// exports
module.exports = Role;

// imports
common = require('./common');


// Role
function Role(type = "none"){
    var role = Object.create(Role.prototype);

    role.type = type;

    role.chatLog = [];
    role.actionLog = [];

    return role;
}

Role.prototype = {
    team   : common.NONE,
    isWolf : false,

    fromSeer   : common.NONE,
    fromMedium : common.NONE,

    candidateCondition: ()=>{ return {}; },

    Chat : function(message){
        this.chatLog.push(message);
    },
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
