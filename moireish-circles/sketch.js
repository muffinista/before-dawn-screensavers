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

let EMITTER_COUNT = getParam('Emitter Count', 3);
let MIN_SPEED = getParam('Min Speed', 2);
let MAX_SPEED = getParam('Max Speed', 4);
let MIN_DELAY = getParam('Min Delay', 5);
let MAX_DELAY = getParam('Max Delay', 30);

const EMITTER_MARGIN = 0.25;
const MIN_BRIGHT = 64;
const MAX_BRIGHT = 200; //255;
const STROKE_WEIGHT = 4;
const USE_SMOOTHING = true;

const EMITTER_DIST = 40;
const EMITTER_MIN_GAP = 10;

let BLEND_MODE; // this will be defined later

var emitters = [];

/**
 * return a random number between min and max, but at least
 * pad amount away from zero
 */
function nonZeroRandom(min, max, pad) {
  var val = 0;
  while ( Math.abs(val) < pad ) {
    val = random(min, max);
  }
  return val;
}

/**
 * An Emitter emits circles that expand out from a given spot over
 * time.
 */
function Emitter(_x, _y, _radius, _stroke, _speed, _delay) {
  this.circles = [0];
  this.x = _x;
  this.y = _y;
  this.maxRadius = _radius;
  this.stroke = _stroke
  this.speed = _speed;
  this.add_delay = _delay;
}

Emitter.prototype.update = function() {
  // update radius of our circles, and toss any that are bigger
  // than our maximum radius
  for ( var i = this.circles.length - 1; i >= 0; i-- ) {
    if ( this.circles[i] > this.maxRadius ) {
      this.circles.splice(i, 1);
    }
    else {
      this.circles[i] += this.speed;
    }
  }
  
  // if it's time, add anothe circle
  if ( frameCount % this.add_delay == 0 ) {    
    this.circles.push(0);
  }
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

  // use HSB for colors
  colorMode(HSB);

  BLEND_MODE = DIFFERENCE;
  
  // funky blending!
  blendMode(BLEND_MODE);

  strokeWeight(STROKE_WEIGHT);
  noFill();

  // smoothing is great. smoothing is smooth. smoothing is also slow
  if ( USE_SMOOTHING !== true ) {
    noSmooth();
  }

  // use radius when drawing ellipsis
  ellipseMode(RADIUS);

  generateEmitters(w, h);
}

function generateEmitters(w, h) {
  var x, y, x2, y2, speed, add_delay, _color, r1, r2;
  var min_x = w * EMITTER_MARGIN;
  var max_x = w - min_x;
  
  var min_y = h * EMITTER_MARGIN;
  var max_y = h - min_y;
  
  // empty out any existing emitters
  emitters = [];

  // we generate emitters in pairs. in the pair, each emitter
  // will use the same parameters for output, but will be offset
  // by a small distance. this generates a bit of a moire effect
  for ( var i = 0; i < EMITTER_COUNT; i++ ) {
    x = random(min_x, max_x);
    y = random(min_y, max_y);

    x2 = x + nonZeroRandom(-EMITTER_DIST, EMITTER_DIST, EMITTER_MIN_GAP);
    y2 = y + nonZeroRandom(-EMITTER_DIST, EMITTER_DIST, EMITTER_MIN_GAP);

    speed = random(MIN_SPEED, MAX_SPEED);
    add_delay = parseInt(random(MIN_DELAY, MAX_DELAY), 10);
    _color = color(random(0, 255), random(0, 255), random(MIN_BRIGHT, MAX_BRIGHT));
    

    // figure out the distance from the emitter to the most distant
    // edge of the canvas. we won't render anything past this distance
    r1 = max(dist(x, y, 0, 0), dist(x, y, w, 0), dist(x, y, 0, h), dist(x, y, w, h));
    r2 = max(dist(x2, y2, 0, 0), dist(x2, y2, w, 0), dist(x2, y2, 0, h), dist(x2, y2, w, h));
    
    emitters.push(new Emitter(x, y, r1, _color, speed, add_delay));
    emitters.push(new Emitter(x2, y2, r2, _color, speed, add_delay));
  }  
}


function draw() {  
  background(0);
  
  for ( var i = 0; i < emitters.length; i++ ) {
    var e = emitters[i];
    e.update();
    stroke(e.stroke);
    for ( var j = 0; j < e.circles.length; j++ ) {
      ellipse(e.x, e.y, e.circles[j], e.circles[j]);
    }
  }
}
