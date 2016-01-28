//
// emoji fireplace!
// this is basically a port of yulelogbot.rb
//

FIRE = "1f525";
SMOKE = "1f4ad";
SPARKLES = "2728";
STAR = "1f31f";
DIZZY = "1f4ab";

// width/height of the output
var grid_w = 6;
var grid_h = 5;


// sprite sources/scaling
var sprite_size = 72;
var sprite_scale = 1.0;
var urlBase = "https://raw.githubusercontent.com/twitter/twemoji/gh-pages/72x72/";
var images = {};

var emitters = [];

var offset;

var decorations = [];

BASE_CHANGE_CHANCE = 0.5;
MAX_LEVEL = 5;
MIN_DECORATION_LEVEL = 2;
DECORATION_CHANCE = 0.06;
MAX_DIFF = 2;

var grow_bump = 0.1;


/*
 * load the emoji image from its code
 */
function codeToImage(c) {
    return loadImage(urlBase + c + ".png");
}


/**
 * p5 setup call
 */
function setup() {
    for ( var i = 0; i < grid_w; i++ ) {
        emitters.push(1.0);
    }

    offset = sprite_size * sprite_scale;

    // create the canvas, put it in the #fireplace div
    var c = createCanvas(grid_w * offset, grid_h * offset);
    c.parent('fireplace');

    images.FIRE = codeToImage(FIRE);
    images.SMOKE = codeToImage(SMOKE);
    images.SPARKLES = codeToImage(SPARKLES);
    images.STAR = codeToImage(STAR);
    images.DIZZY = codeToImage(DIZZY);

    decorations = [
        images.SMOKE,
        images.SPARKLES,
        images.STAR,
        images.DIZZY
    ];

    frameRate(8);
}


/**
 * generate another generation of our fire emitters
 */
function updateEmitters() {
    var new_emitters = [];
    var check_count = 0;

    // we'll run this 10 times, checking to see if we're happy with the output
    // each time. if we're never happy, we just give up and return what we have
    while( check_count < 10 && ( new_emitters.length == 0 || ! is_valid(new_emitters) ) )  {
        check_count = check_count + 1;
        new_emitters = _.map(emitters, function(e) {
            chance = BASE_CHANGE_CHANCE + ( Math.abs(3-e) * 0.1);
            
            var acted = false;

            // check if the fire grows
            if ( e < MAX_LEVEL ) {
                chance = BASE_CHANGE_CHANCE + (e*0.1);
                do_grow = random() > chance - grow_bump;
                if (do_grow) {
                    e = e + 1;
                    return e;
                }
            }
            
            // check if it shrinks
            if ( ! acted && e > 1 ) {
                chance = BASE_CHANGE_CHANCE - (e*0.05);
                if ( e == MAX_LEVEL ) {
                    chance = 0.2;
                }
                do_shrink = random() > chance;

                if ( do_shrink ) {
                    e = e - 1;
                }
            }

            return e;
        });
    }

    emitters = new_emitters;
}

/**
 * do some simple checks to make sure that we're happy with the output. mostly
 * this checks that the height differences between emitters isn't too bad. this
 * is probably skippable if there are performance problems.
 */
function is_valid(row) {
    var valid = true;
    for ( var i = 0; i < emitters.length; i++ ) {
        var neighbors, l, r;
        l = i - 1;
        r = i + 1;

        if ( l < 0 ) {
            l = emitters.length - 1;
        }
        if ( r >= emitters.length ) {
            r = 0;
        }

        neighbors = [row[l] , row[r]];
        var e = row[i];
        valid = _.all(neighbors, function(n) {
            var x = Math.abs(n-e) <= MAX_DIFF;
            return x;}) == true;

        if ( valid == false ) {
            return false;
        }
    }

    return true;
}


/**
 * p5.js draw loop
 */
function draw() {
    var sprite;

    // call clear to ensure that our background is transparent
    clear();

    // create new emitters
    updateEmitters();

    // iterate through the emitters
    for ( var x = 0; x < grid_w; x++ ) {
        var value = emitters[x];

        // check each height and determine if we should be drawing or not
        for ( var y = 0; y < grid_h; y++ ) {
            if ( y <= value ) {
                // random chance of decorations instead of fire
                if ( value > MIN_DECORATION_LEVEL && 
                     random() <= DECORATION_CHANCE && 
                     (value == y || value == y - 1) ) {
                    sprite = _.sample(decorations);
                }
                else {
                    sprite = images.FIRE;
                }

                // draw the sprite!
                image(sprite,
                      x * offset, (grid_h - y) * offset,
                      sprite_size * sprite_scale, sprite_size * sprite_scale);
            }
        }

    }


}