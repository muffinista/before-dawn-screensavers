const VerletPhysics2D = toxi.physics2d.VerletPhysics2D;
const GravityBehavior = toxi.physics2d.behaviors.GravityBehavior;
const VerletParticle2D = toxi.physics2d.VerletParticle2D;
const VerletSpring2D = toxi.physics2d.VerletSpring2D;
const Vec2D = toxi.geom.Vec2D;
const Rect = toxi.geom.Rect;

const SPRING_STRENGTH = 0.01;
const WIGGLE = 0.3;
const MIN_LENGTH = 30;
const MAX_LENGTH = 50;


// Reference to physics world
let physics;
let trunk;
let BRANCH_ANGLE;

let w = 800;
let h = 600;

var f;

function setup() {
  BRANCH_ANGLE = HALF_PI/5;

  createCanvas(w, h);

  // Initialize the physics
  physics = new VerletPhysics2D();
  //  physics.addBehavior(new GravityBehavior(new Vec2D(0, 0.1)));
  //  physics.addBehavior(new toxi.physics2d.behaviors.ConstantForceBehavior(new Vec2D(0.01, 0)));

  // Set the world's bounding box
  physics.setWorldBounds(new Rect(0, 0, width, height));
  physics.setDrag(0.5);

  let base = new Particle(w/2, h);
  trunk = new Wood(base, 50, 7, -HALF_PI);
  trunk.p1.lock();
  trunk.p2.lock();

  frameRate(10);
}

function draw() {
  physics.update();

  background(135, 206, 235);
  trunk.display();
}

// Child class 
class Particle extends VerletParticle2D {
  constructor(x, y) {
    super(new Vec2D(x, y), 0.01);
    // this.radius = 4;
  }
}

class Leaf extends VerletParticle2D {
  constructor(x, y) {
    super(new Vec2D(x, y), 0);
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
    this.spring = new VerletSpring2D(this.p1, this.p2, d, SPRING_STRENGTH);

    physics.addParticle(this.p1);
    physics.addParticle(this.p2);
    physics.addSpring(this.spring);

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
    this.leafSpring = new VerletSpring2D(this.p2, this.leaf, 0, SPRING_STRENGTH);

    physics.addParticle(this.leaf);
    physics.addSpring(this.leafSpring);
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
