const { Utilities } = require("./Utilities");

class BasePlayer {
    id;
    name;
    money;

    constructor(id, name) {
        // name is a string, returns a new Player object with 5 coins
        this.id = id;
        this.name = name;
        this.money = 5;
    }

    toString() {
        return this.name + " with " + this.money + " coins";
    }
    toObj() {
        return {
            id: this.id,
            name: this.name,
            money: this.money,
            _class: this.constructor.name
        };
    }
    fromObj(obj, game) {
        if (!util.isNumber(obj.id) || !util.isString(obj.name) || !util.isNumber(obj.money))
            throw `invalid player object`;
        this.id = obj.id;
        this.name = obj.name;
        this.money = money;
    }
}
exports.CamelUpPlayer = BasePlayer;
