const MAX_CLOUDS = 6;

const WAVE_DIP = 20;
const WAVE_AMPLITUDE = 2.75;
const WAVE_CYCLES = 8;
const WAVE_LAYER_COUNT = 6;
const WAVE_OVERLAP = 15;

const CLOUD_AREA = 0.25;
const CLOUD_SIZE = 2;
const CLOUD_GREY = 255;

let clouds = [];
let waveLayers = [];
let waveSpeed = 1;
let waveWidth = 120;
let waveHeight = 80;
let waveCount = 6;

let waveColor;
let waveStroke;

let backgroundColor;

function setup() {
  // figure out the screen dimensions
  if ( typeof(window.urlParams) !== "undefined" ) {
    w = window.urlParams.width;
    h = window.urlParams.height;
  }
  else {
    w = screen.width;
    h = screen.height;
  }

  // note -- if you don't do this, width/height will be strings!
  w = parseInt(w, 10);
  h = parseInt(h, 10);

  createCanvas(w, h);
  frameRate(30);

  backgroundColor = color(128, 128, 255);
  waveColor = color(0, 0, 255);
  waveStroke = color(0);

  waveCount = (width / waveWidth) + 2;
  waveLayers = [];


  for ( let i = 0; i < MAX_CLOUDS; i++ ) {
    addCloud();
  }

  for ( let i = 0; i < WAVE_LAYER_COUNT; i++ ) {
    waveLayers.push([]);
  }
  for ( let i = 0; i < WAVE_LAYER_COUNT; i++ ) {
    for ( let j = 0; j < waveCount; j++ ) {
      addWave(i, j, waveWidth * i * 0.25);
    }
  }
}

function draw() {
  background(backgroundColor);

  drawClouds();
  for ( let i = WAVE_LAYER_COUNT - 1; i >= 0; i-- ) {
    drawWaveLayer(i);
  }
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
  if ( x === undefined ) {
    x = random(0, width);
  }
  let y = random(-60, height * CLOUD_AREA);
  let speed = 0.2 + random() * 0.8;
  clouds.push(new Cloud(x, y, CLOUD_SIZE, speed));
}

function addWave(layer, offset, wiggle) {
  let y = height + WAVE_DIP;
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
  }

  x = x + wiggle;
  waveLayers[layer].push(new Wave(x, y, speed));
}

class Cloud {
  constructor(x, y, size, speed) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.speed = speed;
    this.drawBottom = true;
    this.segmentWidth = 35;

    let offsetX = this.segmentWidth;
    let segmentX = [0 + offsetX, 10 + offsetX, 25 + offsetX, 40 + offsetX];
    let topOffsets = [
      random(15, 30),
      random(25, 55),
      random(25, 55),
      random(15, 30)
    ];
    let bottomOffsets = [
      random(15, 30),
      random(25, 55),
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
    this.sprite.fill(CLOUD_GREY);
    this.sprite.stroke(CLOUD_GREY);
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

  get dead() {
    if ( this.speed > 0 ) {
      return this.x > width;
    }

    return this.x < -this.sprite.width;
  }
}

class Wave {
  constructor(x, y, speed) {
    this.x = x;
    this.y = y;
    this.width = waveWidth;
    this.height = waveHeight;
    this.speed = speed;
  }

  draw() {
    const lines = [1.0, 0.75, 0.5, 0.25];

    let a = lerp(0, TWO_PI * WAVE_CYCLES, this.x/width);
    let y = this.y + sin(a) * WAVE_AMPLITUDE;
    fill(waveColor);

    arc(this.x, y, this.width + WAVE_OVERLAP, this.height, PI, 0);
    noFill();
    stroke(waveStroke);

    for ( var i = 0; i < lines.length; i++ )  {
      arc(this.x, y, this.width * lines[i] + WAVE_OVERLAP, this.height * lines[i], PI, 0);
    }
  }

  move() {
    this.x = this.x + this.speed;
  }

  get dead() {
    if ( this.speed > 0 ) {
      return this.x - this.width/2 > width;
    }

    return this.x < -this.width;
  }
}
