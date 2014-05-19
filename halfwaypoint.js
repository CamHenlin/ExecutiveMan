var halfwayPointReached = false;
function HalfwayPoint(stage, basicCollision, x) {

	var droppingPlatformSpriteSheet = new createjs.SpriteSheet({
		"images": [loader.getResult("door")],
		"frames": {
			"width": 1, "height": 1, "count": 1
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
	this.animations.y = 0;

	this.animations.play();
	this.stage.addChild(this.animations);

	this.tickActions = function() {
		if (halfwayPointReached) {
			return;
		} else {
			halfwayPointReached = true;
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