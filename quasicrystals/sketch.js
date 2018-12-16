// this is the p5js frame rate
var FRAMES_PER_SECOND = 10;

// this is basically the speed of the quasicrystal animation,
// as opposed to the speed of p5js (ie, we could draw a lot of
// frames of a slow animation)
var drawRate = 0.1;

// lower value == lower frequency and fewer waves on the
// screen, higher == more waves
var waveFreq;

// how many waves to draw?
var waveCount;
var wiggle;

// what angle should the animation go?
var angleOffset;


// here's a list of different wave counts
var waveCounts = [5, 7, 9, 11, 13];

// min/max frequency of the waves
var minFreq = 0.1;
var maxFreq = 0.9;

var minWiggle = 0.3;
var maxWiggle = 0.8;

// we'll tween between different colors at a random speed.
// these are the min/max values for that speed
var minColorTime = 5000;
var maxColorTime = 15000;


// some variables we'll use while drawing
var angleStep;
var xPixMax;
var yPixMax;

var pg;

// to save on CPU usage, we'll draw to an image this wide instead
// of the width of the entire screen
var graphicsWidth = 400;
var graphicsHeight;

// store the color tween object
var colorTween;
//var angleTween;

// tween from this color....
var srcColor = {
  r: 0,
  g: 0,
  b: 0
};

// .... to this color
var destColor = {
  r: 0,
  g: 0,
  b: 0
};

// we'll randomly pick an easing equation for the tween
// make a list of all the easing types, we'll pick one randomly
// and we'll skip the 'none' easing which comes first in the array
var easings = [].concat.apply([],
                              Object.values(TWEEN.Easing).map(function(x) { return Object.values(x); })).slice(1);  


/**
 * setup the canvas in either fullscreen mode, or fit the div wrapper
 */
function init() {
  var wrapper = document.querySelector('#sketch');
  var w, h, c, ratio;

  // LEARN FROM MY MISTAKES!!!! Set the pixel density to 1
  // by default to handle random math issues on retina displays
  // if you're doing direct pixel manipulation or other weird
  // stuff. if you don't think you're going to do that, then
  // you can remove this
  pixelDensity(1);

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


  if ( typeof(window.urlParams.Quality) !== "undefined" ) {
    var val = parseInt(window.urlParams.Frequency, 10);
    graphicsWidth = map(val, 0, 100, graphicsWidth, graphicsWidth * 2);
  }
  if ( typeof(window.urlParams.Frequency) !== "undefined" ) {
    var val = parseInt(window.urlParams.Frequency, 10);
    maxFreq = map(val, 0, 100, maxFreq / 2, maxFreq * 2);
  }
  if ( typeof(window.urlParams.Wiggle) !== "undefined" ) {
    var val = parseInt(window.urlParams.Wiggle, 10);
    maxWiggle = map(val, 0, 100, maxWiggle / 2, maxWiggle * 2);
  }
  
  
  ratio = 1.0 * h / w;
  
  graphicsHeight = graphicsWidth * ratio;

  // check for an existing canvas -- we'll create a new one
  // each time we toggle modes and we need to clear out the old one
  c = wrapper.querySelector("canvas");
  c = createCanvas(w, h);
  c.parent('sketch');
 

  waveFreq = random(minFreq, maxFreq);
  wiggle = random(minWiggle, maxWiggle);
  waveCount = random(waveCounts);
  angleOffset = random(0, PI * 2);
  
  angleStep = PI / waveCount;
  xPixMax = graphicsWidth / 2;
  yPixMax = graphicsHeight / 2;

  
  destColor = {
    r: random(0, 255),
    g: random(0, 255),
    b: random(0, 255)
  };

  
  setupColorTween().start();

  // we're going to draw to a PGraphics object, here it is
  pg = createGraphics(graphicsWidth, graphicsHeight);
  pg.background(0);
  pg.loadPixels();
}

function resetColorTween() {
  setupColorTween().start();
}

function setupColorTween() {
  srcColor.r = destColor.r;
  srcColor.g = destColor.g;
  srcColor.b = destColor.b;

  destColor = {
    r: random(0, 255),
    g: random(0, 255),
    b: random(0, 255),
  };

  colorTween = new TWEEN.Tween(srcColor).
                         to(destColor, random(minColorTime, maxColorTime)).
                         easing(random(easings)).
                         onComplete(resetColorTween);
  return colorTween;
}

function setup() {
  init();
  background(0);
  frameRate(FRAMES_PER_SECOND);
}


function draw() {
  var frameRateOffset = frameCount * drawRate;
  
  var pixelIndex = 0;
  var tmpY;
  var tmpX;

  // yPixMax is height/2 so this goes from -h/2 to h/2
  for (var yPix = -yPixMax; yPix < yPixMax;  yPix++) {
    var y = yPix * waveFreq;

    // xPixMax is width/2 so this goes from -w/2 to w/2
    for (var xPix = -xPixMax; xPix < xPixMax;  xPix++) {
      var x = xPix * waveFreq;              

      var angle = angleOffset; //srcAngle.angle;
      var sum = 0;
      
      var v, d;

      for (var i = 0; i < waveCount; i++) {
        tmpY = sin(angle) * y;
        tmpX = cos(angle) * x;
        
        // tweak the value of wiggle to mess with the output a bit
        sum += cos( tmpX + tmpY + frameRateOffset) + wiggle;
        angle += angleStep;
      }
      
      sum = sum / 2.0;
      v = floor(sum);
      d = sum - v;
      sum = (v % 2) == 0 ? d : 1.0 - d; 

      pg.pixels[pixelIndex] = sum * srcColor.r;
      pg.pixels[pixelIndex + 1] = sum * srcColor.g;
      pg.pixels[pixelIndex + 2] = sum * srcColor.b;

      
      // the pixel array has 4 entries for each pixel, so count by 4s
      pixelIndex += 4;
    }
  } 

  
  pg.updatePixels();

  // draw our image to the screen, scaled to fit our width/height
  image(pg, 0, 0, width, height);
}

// Setup the animation loop.
function animate(time) {
  TWEEN.update(time);
  requestAnimationFrame(animate);
}

animate();

