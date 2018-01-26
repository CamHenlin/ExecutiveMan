/**
 * [KillCopy description]
 * @param {[type]} stage          [description]
 * @param {[type]} basicCollision [description]
 * @param {[type]} x              [description]
 * @param {[type]} y              [description]
 */
function KillCopy(stage, basicCollision, x, y) {

	var killCopySpriteSheet = new createjs.SpriteSheet({
		"images": [loader.getResult("killcopy")],
		"frames": {
			"width": 144,
			"height": 128,
			"count": 5
		},
		"animations": {
			"sit": {
				"frames": [0],
				"next": "sit"
			},
			"shoot": {
				"frames": [1, 2, 3, 4],
				"next": "shoot",
				"speed": 0.75
			}
		}
	}); // new createjs.Bitmap("images/businessmanspritesheet.png");

	this.basicCollision = basicCollision;
	this.damage = 4;
	this.health = 72;
	this.stage = stage;
	this.animations = new createjs.Sprite(killCopySpriteSheet, "sit");
	this.x = x + parseInt(renderer.mapData.properties.stitchx);
	this.y = y;
	this.animations.x = x - renderer.completedMapsWidthOffset;
	this.animations.y = y;
	this.activated = false;
	this.jumping = false;
	this.jumpspeed = 0;
	this.shootTicks = 120;
	this.dead = false;
	this.subShootTicks = 0;
	this.shotCounter = 0;
	this.hardshell = false;
	this.dead = false;
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
			renderer.itemDrop(this.x, this.y + 50);
			renderer.itemDrop(this.x, this.y + 100);
			var explosions = [];
			for (var i = 0; i < 5; i++) {
				explosions[i] = explosionSprite.clone(true);
				this.stage.addChild(explosions[i]);
				explosions[i].gotoAndPlay("explode");
			}
			explosions[0].x = this.animations.x + this.animations.spriteSheet._frameWidth / 2;
			explosions[0].y = this.animations.y + this.animations.spriteSheet._frameHeight / 2;

			explosions[1].x = this.animations.x;
			explosions[1].y = this.animations.y;

			explosions[2].x = this.animations.x + this.animations.spriteSheet._frameWidth;
			explosions[2].y = this.animations.y;

			explosions[3].x = this.animations.x;
			explosions[3].y = this.animations.y + this.animations.spriteSheet._frameHeight;

			explosions[4].x = this.animations.x + this.animations.spriteSheet._frameWidth;
			explosions[4].y = this.animations.y + this.animations.spriteSheet._frameHeight;
			this.stage.removeChild(this.animations);

			setTimeout(function() {
				for (var i = 0; i < 5; i++) {
					this.stage.removeChild(explosions[i]);
				}
			}.bind(this), 300);
			this.dead = true;
			score += 1000 * scoreModifier;
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
		// going to shoot 5 shots that the player has to jump over
		var distanceFromPlayer = player.x - this.x;
		if (this.shootTicks === 0 && abs(distanceFromPlayer) < 225) {
			shotyOffset = 20;
			shotxOffset = 32;
			this.shoot();
			this.activated = true;
			this.shootTicks = 150;

			setTimeout(function() {
				if (this.health === -1) {
					return;
				}
				this.shoot();
			}.bind(this), 62);

			setTimeout(function() {
				if (this.health === -1) {
					return;
				}
				this.shoot();
			}.bind(this), 125);

			setTimeout(function() {
				if (this.health === -1) {
					return;
				}
				this.shoot();
			}.bind(this), 187);

			setTimeout(function() {
				if (this.health === -1) {
					return;
				}
				this.shoot();
			}.bind(this), 250);

			setTimeout(function() {
				if (this.health === -1) {
					return;
				}
				this.animations.gotoAndPlay("sit");
			}.bind(this), 500);

			setTimeout(function() {
				if (this.health === -1) {
					return;
				}

				playSound("papershot");
				this.animations.gotoAndPlay("shoot");
				setTimeout(function() {
					this.watchedElements.push(new StraightShot(stage, this.x + shotxOffset, this.y + shotyOffset, -this.animations.scaleX, this, renderer));
				}.bind(this), 60);


			}.bind(this), 1000);

			if (this.health < 48) {

				setTimeout(function() {
					if (this.health === -1) {
						return;
					}

					playSound("papershot");
					this.animations.gotoAndPlay("shoot");
					setTimeout(function() {
						this.watchedElements.push(new StraightShot(stage, this.x + shotxOffset, this.y + shotyOffset, -this.animations.scaleX, this, renderer));
					}.bind(this), 60);


				}.bind(this), 1250);

				setTimeout(function() {
					if (this.health === -1) {
						return;
					}

					playSound("papershot");
					this.animations.gotoAndPlay("shoot");
					setTimeout(function() {
						this.watchedElements.push(new StraightShot(stage, this.x + shotxOffset, this.y + shotyOffset, -this.animations.scaleX, this, renderer));
					}.bind(this), 60);


				}.bind(this), 1500);

				setTimeout(function() {
					if (this.health === -1) {
						return;
					}

					playSound("papershot");
					this.animations.gotoAndPlay("shoot");
					setTimeout(function() {
						this.watchedElements.push(new StraightShot(stage, this.x + shotxOffset, this.y + shotyOffset, -this.animations.scaleX, this, renderer));
					}.bind(this), 60);


				}.bind(this), 1750);

				setTimeout(function() {
					if (this.health === -1) {
						return;
					}

					playSound("papershot");
					this.animations.gotoAndPlay("shoot");
					setTimeout(function() {
						this.watchedElements.push(new StraightShot(stage, this.x + shotxOffset, this.y + shotyOffset, -this.animations.scaleX, this, renderer));
					}.bind(this), 60);


				}.bind(this), 2000);
			}

			setTimeout(function() {
				if (this.health === -1) {
					return;
				}
				this.animations.gotoAndPlay("sit");
				this.activated = false;
			}.bind(this), 1500);
		}

		if (!collisionResults.down) {
			this.y -= (this.y + this.animations.spriteSheet._frameHeight) & 15; // (numerator % divisor) === (numerator & (divisor - 1)); and we're doing: spriteSheet._frameHeight) % 16;
		}

		this.animations.x = this.x - renderer.completedMapsWidthOffset;
		this.animations.y = this.y;
	};

	/**
	 * [shoot description]
	 * @return {[type]} [description]
	 */
	this.shoot = function() {
		playSound("papershot");
		this.animations.gotoAndPlay("shoot");
		setTimeout(function() {
			this.watchedElements.push(new Shot(stage, this.x + shotxOffset, this.y + shotyOffset, -this.animations.scaleX, this, renderer));
		}.bind(this), 60);
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
			"images": [loader.getResult("papershot")],
			"frames": {
				"width": 24,
				"height": 24,
				"count": 4
			},
			"animations": {
				"shot": {
					"frames": [0, 1, 2, 3],
					"next": "shot",
					"speed": 0.5
				}
			}
		});

		this.stage = stage;
		this.damage = 4;
		this.direction = direction;
		this.animations = new createjs.Sprite(shotSpriteSheet, "shot");
		this.x = x + ((this.direction === 1) ? 16 : -2);
		this.y = y + 1;
		this.ySpeed = 6.75;
		this.disabled = false;
		this.owner = owner;

		this.animations.play();
		this.stage.addChild(this.animations);
		this.x = this.x + (5 * this.direction);
		this.animations.x = this.x - renderer.completedMapsWidthOffset;
		this.animations.y = this.y;

		/**
		 * [tickActions description]
		 * @return {[type]} [description]
		 */
		this.tickActions = function() {
			if (this.disabled) {
				return;
			}

			this.y += this.ySpeed;
			this.ySpeed -= 0.25;
			this.x = this.x + (4 * this.direction);
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

	/**
	 * [StraightShot description]
	 * @param {[type]} stage     [description]
	 * @param {[type]} x         [description]
	 * @param {[type]} y         [description]
	 * @param {[type]} direction [description]
	 * @param {[type]} owner     [description]
	 */
	var StraightShot = function(stage, x, y, direction, owner) {
		var shotSpriteSheet = new createjs.SpriteSheet({
			"images": [loader.getResult("papershot")],
			"frames": {
				"width": 24,
				"height": 24,
				"count": 4
			},
			"animations": {
				"shot": {
					"frames": [0, 1, 2, 3],
					"next": "shot",
					"speed": 0.5
				}
			}
		});

		this.stage = stage;
		this.damage = 4;
		this.direction = direction;
		this.animations = new createjs.Sprite(shotSpriteSheet, "shot");
		this.x = x + ((this.direction === 1) ? 16 : -2);
		this.y = y + 21;
		this.ySpeed = 2.5;
		this.disabled = false;
		this.owner = owner;
		this.animations.play();
		this.stage.addChild(this.animations);
		this.x = this.x + (5 * this.direction);
		this.animations.x = this.x - renderer.completedMapsWidthOffset;
		this.animations.y = this.y;

		/**
		 * [tickActions description]
		 * @return {[type]} [description]
		 */
		this.tickActions = function() {
			if (this.disabled) {
				return;
			}

			this.y += this.ySpeed;
			this.ySpeed -= 0.09;
			this.x = this.x + (4 * this.direction);
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