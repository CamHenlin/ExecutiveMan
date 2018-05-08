/**
 * [WallGun description]
 * @param {[type]} stage [description]
 * @param {[type]} x     [description]
 * @param {[type]} y     [description]
 * @param {[type]} left  [description]
 */
function WallGun(stage, x, y, left) {

	var wallgunSpriteSheet = new createjs.SpriteSheet({
		"images": [loader.getResult("wallgun")],
		"frames": {
			"width": 15,
			"height": 16,
			"count": 4
		},
		"animations": {
			"open": {
				"frames": [3, 2, 1, 0],
				"next": "opened",
				"speed": (0.125) / skipFrames
			},
			"closed": {
				"frames": [3],
				"next": "closed"
			},
			"opened": {
				"frames": [0],
				"next": "opened"
			},
			"close": {
				"frames": [0, 1, 2, 3],
				"next": "closed",
				"speed": (0.125) / skipFrames
			}
		}
	}); // new createjs.Bitmap("images/businessmanspritesheet.png");

	this.stage = stage;
	this.animations = new createjs.Sprite(wallgunSpriteSheet, "current");
	this.x = x + parseInt(renderer.mapData.properties.stitchx); // - 32;
	this.y = y;
	this.animations.x = x - renderer.completedMapsWidthOffset;
	this.animations.y = y;
	this.activated = false;
	this.jumping = false;
	this.jumpspeed = 0;
	this.damage = 1;
	this.health = 1;
	this.flee = false;
	this.targetY = 0;
	this.yStepSize = 0;
	this.xStepSize = 0;
	this.hardshell = false;
	this.dead = false;
	this.movementTicks = 0;
	this.watchedElements = [];
	this.animations.x = this.x - renderer.completedMapsWidthOffset;
	this.animations.y = this.y;

	this.animations.play();
	this.stage.addChild(this.animations);

	if (left) {
		this.animations.scaleX = -1;
		this.animations.regX = this.animations.spriteSheet._frameWidth;
	}

	/**
	 * [tickActions description]
	 * @return {[type]} [description]
	 */
	this.tickActions = function() {
		this.watchedElements.forEach(function(element) {
			element.tickActions();
		});

		if (this.dead) {
			return;
		}

		if (this.health <= 0) {
			renderer.itemDrop(this.x, this.y);
			var explosion = explosionSprite.clone(true);
			score += 2 * scoreModifier;
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

		if (this.movementTicks > 0) {
			this.movementTicks--;
		} else {
			var distanceFromPlayer = player.x - this.x;
			if (abs(distanceFromPlayer) <= 480) {
				this.movementTicks = 600;
				this.animations.gotoAndPlay("open");
				this.hardshell = false;
				setTimeout(function() {
					var yspeed = Math.sin(Math.atan2((player.y - this.y), (player.x - this.x))) * 2.5;
					var xspeed = Math.cos(Math.atan2((player.y - this.y), (player.x - this.x))) * 2.5;
					this.watchedElements.push(new Shot(stage, this.x, this.y, xspeed, yspeed, -this.animations.scaleX, this));
				}.bind(this), 2000);
				setTimeout(function() {
					var yspeed = Math.sin(Math.atan2((player.y - this.y), (player.x - this.x))) * 2.5;
					var xspeed = Math.cos(Math.atan2((player.y - this.y), (player.x - this.x))) * 2.5;
					this.watchedElements.push(new Shot(stage, this.x, this.y, xspeed, yspeed, -this.animations.scaleX, this));
				}.bind(this), 3000);
				setTimeout(function() {
					this.animations.gotoAndPlay("close");
				}.bind(this), 4000);
				setTimeout(function() {
					this.hardshell = true;
				}.bind(this), 4200);
			}
		}

		this.animations.x = this.x - renderer.completedMapsWidthOffset;
		this.animations.y = this.y;
	};

	/**
	 * [Shot description]
	 * @param {[type]} stage     [description]
	 * @param {[type]} x         [description]
	 * @param {[type]} y         [description]
	 * @param {[type]} xspeed    [description]
	 * @param {[type]} yspeed    [description]
	 * @param {[type]} direction [description]
	 * @param {[type]} owner     [description]
	 */
	var Shot = function(stage, x, y, xspeed, yspeed, direction, owner) {
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
		this.x = x + ((this.direction === 1) ? 16 : -1);
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