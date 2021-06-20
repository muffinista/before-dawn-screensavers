/* @pjs pauseOnBlur="false"; */

let fireflies = [];
const minBrightness = 100;

let display_width, display_height, density;
let alpha_bump = window.urlParams['Fade Rate'] || 75; // how much to fade alpha each time we draw

let pg;

const states = ['dark', 'dark', 'blinking', 'blinking', 'blinking', 'streaming'];

function setup() {
  if ( typeof(window.urlParams) !== "undefined" ) {
    display_width = window.urlParams.width;
    display_height = window.urlParams.height;
    density = window.urlParams.density;
  }
  else {
    display_width = screen.width;
    display_height = screen.height;
  }

  if ( display_width === undefined ) {
    display_width = screen.width;
  }
  if ( display_height === undefined ) {
    display_height = screen.height;
  }

  if ( density === undefined ) {
    density = 20;
  }

  
  // note -- if you don't do this, width/height will be strings!
  display_width = parseInt(display_width, 10);
  display_height = parseInt(display_height, 10);
  
  density = parseInt(density, 10);

  // set pixel density to 1 so high-density/retina displays work alright
  pixelDensity(1);

  createCanvas(display_width, display_height);
  frameRate(30);

  for(let i = 0; i < density; i++ ) {
    const offset = noise(i) * 10000;
    const f = new Firefly(random(0, width), random(0, height));
    fireflies.push(f);
  }

  // we're going to draw to a PGraphics object, here it is
  pg = createGraphics(width, height);
  pg.noSmooth();
  pg.background(0, 0, 20);
}

function draw() {
  background(0, 0, 20);

  for (let firefly of fireflies) {
    firefly.update();
    firefly.draw(pg);
  }

  // draw the PGraphics object to the screen
  image(pg, 0, 0, width, height);

  // update alpha values
  fade();
}


/**
 * iterate through the pixels of our global PGraphic object
 * and drop the alpha values
 */
 function fade() {
  pg.loadPixels();

  // p5 stores pixels in an array split up into R, G, B, A values
  // so every 4th value is the alpha for a given pixel.
  //
  // let's iterate through each pixel and drop the alpha a bit
  //
  // for (var i = 3; i < pg.pixels.length ; i += 4) {
  for (var i = 3, len = pg.pixels.length; i < len ; i += 4) {
    let val = pg.pixels[i];
    pg.pixels[i] = val > 0 ? val - alpha_bump : 0;
  }

  pg.updatePixels();
  pg.imageData = pg.pixels = null;
}

class Firefly {
  constructor(x, y) {
    this.lastChange = 0;
    this.switchChance = random();
    this.offset = random() * 10000;
    this.acceleration = createVector(0, 0);
    this.velocity = createVector(random(-1, 1), random(-1, 1));
    this.position = createVector(x, y);
    this.r = 4 + random() * 3.0;
    this.maxspeed = 3; // Maximum speed
    this.maxforce = 0.05; // Maximum steering force
    this.minBrightness = minBrightness;
    this.switchState();
  }

  switchState() {
    this.lastChange = millis();
    this.switchChance = random();
    this.state = random(states);
  }

  update() {
    this.acceleration.x = random(-0.1, 0.1);
    this.acceleration.y = random(-0.01, 0.01);

    // Update velocity
    this.velocity.add(this.acceleration);
    this.velocity.limit(this.maxspeed);
    this.position.add(this.velocity);
    this.acceleration.mult(0);

    if ( this.position.x > width ) {
      this.position.x = this.position.x % width;
    }
    else if ( this.position.x < 0 ) {
      this.position.x = width + this.position.x;
    }

    if ( this.position.y > height ) {
      this.position.y = this.position.y % height;
    }
    else if ( this.position.y < 0 ) {
      this.position.y = width + this.position.y;
    }

    this.brightness = this.pulseFn(this, frameCount);
  }

  pulseFn(frameCount) {
    const ticks = millis();

    if ( this.lastChange + 15000 <= ticks ||
      (this.lastChange + 5000 <= ticks && random() > this.switchChance) ) {
      this.switchState();
    }

    let cyclePerSecond = TWO_PI / 1000 / 2;

    if ( this.state == 'dark' ) {
      return 0;
    }
    else if ( this.state === 'blinking' ) {
      const val = abs(sin(((this.offset + ticks) * cyclePerSecond * 0.25))) * 255;
      if ( val > 250 ) {
        return val;
      }
    }
    else if ( this.state === 'streaming' ) {
      const slowAmt = (this.offset + ticks) / 10000;
      const slowVal = (sin(slowAmt) + 1.0) * 128;
      if ( slowVal < 100 ) {
        return 0;
      }

      const amt = (this.offset + ticks) / 5;
      const val = (sin(amt) + 1.0) * 128;
      if ( val < 240 ) {
        return 0;
      }
      return val;  
    }
  }

  draw(pg) {
    if ( this.brightness >= this.minBrightness ) {
      pg.fill(40, this.brightness, 0);
      pg.ellipse(this.position.x, this.position.y, this.r, this.r);  
    }
  }
}