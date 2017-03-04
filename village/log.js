// exports
module.exports = Log;

// imports


// Log
function Log(){
    const log = Object.create(Log.prototype);

    log.action = {};
    log.chat = {};
    log.result = {};

    return log;
}

Log.prototype = {};

Log.isLog = function(obj,type){
    if(!Log.prototype.isPrototypeOf(obj)){
        return false;
    }
    return type ? obj.type === type : true;
};
