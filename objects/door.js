function Door(stage, basicCollision, x, y) {

	var doorSpriteSheet = new createjs.SpriteSheet({
		"images": [loader.getResult("door")],
		"frames": {
			"width": 16, "height": 48, "count": 7
		},
		"animations": {
			"still": {
				"frames" : [0],
				"next" : "still"
			},
			"open" : {
				"frames" : [0, 1, 2, 3, 4, 5, 6],
				"next" : "holdopen",
				"speed" : (0.1  / lowFramerate) / skipFrames
			},
			"holdopen": {
				"frames" : [6],
				"next" : "holdopen"
			}
		}
	}); // new createjs.Bitmap("images/businessmanspritesheet.png");

	this.damage           = 0;
	this.basicCollision   = basicCollision;
	this.stage            = stage;
	this.animations       = new createjs.Sprite(doorSpriteSheet, "still");
	this.x                = x;// - 32;
	this.y                = y;
	this.activated        = false;
	this.down             = false;
	this.hardshell        = true;
	this.watchedElements  = [];
	this.animations.x = this.x - mapper.completedMapsWidthOffset;
	this.animations.y = this.y;

	this.animations.play();
	this.stage.addChild(this.animations);

	this.tickActions = function() {
	};

	this.playerCollisionActions = function() {
		if (this.down) {
			return;
		}

		player.actions.playerLeft = false;
		player.actions.playerRight = false;
		player.animations.gotoAndPlay("stand");
		player.ignoreInput = true;
		player.ignoreBounceBack = true;
		player.ignoreDamage = true;
		this.animations.gotoAndPlay("open");
		setTimeout(function() {
			player.ignoreInput = false;
			player.ignoreBounceBack = false;
			this.down = true;
		}.bind(this), 3000);
		setTimeout(function() {
			player.ignoreDamage = false;
		}.bind(this), 6000);
	};
}