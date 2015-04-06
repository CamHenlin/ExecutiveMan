/**
 * [SixShooter description]
 * @param {[type]} stage [description]
 * @param {[type]} x     [description]
 * @param {[type]} y     [description]
 */
function SixShooter(stage, x, y) {

	var sixShooterSpriteSheet = new createjs.SpriteSheet({
		"images": [loader.getResult("sixshooter")],
		"frames": {
			"width": 16,
			"height": 20,
			"count": 2
		},
		"animations": {
			"closed": {
				"frames": [0],
				"next": "closed"
			},
			"open": {
				"frames": [1],
				"next": "open"
			}
		}
	}); // new createjs.Bitmap("images/businessmanspritesheet.png");

	this.stage = stage;
	this.animations = new createjs.Sprite(sixShooterSpriteSheet, "closed");
	this.x = x + parseInt(renderer.mapData.properties.stitchx);
	this.y = parseInt(y);
	this.animations.x = x - renderer.completedMapsWidthOffset;
	this.animations.y = parseInt(y);
	this.xspeed = -1;
	this.yspeed = 0;
	this.activated = false;
	this.jumping = false;
	this.jumpspeed = 0;
	this.damage = 2;
	this.health = 2;
	this.flee = false;
	this.targetY = 0;
	this.hardshell = true;
	this.dead = false;
	this.movementTicks = 0;
	this.watchedElements = [];
	this.lasty = this.y;
	this.lastx = this.x;
	this.stopTicks = 0;

	this.animations.play();
	this.stage.addChild(this.animations);

	/**
	 * [tickActions description]
	 * @return {[type]} [description]
	 */
	this.tickActions = function() {
		this.watchedElements.forEach(function(element) {
			element.tickActions();
		});

		if (this.stopTicks === 0) {
			if (this.xspeed < 0 && this.x < 0) {
				this.x = renderer.getMapWidth() + renderer.completedMapsWidthOffset;
				this.lastx = this.x;
				this.animations.x = this.x - renderer.completedMapsWidthOffset;
				this.dead = false;
				this.health = 2;
				this.animations.visible = true;

			}

			if (this.yspeed < 0 && this.y < 0) {
				this.y = renderer.getMapHeight();
				this.lasty = this.y;
				this.animations.y = this.y;
				this.dead = false;
				this.health = 2;
				this.animations.visible = true;
			}

			if (this.xspeed > 0 && this.x > renderer.getMapWidth() + renderer.completedMapsWidthOffset) {
				this.x = renderer.completedMapsWidthOffset;
				this.lastx = this.x;
				this.animations.x = this.x - renderer.completedMapsWidthOffset;
				this.dead = false;
				this.health = 2;
				this.animations.visible = true;
			}

			if (this.yspeed > 0 && this.y > renderer.getMapHeight()) {
				this.y = 0;
				this.lastx = this.y;
				this.animations.y = this.y;
				this.dead = false;
				this.health = 2;
				this.animations.visible = true;
			}

			this.y += this.yspeed;
			this.animations.y += this.y - this.lasty;

			this.x += this.xspeed;
			this.animations.x += this.x - this.lastx;

			this.lasty = this.y;
			this.lastx = this.x;
		}

		if (this.dead) {
			return;
		}

		if (this.health <= 0) {
			renderer.itemDrop(this.x, this.y);
			var explosion = explosionSprite.clone(true);
			score += 2 * scoreModifier;
			explosion.x = this.animations.x;
			explosion.y = this.animations.y;
			//this.stage.removeChild(this.animations);
			this.animations.visible = false;
			explosion.gotoAndPlay("explode");
			this.stage.addChild(explosion);
			this.dead = true;
			setTimeout(function() {
				this.stage.removeChild(explosion);
			}.bind(this), 250);
			this.activated = false;
			return;
		}

		if (this.movementTicks > 0 && this.stopTicks === 0) {
			this.movementTicks--;
		} else {
			var distanceFromPlayer = player.x - this.x;
			if (abs(distanceFromPlayer) <= 80 && this.stopTicks === 0) {
				this.stopTicks = 100;
			}
		}

		if (this.stopTicks > 50) {
			this.stopTicks--;
		} else if (this.stopTicks === 50) {
			this.stopTicks--;
			this.movementTicks = 200;
			this.animations.gotoAndPlay("open");
			this.hardshell = false;

			setTimeout(function() {
				for (var i = 0; i < 6; i++) {
					// 1.04 = pi/3
					var yspeed = Math.cos(1.04 * i);
					var xspeed = Math.sin(1.04 * i);

					this.watchedElements.push(new Shot(stage, this.x, this.y, xspeed, yspeed, this));
				}
			}.bind(this), 400);


			setTimeout(function() {
				this.animations.gotoAndPlay("closed");
			}.bind(this), 1000);

			setTimeout(function() {
				this.hardshell = true;
			}.bind(this), 1100);
		} else if (this.stopTicks > 0 && this.stopTicks < 50) {
			this.stopTicks--;
		}
	};

	/**
	 * [Shot description]
	 * @param {[type]} stage  [description]
	 * @param {[type]} x      [description]
	 * @param {[type]} y      [description]
	 * @param {[type]} xspeed [description]
	 * @param {[type]} yspeed [description]
	 * @param {[type]} owner  [description]
	 */
	var Shot = function(stage, x, y, xspeed, yspeed, owner) {
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
		this.damage = 3;
		this.xspeed = xspeed;
		this.yspeed = yspeed;
		this.animations = new createjs.Sprite(shotSpriteSheet, "shot");
		this.x = x + 8;
		this.y = y + 8;
		this.disabled = false;
		this.owner = owner;

		this.animations.play();
		this.stage.addChild(this.animations);
		this.animations.x = this.x - renderer.completedMapsWidthOffset;
		this.animations.y = this.y;

		/**
		 * [tickActions description]
		 * @return {[type]} [description]
		 */
		this.tickActions = function() {
			this.x += this.xspeed;
			this.y += this.yspeed;
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