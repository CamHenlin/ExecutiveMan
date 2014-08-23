var optionsUp = false;
function OptionsMenu() {
	optionsUp = false;
	optionsstage = new createjs.Container();

	var shape = new createjs.Shape();
    shape.graphics.beginFill("#0000FF").drawRect(32, 32, gamestage.canvas.width - 64, gamestage.canvas.height - 64);

	var divider = new createjs.Shape();
    divider.graphics.beginFill("#6699FF").drawRect(34, gamestage.canvas.height - 96, gamestage.canvas.width - 68, 3);
	this.setLeftButtonTouchTarget = new createjs.Shape();
    this.setLeftButtonTouchTarget.graphics.beginFill("#0000FF").drawRect(gamestage.canvas.width / 2 + 5, gamestage.canvas.height - 48, 80, 16);
    this.setLeftButtonTouchTarget.x = gamestage.canvas.width / 2 + 5;
    this.setLeftButtonTouchTarget.y = gamestage.canvas.height - 48;
    this.setLeftButtonTouchTarget.spriteSheet = {};
    this.setLeftButtonTouchTarget.spriteSheet._frameHeight = 16;
    this.setLeftButtonTouchTarget.spriteSheet._frameWidth = 80;

    this.setRightButtonTouchTarget = new createjs.Shape();
    this.setRightButtonTouchTarget.graphics.beginFill("#0000FF").drawRect(gamestage.canvas.width / 2 + 5, gamestage.canvas.height - 48, 80, 16);
    this.setRightButtonTouchTarget.x = gamestage.canvas.width / 2 + 5;
    this.setRightButtonTouchTarget.y = gamestage.canvas.height - 48;
    this.setRightButtonTouchTarget.spriteSheet = {};
    this.setRightButtonTouchTarget.spriteSheet._frameHeight = 16;
    this.setRightButtonTouchTarget.spriteSheet._frameWidth = 80;

    this.setJumpButtonTouchTarget = new createjs.Shape();
    this.setJumpButtonTouchTarget.graphics.beginFill("#0000FF").drawRect(gamestage.canvas.width / 2 + 5, gamestage.canvas.height - 48, 80, 16);
    this.setJumpButtonTouchTarget.x = gamestage.canvas.width / 2 + 5;
    this.setJumpButtonTouchTarget.y = gamestage.canvas.height - 48;
    this.setJumpButtonTouchTarget.spriteSheet = {};
    this.setJumpButtonTouchTarget.spriteSheet._frameHeight = 16;
    this.setJumpButtonTouchTarget.spriteSheet._frameWidth = 80;

    this.setShootButtonTouchTarget = new createjs.Shape();
    this.setShootButtonTouchTarget.graphics.beginFill("#0000FF").drawRect(gamestage.canvas.width / 2 + 5, gamestage.canvas.height - 48, 80, 16);
    this.setShootButtonTouchTarget.x = gamestage.canvas.width / 2 + 5;
    this.setShootButtonTouchTarget.y = gamestage.canvas.height - 48;
    this.setShootButtonTouchTarget.spriteSheet = {};
    this.setShootButtonTouchTarget.spriteSheet._frameHeight = 16;
    this.setShootButtonTouchTarget.spriteSheet._frameWidth = 80;

    this.setPauseButtonTouchTarget = new createjs.Shape();
    this.setPauseButtonTouchTarget.graphics.beginFill("#0000FF").drawRect(gamestage.canvas.width / 2 + 5, gamestage.canvas.height - 48, 80, 16);
    this.setPauseButtonTouchTarget.x = gamestage.canvas.width / 2 + 5;
    this.setPauseButtonTouchTarget.y = gamestage.canvas.height - 48;
    this.setPauseButtonTouchTarget.spriteSheet = {};
    this.setPauseButtonTouchTarget.spriteSheet._frameHeight = 16;
    this.setPauseButtonTouchTarget.spriteSheet._frameWidth = 80;

	var executivemanLabel = new createjs.Text("EXECUTIVE MAN", "bold 7px Arial", "#FFF");
	var executivemanLabel2 = new createjs.Text("EXECUTIVE MAN", "bold 7px Arial", "#000");
	var leftLabel = new createjs.Text("LEFT BUTTON", "bold 8px Arial", "#FFF");
	var leftSelected = new createjs.Text("LEFT ARROW", "bold 8px Arial", "#FFF");
	var rightLabel = new createjs.Text("RIGHT BUTTON", "bold 8px Arial", "#FFF");
	var rightSelected =  new createjs.Text("RIGHT ARROW", "bold 8px Arial", "#FFF");
	var jumpLabel =  new createjs.Text("JUMP BUTTON", "bold 8px Arial", "#FFF");
	var jumpSelected =  new createjs.Text("SPACE", "bold 8px Arial", "#FFF");
	var shootLabel =  new createjs.Text("SHOOT BUTTON", "bold 8px Arial", "#FFF");
	var shootSelected =  new createjs.Text("C", "bold 8px Arial", "#FFF");
	var pauseLabel =  new createjs.Text("PAUSE BUTTON", "bold 8px Arial", "#FFF");
	var pauseSelected =  new createjs.Text("P", "bold 8px Arial", "#FFF");

	executivemanLabel.x = gamestage.canvas.width / 2 - 30;
	executivemanLabel.y = 38;
	executivemanLabel2.x = gamestage.canvas.width / 2 - 29;
	executivemanLabel2.y = 39;

	leftLabel.x = 64;
	leftSelected.x = 64;
	rightLabel.x = 64;
	rightSelected.x = 64;
	jumpLabel.x = 64;
	jumpSelected.x = 64;
	shootLabel.x = 64;
	shootSelected.x = 64;
	pauseLabel.x = 128;
	pauseSelected.x = 160;
	leftLabel.y = 128;
	leftSelected.y = 160;
	rightLabel.y = 192;
	rightSelected.y = 224;
	jumpLabel.y = 256;
	jumpSelected.y = 288;
	shootLabel.y = 320;
	shootSelected.y = 352;
	pauseLabel.y = 384;
	pauseSelected.y = 416;

    optionsstage.addChild(shape);
    optionsstage.addChild(executivemanLabel2);
    optionsstage.addChild(executivemanLabel);
    optionsstage.addChild(divider);
	optionsstage.addChild(leftLabel);
	optionsstage.addChild(leftSelected);
	optionsstage.addChild(rightLabel);
	optionsstage.addChild(rightSelected);
	optionsstage.addChild(jumpLabel);
	optionsstage.addChild(jumpSelected);
	optionsstage.addChild(shootLabel );
	optionsstage.addChild(shootSelected);
	optionsstage.addChild(pauseLabel);
	optionsstage.addChild(pauseSelected);

    this.remove = function() {
		optionsUp = false;
        playSound("pauseclose");
		gamestage.removeChild(optionsstage);
    };

    this.show = function() {
		optionsUp = true;
		playSound("pauseopen");

		document.addEventListener('click', optionsClickHandler.bind(this), false);

		gamestage.addChild(optionsstage);
    };
}

function handleOptionsScreenTick(event) {
	if (startgame) {
		initVars();
		initBossScreen();
		event.remove();
	}
	gamestage.update();
}

function optionsClickHandler(event) {
	if (!pauseUp) {
		return;
	}

	if (clicked) {
		return;
	}

	clicked = true;
	setTimeout(function() { clicked = false; }, 250);

	var touchEventSpriteSheet = new createjs.SpriteSheet({
        "images": ["images/businessmanspritesheet.png"],
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

    touchSprite.x = event.clientX / gamezoom;
    touchSprite.y = event.clientY / gamezoom;
/*    if (fastCollisionSprite(this.exitStageTouchTarget, touchSprite)) {
		lives = -1;
		player.health = 0;
		player.paused = false;
		player.pauseMenu.remove();
		event.target.removeEventListener(event.type, arguments.callee, false);
    } if (fastCollisionSprite(this.healthBriefCasesTouchTarget, touchSprite)) {
	if (healthBriefCases > 0) {
		healthBriefCases--;
		player.health = 28;
		this.remove();
		this.show();
	}*/
}