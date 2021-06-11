/* @pjs pauseOnBlur="false"; */ 

let stars = [];

var count = 200;
var depth = 5000;
var step = 20;
var fps = 30;

let min_radius = 0.3;
let max_radius = 4;

var num_sprites = 50;
let sprites = [];

var bgcolor = 0;

var min_r; // = int((height * 2) * min_radius);
var max_r; // = int(height * max_radius);

var min_sprite = 1;
var max_sprite = 3077;


class Star extends p5.Vector {
  constructor() {
    super();
    this.reset(true);
  }

  reset(initial) {
    this.angle = random(0, TWO_PI);
    this.r = random(min_r, max_r);
    this.x = width/2 + cos(this.angle) * this.r;
    this.y = height/2 + sin(this.angle) * this.r;
    this.sprite = int(random(0, num_sprites));

    if ( initial === true ) {
      this.z = random(-depth, 0);
    }
    else {
      this.z = -depth;
    }
  }
  
  update() {
    this.z += step;
  }

  render() {
    push();
    translate(this.x, this.y, this.z);

    image(sprites[this.sprite], 0, 0);
    pop();
  }

  visible() {
    return (this.z <= 10);
  }
};

function setup() {
  if ( typeof(window.urlParams) !== "undefined" ) {
    display_width = window.urlParams.width;
    display_height = window.urlParams.height;

    if ( typeof(window.urlParams.density) !== "undefined" ) {
      count = window.urlParams.density * 2;
    }
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
  if ( count === undefined ) {
    count = 50;
  }

  // note -- if you don't do this, width/height will be strings!
  display_width = parseInt(display_width, 10);
  display_height = parseInt(display_height, 10);
  
  createCanvas(display_width, display_height, WEBGL);

  min_r = int((height * 2) * min_radius);
  max_r = int(height * max_radius);


  sprites = [];

  // load a pile of random sprites
  for (let i = 0; i < num_sprites; i++ ) {
    var index = int(random(min_sprite, max_sprite));
    let tmp = loadImage("../__assets/emoji/" + index + ".png");
    sprites.push(tmp);
  }
 
  noStroke();
  frameRate(fps);

  stars = [];
   
  for(let index = 0; index < count; index++) {
    stars[index] = new Star();
  }
}

function draw() {
  background(0);
 
  for(var index = 0; index < count; index++) {
    let s = stars[index];
    if ( ! s.visible() ) {
      s.reset(false);
    }
    s.update();
    s.render();
  }
}
