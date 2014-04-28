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
						{id: "enemyshot", src: "images/enemyshot.png"}]);

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
	gamestage = new createjs.Stage("gamecanvas");
	gamestage.clear();
	gamestage.snapToPixelEnabled = true;

	gamestage.canvas.width = window.innerWidth;
	gamestage.canvas.height = window.innerHeight;
	gamestage.canvas.style.backgroundColor = "#000";

	watchedElements = [];
	mapper = new Mapper(gamestage, loader);
	mapper.initMap();
	watchedElements.push(mapper.player);

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

		gamestage.addChild(leftButtonSprite);
		gamestage.addChild(rightButtonSprite);
		gamestage.addChild(shootButtonSprite);	}

	if (logFPS) {
		fpsLabel = new createjs.Text("-- FPS", "bold 14px Arial", "#FFF");
		gamestage.addChild(fpsLabel);

		fpsLabel.x = gamestage.canvas.width - 200;
		fpsLabel.y = 18;
	}

	createjs.Ticker.addEventListener("tick", handleTick);
	createjs.Ticker.useRAF = true;
	createjs.Ticker.setFPS(30); // NORMALLY 60
}

function initTitleScreen() {
	var titlescreenSpriteSheet = new createjs.SpriteSheet({
		"images": [loader.getResult("logo")],
		"frames": {
			"width": 480, "height": 632, "count": 2
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
	gamestage = new createjs.Stage("gamecanvas");
	gamestage.snapToPixelEnabled = true;

	gamestage.canvas.width = window.innerWidth;
	gamestage.canvas.height = window.innerHeight;
	gamestage.canvas.style.backgroundColor = "#000";

	titleSreenSprite.x = gamestage.canvas.width / 2 - titleSreenSprite.spriteSheet._frameWidth / 2;
	titleSreenSprite.y = gamestage.canvas.height / 2 - titleSreenSprite.spriteSheet._frameHeight / 2;

	gamestage.addChild(titleSreenSprite);
	titleSreenSprite.gotoAndPlay("sit");

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
	}

	var actions = {};

	actions.mobile = mobile;
	if (mobile) {

	}


	var modifier = 8;
	var xmodifier = 12;
	var playerCollisionPoints = {
		leftTop : { x: mapper.player.x + xmodifier, y: mapper.player.y + modifier },
		leftBottom : { x: mapper.player.x + xmodifier, y: mapper.player.y + mapper.player.animations.spriteSheet._frameHeight - modifier },
		bottomLeft : { x: mapper.player.x + xmodifier + 4 , y: mapper.player.y + mapper.player.animations.spriteSheet._frameHeight  },
		bottomRight : { x: mapper.player.x + mapper.player.animations.spriteSheet._frameWidth - xmodifier - 4, y: mapper.player.y + mapper.player.animations.spriteSheet._frameHeight },
		rightBottom : { x: mapper.player.x + mapper.player.animations.spriteSheet._frameWidth - xmodifier, y: mapper.player.y + mapper.player.animations.spriteSheet._frameHeight - modifier },
		rightTop : { x: mapper.player.x + mapper.player.animations.spriteSheet._frameWidth - xmodifier, y: mapper.player.y + modifier },
		topRight : { x: mapper.player.x + mapper.player.animations.spriteSheet._frameWidth - xmodifier - 4, y: mapper.player.y + modifier },
		topLeft : { x: mapper.player.x + xmodifier + 4, y: mapper.player.y + modifier }
	};
	var playerDeathCollisionPoints = {
		leftTop : { x: mapper.player.x + xmodifier * 2, y: mapper.player.y + modifier * 2 },
		leftBottom : { x: mapper.player.x + xmodifier * 2, y: mapper.player.y + mapper.player.animations.spriteSheet._frameHeight - modifier * 2 },
		bottomLeft : { x: mapper.player.x + xmodifier * 2 + 4 , y: mapper.player.y + mapper.player.animations.spriteSheet._frameHeight -5  },
		bottomRight : { x: mapper.player.x + mapper.player.animations.spriteSheet._frameWidth - xmodifier * 2 - 4, y: mapper.player.y + mapper.player.animations.spriteSheet._frameHeight -5 },
		rightBottom : { x: mapper.player.x + mapper.player.animations.spriteSheet._frameWidth - xmodifier * 2, y: mapper.player.y + mapper.player.animations.spriteSheet._frameHeight - modifier * 2 },
		rightTop : { x: mapper.player.x + mapper.player.animations.spriteSheet._frameWidth - xmodifier * 2, y: mapper.player.y + modifier * 2 },
		topRight : { x: mapper.player.x + mapper.player.animations.spriteSheet._frameWidth - xmodifier * 2 - 4, y: mapper.player.y + modifier * 2 },
		topLeft : { x: mapper.player.x + xmodifier * 2 + 4, y: mapper.player.y + modifier * 2 }
	};

	actions.collisionResults = tileCollisionDetector.checkCollisions(playerCollisionPoints, mapper.collisionArray, mapper.getCurrentHeightOffset(), (mapper.widthOffset + mapper.completedMapsWidthOffset));
	actions.deathCollisionResults = tileCollisionDetector.checkCollisions(playerDeathCollisionPoints, mapper.deathCollisionArray, mapper.getCurrentHeightOffset(), mapper.widthOffset);



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
	if (((!actions.deathCollisionResults.leftmove || !actions.deathCollisionResults.leftmove || !actions.deathCollisionResults.upmove || !actions.deathCollisionResults.downmove) && !actions.deathCollisionResults.nextmap) || mapper.player.health <= 0) {
		actions.playerDeath = true;
		setTimeout(function() {
			init();
		}.bind(this, event), 2000);

		event.remove();
		//init();
	}

	if (logFPS) {
		fpsLabel.text = Math.round(createjs.Ticker.getMeasuredFPS()) + " FPS";
	}

	gamestage.update();
}