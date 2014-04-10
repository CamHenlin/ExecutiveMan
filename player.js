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
			}
		}
	}); // new createjs.Bitmap("images/businessmanspritesheet.png");

	this.stage      = stage;
	this.animations = new createjs.Sprite(playerSpriteSheet, "stand");
	this.x          = 30;
	this.y          = 30;
	this.goingLeft  = false;
	this.goingRight = false;
	this.jumping	= false;
	this.jumpspeed	= 0;

	this.animations.play();
	this.stage.addChild(this.animations);

	this.tickActions = function(actions) {
		if (actions.playerLeft && actions.collisionResults.leftmove) {
			this.goingRight = false;
			this.goingLeft  = true;
			this.animations.scaleX = -1;
			if ((this.animations.currentAnimation !== "run" && this.animations.currentAnimation !== "startrun") && !this.jumping) {
				this.animations.gotoAndPlay("startrun");
			}
		} else if (actions.playerRight && actions.collisionResults.rightmove) {
			this.goingRight = true;
			this.goingLeft  = false;
			this.animations.scaleX = 1;
			if ((this.animations.currentAnimation !== "run" && this.animations.currentAnimation !== "startrun") && !this.jumping) {
				this.animations.gotoAndPlay("startrun");
			}
		} else {
			this.goingRight = false;
			this.goingLeft = false;
			if (this.animations.currentAnimation !== "stand"  && !this.jumping) {
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

			var yMod = this.y % 32;
			if (yMod >= 2) {
				this.y = this.y - (yMod - 4);
			}
		}

		this.animations.x = this.x;
		this.animations.y = this.y;
	};
}