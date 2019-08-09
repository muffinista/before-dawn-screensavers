const WIGGLE = 0.3;
const MIN_LENGTH = 20;
const MAX_LENGTH = 60;
const START_THICKNESS = 9;
const DRAW_MULTIPLIER = 1.5;
const BLUR_AMOUNT = 3.0;

const PADDING = 20;

let trees = [];
let BRANCH_ANGLE;

let lastGrow = 0;
let growDelay = 5;

let resetDelay = 100;
let lastReset = resetDelay + 1;
let treeCount = 2;

let w, h;
let screenWidth, screenHeight;

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

var minTreeDelay = 20000;
var maxTreeDelay = 30000;

// we'll randomly pick an easing equation for the tween
// make a list of all the easing types, we'll pick one randomly
// and we'll skip the 'none' easing which comes first in the array
var easings = [].concat.apply([],
  Object.values(TWEEN.Easing).map(function(x) { return Object.values(x); })).slice(1);  

function setupTreeTween() {
  treeTween = new TWEEN.Tween(treeAttributes).to({alpha: 255}, 2500).
    chain(new TWEEN.Tween(treeAttributes).to({alpha: 0}, 2500).delay(minTreeDelay).onComplete(resetTree));

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
    r: random(80, 185),
    g: random(80, 185),
    b: random(80, 185),
  };

  colorTween = new TWEEN.Tween(srcColor).
                         to(destColor, random(minColorTime, maxColorTime)).
                         delay(random(minHoldTime, maxHoldTime)).
                         onComplete(resetColorTween);
  return colorTween;
}

function resetColorTween() {
  setupColorTween().start();
}


function resetTree() {
  trees = [];
  for ( let x = 0; x < treeCount; x++ ) {
    addTree();
  }

  for ( x = 0; x < 10; x++ ) {
    trees.forEach(function(t) {
      t.grow();
    });  
  }

  // render images for all the trees
  trees.forEach(function(t) {
    t.display();
  });

  resetTreeTween();
}
function reset() {
  resetTree();
  resetColorTween();
}

function setup() {
  BRANCH_ANGLE = HALF_PI/5;

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
  frameRate(10);

  reset();
}

function draw() {
  background(srcColor.r, srcColor.g, srcColor.b);

  // brightness(255);
  tint(255, treeAttributes.alpha);

  trees.forEach(function(t) {
    // t.display();
    image(t.pg, t.drawLocation.x, t.drawLocation.y);
  });

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

  display(pg, leafColor) {
    pg.fill(leafColor);
    pg.noStroke();
    pg.ellipse(this.x, this.y, this.radius * 2, this.radius * 2);
  }
}

class Wood {
  constructor(p1, length, size, angle, root) {
    this.length = length;
    this.size = size;
    this.growSize = 0;
    this.branches = [];

    if ( ! root ) {
      this.tree = this;
      this.angle = angle;
      this.p1 = new Particle(0, 0);
      this.rootPoint = p1;
      this.treeColor = color(random(20, 120), random(20, 120), random(20, 120));
      this.leafColor = color(random(0, 255), random(0, 255), random(0, 255));
    }
    else {
      this.tree = root;
      this.angle = this.calculateAngle(angle);
      this.p1 = p1;
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

  allBranches() {
    return this.branches.concat(this.branches.map((b) => b.allBranches())).flat();
  }

  points() {
    return this.allBranches().map((b) => [b.p1, b.p2]).flat();
  }

  // Draw the branch
  display() {
    if ( this === this.tree && ! this.drawLocation ) {
      let tmp = this.points();
      let xMin = Math.min(...tmp.map((p) => p.x)) - PADDING;
      let xMax = Math.max(...tmp.map((p) => p.x)) + PADDING;
      let yMin = Math.min(...tmp.map((p) => p.y)) - PADDING;

      // allow branches/leaves to go below the bottom point of the image
      // let yMax = Math.min(Math.max(...tmp.map((p) => p.y)), this.p1.y); // + PADDING;
      let yMax = this.p1.y; // + PADDING;

      this.drawWidth = xMax - xMin;
      this.drawHeight = yMax - yMin;

      this.pg = createGraphics(this.drawWidth, this.drawHeight);
      this.pg.filter(BLUR, BLUR_AMOUNT);

      this.pg.translate(-xMin, -yMin);

      this.drawLocation = this.rootPoint;
      this.drawLocation.x = this.drawLocation.x - this.drawWidth / 2;
      this.drawLocation.y = this.drawLocation.y - this.drawHeight;

      // handy for debugging
      // this.pg.background(255);
      // this.pg.rect(0, 0, this.drawWidth, this.drawHeight);
    }

    this.tree.pg.stroke(this.tree.treeColor);
    this.tree.pg.strokeWeight(this.size * DRAW_MULTIPLIER);
    this.tree.pg.noFill();
    this.tree.pg.line(this.p1.x, this.p1.y, this.p2.x, this.p2.y);

    for ( let w in this.branches ) {
      this.branches[w].display();
    }

    if ( this.leaf ) {
      this.leaf.display(this.tree.pg, this.tree.leafColor);
    }
  }
}

// Setup the animation loop.
function animate(time) {
  TWEEN.update(time);
  requestAnimationFrame(animate);
}

animate();