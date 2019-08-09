const WIGGLE = 0.3;
const MIN_LENGTH = 20;
const MAX_LENGTH = 60;
const START_THICKNESS = 9;
const DRAW_MULTIPLIER = 1.5;
const BLUR_AMOUNT = 3.0;

let trees = [];
let BRANCH_ANGLE;

let treeColor;
let leafColor;

let lastGrow = 0;
let growDelay = 5;

let resetDelay = 100;
let lastReset = resetDelay + 1;
let treeCount = 3;
let treeGraphics;


let treeAttributes = {
  alpha: 0
};

let treeTween;

// store the color tween object
var colorTween;

// tween from this color....
var srcColor = {
  r: 0,
  g: 0,
  b: 0
};

// .... to this color
var destColor = {
  r: 0,
  g: 0,
  b: 0
};

var minColorTime = 5000;
var maxColorTime = 15000;

var minHoldTime = 5000;
var maxHoldTime = 15000;

// we'll randomly pick an easing equation for the tween
// make a list of all the easing types, we'll pick one randomly
// and we'll skip the 'none' easing which comes first in the array
var easings = [].concat.apply([],
  Object.values(TWEEN.Easing).map(function(x) { return Object.values(x); })).slice(1);  

function setupTreeTween() {
  treeTween = new TWEEN.Tween(treeAttributes).to({alpha: 255}, 2500).
    chain(new TWEEN.Tween(treeAttributes).to({alpha: 0}, 2500).delay(100000).onComplete(resetTree));

  return treeTween;
}

function resetTreeTween() {
  setupTreeTween().start();
}


function setupColorTween() {
  srcColor.r = destColor.r;
  srcColor.g = destColor.g;
  srcColor.b = destColor.b;

  destColor = {
    // r: random(0, 255),
    // g: random(0, 255),
    // b: random(0, 255),
    r: random(80, 185),
    g: random(80, 185),
    b: random(80, 185),
  };

  colorTween = new TWEEN.Tween(srcColor).
                         to(destColor, random(minColorTime, maxColorTime)).
                         delay(random(minHoldTime, maxHoldTime)).
                         //easing(random(easings)).
                         onComplete(resetColorTween);
  return colorTween;
}

function resetColorTween() {
  setupColorTween().start();
}



function resetTree() {
//  treeColor = color(random(0, 255), random(0, 255), random(0, 255));
  treeColor = color(random(20, 120), random(20, 120), random(20, 120));
  leafColor = color(random(0, 255), random(0, 255), random(0, 255));

  trees = [];
  for ( let x = 0; x < treeCount; x++ ) {
    addTree();
  }

  for ( x = 0; x < 10; x++ ) {
    trees.forEach(function(t) {
      t.grow();
    });  
  }

  treeGraphics.clear();
  trees.forEach(function(t) {
    t.display(treeGraphics);
  });

  filter(BLUR, BLUR_AMOUNT);

  resetTreeTween();
}
function reset() {
  resetTree();
  resetColorTween();
}

let w, h;
let screenWidth, screenHeight;

function setup() {
  BRANCH_ANGLE = HALF_PI/5;

  // var wrapper = document.querySelector('#sketch');
  // var w, h, c, ratio;

  // LEARN FROM MY MISTAKES!!!! Set the pixel density to 1
  // by default to handle random math issues on retina displays
  // if you're doing direct pixel manipulation or other weird
  // stuff. if you don't think you're going to do that, then
  // you can remove this
  pixelDensity(1);

  if ( typeof(window.urlParams) !== "undefined" ) {
    w = window.urlParams.width;
    h = window.urlParams.height;
  }
  else {
    w = screen.width;
    h = screen.height;
  }

  w = 1000;
  h = 800;

  screenWidth = w;
  screenHeight = h;

  // note -- if you don't do this, width/height will be strings!
  w = parseInt(w, 10);
  h = parseInt(h, 10);

  createCanvas(screenWidth, screenHeight);
  frameRate(15);

  treeGraphics = createGraphics(w, h);
  reset();
}

function draw() {
  background(srcColor.r, srcColor.g, srcColor.b);

  brightness(255);
  tint(255, treeAttributes.alpha);
  image(treeGraphics, 0, 0, screenWidth, screenHeight);
}

function addTree() {
  let x = random(0, w);
  let y = h;

  let base = new Particle(x, y);
  let angle = -PI/2;
  trees.push(new Wood(base, MAX_LENGTH, START_THICKNESS, angle));
}

// Child class 
class Particle extends p5.Vector {}

class Leaf extends Particle {
  constructor(x, y) {
    super(x, y);
    this.radius = 12;
  }

  display(pg) {
    pg.fill(leafColor);
    pg.noStroke();
    pg.ellipse(this.x, this.y, this.radius * 2, this.radius * 2);
  }
}

class Wood {
  constructor(p1, length, size, angle, root) {
    this.p1 = p1;

    this.length = length;
    this.size = size;
    this.growSize = 0;
    this.branches = [];

    if ( ! root ) {
      this.tree = this;
      this.angle = angle;
    }
    else {
      this.tree = root;
      this.angle = this.calculateAngle(angle);
    }

    this.calculateEndPoint();
  }

  grow() {
    if ( this.size === 1 ) {
      if ( ! this.leaf ) {
        this.addLeaf();
      }
      return;
    }
    else if ( this.branches.length === 0 ) {
      this.addBranches();
      this.growSize += 1;
    }
    else {
      this.branches.forEach(function(b) {
        b.grow();
      });
    }
  }

  calculateAngle(angle) {
    return angle;
  }


  calculateEndPoint() {
    let x = this.p1.x + this.length * cos(this.angle);
    let y = this.p1.y + this.length * sin(this.angle);

    if ( ! this.p2 ) {
      this.p2 = new Particle(x, y, 10);
    }
    else {
      this.p2.x = x;
      this.p2.y = y;
    }
  }

  addBranch(a) {
    let w = new Wood(this.p2,
      random(MIN_LENGTH, MAX_LENGTH),
      this.size - 1,
      a + random(-WIGGLE, WIGGLE),
      this.tree);
    this.branches.push(w);
  }

  addBranches() {
    let chance = random();

    if ( chance > 0.2 ) {
      this.addBranch(this.angle - BRANCH_ANGLE);
      this.addBranch(this.angle + BRANCH_ANGLE);
    }
    else if ( chance > 0.1 ) {
      this.addBranch(this.angle - BRANCH_ANGLE);
      this.addBranch(this.angle + BRANCH_ANGLE);
      this.addBranch(this.angle);
    }
    else {
      this.addBranch(this.angle);
    }
  }

  addLeaf() {
    this.leaf = new Leaf(this.p2.x, this.p2.y)
  }

  // Draw the branch
  display(pg) {
    pg.stroke(treeColor);
    pg.strokeWeight(this.size * DRAW_MULTIPLIER);
    pg.noFill();
    pg.line(this.p1.x, this.p1.y, this.p2.x, this.p2.y);

    for ( let w in this.branches ) {
      this.branches[w].display(pg);
    }

    if ( this.leaf ) {
      this.leaf.display(pg);
    }
  }
}

// Setup the animation loop.
function animate(time) {
  TWEEN.update(time);
  requestAnimationFrame(animate);
}

animate();