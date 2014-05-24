function Platform(stage, basicCollision, x, y, yrange, yduration, xrange, xduration) {

	var platformSpriteSheet = new createjs.SpriteSheet({
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
	this.animations       = new createjs.Sprite(platformSpriteSheet, "still");
	this.x                = x;// - 32;
	this.y                = y;
	this.initialY         = y;
	this.initialX         = x;
	this.xrange           = xrange;
	this.xSpeed           = xrange / xduration;
	this.lastx            = x;
	this.yrange           = yrange;
	this.ySpeed           = yrange / yduration;
	this.activated        = false;
	this.hardshell        = true;
	this.goingup          = false;
	this.goingright       = false;
	this.watchedElements  = [];
	this.animations.x = this.x - mapper.completedMapsWidthOffset;
	this.animations.y = this.y;

	this.animations.play();
	this.stage.addChild(this.animations);

	this.tickActions = function() {
		this.y += (this.goingup) ? -this.ySpeed : this.ySpeed;
		this.animations.y = this.y;
		this.x += (this.goingright) ? -this.xSpeed : this.xSpeed;
		this.animations.x = this.x;

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

		if (this.y > this.initialY) {
			this.goingup = true;
		} else if (this.y < this.initialY - this.yrange) {
			this.goingup = false;
		}

		if (this.x > this.initialX) {
			this.goingright = true;
		} else if (this.x < this.initialX - this.xrange) {
			this.goingright = false;
		}

		this.lastx = this.x;
	};

	this.playerCollisionActions = function() {
		if ((this.y < player.y + (player.animations.spriteSheet._frameHeight - 12)) || this.activated || player.jumpspeed < 0) { // player definitely missed the platform
			return;
		}

		playSound("jumpland");

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