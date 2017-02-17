// exports
module.exports = Medium;

// imports
common = require('./common');
Role = require('./role');


// medium
Medium.Name = "medium";

function Medium(){
    var vil = Object.create(Medium.prototype);
    Object.assign(vil, Role(Medium.Name))

    return vil;
}

Medium.prototype = {
    team   : common.type.HUMAN,
    isWolf : false,

    fromSeer   : common.type.HUMAN,
    fromMedium : common.type.HUMAN,
}

// isMedium
Medium.isMedium = function(obj){
    return Role.isRole(obj, Medium.Name);
};

// Medium inherits Role
Object.setPrototypeOf(Medium.prototype, Role.prototype);
