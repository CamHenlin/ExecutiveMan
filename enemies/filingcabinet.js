/**
 * [FilingCabinet description]
 * @param {[type]} stage          [description]
 * @param {[type]} basicCollision [description]
 * @param {[type]} x              [description]
 * @param {[type]} y              [description]
 */
function FilingCabinet(stage, basicCollision, x, y) {

	var filingCabinetSpriteSheet = new createjs.SpriteSheet({
		"images": [loader.getResult("filingcabinet")],
		"frames": {
			"width": 22,
			"height": 47,
			"count": 2
		},
		"animations": {
			"sit": {
				"frames": [0],
				"next": "sit"
			},
			"jump": {
				"frames": [1],
				"next": "jump"
			}
		}
	}); // new createjs.Bitmap("images/businessmanspritesheet.png");

	this.basicCollision = basicCollision;
	this.health = 8;
	this.damage = 3;
	this.stage = stage;
	this.animations = new createjs.Sprite(filingCabinetSpriteSheet, "sit");
	this.x = x + parseInt(renderer.mapData.properties.stitchx);
	this.y = y;
	this.animations.x = x - renderer.completedMapsWidthOffset;
	this.animations.y = y;
	this.xSpeed = 0;
	this.activated = false;
	this.jumping = false;
	this.jumpspeed = 0;
	this.dead = false;
	this.jumpTicks = 0;
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

		if (this.health <= 0) {
			renderer.itemDrop(this.x, this.y);
			var explosion = explosionSprite.clone(true);
			score += 50 * scoreModifier;
			explosion.x = this.animations.x + this.animations.spriteSheet._frameWidth / 2;
			explosion.y = this.animations.y + this.animations.spriteSheet._frameHeight / 2;
			this.stage.removeChild(this.animations);
			explosion.gotoAndPlay("explode");
			this.stage.addChild(explosion);
			this.dead = true;
			setTimeout(function() {
				this.stage.removeChild(explosion);
			}.bind(this), 250);
			this.dead = true;
			return;
		}

		if (this.jumpTicks > 0) {
			if (this.jumpTicks > 60) {
				this.x += this.xSpeed;
			}
			this.jumpTicks--;
		}

		var collisionResults = this.basicCollision.basicCollision(this);
		if (collisionResults.down && !this.jumping) {
			this.jumpspeed = 0;
			this.jumping = true;
		}

		if (this.jumping && collisionResults.down) {
			this.jumpspeed += 0.125;
			if (this.jumpspeed > 6) {
				this.jumpspeed = 6;
			}

			this.y += this.jumpspeed;
		}

		if (!collisionResults.down && this.jumping) {
			this.jumping = false;
			this.jumpspeed = 0;

			this.animations.gotoAndPlay("sit");
		}

		if (!collisionResults.down) {
			this.y -= (this.y + this.animations.spriteSheet._frameHeight) & 15; // (numerator % divisor) === (numerator & (divisor - 1)); and we're doing: spriteSheet._frameHeight) % 16;
		}


		// figure out if we can shoot or not
		var distanceFromPlayer = player.x - this.x;
		if (this.jumpTicks === 0 && abs(distanceFromPlayer) < 175 && !this.jumping) {
			this.jumpTicks = 90;
			this.y -= 5;
			this.jumping = true;
			this.jumpspeed = -5;
			this.animations.gotoAndPlay("jump");
			this.xSpeed = distanceFromPlayer / (this.jumpTicks - 60);
		}

		if (distanceFromPlayer > 0) {
			this.animations.scaleX = -1;
			this.animations.regX = this.animations.spriteSheet._frameWidth;
		} else {
			this.animations.scaleX = 1;
			this.animations.regX = 0;
		}

		this.animations.x = this.x - renderer.completedMapsWidthOffset;
		this.animations.y = this.y;
	};
}