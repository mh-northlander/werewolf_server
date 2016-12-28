// requires
// model = require('./../model');

// user
function User(user, socketId){
    var user = Object.create(User.prototype);

    user.socketId = socketId;
    user.name = name;

    user.alive = true;
    user.role = "";

    return user;
}
//// prototype checker (not needed now)
// User.isUser = function(obj,type){
//     if(!User.prototype.isPrototypeOf(obj)){
//         return false;
//     }
//     return type ? obj.type === type : true;
// };
User.prototype = {};

module.exports = {
    User: User,
}
