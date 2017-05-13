// load any incoming URL parameters. you could just use the
// URLSearchParams object directly to manage these variables, but
// having them in a hash is a little easier sometimes.
var tmpParams = new URLSearchParams(document.location.search);
window.urlParams = {};

for(let k of tmpParams.keys() ) {
  window.urlParams[k] = tmpParams.get(k);
}


var img;

function preload() {
  var imgUrl = unescape(decodeURIComponent(window.urlParams.screenshot));
  console.log(imgUrl);
  img = loadImage(imgUrl);
}

function setup() {
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
  
  var c = createCanvas(display_width, display_height);
  c.parent("wrapper");

  image(img, 0, 0);
  loadPixels();
  frameRate(15);

  nextTween();
}

function avg(i) {
  var sum = 0;

  i.loadPixels();
  for ( var j = 0; j < i.pixels.length; j++ ) {
    sum += i.pixels[j];
  }

  return sum / i.pixels.length;
}

var block_width_count = 80;
var block_height_count = 80;

var block_width = Math.round(window.urlParams.width / block_width_count);
var block_height = Math.round(window.urlParams.height / block_height_count);

function getBlock(bx, by) {
  var x = Math.round(block_width * bx);
  var y = Math.round(block_height * by);
  return get(x, y, block_width, block_height);
}

var last_x = 0;
var last_y = 0;
var tween;
var attrs = {alpha: 0};

var b1;
var b2;

function nextTween() {
  var x2 = random(0, block_width_count - 1);  
  var y2 = random(0, block_height_count - 1);  

  if ( last_x >= block_width_count ) {
    last_x = 0;
    last_y = last_y + 1;

    if ( last_y > block_height_count ) {
      last_y = 0;
    }
  }

  
  b1 = getBlock(last_x, last_y);
  b2 = getBlock(x2, y2);  

  console.log(last_x, last_y, block_width_count);
   
  tween = new TWEEN.Tween({alpha:0});
  tween.to({alpha: 255}, 500)
       .onUpdate(function() {
         if ( avg(b1) > avg(b2) ) {
           tint(255, this.alpha);
           image(b1, x2 * block_width, y2 * block_height);
           image(b2, last_x * block_width, last_y * block_height);
         }
       })
       .onComplete(function() {
         last_x = last_x + 1;
         nextTween();
       });
  tween.start();
}

//function setup() {
//}

function draw() {
  TWEEN.update();
}
 
