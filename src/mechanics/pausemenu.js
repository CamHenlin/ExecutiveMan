
/**
 * [PauseMenu description]
 */
function PauseMenu() {
	document.getElementById("controlcanvas").style.zIndex = "0";
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

	this.setPostItBlasterTouchTarget = new createjs.Shape();
	this.setPostItBlasterTouchTarget.graphics.beginFill("#0000FF").drawRect(gamestage.canvas.width / 2 + 5, gamestage.canvas.height - 48, 80, 16);
	this.setPostItBlasterTouchTarget.x = 128;
	this.setPostItBlasterTouchTarget.y = 64;
	this.setPostItBlasterTouchTarget.spriteSheet = {};
	this.setPostItBlasterTouchTarget.spriteSheet._frameHeight = 16;
	this.setPostItBlasterTouchTarget.spriteSheet._frameWidth = 80;

	this.setStingingAuditTouchTarget = new createjs.Shape();
	this.setStingingAuditTouchTarget.graphics.beginFill("#0000FF").drawRect(gamestage.canvas.width / 2 + 5, gamestage.canvas.height - 48, 80, 16);
	this.setStingingAuditTouchTarget.x = gamestage.canvas.width - 160;
	this.setStingingAuditTouchTarget.y = 64;
	this.setStingingAuditTouchTarget.spriteSheet = {};
	this.setStingingAuditTouchTarget.spriteSheet._frameHeight = 16;
	this.setStingingAuditTouchTarget.spriteSheet._frameWidth = 80;

	this.postItBlasterLabel = new createjs.Text("POST IT BLASTER", "8px '" + FONT + "'", "#FFF");
	this.stingingAuditLabel = new createjs.Text("STINGING AUDIT", "8px '" + FONT + "'", "#FFF");

	this.postItBlasterLabel.x = 64;
	this.stingingAuditLabel.x = gamestage.canvas.width - 160;

	this.postItBlasterLabel.y = 64;
	this.stingingAuditLabel.y = 64;

	this.setToxicProjectileTouchTarget = new createjs.Shape();
	this.setToxicProjectileTouchTarget.graphics.beginFill("#0000FF").drawRect(gamestage.canvas.width / 2 + 5, gamestage.canvas.height - 48, 80, 16);
	this.setToxicProjectileTouchTarget.x = 128;
	this.setToxicProjectileTouchTarget.y = 80;
	this.setToxicProjectileTouchTarget.spriteSheet = {};
	this.setToxicProjectileTouchTarget.spriteSheet._frameHeight = 16;
	this.setToxicProjectileTouchTarget.spriteSheet._frameWidth = 80;

	this.setOreTossTouchTarget = new createjs.Shape();
	this.setOreTossTouchTarget.graphics.beginFill("#0000FF").drawRect(gamestage.canvas.width / 2 + 5, gamestage.canvas.height - 48, 80, 16);
	this.setOreTossTouchTarget.x = gamestage.canvas.width - 160;
	this.setOreTossTouchTarget.y = 80;
	this.setOreTossTouchTarget.spriteSheet = {};
	this.setOreTossTouchTarget.spriteSheet._frameHeight = 16;
	this.setOreTossTouchTarget.spriteSheet._frameWidth = 80;

	this.toxicProjectileLabel = new createjs.Text("TOXIC PROJECTILE", "8px '" + FONT + "'", "#FFF");
	this.oreTossLabel = new createjs.Text("ORE TOSS", "8px '" + FONT + "'", "#FFF");

	this.toxicProjectileLabel.x = 64;
	this.oreTossLabel.x = gamestage.canvas.width - 160;

	this.toxicProjectileLabel.y = 80;
	this.oreTossLabel.y = 80;

	var executivemanLabel = new createjs.Text("EXECUTIVE MAN", "7px '" + FONT + "'", "#FFF");
	var executivemanLabel2 = new createjs.Text("EXECUTIVE MAN", "7px '" + FONT + "'", "#000");
	var exitStageLabel = new createjs.Text("EXIT STAGE", "7px '" + FONT + "'", "#FFF");
	var livesLabel = new createjs.Text("", "8px '" + FONT + "'", "#FFF");

	var healthBriefCasesLabel = new createjs.Text("", "8px '" + FONT + "'", "#FFF");


	var extraLifeSpriteSheet = new createjs.SpriteSheet({
		"images": [loader.getResult("extralife")],
		"frames": {
			"width": 12,
			"height": 13,
			"count": 1
		},
		"animations": {
			"shot": {
				"frames": [0],
				"next": "still"
			}
		}
	});

	var extraLifeSprite = new createjs.Sprite(extraLifeSpriteSheet, "still");

	var healthBriefCaseSpriteSheet = new createjs.SpriteSheet({
		"images": [loader.getResult("healthbriefcase")],
		"frames": {
			"width": 12,
			"height": 13,
			"count": 2
		},
		"animations": {
			"still": {
				"frames": [0, 1],
				"next": "still",
				"speed": 0.05
			}
		}
	});
	var healthBriefCasesSprite = new createjs.Sprite(healthBriefCaseSpriteSheet, "still");

	executivemanLabel.x = gamestage.canvas.width / 2 - 30;
	executivemanLabel.y = 38;
	executivemanLabel2.x = gamestage.canvas.width / 2 - 29;
	executivemanLabel2.y = 39;
	exitStageLabel.x = gamestage.canvas.width / 2 + 8;
	exitStageLabel.y = gamestage.canvas.height - 44;
	livesLabel.x = 64;
	livesLabel.y = gamestage.canvas.height - 46;
	extraLifeSprite.x = 42;
	extraLifeSprite.y = gamestage.canvas.height - 49;

	healthBriefCasesLabel.x = 64;
	healthBriefCasesLabel.y = gamestage.canvas.height - 60;
	healthBriefCasesSprite.x = 42;
	healthBriefCasesSprite.y = gamestage.canvas.height - 65;
//	this.healthBriefCasesTouchTarget = buildTouchTarget(healthBriefCasesLabel);

	pausestage.addChild(shape);
	pausestage.addChild(this.setPostItBlasterTouchTarget);
	pausestage.addChild(this.setStingingAuditTouchTarget);
	pausestage.addChild(this.postItBlasterLabel);
	pausestage.addChild(this.stingingAuditLabel);
	pausestage.addChild(this.setToxicProjectileTouchTarget);
	pausestage.addChild(this.setOreTossTouchTarget);
	pausestage.addChild(this.toxicProjectileLabel);
	pausestage.addChild(this.oreTossLabel);
	pausestage.addChild(executivemanLabel2);
	pausestage.addChild(executivemanLabel);
	pausestage.addChild(this.exitStageTouchTarget);
	pausestage.addChild(exitStageLabel);
	pausestage.addChild(livesLabel);
	pausestage.addChild(extraLifeSprite);
	pausestage.addChild(healthBriefCasesLabel);
	pausestage.addChild(healthBriefCasesSprite);
	pausestage.addChild(divider);

	/**
	 * [remove description]
	 * @return {[type]} [description]
	 */
	this.remove = function() {
		pauseUp = false;
		playSound("pauseclose");
		gamestage.removeChild(pausestage);
		initTouchControls();
	};

	/**
	 * [show description]
	 * @return {[type]} [description]
	 */
	this.show = function() {
		pauseUp = true;
		playSound("pauseopen");

		document.addEventListener("click", pauseClickHandler.bind(this), false);

		livesLabel.text = lives;
		healthBriefCasesLabel.text = healthBriefCases;
		gamestage.addChild(pausestage);
	};
}

/**
 * [handlePauseScreenTick description]
 * @param  {[type]} event [description]
 * @return {[type]}       [description]
 */
function handlePauseScreenTick(event) {
	if (startgame) {
		initVars();
		initBossScreen();
		event.remove();
	}
	gamestage.update();
}

/**
 * [pauseClickHandler description]
 * @param  {[type]} event [description]
 * @return {[type]}       [description]
 */
function pauseClickHandler(event) {
	if (!pauseUp) {
		return;
	}

	if (clicked) {
		return;
	}

	clicked = true;
	setTimeout(function() {
		clicked = false;
	}, 250);

	var touchEventSpriteSheet = new createjs.SpriteSheet({
		"images": ["images/businessmanspritesheet.png"],
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

	if (fastCollisionSprite(this.exitStageTouchTarget, touchSprite)) {
		lives = -1;
		player.health = 0;
		player.paused = false;
		player.pauseMenu.remove();
		event.target.removeEventListener(event.type, arguments.callee, false);
	}
	if (fastCollisionSprite(this.healthBriefCasesTouchTarget, touchSprite)) {
		if (healthBriefCases > 0) {
			healthBriefCases--;
			player.health = 28;
			this.remove();
			this.show();
		}
	} else if (fastCollisionSprite(this.setPostItBlasterTouchTarget, touchSprite)) {
		player.changeWeapon("postit");
		this.remove();
		this.show();
		event.target.removeEventListener(event.type, arguments.callee, false);
	} else if (fastCollisionSprite(this.setStingingAuditTouchTarget, touchSprite)) {
		player.changeWeapon("stingingaudit");
		this.remove();
		this.show();
		event.target.removeEventListener(event.type, arguments.callee, false);
	} else if (fastCollisionSprite(this.setToxicProjectileTouchTarget, touchSprite)) {
		player.changeWeapon("toxicprojectile");
		this.remove();
		this.show();
		event.target.removeEventListener(event.type, arguments.callee, false);
	} else if (fastCollisionSprite(this.setOreTossTouchTarget, touchSprite)) {
		player.changeWeapon("oretoss");
		this.remove();
		this.show();
		event.target.removeEventListener(event.type, arguments.callee, false);
	}
}