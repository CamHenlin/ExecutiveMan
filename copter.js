function Copter(stage, x, y) {

	var copterSpriteSheet = new createjs.SpriteSheet({
		"images": [loader.getResult("copter")],
		"frames": {
			"width": 17, "height": 14, "count": 2
		},
		"animations": {
			"operate": {
				"frames" : [0, 1],
				"next" : "operate",
				"speed" : (0.001 / lowFramerate) / skipFrames
			}
		}
	}); // new createjs.Bitmap("images/businessmanspritesheet.png");

	this.stage            = stage;
	this.animations       = new createjs.Sprite(copterSpriteSheet, "current");
	this.x                = x;// - 32;
	this.y                = y;
	this.activated        = false;
	this.jumping          = false;
	this.jumpspeed        = 0;
	this.health           = 1;
	this.targetY          = 0;
	this.yStepSize        = 0;
	this.xStepSize        = 0;
	this.hardshell        = false;
	this.movementTicks    = 0;
	this.watchedElements  = [];
	this.animations.x = this.x - mapper.completedMapsWidthOffset;
	this.animations.y = this.y;

	this.animations.play();
	this.stage.addChild(this.animations);

	this.tickActions = function() {
		if (this.health < 0) {
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

		if (player.x < this.x && this.animations.scaleX !== 1) {
			this.animations.scaleX = 1;
			this.animations.regX = 0;
		} else if (player.x > this.x && this.animations.scaleX !== -1) {
			this.animations.scaleX = -1;
			this.animations.regX = this.animations.spriteSheet._frameWidth;
		}


		if (this.movementTicks > 0) {
			this.y -= this.yStepSize;
			this.x -= this.xStepSize;
			this.movementTicks--;
		} else {

			var distanceFromPlayer = player.x - this.x;
			if (Math.abs(distanceFromPlayer) <= 150) {
				this.activated = true;
				this.targetY = player.y + 20;
				this.movementTicks = 100 / lowFramerate;

				this.xStepSize = (this.x - player.x + (32 * this.animations.scaleX)) / this.movementTicks;
				this.yStepSize = (this.y - this.targetY) / (this.movementTicks);
			}
		}
		this.animations.x = this.x - mapper.completedMapsWidthOffset;
		this.animations.y = this.y;
	};
}