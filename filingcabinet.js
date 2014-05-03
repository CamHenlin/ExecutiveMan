function FilingCabinet(stage, basicCollision, x, y) {

	var filingCabinetSpriteSheet = new createjs.SpriteSheet({
		"images": [loader.getResult("filingcabinet")],
		"frames": {
			"width": 22, "height": 47, "count": 2
		},
		"animations": {
			"sit": {
				"frames" : [0],
				"next" : "sit"
			},
			"jump" : {
				"frames" : [1],
				"next" : "jump"
			}
		}
	}); // new createjs.Bitmap("images/businessmanspritesheet.png");

	this.basicCollision   = basicCollision;
	this.health           = 8;
	this.stage            = stage;
	this.animations       = new createjs.Sprite(filingCabinetSpriteSheet, "sit");
	this.x                = x;
	this.y                = y;
	this.xSpeed           = 0;
	this.activated        = false;
	this.jumping          = false;
	this.jumpspeed        = 0;
	this.jumpTicks        = 0;
	this.hardshell        = false;
	this.dead             = false;
	this.watchedElements  = [];

	this.animations.play();
	this.stage.addChild(this.animations);

	this.tickActions = function(actions) {
		this.watchedElements.forEach(function(element) {
			element.tickActions(actions);
		});

		if (this.health < 0) {
			return;
		}

		if (this.health <= 0) {
			var explosion = explosionSprite.clone(true);
			explosion.x = this.animations.x + this.animations.spriteSheet._frameWidth / 2;
			explosion.y = this.animations.y + this.animations.spriteSheet._frameHeight / 2;
			this.stage.removeChild(this.animations);
			explosion.gotoAndPlay("explode");
			this.stage.addChild(explosion);
			this.health = -1;
			setTimeout(function() {
				this.stage.removeChild(explosion);
			}.bind(this), 250);
			this.dead = true;
			return;
		}

		if (this.jumpTicks > 0) {
			if (this.jumpTicks > 60 / lowFramerate) {
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
			this.jumpspeed += 0.25;
			if (this.jumpspeed > 6 * lowFramerate) {
				this.jumpspeed = 6 * lowFramerate;
			}

			this.y += this.jumpspeed;
		}

		if (!collisionResults.down && this.jumping) {
			this.jumping = false;
			this.jumpspeed = 0;

			this.animations.gotoAndPlay("sit");
		}

		if (!collisionResults.down) {
			this.y -= (this.y + this.animations.spriteSheet._frameHeight) % 16;
		}


		// figure out if we can shoot or not
		var distanceFromPlayer = player.x - this.x;
		if (this.jumpTicks === 0 && Math.abs(distanceFromPlayer) < 175 && !this.jumping) {
			this.jumpTicks = 90 / lowFramerate;
			this.y -= 5;
			this.jumping = true;
			this.jumpspeed = -5 * lowFramerate;
			this.animations.gotoAndPlay("jump");
			this.xSpeed = distanceFromPlayer / (this.jumpTicks - 60) / lowFramerate;
		}

		if (distanceFromPlayer > 0) {
			this.animations.scaleX = -1;
			this.animations.regX = this.animations.spriteSheet._frameWidth;
		} else {
			this.animations.scaleX  = 1;
			this.animations.regX = 0;
		}

		this.animations.x = this.x - mapper.completedMapsWidthOffset;
		this.animations.y = this.y;
	};
}