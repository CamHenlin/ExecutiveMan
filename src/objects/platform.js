/**
 * [Platform description]
 * @param {[type]} stage          [description]
 * @param {[type]} basicCollision [description]
 * @param {[type]} x              [description]
 * @param {[type]} y              [description]
 * @param {[type]} yrange         [description]
 * @param {[type]} yduration      [description]
 * @param {[type]} xrange         [description]
 * @param {[type]} xduration      [description]
 * @param {[type]} delay          [description]
 */
function Platform(stage, basicCollision, x, y, yrange, yduration, xrange, xduration, delay) {
	var platformSpriteSheet = new createjs.SpriteSheet({
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
	this.animations = new createjs.Sprite(platformSpriteSheet, "still");
	this.x = x + parseInt(renderer.mapData.properties.stitchx); // - 32;
	this.y = y;
	this.initialY = y;
	this.initialX = x;
	this.xrange = xrange;
	this.xSpeed = (xduration !== 0) ? xrange / xduration : 0;
	this.lastx = x;
	this.lasty = y;
	this.yrange = yrange;
	this.ySpeed = (yduration !== 0) ? yrange / yduration : 0;
	this.activated = false;
	this.hardshell = true;
	this.goingup = false;
	this.goingright = false;
	if (xrange > 0) {
		this.goingright = false;
	} else {
		this.goingright = true;
	}
	if (yrange > 0) {
		this.goingup = false;
	} else {
		this.goingup = true;
	}
	this.delay = delay;
	this.watchedElements = [];
	this.animations.x = this.x - renderer.completedMapsWidthOffset;
	this.animations.y = this.y;

	this.animations.play();
	this.stage.addChild(this.animations);
	this.animations.visible = true;

	/**
	 * [tickActions description]
	 * @return {[type]} [description]
	 */
	this.tickActions = function() {
		if (this.delay > 0) {
			this.delay--;
			return;
		}

		if (this.ySpeed !== 0) {
			this.y += (this.goingup) ? -this.ySpeed : this.ySpeed;
			this.animations.y += this.y - this.lasty;
		}

		if (this.xSpeed !== 0) {
			this.x += (this.goingright) ? -this.xSpeed : this.xSpeed;
			this.animations.x += this.x - this.lastx;
		}

		if (this.activated) {
			if (!player.onplatform) {
				this.activated = false;
			}

			if (!fastCollisionPlatform(player, this)) { // player no longer on platform
				player.onplatform = false;
				this.activated = false;
			} else {
				player.y = this.y - player.animations.spriteSheet._frameHeight - ((this.goingup) ? 0 : -this.ySpeed);
				player.x += this.x - this.lastx;
			}
		}

		if (this.ySpeed !== 0) {
			if ((this.y > this.initialY && this.ySpeed > 0) || (this.y < this.initialY && this.ySpeed < 0)) {
				this.goingup = !this.goingup;
			} else if ((this.y < this.initialY - this.yrange && this.ySpeed > 0) || (this.y > this.initialY - this.yrange && this.ySpeed < 0)) {
				this.goingup = !this.goingup;
			}
		}

		if (this.xSpeed !== 0) {
			if ((this.x > this.initialX && this.xSpeed > 0) || (this.x < this.initialX && this.xSpeed < 0)) {
				this.goingright = !this.goingright;
			} else if ((this.x < this.initialX - this.xrange && this.xSpeed > 0) || (this.x > this.initialX - this.xrange && this.xSpeed < 0)) {
				this.goingright = !this.goingright;
			}
		}

		this.lasty = this.y;
		this.lastx = this.x;
	};

	/**
	 * [playerCollisionActions description]
	 * @return {[type]} [description]
	 */
	this.playerCollisionActions = function() {
		if ((this.y < player.y + (player.animations.spriteSheet._frameHeight - 16)) || this.activated || player.jumpspeed < 0) { // player definitely missed the platform
			return;
		}

		if (player.animations.currentAnimation !== "run") {
			playSound("jumpland");
		}

		this.activated = true;
		player.onplatform = true;
		player.jumping = false;
		player.falling = false;
		player.jumpspeed = 0;
		player.jumpCount = 0;
		player.y = this.y - player.animations.spriteSheet._frameHeight;

		if (!player.goingLeft && !player.goingRight) {
			player.animations.gotoAndPlay("stand");
		} else {
			player.animations.gotoAndPlay("run");
		}
	};
}