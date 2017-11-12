var myFont;
function preload() {
  myFont = loadFont('VeraMoBd.ttf');
}

function setup() {
  // figure out the screen dimensions
  if ( typeof(window.urlParams) !== "undefined" ) {
    display_width = parseInt(window.urlParams.width, 10);
    display_height = parseInt(window.urlParams.height, 10);
  }
  else {
    display_width = screen.width;
    display_height = screen.height;
  }

  display_width = parseInt(display_width, 10);
  display_height = parseInt(display_height, 10);

  // we'll generate a video 160px wide and maintaining the screen's
  // aspect ration
  ratio = display_width/display_height
  capture_width = 160;
  capture_height = 160 / ratio;
 
  
  frameRate(5);
  createCanvas(display_width, display_height);
  capture = createCapture(VIDEO);
  capture.size(capture_width, capture_height);
  capture.hide();

  textFont(myFont);
  textSize(64);
  textAlign(RIGHT, BOTTOM);
}

function zeroPad(i) {
  if (i < 10) {
    i = "0" + i;
  }
  return i;
}

function draw() {
  //tint(255, 0, 0);

  image(capture, 0, 0, display_width, display_height);
  // THRESHOLD, GRAY, OPAQUE, INVERT, POSTERIZE, BLUR, ERODE or DILATE
  //filter('THRESHOLD', 0.6);
  filter('POSTERIZE', 4);


  var today = new Date();
  var h = zeroPad(today.getHours());
  var m = zeroPad(today.getMinutes());
  var s = zeroPad(today.getSeconds());
  var ms = zeroPad(Math.round(today.getMilliseconds() / 10));
  var t = h + ":" + m + ":" + s + "." + ms;

  var boxWidth = textWidth(t) + 20;
  var boxHeight = textAscent() + textDescent();

  // draw a box to hold the timestamp
  fill(0);
  rect(width-boxWidth, height-boxHeight, boxWidth, boxHeight);

  // draw the timestamp
  fill(255);
  text(t, width - 10, height);

}
