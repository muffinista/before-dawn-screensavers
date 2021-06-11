/* @pjs pauseOnBlur="false"; */ 

let sprites = [];
var fps = 10;

var bgcolor = 0;

var min_sprite = 1;
var max_sprite = 3077;
var num_sprites = 10;

let spriteImage;

let vector;
let slices = 12;
let slicer;

let xMult = 10;
let yMult = 10;

const sheetSize = 10;

function preload() {
  sprites = [];

  // load a pile of random sprites
  for (let i = 0; i < num_sprites; i++ ) {
    var index = int(random(min_sprite, max_sprite));
    let tmp = loadImage("../__assets/emoji/" + index + ".png");
    sprites.push(tmp);
  }
}

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

  // note -- if you don't do this, width/height will be strings!
  display_width = parseInt(display_width, 10);
  display_height = parseInt(display_height, 10);
  
  // set pixel density to 1 so high-density/retina displays work alright
  pixelDensity(1);

  createCanvas(display_width, display_height);
 
  noStroke();
  frameRate(fps);

  spriteImage = sprites[0];
  vector = createVector(0, 0);

  slicer = new SliceBuilder(spriteImage, slices);

  imgWidth = slicer.w / 2;
  imgHeight = slicer.h / 2;
}

function emit(img, x, y, rotations) {
  for ( var i = 0; i <= rotations; i++ ) {
    push();
    translate(x, y);
    rotate((PI*2 / rotations) * i);
    image(img, 0, 0);  
    pop();
  }
}

function draw() {
  background(0);

  const img = slicer.toImage(vector, imgWidth, imgHeight);

  // emit(img, width / 8, height / 8, slices);
  // emit(img, width * 0.8, height / 8, slices);

  // emit(img, width / 8, height * 0.8, slices);
  // emit(img, width * 0.8, height * 0.8, slices);

  emit(img, width / 2, height / 2, slices);

  img.remove();

  vector.x += xMult;
//  vector.y += yMult;

  if ( vector.x > slicer.w ) {
    vector.x = 0;
  }
  if ( vector.y > slicer.h ) {
    vector.y = 0;
  }
  // if ( vector.x > spriteImage.width * 2 || vector.x <= 0 ) {
  //   xMult *= -1;
  // }
  // if ( vector.y > spriteImage.height * 2 || vector.y <= 0 ) {
  //   yMult *= -1;
  // }
}


class SliceBuilder {
  constructor(source, slices) {
    //the width and height parameters for the mask
    this.w = source.width * sheetSize;
    this.h = source.height * sheetSize;

    //create a mask of a slice of the original image.
    this.mask = createGraphics(this.w, this.h); 

    // make an arc/slice of the source image just a little bit wider than what we need
    this.e = radians(360/slices + .1);
    // this.mask.arc(0, 0, 2 * this.w, 2 * this.h, 0, this.e);
    this.mask.arc(0, 0, 3 * this.w, 3 * this.h, 0, this.e);

    //
    // make a copy of the image with copies of the image on all sides, for wrapping
    //
    this.base = createGraphics(this.w, this.h);
    for ( let x = 0; x < sheetSize; x++ ) {
      for ( let y = 0; y < sheetSize; y++ ) {
        let idx = int(random(0, num_sprites));
        this.base.image(sprites[idx], x * source.width, y * source.height);
        //this.base.image(sprites[idx], random(0, source.width * sheetSize), random(0, source.height * sheetSize));
      }
    }
    this.slice = createImage(this.w, this.h); 
  }

  toSlice(vector) {
    this.slice = this.base.get(vector.x, vector.y, this.w, this.h);

    // copy overlaps
    this.slice.copy(this.base, 0, vector.y, this.w, this.h, this.w - vector.x, vector.y, this.w, this.h);
    this.slice.copy(this.base, vector.x, 0, this.w, this.h, 0, vector.y, this.w, this.h);
    this.slice.copy(this.base, this.w - vector.x, this.h - vector.y, this.w, this.h, vector.x, vector.y, this.w, this.h);

    this.slice.mask(this.mask); 
    return this.slice;
  }

  toImage(vector, width, height) {
    let slice = this.toSlice(vector, width, height);
    let img = createGraphics(width * 2, height * 2);
  
    for(let k = 0; k <= slices ;k++){ 
      img.rotate( k * radians(360/(slices/2)) ); 
      img.image(slice, 0, 0, width * 2, height * 2); 
      img.scale(-1.0, 1.0);
      img.image(slice, 0, 0, width * 2, height * 2);
    } 
  
    // crop square
    let output = createGraphics(width, height);
    output.image(img, 
      0, 0, width, height,
      width * 0.25, height * 0.25, width, height
    );
  
    img.remove();
    return output;
  }
}
