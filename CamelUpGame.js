const _CamelUpPlayer = require('./CamelUpPlayer.js');
const _CamelUpBet = require('./CamelUpBet.js');
const input = require('prompt-sync')();

// TODO: make everything private variables

exports.CamelUpGame = class CamelUpGame {
    board;
    camels;
    players;

    constructor(
            playerNames, // an array of strings
            nCamels=5,
            nCrazyCamels=2,
            boardSize=15,
            roundBetValues=[2, 1.5]
            ) {
        // round bet cards will be created for each camel, for each value of roundBetValues, the 
        // value will be passed to the constructor of the Bet object in use
        
        this.players = playerNames.map(nm => {return new _CamelUpPlayer.CamelUpPlayer(nm)});
        this.camels = [];
        this.spaceSize = 6; // the number of characters taken up by a space on the board
        this.gameOver = false;
        for (var i = 0; i < nCamels; i++) {
            this.camels.push(new Camel(i, false, this.spaceSize, roundBetValues));
        }
        for (var j = nCamels; j < (nCrazyCamels+nCamels); j++) {
            this.camels.push(new Camel(j, true, this.spaceSize, []));
        }
        this.initiateBoard(boardSize);
    }

    runGame() {
        // loops the game until it is over
        while (!this.gameOver) {
            this.getMove();
            this.nextPlayer();
            console.log();
            this.printBoard();
        }
    }

    getMove() {
        // prompt user for a move for the player currently at the front of the list
        var finished = false;
        while (!finished) {
            console.log(this.players[0].name + " you are up");
            var args = this.getInput('bet, roll, spectate, partner: ').split(" ");
            if (args[0] == "bet" || args[0] == 'b')
                finished = this.getPlayerBet(args.slice(1));
            else if (args[0] == "roll" || args[0] == 'r') 
                finished = this.roll();
            else if (args[0] == "spectate" || args[0] == 's')
                finished = this.placeSpectatorToken();
            else if (args[0] == "partner" || args[0] == 'p')
                finished = this.makePartnership();
            else
                console.log('invalid input');
        }
    }

    endRound() {
        // makes all camels rollable again, rewards players for round bets, removes spectator tokens
        var ranking = [];
        this.board.forEach( space => {
            var curr = space.stack;
            while (curr != null) {
                if (!curr.crazy)
                    ranking.unshift(curr);
                curr = curr.stack;
            }
        });
        console.log(ranking);
        this.camels.forEach(cam => {cam.endRound(ranking);});
    }
    endGame() {
        this.gameOver = true;
    }

    getPlayerBet(args=[]) {
        // places a bet on the provided camel with the provided money down
        // if none are provided, prompts user for input
        // takes the first bet in the stack
        // args = [camelID, betType, args for bet]
        // returns true if bet was accepted
        if (args.length == 0) {
            // gather args
            var cmId = this.getInput("camel id? ");
            var type = this.getInput("bet type? round, winner, loser: ");
            var val = this.getInput("money down? ");
            args = [cmId, type, val];
        }
        var cam = this.camels.filter(cm => cm.id == parseInt(args[0]) )[0];
        if (cam === undefined) {
            console.log("invalid camel id", args[0]);
            return false;
        } else {
            return cam.placeBet(this.players[0], args.slice(1));
        }
    }

    roll() {
        // rolls one of the camel dies randomly, moves the appropriate camel and any camels it
        // may be carrying, and gives one coin to the roller
        // will call endGame() if a camel crosses the finish line 
        // will call endRound() if only two dice remain after the roll
        // TODO: only one crazy camel roll per round
        var remainingCamels = this.camels.filter(camel => !camel.rolled);
        var cam = remainingCamels[Math.floor(Math.random() * remainingCamels.length)];
        var r = cam.roll() * Math.pow(-1, cam.crazy); // get negative movement for crazy camels
        console.log(`${this.players[0].name} rolled a ${r} for camel ${cam.id}`);
        this.players[0].gold += 1;
        if (this.moveCamel(cam, r))
            this.endGame();
        
        if (remainingCamels.length == 3)
            this.endRound();

        return true;
    }
    moveCamel(cam, r) {
        // moves the camel referenced by cam r spaces forward (or backward)
        // moves any camels on top of cam with it. returns true if the game is over, puts the 
        // winning camel on very top of the first square
        
        // find camel
        var i = 0;
        while (i < this.board.length) {
            if (this.board[i].stack == null) {
                // check next space
                i++;
            } else {
                var curr = this.board[i];
                while (curr.stack != null) {
                    if (curr.stack === cam) {
                        // camel found, move him
                        curr.stack = null;
                        if (i + r >= this.board.length) {
                            // game over
                            this.board[0].stackCamel(cam);
                            return true;
                        } else if (i + r < 0) {
                            // camel circled around backwards
                            this.board[this.board.length + i + r].stackCamel(cam);
                        } else {
                            this.board[i + r].stackCamel(cam);
                            return false;
                        }
                    } else {
                        curr = curr.stack;
                    }
                } 
                i++;      
            }
        }
    }
    placeSpectatorToken() {
        console.log('not implemented');
        return false;
    }
    makePartnership() {
        console.log('not implemented');
        return false;
    }

    getInput(prompt) {
        var str = input(prompt);
        if (str == "/end") process.exit();
        return str;
    }

    nextPlayer() {
        // puts the first player at the end of the list
        this.players.push(this.players.shift());
    }
    initiateBoard(boardSize) {
        // places camels on board randomly in starting positions
        this.board = [];
        for (var i = 0; i < boardSize; i++) { this.board.push(new Space(i+1, this.spaceSize)); } // empty spaces
        Utils.shuffleArray(this.camels);
        this.camels.forEach(camel => {
            var pos = camel.roll();
            if (camel.crazy)
                pos = boardSize - pos;
            this.board[pos-1].stackCamel(camel);
        });
        this.camels.forEach(cam => {cam.rolled = false;});
    }
    
    printBoard() {
        var atTop = false; // have reached top camel
        var stringLayers = []; // layers of formatted strings to be printed
        var currLayer = this.board;
        var nextLayer = [];
        while (!atTop) {
            nextLayer = [];
            var str = "";
            currLayer.forEach(space => {
                if (!space) {
                    str += " ".repeat(this.spaceSize);
                    nextLayer.push(null);
                } else {
                    str += space.toString();
                    nextLayer.push(space.stack);
                }
            });
            stringLayers.push(str);
            atTop = nextLayer.every(space => space == null);
            currLayer = nextLayer;
        }
        stringLayers.reverse();
        stringLayers.forEach(str => console.log(str));
        console.log("rolled: ", this.camels.filter(cm => cm.rolled).map(cm => cm.id));
        console.log();
        // TODO: print available bets
    }
}

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
        return `|${Utils.centerString(String(this.id), this.spaceSize-2)}|`;
    }
}
class Camel extends Space {
    roundBets;
    endBets;

    constructor(id, crazy, spaceSize, roundBetValues) {
        super(id, spaceSize);
        this.crazy = crazy; // true if moves backwards
        this.rolled = false;
        
        if (!crazy) {
            // initiate bets
            this.roundBets = roundBetValues.map(val => {
                return new _CamelUpBet.CamelUpBet(val, this);
            });
            this.endBets = [];
        }
    }
    endRound(ranking) {
        // ranking is an array of the camels in their race order
        this.rolled = false;
        if (!this.crazy)
            this.roundBets.forEach(bet => { bet.score(ranking); })
    }
    placeBet(player, args) {
        // args = [betType, args for bet]
        // returns true if bet accepted
        if (this.crazy) {
            console.log("you cannot bet on crazy camels");
            return false;
        }
        if (args[0] == "round" || args[0] == "rnd") {
            // round bet
            for (var i = 0; i < this.roundBets.length; i++) {
                if (this.roundBets[i].holder == null) {
                    return this.roundBets[i].place(player, args.slice(1));
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
        return Utils.centerString(str, this.spaceSize);
    } 
}
class Utils {
    static centerString(str, totalLen, bufferChar=" ") {
        // returns a str of length totalLen with str in the center, and bufferChar
        // on either side to get it up to totLen
        if (bufferChar.length != 1) throw `invalid bufferChar "${bufferChar}"`;
        if (str.length > totalLen) throw `str: "${str} is longer than totalLen: ${totalLen}`;
        var prefix = Math.floor((totalLen - str.length) / 2);
        return bufferChar.repeat(prefix) + str + bufferChar.repeat(totalLen - str.length - prefix);
    }

    static shuffleArray(ar) {
        // shuffles input array ar in place
        for (var i = ar.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = ar[i];
            ar[i] = ar[j];
            ar[j] = temp;
        }
    }
}