model = require('./../model')

class Room {
    constructor(roomId){
        this._Id = roomId;
        this._masterId = null;

        this._users = {};
        this._rule = {};
    }

    closeRoom(){
        this._masterId = null;
        this._users = {};
    }

    get roomId() { return this._id }
    get masterId() { return this._masterId }
    get users() { return this._users }

    addUser(userId, user){
        if(this._masterId == null){
            this._masterId = userId
        }
        this._users[userId] = user;
    }
    removeUser(userId){
        if(userId == this._masterId){
            this.closeRoom();
        } else {
            delete this._users[userId];
        }
    }

    getUserNameList(){
        var list = [];
        for(var userId in this._users){
            list.push(this._users[userId].name)
        }
        return list;
    }
}

module.exports = {
    Room: Room,
}
