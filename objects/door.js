/**
 * [Door description]
 * @param {[type]} stage          [description]
 * @param {[type]} basicCollision [description]
 * @param {[type]} x              [description]
 * @param {[type]} y              [description]
 */
function Door(stage, basicCollision, x, y) {
	var doorSpriteSheet = new createjs.SpriteSheet({
		"images": [loader.getResult("door")],
		"frames": {
			"width": 16,
			"height": 48,
			"count": 7
		},
		"animations": {
			"still": {
				"frames": [0],
				"next": "still"
			},
			"open": {
				"frames": [0, 1, 2, 3, 4, 5, 6],
				"next": "holdopen",
				"speed": (0.1) / skipFrames
			},
			"holdopen": {
				"frames": [6],
				"next": "holdopen"
			}
		}
	}); // new createjs.Bitmap("images/businessmanspritesheet.png");

	this.damage = 0;
	this.basicCollision = basicCollision;
	this.stage = stage;
	this.animations = new createjs.Sprite(doorSpriteSheet, "still");
	this.x = x + parseInt(renderer.mapData.properties.stitchx); // - 32;
	this.y = y;
	this.activated = false;
	this.down = false;
	this.hardshell = true;
	this.watchedElements = [];
	this.animations.x = this.x - renderer.completedMapsWidthOffset - parseInt(renderer.mapData.properties.stitchx);
	this.animations.y = this.y;

	this.animations.play();
	this.stage.addChild(this.animations);

	/**
	 * [tickActions description]
	 * @return {[type]} [description]
	 */
	this.tickActions = function() {
		if (this.activated) {
			player.animations.x += 0.06115;
			player.x += 0.06115;

			player.actions.playerLeft = false;
			player.actions.playerRight = false;
		}
	};

	/**
	 * [playerCollisionActions description]
	 * @return {[type]} [description]
	 */
	this.playerCollisionActions = function() {
		if (this.down) {
			return;
		}

		player.animations.gotoAndPlay("run");
		this.activated = true;
		player.ignoreInput = true;
		this.animations.gotoAndPlay("open");
		setTimeout(function() {
			player.ignoreInput = false;
			this.down = true;
		}.bind(this), 3000);
	};
}