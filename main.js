var stage;
var gamestage;
var watchedElements;
var player;
var mapper;
var tileCollisionDetector;
var enemies = [];
var basicCollision;

function init() {
	stage = new createjs.Container();
	gamestage = new createjs.Stage("gamecanvas");
	gamestage.snapToPixelEnabled = true;
	gamestage.canvas.width = 1136;
	gamestage.canvas.height = 640;
	gamestage.canvas.style.backgroundColor = "#000";
	gamestage.addChild(stage);

	//var bg = new createjs.Bitmap("images/city.png")
	//stage.addChild(bg);
	watchedElements = [];
	mapper = new Mapper(stage, gamestage);
	mapper.initLayers();
	player = new Player(stage, mapper.heightOffset, mapper.widthOffset, mapper, gamestage);

	tileCollisionDetector = new TileCollisionDetector();
	basicCollision = new BasicCollision(mapper);

	enemies.push(new PrinterGuy(stage, player, basicCollision, 400, 100));
	enemies.push(new PrinterGuy(stage, player, basicCollision, 200, 100));

	watchedElements.push(mapper);
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
	actions.collisionResults = tileCollisionDetector.checkCollisions(playerCollisionPoints, mapper.collisionArray, mapper.getCurrentHeightOffset(), mapper.widthOffset);

	watchedElements.forEach(function(element) {
		element.tickActions(actions);
	});

	gamestage.update();
}

init();