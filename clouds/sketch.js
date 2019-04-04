let clouds = [];
const MAX_CLOUDS = 10;

function setup() {
  createCanvas(640, 480);
  for ( let i = 0; i < MAX_CLOUDS; i++ ) {
    addCloud();
  }
}

function draw() {
  // put drawing code here
  background(0, 0, 255);

  let i = clouds.length;
  while (i--) {
    let c = clouds[i];
    if ( c.dead ) {
      clouds.splice(i, 1);
      addCloud();
    }
    else {
      c.draw();
      c.move();
    }
  }
}

function addCloud() {
  let size = 1;
  let x = 0;
  let y = random(-10, height * 0.25);
  let speed = random() * 1.2;
  clouds.push(new Cloud(x, y, size, speed));
}

class Cloud {
  constructor(x, y, size, speed) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.speed = speed;
    this.drawBottom = true;
    this.segmentWidth = 35;

    let segmentX = [0, 10, 25, 40];
    let topOffsets = [
      random(15, 25),
      random(25, 45),
      random(25, 55),
      random(15, 30)
    ];
    let bottomOffsets = [
      random(15, 25),
      random(25, 45),
      random(25, 55),
      random(15, 30)
    ];

    this.sprite = createGraphics(300, 300);
    this.sprite.fill(255);
    this.sprite.stroke(255);
  
    for ( let i = 0; i < segmentX.length; i++ ) {
      let x = segmentX[i] + 20;
      let y = 35;
      let offset = topOffsets[i];

      this.sprite.arc(x, y, this.segmentWidth * this.size, offset * this.size, PI, TWO_PI);
      
      if ( this.drawBottom ) {
        let bottomOffset = bottomOffsets[i];
        this.sprite.arc(x, y - 1, this.segmentWidth * this.size, bottomOffset * this.size, 0, PI);
      }  
    }
  }

  draw() {
    tint(255, 240);
    image(this.sprite, this.x, this.y);
  }

  move() {
    this.x = this.x + this.speed;
  }

  setPos(x, y) {
    this.x = x;
    this.y = y;
  }

  get dead() {
    return this.x > width;
  }
}
