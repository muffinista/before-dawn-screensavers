const MAX_CLOUDS = 10;
const MAX_WAVES = 6;

let clouds = [];
let waveLayers = [];
let waveSpeed = 1;
let waveWidth = 160;

function setup() {
  createCanvas(720, 480);
  frameRate(30);

  for ( let i = 0; i < MAX_CLOUDS; i++ ) {
    addCloud();
  }

  waveLayers = [[], [], [], []];
  for ( let i = 0; i < MAX_WAVES; i++ ) {
    addWave(0, i);
  }
  for ( let i = 0; i < MAX_WAVES; i++ ) {
    addWave(1, i);
  }
  for ( let i = 0; i < MAX_WAVES; i++ ) {
    addWave(2, i, waveWidth / 2);
  }
  for ( let i = 0; i < MAX_WAVES; i++ ) {
    addWave(3, i, waveWidth / 2);
  }

}

function draw() {
  let i;

  // put drawing code here
  background(128, 128, 255);

  drawClouds();
  drawWaveLayer(3);
  drawWaveLayer(2);
  drawWaveLayer(1);
  drawWaveLayer(0);
}

function drawClouds() {
  let i = clouds.length;
  while (i--) {
    let c = clouds[i];
    if ( c.dead ) {
      clouds.splice(i, 1);
      addCloud(0);
    }
    else {
      c.draw();
      c.move();
    }
  }
}

function drawWaveLayer(index) {
  i = waveLayers[index].length;
  while (i--) {
    let w = waveLayers[index][i];
    if ( w.dead ) {
      waveLayers[index].splice(i, 1);
      addWave(index);
    }
    else {
      w.draw();
      w.move();
    }
  }
}

function addCloud(x) {
  let size = 1;
  if ( x === undefined ) {
    x = random(0, width);
  }
  let y = random(-10, height * 0.25);
  let speed = random() * 0.8;
  clouds.push(new Cloud(x, y, size, speed));
}

function addWave(layer, offset, wiggle) {
  let size = 1;
  let y = height;
  let speed = waveSpeed;
  let x = -waveWidth;
  if ( wiggle === undefined ) {
    wiggle = 0;
  }

  let offsetY = layer * 10;
  y = y - offsetY;

  if ( offset !== undefined ) {
    x = width - offset * waveWidth;
  }

  if ( layer % 2 == 1 ) {
    speed *= -1;
    x = width + waveWidth/2;

    if ( offset !== undefined ) {
      x = width - offset * waveWidth;
    }
  
    // 
    // width - (i * waveWidth) - waveWidth / 2
  }

  x = x + wiggle;
  waveLayers[layer].push(new Wave(x, y, size, speed));
}

class Cloud {
  constructor(x, y, size, speed) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.speed = speed;
    this.drawBottom = true;
    this.segmentWidth = 35;

    let offsetX =  20;
    let segmentX = [0 + offsetX, 10 + offsetX, 25 + offsetX, 40 + offsetX];
    let topOffsets = [
      random(15, 25),
      random(25, 45),
      random(25, 55),
      random(15, 30)
    ];
    let bottomOffsets = [
      random(15, 25),
      random(25, 45),
      random(25, 55),
      random(15, 30)
    ];
    let baseY = 35;
    let maxBottom = max(bottomOffsets);

    let expectedWidth = (this.segmentWidth * segmentX.length) + segmentX[0];
    let expectedHeight = baseY + maxBottom;

    this.renderWidth = expectedWidth * this.size;
    this.renderHeight = expectedHeight * this.size;

    this.sprite = createGraphics(expectedWidth + 1, expectedHeight + 1);
    this.sprite.fill(255);
    this.sprite.stroke(255);
    this.x = this.x - this.sprite.width;
  
    for ( let i = 0; i < segmentX.length; i++ ) {
      let x = segmentX[i];
      let offset = topOffsets[i];

      this.sprite.arc(x, baseY, this.segmentWidth, offset, PI, TWO_PI);
      
      if ( this.drawBottom ) {
        let bottomOffset = bottomOffsets[i];
        this.sprite.arc(x, baseY - 1, this.segmentWidth, bottomOffset, 0, PI);
      }  
    }
  }

  draw() {
    image(this.sprite, this.x, this.y, this.renderWidth, this.renderHeight);
  }

  move() {
    this.x = this.x + this.speed;
  }

  setPos(x, y) {
    this.x = x;
    this.y = y;
  }

  get dead() {
    if ( this.speed > 0 ) {
      return this.x > width;
    }

    return this.x < -this.sprite.width;
  }
}


class Wave {
  constructor(x, y, size, speed) {
    this.x = x;
    this.y = y;
    this.width = waveWidth;
    this.size = size;
    this.speed = speed;
  }

  draw() {
    let y = this.y + sin(this.x/15) * 1.75;

    fill(0, 0, 255);

    arc(this.x, y, this.width + 5, this.width + 5, PI, 0);
    noFill();
    stroke(0);
    const lines = [160, 120, 80, 40];
    for ( var i = 0; i < lines.length; i++ )  {
      arc(this.x, y, lines[i] + 5, lines[i] + 5, PI, 0);
    }
  }

  move() {
    this.x = this.x + this.speed;
  }

  setPos(x, y) {
    this.x = x;
    this.y = y;
  }

  get dead() {
    if ( this.speed > 0 ) {
      return this.x - this.width/2 > width;
    }

    return this.x < -this.width;
  }
}
