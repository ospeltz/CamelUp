exports.CamelUpBet = class BaseBet {
    holder; // player object
    camel; // camel object
    value; // return on bet
    down; // money down on bet

    constructor(val, cam) {
        this.value = val;
        this.camel = cam;
    }

    place(player, args) {
        // takes money from player
        // makes sure that they have enough
        // args should be an array with one element: an integer value
        // returns true if bet accepted
        var val = parseInt(args[0]);
        if (val == NaN || val > player.gold || val <= 0) {
            console.log("improper value", args[0]);
            return false;
        } else {
            this.holder = player;
            player.gold -= val;
            this.down = val;
            console.log(`${this.holder.name} put down ${this.down} on camel ${this.camel.id}`);
            return true;
        }
    }

    score(ranking) {
        // ranking is an array of all camels in order of their place in the race
        // adjusts holders gold accordingly
        // clears bet
        
        if (this.holder != null && this.camel == ranking[0]) {
            // first place
            this.holder.gold += this.value * this.down;
        } else if (this.holder != null && this.camel == ranking[1]) {
            // second place
            this.holder.gold += this.down;
        }
        // else money lost
        this.holder = null;
        this.down = null;
    }
}