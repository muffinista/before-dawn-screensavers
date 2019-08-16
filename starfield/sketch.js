class Star extends p5.Vector {
  constructor() {
    super();
    this.reset(true);
  }

  reset(initial) {
    let angle = random(0, TWO_PI);
    let min_r = int((height * 2) * min_radius);
    let max_r = int(height * max_radius);

    let r = random(min_r, max_r);
    this.x = width/2 + cos(angle) * r;
    this.y = height/2 + sin(angle) * r;

    if ( initial === true ) {
      this.z = random(-depth, 0);
    }
    else {
      this.z = -depth;
    }

		this.size = random(5, 10);
  }
  
  update() {
    this.z += step;
  }

  render() {
    push();
    translate(this.x, this.y, this.z);
    rect(0, 0, this.size, this.size);
    pop();
  }

  visible() {
    return (this.z <= 10);
  }
};


var bgcolor = 0;
var stars = [];
var depth = 5000;
var step = 20;

var count = 2000;
var fps = 20;

var min_radius = 0.2;
var max_radius = 4;

var display_width;
var display_height;
var density;

function setup() {
  if ( typeof(window.urlParams) !== "undefined" ) {
    display_width = window.urlParams.width;
    display_height = window.urlParams.height;
    density = window.urlParams.density;
  }

  if ( display_width === undefined ) {
    display_width = screen.width;
  }
  if ( display_height === undefined ) {
    display_height = screen.height;
  }
  if ( density === undefined ) {
    density = 50;
  }

  // note -- if you don't do this, width/height will be strings!
  display_width = parseInt(display_width, 10);
  display_height = parseInt(display_height, 10);
  density = parseInt(density, 10);
  
  createCanvas(display_width, display_height, WEBGL);
	smooth();
	frameRate(fps);

  count = parseInt(count * (density/100.0), 10);
  for(let index = 0; index < count; index++) {
    stars.push(new Star());
  }
}

function draw() {
  background(bgcolor);
  for(let index = 0; index < count; index++) {
    let s = stars[index];
    if ( ! s.visible() ) {
      s.reset(false);
    }
    s.update();
    s.render();
  }
}
