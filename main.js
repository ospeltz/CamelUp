const _CamelUpGame = require('./CamelUpGame.js');
const {Utilities} = require('./Utilities.js'); 

var debugInputs = [
    `bet ${Math.floor(Math.random()*5)} rnd 2`,
    `bet ${Math.floor(Math.random()*5)} rnd 2`,
    `bet ${Math.floor(Math.random()*5)} rnd 2`,
    `bet ${Math.floor(Math.random()*5)} rnd 2`,
    `bet ${Math.floor(Math.random()*5)} rnd 2`,
    `bet ${Math.floor(Math.random()*5)} rnd 2`,
    `bet ${Math.floor(Math.random()*5)} rnd 2`,
    "roll", "roll", "roll", "roll", "roll", "roll", "roll", "roll", 
    "roll", "roll", "roll", "roll", "roll", "roll", 'roll', "roll", 
    "roll", 'roll', "roll", "roll"
]
Utilities.shuffleArray(debugInputs);

var debug = () => {
    if (debugInputs.length == 0) {
        return '/gameover';
    } else {
        return debugInputs.shift();
    }
};

var cmup = new _CamelUpGame.CamelUpGame({playerNames:['oliver', "alonzo", "dylan"], userInput: debug});
cmup.printBoard();
cmup.runGame();
var obj = cmup.exportGame();
var cmup1 = new _CamelUpGame.CamelUpGame({gameObj:obj})
var obj2 = cmup1.exportGame();
console.log(JSON.stringify(obj) == JSON.stringify(obj2));
