// export
module.export = {
    Begin : begin,
};

// import
const role = require("../role/");

// begin
function begin(io, village){
    winTeam = village.winTeam();

    io.sockets.emit("gameFinished", {
        winTeam: winTeam,
        winIds: village.winUserIds(winTeam),
    });
}
