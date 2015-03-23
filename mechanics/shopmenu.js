var shopUp = false;

/**
 * [ShopMenu description]
 */
function ShopMenu() {
	shopUp = false;
	shopstage = new createjs.Container();

	var shape = new createjs.Shape();
	shape.graphics.beginFill("#3366FF").drawRect(32, 32, gamestage.canvas.width - 64, gamestage.canvas.height - 64);
	var shape2 = new createjs.Shape();
	shape2.graphics.beginFill("#000").drawRect(34, 34, gamestage.canvas.width - 64, gamestage.canvas.height - 64);

	var divider = new createjs.Shape();
	divider.graphics.beginFill("#5577FF").drawRect(34, gamestage.canvas.height - 64, gamestage.canvas.width - 68, 3);
	this.exitShopTouchTarget = new createjs.Shape();
	this.exitShopTouchTarget.graphics.beginFill("#0000FF").drawRect(gamestage.canvas.width / 2 + 5, gamestage.canvas.height - 48, 80, 16);
	this.exitShopTouchTarget.x = gamestage.canvas.width / 2 + 5;
	this.exitShopTouchTarget.y = gamestage.canvas.height - 48;
	this.exitShopTouchTarget.spriteSheet = {};
	this.exitShopTouchTarget.spriteSheet._frameHeight = 16;
	this.exitShopTouchTarget.spriteSheet._frameWidth = 80;

	var executivemanLabel = new createjs.Text("SHOP", "7px '8-Bit Madness'", "#FFF");
	var executivemanLabel2 = new createjs.Text("SHOP", "7px '8-Bit Madness'", "#000");
	var exitShopLabel = new createjs.Text("EXIT SHOP", "7px '8-Bit Madness'", "#FFF");
	var livesLabel = new createjs.Text("", "8px '8-Bit Madness'", "#FFF");
	var cashLabel = new createjs.Text("", "10px '8-Bit Madness'", "#FFF");

	// things to buy:
	var cashDoubler = new createjs.Text("", "10px '8-Bit Madness'", "#FFF");
	var fourExtraLives = new createjs.Text("", "10px '8-Bit Madness'", "#FFF");
	var doubleJump = new createjs.Text("", "10px '8-Bit Madness'", "#FFF");
	var doubleDamage = new createjs.Text("", "10px '8-Bit Madness'", "#FFF");
	var doubleHealth = new createjs.Text("", "10px '8-Bit Madness'", "#FFF");
	var healthBriefCase = new createjs.Text("", "10px '8-Bit Madness'", "#FFF");

	this.cashDoublerCost = 150000;
	this.fourExtraLivesCost = 5000;
	this.doubleJumpCost = 50000;
	this.doubleDamageCost = 100000;
	this.doubleHealthCost = 75000;
	this.healthBriefCaseCost = 10000;

	cashDoubler.x = 42;
	fourExtraLives.x = 42;
	doubleHealth.x = 42;
	healthBriefCase.x = gamestage.canvas.width / 2 + 8;
	doubleJump.x = gamestage.canvas.width / 2 + 8;
	doubleDamage.x = gamestage.canvas.width / 2 + 8;

	cashDoubler.y = 64;
	fourExtraLives.y = 128;
	doubleJump.y = 64;
	doubleDamage.y = 96;
	doubleHealth.y = 96;
	healthBriefCase.y = 128;

	this.cashDoublerTouchTarget = buildTouchTarget(cashDoubler);
	this.fourExtraLivesTouchTarget = buildTouchTarget(fourExtraLives);
	this.doubleJumpTouchTarget = buildTouchTarget(doubleJump);
	this.doubleDamageTouchTarget = buildTouchTarget(doubleDamage);
	this.doubleHealthTouchTarget = buildTouchTarget(doubleHealth);
	this.healthBriefCaseTouchTarget = buildTouchTarget(healthBriefCase);


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

	executivemanLabel.x = gamestage.canvas.width / 2 - 5;
	executivemanLabel.y = 38;
	executivemanLabel2.x = gamestage.canvas.width / 2 - 4;
	executivemanLabel2.y = 39;
	exitShopLabel.x = gamestage.canvas.width / 2 + 8;
	exitShopLabel.y = gamestage.canvas.height - 42;
	livesLabel.x = 64;
	livesLabel.y = gamestage.canvas.height - 44;
	cashLabel.x = 82;
	cashLabel.y = gamestage.canvas.height - 46;
	extraLifeSprite.x = 42;
	extraLifeSprite.y = gamestage.canvas.height - 49;
	shopstage.addChild(shape2);
	shopstage.addChild(shape);
	shopstage.addChild(executivemanLabel2);
	shopstage.addChild(executivemanLabel);
	shopstage.addChild(this.exitShopTouchTarget);
	shopstage.addChild(exitShopLabel);
	shopstage.addChild(livesLabel);
	shopstage.addChild(cashLabel);
	shopstage.addChild(cashDoubler);
	shopstage.addChild(fourExtraLives);
	shopstage.addChild(doubleJump);
	shopstage.addChild(doubleDamage);
	shopstage.addChild(doubleHealth);
	shopstage.addChild(healthBriefCase);
	shopstage.addChild(extraLifeSprite);
	shopstage.addChild(divider);

	/**
	 * [remove description]
	 * @return {[type]} [description]
	 */
	this.remove = function() {
		shopUp = false;
		playSound("pauseclose");
		document.removeEventListener('click', shopClickHandler, false);
		gamestage.removeChild(shopstage);
	};

	/**
	 * [show description]
	 * @return {[type]} [description]
	 */
	this.show = function() {

		clicked = true;
		setTimeout(function() {
			clicked = false;
		}, 250);
		shopUp = true;
		playSound("pauseopen");

		setTimeout(function() {
			document.addEventListener('click', shopClickHandler.bind(this), false);
		}.bind(this), 250);


		livesLabel.text = lives;
		cashLabel.text = "$" + score;
		cashDoubler.text = "DOUBLE CASH\n" + this.cashDoublerCost;
		fourExtraLives.text = "4 EXTRA LIVES\n" + this.fourExtraLivesCost;
		doubleDamage.text = "DOUBLE DAMAGE\n" + this.doubleDamageCost;
		doubleJump.text = "DOUBLE JUMP\n" + this.doubleJumpCost;
		doubleHealth.text = "DOUBLE HEALTH\n" + this.doubleHealthCost;
		healthBriefCase.text = "HEALTH BRIEFCASE\n" + this.healthBriefCaseCost;
		gamestage.addChild(shopstage);
	};
}

/**
 * [buildTouchTarget description]
 * @param  {[type]} text [description]
 * @return {[type]}      [description]
 */
function buildTouchTarget(text) {
	var touchTarget = {};
	touchTarget.x = text.x - 5;
	touchTarget.y = text.y - 3;
	touchTarget.spriteSheet = {};
	touchTarget.spriteSheet._frameHeight = 16;
	touchTarget.spriteSheet._frameWidth = 80;
	return touchTarget;
}

/**
 * [shopClickHandler description]
 * @param  {[type]} event [description]
 * @return {[type]}       [description]
 */
function shopClickHandler(event) {
	if (!shopUp) {
		return;
	}

	if (clicked) {
		return;
	}

	clicked = true;
	setTimeout(function() {
		clicked = false;
	}, 250);

	console.log(event);
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

	/*
	this.cashDoublerTouchTarget = bo
	this.fourExtraLivesTouchTarget =
	this.doubleJumpTouchTarget = bou
	this.doubleDamageTouchTarget = b
	this.doubleHealthTouchTarget = b
	this.healthBriefCaseTouchTarget
	 */


	touchSprite.x = ((event.pageX || touch.pageX)) / gamezoom - document.getElementById('gamecanvas').offsetLeft;
	touchSprite.y = (event.pageY || touch.pageY) / gamezoom;

	if (fastCollisionSprite(this.exitShopTouchTarget, touchSprite)) {
		this.remove();
		event.target.removeEventListener(event.type, arguments.callee, false);
	} else if (fastCollisionSprite(this.cashDoublerTouchTarget, touchSprite)) {
		if (score >= this.cashDoublerCost) {
			score -= this.cashDoublerCost;
			this.cashDoublerCost = this.cashDoublerCost * 2;
			if (scoreModifier === 1) {
				scoreModifier = 2;
			} else {
				scoreModifier = scoreModifier * 2;
			}
			this.remove();
			this.show();
		} else {
			playSound("error");
		}
	} else if (fastCollisionSprite(this.fourExtraLivesTouchTarget, touchSprite)) {
		if (score >= this.fourExtraLivesCost) {
			score -= this.fourExtraLivesCost;
			lives += 4;
			this.remove();
			this.show();
		} else {
			playSound("error");
		}
	} else if (fastCollisionSprite(this.doubleJumpTouchTarget, touchSprite)) {
		if (score >= this.doubleJumpCost) {
			score -= this.doubleJumpCost;
			this.doubleJumpCost = this.doubleJumpCost * 2;
			doubleJump = true;
			this.remove();
			this.show();
		} else {
			playSound("error");
		}
	} else if (fastCollisionSprite(this.doubleDamageTouchTarget, touchSprite)) {
		if (score >= this.doubleDamageCost) {
			score -= this.doubleDamageCost;
			this.doubleDamageCost = this.doubleDamageCost * 2;
			if (damageModifier === 1) {
				damageModifier = 2;
			} else {
				damageModifier = damageModifier * 2;
			}
			this.remove();
			this.show();
		} else {
			playSound("error");
		}
	} else if (fastCollisionSprite(this.healthBriefCaseTouchTarget, touchSprite)) {
		if (score >= this.healthBriefCaseCost) {
			score -= this.healthBriefCaseCost;
			this.healthBriefCaseCost = this.healthBriefCaseCost * 2;
			healthBriefCases++;
			this.remove();
			this.show();
		} else {
			playSound("error");
		}
	} else if (fastCollisionSprite(this.doubleHealthTouchTarget, touchSprite)) {
		if (score >= this.doubleHealthCost) {
			score -= this.doubleHealthCost;
			this.doubleHealthCost = this.doubleHealthCost * 2;
			if (healthModifier === 1) {
				healthModifier = 2;
			} else {
				healthModifier = healthModifier * 2;
			}
			this.remove();
			this.show();
		} else {
			playSound("error");
		}
	}
}