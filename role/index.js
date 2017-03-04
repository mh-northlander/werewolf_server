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

exports.defaultRoleSet = function(num){
    let ret = new Map();
    for(const name of roleNameList){
        ret.set(name, 0)
    }

    ret.set("Seer", 1);
    ret.set("Werewolf", Math.floor((num+3)/8)+1);
    ret.set("Guard",  num > 4 ? 1 : 0);
    ret.set("Medium", num > 6 ? 1 : 0);
    ret.set("Madman", num > 8 ? 1 : 0);

    let c = 0;
    ret.forEach(v => c+=v);
    ret.set("Villager", c);

    return ret
}
