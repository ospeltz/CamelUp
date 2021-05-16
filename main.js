const _CamelUpGame = require('./CamelUpGame.js');
const {Utilities} = require('./Utilities.js'); 

var debugInputs = [
    `bet ${Math.floor(Math.random()*5)} rnd 2`,
    "bet 3 rnd 2",
    "roll",
    "roll",
    "roll",
    "roll",
    `bet ${Math.floor(Math.random()*5)} rnd 2}`,
    "roll",
    'roll',
    "roll",
    "roll",
    `bet ${Math.floor(Math.random()*5)} rnd 2}`,
    'roll',
    "roll",
    "roll"
]
Utilities.shuffleArray(debugInputs);

var debug = (prompt) => {
    if (debugInputs.length == 0) {
        return '/export';
    } else {
        return debugInputs.pop();
    }
};

var cmup = new _CamelUpGame.CamelUpGame({playerNames:['oliver', "alonzo"], userInput: debug});
cmup.printBoard();
cmup.runGame();
