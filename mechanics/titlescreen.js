function initTitleScreen() {
	playSoundLoop("title");
	var oneSpriteSheet = new createjs.SpriteSheet({
		"images": [loader.getResult("camh")],
		"frames": {
			"width": 110, "height": 34, "count": 10
		},
		"animations": {
			"sit": {
				"frames" : [ 0, 0, 0, 0, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 4, 5, 6, 7, 8, 9, 2, 2, 2, 2, 2, 2, 2, 2, 2, 4, 6, 8 ],
				"next" : "still"
			},
			"still": {
				"frames" : [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
				"next" : "sit"
			}
		}
	});

	titleSreenSprite = new createjs.Sprite(oneSpriteSheet, "sit");
	startgame = false;
	stage = new createjs.Container();
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
	gamestage.addChild(stage);

	titleSreenSprite.x = gamestage.canvas.width / 2 - titleSreenSprite.spriteSheet._frameWidth / 2;
	titleSreenSprite.y = gamestage.canvas.height / 2 - titleSreenSprite.spriteSheet._frameHeight / 2;

	createjs.Ticker.addEventListener("tick", handleStartScreenTick);
	createjs.Ticker.setFPS(30);

	document.onkeydown = function (event) {
		switch (event.keyCode) {
			case 32:
				// keyCode 32 is space
				startgame = true;
				document.getElementById("gamecanvas").removeEventListener('click', startScreenListener, false);
				break;
		}
	}.bind(this);

	document.getElementById("gamecanvas").addEventListener('click', startScreenListener, false);
	//titleSreenSprite.animations.play();
	stage.addChild(titleSreenSprite);
}

function startScreenListener() {
	console.log('click');
	startgame = true;
	document.getElementById("gamecanvas").removeEventListener('click', startScreenListener, false);
	demoEnded = true;
	initVars();
	initMainMenuScreen();
}
startScreenListener = startScreenListener.bind(this);

var startscreenTickCounter = 140;
if (getParameterByName('camh')) {
	startscreenTickCounter = 65535;
	musicOff = true;
	soundOff = true;
	stopMusic();
}
function handleStartScreenTick(event) {
	if (startscreenTickCounter > 0) {
		startscreenTickCounter--;
	}

	if (startscreenTickCounter === 0) {
event.remove();
document.getElementById("gamecanvas").addEventListener('click', startScreenListener, false);
	maps = demomaps;
	beginGame(true, true);
	var demoActions = [
		function() {
			player.actions.playerRight = true;
		},
		function() {

		},
		function() {

		},
		function() {

		},
		function() {

		},
		function() {

		},
		function() {

		},
		function() {

		},
		function() {

		},
		function() {

		},
		function() {

		},
		function() {

		},
		function() {
			for (var i = 0; i < renderer.objects.length; i++) {
				if (renderer.objects[i].constructor === Dialog) {
					renderer.objects[i].remove();
				}
			}
		},
		function() {

		},
		function() {

		},
		function() {

		},
		function() {

		},
		function() {

		},
		function() {

		},
		function() {

		},
		function() {
			player.actions.playerJump = true;
		},
		function() {

		},
		function() {

		},
		function() {
			player.actions.playerRight = false;

		},
		function() {

		},
		function() {

		},
		function() {

		},
		function() {

		},
		function() {

		},
		function() {

		},
		function() {

		},
		function() {

		},
		function() {

		},
		function() {

		},
		function() {

		},
		function() {
			demoEnded = true;
		},
		startScreenListener
	];

	setTimeout(function() {
		for (var i in demoActions) {
			setTimeout(demoActions[i].bind(this), i * 250);
		}
	}.bind(this), 5000);

	/*
		var titlescreenSpriteSheet = new createjs.SpriteSheet({
			"images": [loader.getResult("slide_one")],
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
		stage.addChild(titleSprite);*/
	}

	if (startgame) {
		initMainMenuScreen();
		event.remove();
	}
	gamestage.update();
}