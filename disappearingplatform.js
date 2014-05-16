function DisappearingPlatform(stage, basicCollision, x, y, startTimer, onDuration, offDuration) {

	var disappearingPlatformSpriteSheet = new createjs.SpriteSheet({
		"images": [loader.getResult("door")],
		"frames": {
			"width": 16, "height": 16, "count": 7
		},
		"animations": {
			"still": {
				"frames" : [0],
				"next" : "still"
			}
		}
	}); // new createjs.Bitmap("images/businessmanspritesheet.png");

	this.damage           = 0;
	this.basicCollision   = basicCollision;
	this.stage            = stage;
	this.animations       = new createjs.Sprite(disappearingPlatformSpriteSheet, "still");
	this.x                = x;// - 32;
	this.y                = y;
	this.startTimer       = startTimer;
	this.onDuration       = onDuration;
	this.offDuration      = offDuration;
	this.started          = false;
	this.timer            = 0;
	this.activated        = false;
	this.hardshell        = true;
	this.goingup          = false;
	this.goingright       = false;
	this.watchedElements  = [];
	this.animations.x = this.x - mapper.completedMapsWidthOffset;
	this.animations.y = this.y;

	this.animations.play();
	this.stage.addChild(this.animations);
	this.animations.visible = false;

	this.tickActions = function() {
		if (this.activated) {
			if (!player.onplatform) {
				this.activated = false;
			}

			if (!fastCollisionPlatform(player, this) || !this.animations.isVisible()) { // player no longer on platform
				player.onplatform = false;
				this.activated = false;
			} else {
				player.y = this.y - player.animations.spriteSheet._frameHeight;
			}
		}

		if (this.startTimer === this.timer && !this.started) {
			this.animations.visible = true;
			this.started = true;
			this.timer = 0;
		}

		if (this.timer === this.onDuration) {
			this.animations.visible = false;
			player.onplatform = false;
			this.activated = false;
		}

		if (this.timer === this.onDuration + this.offDuration) {
			this.animations.visible = true;
			this.timer = 0;
		}

		this.timer++;
	};

	this.playerCollisionActions = function() {
		if ((this.y < player.y + (player.animations.spriteSheet._frameHeight - 12)) || this.activated || 
			!this.animations.isVisible() || player.jumpspeed < 0) { // player definitely missed the platform
			return;
		}

		this.activated = true;
		player.onplatform = true;
		player.jumping = false;
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