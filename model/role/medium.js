// imports
consts = require('./constants');
Role = require('./role');

// exports
module.exports = Medium;

// medium
Medium.Name = "medium";

function Medium(){
    var vil = Object.create(Medium.prototype);
    Object.assign(vil, Role(Medium.Name))

    return vil;
}

Medium.prototype = {
    team       : consts.team.Human,
    fromSeer   : consts.fromSeer.Human,
    fromMedium : consts.fromSeer.Human,
}

// isMedium
Medium.isMedium = function(obj){
    return Role.isRole(obj, Medium.Name);
};

// Medium inherits Role
Object.setPrototypeOf(Medium.prototype, Role.prototype);
