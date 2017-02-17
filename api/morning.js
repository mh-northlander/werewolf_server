// export
module.exports = {
    MorningResultChecked: morningResultChecked,
};

// import
model = require('./../model');

// morningResult


// morningResultChecked
function morningResultChecked(io, socket, village){
    return function(userId){
        village.users[userId].actionDone = True;
        village.finishPhase(io)
    }
}
