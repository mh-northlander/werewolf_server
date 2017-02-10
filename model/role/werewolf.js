// exports
module.exports = Werewolf;

// imports
consts = require('./constants');
Role = require('./role');


// werewolf
Werewolf.Name = "werewolf";

function Werewolf(){
    var vil = Object.create(Werewolf.prototype);
    Object.assign(vil, Role(Werewolf.Name))

    return vil;
}

Werewolf.prototype = {
    team       : consts.team.Werewolf,
    fromSeer   : consts.fromSeer.Werewolf,
    fromMedium : consts.fromSeer.Werewolf,
}

// isWerewolf
Werewolf.isWerewolf = function(obj){
    return Role.isRole(obj, Werewolf.Name);
};

// Werewolf inherits Role
Object.setPrototypeOf(Werewolf.prototype, Role.prototype);
