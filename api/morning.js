// export
module.exports = {
    MorningResultChecked: morningResultChecked,
};

// import
model = require('./../model');

// morningResult


// morningResultChecked
function morningResultChecked(io, village){
    return function(userId){
        village.users[userId].actionDone = True;
        village.finishPhase(io)
    }
}
