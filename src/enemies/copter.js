/**
 * [Copter description]
 * @param {[type]} stage [description]
 * @param {[type]} x     [description]
 * @param {[type]} y     [description]
 */
function Copter(stage, x, y) {

	var copterSpriteSheet = new createjs.SpriteSheet({
		"images": [loader.getResult("copter")],
		"frames": {
			"width": 17,
			"height": 14,
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
	this.flee = false;
	this.targetY = 0;
	this.yStepSize = 0;
	this.xStepSize = 0;
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

		if (player.x < this.x && this.animations.scaleX !== 1) {
			this.animations.scaleX = 1;
			this.animations.regX = 0;
		} else if (player.x > this.x && this.animations.scaleX !== -1) {
			this.animations.scaleX = -1;
			this.animations.regX = this.animations.spriteSheet._frameWidth;
		}


		if (this.movementTicks > 0) {
			if (!this.flee) {
				this.y -= this.yStepSize;
			}
			this.x -= this.xStepSize;
			this.movementTicks--;
		} else {
			var distanceFromPlayer = player.x - this.x;
			if (abs(distanceFromPlayer) <= 150) {
				this.activated = true;
				this.targetY = player.y + 10;
				this.movementTicks = 100;

				this.xStepSize = (this.x - player.x + (32 * this.animations.scaleX)) / this.movementTicks;
				this.yStepSize = (this.y - this.targetY) / (this.movementTicks);
			}
		}
		if (this.flee) {
			this.y--;
		}
		this.animations.x = this.x - renderer.completedMapsWidthOffset;
		this.animations.y = this.y;
	};

	/**
	 * [playerCollisionActions description]
	 * @return {[type]} [description]
	 */
	this.playerCollisionActions = function() {
		this.flee = true;
	};
}