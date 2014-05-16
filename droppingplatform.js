function DroppingPlatform(stage, basicCollision, x, y, duration) {

	var droppingPlatformSpriteSheet = new createjs.SpriteSheet({
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
	this.animations       = new createjs.Sprite(droppingPlatformSpriteSheet, "still");
	this.x                = x;// - 32;
	this.y                = y;
	this.ySpeed           = 0;
	this.timer            = 0;
	this.duration         = duration;
	this.activated        = false;
	this.hardshell        = true;
	this.goingup          = false;
	this.offScreen        = false;
	this.goingright       = false;
	this.watchedElements  = [];
	this.animations.x = this.x - mapper.completedMapsWidthOffset;
	this.animations.y = this.y;

	this.animations.play();
	this.stage.addChild(this.animations);

	this.tickActions = function() {
		if (this.offScreen) {
			return;
		}

		if (this.y > gamestage.canvas.height + 32) {
			this.offScreen = true;
		}

		if (this.activated) {
			if (!fastCollisionPlatform(player, this)) { // player no longer on platform
				player.onplatform = false;
			} else {
				player.y = this.y - player.animations.spriteSheet._frameHeight;
			}

			this.timer++;
		}

		if (this.timer > duration) {
			player.onplatform = false;
			this.y += this.ySpeed;
			this.ySpeed += 0.25;

			if (this.ySpeed > 12) {
				this.ySpeed = 12;
			}
			this.animations.y = this.y;
		}
	};

	this.playerCollisionActions = function() {
		if ((this.y < player.y + (player.animations.spriteSheet._frameHeight - 12)) || this.activated ||
			player.jumpspeed < 0) { // player definitely missed the platform
			return;
		}

	
		var jumplandSound = createjs.Sound.play("jumpland");
		jumplandSound.volume = 0.05;


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