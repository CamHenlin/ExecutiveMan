function PrinterGuy(stage, basicCollision, x, y) {
	var printerGuySpriteSheet = new createjs.SpriteSheet({
		"images": [loader.getResult("printerguy")],
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
				"speed" : (0.15 / lowFramerate) / skipFrames
			},
			"showlong" : {
				"frames" : [1],
				"next" : "showlong"
			}
		}
	}); // new createjs.Bitmap("images/businessmanspritesheet.png");

	this.basicCollision   = basicCollision;
	this.health           = 2;
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
	this.lastDirectionChangeFromCollision = false;

	this.animations.play();
	this.stage.addChild(this.animations);

	this.tickActions = function(actions) {
		this.watchedElements.forEach(function(element) {
			element.tickActions(actions);
		});

		if (this.health === -1) {
			return;
		}

		if (this.health <= 0) {
			var explosion = explosionSprite.clone(true);
			explosion.x = this.animations.x;
			explosion.y = this.animations.y;
			this.stage.removeChild(this.animations);
			explosion.gotoAndPlay("explode");
			this.stage.addChild(explosion);
			this.health = -1;
			setTimeout(function() {
				this.stage.removeChild(explosion);
			}.bind(this), 250);
			this.activated = false;
			return;
		}


		if (player.x < this.x && this.animations.scaleX !== 1 && !this.activated) {
			this.animations.scaleX = 1;
			this.animations.regX = 0;
		} else if (player.x > this.x && this.animations.scaleX !== -1 && !this.activated) {
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

			this.x += (this.animations.scaleX !== 1) ? 1 : -1;
			this.y += this.jumpspeed;
		}

		if (!collisionResults.down && this.jumping) {
			this.jumping = false;
			this.jumpspeed = 0;
		}

		var distanceFromPlayer = player.x - this.x;
		if (Math.abs(distanceFromPlayer) <= 200 && this.animations.currentAnimation !== "move" && !this.lastDirectionChangeFromCollision && !this.activated) {
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

		if (this.shootTicks === 0 && Math.abs(distanceFromPlayer) < 350 && !this.activated && this.health > 0) {
			this.watchedElements.push(new Shot(stage, this.x, this.y, -this.animations.scaleX, this, mapper));
			this.shootTicks = 300 / lowFramerate;
			this.hardshell = false;
			this.animations.gotoAndPlay("showlong");

			setTimeout(function() {
				if (!this.activated && this.health > 0) {
					this.hardshell = true;
					this.animations.gotoAndPlay("sit");
				}
			}.bind(this), 250);
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

		if (this.shootTicks > 0) {
			this.shootTicks--;
		}

		this.animations.x = this.x - mapper.completedMapsWidthOffset;
		this.animations.y = this.y;
	};

	var Shot = function(stage, x, y, direction, owner) {
		var shotSpriteSheet = new createjs.SpriteSheet({
			"images": [loader.getResult("enemyshot")],
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
		this.disabled   = false;
		this.owner      = owner;

		this.animations.play();
		this.stage.addChild(this.animations);
		this.x = this.x + (3 * this.direction) * lowFramerate;
		this.animations.x = this.x - mapper.completedMapsWidthOffset;
		this.animations.y = this.y;

		this.tickActions = function() {
			this.x = this.x + (3 * this.direction) * lowFramerate;
			this.animations.x = this.x - mapper.completedMapsWidthOffset;
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
			return !(this.x < 0 || this.x > player.x + 2000);


		};
	};
}