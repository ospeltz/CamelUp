
const { createCanvas, loadImage } = require('canvas');
const fs = require('fs');

const HEIGHT = 350;
const WIDTH = 250;
const DARK_COLOR = '#F4A460';
const LIGHT_COLOR = '#EDC9AF';
const BORDER = "#000000";
const N_CAMELS = 5;


const canvas = createCanvas(WIDTH * 5,HEIGHT * 5);
const ctx = canvas.getContext('2d');
const coordinateMap = createCooridanteMap();
// let camels = [
//   {
//     space: 6,
//     level: 0,
//     color: 'blue'
//   },
//   {
//     space: 6,
//     level: 1,
//     color: 'red'
//   },
//   {
//     space: 6,
//     level: 2,
//     color: 'white'
//   },
//   {
//     space: 3,
//     level: 0,
//     color: 'purple'
//   },
//   {
//     space: 11,
//     level: 0,
//     color: 'yellow'
//   }

// ];

//getCurrentBoard(camels);

function getCurrentBoard(camels)  {
  drawBlankBoard();
  drawNumbers();
  for(let camel of camels){
    drawCamel(camel.space,camel.level,camel.color)
  }

  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync('./board.png', buffer);
}



function drawBlankBoard() {
  for(let i = 0; i < 5; i++) {
    let color = DARK_COLOR;
    if(i % 2 === 0)
      color = LIGHT_COLOR
    drawRectangle(i * WIDTH, 0, color)
  }

  drawRectangle(0,HEIGHT,DARK_COLOR);
  drawRectangle(4 * WIDTH, HEIGHT, DARK_COLOR);

  for(let i = 1; i <= 3; i++) {
    let color = DARK_COLOR;
    if( i % 2 === 0) 
      color = LIGHT_COLOR;
    drawRectangle(0, HEIGHT * i, color);
    drawRectangle(4 * WIDTH, HEIGHT * i , color);
  }

  for(let i = 0; i < 5; i++) {
    let color = DARK_COLOR;
    if(i % 2 === 0)
      color = LIGHT_COLOR
    drawRectangle(i * WIDTH, 4 * HEIGHT, color)
  }
  for(let i = 0; i < 8; i++) {
    let color = 'white';
    if( i % 2 === 0)
      color = 'black';
    drawRectangle(i * WIDTH / 8, HEIGHT, color, WIDTH/8,WIDTH/8)
  }
  for(let i = 0; i < 8; i++) {
    let color = 'white';
    if( i % 2 === 1)
      color = 'black';
    drawRectangle(i * WIDTH / 8, HEIGHT - WIDTH / 8, color, WIDTH/8,WIDTH/8, 1)
  }



  //draw pyramid
  for(let i = 0; i < 5; i++) {
    let m = (HEIGHT / 5) * i;
    drawRectangle(WIDTH + m , HEIGHT + m, "#E1A95F", 3 * HEIGHT - (2 * m),  3 * WIDTH - (2 * m), 4 );
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

function drawCamel(space, stack_level,color) {
  let {x,y} = coordinateMap.get(space);
  x += WIDTH *.25;
  y += HEIGHT * .8;
  scale = HEIGHT / 150;
  y -= stack_level * 20 * scale;
  
  ctx.setLineDash([]);
  ctx.strokeStyle = 'black';
  ctx.beginPath();
  ctx.moveTo(x,y);
  ctx.lineTo(x + 0  * scale, y + 5  * scale);
  ctx.lineTo(x + 5  * scale, y + 4  * scale);
  ctx.lineTo(x + 5  * scale, y + 10 * scale);
  ctx.lineTo(x + 10 * scale ,y + 20 * scale);
  ctx.lineTo(x + 15 * scale, y + 20 * scale);
  ctx.lineTo(x + 20 * scale, y + 10 * scale);
  ctx.lineTo(x + 25 * scale, y + 10 * scale);
  ctx.lineTo(x + 30 * scale, y + 20 * scale);
  ctx.lineTo(x + 35 * scale, y + 20 * scale);
  ctx.lineTo(x + 40 * scale, y + 10 * scale);
  ctx.lineTo(x + 43 * scale, y + 10 * scale);
  ctx.lineTo(x + 41 * scale, y + 8  * scale);
  ctx.quadraticCurveTo(x + 44 * scale, y + 8 * scale,x + 47 * scale, y + 5 * scale);
  //ctx.lineTo(x + 47 * scale, y + 5 * scale);
  ctx.lineTo(x + 45 * scale, y - 10 * scale);
  ctx.lineTo(x + 40 * scale, y - 10 * scale);
  ctx.lineTo(x + 35 * scale, y);
  ctx.lineTo(x + 30 * scale, y);
  ctx.lineTo(x + 25 * scale, y - 10 * scale);
  ctx.lineTo(x + 20 * scale, y - 10 * scale);
  ctx.lineTo(x + 15 * scale, y + 0 * scale);
  ctx.lineTo(x + 10 * scale, y + 0 * scale);
  ctx.lineTo(x + 5  * scale, y - 10 * scale);
  ctx.lineTo(x + 3  * scale, y - 1 * scale);
  ctx.lineTo(x,y);

  ctx.fillStyle = color;
  
  ctx.fill();
  ctx.stroke();
}




function drawRectangle(x,y,color,height=HEIGHT,width=WIDTH,border_thickness=2) {
  ctx.fillStyle = BORDER;
  ctx.fillRect(x,y,width,height);
  ctx.fillStyle = color;
  ctx.fillRect(x + border_thickness, 
    y + border_thickness, 
    width - 2 * border_thickness, 
    height - 2 * border_thickness
  );
}

function createCooridanteMap() {
  let map = new Map();
  map.set(0,  { x: 0 * WIDTH, y: 0 * HEIGHT });
  map.set(1,  { x: 1 * WIDTH, y: 0 * HEIGHT });
  map.set(2,  { x: 2 * WIDTH, y: 0 * HEIGHT });
  map.set(3,  { x: 3 * WIDTH, y: 0 * HEIGHT });
  map.set(4,  { x: 4 * WIDTH, y: 0 * HEIGHT });
  map.set(5,  { x: 4 * WIDTH, y: 1 * HEIGHT });
  map.set(6,  { x: 4 * WIDTH, y: 2 * HEIGHT });
  map.set(7,  { x: 4 * WIDTH, y: 3 * HEIGHT });
  map.set(8,  { x: 4 * WIDTH, y: 4 * HEIGHT });
  map.set(9,  { x: 3 * WIDTH, y: 4 * HEIGHT });
  map.set(10, { x: 2 * WIDTH, y: 4 * HEIGHT });
  map.set(11, { x: 1 * WIDTH, y: 4 * HEIGHT });
  map.set(12, { x: 0 * WIDTH, y: 4 * HEIGHT });
  map.set(13, { x: 0 * WIDTH, y: 3 * HEIGHT });
  map.set(14, { x: 0 * WIDTH, y: 2 * HEIGHT });
  map.set(15, { x: 0 * WIDTH, y: 1 * HEIGHT });
  return map;
}

