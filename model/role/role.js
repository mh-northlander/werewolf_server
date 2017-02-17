// exports
module.exports = Role;

// imports
consts = require('./constants');


// Role
function Role(type = "none"){
    var role = Object.create(Role.prototype);

    role.type = type;

    role.actionLog = [];

    return role;
}

Role.prototype = {
    team       : consts.team.None,
    fromSeer   : consts.fromSeer.None,
    fromMedium : consts.fromSeer.None,
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
