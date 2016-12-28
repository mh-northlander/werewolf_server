class User{
    constructor(name, socketId){
        this._socketId = socketId; //

        this._name = name;   // 表示名称
        this._role = null; // 役職
        this._alive = true;  // 生死
    }

    set name(name){ this._name = name; }
    get name(){ return this._name; }

    set role(role){ this._role = role; }
    get role(){ return this._role; }

    set alive(alive){ this._alive = alive; }
    get alive(){ return this._alive; }
}

module.exports = {
    User: User,
}
