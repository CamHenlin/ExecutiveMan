var stage;
var watchedElements;
var player;
var mapper;
var tileCollisionDetector;

function init() {
	stage = new createjs.Stage("gamecanvas");
	stage.snapToPixelEnabled = true;
	stage.canvas.width = 1136;
	stage.canvas.height = 640;

	watchedElements = [];
	player = new Player(stage);
	mapper = new Mapper(stage);
	mapper.initLayers();

	tileCollisionDetector = new TileCollisionDetector();

	watchedElements.push(player);

	createjs.Ticker.addEventListener("tick", handleTick);
	createjs.Ticker.useRAF = true;
	createjs.Ticker.setFPS(60);
}

function handleTick(event) {

	var actions = {};

	actions.playerJump = false;
	actions.playerAttack = false;
	actions.playerLeft= false;
	actions.playerRight = false;

	if (key.isPressed('space')) {
		actions.playerJump = true;
	}

	if (key.isPressed('c')) {
		actions.playerAttack = true;
	}

	if (key.isPressed('left')) {
		actions.playerLeft = true;
	}

	if (key.isPressed('right')) {
		actions.playerRight = true;
	}


	var modifier = 8;
	var playerCollisionPoints = {
		leftTop : { x: player.x, y: player.y + modifier },
		leftBottom : { x: player.x, y: player.y + player.animations.spriteSheet._frameHeight - modifier },
		bottomLeft : { x: player.x + modifier, y: player.y + player.animations.spriteSheet._frameHeight  },
		bottomRight : { x: player.x + player.animations.spriteSheet._frameWidth - modifier, y: player.y + player.animations.spriteSheet._frameHeight },
		rightBottom : { x: player.x + player.animations.spriteSheet._frameWidth, y: player.y + player.animations.spriteSheet._frameHeight - modifier },
		rightTop : { x: player.x + player.animations.spriteSheet._frameWidth, y: player.y - modifier },
		topRight : { x: player.x + player.animations.spriteSheet._frameWidth - modifier, y: player.y },
		topLeft : { x: player.x + modifier, y: player.y }
	};
	actions.collisionResults = tileCollisionDetector.checkCollisions(playerCollisionPoints, mapper.collisionArray);
	watchedElements.forEach(function(element) {
		element.tickActions(actions);
	});

	stage.update();
}

init();