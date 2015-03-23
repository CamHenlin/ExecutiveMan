/**
 * [Beam description]
 * @param {[type]} stage          [description]
 * @param {[type]} basicCollision [description]
 * @param {[type]} x              [description]
 * @param {[type]} y              [description]
 * @param {[type]} xspeed         [description]
 * @param {[type]} yspeed         [description]
 */
function Beam(stage, basicCollision, x, y, xspeed, yspeed) {
	var platformSpriteSheet = new createjs.SpriteSheet({
		"images": [loader.getResult("beam")],
		"frames": {
			"width": 16,
			"height": 16,
			"count": 2
		},
		"animations": {
			"still": {
				"frames": [0, 1],
				"next": "still",
				"speed": 0.0615
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
	this.lastx = x;
	this.lasty = y;
	this.yspeed = yspeed;
	this.activated = false;
	this.hardshell = true;
	this.goingup = false;
	this.goingright = false;
	this.watchedElements = [];
	this.animations.x = x - renderer.completedMapsWidthOffset;
	this.animations.y = this.y;

	this.animations.play();
	this.stage.addChild(this.animations);
	this.animations.visible = true;

	/**
	 * [tickActions description]
	 * @return {[type]} [description]
	 */
	this.tickActions = function() {
		if (this.xspeed < 0 && this.x < 0) {
			this.x = renderer.getMapWidth() + renderer.completedMapsWidthOffset;
			this.lastx = this.x;
			this.animations.x = this.x - renderer.completedMapsWidthOffset;
		}

		if (this.yspeed < 0 && this.y < 0) {
			this.y = renderer.getMapHeight();
			this.lasty = this.y;
			this.animations.y = this.y;
		}

		if (this.xspeed > 0 && this.x > renderer.getMapWidth() + renderer.completedMapsWidthOffset) {
			this.x = renderer.completedMapsWidthOffset;
			this.lastx = this.x;
			this.animations.x = this.x - renderer.completedMapsWidthOffset;
		}

		if (this.yspeed > 0 && this.y > renderer.getMapHeight()) {
			this.y = 0;
			this.lastx = this.y;
			this.animations.y = this.y;
		}

		this.y += this.yspeed;
		this.animations.y += this.y - this.lasty;

		this.x += this.xspeed;
		this.animations.x += this.x - this.lastx;

		this.lasty = this.y;
		this.lastx = this.x;
	};

	/**
	 * [playerCollisionActions description]
	 * @return {[type]} [description]
	 */
	this.playerCollisionActions = function() {

	};
}