// The border selector. Don't ask why i had to recode it like this... This is BS...
function borderStyleSelect(borderStyle) {
  const borderStylesArray = ["none", "solid", "double"];

  if (borderStyle == "random") { // If random, selects randomly a style from the preselection but ignores the first option "none".
    return borderStylesArray[getRandomInt(1, borderStylesArray.length - 1)];
  } else if (borderStyle == "fullrandom") { // If fullrandom, selects from the whole array.
    return borderStylesArray[getRandomInt(0, borderStylesArray.length - 1)];
  } else { // Else, it takes the one choosen by the user.
    return borderStyle;
  }
}

////////////////////////////////////////////////////////////////////////////////

// The color selector. Don't ask why i had to recode it like this... This is BS...
function borderColorSelect(borderColor) {
  borderOrigColors = ["#FF0000","#00FFFF","#FF00FF","#0000FF","#FFFF00","#00FF00"];

  if (borderColor == "original") { // If original, selects randomly a color from the preselection.
    return borderOrigColors[getRandomInt(0, borderOrigColors.length - 1)];
  } else if (borderColor == "random") { // If random, generates a fully random color using the rgb() css feature.
    return "rgb("+getRandomInt(0, 255)+", "+getRandomInt(0, 255)+", "+getRandomInt(0, 255)+")";
  } else { // Else, it takes the one choosen by the user.
    return borderColor;
  }
}

/////////////////////////////////////////////////////////////////////////

// This constructs the box
function adquote(quote) {
  const theBox = document.getElementById('thebox');

  let arr = [
    theBox.style.borderStyle = borderStyleSelect(borderStyle),
    theBox.style.borderColor = borderColorSelect(borderColor),
    theBox.style.fontFamily = fontStyle,
    theBox.style.fontSize = fontSize,
    theBox.style.left = getRandomInt(0, 75)+"%",
    theBox.style.top = getRandomInt(0, 75)+"%",
    theBox.innerHTML = quote
  ];

  return arr
};

////////////////////////////////////////////////////////////////////////////
// Randomisator

function getRandomInt(min, max) {
  return Math.floor(Math.random() * Math.floor(max) + min);
};

////////////////////////////////////////////////////////////////////////////

// This will launch the whole shbang
window.onload = function() {
  // Forced to use synchronous fetch because JS is too stupid. 
  // Anyway, we're getting the quotes and convert them as an array.
  let result = [];
  const xhr = new XMLHttpRequest();
  xhr.open("GET", "./" + quotes + ".txt", false);
  xhr.send();
  if (xhr.status === 200) result = xhr.responseText.split(/\r?\n/);
  else window.alert("ERROR: The quotes file has not been found.\nDoes it exists? Is the name correctly spelled?\n\nRemember: '.txt' should not be included.");

  adquote(result[getRandomInt(0, result.length-1)]); // So it displays a quote right when it starts... stupid setInterval...
  setInterval(function(){
    adquote(result[getRandomInt(0, result.length-1)])
  }, secs*1000);
};