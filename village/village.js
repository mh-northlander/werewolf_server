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
    village.users = new Map();
    village.rule = Rule();

    village.phase = Phase();
    village.log = [Log()];

    village.voteMap = new Map();
    village.actionMap = new Map();

    return village;
}

Village.prototype = {
    // village
    resetVillage: function(){
        this.phase = Phase();
        this.log = [Log()];

        this.voteMap.clear();
        this.actionMap.clear();
    },

    // user
    masterUser: function(){
        return this.masterId ? null : this.users.get(masterId);
    },
    addUser: function(userId, socketId, name){
        if(this.users.has(userId)){ // update
            this.users.get(userId).name = name;
            this.users.get(userId).socketId = socketId;
        } else {                    // add
            this.users.set(userId, User(userId, name, socketId))
        }

        if(this.masterId == null){
            this.masterId = userId;
        }
    },
    removeUser: function(userId){
        this.users.delete(userId);
    },


    // rule
    updateBaseRule: function(obj){
        this.rule.updateBase(obj);
    },
    updateRoleSet: function(map){
        this.rule.updateRoleSet(map);
    },

    // phase
    readyToShift: function(){
        for(let [id, user] of this.users){
            // alive but not ready
            if(user.alive && !user.readyToShift){
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
        for(let [k,v] of this.users){
            v.readyToShift = false;
        }

        return this.phase
    },

    // action
    getCandidatesMap: function(){ // => map{ userId: [userId] }
        ret = {};
        for(let [id,user] of this.users){
            if(user.alive && user.role.actionCandidates){
                list = user.role.actionCandidates(this, id);
                if(list != []){
                    ret[id] = list;
                }
            }
        }
        return ret;
    },
    getResultMap: function(){ // => map{ userId: result{} }
        ret = {};
        for(let [id,user] of this.users){
            if(user.alive && user.role.actionResult){
                res = user.role.actionResult(this, id);
                if(res != {}){
                    ret[id] = res;
                }
            }
        }
        return ret;
    },
    evalActionMorning: function(){ // => {deadIds: [userId], }
        if(this.phase.dayCount == 1){ return { deadIds:[] }; }

        var morningResult = {}
        // see
        if(this.actionMap.has("see")){
            for(const act of this.actionMap.get("see")){
                morningResult = this.event_saw(act.subjectId, act.objectId, morningResult);
            }
        }

        // bite
        if(this.actionMap.has("bite")){
            // summarize all bite action
            let summary = new Map();
            for(const act of this.actionMap.get("bite")){
                if(summary.has(act.objectId)){ // init
                    summary.set(act.objectId, {
                        powerSum     : 0,
                        subjectPower : 0,
                        subjectIds   : [],
                    });
                }
                summary.get(act.objectId).powerSum += act.power
                if       (act.power >  summary.get(act.objectId).subjectPower){
                    summary.get(act.objectId).subjectIds   = [act.subjectId];
                    summary.get(act.objectId).subjectPower = act.power;
                } else if(act.power == summary.get(act.objectId).subjectPower){
                    summary.get(act.objectId).subjectIds.push(act.subjectId);
                }
            }
            // pick victim
            objectIds = [];
            maxPower = 0;
            for(const [k,v] of summary){
                if       (v.powerSum >  maxPower){
                    objectIds = [k];
                    maxPower  = v.powerSum;
                } else if(v.powerSum >  maxPower){
                    objectIds.push(k);
                }
            }
            // random choice if tie
            objectId   = objectIds [Math.floor(Math.random() * objectIds.length)];
            subjectIds = summary.get(objectId).subjectIds;
            subjectId  = subjectIds[Math.floor(Math.random() * subjectIds.length)];

            morningResult = this.event_bited(subjectId, objectId, true, morningResult);
        }

        // reset
        this.actionMap.clear();

        return morningResult;
    },

    // event returns result object (morning / vote)
    // type: ~ => { deadIds, executedId, ~ }
    event_saw: function(subjectId, objectId, result={}){ return result; },
    event_bited: function(subjectId, objectId, success, result={}){
        if(success){ // bite action can fail
            if(!result.deadIds){ result.deadIds = []; }
            result.deadIds.push(objectIds);

            return this.event_died(objectId, result);
        }
        return result;
    },
    event_executed: function(objectId, result={}){
        result.executedId = objectIds;
        return this.event_died(objectId, result);
    },
    event_died: function(objectId, result={}){
        this.user.get(objectId).alive = false;
        return result;
    },
    event_morning: function(result={}){ return result; },

    // vote
    voteCandidates: function(subjectId){ // => [userId]
        return this.listUserIdsWithCondition({
            alive  : true,
            except : [subjectId],
        })
    },
    addVote: function(subjectId, vote){ // => _
        // voteStack: Map(objectId: {subjectIds, count})
        // vote: [userId]
        for(const userId of vote){
            if(!this.voteMap.has(userId)){ this.voteMap.set(userId, {
                subjectIds : [],
                count      : 0,
            }); }

            this.voteMap.get(userId).count += 1;
            this.voteMap.get(userId).subjectIds.push(subjectId);
        }
    },
    evalVote: function(){ // => { executedId:userId, deadIds:[userId] }
        // uniquerify
        for(const [k,v] of this.voteMap){
            v.subjectIds = v.subjectIds.filter((e,i,a)=>{
                return a.indexOf(e) == i;
            });
        }

        maxVotes = 0;
        eIds = [];
        for(const [k,v] of this.voteMap){
            if       (v.count >  maxVotes){
                eIds = [k];
                maxVotes = v.count;
            } else if(v.count == maxVotes){
                eIds.push(k);
            }
        }

        eId = eIds[Math.floor(Math.random() * eIds.length)];
        voteResult = this.event_executed(eid, {});

        // reset
        this.voteMap.clear();

        return voteResult;
    },

    // util
    listUserIdsWithCondition: function(cond){ // => [userId]
        /* condition
           alive  : bool
           except : [userId]

           exFunc  : user => bool // take if true
        */
        ret = [];
        for(const [id,user] of this.users){
            if(cond.alive  && !user.alive){ continue; }
            if(cond.except && cond.except.indexOf(id)>=0){ continue; }
            if(cond.exFunc && !cond.exFunc(user.role)){ continue; }

            ret.push(id);
        }
        return ret;
    },
    listUsers: function(){ // => [{id,name}]
        ret = [];
        for(const [id,user] of this.users){
            ret.push({
                id   : id,
                name : user.name,
            });
        }
        return ret;
    },

    socketIdToUserId: function(socketId){ // => userId
        for(const [id,user] of this.users){
            if(user.socketId == socketId){ return id; }
        }
        console.log("error: no user has socketId " + socketId);
    },
    userIdToSocketId: function(userId){ // => socketId
        if(this.users.has(userId)){
            return this.users.get(userId).socketId;
        }
        console.log("error: no user has id " + userId);
    },
};

Village.isVillage = (obj,type)=>{
    if(!Village.prototype.isPrototypeOf(obj)){
        return false;
    }
    return type ? obj.type === type : true;
};
