
/**
 * [initMainMenuScreen description]
 * @return {[type]} [description]
 */
function initMainMenuScreen() {
	var MAX_SELECTIONS = 2;
	document.getElementById("controlcanvas").style.zIndex = "0";
	stopMusic();

	var executivemanTopperSpriteSheet = new createjs.SpriteSheet({
		"images": [loader.getResult("execmanlogo")],
		"frames": {
			"width": 268,
			"height": 85,
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

	mainMenuScreenUp = true;
	mainMenuScreenCounter = 60;
	stage = new createjs.Container();
	altstage = new createjs.Container();
	gamestage = new createjs.Stage("gamecanvas");
	gamestage.snapToPixelEnabled = true;
	var zoomAmount = window.innerHeight / 240;
	startbossscreen = false;
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
	fillColor.graphics.beginFill("#000000").drawRect(0, 0, gamestage.canvas.width, gamestage.canvas.height);
	altstage.addChild(fillColor);

	var newGameLabel = new createjs.Text("NEW GAME", "18px '" + FONT + "'", "#FFF");
	newGameLabel.x = gamestage.canvas.width / 2 - 25;
	newGameLabel.y = gamestage.canvas.height - 120;
	this.newGameTouchTarget = buildMainMenuTouchTarget(newGameLabel);
	var loadGameLabel = new createjs.Text("LOAD GAME", "18px '" + FONT + "'", "#FFF");
	loadGameLabel.x = gamestage.canvas.width / 2 - 25;
	loadGameLabel.y = gamestage.canvas.height - 90;
	this.loadGameTouchTarget = buildMainMenuTouchTarget(loadGameLabel);
	var optionsMenuLabel = new createjs.Text("OPTIONS", "18px '" + FONT + "'", "#FFF");
	optionsMenuLabel.x = gamestage.canvas.width / 2 - 25;
	optionsMenuLabel.y = gamestage.canvas.height - 60;
	this.optionsMenuTouchTarget = buildMainMenuTouchTarget(optionsMenuLabel);

	executivemanTopper.x = gamestage.canvas.width / 2 - executivemanTopper.spriteSheet._frameWidth / 2;
	executivemanTopper.y = 10;

	createjs.Ticker.addEventListener("tick", handleMainMenuScreenTick);
	createjs.Ticker.setFPS(60);

	document.getElementById("gamecanvas").addEventListener('click', mainMenuClickHandler.bind(this), false);

	stage.addChild(executivemanTopper);

	stage.addChild(newGameLabel);
	stage.addChild(optionsMenuLabel);
	stage.addChild(loadGameLabel);

	document.onkeydown = mainMenuScreenKeyDownHandler.bind(this);
}

/**
 * [mainMenuScreenKeyDownHandler description]
 * @param  {[type]} event [description]
 * @return {[type]}       [description]
 */
var mainMenuScreenKeyDownHandler = function(event) {
	if (optionsUp || !mainMenuScreenUp) {
		return;
	}

	switch (event.keyCode) {
		case keyCodes.left || 38: // 38 is up
			// keyCode 37 is left arrow
			selectionNumber--;
			if (selectionNumber < 0) {
				selectionNumber = MAX_SELECTIONS;
			}
			break;

		case keyCodes.right || 40: // 40 is down
			// keyCode 39 is right arrow
			selectionNumber++;
			if (selectionNumber > MAX_SELECTIONS) {
				selectionNumber = 0;
			}
			break;


		case keyCodes.jump:
			// keyCode 32 is space
			if (selectionNumber === 0) {
				// start game
				initVars();
				initBossScreen();
				startbossscreen = true;
				playSound("pauseopen");
				event.target.removeEventListener(event.type, arguments.callee);
			} else if (selectionNumber === 1) {
				// load game
				loadGame();
				initVars();
				startbossscreen = true;
				initBossScreen();
				playSound("pauseopen");
				event.target.removeEventListener(event.type, arguments.callee);
			} else if (selectionNumber === 2) {
				// options
				this.optionsMenu.show();
				playSound("pauseopen");
			}

			break;
	}
};

/**
 * [buildMainMenuTouchTarget description]
 * @param  {[type]} text [description]
 * @return {[type]}      [description]
 */
function buildMainMenuTouchTarget(text) {
	var touchTarget = {};
	touchTarget.x = text.x - 5;
	touchTarget.y = text.y;
	touchTarget.spriteSheet = {};
	touchTarget.spriteSheet._frameHeight = 28;
	touchTarget.spriteSheet._frameWidth = text.text.length * 12;
	return touchTarget;
}

/**
 * [mainMenuClickHandler description]
 * @param  {[type]} event [description]
 * @return {[type]}       [description]
 */
function mainMenuClickHandler(event) {
	if (!mainMenuScreenUp) {
		return;
	}

	if (optionsUp) {
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

	touchSprite.x = ((event.pageX || touch.pageX)) / gamezoom - document.getElementById("gamecanvas").offsetLeft;
	touchSprite.y = (event.pageY || touch.pageY) / gamezoom;
	if (fastCollisionSprite(this.newGameTouchTarget, touchSprite)) {
		initVars();
		initBossScreen();
		playSound("pauseopen");
		mainMenuScreenUp = false;
		event.target.removeEventListener(event.type, arguments.callee);
	} else if (fastCollisionSprite(this.loadGameTouchTarget, touchSprite)) {
		loadGame();
		initVars();
		initBossScreen();
		mainMenuScreenUp = false;
		startbossscreen = true;
		playSound("pauseopen");
		event.target.removeEventListener(event.type, arguments.callee);
	} else if (fastCollisionSprite(this.optionsMenuTouchTarget, touchSprite)) {
		this.optionsMenu.show();
		playSound("pauseopen");
	}
}

/**
 * [handleMainMenuScreenTick description]
 * @param  {[type]} event [description]
 * @return {[type]}       [description]
 */
function handleMainMenuScreenTick(event) {

	if (!mainMenuScreenUp) {
		event.remove();
		return;
	}

	if (mainMenuScreenCounter > 0) {
		stage.x += gamestage.canvas.width / 60;
		altstage.x -= gamestage.canvas.width / 60;
		mainMenuScreenCounter--;
	}

	if (startbossscreen) {
		event.remove();
	}

	if (gamestage) {
		gamestage.update();
	}
}