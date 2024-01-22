# Say No More CSS/JS screensaver
This is the remake of the After Dark screensaver "Say What?" by Jim Miars, an old screensaver I used to love when I was young. It displays quotes randomly on the screen. You can actually use it with [Before Dawn](https://github.com/muffinista/before-dawn)!

Of course, like the original, quotes and time between quotes can be changed. Some additionnal parameters have been added like the choice of borders styles and colors. It's made by default to behave like the original but you can change more things than before.

You can check out a sample of it below:
- [Original](https://jmfergeau.gitlab.io/adquotes/): The original quotes from the *Say What?* screensaver from AfterDark.
- [Say More](http://127.0.0.1:5500/index.html?quotes=saymore): Some additionnal random quotes I found myself for testing purposes.
- [Star Wars](http://127.0.0.1:5500/index.html?quotes=starwars): Quotes from the *Star Wars* franchise.
- [My Little Pony](http://127.0.0.1:5500/index.html?quotes=mylittlepony): Quotes from the *My Little Pony: Friendship is Magic* franchise.

## Using it with Before Dawn
This screensaver is already bundled in Before Dawn! Just select "Say No More" in the program's window.

## Using it as standalone web page
To change the options, open the file `options.js` and follow the instructions.

## Create your own quotes collection
It's now relatively easier than before to add your own quotes. Here's how:
1. Create a new txt file in the screensaver's folder.
2. Add your quotes, separating them with a line break
3. You can stylize your quotes using html tags and codes. Check saywhat.txt to see how.
4. In the beforedawn settings, in the "quotes" field, put the name of your txt file without the `.txt` extension