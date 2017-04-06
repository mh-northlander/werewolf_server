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
    // vote : { sbjId -> objId }
    // action : { sbjId -> { type, objId, bitePower }}
    // deads : [{id, reason, phase}]
    // reason \in { bite, execute, see }
    log.day = [];

    return log;
}

Log.prototype = {};

Log.isLog = function(obj,type){
    if(!Log.prototype.isPrototypeOf(obj)){
        return false;
    }
    return type ? obj.type === type : true;
};
