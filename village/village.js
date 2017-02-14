// exports
module.exports = Village;

// imports
model = require('../model/');


// Village
function Village(villageId){
    var village = Object.create(Village.prototype);

    village.Id = villageId;
    village.masterId = null;
    village.users = {};
    village.rule = {};
    village.phase = model.Phase();

    return village;
}

Village.prototype = {
    //
    closeVillage: function(){
        // this func resets itself,
        // since currently we use one global vil.
        this.masterId = null;
        this.users = {};
    },

    // user
    addUser: function(userId, name, socketId){
        if(!(userId in this.users)){
            this.users[userId] = new model.User(userId, name, socketId);
            if(this.masterId == null){
                this.masterId = userId;
            }
        } else { // user already exists. TODO: maybe done in 'reconnect' func
            this.users[userId].socketId = socketId
        }
    },
    removeUser: function(userId){
        if(userId == this.masterId){
            this.closeVillage();
        } else {
            delete this.users[userId];
        }
    },

    // info
    masterUser: function(){
        if(!this.users == {}){
            return this.users[this.masterId];
        }
        // return {};
    },

    getUserNameList: function(){
        var res = [];
        for(var userId in this.users){
            res.push(this.users[userId].name)
        }
        return res;
    },
};

Village.isVillage = function(obj,type){
    if(!Village.prototype.isPrototypeOf(obj)){
        return false;
    }
    return type ? obj.type === type : true;
};
