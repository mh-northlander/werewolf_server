"use strict";

// export
module.exports = {
    Begin : begin,
};

// import
const role = require("../role/");


// begin
function begin(io, village){
    const winTeam = village.winTeam();

    io.sockets.emit("gameFinished", {
        winTeam: winTeam,
        winIds:  village.winUserIds(winTeam),
    });
};
