var loader = new createjs.LoadQueue(false);
loader.addEventListener("complete", handleComplete);
// preload.addEventListener("progress", handleProgress);

loader.loadManifest([	{id: "logo", src: "images/executivemanlogo.png"},
						{id: "map1", src: "images/map1.png"},
						{id: "buttons", src: "images/buttons.png"},
						{id: "businessman", src: "images/businessmanspritesheet.png"},
						{id: "printerguy", src: "images/printerguy.png"},
						{id: "shieldguy", src: "images/shieldguy.png"},
						{id: "shot", src: "images/shot.png"},
						{id: "health", src: "images/healthbar.png"},
						{id: "explosion", src: "images/explosion.png"},
						{id: "enemyshot", src: "images/enemyshot.png"}]);

function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

function handleComplete() {
	/*backgroundImage = preload.getResult("background");
	treesImage = preload.getResult("trees");
	groundImage = preload.getResult("ground");

	loadProgressLabel.text = "Loading complete click to start";
	stage.update();

	canvas.addEventListener("click", handleClick);*/
	setTimeout(function() {
		init();
	}, 100);
}

var stage;
var gamestage;
var watchedElements;
var player;
var mapper;
var tileCollisionDetector;
var startgame;
var mobile = true;
var fpsLabel;
var logFPS = true;
var buttonSpriteSheet;
var odd = false;
var skipFrames = false;
var lowFramerate = 1; // 2 for 30FPS!
var skipFrames = 1;
var player;


var explosionSprite;

var leftButtonSprite;
var rightButtonSprite;
var shootButtonSprite;


var titleSreenSprite;

function init() {
	initVars();
	initTitleScreen();
}

function initVars() {
	stage = null;
	gamestage = null;
	watchedElements = null;
	player = null;
	mapper = null;
	tileCollisionDetector = null;
}

function beginGame() {
	var explosionSpriteSheet = new createjs.SpriteSheet({
			"images": [loader.getResult("explosion")],
			"frames": {
				"width": 50, "height": 50, "count": 4
			},
			"animations": {
				"explode": {
					"frames" : [0, 1, 2, 3],
					"speed" : 0.125,
					"next" : "nothing"
				},
				"nothing": {
					"frames" : [4],
					"speed" : 0.125,
					"next" : "nothing"
				}
			}
		});

	explosionSprite = new createjs.Sprite(explosionSpriteSheet, "explode");
	gamestage = new createjs.Stage("gamecanvas");
	gamestage.clear();
	gamestage.snapToPixelEnabled = true;

	gamestage.canvas.width = window.innerWidth;
	gamestage.canvas.height = window.innerHeight;
	gamestage.canvas.style.backgroundColor = "#000";

	watchedElements = [];
	mapper = new Mapper(gamestage, loader);
	
    player = new Player();
	mapper.initMap();
	watchedElements.push(player);

	tileCollisionDetector = new TileCollisionDetector();

	watchedElements.push(mapper);



	if (mobile) {

		buttonSpriteSheet = new createjs.SpriteSheet({
			"images": [loader.getResult("buttons")],
			"frames": {
				"width": 128, "height": 128, "count": 4
			},
			"animations": {
				"left": {
					"frames" : [0],
					"next" : "left"
				},
				"right" : {
					"frames" : [1],
					"next" : "right"
				},
				"shoot" : {
					"frames" : [2],
					"next" : "shoot"
				}
			}
		});
		leftButtonSprite = new createjs.Sprite(buttonSpriteSheet, "left");
		rightButtonSprite = new createjs.Sprite(buttonSpriteSheet, "right");
		shootButtonSprite = new createjs.Sprite(buttonSpriteSheet, "shoot");

		leftButtonSprite.x = 32;
		rightButtonSprite.x = 176;
		shootButtonSprite.x = gamestage.canvas.width - 128;
		leftButtonSprite.y = gamestage.canvas.height - 128;
		rightButtonSprite.y = gamestage.canvas.height - 128;
		shootButtonSprite.y = gamestage.canvas.height - 128;
		initTouchControls();
	}

	if (logFPS) {
		fpsLabel = new createjs.Text("", "bold 14px Arial", "#FFF");
		gamestage.addChild(fpsLabel);

		fpsLabel.x = gamestage.canvas.width - 250;
		fpsLabel.y = 18;
	}

	createjs.Ticker.addEventListener("tick", handleTick);
	createjs.Ticker.useRAF = true;
	if (getParameterByName('lowfps')) {
		createjs.Ticker.setFPS(30); // NORMALLY 60
		lowFramerate = 2;
	} else {
		createjs.Ticker.setFPS(60); // NORMALLY 60
	}

	if (getParameterByName('skipframes')) {
		skipFrames = true;
		skipFrames = 2;
	}
}

function initTouchControls() {
	gamestage.removeChild(leftButtonSprite);
	gamestage.removeChild(rightButtonSprite);
	gamestage.removeChild(shootButtonSprite);
	gamestage.addChild(leftButtonSprite);
	gamestage.addChild(rightButtonSprite);
	gamestage.addChild(shootButtonSprite);
}

function initTitleScreen() {
	var titlescreenSpriteSheet = new createjs.SpriteSheet({
		"images": [loader.getResult("logo")],
		"frames": {
			"width": 632, "height": 480, "count": 2
		},
		"animations": {
			"sit": {
				"frames" : [0],
				"next" : "shoot",
				"speed" : 0.15
			},
			"shoot" : {
				"frames" : [1],
				"next" : "sit",
				"speed" : 0.075
			}
		}
	});

	titleSreenSprite = new createjs.Sprite(titlescreenSpriteSheet, "shoot");
	startgame = false;
	stage = new createjs.Container();
	gamestage = new createjs.Stage("gamecanvas");
	gamestage.snapToPixelEnabled = true;

	gamestage.canvas.width = window.innerWidth;
	gamestage.canvas.height = window.innerHeight;
	gamestage.canvas.style.backgroundColor = "#000";
	gamestage.addChild(stage);

	titleSreenSprite.x = gamestage.canvas.width / 2 - titleSreenSprite.spriteSheet._frameWidth / 2;
	titleSreenSprite.y = gamestage.canvas.height / 2 - titleSreenSprite.spriteSheet._frameHeight / 2;

	createjs.Ticker.addEventListener("tick", handleStartScreenTick);
	createjs.Ticker.setFPS(10);

	document.onkeydown = function (event) {
		switch (event.keyCode) {
			case 32:
				// keyCode 32 is space
				startgame = true;
				break;
		}
	}.bind(this);

	document.getElementById("gamecanvas").addEventListener('touchend', function () {
		startgame = true;
	}.bind(this), false);

	stage.addChild(titleSreenSprite);
}

function handleStartScreenTick(event) {
	if (startgame) {
		initVars();
		beginGame();
		event.remove();
	}
	gamestage.update();
}

function handleTick(event) {
	if (!mapper.doneRendering) {
		return;
	} else if (mapper.transitiondown) {

		mapper.tickActions(actions);
		gamestage.update();
		return;
	}

	var actions = {};

	actions.mobile = mobile;
	if (mobile) {

	}


	var modifier = 8;
	var xmodifier = 12;
	var playerCollisionPoints = {
		leftTop : { x: player.x + xmodifier, y: player.y + modifier },
		leftBottom : { x: player.x + xmodifier, y: player.y + player.animations.spriteSheet._frameHeight - modifier },
		bottomLeft : { x: player.x + xmodifier + 4 , y: player.y + player.animations.spriteSheet._frameHeight  },
		bottomRight : { x: player.x + player.animations.spriteSheet._frameWidth - xmodifier - 4, y: player.y + player.animations.spriteSheet._frameHeight },
		rightBottom : { x: player.x + player.animations.spriteSheet._frameWidth - xmodifier, y: player.y + player.animations.spriteSheet._frameHeight - modifier },
		rightTop : { x: player.x + player.animations.spriteSheet._frameWidth - xmodifier, y: player.y + modifier },
		topRight : { x: player.x + player.animations.spriteSheet._frameWidth - xmodifier - 4, y: player.y + modifier },
		topLeft : { x: player.x + xmodifier + 4, y: player.y + modifier }
	};
	var playerDeathCollisionPoints = {
		leftTop : { x: player.x + xmodifier * 2, y: player.y + modifier * 2 },
		leftBottom : { x: player.x + xmodifier * 2, y: player.y + player.animations.spriteSheet._frameHeight - modifier * 2 },
		bottomLeft : { x: player.x + xmodifier * 2 + 4 , y: player.y + player.animations.spriteSheet._frameHeight -5  },
		bottomRight : { x: player.x + player.animations.spriteSheet._frameWidth - xmodifier * 2 - 4, y: player.y + player.animations.spriteSheet._frameHeight -5 },
		rightBottom : { x: player.x + player.animations.spriteSheet._frameWidth - xmodifier * 2, y: player.y + player.animations.spriteSheet._frameHeight - modifier * 2 },
		rightTop : { x: player.x + player.animations.spriteSheet._frameWidth - xmodifier * 2, y: player.y + modifier * 2 },
		topRight : { x: player.x + player.animations.spriteSheet._frameWidth - xmodifier * 2 - 4, y: player.y + modifier * 2 },
		topLeft : { x: player.x + xmodifier * 2 + 4, y: player.y + modifier * 2 }
	};

	actions.collisionResults = tileCollisionDetector.checkCollisions(playerCollisionPoints, mapper.collisionArray, mapper.getCurrentHeightOffset(), (mapper.widthOffset + mapper.completedMapsWidthOffset));
	actions.deathCollisionResults = tileCollisionDetector.checkCollisions(playerDeathCollisionPoints, mapper.deathCollisionArray, mapper.getCurrentHeightOffset(), (mapper.widthOffset + mapper.completedMapsWidthOffset));



	if (!mapper.advancing && !mapper.reversing) {
		watchedElements.forEach(function(element) {
			element.tickActions(actions);
		});

		this.mapper.enemies.forEach(function(element) {
			element.tickActions(actions);
		});
	} else {
		mapper.tickActions(actions);
	}

	//  { leftmove : true, downmove : true, rightmove : true, upmove : true, nextmap : false }
	if (((!actions.deathCollisionResults.leftmove || !actions.deathCollisionResults.leftmove || !actions.deathCollisionResults.upmove || !actions.deathCollisionResults.downmove) && !actions.deathCollisionResults.nextmap) || player.health <= 0) {
		actions.playerDeath = true;
		setTimeout(function() {
			init();
		}.bind(this, event), 2000);

		event.remove();
		//init();
	}

	if (logFPS) {
		fpsLabel.text = Math.round(createjs.Ticker.getMeasuredFPS()) + " / " + Math.round(createjs.Ticker.getFPS());
	}

	if (odd && skipFrames) {
		gamestage.update();
		odd = false;
	} else if (!skipFrames) {
		gamestage.update();
	} else {
		odd = true;
	}
}