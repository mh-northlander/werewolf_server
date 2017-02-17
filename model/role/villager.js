// exports
module.exports = Villager;

// imports
common = require('./common');
Role = require('./role');


// villager
Villager.Name = "villager";

function Villager(){
    var vil = Object.create(Villager.prototype);
    Object.assign(vil, Role(Villager.Name))

    return vil;
}

Villager.prototype = {
    team   : common.HUMAN,
    isWolf : false,

    fromSeer   : common.HUMAN,
    fromMedium : common.HUMAN,
}

// isVillager
Villager.isVillager = function(obj){
    return Role.isRole(obj, Villager.Name);
};

// Villager inherits Role
Object.setPrototypeOf(Villager.prototype, Role.prototype);
