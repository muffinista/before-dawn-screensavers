var
  // Put here the number of miliseconds you want for the quotes to change. 
  // Emulates the "Show Every" option of the original.
  // By default, it's 10 seconds, so it's 10000.
  secs = 10000,

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

