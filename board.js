
const { createCanvas, loadImage } = require('canvas');
const fs = require('fs');

const HEIGHT = 500;
const WIDTH = 350;
const DARK_COLOR = '#F4A460';
const LIGHT_COLOR = '#EDC9AF';
const BORDER = "#000000";
const BOARD_DIMENSION = 5;


const canvas = createCanvas(WIDTH * 5,HEIGHT * 5);
const ctx = canvas.getContext('2d');
const coordinateMap = createCooridanteMap();

module.exports = (camels) => {
  drawBlankBoard();
  drawNumbers();
  for(let camel of camels){
    drawCamel(camel);
  }

  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync('./exports/board.png', buffer);
}



function drawBlankBoard() {

  //top row
  for(let i = 0; i < 5; i++) {
    let color = DARK_COLOR;
    if(i % 2 === 0)
      color = LIGHT_COLOR
    drawRectangle(i * WIDTH, 0, color)
  }

  //middle rows
  for(let i = 1; i <= 3; i++) {
    let color = DARK_COLOR;
    if( i % 2 === 0) 
      color = LIGHT_COLOR;
    drawRectangle(0, HEIGHT * i, color);
    drawRectangle(4 * WIDTH, HEIGHT * i , color);
  }

  //last rows
  for(let i = 0; i < 5; i++) {
    let color = DARK_COLOR;
    if(i % 2 === 0)
      color = LIGHT_COLOR
    drawRectangle(i * WIDTH, 4 * HEIGHT, color)
  }


  //finish line
  for(let i = 0; i < 2; i++)
    for(let j = 0; j < 8; j++) {
      let color = 'white';
      if( (i + j) % 2 === 0)
        color = 'black';
      drawRectangle(j * WIDTH / 8, HEIGHT - WIDTH * i / 8, color, WIDTH/8,WIDTH/8)
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

function drawCamel(camel) {

  let {space, level, color, isCrazy} = camel;

  let {x,y} = coordinateMap.get(space);
  let xScale = WIDTH / -150;      //negative because i drew the camel backward
  let yScale = HEIGHT / 150;


  //margins
  x -= (27.5 - (WIDTH / xScale / 2) ) * xScale;     //weird way to center... but it works
  y += 125 * yScale;

  //move to level
  y -= level * 20 *yScale;


  // reverse if crazy
  if(isCrazy) {
    x += xScale * 55;
    xScale = xScale * -1;
  }
  

  //draw camel
  ctx.beginPath();
  ctx.moveTo(x,y);
  ctx.lineTo(x, y + 10  * yScale);
  ctx.lineTo(x + 10 * xScale, y + 9  * yScale);
  ctx.lineTo(x + 15 * xScale, y + 20 * yScale);
  ctx.lineTo(x + 20 * xScale, y + 20 * yScale);
  ctx.lineTo(x + 25 * xScale, y + 10 * yScale);
  ctx.lineTo(x + 30 * xScale, y + 10 * yScale);
  ctx.lineTo(x + 35 * xScale, y + 20 * yScale);
  ctx.lineTo(x + 40 * xScale, y + 20 * yScale);
  ctx.lineTo(x + 45 * xScale, y + 10 * yScale);
  ctx.lineTo(x + 48 * xScale, y + 10 * yScale);
  ctx.lineTo(x + 46 * xScale, y + 8  * yScale);
  ctx.quadraticCurveTo(x + 49 * xScale , y + 8 *yScale,x + 52 * xScale , y + 5 *yScale);
  ctx.lineTo(x + 50 * xScale, y - 10 * yScale);
  ctx.lineTo(x + 45 * xScale, y - 10 * yScale);
  ctx.lineTo(x + 40 * xScale, y);
  ctx.lineTo(x + 35 * xScale, y);
  ctx.lineTo(x + 30 * xScale, y - 10 * yScale);
  ctx.lineTo(x + 25 * xScale, y - 10 * yScale);
  ctx.lineTo(x + 20 * xScale, y);
  ctx.lineTo(x + 15 * xScale, y);
  ctx.lineTo(x + 10 * xScale, y - 10 * yScale);
  ctx.lineTo(x + 8  * xScale, y - 1  * yScale);
  ctx.lineTo(x,y);

  ctx.fillStyle = color;
  ctx.fill();
  ctx.stroke();


  //eye
  ctx.beginPath();
  ctx.arc(x + 4 * xScale , y + 2 * yScale, yScale, 0, 2 * Math.PI);
  ctx.fillStyle = 'black';
  ctx.fill();


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
