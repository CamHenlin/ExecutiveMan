/**
 * [CoffeeCopter description]
 * @param {[type]} stage [description]
 * @param {[type]} x     [description]
 * @param {[type]} y     [description]
 */
function CoffeeCopter(stage, x, y) {

	var copterSpriteSheet = new createjs.SpriteSheet({
		"images": [loader.getResult("coffeecopter")],
		"frames": {
			"width": 21,
			"height": 21,
			"count": 2
		},
		"animations": {
			"operate": {
				"frames": [0, 1],
				"next": "operate"
			}
		}
	}); // new createjs.Bitmap("images/businessmanspritesheet.png");

	this.stage = stage;
	this.animations = new createjs.Sprite(copterSpriteSheet, "current");
	this.x = x; // - 32;
	this.y = y;
	this.animations.x = x - renderer.completedMapsWidthOffset;
	this.animations.y = y;
	this.activated = false;
	this.jumping = false;
	this.jumpspeed = 0;
	this.damage = 1;
	this.health = 1;
	this.targetY = 0;
	this.yStepSize = 0;
	this.xStepSize = 0;
	this.shootTicks = 0;
	this.hardshell = false;
	this.dead = false;
	this.movementTicks = 0;
	this.watchedElements = [];
	this.animations.x = this.x + parseInt(renderer.mapData.properties.stitchx);
	this.animations.y = this.y;

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

		if (this.dead) {
			return;
		}

		if (this.health <= 0) {
			renderer.itemDrop(this.x, this.y);
			var explosion = explosionSprite.clone(true);
			score += 20 * scoreModifier;
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

		if (player.x < this.x && this.animations.scaleX !== 1) {
			this.animations.scaleX = 1;
			this.animations.regX = 0;
		} else if (player.x > this.x && this.animations.scaleX !== -1) {
			this.animations.scaleX = -1;
			this.animations.regX = this.animations.spriteSheet._frameWidth;
		}

		var distanceFromPlayer = player.x - this.x;
		var distanceFromPlayerY = player.y - this.y;
		if (this.shootTicks === 0 && abs(distanceFromPlayer) < 256 && !this.activated && this.health > 0 && abs(distanceFromPlayerY) < 32) {
			this.watchedElements.push(new Shot(stage, this.x, this.y, -this.animations.scaleX, this, renderer));
			this.shootTicks = 100;
		}

		if (this.shootTicks > 0) {
			this.shootTicks--;
		}

		this.animations.x = this.x - renderer.completedMapsWidthOffset;
		this.animations.y = this.y;
	};

	/**
	 * [playerCollisionActions description]
	 * @return {[type]} [description]
	 */
	this.playerCollisionActions = function() {};

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
		this.y = y + 14;
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