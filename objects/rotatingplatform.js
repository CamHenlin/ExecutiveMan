/**
 * [RotatingPlatform description]
 * @param {[type]} stage          [description]
 * @param {[type]} basicCollision [description]
 * @param {[type]} x              [description]
 * @param {[type]} y              [description]
 * @param {[type]} xspeed         [description]
 * @param {[type]} yspeed         [description]
 */
function RotatingPlatform(stage, basicCollision, x, y, xspeed, yspeed) {
	var platformSpriteSheet = new createjs.SpriteSheet({
		"images": [loader.getResult("rotatingplatform")],
		"frames": {
			"width": 16,
			"height": 16,
			"count": 2
		},
		"animations": {
			"still": {
				"frames": [0, 1],
				"next": "still",
				"speed": 0.125
			}
		}
	}); // new createjs.Bitmap("images/businessmanspritesheet.png");


	this.damage = 0;
	this.basicCollision = basicCollision;
	this.stage = stage;
	this.animations = new createjs.Sprite(platformSpriteSheet, "still");
	this.x = x + parseInt(renderer.mapData.properties.stitchx); // - 32;
	this.y = y;
	this.xspeed = xspeed;
	this.lastx = x + parseInt(renderer.mapData.properties.stitchx);
	this.lasty = y;
	this.yspeed = yspeed;
	this.activated = false;
	this.hardshell = true;
	this.goingup = false;
	this.goingright = false;
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
		if (this.xspeed < 0 && this.x < renderer.completedMapsWidthOffset) {
			this.x = renderer.getMapWidth() + renderer.completedMapsWidthOffset;
			this.lastx = this.x;
			this.animations.x = this.x - renderer.completedMapsWidthOffset;
		}

		if (this.yspeed < 0 && this.y < 0) {
			this.y = renderer.getMapHeight() + 16;
			this.lasty = this.y;
			this.animations.y = this.y;
		}

		if (this.xspeed > 0 && this.x > renderer.getMapWidth() + renderer.completedMapsWidthOffset) {
			this.x = renderer.completedMapsWidthOffset;
			this.lastx = this.x;
			this.animations.x = 0;
		}

		if (this.yspeed > 0 && this.y > renderer.getMapHeight()) {
			this.y = 0;
			this.lasty = this.y;
			this.animations.y = this.y;
		}

		this.y += this.yspeed;
		this.animations.y += this.y - this.lasty;

		if (this.xspeed !== 0) {
			this.x += this.xspeed;
			this.animations.x += this.x - this.lastx;
		}

		if (this.activated) {
			if (!fastCollisionPlatform(player, this)) { // player no longer on platform
				player.onplatform = false;
				this.activated = false;
			} else {
				player.y = this.y - player.animations.spriteSheet._frameHeight;
				if (player.gameActions.collisionResults.rightmove && player.gameActions.collisionResults.leftmove) {
					player.x += this.x - this.lastx;
				}

				player.onplatform = true;
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