function PrinterGuy(stage) {

	var printerGuySpriteSheet = new createjs.SpriteSheet({
		"images": ["images/businessmanspritesheet.png"],
		"frames": {
			"width": 36, "height": 44, "count": 4
		},
		"animations": {
			"sit": {
				"frames" : [0],
				"next" : "sit"
			},
			"show" : {
				"frames" : [1],
				"next" : "move",
				"speed" : 0.5
			},
			"move": {
				"frames" : [2, 3],
				"next" : "move",
				"speed" : 0.15
			}
		}
	}); // new createjs.Bitmap("images/businessmanspritesheet.png");

	this.stage           = stage;
	this.animations      = new createjs.Sprite(printerGuySpriteSheet, "stand");
	this.x               = 400;
	this.y               = 300;
	this.goingLeft       = false;
	this.goingRight      = false;
	this.jumping         = false;
	this.jumpspeed       = 0;
	this.shootTicks      = 0;
	this.watchedElements = [];

	this.animations.play();
	this.stage.addChild(this.animations);

	this.tickActions = function(actions, player) {
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

		var distanceFromPlayer = player.x - this.x;
		if (abs(distanceFromPlayer) <= 300 && this.animations.currentAnimation !== "move") {
			setTimeout(function() {
				if (distanceFromPlayer > 0) {
					this.goingLeft = true;
				} else {
					this.goingRight = true;
					this.animations.scaleX = -1;
					this.animations.regX = 36;
				}
			}.bind(this, distanceFromPlayer), 250);

			this.animations.gotoAndPlay("show");
		}

		if (this.shootTicks === 0 && abs(distanceFromPlayer) < 400) {
			this.watchedElements.push(new Shot(stage, this.x, this.y, this.animations.scaleX));
			this.shootTicks = 300;

			this.watchedElements.push(new Shot(this.stage, this.x, this.y, this.animations.scaleX));
		}

		if (this.goingRight || this.goingLeft) {
			this.x += (this.goingRight) ? 2.75 : -2.75;
		}

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

	var Shot = function(stage, x, y, direction) {
		var shotSpriteSheet = new createjs.SpriteSheet({
			"images": ["images/enemyshot.png"],
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
		this.direction  = direction;
		this.animations = new createjs.Sprite(shotSpriteSheet, "shot");
		this.x          = x + ((this.direction === 1) ? 52 : -6);
		this.y          = y + 27;
		this.done       = false;

		this.animations.play();
		this.stage.addChild(this.animations);

		this.tickActions = function(actions) {
			this.x = this.x + (7 * this.direction);
			this.animations.x = this.x;
			this.animations.y = this.y;

			if (this.x > 2000) {
				this.done = true;
			}
		};
	};
}