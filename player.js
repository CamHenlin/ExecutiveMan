function Player(stage) {

	var playerSpriteSheet = new createjs.SpriteSheet({
		"images": ["images/businessmanspritesheet.png"],
		"frames": {
			"width": 60, "height": 60, "count": 18
		},
		"animations": {
			"stand": {
				"frames" : [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
				"next" : "stand",
				"speed" : 0.125
			},
			"startrun" : {
				"frames" : [2],
				"next" : "run",
				"speed" : 0.125
			},
			"run": {
				"frames" : [3, 4, 5],
				"next" : "run",
				"speed" : 0.15
			},
			"jump": {
				"frames" : [10],
				"next" : "jump"
			},
			"standshoot": {
				"frames" : [6],
				"next" : "standshoot"
			},
			"runshoot": {
				"frames" : [7, 8, 9],
				"next" : "runshoot",
				"speed" : 0.15
			},
			"jumpshoot": {
				"frames" : [11],
				"next" : "jumpshoot"
			}
		}
	}); // new createjs.Bitmap("images/businessmanspritesheet.png");

	this.stage           = stage;
	this.animations      = new createjs.Sprite(playerSpriteSheet, "stand");
	this.x               = 30;
	this.y               = 30;
	this.goingLeft       = false;
	this.goingRight      = false;
	this.jumping         = false;
	this.jumpspeed       = 0;
	this.shootTicks      = 0;
	this.watchedElements = [];

	this.animations.play();
	this.stage.addChild(this.animations);

	this.tickActions = function(actions) {
		if (this.shootTicks > 0) {
			this.shootTicks--;

			if (this.shootTicks === 0) {
				if (this.animations.currentAnimation === "jumpshoot") {
					this.animations.gotoAndPlay("jump");
				} else if (this.animations.currentAnimation === "runshoot") {
					this.animations.gotoAndPlay("run");
				} else if (this.animations.currentAnimation === "standshoot") {
					this.animations.gotoAndPlay("stand");
				}
			}
		}

		if (actions.playerLeft && actions.collisionResults.leftmove) {
			this.goingRight = false;
			this.goingLeft  = true;
			this.animations.scaleX = -1;
			this.animations.regX = 60;
			if ((this.animations.currentAnimation !== "run" && this.animations.currentAnimation !== "startrun" && this.animations.currentAnimation !== "runshoot") && !this.jumping) {
				this.animations.gotoAndPlay("startrun");
			}
		} else if (actions.playerRight && actions.collisionResults.rightmove) {
			this.goingRight = true;
			this.goingLeft  = false;
			this.animations.scaleX = 1;
			this.animations.regX = 0;
			if ((this.animations.currentAnimation !== "run" && this.animations.currentAnimation !== "startrun" && this.animations.currentAnimation !== "runshoot") && !this.jumping) {
				this.animations.gotoAndPlay("startrun");
			}
		} else {
			this.goingRight = false;
			this.goingLeft = false;
			if (this.animations.currentAnimation !== "stand" && this.animations.currentAnimation !== "standshoot" && !this.jumping) {
				this.animations.gotoAndPlay("stand");
			}
		}

		if (actions.playerJump && !this.jumping && actions.collisionResults.upmove) {
			actions.collisionResults.downmove = true;
			this.jumpspeed = -9.75;
			this.jumping = true;

			this.animations.gotoAndPlay("jump");
		} else if (actions.collisionResults.downmove && !this.jumping) {
			actions.collisionResults.downmove = true;
			this.jumpspeed = 0;
			this.jumping = true;
			this.animations.gotoAndPlay("jump");
		}

		if (actions.playerAttack && this.shootTicks === 0) {
			this.watchedElements.push(new Shot(stage, this.x, this.y));
			this.shootTicks = 15;
			if (this.animations.currentAnimation === "jump") {
				this.animations.gotoAndPlay("jumpshoot");
			} else if (this.animations.currentAnimation === "run") {
				this.animations.gotoAndPlay("runshoot");
			} else if (this.animations.currentAnimation === "stand") {
				this.animations.gotoAndPlay("standshoot");
			}
		}

		if (this.goingRight || this.goingLeft) {
			if (this.jumping) {
				this.x += (this.goingRight) ? 2.65 : -2.65;
			} else {
				this.x += (this.goingRight) ? 2.75 : -2.75;
			}
		}

		if (this.jumping && actions.collisionResults.downmove) {
			this.y += this.jumpspeed;
			this.jumpspeed = this.jumpspeed + 0.5;
			if (this.jumpspeed > 24) {
				this.jumpspeed = 24;
			}
		} else if (this.jumping && !actions.collisionResults.downmove) {
			this.animations.gotoAndPlay("stand");
			this.jumping = false;

			// correcting floor position after a jump/fall:
			var yMod = this.y % 32;
			if (yMod >= 2) {
				this.y = this.y - (yMod - 4);
			}
		}

		this.animations.x = this.x;
		this.animations.y = this.y;

		this.watchedElements.forEach(function(element) {
			element.tickActions(actions);
		});
	};

	var Shot = function(stage, playerX, playerY) {
		var shotSpriteSheet = new createjs.SpriteSheet({
			"images": ["images/shot.png"],
			"frames": {
				"width": 16, "height": 16, "count": 1
			},
			"animations": {
				"shot": {
					"frames" : [0],
					"next" : "shot"
				}
			}
		});

		this.stage      = stage;
		this.animations = new createjs.Sprite(shotSpriteSheet, "shot");
		this.x          = playerX + 30;
		this.y          = playerY + 30;
		this.direction  = null;
		this.done       = false;

		this.animations.play();
		this.stage.addChild(this.animations);

		this.tickActions = function(actions) {
			this.x = this.x + 10;
			this.animations.x = this.x;
			this.animations.y = this.y;

			if (this.x > 2000) {
				this.done = true;
			}
		};
	};
}