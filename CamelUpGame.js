const _CamelUpPlayer = require('./CamelUpPlayer.js');
const _CamelUpSpace = require('./CamelUpSpace.js')
const input = require('prompt-sync')();
const { Utilities } = require('./Utilities.js');
const fs = require('fs');

// TODO: make everything private variables

class CamelUpGame {
    board;
    camels;
    players;
    gameOver;
    spaceSize;
    userInput;
    
    // TODO parameter destructuring
    constructor({
            playerNames=[], // an array of strings
            nCamels=5,
            nCrazyCamels=2,
            boardSize=15,
            roundBetValues=[2, 1.5],
            gameObj=null,
            userInput=null // a function that takes takes one string arg, a prompt, a returns a string of user input
    }={}) {
        if (playerNames.length == 0 && gameObj == null) 
            throw "must supply either playerNames or gameObj";

        if (userInput != null)
            // custom getInput, default is below
            this.userInput = userInput;
        else
            this.userInput = input

        this.spaceSize = 6; // the number of characters taken up by a space on the board
        this.gameOver = false;

        if (gameObj !== null) {
            importGame(gameObj);
        } else {
            var i = 0;
            this.players = playerNames.map(nm => {return new _CamelUpPlayer.CamelUpPlayer(i++, nm)});
            this.camels = [];
            
            for (var i = 0; i < nCamels; i++) {
                this.camels.push(new _CamelUpSpace.Camel(i, false, this.spaceSize, roundBetValues));
            }
            for (var j = nCamels; j < (nCrazyCamels+nCamels); j++) {
                this.camels.push(new _CamelUpSpace.Camel(j, true, this.spaceSize, []));
            }
            this.initiateBoard(boardSize);
        }
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
            args = [cmId];
        }
        var cam = this.camels.filter(cm => cm.id == parseInt(args[0]))[0];
        if (cam === undefined) {
            console.log("invalid camel id", args[0]);
            return false;
        } else {
            return cam.placeBet(this.players[0], args.slice(1), this.getInput);
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
        this.players[0].money += 1;
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
        var str = this.userInput(prompt);
        if (str == "/end") process.exit();
        if (str == "/export") {
            var js = this.exportGame();
            console.log(JSON.stringify(js));
            process.exit();
        }
        return str;
    }

    nextPlayer() {
        // puts the first player at the end of the list
        this.players.push(this.players.shift());
    }
    initiateBoard(boardSize) {
        // places camels on board randomly in starting positions
        this.board = [];
        for (var i = 0; i < boardSize; i++) { this.board.push(new _CamelUpSpace.Space(i+1, this.spaceSize)); } // empty spaces
        Utilities.shuffleArray(this.camels);
        this.camels.forEach(camel => {
            var pos = camel.roll();
            if (camel.crazy)
                pos = boardSize - pos;
            this.board[pos-1].stackCamel(camel);
        });
        this.camels.forEach(cam => {cam.rolled = false;});
    }
    
    importGame(gameObj) {
        this.players = gameObj.players.map(pl => {
            if (pl._class == "BasePlayer") {
                var p = new _CamelUpPlayer.CamelUpPlayer();
                p.fromObj(pl, this);
                return p;
            } else {
                throw `invalid player class ${pl._class}`;
            }
        });
        this.board = gameObj.board.map(space => {
            var s = new _CamelUpSpace.Space(0, this.spaceSize);
            s.fromObj(space, this);
            return s;
        })
        

        
    }
    exportGame() {
        // exports game state to a json object, replaces object pointers with ids
        var players = this.players.map(pl => pl.toObj());
        var board = this.board.map(space => space.toObj());
        var camels = this.camels.map(cm => cm.toObj());
        var dt = Date.now().toString();
        var obj = {players, board, camels};
        var str = JSON.stringify(obj, null, 2)
        try {
            fs.writeFileSync(`exports/${dt}.json`, str);
        } catch (err) {
            console.error(err)
        }
        return obj;
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
        console.log(this.players.map(pl => pl.toString()))
        console.log();
        // TODO: print available bets
    }
}
exports.CamelUpGame = CamelUpGame;