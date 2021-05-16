class BaseBet {
    holder; // player object
    value; // return on bet
    down; // money down on bet

    // TODO removed camel member from this class, make sure it doesnt affect anything
    constructor(val) {
        this.value = val;
    }

    place(player, camel, args) {
        // takes money from player
        // makes sure that they have enough
        // args should be an array with one element: an integer value
        // returns true if bet accepted
        var val = parseInt(args[0]);
        if (val == NaN || val > player.money || val <= 0) {
            console.log("improper value", args[0]);
            return false;
        } else {
            this.holder = player;
            player.money -= val;
            this.down = val;
            console.log(`${this.holder.name} put down ${this.down} on camel ${camel.id}`);
            return true;
        }
    }

    score(ranking, camel) {
        // ranking is an array of all camels in order of their place in the race
        // camel is the camel this bet is placed on
        // adjusts holders money accordingly
        // clears bet
        
        if (this.holder != null && camel == ranking[0]) {
            // first place
            this.holder.money += this.value * this.down;
        } else if (this.holder != null && camel == ranking[1]) {
            // second place
            this.holder.money += this.down;
        }
        // else money lost
        this.holder = null;
        this.down = null;
    }
    toObj() {
        return {
            holder: this.holder == null ? null : this.holder.id,
            value: this.value,
            down: this.down,
            _class: this.constructor.name
        };
    }
    fromObj(obj, game) {
        if (obj.holder === undefined || !util.isNumber(obj.value) || obj.down === undefined)
            throw "invalid bet object"
        // TODO     
    }
}
exports.CamelUpBet = BaseBet;