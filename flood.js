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
				"speed" : (0.15 * mapper.lowFramerate) * mapper.skipFrames
			},
			"flooded" : {
				"frames" : [2, 3],
				"next" : "flooded",
				"speed" : (0.15  * mapper.lowFramerate) * mapper.skipFrames
			}
		}
	}); // new createjs.Bitmap("images/businessmanspritesheet.png");

	this.original         = original;
	this.mapper           = mapper;
	this.basicCollision   = basicCollision;
	this.player           = player;
	this.stage            = stage;
	this.animations       = new createjs.Sprite(floodSpriteSheet, "current");
	this.x                = x;// - 32;
	this.y                = y;
	this.activated        = false;
	this.jumping          = false;
	this.jumpspeed        = 0;
	this.advanceTicks     = ((this.original) ? 120 : 30) / this.mapper.lowFramerate;
	this.hardshell        = false;
	this.watchedElements  = [];
	this.spent            = false;
	this.animations.x = this.x - this.mapper.completedMapsWidthOffset;
	this.animations.y = this.y;

	this.animations.play();
	this.stage.addChild(this.animations);

	this.tickActions = function(actions) {
		if (this.spent) {
			return;
		}

		var distanceFromPlayer = this.player.x - this.x;
		if (Math.abs(distanceFromPlayer) <= 400 || !this.original) {

			if (this.advanceTicks !== 0) {
				this.advanceTicks--;
			} else if (this.advanceTicks === 0) {
				this.x += 5;
				var collisionResults = this.basicCollision.basicCollision(this);
				if (collisionResults.right) {
					this.mapper.enemies.push(new Flood(this.stage, this.player, this.basicCollision, this.x + 27, this.y, this.mapper, false));
				}
				this.x -= 5;
				this.spent = true;
				this.animations.gotoAndPlay("flooded");
			}
		}
		this.y -= (this.y + this.animations.spriteSheet._frameHeight) % 32;
		this.animations.x = this.x - this.mapper.completedMapsWidthOffset;
		this.animations.y = this.y;
	};
}