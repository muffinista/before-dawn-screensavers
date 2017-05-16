// load any incoming URL parameters. you could just use the
// URLSearchParams object directly to manage these variables, but
// having them in a hash is a little easier sometimes.
var tmpParams = new URLSearchParams(document.location.search);
window.urlParams = {};

for(let k of tmpParams.keys() ) {
  window.urlParams[k] = tmpParams.get(k);
}


var r, g, b;

var block_width_count;
var block_height_count;

var block_width;
var block_height;

var last_x = 0;
var last_y = 0;

var img;
var tweenCount = 3;
var tween_rate = 250;

function preload() {
  var imgUrl = unescape(decodeURIComponent(window.urlParams.screenshot));
  img = loadImage(imgUrl);
}

function getFactors(integer){
  var factors = [],
      quotient = 0;

  for(var i = 1; i <= integer; i++){
    quotient = integer/i;

    if(quotient === Math.floor(quotient)){
      factors.push(i); 
    }
  }
  return factors;
}

function setup() {
  r = random(255);
  g = random(255);
  b = random(255);

  // figure out the screen dimensions
  if ( typeof(window.urlParams) !== "undefined" ) {
    display_width = window.urlParams.width;
    display_height = window.urlParams.height;
  }
  else {
    display_width = screen.width;
    display_height = screen.height;
  }

  // note -- if you don't do this, width/height will be strings!
  display_width = parseInt(display_width, 10);
  display_height = parseInt(display_height, 10);

  var widths = getFactors(display_width);
  var heights = getFactors(display_height);

  // pick random block counts from the collection of widths/heights
  // this ensures that the math is always dividing evenly
  block_width_count = random(widths);
  block_height_count = random(heights);

  block_width = (display_width / block_width_count);
  block_height = (display_height / block_height_count);

  // place sketch on screen
  var c = createCanvas(display_width, display_height);
  c.parent("wrapper");

  frameRate(15);
  noStroke();
  
  // start animations!
  for ( var i = 0; i < tweenCount; i++ ) {
    nextTween();
  }

}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

function avg(i) {
  var sum = 0;
  var count = 0;
  
  i.loadPixels();
  for ( var j = 0; j < i.pixels.length; j++ ) {
    // every four elements in the array is RGBA
    // let's skip the alpha value
    if ( j % 4 !== 0 ) {
      count = count + 1;
      sum += i.pixels[j];
    }
  }
  i.updatePixels();

  return sum / count;
}

function getBlock(bx, by) {
  var x = block_width * bx;
  var y = block_height * by;

  return img.get(x, y, block_width, block_height);
}

function nextTween() {
  var tween;

  var x = getRandomInt(0, block_width_count);
  var y = getRandomInt(0, block_height_count);

  if ( last_x >= block_width_count ) {
    last_x = 0;
    last_y = last_y + 1;

    if ( last_y >= block_height_count ) {
      last_y = 0;
    }
  }
  
  var b1 = getBlock(last_x, last_y);
  var b2 = getBlock(x, y);  

  var start = {
    alpha: 255,
    x1: last_x * block_width,
    y1: last_y * block_height,
    x2: x * block_width,
    y2: y * block_height,
    b1: b1,
    b2: b2,
  };

  var flip = avg(b1) > avg(b2);
  
  
  if ( flip ) {
    img.copy(b1,
             0, 0,
             block_width, block_height,
             start.x2, start.y2,
             block_width, block_height);
    img.copy(b2,
             0, 0,
             block_width, block_height,
             start.x1, start.y1,
             block_width, block_height);
  }
  else {
    img.copy(b2,
             0, 0,
             block_width, block_height,
             start.x2, start.y2,
             block_width, block_height);
    img.copy(b1,
             0, 0,
             block_width, block_height,
             start.x1, start.y1,
             block_width, block_height);
  }
  
  var end = {
    alpha: 0
  };
  
  
  tween = new TWEEN.Tween(start);
  tween.to(end, tween_rate)
       .onUpdate(function() {
         fill(r, g, b, this.alpha);

         rect(this.x2, this.y2, block_width, block_height);
         rect(this.x1, this.y1, block_width, block_height);

       })
       .onComplete(function() {
         setTimeout(nextTween, 1);
       });
  tween.start();

  last_x = last_x + 1;
}

function draw() {
  image(img, 0, 0);
  TWEEN.update();
}
 
