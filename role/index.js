exports.common = require('./common');

// role class factories
exports.Role     = require('./role');

exports.Villager = require('./villager');
exports.Werewolf = require('./werewolf');
exports.Seer     = require('./seer');
exports.Guard    = require('./guard');
exports.Medium   = require('./medium');
exports.Madman   = require('./madman');
exports.Fox      = require('./fox');

// role set
const roleNameList = [
    "Villager",
    "Werewolf",
    "Seer",
    "Guard",
    "Medium",
    "Madman",
    "Fox",
];
exports.roleNameList = roleNameList;

exports.defaultRoleSet = function(){
    let ret = new Map();
    for(const name of roleNameList){
        ret.set(name, 0)
    }

    ret.set("Werewolf", 2);
    ret.set("Seer",     1);
    ret.set("Guard",    1);
    ret.set("Medium",   1);
    ret.set("Madman",   1);
    ret.set("Fox",      1);
    // ret.set("Villager", 1);

    return ret
}
