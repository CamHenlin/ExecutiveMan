/**
 * [BigHealth description]
 * @param {[type]} stage          [description]
 * @param {[type]} x              [description]
 * @param {[type]} y              [description]
 * @param {[type]} basicCollision [description]
 */
function BigHealth(stage, x, y, basicCollision) {
	var bigHealthSpriteSheet = new createjs.SpriteSheet({
		"images": [loader.getResult("bighealth")],
		"frames": {
			"width": 12,
			"height": 12,
			"count": 2
		},
		"animations": {
			"blink": {
				"frames": [0, 0, 1, 1, 1, 1],
				"next": "blink",
				"speed": (0.125) / skipFrames
			}
		}
	}); // new createjs.Bitmap("images/businessmanspritesheet.png");

	this.stage = stage;
	this.animations = new createjs.Sprite(bigHealthSpriteSheet, "blink");
	this.x = x + parseInt(renderer.mapData.properties.stitchx); // - 32;
	this.y = y;
	this.activated = false;
	this.jumping = false;
	this.jumpspeed = 0;
	this.damage = -10;
	this.health = 1;
	this.basicCollision = basicCollision;
	this.hardshell = false;
	this.movementTicks = 0;
	this.watchedElements = [];
	this.animations.x = this.x - renderer.completedMapsWidthOffset;
	this.animations.y = this.y;

	this.animations.play();
	this.stage.addChild(this.animations);

	/**
	 * [tickActions description]
	 * @return {[type]} [description]
	 */
	this.tickActions = function() {
		this.watchedElements.forEach(function(element) {
			element.tickActions(actions);
		});

		if (this.activated) {
			return;
		}

		if (this.health < 0) {
			this.stage.removeChild(this.animations);
			playSoundTwice("health");
			this.activated = true;
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

		if (!collisionResults.down) {
			this.y -= (this.y + this.animations.spriteSheet._frameHeight) & 15; // (numerator % divisor) === (numerator & (divisor - 1)); and we're doing: spriteSheet._frameHeight) % 16;
		}

		this.animations.x = this.x - renderer.completedMapsWidthOffset;
		this.animations.y = this.y;
	};
}