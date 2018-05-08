var halfwayPointReached = false;

/**
 * [HalfwayPoint description]
 * @param {[type]} stage          [description]
 * @param {[type]} basicCollision [description]
 * @param {[type]} x              [description]
 */
function HalfwayPoint(stage, basicCollision, x) {
	var droppingPlatformSpriteSheet = new createjs.SpriteSheet({
		"images": [loader.getResult("door")],
		"frames": {
			"width": 1,
			"height": 1,
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
	this.animations = new createjs.Sprite(droppingPlatformSpriteSheet, "still");
	this.x = x + parseInt(renderer.mapData.properties.stitchx); // - 32;
	this.ySpeed = 0;
	this.activated = false;
	this.hardshell = true;
	this.watchedElements = [];
	this.animations.x = this.x - renderer.completedMapsWidthOffset;
	this.animations.y = 0;

	this.animations.play();
	this.stage.addChild(this.animations);

	/**
	 * [tickActions description]
	 * @return {[type]} [description]
	 */
	this.tickActions = function() {
		if (halfwayPointReached) {
			return;
		} else {
			halfwayPointReached = true;
		}
	};

	/**
	 * [playerCollisionActions description]
	 * @return {[type]} [description]
	 */
	this.playerCollisionActions = function() {

	};
}