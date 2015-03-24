/**
 * [StaplerDude description]
 * @param {[type]} stage          [description]
 * @param {[type]} basicCollision [description]
 * @param {[type]} x              [description]
 * @param {[type]} y              [description]
 */
function StaplerDude(stage, basicCollision, x, y) {

	var printerGuySpriteSheet = new createjs.SpriteSheet({
		"images": [loader.getResult("staplerdude")],
		"frames": {
			"width": 41,
			"height": 40,
			"count": 3
		},
		"animations": {
			"sit": {
				"frames": [0],
				"next": "sit"
			},
			"ready": {
				"frames": [1],
				"next": "ready"
			},
			"throw": {
				"frames": [2],
				"next": "throw"
			}
		}
	}); // new createjs.Bitmap("images/businessmanspritesheet.png");

	this.basicCollision = basicCollision;
	this.damage = 2;
	this.health = 6;
	this.stage = stage;
	this.animations = new createjs.Sprite(printerGuySpriteSheet, "sit");
	this.x = x + parseInt(renderer.mapData.properties.stitchx);
	this.y = y;
	this.animations.x = x - renderer.completedMapsWidthOffset;
	this.animations.y = y;
	this.activated = false;
	this.jumping = false;
	this.jumpspeed = 0;
	this.dead = false;
	this.shootTicks = 0;
	this.hardshell = false;
	this.dead = false;
	this.throwSwitch = false;
	this.watchedElements = [];

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

		if (this.health <= 0 && this.activated) {
			renderer.itemDrop(this.x, this.y);
			var explosion = explosionSprite.clone(true);
			score += 25 * scoreModifier;
			explosion.x = this.animations.x;
			explosion.y = this.animations.y;
			this.stage.removeChild(this.animations);
			explosion.gotoAndPlay("explode");
			this.stage.addChild(explosion);
			setTimeout(function() {
				this.stage.removeChild(explosion);
			}.bind(this), 250);
			this.dead = true;
			return;
		}

		if (this.shootTicks > 0) {
			this.shootTicks--;
		}

		if (player.x < this.x && this.animations.scaleX !== 1) {
			this.animations.scaleX = 1;
			this.animations.regX = 0;
		} else if (player.x > this.x && this.animations.scaleX !== -1) {
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

			this.y += this.jumpspeed;
		}

		if (!collisionResults.down && this.jumping) {
			this.jumping = false;
			this.jumpspeed = 0;
		}

		// figure out if we can shoot or not
		var distanceFromPlayer = player.x - this.x;
		if (this.shootTicks === 0 && abs(distanceFromPlayer) < 96) {
			this.animations.gotoAndPlay("ready");
			this.activated = true;


			if (abs(distanceFromPlayer) < 64) {
				this.watchedElements.push(new Shot(stage, this.x, this.y, -this.animations.scaleX, this, renderer));
				this.animations.gotoAndPlay("throw");
				this.shootTicks = 200;
				this.throwSwitch = true;
				setTimeout(function() {
					this.throwSwitch = false;
					this.animations.gotoAndPlay("sit");
				}.bind(this), 250);
			}
		} else if (abs(distanceFromPlayer) >= 96) {
			this.animations.gotoAndPlay("sit");
		} else {
			if (!this.throwSwitch) {
				this.animations.gotoAndPlay("ready");
			}
		}

		if (!collisionResults.down) {
			this.y -= (this.y + this.animations.spriteSheet._frameHeight) & 15; // (numerator % divisor) === (numerator & (divisor - 1)); and we're doing: spriteSheet._frameHeight) % 16;
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
			"images": [loader.getResult("stapler")],
			"frames": {
				"width": 15,
				"height": 5,
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
		this.y = y + 13;
		this.disabled = false;
		this.owner = owner;

		this.animations.play();
		this.stage.addChild(this.animations);
		this.x = this.x + (3 * this.direction);
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