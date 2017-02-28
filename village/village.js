// exports
module.exports = Village;

// imports
Phase = require('./phase');
User  = require('./user');
Rule  = require('./rule');
Log   = require('./log');

role = require("../role/");

// Village
function Village(villageId){
    var village = Object.create(Village.prototype);

    village.Id = villageId;
    village.masterId = null;
    village.users = {};
    village.rule = Rule();

    village.phase = Phase();
    village.log = [Log()];

    village.voteMap = new Map();
    village.actionStack = {};

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

    // rule
    updateRule: function(dayTime, dayTimeDecreasesBy, nightTime, firstNightSee, roleLackable){
        this.rule.update(dayTime, dayTimeDecreasesBy, nightTime, firstNightSee, roleLackable);
    },

    // phase
    readyToShift: function(){
        for(userId in this.users){
            // alive but not ready
            if(this.users[userId].alive && !this.users[userId].readyToShift){
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
        for(userId in this.users){
            this.users[userId].readyToShift = false;
        }

        return this.phase
    },

    // action
    getCandidatesMap: function(){ // => map{ userId: [userId] }
        Object.keys(this.users).reduce((ret,userId)=>{
            if(this.users[userId].alive && this.users[userId].role.actionCandidates){
                list = this.users[userId].role.actionCandidates(this, userId);
                if(!list == []){
                    ret[userId] = list;
                }
            }
            return ret;
        }, {})
    },
    getResultMap: function(){ // => map{ userId: { userId, result,} }
        Object.keys(this.users).reduce((ret,userId)=>{
            if(this.users[userId].alive && this.users[userId].role.actionResult){
                res = this.users[userId].role.actionResult(this);
                if(!res == {}){
                    ret[userId] = res;
                }
            }
            return ret;
        }, {})
    },
    evalActionMorning: function(){ // => {deadIds: [userId], }
        if(this.phase.dayCount == 1){ return { deadIds:[] }; }

        deadIds = [];
        // see
        if(this.actionStack["see"]){
            for(e of this.actionStack["see"]){
                deadIds = deadIds.concat(this.event_saw(e.subjectUserId, e.objectUserId));
            }
        }

        //// bite
        if(this.actionStack["bite"]){
            // summarize all bite action
            summary = {} // objectId -> { powerSum, subjectIds, subjectPower }
            for(e of this.actionStack["bite"]){
                if(summary[e.objectId]){ // init
                    summary[e.objectId] = {
                        powerSum     : 0,
                        subjectPower : 0,
                        subjectIds   : [],
                    };
                }
                summary[e.objectId].powerSum += e.power
                if       (e.power >  summary[e.objectId].subjectPower){
                    summary[e.objectId].subjectIds   = [e.subjectId];
                    summary[e.objectId].subjectPower = e.power;
                } else if(e.power == summary[e.objectId].subjectPower){
                    summary[e.objectId].subjectIds.push(e.subjectId);
                }
            }
            // search victim
            objectIds = [];
            maxPower = 0;
            for(objectId in summary){
                if       (summary[objectId].powerSum >  maxPower){
                    objectIds = [objectId];
                    maxPower  = summary[objectId].powerSum;
                } else if(summary[objectId].powerSum == maxPower){
                    objectIds.push(objectId);
                }
            }
            // random choice if tie
            objectId   = objectIds[Math.floor(Math.random() * objectIds.length)];
            subjectIds = summary[objectId];
            deadIds = deadIds.concat(this.event_bited(
                subjectIds[Math.floor(Math.random() * subjectIds.length)], objectId));
        }

        // reset
        this.actionStack = {};

        return {
            deadIds: deadIds,
        };
    },

    // event returns dead user list : _ => [userId]
    event_saw: function(subjectId, objectId, base=[]){
        return base;
    },
    event_bited: function(subjectId, objectId, base=[]){
        return this.event_died(objectId, base);
    },
    event_executed: function(objectId, base=[]){
        return this.event_died(objectId, base);
    },
    event_died: function(objectId, base=[]){
        this.users[objectId].alive = false;
        return base.concat([objectId]);
    },

    // vote
    voteCandidates: function(subjectUserId){ // => [userId]
        return this.listMembersWithCondition({
            alive  : true,
            except : [subjectUserId],
        })
    },
    addVote: function(subjectId, vote){ // => _
        // voteStack: Map(objectId: {subjectIds, count})
        // vote: [userId]
        for(userId of vote){
            if(!this.voteMap.has(userId)){ this.voteMap.set(userId, {
                subjectIds : [],
                count      : 0,
            }); }

            this.voteMap.get(userId).count += 1;
            this.voteMap.get(userId).subjectIds.push(subjectId);
        }
    },
    evalVote: function(){ // => { executedId:userId, deadIds:[userId] }
        this.voteMap.forEach((v,k,m)=>{ // uniquerify
            v.subjectIds = v.subjectIds.filter((e,i,a)=>{
                return a.indexOf(e) == i;
            });
        });

        maxVotes = 0;
        eIds = [];
        this.voteMap.forEach((v,k,m)=>{
            if       (v.count >  maxVotes){
                eIds = [k];
                maxVotes = v.count;
            } else if(v.count == maxVotes){
                eIds.push(k);
            }
        });

        eId   = eIds[Math.floor(Math.random() * eIds.length)];
        deads = this.event_executed(eId);
        idx   = deads.indexOf(eId);
        deads = deads.splice(idx, 1);

        this.voteMap.clear(); // reset
        return {
            executedId   : eId,
            deadIds      : deads,
        };
    },

    // util
    listMembersWithCondition: function(cond){ // => [userId]
        /* condition
           alive  : bool
           except : [userId]

           exFunc  : user => bool // take if true
        */
        return Object.keys(this.users).reduce((ret,userId)=>{
            user = this.users[userId];

            if(cond.alive  && !user.alive){ return ret; }
            if(cond.except && cond.except.indexOf(userId) >= 0 ){ return ret; }
            if(cond.exFunc && !cond.exFunc(user.role)){ return ret; }

            ret.push(userId);
            return ret;
        }, []);
    },

    socketIdToUserId: function(socketId){ // => userId
        for(key in this.users){
            if(this.users[key].socketId == socketId){
                return key;
            }
        }
    },
    userIdToSocketId: function(userId){ // => socketId
        return this.users[userId].socketId;
    },
};

Village.isVillage = (obj,type)=>{
    if(!Village.prototype.isPrototypeOf(obj)){
        return false;
    }
    return type ? obj.type === type : true;
};
