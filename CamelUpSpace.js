const _CamelUpBet = require('./CamelUpBet.js');
const { Utilities } = require('./Utilities.js');

class Space {
    stack;
    spaceSize;
    id;
    constructor(id, spaceSize) {
        this.id = id;
        this.stack = null;
        this.spaceSize = spaceSize;
    }
    stackCamel(other) {
        // if no camels on top of this space, put on stack, if there are some on top, pass to that camel
        if (this.stack == null)
            this.stack = other;
        else
            this.stack.stackCamel(other);
    }
    toString() {
        return `|${Utilities.centerString(String(this.id), this.spaceSize-2)}|`;
    }
    toObj() {
        return {
            id: this.id,
            stack: this.stack == null ? null : this.stack.toObj(),
            _class: this.constructor.name
        };
    }
    fromObj(obj, game) {
        // constructs the object based on the pased json object, objects nested inside of this also initiated
        if (typeof(obj.id) !== 'number' || typeof(obj.stack) !== 'object')
            throw "invalid space object";
            
        this.id = obj.id;
        if (obj.stack === null) {
            this.stack = null;
        } else if (obj.stack._class == "BaseCamel") {
            this.stack = new BaseCamel();
            this.stack.fromObj(obj.stack, game);
        }
    }
}
exports.Space = Space;

class BaseCamel extends Space {
    roundBets;
    endBets;

    constructor(id, crazy, spaceSize, roundBetValues) {
        super(id, spaceSize);
        this.crazy = crazy; // true if moves backwards
        this.rolled = false;
        
        if (!crazy && roundBetValues != undefined) {
            // initiate bets
            this.roundBets = roundBetValues.map(val => {
                return new _CamelUpBet.CamelUpBet(val, this);
            });
            this.endBets = [];
        } else {
            this.roundBets = [];
            this.endBets = [];
        }
    }
    endRound(ranking) {
        // ranking is an array of the camels in their race order
        this.rolled = false;
        if (!this.crazy)
            this.roundBets.forEach(bet => { bet.score(ranking, this); })
    }
    placeBet(player, args, input) {
        // args = [betType, args for bet]
        // returns true if bet accepted
        // input should be a function that takes one string argument and returns string of player input
        if (this.crazy) {
            console.log("you cannot bet on crazy camels");
            return false;
        }
        if (args.length == 0) {
            var type = input("bet type? round, winner, loser: ");
            var val = input("money down? ");
            args = [type,val];
        }
        if (args[0] == "round" || args[0] == "rnd") {
            // round bet
            for (var i = 0; i < this.roundBets.length; i++) {
                if (this.roundBets[i].holder == null) {
                    return this.roundBets[i].place(player, this, args.slice(1), input);
                }
            }
            console.log(`no more available round bets for camel ${this.id}`);
            return false;
        } else if (args[0] == "winner" || args[0] == "win") {
            // overall winner
            console.log("not implemented");
            return false;
        } else if (args[0] == "loser" || args[0] == "los") {
            // overall loser
            console.log("not implemented");
            return false;
        } else {
            console.log("invalid bet type");
            return false;
        }
    }

    roll() {
        this.rolled = true;
        return Math.floor(Math.random() * 3) + 1;
    }
    toString() {
        var str = this.crazy ? "<=" + String(this.id) + "=" : "=" + String(this.id) + "=>";
        return Utilities.centerString(str, this.spaceSize);
    } 
    toObj() {
        var obj = super.toObj();
        obj.rolled = this.rolled;
        obj.crazy = this.crazy;
        obj.roundBets = this.roundBets.map(bet => bet.toObj());
        obj.endBets = this.endBets.map(bet => bet.toObj());
        obj._class = this.constructor.name;
        return obj;
    }
    fromObj(obj, game) {        
        super.fromObj(obj, game);
        if (typeof(obj.rolled) !== 'boolean' || typeof(obj.crazy) !== 'boolean' || 
            !Array.isArray(obj.endBets) || !Array.isArray(obj.roundBets))
            throw 'invalid camel object';
        this.rolled = obj.rolled;
        this.crazy = obj.crazy;
        if (!this.crazy) {
            this.endBets = obj.endBets.map(bet => {
                if (bet._class == "BaseBet") {
                    var b = new _CamelUpBet.CamelUpBet();
                    b.fromObj(bet, game);
                    return b;
                }
            });
            this.roundBets = obj.roundBets.map(bet => {
                if (bet._class == "BaseBet") {
                    var b = new _CamelUpBet.CamelUpBet();
                    b.fromObj(bet, game);
                    return b;
                }
            });
        }
    }
}
exports.Camel = BaseCamel;
