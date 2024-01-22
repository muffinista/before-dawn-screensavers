let
  // Put here the number of seconds you want for the quotes to change. 
  // Emulates the "Show Every" option of the original. Min was 10, max was 100.
  // Default is 10 seconds.
  secs = 10,

  // Put here the name of the txt file that contains the quotes without the txt extension.
  // Default is "saywhat", from saywhat.txt, the collection of the original screensaver's quotes.
  quotes = "saywhat",

  // Put here the style of desired borders for the quotes box.
  // Somewhat emulates the "Draw Border" option of the original.
  // There's less borders available than in the original but doing them would be either impossible or would require more heavy code.
  // Choices are: "none", "solid", "double", "random" and "fullrandom". 
  // "none" disables borders. "random" randomizes between solid and double.
  // "fullrandom" is like random but includes none.
  // Default is "random"
  borderStyle = "random",

  // Put here the desired color of borders for the quotes box.
  // Can be any HTML color code like "#FF0000" or "red".
  // Put "original" to cycle the same colors cycle as in the original.
  // Put "random" to randomize colors. Expect sometimes ugly colors with this one.
  // Default is "original"
  borderColor = "original",

  // Put here the webfont you want to use. 
  // Emulates the font changing in "Edit Quotes..." in the original.
  // Default is "serif"
  fontStyle = "serif",

  // Put here the wanted font size.
  // Emulates the font changing in "Edit Quotes..." in the original.
  // Default is "1.5em"
  fontSize = "1.5em";

////////////////////////////////////////////////////////////////////////////
// STUFF FOR BEFORE DAWN (ignore this part)

// Fetches the parameters in the query url.
var tmpParams = new URLSearchParams(document.location.search);
window.urlParams = {};

for(let k of tmpParams.keys() ) {
  window.urlParams[k] = tmpParams.get(k);
}

// If the parameters 'exists' (which is normally the case in beforedawn),
// it replaces the variables previously set by the ones set in beforedawn.
if (window.urlParams['quotes'] != null ) quotes = window.urlParams['quotes'];
if (window.urlParams['secs'] != null ) secs = window.urlParams['secs'];
if (window.urlParams['borderStyle'] != null ) borderStyle = window.urlParams['borderStyle'];
if (window.urlParams['borderColor'] != null ) borderColor = window.urlParams['borderColor'];
if (window.urlParams['fontStyle'] != null ) fontStyle = window.urlParams['fontStyle'];
if (window.urlParams['fontSize'] != null ) fontSize = window.urlParams['fontSize']+"em";