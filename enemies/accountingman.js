/**
 * [AccountingMan description]
 * @param {[type]} stage          [description]
 * @param {[type]} basicCollision [description]
 * @param {[type]} x              [description]
 * @param {[type]} y              [description]
 */
function AccountingMan(stage, basicCollision, x, y) {

	var accountingManSpriteSheet = new createjs.SpriteSheet({
		"images": [loader.getResult("accountingman")],
		"frames": {
			"width": 24,
			"height": 28,
			"count": 8
		},
		"animations": {
			"stand": {
				"frames": [0],
				"next": "stand"
			},
			"run": {
				"frames": [1, 2, 3, 2],
				"next": "run",
				"speed": 0.09
			},
			"jump": {
				"frames": [6],
				"next": "jump"
			},
			"shoot": {
				"frames": [4],
				"next": "stand",
				"speed": 0.0625
			},
			"runshoot": {
				"frames": [5],
				"next": "run",
				"speed": 0.0625
			},
			"jumpshoot": {
				"frames": [7],
				"next": "jumpshoot",
				"speed": 0.0625
			}
		}
	});

	this.basicCollision = basicCollision;
	this.health = 28;
	this.lasthealth = 28;
	this.damage = 3;
	this.stage = stage;
	this.animations = new createjs.Sprite(accountingManSpriteSheet, "stand");
	this.x = x + parseInt(renderer.mapData.properties.stitchx);
	this.y = y;
	this.animations.x = x;
	this.animations.y = y;
	this.xSpeed = 0;
	this.activated = false;
	this.jumping = false;
	this.runningLeft = false;
	this.runTicker = 100;
	this.runningRight = false;
	this.xspeed = 0;
	this.yspeed = 0;
	this.shootTicks = 100;
	this.jumpspeed = 0;
	this.jumpTicks = 0;
	this.hardshell = false;
	this.lastRunDirLeft = false;
	this.lastRunDirRight = false;
	this.dead = false;
	this.ignoreDamage = false;
	this.healthbar = new BossHealthBar(gamestage, this);
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

		if (!this.ignoreDamage) {
			this.healthbar.tickActions();
		} else {
			this.health = this.lasthealth;
		}

		if (this.dead) {
			return;
		}

		if (this.health <= 0) {
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

			this.health = -1;
			setTimeout(function() {
				for (var i = 0; i < 5; i++) {
					this.stage.removeChild(explosions[i]);
				}
			}.bind(this), 300);
			score += 500000 * scoreModifier;
			player.defeatedBoss();
			this.dead = true;
			return;
		}


		// end of jump actions
		if (this.jumpTicks > 0) {
			this.jumpTicks--;
		}

		var collisionResults = this.basicCollision.basicCollision(this);
		if (collisionResults.down && !this.jumping) {
			this.jumpspeed = 0;
			this.jumping = true;
		}

		var distanceFromPlayer = player.x - this.x;
		if (this.jumping && collisionResults.down) {
			this.jumpspeed += 0.25;
			if (this.jumpspeed > 12) {
				this.jumpspeed = 12;
				if (distanceFromPlayer < 0) {
					this.runningLeft = true;
				} else {
					this.runningRight = true;
				}
			}

			this.y += this.jumpspeed;
		}

		if (this.health !== this.lasthealth && this.health < 20) {
			this.shootTicks = 0;
			this.jumpTicks = 0;
			this.ignoreDamage = true;
			setTimeout(function() {
				this.ignoreDamage = false;
			}.bind(this), 1250);
		}
		this.lasthealth = this.health;

		if (!collisionResults.down && this.jumping) {
			this.jumping = false;
			this.jumpspeed = 0;

			if (this.runningLeft || this.runningRight) {
				this.animations.gotoAndPlay("run");
			} else {
				this.animations.gotoAndPlay("stand");
			}
		}

		if (!collisionResults.down) {
			this.y -= (this.y + this.animations.spriteSheet._frameHeight) & 15; // (numerator % divisor) === (numerator & (divisor - 1)); and we're doing: spriteSheet._frameHeight) % 16;
		}


		// figure out if we can shoot or not
		if (distanceFromPlayer < 0 && !this.runningLeft && !this.runningRight && this.runTicker < 0) { // player is left!
			//console.log("player is left");
			this.lastRunDirRight = false;
			this.runningLeft = true;
			this.animations.gotoAndPlay("run");
		} else if (this.runningLeft && collisionResults.left) {
			this.x -= (this.health < 14) ? 2.5 : 2.1; // faster than executiveman!
			if (abs(distanceFromPlayer) > 192 && !this.lastRunDirLeft) {
				this.lastRunDirLeft = true;
				this.runningRight = false;
				this.runningLeft = false;
				this.animations.gotoAndPlay("shoot");
				this.createManyShotsDown();
			}
		} else if (this.runningLeft && !collisionResults.left) {
			this.runTicker = 120;
			this.runningLeft = false;
			this.runningRight = false;
			this.scaleX = 1;
			this.animations.regX = 0;
			this.watchedElements.push(new Shot(stage, this.x, this.y, this.animations.scaleX, this, renderer));
			this.animations.gotoAndPlay("shoot");
		} else if (distanceFromPlayer > 0 && !this.runningLeft && !this.runningRight && this.runTicker < 0) { // player is right!
			//console.log("player is right");
			this.runningRight = true;
			this.lastRunDirLeft = false;
			this.animations.gotoAndPlay("run");
		} else if (this.runningRight && collisionResults.right) {
			this.x += (this.health < 14) ? 2.1 : 1.7; // faster than executiveman!
			if (abs(distanceFromPlayer) > 192 && !this.lastRunDirRight) {
				this.lastRunDirRight = true;
				this.runningRight = false;
				this.runningLeft = false;
				this.animations.gotoAndPlay("shoot");
				this.createManyShotsDown();
			}
		} else if (this.runningRight && !collisionResults.right) {
			this.runTicker = 120;
			this.runningRight = false;
			this.runningLeft = false;
			this.scaleX = -1;
			this.watchedElements.push(new Shot(stage, this.x, this.y, this.animations.scaleX, this, renderer));
			this.animations.gotoAndPlay("shoot");
			this.animations.regX = this.animations.spriteSheet._frameWidth;
		}
		this.runTicker--;

		if (this.runTicker > 10 && this.shootTicks === 0 && abs(distanceFromPlayer) > 196) {
			//console.log("creating many shots down");
			this.animations.gotoAndPlay("shoot");
			this.createManyShotsDown();
			this.shootTicks = 200;
		}

		if (this.jumpTicks === 0 && (abs(distanceFromPlayer) < 64 || abs(distanceFromPlayer) > 128) && !this.jumping) {
			this.jumpTicks = 160;
			this.y -= 2;
			this.jumping = true;
			this.jumpspeed = -4.875;
			this.animations.gotoAndPlay("jump");
		}

		if (!this.runningLeft && !this.runningRight) {
			if (distanceFromPlayer > 0) {
				this.animations.scaleX = 1;
				this.animations.regX = 0;
			} else {
				this.animations.scaleX = -1;
				this.animations.regX = this.animations.spriteSheet._frameWidth;
			}
		}

		if (this.shootTicks > 0) {
			this.shootTicks--;
		}
		if (this.shootTicks === 0 && abs(distanceFromPlayer) < 225 && !this.runningLeft && !this.runningRight) {
			this.watchedElements.push(new Shot(stage, this.x, this.y, this.animations.scaleX, this, renderer));
			this.animations.gotoAndPlay("shoot");
			this.shootTicks = 100;
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
		[stage, x, y, direction, owner].forEach(function(res) {
			console.log(res);
		});
		var shotSpriteSheet = new createjs.SpriteSheet({
			"images": [loader.getResult("moneyspin")],
			"frames": {
				"width": 16,
				"height": 16,
				"count": 2
			},
			"animations": {
				"shot": {
					"frames": [0, 1],
					"next": "shot",
					"speed": 0.25
				}
			}
		});

		this.stage = stage;
		this.damage = 6;
		this.direction = direction;
		this.animations = new createjs.Sprite(shotSpriteSheet, "shot");
		this.animations.regX = (this.animations.scaleX === -1) ? this.animations.spriteSheet._frameWidth : 0;
		this.x = x + ((this.direction === 1) ? 16 : -2);
		this.y = y + 11;
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
			this.x = this.x + (1.1 * this.direction);
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
	 * [createManyShotsDown description]
	 * @return {[type]} [description]
	 */
	this.createManyShotsDown = function() {
		for (var i = 0; i < 4; i++) {
			this.watchedElements.push(new MagicShot(this.stage, this.x, this.y, this));
		}
	};

	/**
	 * [MagicShot description]
	 * @param {[type]} stage [description]
	 * @param {[type]} x     [description]
	 * @param {[type]} y     [description]
	 * @param {[type]} owner [description]
	 */
	var MagicShot = function(stage, x, y, owner) {
		var shotSpriteSheet = new createjs.SpriteSheet({
			"images": [loader.getResult("moneyspin")],
			"frames": {
				"width": 16,
				"height": 16,
				"count": 2
			},
			"animations": {
				"shot": {
					"frames": [0, 1],
					"next": "shot",
					"speed": 0.25
				}
			}
		});

		this.stage = stage;
		this.damage = 6;
		this.animations = new createjs.Sprite(shotSpriteSheet, "shot");
		this.x = x;
		this.y = y;
		this.disabled = false;
		this.owner = owner;
		this.activated = false;
		this.animations.play();
		this.stage.addChild(this.animations);
		this.animations.x = this.x - renderer.completedMapsWidthOffset;
		this.animations.y = this.y;
		this.xspeed = 0;
		this.yspeed = -2;

		/**
		 * [tickActions description]
		 * @return {[type]} [description]
		 */
		this.tickActions = function() {
			if (!this.activated) {
				if (this.yspeed === 0) {
					this.activated = true;
					this.yspeed = Math.sin(Math.atan2((player.y - this.y), (player.x - this.x))) * 2.5;
					this.xspeed = Math.cos(Math.atan2((player.y - this.y), (player.x - this.x))) * 2.5;
				} else {
					this.y += this.yspeed;
					this.yspeed += 0.0625;
				}
			} else {
				this.x += this.xspeed;
				this.y += this.yspeed;
			}

			if (!this.checkBounds()) {
				this.removeSelf();
			}

			this.animations.x = this.x - renderer.completedMapsWidthOffset;
			this.animations.y = this.y;
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