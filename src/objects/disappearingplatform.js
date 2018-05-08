/**
 * [DisappearingPlatform description]
 * @param {[type]} stage          [description]
 * @param {[type]} basicCollision [description]
 * @param {[type]} x              [description]
 * @param {[type]} y              [description]
 * @param {[type]} startTimer     [description]
 * @param {[type]} onDuration     [description]
 * @param {[type]} offDuration    [description]
 */
function DisappearingPlatform(stage, basicCollision, x, y, startTimer, onDuration, offDuration) {
	var disappearingPlatformSpriteSheet = new createjs.SpriteSheet({
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
	this.animations = new createjs.Sprite(disappearingPlatformSpriteSheet, "still");
	this.x = x + parseInt(renderer.mapData.properties.stitchx); // - 32;
	this.y = y;
	this.startTimer = startTimer;
	this.onDuration = onDuration;
	this.offDuration = offDuration;
	this.started = false;
	this.timer = 0;
	this.activated = false;
	this.hardshell = true;
	this.goingup = false;
	this.goingright = false;
	this.watchedElements = [];
	this.animations.x = this.x - renderer.completedMapsWidthOffset - parseInt(renderer.mapData.properties.stitchx);
	this.animations.y = this.y;

	this.animations.play();
	this.stage.addChild(this.animations);
	this.animations.visible = false;

	/**
	 * [tickActions description]
	 * @return {[type]} [description]
	 */
	this.tickActions = function() {
		if (this.activated) {
			if (!player.onplatform) {
				this.activated = false;
			}

			if (!this.animations.isVisible() && !this.playerLeftPlatform) { // player no longer on platform
				if (!fastCollisionPlatform(player, this)) {
					player.onplatform = false;
					this.activated = false;
					this.playerLeftPLatform = true;
				} else {
					player.y = this.y - player.animations.spriteSheet._frameHeight;
				}
			}
		}

		if (this.startTimer === this.timer && !this.started) {
			this.animations.visible = true;
			this.started = true;
			this.timer = 0;
		}

		if (this.timer === this.onDuration) {
			this.animations.visible = false;
			if (fastCollisionPlatform(player, this)) { // player no longer on platform
				player.onplatform = false;
				this.playerLeftPlatform = true;
			}
		}

		if (this.timer === this.onDuration + this.offDuration) {
			this.animations.visible = true;
			this.timer = 0;
		}

		this.timer++;
	};

	/**
	 * [playerCollisionActions description]
	 * @return {[type]} [description]
	 */
	this.playerCollisionActions = function() {
		if ((this.y < player.y + (player.animations.spriteSheet._frameHeight - 12)) || this.activated ||
			!this.animations.visible || player.jumpspeed < 0) { // player definitely missed the platform
			return;
		}

		if (player.animations.currentAnimation !== "run") {
			playSound("jumpland");
		}

		this.activated = true;
		player.onplatform = true;
		this.playerLeftPlatform = false;
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