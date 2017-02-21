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
    village.rule = {
        dayTime : 5,
        nightTime : 5,
    };
    village.phase = model.Phase();
    village.log = [model.Log()];

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
    addUser: function(userId, socketId, name){
        if(!(userId in this.users)){
            this.users[userId] = new model.User(userId, name, socketId);
            if(this.masterId == null){
                this.masterId = userId;
            }
        }
    },
    updateUser: function(userId, socketId, name){
        if(!(userId in this.users)){ return; }

        this.users[userId].name = name;
        this.users[userId].socketId = socketId;
    },
    removeUser: function(userId){
        delete this.users[userId];
    },
    getUserIdFromSocketId: function(socketId){
        for(key in Object.keys(this.users)){
            if(this.users[key].socketId == socketId){
                return key
            }
        }
    },

    // phase
    isAbleToShift: function(){
        // everyone ready except deads
        Object.keys(this.users).reduce((acc, key)=>{
            return acc && (!this.users[key].alive || this.users[key].readyToShift);
        }, true);
    },
    shiftPhase: function(nPhase){
        // shift
        console.log("shift: " + this.phase.gamePhase + " to " + nPhase);
        this.phase.phaseShift(nPhase, this.rule.dayTime, this.rule.nightTime);

        // reset flg
        Object.keys(this.users).forEach((key)=>{
            this.users[key].readyToShift = false;
        });

        return this.phase
    },

    // action
    listActionCandidates: function(userId){
        /* object condition
           alive : bool
           notWolf: bool
           except: [userId]
         */
        cond = this.users[userId].role.candidateCondition();
        return Object.keys(this.users).reduce((ret,userId)=>{
            user = this.users[userId];

            if(cond.alive && !user.alive){ return ret; }
            if(cond.notWolf && user.isWolf){ return ret; }
            if(cond.except ? (userId in cond.except) : false){ return ret; }

            ret.push({
                userId: userId,
                userName: user.name,
            });
            return ret;
        }, []);
    },


    // info
    masterUser: function(){
        if(!this.users == {}){
            return this.users[this.masterId];
        }
        // return {};
    },
};

Village.isVillage = (obj,type)=>{
    if(!Village.prototype.isPrototypeOf(obj)){
        return false;
    }
    return type ? obj.type === type : true;
};
