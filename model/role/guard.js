// exports
module.exports = Guard;

// imports
common = require('./common');
Role = require('./role');


// guard
Guard.Name = "guard";

function Guard(){
    var vil = Object.create(Guard.prototype);
    Object.assign(vil, Role(Guard.Name))

    return vil;
}

Guard.prototype = {
    team   : common.type.HUMAN,
    isWolf : false,

    fromSeer   : common.type.HUMAN,
    fromMedium : common.type.HUMAN,

    candidateCondition: ()=>{ return { alive: true }; },
}

// isGuard
Guard.isGuard = function(obj){
    return Role.isRole(obj, Guard.Name);
};

// Guard inherits Role
Object.setPrototypeOf(Guard.prototype, Role.prototype);
