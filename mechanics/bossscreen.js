var bossScreenUp = false;
function initBossScreen() {
	document.getElementById("controlcanvas").style.zIndex = "0";
	stopMusic();

	if (lives < 2) {
		lives = 2;
	}

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
				"next" : "frame",
				"speed" : 0.01
			}
		}
	});
	var wastemanFrame = new createjs.Sprite(wastemanFrameSpriteSheet, "frame");
	var wastemanLabel = new createjs.Text("WASTE MAN", "11px '8-Bit Madness'", "#FFF");

	var materialmanFrameSpriteSheet = new createjs.SpriteSheet({
		"images": [loader.getResult("materialmanframe")],
		"frames": {
			"width": 30, "height": 30, "count": 1
		},
		"animations": {
			"frame": {
				"frames" : [0],
				"next" : "frame"
			}
		}
	});
	var materialmanFrame = new createjs.Sprite(materialmanFrameSpriteSheet, "frame");
	var materialManLabel = new createjs.Text("MATERIAL \n     MAN", "11px '8-Bit Madness'", "#FFF");

	var HRmanFrameSpriteSheet = new createjs.SpriteSheet({
		"images": [loader.getResult("hrmanframe")],
		"frames": {
			"width": 19, "height": 26, "count": 1
		},
		"animations": {
			"frame": {
				"frames" : [0],
				"next" : "frame"
			}
		}
	});
	var HRManLabel = new createjs.Text("HR MAN", "11px '8-Bit Madness'", "#FFF");
	var HRmanFrame = new createjs.Sprite(HRmanFrameSpriteSheet, "frame");

	var salesManFrameSpriteSheet = new createjs.SpriteSheet({
		"images": [loader.getResult("salesmanframe")],
		"frames": {
			"width": 30, "height": 29, "count": 1
		},
		"animations": {
			"frame": {
				"frames" : [0],
				"next" : "frame"
			}
		}
	});
	var salesManLabel = new createjs.Text("SALES MAN", "11px '8-Bit Madness'", "#FFF");
	var salesManFrame = new createjs.Sprite(salesManFrameSpriteSheet, "frame");

	var ITmanFrameSpriteSheet = new createjs.SpriteSheet({
		"images": [loader.getResult("itmanframe")],
		"frames": {
			"width": 24, "height": 27, "count": 1
		},
		"animations": {
			"frame": {
				"frames" : [0],
				"next" : "frame"
			}
		}
	});
	var ITManLabel = new createjs.Text("IT MAN", "11px '8-Bit Madness'", "#FFF");
	var ITmanFrame = new createjs.Sprite(ITmanFrameSpriteSheet, "frame");

	var warehousemanFrameSpriteSheet = new createjs.SpriteSheet({
		"images": [loader.getResult("warehousemanframe")],
		"frames": {
			"width": 20, "height": 24, "count": 1
		},
		"animations": {
			"frame": {
				"frames" : [0],
				"next" : "frame"
			}
		}
	});
	var warehouseMan = new createjs.Text("WAREHOUSE \n        MAN", "11px '8-Bit Madness'", "#FFF");
	var warehousemanFrame = new createjs.Sprite(warehousemanFrameSpriteSheet, "frame");

	var visionarymanFrameSpriteSheet = new createjs.SpriteSheet({
		"images": [loader.getResult("visionarymanframe")],
		"frames": {
			"width": 19, "height": 24, "count": 1
		},
		"animations": {
			"frame": {
				"frames" : [0],
				"next" : "frame"
			}
		}
	});
	var visionarymanFrame = new createjs.Sprite(visionarymanFrameSpriteSheet, "frame");
	var visionaryMan = new createjs.Text("VISIONARY \n      MAN", "11px '8-Bit Madness'", "#FFF");

	var accountingmanFrameSpriteSheet = new createjs.SpriteSheet({
		"images": [loader.getResult("accountingmanframe")],
		"frames": {
			"width": 19, "height": 24, "count": 1
		},
		"animations": {
			"frame": {
				"frames" : [0],
				"next" : "frame"
			}
		}
	});
	var accountingmanLabel = new createjs.Text("ACCOUNTING \n        MAN", "11px '8-Bit Madness'", "#FFF");
	var accountingmanFrame = new createjs.Sprite(accountingmanFrameSpriteSheet, "frame");

	var shopFrameSpriteSheet = new createjs.SpriteSheet({
		"images": [loader.getResult("shopframe")],
		"frames": {
			"width": 30, "height": 24, "count": 1
		},
		"animations": {
			"frame": {
				"frames" : [0],
				"next" : "frame"
			}
		}
	});
	var shopLabel = new createjs.Text("SHOP", "11px '8-Bit Madness'", "#FFF");
	var shopFrame = new createjs.Sprite(shopFrameSpriteSheet, "frame");

	bossframes = [];
	for (var i = 0; i < 9; i++) {
		bossframes.push(new createjs.Sprite(bossframeSpriteSheet, "frame"));
	}

	bossScreenUp = true;
	bossscreenCounter = 60;
	stage = new createjs.Container();
	altstage = new createjs.Container();
	gamestage = new createjs.Stage("gamecanvas");
	gamestage.snapToPixelEnabled = true;
	var zoomAmount = window.innerHeight / 240;

	gamezoom = zoomAmount;
	gamestage.canvas.height = window.innerHeight / zoomAmount;
	gamestage.canvas.width = gamestage.canvas.height + (gamestage.canvas.height * 1/3.4);
	document.getElementById("gamecanvas").style.zoom = zoomAmount;
	document.getElementById("gamecanvas").style.MozTransform = "scale("+zoomAmount+")";
	document.getElementById("gamecanvas").style.left = ((window.innerWidth / gamezoom - document.getElementById("gamecanvas").width) / 2) + "px";
	gamestage.canvas.style.backgroundColor = "#000";
	gamestage.addChild(altstage);
	gamestage.addChild(stage);
	this.shopMenu = new ShopMenu();
	this.optionsMenu = new OptionsMenu();
	stage.x = -gamestage.canvas.width;
	altstage.x = gamestage.canvas.width;
	var fillColor = new createjs.Shape();
	fillColor.graphics.beginFill("#0000FF").drawRect(0, 0, gamestage.canvas.width, gamestage.canvas.height);
	altstage.addChild(fillColor);


	var saveGameLabel = new createjs.Text("SAVE\nGAME", "11px '8-Bit Madness'", "#FFF");
	saveGameLabel.x = 6;
	saveGameLabel.y = 10;
	this.saveGameTouchTarget = buildSaveLoadTouchTarget(saveGameLabel);
	var loadGameLabel = new createjs.Text("LOAD\nGAME", "11px '8-Bit Madness'", "#FFF");
	loadGameLabel.x = gamestage.canvas.width - 36;
	loadGameLabel.y = 10;
	this.loadGameTouchTarget = buildSaveLoadTouchTarget(loadGameLabel);
	var optionsMenuLabel = new createjs.Text("OPTIONS", "11px '8-Bit Madness'", "#FFF");
	optionsMenuLabel.x = 6;
	optionsMenuLabel.y = gamestage.canvas.height - 36;
	this.optionsMenuTouchTarget = buildSaveLoadTouchTarget(optionsMenuLabel);

	var width = bossframes[0].spriteSheet._frameWidth;
	var framewidth = bossframes[0].spriteSheet._frameWidth;
	var centerx = gamestage.canvas.width / 2 - bossframes[0].spriteSheet._frameWidth / 2;
	var centery = 10 + gamestage.canvas.height / 2 - bossframes[0].spriteSheet._frameWidth / 2;
	for (i = 0; i < 9; i++) {
		if (i === 0) {
			wastemanFrame.x = centerx - 4/3 * width  + (framewidth + framewidth / 2) * (i % 3) + wastemanFrame.spriteSheet._frameWidth /2 -2;
			wastemanFrame.y = centery - width + (framewidth + framewidth / 2) * ~~(i / 3) - width / 2 + wastemanFrame.spriteSheet._frameWidth/2 -2;
			wastemanLabel.x = centerx - 4/3 * width  + (framewidth + framewidth / 2) * (i % 3) + 1;
			wastemanLabel.y = centery - width + (framewidth + framewidth / 2) * ~~(i / 3) - width / 2 + framewidth + 5;
		}
		if (i === 1) {
			accountingmanFrame.x = centerx - 4/3 * width  + (framewidth + framewidth / 2) * (i % 3) + accountingmanFrame.spriteSheet._frameWidth /2 + 3;
			accountingmanFrame.y = centery - width + (framewidth + framewidth / 2) * ~~(i / 3) - width / 2 + accountingmanFrame.spriteSheet._frameWidth/2;
			accountingmanLabel.x = centerx - 4/3 * width  + (framewidth + framewidth / 2) * (i % 3) - 1;
			accountingmanLabel.y = centery - width + (framewidth + framewidth / 2) * ~~(i / 3) - width / 2 + framewidth + 5;
		}
		if (i === 2) {
			materialmanFrame.x = centerx - 4/3 * width  + (framewidth + framewidth / 2) * (i % 3) + wastemanFrame.spriteSheet._frameWidth /2 - 5;
			materialmanFrame.y = centery - width + (framewidth + framewidth / 2) * ~~(i / 3) - width / 2 + wastemanFrame.spriteSheet._frameWidth/2 -5;
			materialManLabel.x = centerx - 4/3 * width  + (framewidth + framewidth / 2) * (i % 3) + 5;
			materialManLabel.y = centery - width + (framewidth + framewidth / 2) * ~~(i / 3) - width / 2 + framewidth + 5;
		}
		if (i === 3) {
			HRmanFrame.x = centerx - 4/3 * width  + (framewidth + framewidth / 2) * (i % 3) + HRmanFrame.spriteSheet._frameWidth /2 + 3;
			HRmanFrame.y = centery - width + (framewidth + framewidth / 2) * ~~(i / 3) - width / 2 + HRmanFrame.spriteSheet._frameWidth/2;
			HRManLabel.x = centerx - 4/3 * width  + (framewidth + framewidth / 2) * (i % 3) + 9;
			HRManLabel.y = centery - width + (framewidth + framewidth / 2) * ~~(i / 3) - width / 2 + framewidth + 5;
		}
		if (i === 4) { // middle frame
			shopFrame.x = centerx - 4/3 * width  + (framewidth + framewidth / 2) * (i % 3) + shopFrame.spriteSheet._frameWidth /2 -8;
			shopFrame.y = centery - width + (framewidth + framewidth / 2) * ~~(i / 3) - width / 2 + shopFrame.spriteSheet._frameWidth/2 -4;
			shopLabel.x = centerx - 4/3 * width  + (framewidth + framewidth / 2) * (i % 3) + 12;
			shopLabel.y = centery - width + (framewidth + framewidth / 2) * ~~(i / 3) - width / 2 + framewidth + 5;
		}
		if (i === 5) {
			salesManFrame.x = centerx - 4/3 * width  + (framewidth + framewidth / 2) * (i % 3) + salesManFrame.spriteSheet._frameWidth /2 - 8;
			salesManFrame.y = centery - width + (framewidth + framewidth / 2) * ~~(i / 3) - width / 2 + salesManFrame.spriteSheet._frameWidth/2 - 8;
			salesManLabel.x = centerx - 4/3 * width  + (framewidth + framewidth / 2) * (i % 3) + 1;
			salesManLabel.y = centery - width + (framewidth + framewidth / 2) * ~~(i / 3) - width / 2 + framewidth + 5;
		}
		if (i === 6) {
			ITmanFrame.x = centerx - 4/3 * width  + (framewidth + framewidth / 2) * (i % 3) + ITmanFrame.spriteSheet._frameWidth /2 - 2;
			ITmanFrame.y = centery - width + (framewidth + framewidth / 2) * ~~(i / 3) - width / 2 + ITmanFrame.spriteSheet._frameWidth /2 - 3;
			ITManLabel.x = centerx - 4/3 * width  + (framewidth + framewidth / 2) * (i % 3) + 10;
			ITManLabel.y = centery - width + (framewidth + framewidth / 2) * ~~(i / 3) - width / 2 + framewidth + 5;
		}
		if (i === 7) {
			warehousemanFrame.x = centerx - 4/3 * width  + (framewidth + framewidth / 2) * (i % 3) + warehousemanFrame.spriteSheet._frameWidth /2 + 2 ;
			warehousemanFrame.y = centery - width + (framewidth + framewidth / 2) * ~~(i / 3) - width / 2 + warehousemanFrame.spriteSheet._frameWidth/2 ;
			warehouseMan.x = centerx - 4/3 * width  + (framewidth + framewidth / 2) * (i % 3) - 1;
			warehouseMan.y = centery - width + (framewidth + framewidth / 2) * ~~(i / 3) - width / 2 + framewidth + 5;
		}
		if (i === 8) {
			visionarymanFrame.x = centerx - 4/3 * width  + (framewidth + framewidth / 2) * (i % 3) + visionarymanFrame.spriteSheet._frameWidth /2 + 3;
			visionarymanFrame.y = centery - width + (framewidth + framewidth / 2) * ~~(i / 3) - width / 2 + visionarymanFrame.spriteSheet._frameWidth/2;
			visionaryMan.x = centerx - 4/3 * width  + (framewidth + framewidth / 2) * (i % 3) + 3;
			visionaryMan.y = centery - width + (framewidth + framewidth / 2) * ~~(i / 3) - width / 2 + framewidth + 5;
		}
		bossframes[i].x = centerx - 4/3 * width  + (framewidth + framewidth / 2) * (i % 3);
		bossframes[i].y = centery - width + (framewidth + framewidth / 2) * ~~(i / 3) - width / 2;
	}
	executivemanTopper.x = centerx - executivemanTopper.spriteSheet._frameWidth / 2 + width / 2 + 10;
	executivemanTopper.y = centery - width * 2 - width / 2;
	startlevel = false;

	createjs.Ticker.addEventListener("tick", handleBossScreenTick);
	createjs.Ticker.setFPS(60);

	document.getElementById("gamecanvas").addEventListener('click', bossClickHandler.bind(this), false);

	stage.addChild(executivemanTopper);
	for (i = 0; i < bossframes.length; i++) {
		stage.addChild(bossframes[i]);
	}

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

	stage.addChild(shopFrame);
	stage.addChild(shopLabel);
	stage.addChild(saveGameLabel);
	stage.addChild(optionsMenuLabel);
	stage.addChild(loadGameLabel);
	stage.addChild(accountingmanFrame);
	stage.addChild(visionarymanFrame);
	stage.addChild(accountingmanLabel);

	document.onkeydown = bossScreenKeyDownHandler.bind(this);
}

var bossScreenKeyDownHandler = function (event) {
	switch (event.keyCode) {
		case keyCodes.left:
			// keyCode 37 is left arrow
			bossNumber--;
			break;

		case keyCodes.right:
			// keyCode 39 is right arrow
			bossNumber++;
			break;


		case keyCodes.jump:
			// keyCode 32 is space
			if (bossNumber === 4) {
				this.shopMenu.show();
				//event.target.removeEventListener(event.type, arguments.callee);
			} else {
				initVars();
				initShowOffBossScreen(bossNumber);
				event.target.removeEventListener(event.type, arguments.callee);
				bossScreenUp = false;
				playSound("pauseopen");
			}
			break;
	}
};


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

	touchSprite.x = ((event.pageX || touch.pageX)) / gamezoom - document.getElementById('gamecanvas').offsetLeft;
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
		for (var k = 0; k < 9; k++) { // should be 9
			if (k === 4 && fastCollisionSprite(bossframes[k], touchSprite)) {
				this.shopMenu.show();
				//event.target.removeEventListener(event.type, arguments.callee);
			} else if (fastCollisionSprite(bossframes[k], touchSprite)) {
				initVars();
				initShowOffBossScreen(k);
				event.target.removeEventListener(event.type, arguments.callee);
				bossScreenUp = false;
				playSound("pauseopen");
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

	if (gamestage) {
		gamestage.update();
	}
}