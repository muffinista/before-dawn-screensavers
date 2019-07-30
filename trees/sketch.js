const WIGGLE = 0.3;
const MIN_LENGTH = 20;
const MAX_LENGTH = 60;
const START_THICKNESS = 8;
const DRAW_MULTIPLIER = 1.5;

let trees = [];
let BRANCH_ANGLE;

let treeColor;
let backgroundColor;
let leafColor;

let w = 1000;
let h = 800;

let lastGrow = 0;
let growDelay = 5;

let resetDelay = 100;
let lastReset = resetDelay + 1;
let treeCount = 3;

function reset() {
  backgroundColor = color(135, 206, 235);
  treeColor = color(83, 53, 10);
  leafColor = color(58, 95, 11);

  backgroundColor = color(random(0, 255), random(0, 255), random(0, 255));
  treeColor = color(random(0, 255), random(0, 255), random(0, 255));
  leafColor = color(random(0, 255), random(0, 255), random(0, 255), random(100, 255));

  trees = [];
  for ( let x = 0; x < treeCount; x++ ) {
    addTree();
  }
}

function setup() {
  BRANCH_ANGLE = HALF_PI/5;

  createCanvas(w, h);
  frameRate(10);

  reset();
}

function draw() {
  if ( frameCount > resetDelay + lastReset ) {
    lastReset = frameCount;
    reset();
    return;
  }

  if ( lastGrow + growDelay < frameCount) {
    lastGrow = frameCount;

    trees.forEach(function(t) {
      t.grow();
    }); 
  }

  background(backgroundColor);

  trees.forEach(function(t) {
    t.display();
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

  display() {
    fill(leafColor);
    noStroke();
    ellipse(this.x, this.y, this.radius * 2, this.radius * 2);
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

  // otherTrees() {
  //   let self = this;
  //   return trees.filter((t) => {
  //     return (t !== self.tree);
  //   })
  // }

  // otherPoints() {
  //   return this.otherTrees().map((t) => t.points()).flat();
  // }

  // points() {
  //   return this.branches.concat(this.branches.map((b) => b.points())).flat();
  // }

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

  // pointAtSun() {
  //   // i am at this.p1
  //   // the sun is at sun
  //   return atan2(sun.y - this.p1.y, sun.x - this.p1.x);
  // }

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
  display() {
    stroke(treeColor);
    strokeWeight(this.size * DRAW_MULTIPLIER);
    noFill();
    line(this.p1.x, this.p1.y, this.p2.x, this.p2.y);

    for ( let w in this.branches ) {
      this.branches[w].display();
    }

    if ( this.leaf ) {
      this.leaf.display();
    }
  }
}
