// imports
role = require('./role')

// exports
module.exports = User;

// User
function User(userName, socketId){
    var user = Object.create(User.prototype);

    // info
    user.socketId = socketId;
    user.id = "hoge";
    user.name = userName;
    user.alive = true;

    user.role = role.Role(); // null role
    user.log = {};

    return user;
}

User.prototype = {};

User.isUser = function(obj,type){
    if(!User.prototype.isPrototypeOf(obj)){
        return false;
    }
    return type ? obj.type === type : true;
};
