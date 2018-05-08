window.mobilecheck = function() {
	var check = false;
	(function(a) {
		if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od|ad)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) {
			check = true;
		}
	})(navigator.userAgent || navigator.vendor || window.opera);
	return check;
};

// default keyboard keycodes
var keyCodes = {
	"left": 37,
	"right": 39,
	"jump": 32,
	"shoot": 67,
	"pause": 80
};

/**
 * [init description]
 * @return {[type]} [description]
 */
function init() {
	initVars();
	if (getParameterByName("level") === "0") {
		maps = wastemanmaps;
		beginGame(true);
	} else if (getParameterByName("level") === "1") {
		maps = accountingmanmaps;
		beginGame(true);
	}  else if (getParameterByName("level") === "8") {
		maps = visionarymanmaps;
		beginGame(true);
	} else {
		initTitleScreen();
	}
}

/**
 * [initVars description]
 * @return {[type]} [description]
 */
function initVars() {
	stage = new createjs.Container();
	gamestage = new createjs.Stage("gamecanvas");
	watchedElements = null;
	player = null;
	renderer = null;
	tileCollisionDetector = null;
}

window.onresize = function(event) {
	document.getElementById("gamecanvas").style.zoom = 0.1;
	document.getElementById("gamecanvas").style.MozTransform = "scale(" + 0.1 + ")";
	zoomAmount = (window.innerHeight / 240 > window.innerHeight / 256) ? window.innerHeight / 240 : window.innerHeight / 256;
	gamestage.canvas.height = 240;
	gamestage.canvas.width = 256;
	document.getElementById("gamecanvas").style.zoom = zoomAmount;
	document.getElementById("gamecanvas").style.MozTransform = "scale(" + zoomAmount + ")";
	document.getElementById("gamecanvas").style.left = ((window.innerWidth / zoomAmount - document.getElementById("gamecanvas").width) / 2) + "px";
	initTouchControls();
};

/**
 * [beginGame description]
 * @param  {[type]} newGame  [description]
 * @param  {[type]} demoMode [description]
 * @return {[type]}          [description]
 */
function beginGame(newGame, demoMode) {
	if (demoMode) {
		isDemo = true;
	}

	dead = false;
	if (newGame && lives < 2) {
		lives = 2;
	}

	if (newGame) {
		halfwayPointReached = false;
		bosspointReached = false;
	}

	var explosionSpriteSheet = new createjs.SpriteSheet({
		"images": [loader.getResult("explosion")],
		"frames": {
			"width": 25,
			"height": 25,
			"count": 4
		},
		"animations": {
			"explode": {
				"frames": [0, 1, 2, 3],
				"speed": 0.125,
				"next": "nothing"
			},
			"nothing": {
				"frames": [4],
				"speed": 0.125,
				"next": "nothing"
			}
		}
	});

	explosionSprite = new createjs.Sprite(explosionSpriteSheet, "explode");
	var shotExplosionSpriteSheet = new createjs.SpriteSheet({
		"images": [loader.getResult("shotexplosion")],
		"frames": {
			"width": 16,
			"height": 16,
			"count": 1
		},
		"animations": {
			"explode": {
				"frames": [0],
				"next": "explode"
			}
		}
	});

	shotExplosionSprite = new createjs.Sprite(shotExplosionSpriteSheet, "explode");
	gamestage = new createjs.Stage("gamecanvas");
	gamestage.clear();
	gamestage.snapToPixelEnabled = true;

	var zoomAmount = (window.innerHeight / 240 > window.innerHeight / 256) ? window.innerHeight / 240 : window.innerHeight / 256;
	gamezoom = zoomAmount;
	gamestage.canvas.height = 240;
	gamestage.canvas.width = 256;
	document.getElementById("gamecanvas").style.zoom = zoomAmount;
	document.getElementById("gamecanvas").style.MozTransform = "scale(" + zoomAmount + ")";
	document.getElementById("gamecanvas").style.left = ((window.innerWidth / gamezoom - document.getElementById("gamecanvas").width) / 2) + "px";

	gamestage.canvas.style.backgroundColor = "#000";

	watchedElements = [];
	renderer = new Renderer(gamestage);

	if (bosspointReached) {
		if (bossnumber === 0) {
			renderer.mapData = maps[wastemanBossPoint];
			renderer.mapcounter = wastemanBossPoint;
		} else if (bossnumber === 1) {
			renderer.mapData = maps[accountingmanBossPoint];
			renderer.mapcounter = accountingmanBossPoint;
		} else if (bossnumber === 2) {
			renderer.mapData = maps[materialmanBossPoint];
			renderer.mapcounter = materialmanBossPoint;
		} else if (bossnumber === 7) {
			renderer.mapData = maps[warehousemanBossPoint];
			renderer.mapcounter = warehousemanBossPoint;
		} else if (bossnumber === 8) {
			renderer.mapData = maps[visionaryManBossPoint];
			renderer.mapcounter = visionaryManBossPoint;
		}
	} else if (halfwayPointReached) {
		if (bossnumber === 0) {
			renderer.mapData = maps[wastemanHalfwayPoint];
			renderer.mapcounter = wastemanHalfwayPoint;
		} else if (bossnumber === 1) {
			renderer.mapData = maps[accountingmanHalfwayPoint];
			renderer.mapcounter = accountingmanHalfwayPoint;
		} else if (bossnumber === 2) {
			renderer.mapData = maps[materialmanHalfwayPoint];
			renderer.mapcounter = materialmanHalfwayPoint;
		} else if (bossnumber === 7) {
			renderer.mapData = maps[warehousemanHalfwayPoint];
			renderer.mapcounter = warehousemanHalfwayPoint;
		} else if (bossnumber === 8) {
			renderer.mapData = maps[visionaryManHalfwayPoint];
			renderer.mapcounter = visionaryManHalfwayPoint;
		}
	}
	player = new Player(demoMode, {
		x: 200,
		y: 66
	});
	renderer.initMap();
	watchedElements.push(player);

	tileCollisionDetector = new TileCollisionDetector();

	watchedElements.push(renderer);

	if (mobile) {
		buttonSpriteSheet = new createjs.SpriteSheet({
			"images": [loader.getResult("buttons")],
			"frames": {
				"width": 64,
				"height": 64,
				"count": 4
			},
			"animations": {
				"left": {
					"frames": [0],
					"next": "left"
				},
				"right": {
					"frames": [1],
					"next": "right"
				},
				"shoot": {
					"frames": [2],
					"next": "shoot"
				},
				"pause": {
					"frames": [3],
					"next": "pause"
				}
			}
		});

		leftButtonSprite = new createjs.Sprite(buttonSpriteSheet, "left");
		rightButtonSprite = new createjs.Sprite(buttonSpriteSheet, "right");
		shootButtonSprite = new createjs.Sprite(buttonSpriteSheet, "shoot");
		pauseButtonSprite = new createjs.Sprite(buttonSpriteSheet, "pause");

		leftButtonSprite.x = 16;
		rightButtonSprite.x = 96;
		shootButtonSprite.x = document.getElementById("controlcanvas").width - 64;
		leftButtonSprite.y = gamestage.canvas.height - 64;
		rightButtonSprite.y = gamestage.canvas.height - 64;
		shootButtonSprite.y = gamestage.canvas.height - 64;
		pauseButtonSprite.y = -32;
		pauseButtonSprite.x = 0;
		initTouchControls();
	}

	if (logFPS) {
		fpsLabel = new createjs.Text("", "14px '" + FONT + "'", "#FFF");
		gamestage.addChild(fpsLabel);

		fpsLabel.x = gamestage.canvas.width - 50;
		fpsLabel.y = 18;
	}

	scoreLabel = new createjs.Text("$ ", "10px '" + FONT + "'", "#FFF");
	//gamestage.addChild(scoreLabel);

	scoreLabel.x = gamestage.canvas.width - 256;
	scoreLabel.y = 18;

	createjs.Ticker.addEventListener("tick", handleTick);
	createjs.Ticker.useRAF = true;

	createjs.Ticker.setFPS(60);
}

/**
 * [initTouchControls used to add touch controls to the screen on a mobile canvas]
 * @return {[type]} [description]
 */
function initTouchControls() {
	var controlstage = new createjs.Stage("controlcanvas");
	controlstage.canvas.width = window.innerWidth / gamezoom;
	controlstage.canvas.height = window.innerHeight / gamezoom;
	document.getElementById("controlcanvas").style.zoom = gamezoom;
	document.getElementById("controlcanvas").style.MozTransform = "scale(" + gamezoom + ")";
	document.getElementById("controlcanvas").style.zIndex = "2";
	controlstage.removeChild(leftButtonSprite);
	controlstage.removeChild(rightButtonSprite);
	controlstage.removeChild(shootButtonSprite);
	controlstage.removeChild(pauseButtonSprite);
	controlstage.addChild(leftButtonSprite);
	controlstage.addChild(rightButtonSprite);
	controlstage.addChild(shootButtonSprite);
	controlstage.addChild(pauseButtonSprite);
	controlstage.update();
}

/**
 * [handleTick essentially the main game loop for the entire game]
 * @param  {[type]} event [description]
 * @return {[type]}       [description]
 */
function handleTick(event) {
	itemDropCount++;
	if (itemDropCount === 5) {
		itemDropCount = 0;
	}

	if (!renderer || menuUp || !renderer.doneRendering) {
		return;
	} else if (renderer.transitiondown || renderer.transitionright || renderer.transitionup) {
		renderer.tickActions({});
		gamestage.update();
		return;
	} else if (renderer.showingReadyLabel || player.paused) {
		if (player.dialog) {
			for (var i = 0; i < renderer.objects.length; i++) {
				if (renderer.objects[i].active) {
					renderer.objects[i].tickActions();
					break;
				}
			}
		}
		gamestage.update();
		return;
	}

	var actions = {
		"event": event
	};

	actions.mobile = mobile;
	if (mobile) {

	}

	var modifier = 4;
	var xmodifier = 4;
	var playerCollisionPoints = {
		leftTop: {
			x: player.x + xmodifier,
			y: player.y + modifier + 2
		},
		leftBottom: {
			x: player.x + xmodifier,
			y: player.y + player.animations.spriteSheet._frameHeight - modifier - 2
		},
		bottomLeft: {
			x: player.x + xmodifier + ((player.animations.scaleX === 1) ? -4 : 8),
			y: player.y + player.animations.spriteSheet._frameHeight
		},
		bottomRight: {
			x: player.x + player.animations.spriteSheet._frameWidth - xmodifier - ((player.animations.scaleX === 1) ? 6 : -2),
			y: player.y + player.animations.spriteSheet._frameHeight
		},
		rightBottom: {
			x: player.x + player.animations.spriteSheet._frameWidth - xmodifier,
			y: player.y + player.animations.spriteSheet._frameHeight - modifier - 2
		},
		rightTop: {
			x: player.x + player.animations.spriteSheet._frameWidth - xmodifier,
			y: player.y + modifier + 2
		},
		topRight: {
			x: player.x + player.animations.spriteSheet._frameWidth - xmodifier - ((player.animations.scaleX === 1) ? 9 : 0),
			y: player.y + modifier
		},
		topLeft: {
			x: player.x + xmodifier + ((player.animations.scaleX === 1) ? 0 : 12),
			y: player.y + modifier
		}
	};
	var deathmodifier = 10;
	var xdeathmodifier = 10;
	var playerDeathCollisionPoints = {
		leftTop: {
			x: player.x + xdeathmodifier,
			y: player.y + deathmodifier + 2
		},
		leftBottom: {
			x: player.x + xdeathmodifier,
			y: player.y + player.animations.spriteSheet._frameHeight - deathmodifier - 2
		},
		bottomLeft: {
			x: player.x + xdeathmodifier + ((player.animations.scaleX === 1) ? -4 : 8),
			y: player.y + player.animations.spriteSheet._frameHeight
		},
		bottomRight: {
			x: player.x + player.animations.spriteSheet._frameWidth - xdeathmodifier - ((player.animations.scaleX === 1) ? 6 : -2),
			y: player.y + player.animations.spriteSheet._frameHeight
		},
		rightBottom: {
			x: player.x + player.animations.spriteSheet._frameWidth - xdeathmodifier,
			y: player.y + player.animations.spriteSheet._frameHeight - deathmodifier - 2
		},
		rightTop: {
			x: player.x + player.animations.spriteSheet._frameWidth - xdeathmodifier,
			y: player.y + deathmodifier + 2
		},
		topRight: {
			x: player.x + player.animations.spriteSheet._frameWidth - xdeathmodifier - ((player.animations.scaleX === 1) ? 9 : 0),
			y: player.y + deathmodifier
		},
		topLeft: {
			x: player.x + xdeathmodifier + ((player.animations.scaleX === 1) ? 0 : 12),
			y: player.y + deathmodifier
		}
	};

	actions.collisionResults = tileCollisionDetector.checkCollisions(playerCollisionPoints, renderer.collisionArray, renderer.getCurrentHeightOffset(), (renderer.widthOffset + renderer.completedMapsWidthOffset));
	actions.deathCollisionResults = tileCollisionDetector.checkCollisions(playerDeathCollisionPoints, renderer.deathCollisionArray, renderer.getCurrentHeightOffset(), (renderer.widthOffset + renderer.completedMapsWidthOffset));

	this.renderer.enemies.forEach(function(element) {
		element.tickActions(actions);
	});
	this.renderer.objects.forEach(function(element) {
		element.tickActions(actions);
	});

	//  { leftmove : true, downmove : true, rightmove : true, upmove : true, nextmap : false }
	if ((((!actions.deathCollisionResults.leftmove || !actions.deathCollisionResults.leftmove || !actions.deathCollisionResults.upmove || !actions.deathCollisionResults.downmove) && !actions.deathCollisionResults.nextmap) || player.health <= 0) && !dead) {
		dead = true;
		actions.playerDeath = true;
		lives--;
		new Death(renderer.enemyContainer, player.x + 12, player.y + 16);
		player.gamestage.removeChild(player.animations);

		if (lives < 0) {
			setTimeout(function() {
				initVars();
				initBossScreen();
				event.remove();
			}.bind(this), 4000);

		} else {
			setTimeout(function() {
				initVars();
				beginGame(false);
				event.remove();
			}.bind(this), 4000);

		}
		//init();
	}

	watchedElements.forEach(function(element) {
		element.tickActions(actions);
	});

	if (isDemo && demoEnded) {
		event.remove();
		isDemo = false;
	}

	if (logFPS) {
		fpsLabel.text = Math.round(createjs.Ticker.getMeasuredFPS()) + " / " + Math.round(createjs.Ticker.getFPS());
	}
	scoreLabel.text = "$ " + score;

	gamestage.update();
}

// execute on load:
gamestage = new createjs.Stage("gamecanvas");
gamestage.clear();
gamestage.snapToPixelEnabled = true;

zoomAmount = (window.innerHeight / 240 > window.innerHeight / 256) ? window.innerHeight / 240 : window.innerHeight / 256;
gamestage.canvas.height = 240;
gamestage.canvas.width = 256;
document.getElementById("gamecanvas").style.zoom = zoomAmount;
document.getElementById("gamecanvas").style.MozTransform = "scale(" + zoomAmount + ")";
document.getElementById("gamecanvas").style.left = ((window.innerWidth / zoomAmount - document.getElementById("gamecanvas").width) / 2) + "px";

executivemanLoadingText.x = (gamestage.canvas.width / 2) - 90;
executivemanLoadingText.y = 100;
gamestage.addChild(executivemanLoadingText);

if (window.mobilecheck()) {
	mobile = true;
}
