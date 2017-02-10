// exports
module.exports = Guard;

// imports
consts = require('./constants');
Role = require('./role');


// guard
Guard.Name = "guard";

function Guard(){
    var vil = Object.create(Guard.prototype);
    Object.assign(vil, Role(Guard.Name))

    return vil;
}

Guard.prototype = {
    team       : consts.team.Human,
    fromSeer   : consts.fromSeer.Human,
    fromMedium : consts.fromSeer.Human,
}

// isGuard
Guard.isGuard = function(obj){
    return Role.isRole(obj, Guard.Name);
};

// Guard inherits Role
Object.setPrototypeOf(Guard.prototype, Role.prototype);
