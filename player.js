function Player(stage) {

	var playerSpriteSheet = new createjs.SpriteSheet({
		"images": ["images/businessmanspritesheet.png"],
		"frames": {
			"width": 60, "height": 60, "count": 18
		},
		"animations": {
			"stand": {
				"frames" : [0, 0, 0, 1],
				"next" : "stand",
				"speed" : 0.125
			},
			"run": {
				"frames" : [3, 4, 5],
				"next" : "run",
				"speed" : 0.125

			},
			"jump": {
				"frames" : [10],
				"next" : "jump"
			}
		}
	}); // new createjs.Bitmap("images/businessmanspritesheet.png");

	this.stage      = stage;
	this.animations = new createjs.Sprite(playerSpriteSheet, "stand");
	this.x          = 50;
	this.y          = 50;
	this.goingLeft  = false;
	this.goingRight = false;
	this.jumping	= false;
	this.jumpspeed	= 0;

	this.animations.play();
	this.stage.addChild(this.animations);

	this.tickActions = function(actions) {
		if (actions.playerLeft) {
			this.goingRight = false;
			this.goingLeft  = true;
			this.animations.setTransform(120, 0, -1);
			if (this.animations.currentAnimation !== "run" && !this.jumping) {
				this.animations.gotoAndPlay("run");
			}
		} else if (actions.playerRight) {
			this.goingRight = true;
			this.goingLeft  = false;
			this.animations.setTransform(0, 0, 1);
			if (this.animations.currentAnimation !== "run" && !this.jumping) {
				this.animations.gotoAndPlay("run");
			}
		} else if (actions.playerJump && !this.jumping) {
			this.jumpspeed = -9.75;
			this.jumping = true;

			this.animations.gotoAndPlay("jump");
		} else {
			this.goingRight = false;
			this.goingLeft = false;
			if (this.animations.currentAnimation !== "stand"  && !this.jumping) {
				this.animations.gotoAndPlay("stand");
			}
		}

		if (this.goingRight || this.goingLeft) {
			if (this.jumping) {
				this.x += (this.goingRight) ? 2.65 : -2.65;
			} else {
				this.x += (this.goingRight) ? 2.75 : -2.75;
			}
		}

		if (this.jumping) {
			this.y += this.jumpspeed;
			this.jumpspeed = this.jumpspeed + 0.5;
			if (this.jumpspeed > 24) {
				this.jumpspeed = 24;
			}

			if (this.y > 400) {
				this.jumping = false;
				this.animations.gotoAndPlay("stand");
			}
		}

		this.animations.x = this.x;
		this.animations.y = this.y;
	};
}