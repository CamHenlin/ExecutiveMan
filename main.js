var stage;
var watchedElements;
var player;
var mapper;
var tileCollisionDetector;
var enemies = [];
var basicCollision;

function init() {
	stage = new createjs.Stage("gamecanvas");
	stage.snapToPixelEnabled = true;
	stage.canvas.width = 1136;
	stage.canvas.height = 640;
	stage.canvas.style.backgroundColor = "#000";

	//var bg = new createjs.Bitmap("images/city.png")
	//stage.addChild(bg);
	watchedElements = [];
	mapper = new Mapper(stage);
	mapper.initLayers();
	player = new Player(stage, mapper.heightOffset, mapper.widthOffset);

	tileCollisionDetector = new TileCollisionDetector();
	basicCollision = new BasicCollision(mapper);

	enemies.push(new PrinterGuy(stage, player, basicCollision, 400, 100));
	enemies.push(new PrinterGuy(stage, player, basicCollision, 700, 0));

	watchedElements.push(player);
	watchedElements.push(enemies[0]);
	watchedElements.push(enemies[1]);

	createjs.Ticker.addEventListener("tick", handleTick);
	createjs.Ticker.useRAF = true;
	createjs.Ticker.setFPS(60);
}

function handleTick(event) {

	var actions = {};

	var modifier = 8;
	var xmodifier = 12;
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
	actions.collisionResults = tileCollisionDetector.checkCollisions(playerCollisionPoints, mapper.collisionArray, mapper.heightOffset, mapper.widthOffset);

	watchedElements.forEach(function(element) {
		element.tickActions(actions);
	});

	stage.update();
}

init();