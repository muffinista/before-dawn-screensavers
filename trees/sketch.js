const WIGGLE = 0.3;
const MIN_LENGTH = 20;
const MAX_LENGTH = 50;
const START_THICKNESS = 9;
const DRAW_MULTIPLIER = 1.5;
const BLUR_AMOUNT = 3.0;

const PADDING = 30;
const LEAF_RADIUS = 12;

const minColorTime = 5000;
const maxColorTime = 15000;

const minHoldTime = 10000;
const maxHoldTime = 30000;

const minTreeDelay = 2000;
const maxTreeDelay = 5000;

let treeCount = 3;

let trees = [];
let treeTweens = [];

let BRANCH_ANGLE;

let w, h;
let screenWidth, screenHeight;

// store the color tween object
var colorTween;

// tween background from this color....
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


/**
 * main p5js setup function
 */
function setup() {
  BRANCH_ANGLE = HALF_PI/5;

  pixelDensity(1);

  if ( typeof(window.urlParams) !== "undefined" ) {
    w = window.urlParams.width;
    h = window.urlParams.height;

    if ( typeof(window.Trees) !== "undefined" ) {
      treeCount = parseInt(window.urlParams.Trees, 10);
    }
  }
  else {
    w = screen.width;
    h = screen.height;
  }


  screenWidth = w;
  screenHeight = h;

  // note -- if you don't do this, width/height will be strings!
  w = parseInt(w, 10);
  h = parseInt(h, 10);

  createCanvas(screenWidth, screenHeight);
  frameRate(30);
  
  reset();
}

/**
 * p5js draw loop
 */
function draw() {
  background(srcColor.r, srcColor.g, srcColor.b);
  brightness(255);

  for ( let x = 0; x < treeCount; x++ ) {
    let t = trees[x];
    tint(255, treeTweens[x].alpha);
    image(t.pg, t.drawLocation.x, height - t.pg.height);
  };
}
  

/**
 * setup a tween for a single tree
 * @param {*} index 
 */
function setupTreeTween(index) {
  // we're not really using this value but it might
  // be handy someday?
  treeTweens[index].iteration += 1;

  let middleTween = {
    alpha: 255,
    iteration: treeTweens[index].iteration
  };

  let endTween = {
    alpha: 0,
    iteration: middleTween.iteration
  };

  treeTween = new TWEEN.Tween(treeTweens[index]).
    to(middleTween, random(minTreeDelay, maxTreeDelay)).
    chain(
      new TWEEN.Tween(treeTweens[index]).
        to(endTween, random(minTreeDelay, maxTreeDelay)).
        delay(random(minHoldTime, maxHoldTime)).
        onComplete(() => { resetTree(index) })
    );

  return treeTween;
}

/**
 * when a tree is done tweening, start another tween
 * @param {*} index 
 */
function resetTreeTween(index) {
  setupTreeTween(index).start();
}

/**
 * setup a new color tween
 */
function setupColorTween() {
  srcColor.r = destColor.r;
  srcColor.g = destColor.g;
  srcColor.b = destColor.b;
  srcColor.alreadyRun = destColor.alreadyRun;

  destColor = {
    r: random(80, 185),
    g: random(80, 185),
    b: random(80, 185),
    alreadyRun: true
  };

  colorTween = new TWEEN.Tween(srcColor).
                         to(destColor, random(minColorTime, maxColorTime));

  if ( srcColor.alreadyRun !== undefined ) {
    colorTween = colorTween.delay(random(minHoldTime, maxHoldTime));
  }
  colorTween = colorTween.onComplete(resetColorTween);

  return colorTween;
}

/**
 * reset color tween when finished
 */
function resetColorTween() {
  setupColorTween().start();
}


/**
 * create a tree at a random location
 */
function createTree() {
  let x = random(0, w);
  let y = h;

  let base = new Particle(x, y);
  let angle = -PI/2;
  return new Wood(base, MAX_LENGTH, START_THICKNESS, angle);
}

/**
 * regenerate a tree
 * 
 * @param {index} where to put the tree in our array
 */
function resetTree(index) {
  let t = createTree();
  trees[index] = t;
  resetTreeTween(index);
}

/**
 * reset the entire sketch
 */
function reset() {
  trees = [];
  for ( let x = 0; x < treeCount; x++ ) {
    trees.push(undefined);
    treeTweens.push({alpha: 0, iteration: 0});
    resetTree(x);
  }

 resetColorTween();
}


// Child class 
class Particle extends p5.Vector {}

class Leaf extends Particle {
  /**
   * 
   * @param {x coordinate} x 
   * @param {y coordinate} y 
   * @param {radius of leaf} r 
   */
  constructor(x, y, r) {
    super(x, y);
    this.radius = r;
  }

  /**
   * Draw the leaf onto the specified graphics object
   * 
   * @param {Graphics object} pg 
   * @param {color} leafColor 
   */
  display(pg, leafColor) {
    pg.fill(leafColor);
    pg.noStroke();
    pg.ellipse(this.x, this.y, this.radius * 2, this.radius * 2);
  }
}

/**
 * this class is basically a chunk of wood in a tree -- a branch/etc
 */
class Wood {
  /**
   * 
   * @param {Particle} p1 starting point
   * @param {number} length length of branch
   * @param {number} size size/thickness of branch
   * @param {number} angle angle branch is pointing
   * @param {Wood} root the trunk of the tree for this branch
   */
  constructor(p1, length, size, angle, root) {
    this.length = length;
    this.size = size;
    this.growSize = 0;
    this.branches = [];

    if ( ! root ) {
      // this is the first element in the tree. we start each tree
      // at coordinates 0, 0
      this.p1 = new Particle(0, 0);

      this.tree = this;
      this.angle = angle;
      this.rootPoint = p1;
      this.treeColor = color(random(20, 120), random(20, 120), random(20, 120));
      this.leafColor = color(random(0, 255), random(0, 255), random(0, 255), 120);
    }
    else {
      this.tree = root;
      this.angle = this.calculateAngle(angle);
      this.p1 = p1;
    }

    this.calculateEndPoint();

    if ( this.tree == this ) {
      for ( let i = 0; i < 10; i++ ) {
        this.grow();
      }  
      // render image
      this.display();
      this.scaleFactor = 0.5 + (Math.random() * 1.5);
      this.pg.width /= this.scaleFactor;
      this.pg.height /= this.scaleFactor;
    }
  }

  /**
   * extend this branch out one level
   */
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

  /**
   * return the angle this branch should travel. this doesn't
   * really do anything right now, but in theory we could mutate
   * the angle in weird ways, so i'm leaving it in place
   * @param {number} angle 
   */
  calculateAngle(angle) {
    return angle;
  }

  /**
   * figure out the end point of this piece of wood, which
   * is simply the starting point plus the length in our
   * given direction
   */
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

  /**
   * add a branch to this chunk
   * 
   * @param {number} a angle of new branch
   */
  addBranch(a) {
    let w = new Wood(this.p2,
      random(MIN_LENGTH, MAX_LENGTH),
      this.size - 1,
      a + random(-WIGGLE, WIGGLE),
      this.tree);
    this.branches.push(w);
  }

  /**
   * add branches to this piece of wood
   */
  addBranches() {
    let chance = random();

    // add two branches
    if ( chance > 0.2 ) {
      this.addBranch(this.angle - BRANCH_ANGLE);
      this.addBranch(this.angle + BRANCH_ANGLE);
    }
    // add three branches
    else if ( chance > 0.1 ) {
      this.addBranch(this.angle - BRANCH_ANGLE);
      this.addBranch(this.angle + BRANCH_ANGLE);
      this.addBranch(this.angle);
    }
    // add a single branch
    else {
      this.addBranch(this.angle);
    }
  }

  /**
   * add a leaf to the end of the branch
   */
  addLeaf() {
    let r = LEAF_RADIUS;
    let x = this.p2.x + r * cos(this.angle);
    let y = this.p2.y + r * sin(this.angle);

    this.leaf = new Leaf(x, y, r);
  }

  /**
   * return all branches descended from this one
   */
  allBranches() {
    return this.branches.concat(this.branches.map((b) => b.allBranches())).flat();
  }

  /**
   * return all points in all branches descended from this branch
   */
  points() {
    return this.allBranches().map((b) => [b.p1, b.p2]).flat();
  }

  /**
   * return all leafs on branches descended from this branch
   */
  allLeafs() {
    return this.allBranches().map((b) => b.leaf).flat().filter((l) => l !== undefined);
  }


  /**
   * render the branch and any descendants. if this is the trunk
   * of a tree, we also generate a graphics object to hold the output 
   * and do some calculations to get the expected width/height/etc
   */
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

    // draw leaves separately, once everything else is drawn
    if ( this === this.tree ) {
      for ( let l of this.allLeafs() ) {
        l.display(this.tree.pg, this.tree.leafColor);
      }
    }
  }
}

// Setup the animation loop.
function animate(time) {
  TWEEN.update(time);
  requestAnimationFrame(animate);
}

animate();