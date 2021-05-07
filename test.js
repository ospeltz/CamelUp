const boardMaker = require('./board.js');


let camels = [
  {
    space: 6,
    level: 0,
    color: 'blue'
  },
  {
    space: 6,
    level: 1,
    color: 'red'
  },
  {
    space: 6,
    level: 2,
    color: 'white',
    isCrazy:true
  },
  {
    space: 3,
    level: 0,
    color: 'purple'
  },
  {
    space: 11,
    level: 0,
    color: 'yellow'
  },
  {
    space: 2,
    level: 0,
    color: 'pink',
    isCrazy: true
  }

];

boardMaker(camels);

