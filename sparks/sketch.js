var sparkCount = 100;
var deathPadding = 10;

var sparkTypes = [];
var sparks = [];

var Spark = function() {
  this.p = new p5.Vector(random(width), -80);
  this.a = new p5.Vector(0, 0.05);
  this.v = new p5.Vector(random(-1, 1), random(-1, 0));
  this.lifespan = 250.0;
  this.decay = random(-0.05, -1.0);
  this.img = random(sparkTypes);

  
  this.update = function() {
    this.v.add(this.a);
    this.p.add(this.v);
    this.lifespan += this.decay;
  };

  this.draw = function() {
    image(this.img, this.p.x, this.p.y, 100, 100);    
  }; 

  this.dead = function() {
    return ( this.lifespan < 0 ||
             this.v.x + deathPadding <= 0 || this.v.x >= width + deathPadding ||
             this.v.y + deathPadding <= 0 || this.v.y >= height + deathPadding );
  }
}

function createSparkImage() {
  var type = random(["ellipse", "rect", "point"]);
  var pg = createGraphics(100, 100);
  pg.pixelDensity(1);
  pg.background(0, 0);
  pg.noStroke();
  pg.ellipseMode(CENTER);
  pg.ellipse(50, 50, 10);

  switch(type) {
    case 'ellipse':
      pg.ellipseMode(CENTER);
      pg.ellipse(pg.width/2, pg.height/2, 10, 10);
      pg.ellipse(0, 0, 10, 10);      
      break;
   case 'rect':
     pg.rectMode(CENTER);
     pg.rect(pg.width/2, pg.height/2, 15, 20);
     break;
     case 'point':
     pg.rectMode(CENTER);
     pg.rect(pg.width/2, pg.height/2, 10, 10);
     break;
  }

  pg.filter(BLUR,5);

  return pg;
}

function setup() {
  display_width = 800;
  display_height = 600;
  createCanvas(display_width, display_height);

  for ( var i = 0; i < 5; i++ ) {
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
