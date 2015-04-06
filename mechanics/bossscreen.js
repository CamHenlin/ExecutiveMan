
/**
 * [initBossScreen description]
 * @return {[type]} [description]
 */
function initBossScreen() {
	document.getElementById("controlcanvas").style.zIndex = "0";
	stopMusic();

	if (lives < 2) {
		lives = 2;
	}

	var executivemanTopperSpriteSheet = new createjs.SpriteSheet({
		"images": [loader.getResult("executivemantopper")],
		"frames": {
			"width": 160,
			"height": 45,
			"count": 1
		},
		"animations": {
			"frame": {
				"frames": [0],
				"next": "frame"
			}
		}
	});
	var executivemanTopper = new createjs.Sprite(executivemanTopperSpriteSheet, "frame");

	var wastemanFrameSpriteSheet = new createjs.SpriteSheet({
		"images": [loader.getResult("wastemanframe")],
		"frames": {
			"width": 24,
			"height": 24,
			"count": 2
		},
		"animations": {
			"frame": {
				"frames": [0],
				"next": "frame",
				"speed": 0.01
			}
		}
	});
	var wastemanFrame = new createjs.Sprite(wastemanFrameSpriteSheet, "frame");
	var wastemanLabel = new createjs.Text("WASTE MAN", "14px '" + FONT + "'", "#FFF");

	var materialmanFrameSpriteSheet = new createjs.SpriteSheet({
		"images": [loader.getResult("materialmanframe")],
		"frames": {
			"width": 30,
			"height": 30,
			"count": 1
		},
		"animations": {
			"frame": {
				"frames": [0],
				"next": "frame"
			}
		}
	});
	var materialmanFrame = new createjs.Sprite(materialmanFrameSpriteSheet, "frame");
	var materialManLabel = new createjs.Text("MATERIAL MAN", "14px '" + FONT + "'", "#FFF");

	var HRmanFrameSpriteSheet = new createjs.SpriteSheet({
		"images": [loader.getResult("hrmanframe")],
		"frames": {
			"width": 19,
			"height": 26,
			"count": 1
		},
		"animations": {
			"frame": {
				"frames": [0],
				"next": "frame"
			}
		}
	});
	var HRManLabel = new createjs.Text("HR MAN", "14px '" + FONT + "'", "#FFF");
	var HRmanFrame = new createjs.Sprite(HRmanFrameSpriteSheet, "frame");

	var salesManFrameSpriteSheet = new createjs.SpriteSheet({
		"images": [loader.getResult("salesmanframe")],
		"frames": {
			"width": 30,
			"height": 29,
			"count": 1
		},
		"animations": {
			"frame": {
				"frames": [0],
				"next": "frame"
			}
		}
	});
	var salesManLabel = new createjs.Text("SALES MAN", "14px '" + FONT + "'", "#FFF");
	var salesManFrame = new createjs.Sprite(salesManFrameSpriteSheet, "frame");

	var ITmanFrameSpriteSheet = new createjs.SpriteSheet({
		"images": [loader.getResult("itmanframe")],
		"frames": {
			"width": 24,
			"height": 27,
			"count": 1
		},
		"animations": {
			"frame": {
				"frames": [0],
				"next": "frame"
			}
		}
	});
	var ITManLabel = new createjs.Text("IT MAN", "14px '" + FONT + "'", "#FFF");
	var ITmanFrame = new createjs.Sprite(ITmanFrameSpriteSheet, "frame");

	var warehousemanFrameSpriteSheet = new createjs.SpriteSheet({
		"images": [loader.getResult("warehousemanframe")],
		"frames": {
			"width": 20,
			"height": 24,
			"count": 1
		},
		"animations": {
			"frame": {
				"frames": [0],
				"next": "frame"
			}
		}
	});
	var warehouseMan = new createjs.Text("WAREHOUSE MAN", "14px '" + FONT + "'", "#FFF");
	var warehousemanFrame = new createjs.Sprite(warehousemanFrameSpriteSheet, "frame");

	var visionarymanFrameSpriteSheet = new createjs.SpriteSheet({
		"images": [loader.getResult("visionarymanframe")],
		"frames": {
			"width": 19,
			"height": 24,
			"count": 1
		},
		"animations": {
			"frame": {
				"frames": [0],
				"next": "frame"
			}
		}
	});
	var visionarymanFrame = new createjs.Sprite(visionarymanFrameSpriteSheet, "frame");
	var visionaryMan = new createjs.Text("VISIONARY MAN", "14px '" + FONT + "'", "#FFF");

	var accountingmanFrameSpriteSheet = new createjs.SpriteSheet({
		"images": [loader.getResult("accountingmanframe")],
		"frames": {
			"width": 19,
			"height": 24,
			"count": 1
		},
		"animations": {
			"frame": {
				"frames": [0],
				"next": "frame"
			}
		}
	});
	var accountingmanLabel = new createjs.Text("ACCOUNTING MAN", "14px '" + FONT + "'", "#FFF");
	var accountingmanFrame = new createjs.Sprite(accountingmanFrameSpriteSheet, "frame");


	bossScreenUp = true;
	bossscreenCounter = 60;
	stage = new createjs.Container();
	altstage = new createjs.Container();
	gamestage = new createjs.Stage("gamecanvas");
	gamestage.snapToPixelEnabled = true;
	var zoomAmount = window.innerHeight / 240;

	gamezoom = zoomAmount;
	gamestage.canvas.height = window.innerHeight / zoomAmount;
	gamestage.canvas.width = gamestage.canvas.height + (gamestage.canvas.height * 1 / 3.4);
	document.getElementById("gamecanvas").style.zoom = zoomAmount;
	document.getElementById("gamecanvas").style.MozTransform = "scale(" + zoomAmount + ")";
	document.getElementById("gamecanvas").style.left = ((window.innerWidth / gamezoom - document.getElementById("gamecanvas").width) / 2) + "px";
	gamestage.canvas.style.backgroundColor = "#000";
	gamestage.addChild(altstage);
	gamestage.addChild(stage);
	this.optionsMenu = new OptionsMenu();
	stage.x = -gamestage.canvas.width;
	altstage.x = gamestage.canvas.width;
	var fillColor = new createjs.Shape();
	fillColor.graphics.beginFill("#0000FF").drawRect(0, 0, gamestage.canvas.width, gamestage.canvas.height);
	altstage.addChild(fillColor);


	var saveGameLabel = new createjs.Text("SAVE\nGAME", "16px '" + FONT + "'", "#FFF");
	saveGameLabel.x = 30;
	saveGameLabel.y = 10;
	this.saveGameTouchTarget = buildSaveLoadTouchTarget(saveGameLabel);
	var loadGameLabel = new createjs.Text("LOAD\nGAME", "16px '" + FONT + "'", "#FFF");
	loadGameLabel.x = gamestage.canvas.width - 62;
	loadGameLabel.y = 10;
	this.loadGameTouchTarget = buildSaveLoadTouchTarget(loadGameLabel);
	var optionsMenuLabel = new createjs.Text("OPTIONS", "16px '" + FONT + "'", "#FFF");
	optionsMenuLabel.x = 30;
	optionsMenuLabel.y = gamestage.canvas.height - 16;
	this.optionsMenuTouchTarget = buildSaveLoadTouchTarget(optionsMenuLabel);

	var centerx = gamestage.canvas.width / 2;
	var centery = 10 + gamestage.canvas.height / 2;

	this.frames = [	wastemanFrame,
					accountingmanFrame,
					materialmanFrame,
					HRmanFrame,
					salesManFrame,
					ITmanFrame,
					warehousemanFrame,
					visionarymanFrame ];
	var labels = [	wastemanLabel,
					accountingmanLabel,
					materialManLabel,
					HRManLabel,
					salesManLabel,
					ITManLabel,
					warehouseMan,
					visionaryMan ];

	for (var i = 0; i < frames.length; i++) {
		var offset = (i > 3) ? 150 : 0;
		console.log(i);
		this.frames[i].x = 30 - this.frames[i].spriteSheet._frameWidth / 2 + offset;
		this.frames[i].y = (i % 4) * 35 + 59;
		labels[i].x = 50 + offset;
		labels[i].y = (i % 4) * 35 + 10 + 59;
	}

	executivemanTopper.x = centerx - executivemanTopper.spriteSheet._frameWidth / 2;
	executivemanTopper.y = 0;
	startlevel = false;

	createjs.Ticker.addEventListener("tick", handleBossScreenTick);
	createjs.Ticker.setFPS(60);

	document.getElementById("gamecanvas").addEventListener("click", bossClickHandler, false);

	stage.addChild(executivemanTopper);

	stage.addChild(wastemanFrame);
	stage.addChild(wastemanLabel);

	stage.addChild(materialmanFrame);
	stage.addChild(materialManLabel);
	stage.addChild(HRManLabel);
	stage.addChild(HRmanFrame);
	stage.addChild(ITmanFrame);
	stage.addChild(salesManFrame);
	stage.addChild(salesManLabel);
	stage.addChild(ITManLabel);

	stage.addChild(warehousemanFrame);
	stage.addChild(warehouseMan);

	stage.addChild(visionaryMan);

	stage.addChild(saveGameLabel);
	stage.addChild(optionsMenuLabel);
	stage.addChild(loadGameLabel);
	stage.addChild(accountingmanFrame);
	stage.addChild(visionarymanFrame);
	stage.addChild(accountingmanLabel);

	document.getElementById("gamecanvas").addEventListener("keydown", bossClickHandler, false);
}

/**
 * [bossScreenKeyDownHandler description]
 * @param  {[type]} event [description]
 * @return {[type]}       [description]
 */
var bossScreenKeyDownHandler = function(event) {
	switch (event.keyCode) {
		case keyCodes.left:
			// keyCode 37 is left arrow
			bossnumber--;
			break;

		case keyCodes.right:
			// keyCode 39 is right arrow
			bossnumber++;
			break;


		case keyCodes.jump:
			// keyCode 32 is space

			document.getElementById("gamecanvas").removeEventListener("keydown", bossClickHandler, false);
			initVars();
			initShowOffBossScreen(bossNumber);
			bossScreenUp = false;
			playSound("pauseopen");
			break;
	}
};
bossScreenKeyDownHandler = bossScreenKeyDownHandler.bind(this);

/**
 * [buildSaveLoadTouchTarget description]
 * @param  {[type]} text [description]
 * @return {[type]}      [description]
 */
function buildSaveLoadTouchTarget(text) {
	var touchTarget = {};
	touchTarget.x = text.x - 5;
	touchTarget.y = text.y - 3;
	touchTarget.spriteSheet = {};
	touchTarget.spriteSheet._frameHeight = 32;
	touchTarget.spriteSheet._frameWidth = 40;
	return touchTarget;
}


function bossClickHandler(event) {
	if (!bossScreenUp) {
		return;
	}

	if (shopUp || optionsUp) {
		return;
	}

	var touchEventSpriteSheet = new createjs.SpriteSheet({
		"images": [loader.getResult("beam")],
		"frames": {
			"width": 1,
			"height": 1,
			"count": 1
		},
		"animations": {
			"exist": {
				"frames": [0],
				"next": "exist"
			}
		}
	});
	var touchSprite = new createjs.Sprite(touchEventSpriteSheet, "exist");

	event.preventDefault();

	touchSprite.x = ((event.pageX || touch.pageX)) / gamezoom - document.getElementById("gamecanvas").offsetLeft;
	touchSprite.y = (event.pageY || touch.pageY) / gamezoom;
	if (fastCollisionSprite(this.saveGameTouchTarget, touchSprite)) {
		saveGame();
		playSound("pauseopen");
	} else if (fastCollisionSprite(this.loadGameTouchTarget, touchSprite)) {
		loadGame();
		playSound("pauseopen");
	} else if (fastCollisionSprite(this.optionsMenuTouchTarget, touchSprite)) {
		this.optionsMenu.show();
	} else {
		for (var k = 0; k < frames.length; k++) {
			if (fastCollisionSprite(this.frames[k], touchSprite)) {
				initVars();
				initShowOffBossScreen(k);
				bossScreenUp = false;
				playSound("pauseopen");
				document.getElementById("gamecanvas").removeEventListener("click", bossClickHandler, false);
			}
		}
	}
}
bossClickHandler = bossClickHandler.bind(this);

/**
 * [handleBossScreenTick description]
 * @param  {[type]} event [description]
 * @return {[type]}       [description]
 */
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

	if (gamestage) {
		gamestage.update();
	}
}