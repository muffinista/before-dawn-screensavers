const FRAME_RATE = 30;
const INTERVAL = 1000 / FRAME_RATE;

let then = Date.now();


if ( typeof(window.urlParams) !== "undefined" ) {
  display_width = window.urlParams.width;
  display_height = window.urlParams.height;
}
else {
  display_width = screen.width;
  display_height = screen.height;
}

// note -- if you don't do this, width/height might be strings!
display_width = parseInt(display_width, 10);
display_height = parseInt(display_height, 10);

var canvas = document.querySelector('#canvas');
canvas.width = display_width;
canvas.height = display_height;

// var init = [];
var maxParts = 1000;
var particles = [];

var ctx = canvas.getContext('2d');
var w = canvas.width;
var h = canvas.height;
ctx.strokeStyle = 'rgba(174,194,224,0.5)';
ctx.lineWidth = 1;
ctx.lineCap = 'round';

let xDrift = 1;
let xRange = 1;
let yMin = 10;
let yRand = 3;
let lMax = 1;

for(var a = 0; a < maxParts; a++) {
  particles.push({
    x: Math.random() * w,
    y: Math.random() * h,
    l: Math.random() * lMax,
    xs: -xDrift + Math.random() * xRange + xDrift,
    ys: Math.random() * yRand + yMin
  })
}

function draw() {
  window.requestAnimationFrame(draw);

  let now = Date.now();
  let elapsed = now - then;
  if ( elapsed < INTERVAL ) {
    return;
  }

  then = now - (elapsed % INTERVAL);

  move();
  ctx.clearRect(0, 0, w, h);
  for(var c = 0; c < particles.length; c++) {
    var p = particles[c];
    ctx.beginPath();
    ctx.moveTo(p.x, p.y);
    ctx.lineTo(p.x + p.l * p.xs, p.y + p.l * p.ys);
    ctx.stroke();
  }
}

function move() {
  for(var b = 0; b < particles.length; b++) {
    var p = particles[b];
    p.x += p.xs;
    p.y += p.ys;
    if(p.x > w || p.y > h) {
      p.x = Math.random() * w;
      p.y = -20;
    }
  }
}

  
window.requestAnimationFrame(draw);