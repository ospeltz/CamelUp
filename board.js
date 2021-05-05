const { createCanvas, loadImage } = require('canvas');
const fs = require('fs');

const canvas = createCanvas(1200,1000);
const ctx = canvas.getContext('2d');
const HEIGHT = 175;
const WIDTH = 100;
const DARK_COLOR = '#efdfbb';
const LIGHT_COLOR = '#f8f8ff';
const BORDER = "#000000";
const stack_slot = HEIGHT / 7;
const coordinateMap = createCooridanteMap();

drawBoard();
drawNumbers();

const buffer = canvas.toBuffer('image/png');
fs.writeFileSync('./board.png', buffer);



function drawBoard() {
  for(let i = 0; i < 5; i++) {
    let color = DARK_COLOR;
    if(i % 2 === 0)
      color = LIGHT_COLOR
    writeSquare(i * WIDTH, 0, color)
  }

  writeSquare(0,HEIGHT,DARK_COLOR);
  writeSquare(4 * WIDTH, HEIGHT, DARK_COLOR);

  for(let i = 1; i <= 3; i++) {
    let color = DARK_COLOR;
    if( i % 2 === 0) 
      color = LIGHT_COLOR;
    writeSquare(0, HEIGHT * i, color);
    writeSquare(4 * WIDTH, HEIGHT * i , color);
  }

  for(let i = 0; i < 5; i++) {
    let color = DARK_COLOR;
    if(i % 2 === 0)
      color = LIGHT_COLOR
    writeSquare(i * WIDTH, 4 * HEIGHT, color)
  }
  for(let i = 0; i < 8; i++) {
    let color = 'white';
    if( i % 2 === 0)
      color = 'black';
    writeSquare(i * WIDTH / 8, HEIGHT, color, WIDTH/8,WIDTH/8)
  }
  for(let i = 0; i < 8; i++) {
    let color = 'white';
    if( i % 2 === 1)
      color = 'black';
    writeSquare(i * WIDTH / 8, HEIGHT - WIDTH / 8, color, WIDTH/8,WIDTH/8)
  }
}

function drawNumbers() {
  ctx.font = '30px Arial';
  ctx.textAlign = 'center';
  ctx.fillStyle = 'black';
  for (let i = 0; i < 16; i++) {
    let {x,y} = coordinateMap.get(i);
    x += WIDTH / 2;
    y += HEIGHT / 2;
    ctx.fillText(i,x,y);

  }
}


function writeSquare(x,y,color,height=HEIGHT,width=WIDTH) {
  ctx.fillStyle = BORDER;
  ctx.fillRect(x,y,width,height);
  ctx.fillStyle = color;
  ctx.fillRect(x + 1, y + 1,width - 2, height -2)
}

function createCooridanteMap() {
  let map = new Map();
  map.set(0, { x: 0, y: 0 });
  map.set(1, { x: WIDTH, y: 0});
  map.set(2, { x: 2 * WIDTH, y: 0});
  map.set(3, { x: 3 * WIDTH, y: 0});
  map.set(4, { x: 4 * WIDTH, y: 0});
  map.set(5, { x: 4 * WIDTH, y: HEIGHT});
  map.set(6, { x: 4 * WIDTH, y: 2 * HEIGHT});
  map.set(7, { x: 4 * WIDTH, y: 3 * HEIGHT});
  map.set(8, { x: 4 * WIDTH, y: 4 * HEIGHT});
  map.set(9, { x: 3 * WIDTH, y: 4 * HEIGHT});
  map.set(10, { x: 2 * WIDTH, y: 4 * HEIGHT});
  map.set(11, { x: WIDTH, y: 4 * HEIGHT});
  map.set(12, { x: 0, y: 4 * HEIGHT });
  map.set(13, { x: 0, y: 3 * HEIGHT });
  map.set(14, { x: 0, y: 2 * HEIGHT });
  map.set(15, { x: 0, y: HEIGHT });
  return map;
}