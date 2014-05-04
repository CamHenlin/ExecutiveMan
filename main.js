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
						{id: "flood", src: "images/flood.png"},
						{id: "enemyshot", src: "images/enemyshot.png"},
						{id: "bossframe", src: "images/bossframe.png"},
						{id: "wastemanframe", src: "images/wastemanframe.png"},
						{id: "filingcabinet", src: "images/filingcabinet.png"},
						{id: "executivemantopper", src: "images/executivemantopper.png"},
						{id: "copter", src: "images/copter.png"}]);

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

var lives = 2;
var gamezoom = 2;
var stage;
var altstage;
var gamestage;
var watchedElements;
var player;
var mapper;
var showOffBossScreenCounter = 0;
var tileCollisionDetector;
var startgame;
var startlevel = false;
var bossscreenCounter = 0;
var mobile = true;
var fpsLabel;
var scoreLabel;
var logFPS = false;
var buttonSpriteSheet;
var skipCounter = 0;
var lowFramerate = 1; // 2 for 30FPS!
var skipFrames = 1;
var menuUp = false;
var score = 0;

var bossframes = [];

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

function beginGame(newGame) {
	if (newGame) {
		lives = 2;
	}
	var explosionSpriteSheet = new createjs.SpriteSheet({
			"images": [loader.getResult("explosion")],
			"frames": {
				"width": 25, "height": 25, "count": 4
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

	if (window.innerWidth > 1500) {
		gamezoom = 3;
		gamestage.canvas.width = window.innerWidth / 3;
		gamestage.canvas.height = window.innerHeight / 3;
		document.getElementById("gamecanvas").style.zoom = 3;
		document.getElementById("gamecanvas").style.MozTransform = "scale(3)";
	} else {
		gamestage.canvas.width = window.innerWidth / 2;
		gamestage.canvas.height = window.innerHeight / 2;
	}
	gamestage.canvas.style.backgroundColor = "#000";

	watchedElements = [];
	mapper = new Mapper(gamestage);

    player = new Player();
	mapper.initMap();
	watchedElements.push(player);

	tileCollisionDetector = new TileCollisionDetector();

	watchedElements.push(mapper);



	if (mobile) {

		buttonSpriteSheet = new createjs.SpriteSheet({
			"images": [loader.getResult("buttons")],
			"frames": {
				"width": 64, "height": 64, "count": 4
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

		leftButtonSprite.x = 16;
		rightButtonSprite.x = 96;
		shootButtonSprite.x = gamestage.canvas.width - 64;
		leftButtonSprite.y = gamestage.canvas.height - 64;
		rightButtonSprite.y = gamestage.canvas.height - 64;
		shootButtonSprite.y = gamestage.canvas.height - 64;
		initTouchControls();
	}

	if (logFPS) {
		fpsLabel = new createjs.Text("", "bold 14px Arial", "#FFF");
		gamestage.addChild(fpsLabel);

		fpsLabel.x = gamestage.canvas.width - 250;
		fpsLabel.y = 18;
	}

	scoreLabel = new createjs.Text("SCORE: ", "bold 10px Arial", "#FFF");
	gamestage.addChild(scoreLabel);

	scoreLabel.x = gamestage.canvas.width - 96;
	scoreLabel.y = 18;

	createjs.Ticker.addEventListener("tick", handleTick);
	createjs.Ticker.useRAF = true;
	if (getParameterByName('lowfps')) {
		createjs.Ticker.setFPS(30); // NORMALLY 60
		lowFramerate = 2;
	} else {
		createjs.Ticker.setFPS(60); // NORMALLY 60
	}

	if (getParameterByName('skipframes')) {
		skipFrames = parseInt(getParameterByName('skipframes'));
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
			"width": 316, "height": 240, "count": 2
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

	if (window.innerWidth > 1500) {
		gamezoom = 3;
		gamestage.canvas.width = window.innerWidth / 3;
		gamestage.canvas.height = window.innerHeight / 3;
		document.getElementById("gamecanvas").style.zoom = 3;
		document.getElementById("gamecanvas").style.MozTransform = "scale(3)";
	} else {
		gamestage.canvas.width = window.innerWidth / 2;
		gamestage.canvas.height = window.innerHeight / 2;
	}
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
				document.getElementById("gamecanvas").removeEventListener("touchend", startScreenListener);
				break;
		}
	}.bind(this);

	document.getElementById("gamecanvas").addEventListener('touchend', startScreenListener.bind(this), false);

	stage.addChild(titleSreenSprite);
}

function startScreenListener() {
	startgame = true;
	document.getElementById("gamecanvas").removeEventListener("touchend", startScreenListener);
}

function handleStartScreenTick(event) {
	if (startgame) {
		initVars();
		initBossScreen();
		event.remove();
	}
	gamestage.update();
}

function initShowOffBossScreen(bossnumber) {

	var wastemanFrameSpriteSheet = new createjs.SpriteSheet({
		"images": [loader.getResult("wastemanframe")],
		"frames": {
			"width": 24, "height": 24, "count": 2
		},
		"animations": {
			"frame": {
				"frames" : [0],
				"next" : "breathout",
				"speed" : 0.01
			},
			"breathout" : {
				"frames" : [1],
				"next" : "frame",
				"speed" : 0.09
			},
			"still": {
				"frames" : [0],
				"next" : "still"
			}
		}
	});
	var wastemanFrame = new createjs.Sprite(wastemanFrameSpriteSheet, "still");
	showOffBossScreenCounter = 270;
	startgame = false;
	stage = new createjs.Container();
	altstage = new createjs.Container();
	gamestage = new createjs.Stage("gamecanvas");
	gamestage.snapToPixelEnabled = true;
	var bossLabel = new createjs.Text("WASTE MAN", "bold 10px Arial", "#FFF");

	if (window.innerWidth > 1500) {
		gamezoom = 3;
		gamestage.canvas.width = window.innerWidth / 3;
		gamestage.canvas.height = window.innerHeight / 3;
		document.getElementById("gamecanvas").style.zoom = 3;
		document.getElementById("gamecanvas").style.MozTransform = "scale(3)";
	} else {
		gamestage.canvas.width = window.innerWidth / 2;
		gamestage.canvas.height = window.innerHeight / 2;
	}
	gamestage.canvas.style.backgroundColor = "#FFF";
	gamestage.addChild(altstage);
	gamestage.addChild(stage);

	wastemanFrame.x = gamestage.canvas.width / 2 - wastemanFrame.spriteSheet._frameWidth / 2;
	wastemanFrame.y = gamestage.canvas.height / 2 - wastemanFrame.spriteSheet._frameHeight / 2;
	var wastemanFrame2 = wastemanFrame.clone(true);

	stage.y = -gamestage.canvas.height;
	altstage.y = gamestage.canvas.height;

	createjs.Ticker.addEventListener("tick", handleShowOffBossScreenTick);
	createjs.Ticker.setFPS(60);


    var shape = new createjs.Shape();
    shape.graphics.beginFill("#000").drawRect(0, 0, gamestage.canvas.width, gamestage.canvas.height);
	altstage.addChild(shape);

	stage.addChild(wastemanFrame);
	altstage.addChild(wastemanFrame2);
}

var bossShowOffScreenShape;
var bossShowOffScreenShape2;
function handleShowOffBossScreenTick(event) {
	if (showOffBossScreenCounter < 0) {
		initVars();
		startlevel = true;
		event.remove();
		return;
	} else if (showOffBossScreenCounter > 210) {
		stage.y += gamestage.canvas.height / 60;
		altstage.y -= gamestage.canvas.height / 60;
	} else if (showOffBossScreenCounter === 150) {
		var wastemanLabel = new createjs.Text("WASTE MAN", "bold 10px Arial", "#FFF");
		wastemanLabel.y = gamestage.canvas.height / 2 + 20;
		wastemanLabel.x = gamestage.canvas.width / 2 - 30;
		gamestage.addChild(wastemanLabel);
	} else if (showOffBossScreenCounter === 130) {
		var wastemanFrameSpriteSheet = new createjs.SpriteSheet({
			"images": [loader.getResult("wastemanframe")],
			"frames": {
				"width": 24, "height": 24, "count": 2
			},
			"animations": {
				"frame": {
					"frames" : [0],
					"next" : "breathout",
					"speed" : 0.01
				},
				"breathout" : {
					"frames" : [1],
					"next" : "frame",
					"speed" : 0.09
				},
				"still": {
					"frames" : [0],
					"next" : "still"
				}
			}
		});
		var wastemanFrame = new createjs.Sprite(wastemanFrameSpriteSheet, "still");

		wastemanFrame.x = gamestage.canvas.width / 2 - wastemanFrame.spriteSheet._frameWidth / 2;
		wastemanFrame.y = gamestage.canvas.height / 2 - wastemanFrame.spriteSheet._frameHeight / 2;
	    bossShowOffScreenShape = new createjs.Shape();
	    bossShowOffScreenShape.graphics.beginFill("#0000FF").drawRect(0, gamestage.canvas.height / 2 - 50, gamestage.canvas.width, 100);
	    bossShowOffScreenShape.x = -gamestage.canvas.width;
	    bossShowOffScreenShape.y = gamestage.canvas.height / 200 - 100;
	    stage.addChild(bossShowOffScreenShape);
		stage.addChild(wastemanFrame);
	} else if (showOffBossScreenCounter > 110 && showOffBossScreenCounter < 130) {
		bossShowOffScreenShape.x += gamestage.canvas._frameWidth / 20;
	} else if (showOffBossScreenCounter === 110) {

	    bossShowOffScreenShape2 = new createjs.Shape();
	    bossShowOffScreenShape2.graphics.beginFill("#FFF").drawRect(0, 0, gamestage.canvas.width, gamestage.canvas.height);
	    bossShowOffScreenShape2.x = 0;
	    altstage.addChild(bossShowOffScreenShape2);
	} else if (showOffBossScreenCounter === 105) {
	    altstage.removeChild(bossShowOffScreenShape2);
	    bossShowOffScreenShape = new createjs.Shape();
	    bossShowOffScreenShape.graphics.beginFill("#000").drawRect(0, 0, gamestage.canvas.width, gamestage.canvas.height);
	    bossShowOffScreenShape.x = 0;
	    altstage.addChild(bossShowOffScreenShape);
	} else if (showOffBossScreenCounter === 100) {

	    bossShowOffScreenShape2 = new createjs.Shape();
	    bossShowOffScreenShape2.graphics.beginFill("#FFF").drawRect(0, 0, gamestage.canvas.width, gamestage.canvas.height);
	    bossShowOffScreenShape2.x = 0;
	    altstage.addChild(bossShowOffScreenShape2);
	} else if (showOffBossScreenCounter === 95) {
	    altstage.removeChild(bossShowOffScreenShape2);
	    bossShowOffScreenShape = new createjs.Shape();
	    bossShowOffScreenShape.graphics.beginFill("#000").drawRect(0, 0, gamestage.canvas.width, gamestage.canvas.height);
	    bossShowOffScreenShape.x = 0;
	    altstage.addChild(bossShowOffScreenShape);
	}
	showOffBossScreenCounter--;
	gamestage.update();
}


function initBossScreen() {
	var bossframeSpriteSheet = new createjs.SpriteSheet({
		"images": [loader.getResult("bossframe")],
		"frames": {
			"width": 45, "height": 45, "count": 1
		},
		"animations": {
			"frame": {
				"frames" : [0],
				"next" : "frame"
			}
		}
	});

	var executivemanTopperSpriteSheet = new createjs.SpriteSheet({
		"images": [loader.getResult("executivemantopper")],
		"frames": {
			"width": 160, "height": 45, "count": 1
		},
		"animations": {
			"frame": {
				"frames" : [0],
				"next" : "frame"
			}
		}
	});
	var executivemanTopper = new createjs.Sprite(executivemanTopperSpriteSheet, "frame");

	var wastemanFrameSpriteSheet = new createjs.SpriteSheet({
		"images": [loader.getResult("wastemanframe")],
		"frames": {
			"width": 24, "height": 24, "count": 2
		},
		"animations": {
			"frame": {
				"frames" : [0],
				"next" : "breathout",
				"speed" : 0.01
			},
			"breathout" : {
				"frames" : [1],
				"next" : "frame",
				"speed" : 0.09
			}
		}
	});
	var wastemanFrame = new createjs.Sprite(wastemanFrameSpriteSheet, "frame");
	var wastemanLabel = new createjs.Text("WASTE MAN", "bold 7px Arial", "#FFF");

	bossframes = [];
	for (var i = 0; i < 9; i++) {
		bossframes.push(new createjs.Sprite(bossframeSpriteSheet, "frame"));
	}

	bossscreenCounter = 60;
	stage = new createjs.Container();
	altstage = new createjs.Container();
	gamestage = new createjs.Stage("gamecanvas");
	gamestage.snapToPixelEnabled = true;
	if (window.innerWidth > 1500) {
		gamezoom = 3;
		gamestage.canvas.width = window.innerWidth / 3;
		gamestage.canvas.height = window.innerHeight / 3;
		document.getElementById("gamecanvas").style.zoom = 3;
		document.getElementById("gamecanvas").style.MozTransform = "scale(3)";
	} else {
		gamestage.canvas.width = window.innerWidth / 2;
		gamestage.canvas.height = window.innerHeight / 2;
	}
	gamestage.canvas.style.backgroundColor = "#000";
	gamestage.addChild(altstage);
	gamestage.addChild(stage);
	stage.x = -gamestage.canvas.width;
	altstage.x = gamestage.canvas.width;
    var fillColor = new createjs.Shape();
    fillColor.graphics.beginFill("#0000FF").drawRect(0, 0, gamestage.canvas.width, gamestage.canvas.height);
    altstage.addChild(fillColor);

	var width = bossframes[0].spriteSheet._frameWidth;
	var framewidth = bossframes[0].spriteSheet._frameWidth;
	var centerx = gamestage.canvas.width / 2 - bossframes[0].spriteSheet._frameWidth / 2;
	var centery = gamestage.canvas.height / 2 - bossframes[0].spriteSheet._frameWidth / 2;
	for (i = 0; i < 9; i++) {
		if (i === 0) {
			wastemanFrame.x = centerx - 4/3 * width  + (framewidth + framewidth / 2) * (i % 3) + wastemanFrame.spriteSheet._frameWidth /2 -2;
			wastemanFrame.y = centery - width + (framewidth + framewidth / 2) * Math.floor(i / 3) - width / 2 + wastemanFrame.spriteSheet._frameWidth/2 -2;
			wastemanLabel.x = centerx - 4/3 * width  + (framewidth + framewidth / 2) * (i % 3);
			wastemanLabel.y = centery - width + (framewidth + framewidth / 2) * Math.floor(i / 3) - width / 2 + framewidth + 5;
		}
		if (i === 4) {

		}
		bossframes[i].x = centerx - 4/3 * width  + (framewidth + framewidth / 2) * (i % 3);
		bossframes[i].y = centery - width + (framewidth + framewidth / 2) * Math.floor(i / 3) - width / 2;
	}
	executivemanTopper.x = centerx - executivemanTopper.spriteSheet._frameWidth / 2 + width / 2 + 7;
	executivemanTopper.y = centery - width * 2 - width / 2;
	startlevel = false;







	createjs.Ticker.addEventListener("tick", handleBossScreenTick);
	createjs.Ticker.setFPS(60);


	document.getElementById("gamecanvas").addEventListener('touchstart', bossClickHandler, false);
	document.getElementById("gamecanvas").addEventListener('click', bossClickHandler, false);

	stage.addChild(executivemanTopper);
	for (i = 0; i < bossframes.length; i++) {
		stage.addChild(bossframes[i]);
	}

	stage.addChild(wastemanFrame);
	stage.addChild(wastemanLabel);


}

function bossClickHandler(event) {
	var touchEventSpriteSheet = new createjs.SpriteSheet({
        "images": ["images/businessmanspritesheet.png"],
        "frames": {
            "width": 1, "height": 1, "count": 1
        },
        "animations": {
            "exist": {
                "frames" : [0],
                "next" : "exist"
            }
        }
    });
    var touchSprite = new createjs.Sprite(touchEventSpriteSheet, "exist");

    event.preventDefault();

    if (event.type === "touch") {
	    for (var i = 0; i < event.touches.length; i++) {
	        var touch = event.touches[i];
	        touchSprite.x = touch.pageX / gamezoom;
	        touchSprite.y = touch.pageY / gamezoom;
	        for (var j = 0; j < 9; j++) {
	            if (fastCollisionSprite(bossframes[j], touchSprite)) {
	               	initVars();
	               	initShowOffBossScreen();
	               	document.getElementById("gamecanvas").removeEventListener('touchstart', bossClickHandler);
					document.getElementById("gamecanvas").removeEventListener('click', bossClickHandler);
	            }
	        }
	    }
	} else {
	        touchSprite.x = event.clientX / gamezoom;
	        touchSprite.y = event.clientY / gamezoom;
	        for (var k = 0; k < 9; k++) {
	            if (fastCollisionSprite(bossframes[k], touchSprite)) {
	               	initVars();
	               	initShowOffBossScreen();
	               	document.getElementById("gamecanvas").removeEventListener('touchstart', bossClickHandler, false);
					document.getElementById("gamecanvas").removeEventListener('click', bossClickHandler, false);
	            }
	        }
	}

}

function handleBossScreenTick(event) {
	if (bossscreenCounter > 0) {
		stage.x += gamestage.canvas.width / 60;
		altstage.x -= gamestage.canvas.width / 60;
		bossscreenCounter--;
	}
	if (startlevel) {
		initVars();
		beginGame(true);
		event.remove();
	}
	gamestage.update();
}

function handleTick(event) {
	if (!mapper.doneRendering) {
		return;
	} else if (mapper.transitiondown || mapper.transitionright) {

		mapper.tickActions({});
		gamestage.update();
		return;
	}

	if (mapper.showingReadyLabel) {
		gamestage.update();
		return;
	}

	if (menuUp) {
		return;
	}

	var actions = {};

	actions.mobile = mobile;
	if (mobile) {

	}


	var modifier = 4;
	var xmodifier = 6;
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



	watchedElements.forEach(function(element) {
		element.tickActions(actions);
	});

	this.mapper.enemies.forEach(function(element) {
		element.tickActions(actions);
	});

	//  { leftmove : true, downmove : true, rightmove : true, upmove : true, nextmap : false }
	if (((!actions.deathCollisionResults.leftmove || !actions.deathCollisionResults.leftmove || !actions.deathCollisionResults.upmove || !actions.deathCollisionResults.downmove) && !actions.deathCollisionResults.nextmap) || player.health <= 0) {
		actions.playerDeath = true;
		lives--;

		if (lives < 0) {
			setTimeout(function() {
				initVars();
				initBossScreen();
			}.bind(this), 2000);

			event.remove();
		} else {
			setTimeout(function() {
				initVars();
				beginGame(false);
			}.bind(this), 2000);

			event.remove();
		}
		//init();
	}

	if (logFPS) {
		fpsLabel.text = Math.round(createjs.Ticker.getMeasuredFPS()) + " / " + Math.round(createjs.Ticker.getFPS());
	}
	scoreLabel.text = "SCORE: " + score;

	if (skipFrames === 1) {
		gamestage.update();
	} else if (skipCounter === skipFrames) {
		skipCounter = 0;
		gamestage.update();
	}

	skipCounter++;
}