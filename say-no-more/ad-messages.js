function adquote() {
  // Like,
  // puts a preselection of styles for the border.
  // Originally, there's more than these 3 ones but we kept that simple to avoid making the code more heavy.
  var 
    borderStylesArray = ["none", "solid", "double"],

  // Puts a preselection of colors for the original random.
    borderOrigColors = ["#FF0000","#00FFFF","#FF00FF","#0000FF","#FFFF00","#00FF00"],

  // ...or some junk.
    theBox = document.getElementById('thebox');

  if (borderStyle == "random") { // If random, selects randomly a style from the preselection but ignores the first option "none".
    var borderStyleSelect = theBox.style.borderStyle = borderStylesArray[getRandomInt(1, borderStylesArray.length - 1)];
  } else if (borderStyle == "fullrandom") { // If fullrandom, selects from the whole array.
    var borderStyleSelect = theBox.style.borderStyle = borderStylesArray[getRandomInt(0, borderStylesArray.length - 1)];
  } else { // Else, it takes the one choosen by the user.
    var borderStyleSelect = theBox.style.borderStyle = borderStyle;
  }

  if (borderColor == "original") { // If original, selects randomly a color from the preselection.
    var borderColorSelect = theBox.style.borderColor = borderOrigColors[getRandomInt(0, borderOrigColors.length - 1)];
  } else if (borderColor == "random") { // If random, generates a fully random color using the rgb() css feature.
    var borderColorSelect = theBox.style.borderColor = "rgb("+getRandomInt(0, 255)+", "+getRandomInt(0, 255)+", "+getRandomInt(0, 255)+")";
  } else { // Else, it takes the one choosen by the user.
    var borderColorSelect = theBox.style.borderColor = borderColor;
  }

  // This is the array that will be returned to actually put the quotes and the settings
  var arr = [
    borderStyleSelect,
    borderColorSelect,
    theBox.style.fontFamily = fontStyle,
    theBox.style.fontSize = fontSize,
    theBox.style.left = getRandomInt(0, 75)+"%",
    theBox.style.top = getRandomInt(0, 75)+"%",
    theBox.innerHTML = quotes[getRandomInt(0, quotes.length - 1)]
  ];

  return arr
};

// Randomisator
function getRandomInt(min, max) {
  return Math.floor(Math.random() * Math.floor(max) + min);
};

// STUFF FOR BEFORE DAWN
// Fetches the parameters in the query url.
var tmpParams = new URLSearchParams(document.location.search);
window.urlParams = {};

for(let k of tmpParams.keys() ) {
  window.urlParams[k] = tmpParams.get(k);
}

// If the parameter secs 'exists' (which is normally the case in beforedawn),
// it replaces the variables previously set by the ones set in beforedawn.
if (window.urlParams['secs'] != null) {
  var
    secs = window.urlParams['secs']*1000,
    borderStyle = window.urlParams['borderStyle'],
    borderColor = window.urlParams['borderColor'],
    fontStyle = window.urlParams['fontStyle'],
    fontSize = window.urlParams['fontSize']+"em";
};

// This will launch the whole shbang
window.onload = function() {
  adquote();
  setInterval(adquote, secs);
};