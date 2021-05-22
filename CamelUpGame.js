const _CamelUpPlayer = require('./CamelUpPlayer.js');
const _CamelUpSpace = require('./CamelUpSpace.js')
const input = require('prompt-sync')();
const { Utilities } = require('./Utilities.js');
const fs = require('fs');

// TODO: make everything private variables
const COLORS = ['blue', 'red', 'yellow', 'green', 'purple', 'black', 'white'];

class CamelUpGame {
    board;
    camels;
    players;
    gameOver;
    spaceSize;
    userInput;
    roomId;
    currTurn;
    currRound;
    
    constructor({
            playerNames=[], // an array of strings
            nCamels=5,
            nCrazyCamels=2,
            boardSize=15,
            roundBetValues=[2, 1.5],
            roomId, // discord room number
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

        this.roomId = Math.random(); // will need this eventually
        this.currTurn = 0;
        this.currRound = 1;
        this.spaceSize = 6; // the number of characters taken up by a space on the board
        this.gameOver = false;

        if (gameObj !== null) {
            this.importGame(gameObj);
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
            this.currTurn++;
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
            else if (args[0] == '/export') // should also protect this from the user
                finished = this.exportGame().board.length == this.board.length;
            else if (args[0] == '/gameover') // TODO cant let the user use this
                finished = this.endGame()
            else
                console.log('invalid input');
        }
    }

    endRound() {
        // makes all camels rollable again, rewards players for round bets, removes spectator tokens
        var ranking = this.orderCamels(true);
        this.camels.forEach(cam => {cam.endRound(ranking);});
        this.currRound++;
    }

    endGame() {
        this.gameOver = true;
        return true;
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
        // gets input from the user, adds a way to exit the program
        // TODO probablt don't need the /end command any more
        var str = this.userInput(prompt);
        if (str == "/end") process.exit();
        return str;
    }

    nextPlayer() {
        // puts the first player at the end of the list
        this.players.push(this.players.shift());
    }

    orderCamels(removeCrazy=false) {
        // returns an array of Camel objects in their ranks, ie first place at index 0 and so on
        // if remove crazy is true, returns an array with no crazy camels in it
        var cams = [];
        this.board.forEach(space => {
            var curr = space.stack;
            while (curr != null) {
                if (!curr.crazy || !removeCrazy)
                    cams.unshift(curr);
                curr = curr.stack;
            }
        });
        return cams;
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

    getPlayer(id) {
        // returns the player with the matching id, undefined otherwise
        for (var i = 0; i < this.players.length; i++) {
            if (this.players[i].id === id)
                return this.players[i];
        }
    }

    importGame(gameObj, fromFP=false) {
        if (fromFP) {
            var str = fs.readFileSync(gameObj);
            gameObj = JSON.parse(str)
        }
        this.players = gameObj.players.map(pl => {
            if (pl._class == "BasePlayer") {
                var p = new _CamelUpPlayer.CamelUpPlayer();
                p.fromObj(pl);
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
        this.camels = this.orderCamels();        
    }

    toBoardMaker() {
        // exports the game state in a format for the BoardMaker to read
        var cams = [];
        this.board.forEach(sp => {
            var curr = sp.stack;
            var lvl = 0;
            while (curr !== null) {
                cams.push({
                    space: sp.id,
                    level: lvl,
                    color: COLORS[curr.id],
                    isCrazy: curr.crazy
                })
                curr = curr.stack;
                lvl++;
            }
        })
        return cams;
    }

    exportGame() {
        // exports game state to a json object, replaces object pointers with ids
        var players = this.players.map(pl => pl.toObj());
        var board = this.board.map(space => space.toObj());
        var camels = this.orderCamels().map(cm => cm.toObj());
        var obj = {
            roomId: this.roomId,
            currRound: this.currRound,
            currTurn: this.currTurn,
            players, 
            board, 
            camels,
        };
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