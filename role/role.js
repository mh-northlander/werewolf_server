// exports
module.exports = Role;

// imports
common = require('./common');


// Role
function Role(type = "none"){
    var role = Object.create(Role.prototype);

    role.type = type;

    role.actionLog = [];

    return role;
}

Role.prototype = {
    team     : common.type.NONE,
    isWolf   : false,
    chatRoom : common.chat.personal,

    fromSeer   : common.type.NONE,
    fromMedium : common.type.NONE,

    candidateCondition: ()=>{ return {}; },
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
