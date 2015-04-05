/**
 * [ComputerGuy description]
 * @param {[type]} stage          [description]
 * @param {[type]} basicCollision [description]
 * @param {[type]} x              [description]
 * @param {[type]} y              [description]
 */
function ComputerGuy(stage, basicCollision, x, y) {
	var printerGuySpriteSheet = new createjs.SpriteSheet({
		"images": [loader.getResult("computerguy")],
		"frames": {
			"width": 23,
			"height": 37,
			"count": 8
		},
		"animations": {
			"sit": {
				"frames": [0],
				"next": "sit"
			},
			"startrun": {
				"frames": [5],
				"next": "run"
			},
			"run": {
				"frames": [2, 3],
				"next": "run",
				"speed": (0.05) / skipFrames
			},
			"jump": {
				"frames": [7],
				"next": "jump",
				"speed": (0.15) / skipFrames
			},
			"startjump": {
				"frames": [4],
				"next": "jump"
			},
			"land": {
				"frames": [6],
				"next": "sit"
			}
		}
	}); // new createjs.Bitmap("images/businessmanspritesheet.png");

	this.basicCollision = basicCollision;
	this.health = 3;
	this.damage = 2;
	this.stage = stage;
	this.animations = new createjs.Sprite(printerGuySpriteSheet, "sit");
	this.x = x + parseInt(renderer.mapData.properties.stitchx);
	this.y = y;
	this.animations.x = x - renderer.completedMapsWidthOffset;
	this.animations.y = y;
	this.activated = false;
	this.jumping = false;
	this.jumpspeed = 0;
	this.jumpTicks = 0;
	this.shootTicks = 0;
	this.dead = false;
	this.hardshell = false;
	this.watchedElements = [];
	this.lastDirectionChangeFromCollision = false;

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

		// end of jump actions
		if (this.jumpTicks > 0) {
			this.jumpTicks--;
		}

		if (this.health <= 0) {
			renderer.itemDrop(this.x, this.y);
			score += 5 * scoreModifier;
			var explosion = explosionSprite.clone(true);
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

		var distanceFromPlayer = player.x - this.x;

		if (player.x < this.x && this.animations.scaleX !== 1 && !this.activated) {
			this.animations.scaleX = 1;
			this.animations.regX = 0;
		} else if (player.x > this.x && this.animations.scaleX !== -1 && !this.activated) {
			this.animations.scaleX = -1;
			this.animations.regX = this.animations.spriteSheet._frameWidth;
		}

		var collisionResults = this.basicCollision.basicCollision(this);
		if (collisionResults.down && !this.jumping) {
			this.jumpspeed = 0;
			this.jumping = true;
		}

		if (!collisionResults.down) {
			this.y -= (this.y + this.animations.spriteSheet._frameHeight) & 15; // (numerator % divisor) === (numerator & (divisor - 1)); and we're doing: spriteSheet._frameHeight) % 16;
		}

		if (!collisionResults.down && this.jumping) {
			this.jumping = false;
			this.jumpspeed = 0;
			this.animations.gotoAndPlay("run");
		}

		if (this.jumping && collisionResults.down) {
			this.jumpspeed += 0.25;
			if (this.jumpspeed > 12) {
				this.jumpspeed = 12;
			}

			this.y += this.jumpspeed;
		}

		if (this.activated) {
			if ((!collisionResults.left && this.animations.scaleX === 1) || (!collisionResults.right && this.animations.scaleX === -1) ||
				this.x < renderer.completedMapsWidthOffset || this.x > renderer.completedMapsWidthOffset + renderer.getMapWidth()) {

				this.animations.scaleX = this.animations.scaleX * -1;
				if (this.animations.scaleX === -1) {
					this.animations.regX = this.animations.spriteSheet._frameWidth;
				} else {
					this.animations.regX = 0;
				}
			}
			this.x += (this.animations.scaleX !== 1) ? 1.875 : -1.875;
		}

		if (abs(distanceFromPlayer) <= 128 && this.animations.currentAnimation !== "run" && !this.lastDirectionChangeFromCollision && !this.activated && !this.jumping) {
			if (distanceFromPlayer > 0) {
				this.animations.scaleX = -1;
				this.animations.regX = this.animations.spriteSheet._frameWidth;
			} else {
				this.animations.scaleX = 1;
			}
			this.activated = true;
			this.animations.gotoAndPlay("startrun");
		}


		if (this.jumpTicks === 0 && abs(distanceFromPlayer) <= 32 && this.jumpspeed === 0 && !this.jumping) {
			this.jumpTicks = 160;
			this.y -= 2;
			this.jumping = true;
			this.jumpspeed = -3.875;
			this.animations.gotoAndPlay("startjump");
		}

		if (abs(distanceFromPlayer) >= 256 && this.activated) {
			this.activated = false;
			this.animations.gotoAndPlay("sit");
		}

		if (this.shootTicks > 0) {
			this.shootTicks--;
		}

		this.animations.x = this.x - renderer.completedMapsWidthOffset;
		this.animations.y = this.y;
	};
}