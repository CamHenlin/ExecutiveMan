function PrinterGuy(stage, player, basicCollision, x, y, mapper) {
	console.log("creating new printer guy");
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

	this.mapper           = mapper;
	this.basicCollision   = basicCollision;
	this.health           = 2;
	this.player           = player;
	this.stage            = stage;
	this.animations       = new createjs.Sprite(printerGuySpriteSheet, "sit");
	this.x                = x;
	this.y                = y;
	this.activated        = false;
	this.jumping          = false;
	this.jumpspeed        = 0;
	this.shootTicks       = 0;
	this.hardshell        = true;
	this.watchedElements  = [];

	this.animations.play();
	this.stage.addChild(this.animations);

	this.tickActions = function(actions) {
		this.watchedElements.forEach(function(element) {
			element.tickActions(actions);
		});

		if (this.health <= 0) {
			this.stage.removeChild(this.animations);
			this.activated = false;
			return;
		}


		if (this.player.x < this.x && this.animations.scaleX !== 1 && !this.activated) {
			this.animations.scaleX = 1;
			this.animations.regX = 0;
		} else if (this.player.x > this.x && this.animations.scaleX !== -1 && !this.activated) {
			this.animations.scaleX = -1;
			this.animations.regX = this.animations.spriteSheet._frameWidth;
		}

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
				this.animations.regX = this.animations.spriteSheet._frameWidth;
			} else {
				this.animations.scaleX  = 1;
			}
			this.activated = true;
			this.hardshell = false;
			this.animations.gotoAndPlay("show");
		}

		if (this.shootTicks === 0 && Math.abs(distanceFromPlayer) < 250) {
			this.watchedElements.push(new Shot(stage, this.x, this.y, -this.animations.scaleX, this, this.mapper));
			this.shootTicks = 300;
		}

		if (this.activated) {
			if (!collisionResults.left || !collisionResults.right ||
				this.x < mapper.completedMapsWidthOffset || this.x > mapper.completedMapsWidthOffset + mapper.getMapWidth()) {

				this.animations.scaleX = this.animations.scaleX * -1;
				if (this.animations.scaleX === -1) {
					this.animations.regX = this.animations.spriteSheet._frameWidth;
				} else {
					this.animations.regX = 0;
				}
			}
			this.x += (this.animations.scaleX !== 1 ) ? 1.75 : -1.75;
		}

		if (!collisionResults.down) {
			this.y -= (this.y + this.animations.spriteSheet._frameHeight) % 32;
		}

		this.animations.x = this.x - this.mapper.completedMapsWidthOffset;
		this.animations.y = this.y;
	};

	var Shot = function(stage, x, y, direction, owner, mapper) {
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

		this.mapper    = mapper;
		this.stage      = stage;
		this.direction  = direction;
		this.animations = new createjs.Sprite(shotSpriteSheet, "shot");
		this.x          = x + ((this.direction === 1) ? 33 : -3);
		this.y          = y + 12;
		this.disabled   = false;
		this.owner      = owner;

		this.animations.play();
		this.stage.addChild(this.animations);
		this.x = this.x + (3 * this.direction);
		this.animations.x = this.x - this.mapper.completedMapsWidthOffset;
		this.animations.y = this.y;

		this.tickActions = function(actions) {
			this.x = this.x + (3 * this.direction);
			this.animations.x = this.x - this.mapper.completedMapsWidthOffset;
			this.animations.y = this.y;

			if (!this.checkBounds()) {
				this.removeSelf();
			}
		};

		this.removeSelf = function() {
			this.stage.removeChild(this.animations);
			this.disabled = true;
		};

		this.checkBounds = function() {
			if (this.x < 0 || this.x > this.owner.player.x + 2000) {
				return false;
			}

			return true;
		};
	};
}