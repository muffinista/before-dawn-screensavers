// load any incoming URL parameters. you could just use the
// URLSearchParams object directly to manage these variables, but
// having them in a hash is a little easier sometimes.
var tmpParams = new URLSearchParams(document.location.search);
window.urlParams = {};

for(let k of tmpParams.keys() ) {
  window.urlParams[k] = tmpParams.get(k);
}

console.log(window.urlParams);


let shape_count = 2; // how many shapes to draw?
let alpha_bump = 3; window.urlParams['Fade Rate'] || 3; // how much to fade alpha each time we draw
let vertex_count = 4;  window.urlParams['Vertex Count'] || 4; // how many vertices on each one?
let velocity_base = 5; window.urlParams['Speed'] || 5; // min/max velocity

const VELOCITY_PAD = 1; // ensure a velocity of at least this much

var pg;
var shapes = [];

if ( typeof(window.urlParams['Shapes']) !== 'undefined' ) {
  shape_count = parseInt(window.urlParams['Shapes'], 10);
}

if ( typeof(window.urlParams['Fade Rate']) !== 'undefined' ) {
  alpha_bump = parseInt(window.urlParams['Fade Rate'], 10);
}

if ( typeof(window.urlParams['Vertex Count']) !== 'undefined' ) {
  vertex_count = parseInt(window.urlParams['Vertex Count'], 10);
}

if ( typeof(window.urlParams['Speed']) !== 'undefined' ) {
  velocity_base = parseInt(window.urlParams['Speed'], 10);
}

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
 * The Shape class holds a collection of points and a color.
 * We'll draw lines between the points to make a cool shape.
 */
function Shape() {
  this.stroke = color(random(0, 255), random(0, 255), random(128, 255));
  this.points = [];
  for ( var i = 0; i < vertex_count; i++ ) {
    this.points.push(new Point(i)); 
  }
}

/**
 * update position for all our points
 */
Shape.prototype.update = function() {
  for ( var i = 0; i < this.points.length; i++ ) {
    this.points[i].update();
  }
}

/**
 * A single point, with velocity and position. This is
 * basically a really light version of the Boid class
 * here: https://p5js.org/examples/hello-p5-flocking.html
 */
function Point() {
  this.velocity = createVector(
    nonZeroRandom(-velocity_base, velocity_base, VELOCITY_PAD), 
    nonZeroRandom(-velocity_base, velocity_base, VELOCITY_PAD)
  );
  this.position = createVector(random() * width, random() * height);
}

Point.prototype.update = function() {
  // update position
  this.position.add(this.velocity);
  
  // if we hit the edge of the screen, bounce!
  if ( this.position.x < 0 || this.position.x > width ) {
    this.velocity.x *= -1;
  }
  if ( this.position.y < 0 || this.position.y > height ) {
    this.velocity.y *= -1;
  }
}

/**
 * p5.js setup
 */
function setup() {
  var c;

  // find the sketch holder in the HTML output
  var wrapper = document.querySelector('#wrapper');

  var w, h;

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
  
  // set pixel density to 1 so high-density/retina displays work alright
  pixelDensity(1);

  // add it to the page!
  c = createCanvas(w, h);
  c.parent('wrapper');
  
  // use HSB to generate colors
  colorMode(HSB);

  frameRate(15);
  
  shapes = [];

  // create a bunch of shapes
  for ( var i = 0; i < shape_count; i++ ) {
    shapes.push(new Shape());
  }

  // we're going to draw to a PGraphics object, here it is
  pg = createGraphics(width, height);
  pg.background(0);
}


function draw() {
  background(0);

  // update position of all our shapes/points
  for ( var i = 0; i < shapes.length; i++ ) {
    shapes[i].update(); 
  }

  // redraw all the shapes
  for ( var j = 0; j < shapes.length; j++ ) {
    var shape = shapes[j];
    pg.stroke(shape.stroke);

    // draw lines from one point to the next
    for ( var i = 0; i < shape.points.length; i++ ) {
      var p1 = shape.points[i].position;
      var p2;
      
      // draw from the last point to the first point
      if ( i == shape.points.length - 1 ) {
        p2 = shape.points[0].position;
      }
      else {
        p2 = shape.points[i+1].position; 
      }

      pg.line(p1.x, p1.y, p2.x, p2.y);
    }
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
  var val;
  pg.loadPixels();

  // p5 stores pixels in an array split up into R, G, B, A values
  // so every 4th value is the alpha for a given pixel.
  //
  // let's iterate through each pixel and drop the alpha a bit
  //
  for (var i = 0; i < pg.pixels.length ; i = i + 4) {
    val = pg.pixels[i+3];
    if ( val > 0 ) {
      val = val - alpha_bump;
      pg.pixels[i+3] = val;
    }
  }
  pg.updatePixels();
}

