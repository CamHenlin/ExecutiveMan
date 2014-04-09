var stage;
var watchedElements;
var player;


function init() {
	stage = new createjs.Stage("gamecanvas");
	stage.canvas.width = 1136;
	stage.canvas.height = 640;

	watchedElements = [];
	player = new Player(stage);

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

	watchedElements.forEach(function(element) {
		element.tickActions(actions);
	});

	stage.update();
}

init();