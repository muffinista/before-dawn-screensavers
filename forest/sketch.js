const WIGGLE = 0.3;
const MIN_LENGTH = 30;
const MAX_LENGTH = 50;
const START_THICKNESS = 7;

let trunk;
let BRANCH_ANGLE;

let w = 800;
let h = 600;

function setup() {
  BRANCH_ANGLE = HALF_PI/5;

  createCanvas(w, h);

  let base = new Particle(w/2, h);
  trunk = new Wood(base, MAX_LENGTH, START_THICKNESS, -HALF_PI);
  frameRate(10);
}

function draw() {
  background(135, 206, 235);
  trunk.display();
}

// Child class 
class Particle extends p5.Vector {
}

class Leaf extends Particle {
  constructor(x, y) {
    super(x, y);
    this.radius = 12;
  }

  display() {
    fill(58, 95, 11);
    noStroke();
    ellipse(this.x, this.y, this.radius * 2, this.radius * 2);
  }
}

class Wood {
  constructor(p1, length, size, angle) {
    this.p1 = p1;

    this.length = length;
    this.size = size;
    this.angle = angle;

    this.calculateEndPoint();

    let d = dist(this.p1.x, this.p1.y, this.p2.x, this.p2.y);

    if ( this.size > 1 ) {
      this.addBranches();
    }
    else {
      this.addLeaf();
    }
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

  addBranches() {
    let chance = random();
    this.branches = [];

    if ( chance > 0.2 ) {
      this.branches.push(new Wood(this.p2, random(MIN_LENGTH, MAX_LENGTH), this.size - 1,
        this.angle - BRANCH_ANGLE + random(-WIGGLE, WIGGLE)));
      this.branches.push(new Wood(this.p2, random(MIN_LENGTH, MAX_LENGTH), this.size - 1,
        this.angle + BRANCH_ANGLE + random(-WIGGLE, WIGGLE)));
    }
    else if ( chance > 0.1 ) {
      this.branches.push(new Wood(this.p2, random(MIN_LENGTH, MAX_LENGTH), this.size - 1,
        this.angle - BRANCH_ANGLE + random(-WIGGLE, WIGGLE)));
      this.branches.push(new Wood(this.p2, random(MIN_LENGTH, MAX_LENGTH), this.size - 1,
        this.angle + BRANCH_ANGLE + random(-WIGGLE, WIGGLE)));
      this.branches.push(new Wood(this.p2, random(MIN_LENGTH, MAX_LENGTH), this.size - 1,
        this.angle - BRANCH_ANGLE + random(-WIGGLE, WIGGLE)));
    }
    else {
      this.branches.push(new Wood(this.p2, random(MIN_LENGTH, MAX_LENGTH), this.size - 1,
        this.angle + BRANCH_ANGLE + random(-WIGGLE, WIGGLE)));
    }
  }

  addLeaf() {
    this.leaf = new Leaf(this.p2.x, this.p2.y)
  }

  rotate(t) {
    this.angle += t;
    this.calculateEndPoint();

    for ( let w in this.branches ) {
      this.branches[w].rotate(t);
    }

    if ( this.leaf ) {
      this.leaf.x = this.p2.x;
      this.leaf.y = this.p2.y;
    }
  }

  // Draw the branch
  display() {
    stroke(83, 53, 10);
    strokeWeight(this.size * 2);
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
