const { createCanvas, loadImage, Font } = require('canvas');
const fs = require('fs');

const HEIGHT = 250;
const WIDTH = 175;
const DARK_COLOR = '#F4A460';
const LIGHT_COLOR = '#EDC9AF';
const BORDER = "#000000";
const BOARD_DIMENSION = 5; //note that changing this will fuck *everything* up


const canvas = createCanvas(WIDTH * BOARD_DIMENSION, HEIGHT * BOARD_DIMENSION);
const ctx = canvas.getContext('2d');
const coordinateMap = createCooridanteMap();

module.exports = async (board) => {
  const {camels, tiles } = board;
  drawBlankBoard();
  drawNumbers();
  for(let tile of tiles)
    await drawSpectatorCard(tile);
  for(const [i, camel] of camels.entries()){
    drawCamel(camel);
    if(!camel.hasRolled) 
      drawDie(i, camel.color);  
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
  for(let i = 0; i < 3; i++) {
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

function drawDie(index, color) {
  let x = WIDTH + 2 * HEIGHT / 5 + HEIGHT / 6;
  let y = 7 * HEIGHT / 5 + HEIGHT / 6;
  y += Math.floor( index / 2 ) * ( HEIGHT / 2 );
  if(index % 2 === 1) 
    x += WIDTH;
  
  drawRectangle(x, y, color, HEIGHT / 4, HEIGHT / 4, 1);
  ctx.font = 'bold 30px Arial';
  ctx.textAlign = 'center';
  ctx.fillStyle = isDark(color)? 'white': 'black';
  ctx.fillText(Math.floor(Math.random() * 3 + 1), x + HEIGHT / 8, y + HEIGHT / 6);
}

function drawCamel(camel) {

  let { space, level, color, isCrazy } = camel;

  let { x, y } = coordinateMap.get(space);
  let xScale = WIDTH / -150;      //negative because I drew the camel backward
  let yScale = HEIGHT / 150;


  //margins
  x -= (27.5 - (WIDTH / xScale / 2) ) * xScale;     //weird way to center... but it works
  y += 125 * yScale;

  //move to level
  y -= level * 20 * yScale;


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
  ctx.lineTo(x + 25 * xScale, y + 13 * yScale);
  ctx.lineTo(x + 30 * xScale, y + 13 * yScale);
  ctx.lineTo(x + 35 * xScale, y + 20 * yScale);
  ctx.lineTo(x + 40 * xScale, y + 20 * yScale);
  ctx.quadraticCurveTo(x + 49 * xScale , y + 8 *yScale,x + 52 * xScale , y + 5 *yScale);
  ctx.lineTo(x + 50 * xScale, y - 10 * yScale);
  ctx.lineTo(x + 45 * xScale, y - 10 * yScale);
  ctx.lineTo(x + 40 * xScale, y - 3 * yScale);
  ctx.lineTo(x + 35 * xScale, y - 3 * yScale);
  ctx.lineTo(x + 30 * xScale, y - 10 * yScale);
  ctx.lineTo(x + 25 * xScale, y - 10 * yScale);
  ctx.lineTo(x + 20 * xScale, y - 3 * yScale);
  ctx.lineTo(x + 15 * xScale, y - 3 * yScale);
  ctx.lineTo(x + 10 * xScale, y - 10 * yScale);
  ctx.lineTo(x + 8  * xScale, y - 10  * yScale);
  ctx.lineTo(x + 6  * xScale, y - 1  * yScale);
  ctx.lineTo(x,y);

  ctx.fillStyle = color;
  ctx.fill();
  ctx.stroke();


  //eye
  ctx.beginPath();
  ctx.arc(x + 4 * xScale , y + 2 * yScale, yScale, 0, 2 * Math.PI);
  ctx.fillStyle = isDark(color)? 'white': 'black';
  ctx.fill();


}

function drawSpectatorCard(tile) {
  const { space, photoUrl, type } = tile;
  const color = tile.color? tile.color: '#d0b7ac';
  const scale = HEIGHT / 20;
  let { x, y } = coordinateMap.get(space);

  //set starting point
  x += 2 * scale;
  y += 10 * scale;

  //draw the outline
  ctx.fillStyle = BORDER;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + 1 * scale, y + 3 * scale);
  ctx.lineTo(x + 9 * scale, y + 3 * scale);
  ctx.lineTo(x + 10 * scale, y);
  ctx.lineTo(x + 9 * scale, y - 3 * scale);
  ctx.lineTo(x + 1 * scale, y - 3 * scale);
  ctx.lineTo(x, y);
  ctx.fillStyle = color;
  ctx.fill();
  ctx.stroke();

  
  ctx.textAlign = 'center';
  ctx.font = `bold ${HEIGHT/12.5}px Helvetica-Neue`;
  if(type === 'desert') {
    ctx.fillStyle = 'green';
    ctx.fillText('+1', x + 2 * scale, y + 5);
  }
  else if(type === 'mirage') {
    ctx.fillStyle = 'red';
    ctx.fillText('-1', x + 2 * scale, y + 5);
  }
  loadImage(photoUrl).then((image) => {
    ctx.drawImage(image, x + 7 * scale - HEIGHT / 14, y - HEIGHT / 14, HEIGHT / 7, HEIGHT / 7)

    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync('./exports/board.png', buffer);

  })
}

function drawRectangle(x, y, color, height=HEIGHT, width=WIDTH, borderThickness=2) {
  ctx.fillStyle = BORDER;
  ctx.fillRect(x,y,width,height);
  ctx.fillStyle = color;
  ctx.fillRect(x + borderThickness, 
    y + borderThickness, 
    width - 2 * borderThickness, 
    height - 2 * borderThickness
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

function isDark(color) {
  if(color === 'black' || color === 'blue' || color === 'purple')
    return true;
  return false;
}
