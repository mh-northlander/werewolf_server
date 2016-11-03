module.exports = {
    JoinRoom: joinRoom,
    ExitRoom: exitRoom,
    ChangeRule:changeRule,
    StartGame: startGame,
}

// join room
function joinRoom(io, socketId){
    return function(data){
        userInfoMap[data.userId] = new userInfo(
          data.name, "none", true, socketId
        );
        var userNameList = [];
        for(userId in userInfoMap){
          userNameList.push(userInfoMap[userId].name);
        }
        io.emit('joinRoom', {value : userNameList});
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

// userInfoMap
var userInfoMap = {};

// userInfo
function userInfo(name, role, live, socketId){
  this.name = name;
  this.role = role;
  this.live = live;
  this.socketId = socketId
}
