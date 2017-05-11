"use strict";

// exports
module.exports = Village;

// imports
const Phase = require('./phase');
const User  = require('./user');
const Rule  = require('./rule');
const Log   = require('./log');
const role = require("../role/");

// Village
function Village(villageId){
    const village = Object.create(Village.prototype);

    village.Id = villageId;
    village.masterId = null;
    village.users = new Map();
    village.rule = Rule();

    village.phase = Phase();
    village.log   = Log();

    village.voteMap   = new Map(); // objctId -> {[subjectId], count}
    village.actionMap = new Map(); // sbjId -> act

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
    },
    removeUser: function(userId){
        this.users.delete(userId);
    },


    // rule
    updateRule: function(obj){
        this.rule.update(obj);
    },


    // phase
    readyToShift: function(){
        for(const [id, user] of this.users){
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

        // reset
        if(!this.log.day[this.phase.dayCount]){
            this.log.day[this.phase.dayCount] = {
                vote   : new Map(),
                action : new Map(),
                deads  : [],
            };
        }
        for(const [k,v] of this.users){
            v.readyToShift = false;
        }

        return this.phase
    },


    // event returns result object (morning / vote)
    // type: ~ => { deadIds, executedId, ~ }
    event_died: function(objectId, reason, result={}){
        this.users.get(objectId).alive = false;

        // log
        this.log.day[this.phase.dayCount].deads.push({
            userId : objectId,
            phase  : this.phase.gamePhase,
            reason : reason,
        });
        return result;
    },
    event_saw: function(subjectId, objectId, result={}){ return result; },
    event_bited: function(subjectId, objectId, success, result={}){
        if(success){ // bite action can fail
            if(!result.deadIds){ result.deadIds = []; }
            result.deadIds.push(objectId);

            return this.event_died(objectId, "bite", result);
        }
        return result;
    },
    event_executed: function(objectId, result={}){
        result.executedId = objectId;
        return this.event_died(objectId, "execute", result);
    },
    event_morning: function(result={}){ return result; },


    // action
    getCandidatesMap: function(){ // => map{ userId: [userId] }
        const map = new Map();
        for(const [id,user] of this.users){
            if(user.alive){
                const list = user.role.actionCandidates(this, id);
                if(list.length !== 0){
                    map.set(id, list);
                }
            }
        }
        return map;
    },
    getResultMap: function(){ // => map{ userId: result{} }
        const map = new Map();
        for(const [id,user] of this.users){
            if(user.alive){
                const res = user.role.actionResult(this, id);
                if(Object.keys(res).length !== 0){
                    map.set(id, res);
                }
            }
        }
        return map;
    },
    evalActionMorning: function(){ // => {deadIds: [userId], }
        // first morning (TODO)
        if(this.phase.dayCount === 1){
            return { deadIds: [] };
        }

        let morningResult = {}
        // see
        if(this.actionMap.has("see")){
            for(const act of this.actionMap.get("see")){
                morningResult = this.event_saw(act.subjectId, act.objectId, morningResult);
            }
        }

        // bite
        if(this.actionMap.has("bite")){
            // summarize all bite action
            const summary = new Map();
            this.actionMap.get("bite").forEach(
                (act,i,a) => { // act: { subjectId, objectId, power }
                    if(!summary.has(act.objectId)){ // init
                        summary.set(act.objectId, {
                            subjectIds   : [],
                            subjectPower : 0,
                            powerSum     : 0,
                        });
                    }
                    if(       act.power  >  summary.get(act.objectId).subjectPower){
                        summary.get(act.objectId).subjectIds   = [act.subjectId];
                        summary.get(act.objectId).subjectPower = act.power;
                    } else if(act.power === summary.get(act.objectId).subjectPower){
                        summary.get(act.objectId).subjectIds.push(act.subjectId);
                    }
                    summary.get(act.objectId).powerSum += act.power;
                }
            );

            // pick victim
            let objectIds = [];
            let maxPower = 0;
            for(const [id, v] of summary){
                if(       v.powerSum  >  maxPower){
                    objectIds = [id];
                    maxPower  = v.powerSum;
                } else if(v.powerSum === maxPower){
                    objectIds.push(id);
                }
            }
            // random choice if tie
            const objectId   = objectIds [Math.floor(Math.random() * objectIds.length)];
            const subjectIds = summary.get(objectId).subjectIds;
            const subjectId  = subjectIds[Math.floor(Math.random() * subjectIds.length)];

            console.log("eval mo:")
            morningResult = this.event_bited(subjectId, objectId, true, morningResult);
        }

        // become morning
        morningResult = this.event_morning(morningResult);

        console.log("eval morning result:");
        console.log(morningResult);

        // reset
        this.actionMap.clear();

        return morningResult;
    },


    // vote
    voteCandidates: function(subjectId){ // => [userId]
        return this.listUserIdsWithCondition({
            alive  : true,
            except : [subjectId],
        })
    },
    addVote: function(subjectId, vote){ // => _
        // voteMap: Map(objectId: {subjectIds, count})
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
                return a.indexOf(e) === i;
            });
        }

        let eIds = [];
        let maxVotes = 0;
        for(const [k,v] of this.voteMap){
            if       (v.count  >  maxVotes){
                eIds = [k];
                maxVotes = v.count;
            } else if(v.count === maxVotes){
                eIds.push(k);
            }
        }

        const eId = eIds[Math.floor(Math.random() * eIds.length)];
        const voteResult = this.event_executed(eId, {});

        // reset
        this.voteMap.clear();

        return voteResult;
    },


    // end game
    isGameFinished: function(){
        // wolf_n <= 0 || wolf_n >= vil_n
        let wolf_n = 0;
        let vill_n = 0;
        for(const [_, user] of this.users){
            if(user.alive){
                if(       user.role.species === role.common.type.HUMAN){
                    vill_n += 1;
                } else if(user.role.species === role.common.type.WEREWOLF){
                    wolf_n += 1;
                }
            }
        }
        return (wolf_n === 0) || (vill_n <= wolf_n);
    },
    winTeam: function(){
        // lovers (TODO)

        // fox
        for(const [id, user] of this.users){
            if(user.role.type === role.Fox.Name && user.alive){
                return role.common.type.FOX;
            }
        }

        // human
        let wolf_n = 0;
        for(const [_, user] of this.users){
            if(user.alive && user.role.species === role.common.type.WEREWOLF){
                wolf.n += 1;
            }
        }
        if (wolf_n === 0){
            return role.common.type.HUMAN;
        }
        // werewolf
        return role.common.type.WEREWOLF;
    },
    winUserIds: function(winTeam){
        ret = [];
        for(const [id, user] of this.users){
            if(user.role.hasWon(this, id, winTeam)){
                ret.push(id);
            }
        }
        return ret;
    },


    // util
    listUserIdsWithCondition: function(cond){ // => [userId]
        /* condition
           alive  : bool
           except : [userId]

           exFunc  : user => bool // take if true
        */
        let ret = [];
        for(const [id,user] of this.users){
            if(cond.alive  && !user.alive){ continue; }
            if(cond.except && cond.except.indexOf(id)>=0){ continue; }
            if(cond.exceptFunc && cond.exceptFunc(user)){ continue; }

            ret.push(id);
        }
        return ret;
    },
    listUsers: function(){ // => [{id,name}]
        let ret = [];
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
            if(user.socketId === socketId){ return id; }
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
