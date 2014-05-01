function Flood(stage, player, basicCollision, x, y, mapper, original) {

	var floodSpriteSheet = new createjs.SpriteSheet({
		"images": ["images/flood.png"],
		"frames": {
			"width": 32, "height": 32, "count": 4
		},
		"animations": {
			"current": {
				"frames" : [0, 1],
				"next" : "current",
				"speed" : (0.15 * lowFramerate) * skipFrames
			},
			"flooded" : {
				"frames" : [2, 3],
				"next" : "flooded",
				"speed" : (0.15  * lowFramerate) * skipFrames
			}
		}
	}); // new createjs.Bitmap("images/businessmanspritesheet.png");

	this.original         = original;
	this.basicCollision   = basicCollision;
	this.stage            = stage;
	this.animations       = new createjs.Sprite(floodSpriteSheet, "current");
	this.x                = x;// - 32;
	this.y                = y;
	this.activated        = false;
	this.jumping          = false;
	this.jumpspeed        = 0;
	this.advanceTicks     = ((this.original) ? 120 : 30) / lowFramerate;
	this.hardshell        = false;
	this.watchedElements  = [];
	this.spent            = false;
	this.animations.x = this.x - mapper.completedMapsWidthOffset;
	this.animations.y = this.y;

	this.animations.play();
	this.stage.addChild(this.animations);

	this.tickActions = function(actions) {
		if (this.spent) {
			return;
		}

		var distanceFromPlayer = player.x - this.x;
		if (Math.abs(distanceFromPlayer) <= 400 || !this.original) {

			if (this.advanceTicks !== 0) {
				this.advanceTicks--;
			} else if (this.advanceTicks === 0) {
				this.x += 5;
				var collisionResults = this.basicCollision.basicCollision(this);
				if (collisionResults.right) {
					mapper.enemies.push(new Flood(this.stage, player, this.basicCollision, this.x + 27, this.y, mapper, false));
				}
				this.x -= 5;
				this.spent = true;
				this.animations.gotoAndPlay("flooded");
			}
		}
		this.y -= (this.y + this.animations.spriteSheet._frameHeight) % 32;
		this.animations.x = this.x - mapper.completedMapsWidthOffset;
		this.animations.y = this.y;
	};
}