module.exports = {
    JoinRoom: joinRoom,
    ExitRoom: exitRoom,
    ChangeRule:changeRule,
    StartGame: startGame,
}

// join room
function joinRoom(io){
    return function(data){
        io.emit('joinRoom', {value : "hoge"});
    }
}

// exit room
function exitRoom(io){
    return function(data){
        io.emit('exitRoom', {value : "fuga"});
    }
}

// change rule
function changeRule(io){
    return function(data){
        io.emit('changeRule', {value : "piyo"});
    }
}

// start game
function startGame(io){
    return function(data){
        io.emit('startGame', {value : "pohe"});
    }
}
