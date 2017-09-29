var sparkCount = 2000;
var sparkTypeCount = 10;
var sparkLifespan = 250.0;

var sparkTypes = [];
var sparks = [];

var palette = [];
var paletteLerps = [];
var deathPadding = 10;

var minAcceleration = 0.03;
var maxAcceleration = 0.08;

var minBlur = 3;
var maxBlur = 10;

var minColor = 120;
var maxColor = 255;

var Spark = function() {
  // start sparks above the screen so they enter a little more smoothly
  this.p = new p5.Vector(random(width), -60);
  this.a = new p5.Vector(0, random(minAcceleration, maxAcceleration));
  this.v = new p5.Vector(random(-1, 1), random(minAcceleration, maxAcceleration));

  this.img = random(sparkTypes);
  
  this.update = function() {
    this.v.add(this.a);
    this.p.add(this.v);
  };

  this.draw = function() {
    image(this.img, this.p.x, this.p.y);
  }; 

  this.dead = function() {
    return ( this.v.x + deathPadding <= 0 || this.v.x >= width + deathPadding ||
             this.v.y + deathPadding <= 0 || this.v.y >= height + deathPadding );
  }
}

/**
 * pick two colors from our palette, and
 * generate a new color somewhere between those two.
 * this should give us some rough color consistency
 */
var randomColor = function() {
  var c1 = random(palette);
  var c2 = random(palette);  
  return lerpColor(c1, c2, random(paletteLerps));
};

/**
 * create a sprite image. we have a few rough templates
 * to work from here and we pick randomly from them
 */
function createSparkImage() {
  var type = random(["ellipse", "rect", "point"]);
  var pg = createGraphics(40, 40);  
  pg.pixelDensity(1);
  pg.background(0, 0);
  pg.noStroke();

  pg.fill(randomColor());
  
  switch(type) {
    case 'ellipse':
      pg.ellipseMode(CENTER);
      pg.ellipse(pg.width/2, pg.height/2, 10, 10);
      break;
    case 'rect':
      pg.rectMode(CENTER);
      pg.rect(pg.width/2, pg.height/2, 15, 20, 10);
      break;
    case 'point':
      pg.rectMode(CENTER);
      pg.rect(pg.width/2, pg.height/2, 10, 10);
      break;
  }

  pg.filter(BLUR, random(minBlur, maxBlur));

  return pg;
}

function setup() {
  // figure out the screen dimensions
  var display_width, display_height;

  if ( typeof(window.urlParams) !== "undefined" ) {
    display_width = window.urlParams.width;
    display_height = window.urlParams.height;
  }
  else {
    display_width = screen.width;
    display_height = screen.height;
  }

  //  display_width = 800;
  //  display_height = 600;
  frameRate(30);

  // note -- if you don't do this, width/height will be strings!
  display_width = parseInt(display_width, 10);
  display_height = parseInt(display_height, 10);

  createCanvas(display_width, display_height);

  loadPalette();
  
  for ( var i = 0; i < sparkTypeCount; i++ ) {
    sparkTypes.push(createSparkImage());
  }

  sparks.push(new Spark());
  background(0);
}

function draw() {
  fill(0, 80);
  rect(0, 0, width, height);
  background(0);
     
  if ( sparks.length < sparkCount ) {
    sparks.push(new Spark());
  }
     
  for ( var i = 0; i < sparks.length; i++ ) {
    var s = sparks[i];
    if ( s.dead() ) {
      sparks[i] = new Spark();
    }
    else {
      s.update();
      s.draw();
    }
  } 
}


function loadPalette() {
  palette =  [
    color(random(minColor, maxColor), random(minColor, maxColor), random(minColor, maxColor)),
    color(random(minColor, maxColor), random(minColor, maxColor), random(minColor, maxColor)),
    color(random(minColor, maxColor), random(minColor, maxColor), random(minColor, maxColor)),
    color(random(minColor, maxColor), random(minColor, maxColor), random(minColor, maxColor)),
    color(random(minColor, maxColor), random(minColor, maxColor), random(minColor, maxColor)),
    color(random(minColor, maxColor), random(minColor, maxColor), random(minColor, maxColor))
  ];
  paletteLerps = [
    random(),
    random(),
    random(),
    random(),
    random()    
  ]
}
