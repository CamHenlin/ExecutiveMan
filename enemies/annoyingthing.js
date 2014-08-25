function AnnoyingThing(stage, basicCollision, x, y) {

	var annoyingthingSpriteSheet = new createjs.SpriteSheet({
		"images": [loader.getResult("annoyingthing")],
		"frames": {
			"width": 16, "height": 8, "count": 4
		},
		"animations": {
			"left": {
				"frames" : [0, 1],
				"next" : "left",
				"speed" : (4 / lowFramerate) / skipFrames
			},
			"right" : {
				"frames" : [3, 2],
				"next" : "right",
				"speed" : (4 / lowFramerate) / skipFrames
			},
			"pause" : {
				"frames" : [0, 3],
				"next" : "pause",
				"speed" : (2 / lowFramerate) / skipFrames
			}
		}
	}); // new createjs.Bitmap("images/businessmanspritesheet.png");

	this.basicCollision   = basicCollision;
	this.health           = 1;
	this.damage           = 4;
	this.stage            = stage;
	this.animations       = new createjs.Sprite(annoyingthingSpriteSheet, "pause");
	this.x                = x;
	this.y                = y;
	this.direction        = true; // true is left
	this.pausecounter     = 0;
	this.animations.x     = x;
	this.animations.y     = y;
	this.xSpeed           = 0;
	this.activated        = false;
	this.jumping          = false;
	this.jumpspeed        = 0;
	this.dead             = false;
	this.lastHit          = false;
	this.pauseTicks       = -1;
	this.hardshell        = true;
	this.watchedElements  = [];
	this.directionTimer   = 0;
	this.animations.play();
	this.stage.addChild(this.animations);

	this.tickActions = function(actions) {
		this.watchedElements.forEach(function(element) {
			element.tickActions(actions);
		});

		if (this.dead) {
			return;
		}

		if (this.pauseTicks > 0) {
			this.pauseTicks--;
			return;
		} else {
			if (this.direction) {
				this.animations.gotoAndPlay('left');
			} else {
				this.animations.gotoAndPlay('right');
			}

			this.pauseTicks--;
		}

		var collisionResults = this.basicCollision.basicCollision(this);
		if (collisionResults.down && !this.jumping) {
			this.jumpspeed = 0;
			this.jumping = true;
		}

		if (this.jumping && collisionResults.down) {
			this.jumpspeed += 0.25;
			if (this.jumpspeed > 8 * lowFramerate) {
				this.jumpspeed = 8 * lowFramerate;
			}

			this.y += this.jumpspeed;
		}

		if (!collisionResults.down && this.jumping) {
			this.jumping = false;
			this.jumpspeed = 0;

			this.animations.gotoAndPlay("pause");
		}

		if (!collisionResults.down) {
			this.y -= (this.y + this.animations.spriteSheet._frameHeight) % 16;
		}


		if (player.y + player.animations.spriteSheet._frameHeight === this.y + this.animations.spriteSheet._frameHeight) {
			this.activated = true;
		} else {
			this.activated = false;
		}

		// playerCollisionPoints, collisionArray, heightOffset, widthOffset

		// console.log({ x: futurex, y: hity, animations: animations });
		if (this.directionTimer === 0) {

			var futurex = this.x + ((this.direction) ? -14 : 14);
			var futureCollisionPoints = {
				leftTop : { x: this.x, y: this.y },
				leftBottom : { x: this.x, y: this.y + this.animations.spriteSheet._frameHeight - 4 },
				bottomLeft : { x: futurex, y: this.y + this.animations.spriteSheet._frameHeight + 8 },
				bottomRight : { x: futurex + this.animations.spriteSheet._frameWidth, y: this.y + this.animations.spriteSheet._frameHeight + 8 },
				rightBottom : { x: this.x + this.animations.spriteSheet._frameWidth, y: this.y + this.animations.spriteSheet._frameHeight - 4 },
				rightTop : { x: this.x + this.animations.spriteSheet._frameWidth, y: this.y },
				topRight : { x: this.x + this.animations.spriteSheet._frameWidth, y: this.y },
				topLeft : { x: this.x, y: this.y }
			};
			var checkDirectionChangeCollisionResults = tileCollisionDetector.checkCollisions(futureCollisionPoints, renderer.collisionArray, renderer.getCurrentHeightOffset(), (renderer.widthOffset + renderer.completedMapsWidthOffset));
			if ((checkDirectionChangeCollisionResults.downmove) ||
				(!checkDirectionChangeCollisionResults.rightmove ||
				 !checkDirectionChangeCollisionResults.leftmove)) {

				this.directionTimer = 1;
				this.direction = !this.direction;
				if (this.direction) {
					this.animations.gotoAndPlay('left');
				} else {
					this.animations.gotoAndPlay('right');
				}
			}
		} else {
			this.directionTimer--;
		}
		if (this.activated) {
			this.x += ((this.direction) ? -2 : 2);
		} else {
			this.x += ((this.direction) ? -1.25 : 1.25);
		}

		this.animations.x = this.x - renderer.completedMapsWidthOffset;
		this.animations.y = this.y;
	};
}