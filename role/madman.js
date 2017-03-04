// exports
module.exports = Madman;

// imports
const common = require('./common');
const Role = require('./role');


// madman
Madman.Name = "Madman";

function Madman(){
    const madman = Object.create(Madman.prototype);
    Object.assign(madman, Role(Madman.Name))

    return madman;
}

Madman.prototype = {
    team       : common.type.WEREWOLF,
    species    : common.type.HUMAN,
    fromSeer   : common.type.HUMAN,
    fromMedium : common.type.HUMAN,
}

// isMadman
Madman.isMadman = function(obj){
    return Role.isRole(obj, Madman.Name);
};

// Madman inherits Role
Object.setPrototypeOf(Madman.prototype, Role.prototype);
