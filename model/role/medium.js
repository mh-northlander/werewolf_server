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
    team   : common.HUMAN,
    isWolf : false,

    fromSeer   : common.HUMAN,
    fromMedium : common.HUMAN,
}

// isMedium
Medium.isMedium = function(obj){
    return Role.isRole(obj, Medium.Name);
};

// Medium inherits Role
Object.setPrototypeOf(Medium.prototype, Role.prototype);
