// imports
consts = require('./constants');
Role = require('./role');

// exports
module.exports = Seer;

// seer
Seer.Name = "seer";

function Seer(){
    var vil = Object.create(Seer.prototype);
    Object.assign(vil, Role(Seer.Name))

    return vil;
}

Seer.prototype = {
    team       : consts.team.Human,
    fromSeer   : consts.fromSeer.Human,
    fromMedium : consts.fromSeer.Human,
}

// isSeer
Seer.isSeer = function(obj){
    return Role.isRole(obj, Seer.Name);
};

// Seer inherits Role
Object.setPrototypeOf(Seer.prototype, Role.prototype);
