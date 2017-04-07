"use strict";

// export
module.exports = {
    IsValidPhase: isValidPhase,
};

function isValidPhase(io, socket, village, eventPhase, eventName){
    if(village.phase.gamePhase === eventPhase){
        console.log("success Request", eventPhase, eventName);
        return true
    } else {
        console.log("badRequest:", village.socketIdToUserId(socket.id), "can't call", eventName, "because gamePhase is", village.phase.gamePhase);
        io.to(socket.id).emit("error", {statusCode:400, message:"badRequest: "+eventName+" can't call at "+ village.phase.gamePhase})
        return false
    }
}
