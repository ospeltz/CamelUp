const _CamelUpGame = require('./CamelUpGame.js');
const {Utilities} = require('./Utilities.js'); 
const getCurrentBoard = require('./BoardMaker.js')
const fs = require('fs');

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
];
Utilities.shuffleArray(debugInputs);

var debug = () => {
    if (debugInputs.length == 0) {
        return '/gameover';
    } else {
        return debugInputs.shift();
    }
};

var cmup = new _CamelUpGame.CamelUpGame({playerNames:['oliver', "alonzo", "dylan"], userInput: debug});
cmup.runGame();
var str = JSON.stringify(cmup.exportGame(), null, '\t');
try {
    fs.writeFileSync('./exports/game_state.json', str)
} catch {
    console.log('write file failed');
}
let board = {}
board.camels = cmup.toBoardMaker();
board.tiles = [];
getCurrentBoard(board);

