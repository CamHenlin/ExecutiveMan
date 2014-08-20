var optionsUp = false;
function OptionsMenu() {
	pauseUp = false;
	pausestage = new createjs.Container();

	var shape = new createjs.Shape();
    shape.graphics.beginFill("#0000FF").drawRect(32, 32, gamestage.canvas.width - 64, gamestage.canvas.height - 64);

	var divider = new createjs.Shape();
    divider.graphics.beginFill("#6699FF").drawRect(34, gamestage.canvas.height - 96, gamestage.canvas.width - 68, 3);
	this.exitStageTouchTarget = new createjs.Shape();
    this.exitStageTouchTarget.graphics.beginFill("#0000FF").drawRect(gamestage.canvas.width / 2 + 5, gamestage.canvas.height - 48, 80, 16);
    this.exitStageTouchTarget.x = gamestage.canvas.width / 2 + 5;
    this.exitStageTouchTarget.y = gamestage.canvas.height - 48;
    this.exitStageTouchTarget.spriteSheet = {};
    this.exitStageTouchTarget.spriteSheet._frameHeight = 16;
    this.exitStageTouchTarget.spriteSheet._frameWidth = 80;

	var executivemanLabel = new createjs.Text("EXECUTIVE MAN", "bold 7px Arial", "#FFF");
	var executivemanLabel2 = new createjs.Text("EXECUTIVE MAN", "bold 7px Arial", "#000");
	var livesLabel = new createjs.Text("", "bold 8px Arial", "#FFF");

	var healthBriefCasesLabel = new createjs.Text("", "bold 8px Arial", "#FFF");


	executivemanLabel.x = gamestage.canvas.width / 2 - 30;
	executivemanLabel.y = 38;
	executivemanLabel2.x = gamestage.canvas.width / 2 - 29;
	executivemanLabel2.y = 39;

    pausestage.addChild(shape);
    pausestage.addChild(executivemanLabel2);
    pausestage.addChild(executivemanLabel);
    pausestage.addChild(divider);

    this.remove = function() {
		optionsUp = false;
        playSound("pauseclose");
		gamestage.removeChild(pausestage);
    };

    this.show = function() {
		optionsUp = true;
		playSound("pauseopen");

		document.addEventListener('click', pauseClickHandler.bind(this), false);

		livesLabel.text = lives;
		healthBriefCasesLabel.text = healthBriefCases;
		gamestage.addChild(pausestage);
    };
}

function handlePauseScreenTick(event) {
	if (startgame) {
		initVars();
		initBossScreen();
		event.remove();
	}
	gamestage.update();
}

function pauseClickHandler(event) {
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