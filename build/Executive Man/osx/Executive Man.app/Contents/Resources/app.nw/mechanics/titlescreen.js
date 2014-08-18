function initTitleScreen() {
	playSoundLoop("intro");
	var oneSpriteSheet = new createjs.SpriteSheet({
		"images": [loader.getResult("slide_one")],
		"frames": {
			"width": 320, "height": 240, "count": 1
		},
		"animations": {
			"sit": {
				"frames" : [0],
				"next" : "sit"
			}
		}
	});

	titleSreenSprite = new createjs.Sprite(oneSpriteSheet, "shoot");
	startgame = false;
	stage = new createjs.Container();
	gamestage = new createjs.Stage("gamecanvas");
	gamestage.snapToPixelEnabled = true;
	var zoomAmount = window.innerHeight / 240;

	gamezoom = zoomAmount;
	gamestage.canvas.width = window.innerWidth / zoomAmount;
	gamestage.canvas.height = window.innerHeight / zoomAmount;
	document.getElementById("gamecanvas").style.zoom = zoomAmount;
	document.getElementById("gamecanvas").style.MozTransform = "scale("+zoomAmount+")";
	gamestage.canvas.style.backgroundColor = "#000";
	gamestage.addChild(stage);

	titleSreenSprite.x = gamestage.canvas.width / 2 - titleSreenSprite.spriteSheet._frameWidth / 2;
	titleSreenSprite.y = gamestage.canvas.height / 2 - titleSreenSprite.spriteSheet._frameHeight / 2;

	createjs.Ticker.addEventListener("tick", handleStartScreenTick);
	createjs.Ticker.setFPS(3);

	document.onkeydown = function (event) {
		switch (event.keyCode) {
			case 32:
				// keyCode 32 is space
				startgame = true;
				document.getElementById("gamecanvas").removeEventListener("click", startScreenListener);
				break;
		}
	}.bind(this);

	document.getElementById("gamecanvas").addEventListener('click', startScreenListener.bind(this), false);

	stage.addChild(titleSreenSprite);
}

function startScreenListener() {
	startgame = true;
	document.getElementById("gamecanvas").removeEventListener("click", startScreenListener);
}

var startscreenTickCounter = 10;
function handleStartScreenTick(event) {
	if (startscreenTickCounter > 0) {
		startscreenTickCounter--;
	}/*
	if (startscreenTickCounter === 100) {
		var twoSpriteSheet = new createjs.SpriteSheet({
			"images": [loader.getResult("slide_two")],
			"frames": {
				"width": 320, "height": 240, "count": 1
			},
			"animations": {
				"sit": {
					"frames" : [0],
					"next" : "sit"
				}
			}
		});

		var twoSprite = new createjs.Sprite(twoSpriteSheet, "sit");

		twoSprite.x = gamestage.canvas.width / 2 - twoSprite.spriteSheet._frameWidth / 2;
		twoSprite.y = gamestage.canvas.height / 2 - twoSprite.spriteSheet._frameHeight / 2;
		stage.addChild(twoSprite);
	} else if (startscreenTickCounter === 80) {
		var threeSpriteSheet = new createjs.SpriteSheet({
			"images": [loader.getResult("slide_three")],
			"frames": {
				"width": 320, "height": 240, "count": 1
			},
			"animations": {
				"sit": {
					"frames" : [0],
					"next" : "sit"
				}
			}
		});

		var threeSprite = new createjs.Sprite(threeSpriteSheet, "sit");

		threeSprite.x = gamestage.canvas.width / 2 - threeSprite.spriteSheet._frameWidth / 2;
		threeSprite.y = gamestage.canvas.height / 2 - threeSprite.spriteSheet._frameHeight / 2;
		stage.addChild(threeSprite);
	} else if (startscreenTickCounter === 60) {
		var fourSpriteSheet = new createjs.SpriteSheet({
			"images": [loader.getResult("slide_four")],
			"frames": {
				"width": 320, "height": 240, "count": 1
			},
			"animations": {
				"sit": {
					"frames" : [0],
					"next" : "sit"
				}
			}
		});

		var fourSprite = new createjs.Sprite(fourSpriteSheet, "sit");

		fourSprite.x = gamestage.canvas.width / 2 - fourSprite.spriteSheet._frameWidth / 2;
		fourSprite.y = gamestage.canvas.height / 2 - fourSprite.spriteSheet._frameHeight / 2;
		stage.addChild(fourSprite);
	} else if (startscreenTickCounter === 40) {
		var fiveSpriteSheet = new createjs.SpriteSheet({
			"images": [loader.getResult("slide_five")],
			"frames": {
				"width": 320, "height": 240, "count": 1
			},
			"animations": {
				"sit": {
					"frames" : [0],
					"next" : "sit"
				}
			}
		});

		var fiveSprite = new createjs.Sprite(fiveSpriteSheet, "sit");

		fiveSprite.x = gamestage.canvas.width / 2 - fiveSprite.spriteSheet._frameWidth / 2;
		fiveSprite.y = gamestage.canvas.height / 2 - fiveSprite.spriteSheet._frameHeight / 2;
		stage.addChild(fiveSprite);
	} else if (startscreenTickCounter === 20) {
		var sixSpriteSheet = new createjs.SpriteSheet({
			"images": [loader.getResult("slide_six")],
			"frames": {
				"width": 320, "height": 240, "count": 1
			},
			"animations": {
				"sit": {
					"frames" : [0],
					"next" : "sit"
				}
			}
		});

		var sixSprite = new createjs.Sprite(sixSpriteSheet, "sit");

		sixSprite.x = gamestage.canvas.width / 2 - sixSprite.spriteSheet._frameWidth / 2;
		sixSprite.y = gamestage.canvas.height / 2 - sixSprite.spriteSheet._frameHeight / 2;
		stage.addChild(sixSprite);
	} else */if (startscreenTickCounter === 0) {
		var titlescreenSpriteSheet = new createjs.SpriteSheet({
			"images": [loader.getResult("logo")],
			"frames": {
				"width": 320, "height": 240, "count": 2
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

		var titleSprite = new createjs.Sprite(titlescreenSpriteSheet, "shoot");

		titleSprite.x = gamestage.canvas.width / 2 - titleSprite.spriteSheet._frameWidth / 2;
		titleSprite.y = gamestage.canvas.height / 2 - titleSprite.spriteSheet._frameHeight / 2;
		stage.addChild(titleSprite);
	}

	if (startgame) {
		initVars();
		initBossScreen();
		event.remove();
	}
	gamestage.update();
}