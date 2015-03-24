/**
 * [Flood description]
 * @param {[type]} stage          [description]
 * @param {[type]} basicCollision [description]
 * @param {[type]} x              [description]
 * @param {[type]} y              [description]
 * @param {[type]} original       [description]
 */
function Flood(stage, basicCollision, x, y, original) {

	var floodSpriteSheet = new createjs.SpriteSheet({
		"images": [loader.getResult("flood")],
		"frames": {
			"width": 16,
			"height": 16,
			"count": 4
		},
		"animations": {
			"current": {
				"frames": [0, 1],
				"next": "current",
				"speed": (0.15) / skipFrames
			},
			"flooded": {
				"frames": [2, 3],
				"next": "flooded",
				"speed": (0.15) / skipFrames
			}
		}
	}); // new createjs.Bitmap("images/businessmanspritesheet.png");

	this.original = original;
	this.damage = 3;
	this.basicCollision = basicCollision;
	this.stage = stage;
	this.animations = new createjs.Sprite(floodSpriteSheet, "current");
	this.x = x + parseInt(renderer.mapData.properties.stitchx); // - 32;
	this.y = y;
	this.activated = false;
	this.jumping = false;
	this.jumpspeed = 0;
	this.advanceTicks = ((this.original) ? 60 : 20);
	this.hardshell = false;
	this.watchedElements = [];
	this.spent = false;
	this.animations.x = this.x - renderer.completedMapsWidthOffset;
	this.animations.y = this.y;

	this.animations.play();
	this.stage.addChild(this.animations);

	/**
	 * [tickActions description]
	 * @return {[type]} [description]
	 */
	this.tickActions = function() {
		if (this.spent) {
			return;
		}

		var distanceFromPlayer = player.x - this.x;
		if (abs(distanceFromPlayer) <= 300 || !this.original) {

			if (this.advanceTicks !== 0) {
				this.advanceTicks--;
			} else if (this.advanceTicks === 0) {
				this.x += 2.5;
				var collisionResults = this.basicCollision.basicCollision(this);
				if (collisionResults.right) {
					renderer.enemies.push(new Flood(this.stage, this.basicCollision, this.x + 13.5 - parseInt(renderer.mapData.properties.stitchx), this.y, false));
				}
				this.x -= 2.5;
				this.spent = true;
				this.animations.gotoAndPlay("flooded");
			}
		}
		this.y -= (this.y + this.animations.spriteSheet._frameHeight) & 15; // (numerator % divisor) === (numerator & (divisor - 1)); and we're doing: spriteSheet._frameHeight) % 16;
		this.animations.x = this.x - renderer.completedMapsWidthOffset;
		this.animations.y = this.y;
	};
}