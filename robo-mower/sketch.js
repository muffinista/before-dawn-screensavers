

const GRASS_HEIGHT = 15;
const GRASS_PER_FRAME = 10;
const MOWER_WIDTH = 80;
const MOWER_SPEED = 4.0;
const MIN_DELAY_SECONDS = 1;
const MAX_DELAY_SECONDS = 8;

let mower;
let lawn;
let mowerTicks;

// load any incoming URL parameters. you could just use the
// URLSearchParams object directly to manage these variables, but
// having them in a hash is a little easier sometimes.
var tmpParams = new URLSearchParams(document.location.search);
window.urlParams = {};

for(let k of tmpParams.keys() ) {
  window.urlParams[k] = tmpParams.get(k);
}

var getParam = function(key, defaultValue) {
  if ( typeof(window.urlParams[key]) !== 'undefined' ) {
    return parseInt(window.urlParams[key], 10);
  }
  return defaultValue;
}

/**
 * setup the canvas in either fullscreen mode, or fit the div wrapper
 */
function setup() {
  var wrapper = document.querySelector('#wrapper');
  var w, h, c;

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

  c = createCanvas(w, h);
  c.parent('wrapper');

  // LEARN FROM MY MISTAKES!!!! Set the pixel density to 1
  // by default to handle random math issues on retina displays
  // if you're doing direct pixel manipulation or other weird
  // stuff. if you don't think you're going to do that, then
  // you can remove this
  pixelDensity(1);

  background(0, 10, 0);

  lawn = createGraphics(width, height);
  mower = new Mower(MOWER_SPEED, MOWER_WIDTH);
  mower.offscreen = true;
  setMowerDelay();
}

function setMowerDelay() {
  mowerTicks = frameCount + random(MIN_DELAY_SECONDS * frameRate(), MAX_DELAY_SECONDS * frameRate());
}

function draw() {
 drawGrass(GRASS_PER_FRAME);
 if (mower.onscreen) {
  mower.update();
  mower.mow();
  if ( !mower.onscreen ) {
    setMowerDelay();
  } 
 } else if (frameCount >= mowerTicks) {
    mower.reset();
 }

  image(lawn, 0, 0);

  if (mower.onscreen) {
    mower.render();
  }
}

function drawGrass(count) {
  lawn.stroke(0, 255, 0);
  for ( let i = 0; i < count; i++ ) {
    const x1 = random(0, width);
    const y1 = random(0, height);
  
    const x2 = x1 + random(-2, 2);
    const y2 = y1 + random(GRASS_HEIGHT / 2, GRASS_HEIGHT);
  
    lawn.curve(x1 + wiggle(), y1 + wiggle(), x1, y1, x2, y2, x2, y2);  
  }
}

function wiggle() {
  return random(-5, 5);
}

class Mower {
  constructor(speed, width) {
    this.position = createVector(0, 0);
    this.speed = speed;
    this.width = width;
    this.depth = 10;
    this.sprite = this.generateSprite();

    this.reset();
  }

  update() {
    this.position.add(this.velocity);   
    this.onscreen = this.position.x >= 0 && this.position.x < width &&
      this.position.y >= 0 && this.position.y < height;
  }

  reset() {
    this.pickSide();
    this.setVelocity();
    console.log(this.velocity, this.position);
    this.onscreen = true;
  }

  pickSide() {
    const val = random();
    if ( val < 0.25 ) {
      console.log('1 -- down from top');
      this.position.x = random(0, width);
      this.position.y = 0;
      this.angle = 0;
      this.mowerAngle = 0;
      this.boxWidth = this.width;
      this.boxHeight = this.depth;
    } else if ( val < 0.50 ) {
      console.log('2 -- up from bottom?');
      this.position.x = random(0, width);
      this.position.y = height;
      this.angle = PI;
      this.mowerAngle = PI;
      this.boxWidth = this.width;
      this.boxHeight = this.depth;
    } else if ( val < 0.75 ) {
      console.log('3 -- from the left');
      this.position.x = 0;
      this.position.y = random(0, height);
      this.angle = PI/2;
      this.boxWidth = this.depth;
      this.boxHeight = this.width;
    }
    else {
      console.log('4 -- from the right');
      this.position.x = width;
      this.position.y = random(0, height);
      this.angle = -PI/2;
      this.boxWidth = this.depth;
      this.boxHeight = this.width;
    }
  }

  setVelocity() {
    this.velocity = createVector(
      this.speed * sin(this.angle),
      this.speed * cos(this.angle)
    );
  }

  mow() {
    lawn.fill(0, 10, 0);
    lawn.stroke(0, 10, 0);

    lawn.rectMode(CENTER);
    lawn.push();
    lawn.translate(width/2, height/2);
    lawn.rect(this.position.x - width/2, this.position.y - height/2, this.boxWidth, this.boxHeight);
    lawn.pop();
  }

  render() {
    push();
    translate(width/2, height/2);
    imageMode(CENTER);
    image(this.sprite, this.position.x - width/2, this.position.y - height/2, this.width, this.width);
    pop();
  }

  //
  // https://editor.p5js.org/muffinista/sketches/H3sVHIEYq
  //
  generateSprite() {
    const s = createGraphics(400, 400);
    s.background(0,0,0,0);
  
    s.translate(200, 200);
    s.rectMode(CENTER);
    
    s.fill('#c9491c');
  //  rect(0, 0, 380, 380, 100, 100, 10, 10);
  //  rect(0, 0, 380, 380, 100, 100, 100, 100);
  s.ellipse(0, 0, 400, 400)
    
    // fill(20, 20, 20);
    // rect(-175, 100, 40, 100);
    // rect(175, 100, 40, 100);
  
    s.fill('#153862');
    s.ellipse(0, 0, 150, 150);
  //  arc(0, -100, 100, 100, PI, 0)
  
    s.noFill();
    s.strokeWeight(6);
    s.curve(-400, 0, -40, -100, 40, -100, 400, 0)
    s.curve(-400, 0, -40, -120, 40, -120, 400, 0)
    s.curve(-400, 0, -40, -140, 40, -140, 400, 0)
  
    //curve(-400, 0, -40, -80, 40, -80, 400, 0)
    s.rotate(PI/2);
    s.curve(-400, 0, -40, -100, 40, -100, 400, 0)
    s.curve(-400, 0, -40, -120, 40, -120, 400, 0)
    s.curve(-400, 0, -40, -140, 40, -140, 400, 0)
    s.rotate(PI/2);
    s.curve(-400, 0, -40, -100, 40, -100, 400, 0)
    s.curve(-400, 0, -40, -120, 40, -120, 400, 0)
    s.curve(-400, 0, -40, -140, 40, -140, 400, 0)
    s.rotate(PI/2);
    s.curve(-400, 0, -40, -100, 40, -100, 400, 0)
    s.curve(-400, 0, -40, -120, 40, -120, 400, 0)
    s.curve(-400, 0, -40, -140, 40, -140, 400, 0)
  
    s.strokeWeight(1);
    
    return s;
  }
}