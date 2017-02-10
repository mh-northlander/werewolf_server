// exports
module.exports = Village;

// imports
phase = require('../phase');
user = require('../user');


// Village
function Village(villageId){
    var village = Object.create(Village.prototype);

    village.Id = villageId;
    village.masterId = null;
    village.users = {};
    village.rule = {};
    village.phase = phase();

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
    addUser: function(userId, us){
        if(!user.isUser(us)){
            console.log('addUser: invalid user');
        }

        this.users[userId] = us;
        if(this.masterId == null){
            this.masterId = userId;
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
