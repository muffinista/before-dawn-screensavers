var sparkCount = 2000;
var deathPadding = 10;

var sparkLifespan = 250.0;
var sparkTypeCount = 10;
var sparkTypes = [];
var sparks = [];

var palette = [];
var MAX_BRIGHTNESS = 12;

var Spark = function() {
  this.p = new p5.Vector(random(width), -60);
  this.a = new p5.Vector(0, 0.05);
  this.v = new p5.Vector(random(-1, 1), random(0, 0));
  this.lifespan = sparkLifespan;
  this.decay = random(-0.05, -1.0);
  this.img = random(sparkTypes);
  
  this.update = function() {
    this.v.add(this.a);
    this.p.add(this.v);
    this.lifespan += this.decay;
  };

  this.draw = function() {
    //tint(255, this.lifespan);
    image(this.img, this.p.x, this.p.y);
  }; 

  this.dead = function() {
    return ( this.lifespan < 0 ||
             this.v.x + deathPadding <= 0 || this.v.x >= width + deathPadding ||
             this.v.y + deathPadding <= 0 || this.v.y >= height + deathPadding );
  }
}

// pick a random color by picking a row from our palette,
// then picking a random color below the max brightness
var randomColor = function() {
  var row = palette[Math.floor(Math.random()*palette.length)];
  var color = row[Math.floor(Math.random() * MAX_BRIGHTNESS)];

  return color;
};

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
      pg.rect(pg.width/2, pg.height/2, 15, 20);
      break;
    case 'point':
      pg.rectMode(CENTER);
      pg.rect(pg.width/2, pg.height/2, 10, 10);
      break;
  }

  pg.filter(BLUR, random(3, 10));

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
    [ color(0, 0, 0), color(16, 15, 16), color(40, 37, 40), color(59, 59, 59), color(78, 77, 78), color(97, 95, 97), color(113, 112, 113), color(129, 129, 129), color(140, 139, 140), color(154, 154, 154), color(169, 169, 169), color(184, 184, 184), color(197, 197, 197), color(212, 211, 212), color(225, 225, 225), color(229, 229, 229) ],
    [ color(67, 3, 0), color(81, 14, 0), color(99, 36, 0), color(114, 56, 0), color(127, 75, 0), color(145, 92, 0), color(159, 108, 0), color(173, 125, 4), color(182, 135, 22), color(197, 151, 47), color(209, 165, 67), color(224, 181, 87), color(230, 193, 102), color(230, 207, 120), color(229, 221, 137), color(229, 227, 153) ],
    [ color(81, 5, 0), color(95, 7, 0), color(109, 23, 0), color(126, 44, 0), color(138, 63, 0), color(155, 81, 0), color(169, 99, 17), color(184, 116, 43), color(193, 125, 58), color(206, 142, 76), color(219, 157, 96), color(231, 173, 114), color(231, 185, 129), color(231, 200, 145), color(230, 212, 160), color(229, 226, 175) ],
    [ color(92, 7, 0), color(106, 9, 0), color(122, 12, 0), color(137, 27, 23), color(151, 47, 43), color(165, 67, 65), color(178, 85, 84), color(193, 104, 103), color(202, 115, 112), color(215, 130, 128), color(228, 145, 143), color(231, 161, 160), color(230, 174, 175), color(230, 188, 190), color(230, 202, 203), color(230, 215, 216) ],
    [ color(68, 13, 87), color(85, 17, 100), color(100, 22, 115), color(117, 29, 130), color(130, 44, 144), color(145, 64, 160), color(160, 81, 174), color(175, 99, 187), color(185, 109, 196), color(199, 125, 210), color(213, 136, 223), color(226, 156, 229), color(231, 169, 229), color(231, 183, 230), color(230, 197, 229), color(231, 210, 230) ],
    [ color(53, 17, 112), color(67, 21, 122), color(88, 25, 137), color(104, 33, 151), color(120, 48, 165), color(135, 67, 178), color(150, 84, 192), color(164, 102, 206), color(174, 112, 214), color(188, 129, 227), color(202, 144, 230), color(216, 159, 230), color(228, 172, 229), color(230, 185, 229), color(231, 198, 230), color(230, 212, 229) ],
    [ color(30, 20, 127), color(46, 23, 139), color(66, 27, 151), color(85, 39, 166), color(101, 56, 179), color(116, 73, 193), color(132, 90, 204), color(148, 108, 218), color(158, 117, 226), color(172, 133, 230), color(186, 147, 229), color(202, 162, 229), color(215, 175, 229), color(228, 189, 229), color(231, 202, 230), color(230, 216, 229) ],
    [ color(1, 19, 126), color(1, 23, 138), color(14, 39, 152), color(36, 57, 165), color(57, 73, 178), color(76, 91, 192), color(93, 107, 204), color(112, 124, 218), color(122, 134, 225), color(128, 149, 230), color(153, 163, 229), color(170, 177, 229), color(184, 189, 230), color(196, 205, 229), color(211, 217, 229), color(225, 228, 230) ],
    [ color(1, 16, 108), color(0, 29, 118), color(0, 50, 134), color(5, 67, 149), color(30, 84, 162), color(54, 102, 176), color(73, 118, 188), color(91, 134, 204), color(103, 143, 212), color(119, 160, 225), color(136, 173, 229), color(151, 187, 229), color(168, 199, 230), color(181, 213, 229), color(196, 226, 229), color(211, 229, 229) ],
    [ color(0, 22, 86), color(0, 39, 97), color(0, 59, 113), color(0, 77, 128), color(8, 93, 143), color(37, 108, 158), color(58, 125, 172), color(78, 141, 188), color(88, 151, 195), color(105, 166, 208), color(123, 181, 222), color(139, 194, 230), color(155, 207, 229), color(170, 220, 229), color(185, 229, 230), color(199, 229, 229) ],
    [ color(0, 55, 0), color(0, 70, 0), color(0, 86, 1), color(0, 102, 25), color(0, 117, 44), color(0, 133, 65), color(23, 148, 85), color(50, 163, 102), color(64, 172, 112), color(83, 187, 128), color(102, 200, 144), color(120, 214, 160), color(134, 226, 174), color(150, 228, 188), color(167, 228, 203), color(183, 228, 217) ],
    [ color(0, 59, 0), color(0, 74, 0), color(0, 89, 0), color(0, 104, 0), color(1, 120, 0), color(36, 136, 0), color(58, 149, 0), color(80, 165, 7), color(90, 173, 24), color(109, 188, 47), color(125, 200, 69), color(144, 215, 89), color(156, 225, 103), color(172, 227, 120), color(188, 227, 139), color(203, 227, 155) ],
    [ color(0, 50, 0), color(0, 66, 0), color(0, 84, 0), color(22, 99, 0), color(44, 115, 0), color(65, 131, 0), color(83, 145, 0), color(102, 161, 0), color(112, 169, 0), color(129, 183, 12), color(145, 197, 39), color(160, 211, 59), color(174, 223, 78), color(190, 227, 98), color(203, 226, 116), color(218, 227, 131) ],
    [ color(0, 35, 0), color(16, 52, 0), color(39, 71, 0), color(61, 87, 0), color(77, 104, 0), color(97, 121, 0), color(112, 134, 0), color(129, 150, 0), color(139, 159, 0), color(164, 174, 1), color(170, 188, 30), color(184, 202, 54), color(197, 214, 72), color(211, 226, 90), color(225, 227, 109), color(229, 227, 127) ],
    [ color(36, 12, 0), color(56, 33, 0), color(73, 53, 0), color(91, 71, 0), color(105, 89, 0), color(123, 106, 0), color(138, 122, 0), color(153, 138, 0), color(162, 147, 0), color(178, 163, 11), color(192, 175, 38), color(206, 191, 60), color(218, 204, 78), color(229, 218, 97), color(230, 227, 116), color(230, 228, 132) ],
    [ color(66, 3, 0), color(82, 13, 0), color(99, 35, 0), color(115, 56, 0), color(128, 75, 0), color(144, 92, 0), color(159, 107, 0), color(174, 125, 4), color(183, 135, 24), color(197, 150, 47), color(209, 164, 67), color(224, 181, 88), color(230, 192, 102), color(231, 206, 123), color(229, 220, 137), color(230, 228, 154) ]
  ];
}
