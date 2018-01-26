/**
 * [DroppingPlatform description]
 * @param {[type]} stage          [description]
 * @param {[type]} basicCollision [description]
 * @param {[type]} x              [description]
 * @param {[type]} y              [description]
 * @param {[type]} duration       [description]
 */
function DroppingPlatform(stage, basicCollision, x, y, duration) {
	var droppingPlatformSpriteSheet = new createjs.SpriteSheet({
		"images": [loader.getResult("platform")],
		"frames": {
			"width": 16,
			"height": 16,
			"count": 1
		},
		"animations": {
			"still": {
				"frames": [0],
				"next": "still"
			}
		}
	}); // new createjs.Bitmap("images/businessmanspritesheet.png");

	this.damage = 0;
	this.basicCollision = basicCollision;
	this.stage = stage;
	this.animations = new createjs.Sprite(droppingPlatformSpriteSheet, "still");
	this.x = x + parseInt(renderer.mapData.properties.stitchx); // - 32;
	this.y = y;
	this.ySpeed = 0;
	this.timer = 0;
	this.duration = duration;
	this.activated = false;
	this.hardshell = true;
	this.goingup = false;
	this.offScreen = false;
	this.playerLeftPlatform = false;
	this.goingright = false;
	this.watchedElements = [];
	this.animations.x = this.x - renderer.completedMapsWidthOffset - parseInt(renderer.mapData.properties.stitchx);
	this.animations.y = this.y;

	this.animations.play();
	this.stage.addChild(this.animations);

	/**
	 * [tickActions description]
	 * @return {[type]} [description]
	 */
	this.tickActions = function() {
		if (this.offScreen) {
			return;
		}

		if (this.playerLeftPlatform) {
			this.timer++;
		}

		if (this.y > gamestage.canvas.height + 32) {
			this.offScreen = true;
		}

		if (this.activated && this.timer <= this.duration && !this.playerLeftPlatform) {
			if (!fastCollisionPlatform(player, this)) { // player no longer on platform
				player.onplatform = false;
				this.playerLeftPlatform = true;
			} else {
				player.y = this.y - player.animations.spriteSheet._frameHeight;
			}

			this.timer++;
		}

		if (this.timer > this.duration) {
			if (fastCollisionPlatform(player, this)) { // player no longer on platform
				player.onplatform = false;
				this.playerLeftPlatform = true;
			}

			this.y += this.ySpeed;
			this.ySpeed += 0.25;

			if (this.ySpeed > 12) {
				this.ySpeed = 12;
			}
			this.animations.y = this.y;
		}
	};

	/**
	 * [playerCollisionActions description]
	 * @return {[type]} [description]
	 */
	this.playerCollisionActions = function() {
		if ((this.y < player.y + (player.animations.spriteSheet._frameHeight - 14)) || this.activated ||
			player.jumpspeed < 0) { // player definitely missed the platform
			return;
		}

		if (player.animations.currentAnimation !== "run") {
			playSound("jumpland");
		}


		this.activated = true;
		player.onplatform = true;
		player.jumping = false;
		player.jumpCount = 0;
		player.falling = false;
		player.jumpspeed = 0;
		player.y = this.y - player.animations.spriteSheet._frameHeight;

		if (!player.goingLeft && !player.goingRight) {
			player.animations.gotoAndPlay("stand");
		} else {
			player.animations.gotoAndPlay("run");
		}
	};
}