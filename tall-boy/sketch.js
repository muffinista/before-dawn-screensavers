/* global planck, createCanvas, beginShape, endShape, push, pop, height,
   translate, rotate, fill, stroke, rectMode, CENTER, rect, vertex, clear,
   strokeWeight, noStroke, frameRate, ellipse, arc, radians, frameCount, random,
   fullscreen, pixelDensity, color */


var pl = planck, Vec2 = pl.Vec2;
let FRAME_RATE = 30;


// define how many segments the body will have, and their dimensions
var SEGMENTS = 10;
var HEIGHT = 0.95;
var WIDTH = 0.7;

// arms get their own definitions
var ARM_WIDTH = 0.3;
var ARM_HEIGHT = 0.2;
var ARM_OFFSET = 1.8;
var step = HEIGHT * 2;

let armStep = ARM_WIDTH * 2;
let ARM_JOINT_COUNT = 6;
let ARM_JOINT_OFFSET = 1.0;

// assorted shape objects
var shape = pl.Box(WIDTH, HEIGHT);
var arm = pl.Box(ARM_WIDTH, ARM_HEIGHT);

var bodySegmentDef = {
  density: 1.0,
  friction: 0.2
};

var bodyJointDef = {
  collideConnected: false
};


var armJoint = {
  enableLimit: true,
  lowerAngle: -0.2,
  upperAngle: 0.2,
  collideConnected: false
};

let armFixtureDef = {
  density: 1.0, 
  friction: 0.3
};



// we'll apply some random forces to the body, let's track when that happens
var lastImpulse = 0;
var nextImpulse = 0;
var lastWind = 0;
var nextWind = 0;

var minWind = -6.0;
var maxWind = 6.0;


// slightly tweakable gravity
var minGravity = 4.0;
var maxGravity = 16.0;


// max applyable force
let MAX_FORCE = 500;


var mulVec2 = function(a, b) {
  var x = (a.q.c * b.x - a.q.s * b.y) + a.p.x;
  var y = (a.q.s * b.x + a.q.c * b.y) + a.p.y;
  return {x:x, y:y};
};

// convert plank/box2d point to screen coordinates
function toScreen(p) {
  let x = (p.x + offsetX) * meterToPixel; //( (0m) +  8.0m )* 50 = 400 pixels
  let y = height - (p.y + offsetY) * meterToPixel; //( (0m) +  8.0m )* 50 = 400 pixels
  
  return { x:x, y:y };
}

// hold onto assorted objects in the simulation
var world, ground;
var points = [];
var head;
var torso;

var rightArmPoints = [];
var leftArmPoints = [];


// assorted values we need to draw things
let meterToPixel = 40.0;
let offsetX; 
let offsetY;

let MARGIN = 0;

var headWidth = WIDTH * 2 * meterToPixel;
var headHeight = HEIGHT * 2 * meterToPixel;
var eyeWidth = headWidth * 0.25;
var eyeHeight = eyeWidth * 1.3;
var eyeXOffset = headWidth * 0.25;
var eyeYOffset = 20;
var eyePupilYOffset = 3;

var mouthXOffset = headWidth / 2;
var mouthYOffset = 50;
var mouthWidth = headWidth * 0.7;
var mouthHeight = headHeight / 7;

var bodyXOffset;
var bodyYOffset;
var bodyColor;


/**
 * generate our body segments, and chain them together
 */
function setupBody() {
  // start at the ground
  var last = ground;

  var bodyOffset = -offsetY + bodyYOffset;

  for ( var i = 0; i < SEGMENTS; i++ ) {
    var anchor, db;
    var def = bodySegmentDef;

    if ( i == SEGMENTS - 1 ) {
      def.density = 0.5;
    }

    db = world.createDynamicBody(Vec2(bodyXOffset, bodyOffset + (i * step) ));
    db.createFixture(shape, bodySegmentDef);

    // put the anchor right between the two segments we are joining, attached to the last object
    var anchor = Vec2(bodyXOffset, bodyOffset + (i * step) - step/2);
    world.createJoint(pl.RevoluteJoint(bodyJointDef, last, db, anchor));
    
    last = db;
    
    points.push(db);
  }

  // the head is the last element in the array
  head = points[SEGMENTS-1];
  
  // pick a vaguely random segment to join arms to
  torso = points[SEGMENTS-random([2, 3])];
}

/**
 * setup the arm objects
 */

function setupArms() {

  // start from the torso
  var last = torso;
  var p, anchor, db;

  // setup right arm
  for ( var i = 0; i < ARM_JOINT_COUNT; i++ ) {
    p = last.getPosition();
    db = world.createDynamicBody(Vec2(bodyXOffset + i, p.y));
    db.createFixture(arm, armFixtureDef);
    
    anchor = Vec2(bodyXOffset + i, p.y);
    world.createJoint(pl.RevoluteJoint(armJoint, last, db, anchor));
    
    last = db;
    rightArmPoints.push(db);
  }

  // setup left arm
  last = torso;
  for ( var i = 0; i < ARM_JOINT_COUNT; i++ ) {
    p = last.getPosition();
    db = world.createDynamicBody(Vec2(bodyXOffset - i, p.y));
    db.createFixture(arm, armFixtureDef);

    anchor = Vec2(bodyXOffset -i, p.y);
    world.createJoint(pl.RevoluteJoint(armJoint, last, db, anchor));
    
    last = db;
    leftArmPoints.push(db);
  }
}

/**
 * handle drawing the face
 */
function drawFace(head) {
  var f = head.getFixtureList();
  var a = f.m_body.getAngle(); 
  var t = f.m_body.getTransform();

  var s = f.getShape();

  var v, p;
  
  v = s.m_vertices[3];
  p = toScreen(mulVec2(t, v));
  drawEye(p, a);

  v = s.m_vertices[2];
  p = toScreen(mulVec2(t, v));
  drawEye(p, a, -1);

  v = s.m_vertices[3];
  p = toScreen(mulVec2(t, v));
  drawMouth(p, a);
}

/**
 * draw an eye!
 */
function drawEye(p, a, mult) {
  push();
  translate(p.x,p.y);
  rotate(-a);
  fill(255);
  noStroke();
  rectMode(CENTER);
  
  if ( typeof(mult) === "undefined" ) {
    mult = 1;
  }

  // eye background
  ellipse(eyeXOffset * mult, eyeYOffset, eyeWidth, eyeHeight);

  // pupil!
  fill(0);
  ellipse(eyeXOffset * mult, eyeYOffset + eyePupilYOffset, eyeWidth * 0.5, eyeHeight * 0.5);
  pop();
}


/**
 * draw the mouth
 */
function drawMouth(p, a) {
  push();
  translate(p.x,p.y);
  rotate(-a);
  fill(255);
  noStroke();
  rectMode(CENTER);

  arc(mouthXOffset, mouthYOffset, mouthWidth, mouthHeight, radians(0), radians(180));
  pop();
}

/**
 * handle drawing the body. to actually draw things, we collect the vertices of
 * each segment in the body as a collection of points, then draw a polygon connecting
 * those points. this is a little smoother than just drawing every box
 */
function drawBody() {
  fill(bodyColor);
  stroke(bodyColor);
  strokeWeight(3);

  // collect the points
  let leftSide = [];
  let rightSide = [];
  for ( var i = 0; i < points.length; i++) {
    var f = points[i].getFixtureList();
    var t = f.m_body.getTransform();
    var s = f.getShape();
    var v, p;

    v = s.m_vertices[0];
    p = mulVec2(t, v);
    leftSide.push(p);

    v = s.m_vertices[3];
    p = mulVec2(t, v);
    leftSide.push(p);

    
    v = s.m_vertices[1];
    p = mulVec2(t, v);
    rightSide.push(p);

    v = s.m_vertices[2];
    p = mulVec2(t, v);
    rightSide.push(p);
  }

  // draw the body
  if ( leftSide.length > 0 ) {
    beginShape();

    for ( var i = 0; i < leftSide.length; i++ ) {
      var p = toScreen(leftSide[i]);
      vertex(p.x, p.y);
    }
    for ( var i = rightSide.length - 1; i >= 0; i-- ) {
      var p = toScreen(rightSide[i]);
      vertex(p.x, p.y);
    }

    var p = toScreen(leftSide[0]);
    vertex(p.x, p.y);

    endShape();
  }

}

/**
 * draw an arm. this is basically the same idea as
 * drawing the body -- collect a bunch of points, and
 * draw a polygon
 */
function drawArm(points, flip) {

  let topSide = [];
  let bottomSide = [];
  for ( var i = 0; i < points.length; i++) {
    var f = points[i].getFixtureList();
    var t = f.m_body.getTransform();
    var s = f.getShape();
    var v, p;
    
    var vertList = [1, 0, 2, 3]
    if ( flip == true ) {
      vertList = [0, 1, 3, 2];
    }

    v = s.m_vertices[vertList[0]];
    p = mulVec2(t, v);
    topSide.push(p);

    v = s.m_vertices[vertList[1]];
    p = mulVec2(t, v);
    topSide.push(p);

    v = s.m_vertices[vertList[2]];
    p = mulVec2(t, v);
    bottomSide.push(p);

    v = s.m_vertices[vertList[3]];
    p = mulVec2(t, v);
    bottomSide.push(p);
  }

  // draw the body
  if ( topSide.length > 0 ) {
    beginShape();

    for ( var i = 0; i < topSide.length; i++ ) {
      var p = toScreen(topSide[i]);
      vertex(p.x, p.y);
    }
    for ( var i = bottomSide.length - 1; i >= 0; i-- ) {
      var p = toScreen(bottomSide[i]);
      vertex(p.x, p.y);
    }

    var p = toScreen(topSide[0]);
    vertex(p.x, p.y);

    endShape();
  }
}


/**
 * setup p5.js stuff. we'll call this from the actual
 * setup function, or when the user clicks the fullscreen button
 */
function setup() {
  // lightly modified from https://github.com/mrmrs/colors
  let colorPalette = [
//    color(0,31,63),
    color(0,116,217),
    color(127,219,255),
    color(57,204,204),
    color(61,153,112),
    color(46,204,64),
    color(1,255,112),
    color(255,220,0),
    color(255,133,27),    
    color(255,65,54),
    color(240,18,190),
    color(177,13,201),
    color(133,20,75),
    color(255, 0, 0),
    color(0, 255, 0),
    color(0, 0, 255),
  ];

  // find the sketch holder in the HTML output
  var wrapper = document.querySelector('#sketch');

  var w, h;

  // set pixel density to 1 so high-density/retina displays work alright
  pixelDensity(1);

  // figure out the screen dimensions
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

  var c = createCanvas(w, h);
  c.parent('sketch');

  frameRate(FRAME_RATE);
  
  // figure out our screen offsets. we want 
  // to put Box2d's (0,0) right in the middle of the screen
  offsetX = w / 2 / meterToPixel;
  offsetY = h / 2 / meterToPixel;
  
  bodyColor = random(colorPalette);
  
  // pick a spot for the body
  var maxX = offsetX * 0.6;
  var minX = -maxX;
  bodyXOffset = random(minX, maxX);
  
  bodyYOffset = random(-2.0, -0.1);

  world = new pl.World(Vec2(0, random(minGravity, maxGravity)));
  ground = world.createBody();
  ground.createFixture(pl.Edge(Vec2(-40.0, -offsetY), Vec2(40.0, -offsetY)), 0.0);

  // reset arrays holding our assorted objects
  rightArmPoints = [];
  leftArmPoints = [];
  points = [];

  
  setupBody();
  setupArms();
}



/**
 * do the work!
 */
function draw() {
  clear();

  // update planck.js world
  world.step(1 / FRAME_RATE);

  // check for wind gust
  if ( frameCount >= nextWind ) {
    //console.log("whoosh!");
    var g = world.getGravity();
    world.setGravity(Vec2(random(minWind, maxWind), g.y));

    lastWind = frameCount;
    nextWind = lastWind + random(FRAME_RATE * 10, FRAME_RATE * 20);
  }

  // check for random force
  if ( frameCount >= nextImpulse ) {
    // console.log("bonk!");
    lastImpulse = frameCount;
    nextImpulse = lastImpulse + random(20, 100);
    var body = random(points.slice(0, points.length));
    var position = body.getPosition();
    body.applyForce(Vec2(random(-MAX_FORCE, MAX_FORCE), 0), position, false);
  }

  // draw things!
  drawBody();  
  drawArm(leftArmPoints);
  drawArm(rightArmPoints, true);
  drawFace(head);
}
