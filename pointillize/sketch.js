var img;
var smallPoint, largePoint;

function preload() {
    var url = unescape(decodeURIComponent(window.urlParams.screenshot));
    img = loadImage(url);
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

    createCanvas(display_width, display_height);

    smallPoint = 4;
    largePoint = 20;

    imageMode(CENTER);
    noStroke();
    background(0);

    img.loadPixels();
}

function draw() {
    // original script was interactive and used the mouse position.
    //    let's try it with a random value instead
    //  var pointillize = map(mouseX, 0, width, smallPoint, largePoint);
    var pointillize = random(smallPoint, largePoint);

    var x = floor(random(img.width));
    var y = floor(random(img.height));
    var pix = img.get(x, y);

    fill(pix, 128);
    ellipse(
        map(x, 0, img.width, 0, width),
        map(y, 0, img.height, 0, height),
        pointillize, pointillize);
}
