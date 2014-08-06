
function Death(stage, x, y) {

	var deathSpriteSheet = new createjs.SpriteSheet({
		"images": [loader.getResult("death")],
		"frames": {
			"width": 16, "height": 16, "count": 2
		},
		"animations": {
			"death": {
				"frames" : [0, 1],
				"next" : "death",
				"speed" : 0.05
			},
			"altdeath": {
				"frames" : [1, 0],
				"next" : "altdeath",
				"speed" : 0.05
			}
		}
	}); // new createjs.Bitmap("images/businessmanspritesheet.png");

	this.damage           = 0;
	this.stage            = stage;
	this.x                = x;// - 32;
	this.y                = y;

	this.animations = [];
	for (var i = 0; i < 8; i++) {
		console.log("DEATH");
		this.animations[i] = new createjs.Sprite(deathSpriteSheet, "death");
		this.animations[i].x = this.x - mapper.completedMapsWidthOffset;
		this.animations[i].y = this.y;
		this.animations[i].play();
		this.stage.addChild(this.animations[i]);

		// 0.785 = pi/4
		this.animations[i].ySpeed = Math.cos(0.785 * i);
		this.animations[i].xSpeed = Math.sin(0.785 * i);
	}

	setTimeout(function() {
		for (var i = 8; i < 16; i++) {
			console.log("DEATH");
			this.animations[i] = new createjs.Sprite(deathSpriteSheet, "altdeath");
			this.animations[i].x = this.x - mapper.completedMapsWidthOffset;
			this.animations[i].y = this.y;
			this.animations[i].play();
			this.stage.addChild(this.animations[i]);

			// 0.785 = pi/4
			// 0.393 = pi/8
			this.animations[i].ySpeed = Math.cos(0.785 * i + 0.393);
			this.animations[i].xSpeed = Math.sin(0.785 * i + 0.393);
		}
	}.bind(this), 350);

	mapper.enemies.push(this);

	this.tickActions = function() {

		for (var i in this.animations) {
			this.animations[i].x += this.animations[i].xSpeed;
			this.animations[i].y += this.animations[i].ySpeed;
		}
	};

	this.playerCollisionActions = function() {

	};
}