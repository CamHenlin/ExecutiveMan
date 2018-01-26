// alternate stage, used for various sliding animations in menus. NOT used in main game
var altstage;

// list of boss frames used on the boss selection screen
var bossframes = [];

// currently set boss number, used to determine which map should be loaded
var bossnumber = 0;

// used to count animations on the boss screen
var bossscreenCounter = 0;

// set to true of the boss selection screen is up
var bossScreenUp = false;

// holds sprite sheets for buttons for mobile controls
var buttonSpriteSheet;

// used to block future click events in optionsmenu.js
var clicked = false;

// used in game to determine if the player should deal more than 1x damage
var damageModifier = 1;

// set when the player has been killed
var dead = true;

// set when introduction is done playing
var demoEnded = false;

// stage used to display dialog boxes
var dialogstage;

// wether or not the player can jump twice
var doubleJump = false;

// initial onscreen loading text before game logo
var executivemanLoadingText = new createjs.Text("Executive Man loading...", "14px '" + FONT + "'", "#FFF");

// container for generic explosion
var explosionSprite;

// optional FPS label
var fpsLabel;

// main game stage
var gamestage;

// default zoom amount
var gamezoom = 2;

// like E tanks in megaman
var healthBriefCases = 0;

// >1 means the player has more than the default health
var healthModifier = 1;

// disables all player controls in game engine, used for demo mode
var isDemo = false;

// internal variable used for megaman-like pseudo-random numbers so that game is not actually random
var itemDropCount = 0;

// holds the left button
var leftButtonSprite;

// default life count
var lives = 2;

// placeholder for createjs loader
var loader;

// initial load progress
var loadProgress = 0;

// set to true to display FPS on screen
var logFPS = false;

// set to true when the main menu is up
var mainMenuScreenUp = false;

// set to true when the menu is up
var menuUp = false;

// set to true if a mobile devices is detected, causes onscreen controls to display
var mobile = false;

// setting to true disables music
var musicOff = false;

// stage for options
var optionsstage;

// set to true when options is up
var optionsUp = false;

// holds the pause button
var pauseButtonSprite;

// stage for when the pause button has been pressed
var pausestage;

// true when pause has been pressed
var pauseUp = false;

// the player variable, see player.js
var player;

// used to display progress bar
var progress;

// the renderer variable, see renderer.js
var renderer;

// holds the right button sprite
var rightButtonSprite;

// the starting score
var score = 0;

// score display label
var scoreLabel;

// if >1 then the score will grow at a faster-than-normal rate
var scoreModifier = 1;

//
var selectionNumber = 0;

// holds the shoot button
var shootButtonSprite;

// set to true when the shop is up
var shopUp = false;

// holds the small explosion for when a shot hits something
var shotExplosionSprite;

// counter for when the boss show off screen is up
var showOffBossScreenCounter = 0;

// used to determine how many frames should be skipped, 1 = 0 frames skipped, 2 = 50% skipped
var skipFrames = 1;

// set to true turns off all sounds
var soundOff = false;

// general stage
var stage;

// set to true when the start boss screen is up
var startbossscreen = false;

// setting to true causes the game to start
var startgame;

//
var startlevel = false;

// used for holding an instantiation of the tile collision detector
var tileCollisionDetector;

// holds title screen sprite
var titleScreenSprite;

// holds the general list of watchedElements, filled by the renderer
var watchedElements;

// the default zoom amount
var zoomAmount;