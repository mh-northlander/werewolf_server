// imports
consts = require('./constants');
Role = require('./role');

// exports
module.exports = Villager;

// villager
Villager.Name = "villager";

function Villager(){
    var vil = Object.create(Villager.prototype);
    Object.assign(vil, Role(Villager.Name))

    return vil;
}

Villager.prototype = {
    team       : consts.team.Human,
    fromSeer   : consts.fromSeer.Human,
    fromMedium : consts.fromSeer.Human,
}

// isVillager
Villager.isVillager = function(obj){
    return Role.isRole(obj, Villager.Name);
};

// Villager inherits Role
Object.setPrototypeOf(Villager.prototype, Role.prototype);
