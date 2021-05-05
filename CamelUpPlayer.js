class BasePlayer {
    name;
    gold;

    constructor(name) {
        // name is a string, returns a new Player object with 5 coins
        this.name = name;
        this.gold = 5;
    }

    toString() {
        return this.name + " with " + this.gold + " gold";
    }
}
exports.CamelUpPlayer = BasePlayer;

exports.CamelUpPlayerOne = class One extends BasePlayer {
    constructor(name) {
        super(name);
        this.name += "lololol";
    }
}
