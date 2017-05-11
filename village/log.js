"use strict";

// exports
module.exports = Log;

// imports


// Log
function Log(){
    const log = Object.create(Log.prototype);

    // [{ dayCount, chatRoom, userId, message }]
    log.chat = [];

    // [{ vote, action, morningDeads, eveningDeads }]
    log.day = [];
    log.day[0] = {
        vote  : new Map(), // vote   : { sbjId -> [objId] }
        action: new Map(), // action : { sbjId -> { type, objId, bitePower }}
        deads : [],        // deads  : [{id, reason, phase}], reason \in { bite, execute, see }
    };

    return log;
}

Log.prototype = {};

Log.isLog = function(obj,type){
    if(!Log.prototype.isPrototypeOf(obj)){
        return false;
    }
    return type ? obj.type === type : true;
};
