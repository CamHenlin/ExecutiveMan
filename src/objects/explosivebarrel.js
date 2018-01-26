/**
 * [ExplosiveBarrel description]
 * @param {[type]} stage          [description]
 * @param {[type]} basicCollision [description]
 * @param {[type]} x              [description]
 * @param {[type]} y              [description]
 */
function ExplosiveBarrel(stage, basicCollision, x, y) {
	var explosiveBarrelSpriteSheet = new createjs.SpriteSheet({
		"images": [loader.getResult("explosivebarrel")],
		"frames": {
			"width": 24,
			"height": 32,
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
	this.animations = new createjs.Sprite(explosiveBarrelSpriteSheet, "still");
	this.x = x + parseInt(renderer.mapData.properties.stitchx); // - 32;
	this.y = y;
	this.activated = false;
	this.hardshell = false;
	this.watchedElements = [];
	this.animations.x = this.x - renderer.completedMapsWidthOffset;
	this.animations.y = this.y;

	this.animations.play();
	this.stage.addChild(this.animations);
	this.animations.visible = true;

	/**
	 * [tickActions description]
	 * @return {[type]} [description]
	 */
	this.tickActions = function() {
		if (this.activated) {
			renderer.enemies.forEach(function(enemy) {
				if (enemy.constructor === ExplosiveBarrel) {
					enemy.activated = true;
				}
			});

			var explosions = [];
			for (var i = 0; i < 5; i++) {
				explosions[i] = explosionSprite.clone(true);
				this.stage.addChild(explosions[i]);
				explosions[i].gotoAndPlay("explode");
			}
			explosions[0].x = this.animations.x + this.animations.spriteSheet._frameWidth / 2;
			explosions[0].y = this.animations.y + this.animations.spriteSheet._frameHeight / 2;

			explosions[1].x = this.animations.x;
			explosions[1].y = this.animations.y;

			explosions[2].x = this.animations.x + this.animations.spriteSheet._frameWidth;
			explosions[2].y = this.animations.y;

			explosions[3].x = this.animations.x;
			explosions[3].y = this.animations.y + this.animations.spriteSheet._frameHeight;

			explosions[4].x = this.animations.x + this.animations.spriteSheet._frameWidth;
			explosions[4].y = this.animations.y + this.animations.spriteSheet._frameHeight;

			setTimeout(function() {
				this.stage.removeChild(this.animations);
			}.bind(this), 150);

			setTimeout(function() {
				player.fallThroughFloor = true;
			}.bind(this), 1000);

			this.health = -1;
			setTimeout(function() {
				for (var i = 0; i < 5; i++) {
					this.stage.removeChild(explosions[i]);
				}
			}.bind(this), 300);
		}
	};

	/**
	 * [playerCollisionActions description]
	 * @return {[type]} [description]
	 */
	this.playerCollisionActions = function() {
		if ((this.y < player.y + (player.animations.spriteSheet._frameHeight - 16)) || this.activated || player.jumpspeed < 0) { // player definitely missed the platform
			return;
		}

		if (player.animations.currentAnimation !== "run") {
			playSound("jumpland");
		}

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