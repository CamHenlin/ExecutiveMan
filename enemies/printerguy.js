/**
 * [PrinterGuy description]
 * @param {[type]} stage          [description]
 * @param {[type]} basicCollision [description]
 * @param {[type]} x              [description]
 * @param {[type]} y              [description]
 */
function PrinterGuy(stage, basicCollision, x, y) {
	var printerGuySpriteSheet = new createjs.SpriteSheet({
		"images": [loader.getResult("printerguy")],
		"frames": {
			"width": 18,
			"height": 22,
			"count": 4
		},
		"animations": {
			"sit": {
				"frames": [0],
				"next": "sit"
			},
			"show": {
				"frames": [1],
				"next": "move"
			},
			"move": {
				"frames": [2, 3],
				"next": "move",
				"speed": (0.15) / skipFrames
			},
			"showlong": {
				"frames": [1],
				"next": "showlong"
			}
		}
	}); // new createjs.Bitmap("images/businessmanspritesheet.png");

	this.basicCollision = basicCollision;
	this.health = 2;
	this.damage = 1;
	this.stage = stage;
	this.animations = new createjs.Sprite(printerGuySpriteSheet, "sit");
	this.x = x + parseInt(renderer.mapData.properties.stitchx);
	this.y = y;
	this.animations.x = x - renderer.completedMapsWidthOffset;
	this.animations.y = y;
	this.activated = false;
	this.jumping = false;
	this.jumpspeed = 0;
	this.shootTicks = 0;
	this.dead = false;
	this.hardshell = true;
	this.watchedElements = [];
	this.lastDirectionChangeFromCollision = false;

	this.animations.play();
	this.stage.addChild(this.animations);

	/**
	 * [tickActions description]
	 * @param  {[type]} actions [description]
	 * @return {[type]}         [description]
	 */
	this.tickActions = function(actions) {
		this.watchedElements.forEach(function(element) {
			element.tickActions(actions);
		});

		if (this.dead) {
			return;
		}

		if (this.health <= 0) {
			renderer.itemDrop(this.x, this.y);
			score += 5 * scoreModifier;
			var explosion = explosionSprite.clone(true);
			explosion.x = this.animations.x;
			explosion.y = this.animations.y;
			this.stage.removeChild(this.animations);
			explosion.gotoAndPlay("explode");
			this.stage.addChild(explosion);
			this.dead = true;
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
			this.jumpspeed += 0.25;
			if (this.jumpspeed > 12) {
				this.jumpspeed = 12;
			}

			this.x += (this.animations.scaleX !== 1) ? 1 : -1;
			this.y += this.jumpspeed;
		}

		if (!collisionResults.down && this.jumping) {
			this.jumping = false;
			this.jumpspeed = 0;
		}

		var distanceFromPlayer = player.x - this.x;
		if (abs(distanceFromPlayer) <= 100 && this.animations.currentAnimation !== "move" && !this.lastDirectionChangeFromCollision && !this.activated) {
			if (distanceFromPlayer > 0) {
				this.animations.scaleX = -1;
				this.animations.regX = this.animations.spriteSheet._frameWidth;
			} else {
				this.animations.scaleX = 1;
			}
			this.activated = true;
			this.hardshell = false;
			this.animations.gotoAndPlay("show");
		}

		if (this.shootTicks === 0 && abs(distanceFromPlayer) < 175 && !this.activated && this.health > 0) {
			this.watchedElements.push(new Shot(stage, this.x, this.y, -this.animations.scaleX, this, renderer));
			this.shootTicks = 300;
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
			if ((!collisionResults.left && this.animations.scaleX === 1) || (!collisionResults.right && this.animations.scaleX === -1) ||
				this.x < renderer.completedMapsWidthOffset || this.x > renderer.completedMapsWidthOffset + renderer.getMapWidth()) {

				this.animations.scaleX = this.animations.scaleX * -1;
				if (this.animations.scaleX === -1) {
					this.animations.regX = this.animations.spriteSheet._frameWidth;
				} else {
					this.animations.regX = 0;
				}
			}
			this.x += (this.animations.scaleX !== 1) ? 0.875 : -0.875;
		}

		if (!collisionResults.down) {
			this.y -= (this.y + this.animations.spriteSheet._frameHeight) & 15; // (numerator % divisor) === (numerator & (divisor - 1)); and we're doing: spriteSheet._frameHeight) % 16;
		}

		if (this.shootTicks > 0) {
			this.shootTicks--;
		}

		this.animations.x = this.x - renderer.completedMapsWidthOffset;
		this.animations.y = this.y;
	};

	/**
	 * [Shot description]
	 * @param {[type]} stage     [description]
	 * @param {[type]} x         [description]
	 * @param {[type]} y         [description]
	 * @param {[type]} direction [description]
	 * @param {[type]} owner     [description]
	 */
	var Shot = function(stage, x, y, direction, owner) {
		var shotSpriteSheet = new createjs.SpriteSheet({
			"images": [loader.getResult("enemyshot")],
			"frames": {
				"width": 8,
				"height": 8,
				"count": 1
			},
			"animations": {
				"shot": {
					"frames": [0],
					"next": "shot"
				}
			}
		});

		this.stage = stage;
		this.damage = 4;
		this.direction = direction;
		this.animations = new createjs.Sprite(shotSpriteSheet, "shot");
		this.x = x + ((this.direction === 1) ? 16 : -2);
		this.y = y + 6;
		this.disabled = false;
		this.owner = owner;

		this.animations.play();
		this.stage.addChild(this.animations);
		this.x = this.x + (1.5 * this.direction);
		this.animations.x = this.x - renderer.completedMapsWidthOffset;
		this.animations.y = this.y;

		/**
		 * [tickActions description]
		 * @return {[type]} [description]
		 */
		this.tickActions = function() {
			this.x = this.x + (1.5 * this.direction);
			this.animations.x = this.x - renderer.completedMapsWidthOffset;
			this.animations.y = this.y;

			if (!this.checkBounds()) {
				this.removeSelf();
			}
		};

		/**
		 * [removeSelf description]
		 * @return {[type]} [description]
		 */
		this.removeSelf = function() {
			this.stage.removeChild(this.animations);
			this.disabled = true;
		};

		/**
		 * [checkBounds description]
		 * @return {[type]} [description]
		 */
		this.checkBounds = function() {
			return !(this.x < 0 || this.x > player.x + 1000);


		};
	};
}