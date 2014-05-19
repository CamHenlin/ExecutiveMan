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
	createjs.Ticker.setFPS(10);

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

function handleStartScreenTick(event) {
	if (startgame) {
		initVars();
		initBossScreen();
		event.remove();
	}
	gamestage.update();
}