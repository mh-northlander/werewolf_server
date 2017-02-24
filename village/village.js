// exports
module.exports = Village;

// imports
Phase = require('./phase');
User  = require('./user');
Log   = require('./log');


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

    village.phase = Phase();
    village.actionStack = [];
    village.log = [Log()];

    return village;
}

Village.prototype = {
    // village
    closeVillage: function(){
        // this func resets itself,
        // since currently we use one global vil.
        this.masterId = null;
        this.users = {};
    },

    // user
    masterUser: function(){
        return this.masterId ? null : this.users[masterId];
    },
    addUser: function(userId, socketId, name){
        if(userId in this.users){ return; }

        this.users[userId] = User(userId, name, socketId);
        if(this.masterId == null){
            this.masterId = userId;
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
    socketIdToUserId: function(socketId){
        for(key in this.users){
            if(this.users[key].socketId == socketId){
                return key;
            }
        }
    },

    // rule

    // phase
    readyToShift: function(){
        // everyone ready except deads
        for(key in this.users){
            if(this.users[key].alive && !this.users[key].readyToShift){
                return false;
            }
        }
        return true;
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

            if(cond.alive   && !user.alive){ return ret; }
            if(cond.notWolf &&  user.isWolf){ return ret; }
            if(cond.except  && (userId in cond.except)){ return ret; }

            ret.push({
                userId: userId,
                userName: user.name,
            });
            return ret;
        }, []);
    },
    addAction: function(subjectUserId, act){
        // act: {type, userId (target), ~}

        // resp: {subjectUser, objectUser, result:role.common, }
        return {};
    },
    evalAction: function(){
        // resp: {deads:[userName], }
        return {};
    },

    // vote
    voteCandidates: function(){
        return Object.keys(this.users).reduce((ret,userId)=>{
            if(this.users[userId].alive){
                ret.push({
                    userId: userId,
                    userName: this.users[userId].name,
                });
            }
            return ret;
        }, []);
    },
    addVote: function(subjectUserId, vote){

    },
    evalVote: function(){
        return {};
    },
};

Village.isVillage = (obj,type)=>{
    if(!Village.prototype.isPrototypeOf(obj)){
        return false;
    }
    return type ? obj.type === type : true;
};
