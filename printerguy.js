function PrinterGuy(stage, player, basicCollision, x, y) {

	var printerGuySpriteSheet = new createjs.SpriteSheet({
		"images": ["images/printerguy.png"],
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
				"next" : "move"
			},
			"move": {
				"frames" : [2, 3],
				"next" : "move",
				"speed" : 0.15
			}
		}
	}); // new createjs.Bitmap("images/businessmanspritesheet.png");

	this.basicCollision   = basicCollision;
	this.player           = player;
	this.stage            = stage;
	this.animations       = new createjs.Sprite(printerGuySpriteSheet, "sit");
	this.x                = x;
	this.y                = y;
	this.activated        = false;
	this.jumping          = false;
	this.jumpspeed        = 0;
	this.shootTicks       = 0;
	this.watchedElements  = [];

	this.animations.play();
	this.stage.addChild(this.animations);

	this.tickActions = function(actions) {
		var collisionResults = this.basicCollision.basicCollision(this);
		if (collisionResults.down && !this.jumping) {
			this.jumpspeed = 0;
			this.jumping = true;
		}

		if (this.jumping && collisionResults.down) {
			this.jumpspeed += 0.5;
			if (this.jumpspeed > 24) {
				this.jumpspeed = 24;
			}

			this.y += this.jumpspeed;
		}

		if (!collisionResults.down && this.jumping) {
			this.jumping = false;
			this.jumpspeed = 0;
		}

		var distanceFromPlayer = this.player.x - this.x;
		if (Math.abs(distanceFromPlayer) <= 200 && this.animations.currentAnimation !== "move") {
			if (distanceFromPlayer > 0) {
				this.animations.scaleX = -1;
				this.animations.regX = 36;
			} else {
				this.animations.scaleX  = 1;
			}
			this.activated = true;
			this.animations.gotoAndPlay("show");
		}

		if (this.shootTicks === 0 && Math.abs(distanceFromPlayer) < 150) {
			this.watchedElements.push(new Shot(stage, this.x, this.y, -this.animations.scaleX));
			this.shootTicks = 300;
		}

		if (this.activated) {
			if (!collisionResults.left || !collisionResults.right) {
				this.animations.scaleX = this.animations.scaleX * -1;
				if (this.animations.scaleX === -1) {
					this.animations.regX = 36;
				} else {
					this.animations.regX = 0;
				}
			}
			this.x += (this.animations.scaleX !== 1 ) ? 1.75 : -1.75;
		}

		if (!collisionResults.down) {
			this.y -= (this.y + this.animations.spriteSheet._frameHeight) % 32;
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
		this.x          = x + ((this.direction === 1) ? 33 : -3);
		this.y          = y + 12;
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