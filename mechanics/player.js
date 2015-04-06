/**
 * [Player description]
 * @param {[type]} demoMode   [description]
 * @param {[type]} demoParams [description]
 */
function Player(demoMode, demoParams) {
	var StingingAuditShot = function(player, renderer) {
		var shotSpriteSheet = new createjs.SpriteSheet({
			"images": [loader.getResult("moneyspin")],
			"frames": {
				"width": 16,
				"height": 16,
				"count": 2
			},
			"animations": {
				"shot": {
					"frames": [0, 1],
					"next": "shot",
					"speed": 0.25
				}
			}
		});

		this.stage = stage;
		this.damage = 6;
		this.animations = new createjs.Sprite(shotSpriteSheet, "shot");
		this.disabled = true;
		this.activated = false;
		this.animations.play();
		this.xspeed = 0;
		this.yspeed = -2;

		/**
		 * [tickActions description]
		 * @return {[type]} [description]
		 */
		this.tickActions = function() {
			if (this.disabled) {
				return;
			}

			if (!this.activated) {
				if (this.yspeed === 0) {
					var enemy = null;
					var step = 1;
					while (!enemy) {
						for (var i = 0; i < renderer.enemies.length; i++) {
							if (renderer.enemies[i].dead || renderer.enemies[i].y < 0 || renderer.enemies[i].y > renderer.gamestage.height || renderer.enemies[i].damage <= 0) {
								continue;
							}

							var delta = renderer.enemies[i].x - this.x;
							if (abs(delta) < 32 * step) {
								enemy = renderer.enemies[i];
								break;
							}
						}
						if (step > 12) {
							break;
						}
						step++;
					}

					this.activated = true;
					this.yspeed = Math.sin(Math.atan2((enemy.y - this.y) + enemy.animations.spriteSheet._frameHeight / 2, (enemy.x - this.x) + enemy.animations.spriteSheet._frameWidth / 2)) * 2.5;
					this.xspeed = Math.cos(Math.atan2((enemy.y - this.y), (enemy.x - this.x))) * 2.5;
				} else {
					this.y += this.yspeed;
					this.yspeed += 0.0625;
				}
			} else {
				renderer.enemies.forEach(function(enemy) {
					if (enemy.dead) {
						return;
					}

					//var intersection = ndgmrX.checkRectCollision(this.animations, enemy.animations);
					if (fastCollisionX(this, enemy) && !(enemy.constructor === Platform || enemy.constructor === DroppingPlatform || enemy.constructor === DisappearingPlatform) && enemy.constructor !== KillCopy && enemy.constructor !== Phone) {

						if (enemy.constructor === AnnoyingThing) {
							enemy.pauseTicks = 120;
							enemy.animations.gotoAndPlay("pause");
						}

						if (enemy.hardshell) {
							this.x -= this.xspeed * 5;
							this.y -= this.yspeed * 5;
							playSound("shotbounce");
							return;
						}

						if (enemy.constructor === ExplosiveBarrel) {
							enemy.activated = true;
						}
						if (enemy.damage > 0) {
							enemy.health -= 6 * damageModifier;
						}
						this.removeSelf();
					} else if (enemy.constructor === KillCopy && fastCollisionKillCopy(this, enemy)) { // special case due to large overhang of the left side of sprite
						if (enemy.damage > 0) {
							enemy.health -= 6 * damageModifier;
						}
						this.removeSelf();
					} else if (enemy.constructor === Phone && fastCollisionPhone(this, enemy)) { // special case due to large overhang of the left side of sprite
						if (enemy.damage > 0) {
							enemy.health -= 6 * damageModifier;
						}
						this.removeSelf();
					}
				}.bind(this));


				this.x += this.xspeed;
				this.y += this.yspeed;
			}

			if (!this.checkBounds()) {
				this.removeSelf();
			}

			this.animations.x = this.x - renderer.completedMapsWidthOffset;
			this.animations.y = this.y;
		};

		/**
		 * [fireUp description]
		 * @return {[type]} [description]
		 */
		this.fireUp = function() {
			//console.log(player.x - renderer.completedMapsWidthOffset);
			this.x = player.x + ((player.animations.scaleX === 1) ? 26 : -3);
			this.y = player.y + 13.5;
			this.yspeed = 0;
			setTimeout(function() {
				this.disabled = false;
			}.bind(this), 500);

			this.bounced = false;
			this.activated = false;
			this.direction = player.animations.scaleX;
			this.animations.x = this.x - renderer.completedMapsWidthOffset;
			this.animations.y = this.y;
			this.animations.play();
			renderer.enemyContainer.addChild(this.animations);
		};

		/**
		 * [removeSelf description]
		 * @return {[type]} [description]
		 */
		this.removeSelf = function() {
			//console.log("removing");
			renderer.enemyContainer.removeChild(this.animations);
			var explosion = shotExplosionSprite.clone(true);
			explosion.x = this.animations.x - this.animations.spriteSheet._frameWidth / 2;
			explosion.y = this.animations.y - this.animations.spriteSheet._frameHeight / 2;
			renderer.enemyContainer.removeChild(this.animations);
			explosion.gotoAndPlay("explode");

			if (this.checkBounds()) {
				playSound("shotexplode");
			}
			renderer.enemyContainer.addChild(explosion);
			setTimeout(function() {
				renderer.enemyContainer.removeChild(explosion);
			}.bind(this), 15.625); // approx 2 frames
			this.disabled = true;
		};

		this.checkBounds = function() {
			if (this.y < 0 || abs(this.y - player.y) > renderer.gamestage.canvas.height) {
				return false;
			}

			return !(this.x < 0 || abs(this.x - (player.x)) > 400);
		};
	};

	/**
	 * [Shot description]
	 * @param {[type]} player   [description]
	 * @param {[type]} renderer [description]
	 */
	var Shot = function(player, renderer) {
		var shotSpriteSheet = new createjs.SpriteSheet({
			"images": [loader.getResult("shot")],
			"frames": {
				"width": 8,
				"height": 8,
				"count": 1
			},
			"animations": {
				"shot": {
					"frames": [0],
					"next": "shot"
				}
			}
		});

		this.animations = new createjs.Sprite(shotSpriteSheet, "shot");
		this.x = -7.5;
		this.y = -7.5;
		this.disabled = true;
		this.direction = 0;
		this.yspeed = 0;
		this.bounced = false;

		/**
		 * [tickActions description]
		 * @return {[type]} [description]
		 */
		this.tickActions = function() {
			if (this.disabled) {
				return;
			}

			this.x = this.x + (3.5 * this.direction);
			this.y -= this.yspeed;
			this.animations.x = this.x;
			this.animations.y = this.y;

			if (!this.checkBounds()) {
				this.removeSelf();
			}

			renderer.enemies.forEach(function(enemy) {
				if (enemy.dead) {
					return;
				}

				//var intersection = ndgmrX.checkRectCollision(this.animations, enemy.animations);
				if (fastCollisionX(this, enemy) && !(enemy.constructor === Platform || enemy.constructor === DroppingPlatform || enemy.constructor === DisappearingPlatform) && enemy.constructor !== KillCopy && enemy.constructor !== Phone) {

					if (enemy.constructor === AnnoyingThing) {
						enemy.pauseTicks = 120;
						enemy.animations.gotoAndPlay("pause");
					}

					if (enemy.hardshell) {
						this.yspeed = 3.5;
						this.direction = this.direction * (this.bounced) ? 1 : -1;
						this.bounced = true;

						playSound("shotbounce");
						return;
					}

					if (enemy.constructor === ExplosiveBarrel) {
						enemy.activated = true;
					}
					if (enemy.damage > 0) {
						enemy.health -= 1 * damageModifier;
					}
					this.removeSelf();
				} else if (enemy.constructor === KillCopy && fastCollisionKillCopy(this, enemy)) { // special case due to large overhang of the left side of sprite
					if (enemy.damage > 0) {
						enemy.health -= 1 * damageModifier;
					}
					this.removeSelf();
				} else if (enemy.constructor === Phone && fastCollisionPhone(this, enemy)) { // special case due to large overhang of the left side of sprite
					if (enemy.damage > 0) {
						enemy.health -= 1 * damageModifier;
					}
					this.removeSelf();
				}
			}.bind(this));
		};

		/**
		 * [fireUp description]
		 * @return {[type]} [description]
		 */
		this.fireUp = function() {
			//console.log(player.x - renderer.completedMapsWidthOffset);
			this.x = player.x - renderer.completedMapsWidthOffset + ((player.animations.scaleX === 1) ? 26 : -3);
			this.y = player.y + 13.5;
			this.yspeed = 0;
			this.disabled = false;
			this.bounced = false;
			this.direction = player.animations.scaleX;
			this.animations.x = this.x;
			this.animations.y = this.y;
			this.animations.play();
			renderer.enemyContainer.addChild(this.animations);
		};

		/**
		 * [removeSelf description]
		 * @return {[type]} [description]
		 */
		this.removeSelf = function() {
			//console.log("removing");
			renderer.enemyContainer.removeChild(this.animations);
			var explosion = shotExplosionSprite.clone(true);
			explosion.x = this.animations.x - this.animations.spriteSheet._frameWidth / 2;
			explosion.y = this.animations.y - this.animations.spriteSheet._frameHeight / 2;
			renderer.enemyContainer.removeChild(this.animations);
			explosion.gotoAndPlay("explode");

			if (this.checkBounds()) {
				playSound("shotexplode");
			}
			renderer.enemyContainer.addChild(explosion);
			setTimeout(function() {
				renderer.enemyContainer.removeChild(explosion);
			}.bind(this), 15.625); // approx 2 frames
			this.disabled = true;
		};

		/**
		 * [checkBounds description]
		 * @return {[type]} [description]
		 */
		this.checkBounds = function() {
			if (this.y < 0 || abs(this.y - player.y) > renderer.gamestage.canvas.height) {
				return false;
			}

			return !(this.x < 0 || abs(this.x - (player.x - renderer.completedMapsWidthOffset)) > player.gamestage.canvas.width / 2);
		};
	};

	this.playerSpriteSheet = new createjs.SpriteSheet({
		"images": [loader.getResult("businessman")],
		"frames": {
			"width": 30,
			"height": 30,
			"count": 22
		},
		"animations": {
			"stand": {
				"frames": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
				"next": "stand",
				"speed": (0.175) / skipFrames
			},
			"startrun": {
				"frames": [2],
				"next": "run",
				"speed": (0.175) / skipFrames
			},
			"run": {
				"frames": [3, 4, 5, 4],
				"next": "run",
				"speed": (0.175) / skipFrames
			},
			"jump": {
				"frames": [10],
				"next": "jump"
			},
			"standshoot": {
				"frames": [6],
				"next": "standshoot"
			},
			"runshoot": {
				"frames": [7, 8],
				"next": "runshoot",
				"speed": (0.175) / skipFrames
			},
			"damage": {
				"frames": [16],
				"next": "damage",
				"speed": (5) / skipFrames
			},
			"jumpshoot": {
				"frames": [11],
				"next": "jumpshoot"
			},
			"thumbsup": {
				"frames": [18],
				"next": "thumbsup"
			},
			"dropin": {
				"frames": [19, 20],
				"next": "dropin",
				"speed": (0.175) / skipFrames
			},
			"dropcomplete": {
				"frames": [21],
				"next": "stand",
				"speed": (0.175) / skipFrames
			}
		}
	});

	var damageSpriteSheet = new createjs.SpriteSheet({
		"images": [loader.getResult("damage")],
		"frames": {
			"width": 32,
			"height": 32,
			"count": 2
		},
		"animations": {
			"damage": {
				"frames": [1, 0, 1],
				"next": "damage",
				"speed": (0.285) / skipFrames
			}
		}
	});

	this.animations = new createjs.Sprite(this.playerSpriteSheet, "dropin");
	this.damageSprite = new createjs.Sprite(damageSpriteSheet, "damage");
	this.touchDown = false;

	if (demoMode) {
		this.touchDown = true;
		this.animations.gotoAndPlay("stand");
	}

	this.blinkTimer = 10;
	this.x = 48;
	this.lastx = this.x;
	this.y = -32;
	this.goingLeft = false;
	this.goingRight = false;
	this.jumping = true;
	this.onplatform = false;
	this.ignoreBounceBack = true;
	this.falling = true;
	this.pauseMenu = new PauseMenu();
	this.transitionedUp = false;
	this.jumpreleased = true;
	this.jumpspeed = 0;
	this.shootTicks = 0;
	this.watchedElements = [];
	this.paused = false;
	this.dialog = false;
	this.health = 28;
	this.actions = {};
	this.gameActions = {};
	this.shootAnimationTicks = -1;
	this.jumpCount = 0;
	this.gamestage = renderer.gamestage;
	this.ignoreDamage = false;
	this.ignoreInput = false;
	if (!demoMode) {
		this.healthbar = new HealthBar(gamestage, this);
	} else {
		this.healthbar = {
			draw: function() {},
			tickActions: function() {}
		};
		//this.x = demoParams.x;
		this.y = demoParams.y;
		this.animations.y = demoParams.y;
		this.x++;
	}
	this.animations.x = this.x;
	this.shotIndex = 0;
	this.ignoreLeftRightCollisionThisFrame = 0;
	this.fallThroughFloor = false;
	this.currentWeapon = "postit";
	var skipThisCheck = false;

	this.shots = [new Shot(this, renderer), new Shot(this, renderer), new Shot(this, renderer),
		new Shot(this, renderer), new Shot(this, renderer), new Shot(this, renderer),
		new Shot(this, renderer), new Shot(this, renderer), new Shot(this, renderer),
		new Shot(this, renderer), new Shot(this, renderer), new Shot(this, renderer),
		new Shot(this, renderer), new Shot(this, renderer), new Shot(this, renderer),
		new Shot(this, renderer), new Shot(this, renderer), new Shot(this, renderer),
		new Shot(this, renderer), new Shot(this, renderer), new Shot(this, renderer),
		new Shot(this, renderer), new Shot(this, renderer), new Shot(this, renderer),
		new Shot(this, renderer), new Shot(this, renderer), new Shot(this, renderer)
	];

	this.stingingAuditShots = [new StingingAuditShot(this, renderer), new StingingAuditShot(this, renderer), new StingingAuditShot(this, renderer)];

	this.x += -this.animations.scaleX;
	if (!demoMode) {
		setTimeout(function() {
			this.ignoreInput = false;
		}.bind(this), 2000);
	} else {
		this.ignoreInput = false;
	}

	this.watchedElements.push(this.healthbar);

	if (!demoMode) {
		document.onkeydown = function(event) {
			switch (event.keyCode) {
				case keyCodes.left:
					// keyCode 37 is left arrow
					this.actions.playerLeft = true;
					break;

				case keyCodes.right:
					// keyCode 39 is right arrow
					this.actions.playerRight = true;
					break;


				case keyCodes.jump:
					// keyCode 32 is space
					this.actions.playerJump = true;
					break;

				case keyCodes.shoot:
					// keyCode 67 is c
					this.actions.playerAttack = true;
					break;


				case 68:
					// keyCode 68 is d
					this.actions.playerDebug = true;
					break;

				case keyCodes.pause:
					// keyCode 68 is p
					if (this.paused) {
						this.paused = false;
						this.pauseMenu.remove();
					} else {
						this.paused = true;
						this.pauseMenu.show();

					}

					break;
			}
		}.bind(this);

		document.onkeyup = function(event) {
			switch (event.keyCode) {
				case keyCodes.left:
					// keyCode 37 is left arrow
					this.actions.playerLeft = false;
					break;

				case keyCodes.right:
					// keyCode 39 is right arrow
					this.actions.playerRight = false;
					break;

				case keyCodes.jump:
					// keyCode 32 is space
					this.actions.playerJump = false;
					this.jumpreleased = true;
					break;

				case keyCodes.shoot:
					// keyCode 67 is c
					this.actions.playerAttack = false;
					this.shootTicks = 1;
					break;


				case 68:
					// keyCode 68 is d
					this.actions.playerDebug = false;
					break;
			}
		}.bind(this);
	}

	/**
	 * [changeWeapon description]
	 * @param  {[type]} weapon [description]
	 * @return {[type]}        [description]
	 */
	this.changeWeapon = function(weapon) {
		var loaderRequest = "";
		this.currentWeapon = weapon;
		if (weapon === "postit") {
			loaderRequest = "businessman";
		} else if (weapon === "stingingaudit") {
			loaderRequest = "businessman_green";
		} else if (weapon === "oretoss") {
			loaderRequest = "businessman_brown";
		} else if (weapon === "toxicprojectile") {
			loaderRequest = "businessman_yellow";
		}

		var newAnimationSprite = new createjs.SpriteSheet({
			"images": [loader.getResult(loaderRequest)],
			"frames": {
				"width": 30,
				"height": 30,
				"count": 22
			},
			"animations": {
				"stand": {
					"frames": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
					"next": "stand",
					"speed": (0.175) / skipFrames
				},
				"startrun": {
					"frames": [2],
					"next": "run",
					"speed": (0.175) / skipFrames
				},
				"run": {
					"frames": [3, 4, 5, 4],
					"next": "run",
					"speed": (0.175) / skipFrames
				},
				"jump": {
					"frames": [10],
					"next": "jump"
				},
				"standshoot": {
					"frames": [6],
					"next": "standshoot"
				},
				"runshoot": {
					"frames": [7, 8],
					"next": "runshoot",
					"speed": (0.175) / skipFrames
				},
				"damage": {
					"frames": [16],
					"next": "damage",
					"speed": (5) / skipFrames
				},
				"jumpshoot": {
					"frames": [11],
					"next": "jumpshoot"
				},
				"thumbsup": {
					"frames": [18],
					"next": "thumbsup"
				},
				"dropin": {
					"frames": [19, 20],
					"next": "dropin",
					"speed": (0.175) / skipFrames
				},
				"dropcomplete": {
					"frames": [21],
					"next": "stand",
					"speed": (0.175) / skipFrames
				}
			}
		});

		var newAnimation = new createjs.Sprite(newAnimationSprite, "dropin");
		newAnimation.x = this.animations.x;
		newAnimation.y = this.animations.y;

		this.gamestage.removeChild(this.animations);

		this.animations = newAnimation;

		this.gamestage.addChild(this.animations);
	};

	if (mobile && !demoMode) {
		var touchEventSpriteSheet = new createjs.SpriteSheet({
			"images": [loader.getResult("businessman")],
			"frames": {
				"width": 10,
				"height": 10,
				"count": 1
			},
			"animations": {
				"exist": {
					"frames": [0],
					"next": "exist"
				}
			}
		});
		var touchSprite = new createjs.Sprite(touchEventSpriteSheet, "exist");

		this.touchIds = [];

		/**
		 * [eventHandler description]
		 * @param  {[type]} event [description]
		 * @return {[type]}       [description]
		 */
		var eventHandler = function(event) {
			if (!pauseUp && !bossScreenUp) {
				event.preventDefault();
			}

			for (var i = 0; i < event.touches.length; i++) {
				var touch = event.touches[i];
				touchSprite.x = touch.screenX / gamezoom;
				touchSprite.y = touch.screenY / gamezoom;

				if (fastCollisionSprite(leftButtonSprite, touchSprite)) {
					this.actions.playerLeft = true;
					this.actions.playerRight = false;
					this.touchIds[touch.identifier] = "left";
				} else if (fastCollisionSprite(rightButtonSprite, touchSprite)) {
					this.actions.playerLeft = false;
					this.actions.playerRight = true;
					this.touchIds[touch.identifier] = "right";
				} else if (fastCollisionSprite(shootButtonSprite, touchSprite)) {
					this.actions.playerAttack = true;
					this.touchIds[touch.identifier] = "shoot";
				} else if (fastCollisionSprite(pauseButtonSprite, touchSprite)) {
					if (this.paused) {
						this.paused = false;
						this.pauseMenu.remove();
					} else {
						this.paused = true;
						this.pauseMenu.show();
					}
				} else {
					this.actions.playerJump = true;
					this.touchIds[touch.identifier] = "jump";
				}
			}
		};

		/**
		 * [moveEventHandler description]
		 * @param  {[type]} event [description]
		 * @return {[type]}       [description]
		 */
		var moveEventHandler = function(event) {
			if (!pauseUp && !bossScreenUp) {
				event.preventDefault();
			}

			for (var i = 0; i < event.changedTouches.length; i++) {
				var touch = event.changedTouches[i];
				touchSprite.x = touch.screenX / gamezoom;
				touchSprite.y = touch.screenY / gamezoom;

				if (this.touchIds[touch.identifier] === "left") {
					if (!fastCollisionSprite(leftButtonSprite, touchSprite)) {
						this.actions.playerLeft = false;
						this.touchIds[touch.identifier] = null;
					}
				} else if (this.touchIds[touch.identifier] === "right") {
					if (!fastCollisionSprite(rightButtonSprite, touchSprite)) {
						this.actions.playerRight = false;
						this.touchIds[touch.identifier] = null;
					}
				} else if (this.touchIds[touch.identifier] !== "shoot") {
					if (!fastCollisionSprite(shootButtonSprite, touchSprite)) {
						this.actions.playerAttack = false;
						this.touchIds[touch.identifier] = null;
					}
				} else if (this.touchIds[touch.identifier] === "jump") {
					if (fastCollisionSprite(leftButtonSprite, touchSprite) ||
						fastCollisionSprite(rightButtonSprite, touchSprite) ||
						fastCollisionSprite(shootButtonSprite, touchSprite)) {

						this.actions.playerJump = false;
						this.jumpreleased = true;
						this.touchIds[touch.identifier] = null;
					}
				}

				if (this.touchIds[touch.identifier] === null) {
					if (fastCollisionSprite(leftButtonSprite, touchSprite)) {
						this.actions.playerLeft = true;
						this.actions.playerRight = false;
						this.touchIds[touch.identifier] = "left";
					} else if (fastCollisionSprite(rightButtonSprite, touchSprite)) {
						this.actions.playerLeft = false;
						this.actions.playerRight = true;
						this.touchIds[touch.identifier] = "right";
					} else if (fastCollisionSprite(shootButtonSprite, touchSprite)) {
						this.actions.playerAttack = true;
						this.touchIds[touch.identifier] = "shoot";
					} else if (fastCollisionSprite(pauseButtonSprite, touchSprite)) {
						if (this.paused) {
							this.paused = false;
							this.pauseMenu.remove();
						} else {
							this.paused = true;
							this.pauseMenu.show();
						}
					} else {
						this.actions.playerJump = true;
						this.touchIds[touch.identifier] = "jump";
					}
				}
			}
		};

		/**
		 * [endTouchEventHandler description]
		 * @param  {[type]} event [description]
		 * @return {[type]}       [description]
		 */
		var endTouchEventHandler = function(event) {
			if (!pauseUp && !bossScreenUp) {
				event.preventDefault();
			}

			for (var i = 0; i < event.changedTouches.length; i++) {
				var touch = event.changedTouches[i];

				if (this.touchIds[touch.identifier] === "left") {
					this.actions.playerLeft = false;
				}
				if (this.touchIds[touch.identifier] === "right") {
					this.actions.playerRight = false;
				}
				if (this.touchIds[touch.identifier] === "shoot") {
					this.actions.playerAttack = false;
				}
				if (this.touchIds[touch.identifier] === "jump") {
					this.actions.playerJump = false;
					this.jumpreleased = true;
				}

				this.touchIds[touch.identifier] = null;
			}
		};

		document.getElementById("controlcanvas").addEventListener("touchstart", eventHandler.bind(this), false);
		document.getElementById("controlcanvas").addEventListener("touchmove", moveEventHandler.bind(this), false);
		document.getElementById("controlcanvas").addEventListener("touchend", endTouchEventHandler.bind(this), false);
		document.getElementById("controlcanvas").addEventListener("touchcancel", endTouchEventHandler.bind(this), false);
		document.getElementById("controlcanvas").addEventListener("touchleave", endTouchEventHandler.bind(this), false);
	}

	this.animations.play();
	if (!demoMode) {
		this.ignoreInput = true;
		setTimeout(function() {
			this.gamestage.addChild(this.animations);
			this.ignoreInput = false;
		}.bind(this), 1000);
	} else {
		this.gamestage.addChild(this.animations);
	}

	/**
	 * [tickActions lots of weird rules here to make the game as megaman-like as possible
	 * as we're aming to be a reimplementation of megaman physics, and not realistic physics]
	 * @param  {[type]} actions [description]
	 * @return {[type]}         [description]
	 */
	this.tickActions = function(actions) {
		this.gameActions = actions;

		if (renderer.transitiondown || renderer.transitionup) {
			return;
		}

		if (actions.playerDeath) {
			this.watchedElements.forEach(function(element) {
				element.tickActions(actions);
			}.bind(this));
			this.health = 0;
			this.animations.gotoAndPlay("damage");
			playSound("death");
			return;
		}

		if (!this.touchDown) {
			if ((this.jumping && actions.collisionResults.downmove && actions.collisionResults.upmove) || (this.jumping && actions.collisionResults.downmove && this.jumpspeed > 0)) {
				this.y += this.jumpspeed;
				this.jumpspeed = this.jumpspeed + 0.25;
				if (this.jumpspeed > 3) {
					this.jumpspeed = 3; // megaman's terminal velocity
				}
			} else if ((this.jumping || this.onplatform) && !actions.collisionResults.downmove && !actions.collisionResults.nextmap) {
				if (!this.goingLeft && !this.goingRight) {
					this.animations.gotoAndPlay("dropcomplete");
				}
				this.jumping = false;
				this.falling = false;
				this.jumpCount = 0;
				this.onplatform = false;

				setTimeout(function() {
					this.touchDown = true;
				}.bind(this), 180);

				playSound("jumpland");

				// correcting floor position after a jump/fall:
				this.y -= (this.y + this.animations.spriteSheet._frameHeight) & 15; // (numerator % divisor) === (numerator & (divisor - 1)); and we're doing: spriteSheet._frameHeight) % 16;
				if (this.y + this.animations.spriteSheet._frameHeight > renderer.gamestage.canvas.height) {
					this.y -= 16;
				}

				if ((actions.collisionResults.leftmove && this.actions.playerLeft) || (actions.collisionResults.rightmove && this.actions.playerRight)) {
					this.ignoreLeftRightCollisionThisFrame = 0;
				}
			}

			if ((this.x - renderer.completedMapsWidthOffset > this.gamestage.canvas.width / 2) &&
				(renderer.getMapWidth() + renderer.completedMapsWidthOffset > this.x + this.gamestage.canvas.width / 2)) {

				renderer.advance(this.lastx - this.x);
			} else {
				this.animations.x += this.x - this.lastx;
			}
			this.lastx = this.x;
			this.animations.y = this.y;

			return;
		}

		if (this.health <= 0) {
			console.log("dead");

			if (mobile) {
				document.getElementById("gamecanvas").removeEventListener("touchstart", eventHandler.bind(this), false);
				document.getElementById("gamecanvas").removeEventListener("touchmove", eventHandler.bind(this), false);
				document.getElementById("gamecanvas").removeEventListener("touchend", endTouchEventHandler.bind(this), false);
				document.getElementById("gamecanvas").removeEventListener("touchcancel", endTouchEventHandler.bind(this), false);
				document.getElementById("gamecanvas").removeEventListener("touchleave", endTouchEventHandler.bind(this), false);
			}
			actions.playerDeath = true;
			return;
		}

		if (this.fallThroughFloor) {
			actions.collisionResults.downmove = true;
		}

		if (this.gameActions.collisionResults.nextmapup && this.y < -10 && (renderer.getNextMapDirection() === "up" || renderer.getLastMapDirection() === "up")) { //renderer.getNextMapDirection() === "up") {
			if (renderer.getLastMapDirection() === "up") {
				renderer.lastMapUp();
			} else {
				renderer.nextMapUp();
			}
		}

		if (this.transitionedUp) {
			this.y += this.jumpspeed;
			this.jumpspeed = this.jumpspeed + 0.25;
			this.animations.y = this.y;
		}

		if (this.ignoreInput) {
			if (!this.ignoreBounceBack) {
				if ((actions.collisionResults.leftMove && this.animations.scaleX === 1) || (actions.collisionResults.rightMove && this.animations.scaleX === -1)) {
					this.x += -this.animations.scaleX;
				}

				// prevent us from moving left after a screen transition
				if (this.animations.x < 0 && this.goingLeft) {
					this.x = this.lastx;
				}

				if ((this.x - renderer.completedMapsWidthOffset > this.gamestage.canvas.width / 2) &&
					(renderer.getMapWidth() + renderer.completedMapsWidthOffset > this.x + this.gamestage.canvas.width / 2)) {

					renderer.advance(this.lastx - this.x);
				} else {
					this.animations.x += this.x - this.lastx;
				}
				this.lastx = this.x;
				this.animations.y = this.y;
				this.watchedElements.forEach(function(element) {
					element.tickActions(actions);
				}.bind(this));

				if (this.currentWeapon === "postit") {
					this.shots.forEach(function(shot) {
						shot.tickActions(actions);
					}.bind(this));
				} else if (this.currentWeapon === "stingingaudit") {
					this.stingingAuditShots.forEach(function(shot) {
						shot.tickActions(actions);
					}.bind(this));
				}


				this.checkObjectCollisions();
			}

			if (this.x + this.animations.spriteSheet._frameWidth > renderer.getMapWidth() + renderer.completedMapsWidthOffset + renderer.widthOffset && (renderer.getNextMapDirection() === "right" || renderer.getLastMapDirection() === "right")) {
				if (renderer.getLastMapDirection() === "right") {
					renderer.lastMapRight(renderer.mapData);
				} else {
					renderer.nextMapRight(renderer.mapData);
				}

				this.ignoreInput = true;
				setTimeout(function() {
					this.ignoreInput = false;
				}.bind(this), 300);
			}

			return;
		}

		if (hasJoystick && usingJoystick) {
			this.actions = gamepadPoll_game();
			if (this.actions.jumpReleased) {
				this.jumpreleased = true;
			}
			if (this.actions.attackReleased) {
				this.shootTicks = 1;
			}
		}

		if (this.shootTicks > 0) {
			this.shootTicks--;

			if (this.shootTicks === 0) {
				this.shootAnimationTicks = 10;
			}
		} else if (this.shootAnimationTicks > 0) {
			this.shootAnimationTicks--;
		} else if (this.shootAnimationTicks === 0) {
			this.shootAnimationTicks = -1;
			if (this.animations.currentAnimation === "jumpshoot") {
				this.animations.gotoAndPlay("jump");
			} else if (this.animations.currentAnimation === "runshoot") {
				this.animations.gotoAndPlay("run");
			} else if (this.animations.currentAnimation === "standshoot") {
				this.animations.gotoAndPlay("stand");
			}
		}

		if (this.actions.playerJump && !this.jumping && actions.collisionResults.upmove && this.jumpreleased) {
			actions.collisionResults.downmove = true;
			this.jumpreleased = false;
			this.jumpspeed = -4.875;
			this.jumping = true;
			this.jumpCount = 1;
			this.animations.gotoAndPlay("jump");
		} else if ((actions.collisionResults.downmove && !this.onplatform) && !this.jumping) {
			actions.collisionResults.downmove = true;
			this.jumpspeed = 0;
			this.falling = true;
			this.jumping = true;
			this.animations.gotoAndPlay("jump");
			this.jumpCount = 1;
		} else if (this.jumping && this.jumpreleased && !this.falling && this.jumpspeed < 2) {
			this.jumpspeed = 2;
		} else if (this.jumping && actions.collisionResults.upmove && this.actions.playerJump && doubleJump && this.jumpCount === 1 && this.jumpreleased) {
			this.jumpspeed = -4.875;
			this.jumpreleased = false;
			this.jumpCount++;
		}

		if (this.ignoreLeftRightCollisionThisFrame !== 0) {
			this.ignoreLeftRightCollisionThisFrame--;
		}

		if ((this.jumping && actions.collisionResults.downmove && actions.collisionResults.upmove) || (this.jumping && actions.collisionResults.downmove && this.jumpspeed > 0)) {
			this.y += this.jumpspeed;
			this.jumpspeed = this.jumpspeed + 0.25;
			if (this.jumpspeed > 7) {
				this.jumpspeed = 7; // megaman's terminal velocity
			}
		} else if ((this.jumping || this.onplatform) && !actions.collisionResults.downmove && !actions.collisionResults.nextmap) {
			if (!this.goingLeft && !this.goingRight) {
				this.animations.gotoAndPlay("stand");
			} else {
				this.animations.gotoAndPlay("run");
			}
			this.jumping = false;
			this.falling = false;
			this.jumpCount = 0;
			this.onplatform = false;

			playSound("jumpland");

			// correcting floor position after a jump/fall:
			this.y -= (this.y + this.animations.spriteSheet._frameHeight) & 15; // (numerator % divisor) === (numerator & (divisor - 1)); and we're doing: spriteSheet._frameHeight) % 16;
			if (this.y + this.animations.spriteSheet._frameHeight > renderer.gamestage.canvas.height) {
				this.y -= 16;
			}

			if ((actions.collisionResults.leftmove && this.actions.playerLeft) || (actions.collisionResults.rightmove && this.actions.playerRight)) {
				this.ignoreLeftRightCollisionThisFrame = 0;
			}
		} else if (this.jumping && !actions.collisionResults.upmove) {
			this.jumpspeed = 0.5;
			this.falling = true; // megaman's jumpspeed set to .5 when he bonks his head
			//this.y += this.jumpspeed;
			if ((actions.collisionResults.leftmove && this.actions.playerLeft) || (actions.collisionResults.rightmove && this.actions.playerRight)) {
				this.ignoreLeftRightCollisionThisFrame = 0;
			}
		} else if (this.onplatform && !actions.collisionResults.upmove) {
			this.y += 38;
			this.onplatform = false;
			this.falling = true;
			this.animations.gotoAndPlay("jump");
		}

		if (this.actions.playerLeft && (actions.collisionResults.leftmove || this.ignoreLeftRightCollisionThisFrame !== 0)) {
			this.goingRight = false;
			this.goingLeft = true;
			this.animations.scaleX = -1;
			this.animations.regX = 30;
			if ((this.animations.currentAnimation !== "run" && this.animations.currentAnimation !== "startrun" && this.animations.currentAnimation !== "runshoot") && !this.jumping) {
				this.animations.gotoAndPlay("startrun");
				this.movementTicks = 7;
			}
		} else if (this.actions.playerRight && (actions.collisionResults.rightmove || this.ignoreLeftRightCollisionThisFrame !== 0)) {
			this.goingRight = true;
			this.goingLeft = false;
			this.animations.scaleX = 1;
			this.animations.regX = 0;
			if ((this.animations.currentAnimation !== "run" && this.animations.currentAnimation !== "startrun" && this.animations.currentAnimation !== "runshoot") && !this.jumping) {
				this.animations.gotoAndPlay("startrun");
				this.movementTicks = 7;
			}
		} else {
			this.goingRight = false;
			this.goingLeft = false;
			if (this.animations.currentAnimation !== "stand" && this.animations.currentAnimation !== "standshoot" && !this.jumping && (!this.actions.playerLeft && !this.actions.playerRight)) {
				this.animations.gotoAndPlay("stand");
				this.movementTicks = 8;
			}
		}

		if (this.actions.playerAttack && this.shootTicks <= 0) {
			//this.watchedElements.push(new Shot(this.stage, this, renderer));
			var shot;
			if (this.currentWeapon === "postit") {
				shot = this.shots[this.shotIndex++ % 27];
				if (shot.disabled) {
					shot.fireUp();
					playSound("shoot");
					if (this.animations.currentAnimation === "jump") {
						this.animations.gotoAndPlay("jumpshoot");
					} else if (this.animations.currentAnimation === "run") {
						this.animations.gotoAndPlay("runshoot");
					} else if (this.animations.currentAnimation === "stand") {
						this.animations.gotoAndPlay("standshoot");
					} else if (this.jumping && this.animations.currentAnimation === "damage") {
						this.animations.gotoAndPlay("jumpshoot");
					}
				}
			} else if (this.currentWeapon === "stingingaudit") {
				shot = this.stingingAuditShots[this.shotIndex++ % 3];
				if (shot.disabled) {
					shot.fireUp();
					playSound("shoot");
					if (this.animations.currentAnimation === "jump") {
						this.animations.gotoAndPlay("jumpshoot");
					} else if (this.animations.currentAnimation === "run") {
						this.animations.gotoAndPlay("runshoot");
					} else if (this.animations.currentAnimation === "stand") {
						this.animations.gotoAndPlay("standshoot");
					} else if (this.jumping && this.animations.currentAnimation === "damage") {
						this.animations.gotoAndPlay("jumpshoot");
					}
				}
			}

			this.shootTicks = 15; // not correct

		}


		if (this.goingRight || this.goingLeft) {
			if (this.goingRight && (actions.collisionResults.rightmove || this.ignoreLeftRightCollisionThisFrame !== 0)) {
				if (this.movementTicks > 0) {
					this.x += 0.2; // megaman moved slower as he began moving
					this.movementTicks--;
				} else {
					this.x += 1.375;
				}
			} else if (this.goingLeft && (actions.collisionResults.leftmove || this.ignoreLeftRightCollisionThisFrame !== 0)) {
				if (this.movementTicks > 0) {
					this.x += -0.2; // megaman moved slower as he began moving
					this.movementTicks--;
				} else {
					this.x += -1.375;
				}
			}
		} else if (this.movementTicks > 0) {
			if ((actions.collisionResults.rightmove && actions.collisionResults.leftmove) || this.ignoreLeftRightCollisionThisFrame !== 0) {
				this.x += 0.8 * this.animations.scaleX;
				this.movementTicks--;
			} else {
				this.movementTicks = 0;
			}
		}

		// prevent us from moving left after a screen transition
		if (this.animations.x < 0 && this.goingLeft) {
			this.x = this.lastx;
		}


		this.checkObjectCollisions();

		if (!actions.collisionResults.rightmove && this.onplatform && this.x > this.lastx) {
			this.lastx = this.x;
		}

		if (!actions.collisionResults.leftmove && this.onplatform && this.x < this.lastx) {
			this.lastx = this.x;
		}

		if ((this.x - renderer.completedMapsWidthOffset > this.gamestage.canvas.width / 2) &&
			(renderer.getMapWidth() + renderer.completedMapsWidthOffset > this.x + this.gamestage.canvas.width / 2)) {

			renderer.advance(this.lastx - this.x);
		} else {
			this.animations.x += this.x - this.lastx;
		}
		this.lastx = this.x;
		this.animations.y = this.y;

		this.watchedElements.forEach(function(element) {
			element.tickActions(actions);
		}.bind(this));

		if (this.currentWeapon === "postit") {
			this.shots.forEach(function(shot) {
				shot.tickActions(actions);
			}.bind(this));
		} else if (this.currentWeapon === "stingingaudit") {
			this.stingingAuditShots.forEach(function(shot) {
				shot.tickActions(actions);
			}.bind(this));
		}

		if (this.actions.playerDebug) {
			//damageModifier = 1000;
		}
		//console.log(this.x);
		//

		if (this.x + this.animations.spriteSheet._frameWidth > renderer.getMapWidth() + renderer.completedMapsWidthOffset + renderer.widthOffset && (renderer.getNextMapDirection() === "right" || renderer.getLastMapDirection() === "right")) {
			if (renderer.getLastMapDirection() === "right") {
				renderer.lastMapRight(renderer.mapData);
			} else {
				renderer.nextMapRight(renderer.mapData);
			}

			this.ignoreInput = true;
			setTimeout(function() {
				this.ignoreInput = false;
			}.bind(this), 300);
		}

		if (actions.collisionResults.nextmap && (renderer.getNextMapDirection() === "down" || renderer.getLastMapDirection() === "down")) {
			if (renderer.getLastMapDirection() === "down") {
				renderer.lastMapDown(renderer.mapData);
			} else {
				renderer.nextMapDown(renderer.mapData);
			}

			this.ignoreInput = true;

			setTimeout(function() {
				this.ignoreInput = false;
			}.bind(this), 500);
		} else if (actions.collisionResults.nextmap && (this.y + this.animations.spriteSheet._frameHeight) > renderer.getMapHeight() + renderer.heightOffset) {
			this.health = 0;
		}
		if (!this.ignoreDamage) {
			if (!skipThisCheck) {
				this.checkEnemyCollisions();
				skipThisCheck = true;
			} else {
				skipThisCheck = false;
			}
		} else {
			if (this.blinkTimer === 0) {
				this.gamestage.removeChild(this.animations);
				this.blinkTimer = 12;
			} else if (this.blinkTimer === 9) {
				this.gamestage.addChild(this.animations);
			}
			this.blinkTimer--;
		}
	};

	/**
	 * [checkObjectCollisions description]
	 * @return {[type]} [description]
	 */
	this.checkObjectCollisions = function() {
		if (renderer.objects.length === 0) {
			return;
		}

		renderer.objects.forEach(function(object) {
			var intersection = fastCollisionPlayer(this, object);
			if (intersection) {
				if (typeof(object.playerCollisionActions) === "function") {
					object.playerCollisionActions();
				}
			}
		}.bind(this));
	};

	/**
	 * [checkEnemyCollisions description]
	 * @return {[type]} [description]
	 */
	this.checkEnemyCollisions = function() {
		renderer.enemies.forEach(function(enemy) {

			if (enemy.health > 0 || typeof(enemy.health) === "undefined") {
				var intersection = fastCollisionPlayer(this, enemy);


				if (intersection) {
					if (enemy.damage < 1) { // for non enemy objects
						intersection = fastCollisionPlayerLoose(this, enemy);
					}

					if (enemy.damage > 0) {
						if (!this.ignoreDamage) {
							this.health -= enemy.damage / damageModifier;

							this.damageSprite.x = this.animations.x;
							this.damageSprite.y = this.animations.y;
							this.damageSprite.gotoAndPlay("damage");
							this.gamestage.addChild(this.damageSprite);
							setTimeout(function() {
								this.gamestage.removeChild(this.damageSprite);
							}.bind(this), 180);
							this.animations.gotoAndPlay("damage");

							playSound("playerdamaged");
							this.ignoreInput = true;
							this.ignoreDamage = true;
							this.blinkTimer = 16;
							this.x += -this.animations.scaleX;

							setTimeout(function() {
								if (dead) {
									return;
								}
								if (this.blinkTimer > 8) {
									this.gamestage.addChild(this.animations);
								}
								this.ignoreDamage = false;
							}.bind(this), 2000);
							setTimeout(function() {
								this.ignoreInput = false;
							}.bind(this), 240);
						}
					} else if (enemy.damage < 0) { // this is actually health!
						this.health -= enemy.damage;
						enemy.health = -1;
					} else { // enemy damage is 0, extra life, health briefcase, etc
						if (!(enemy.constructor === Platform || enemy.constructor === DisappearingPlatform || enemy.constructor === DroppingPlatform)) {
							enemy.health = -1;
						}
					}

					if (this.jumpspeed < 2 && this.jumping && (enemy.constructor === DisappearingPlatform && enemy.animations.visible)) {
						this.jumpspeed = 2;
					}

					if (typeof(enemy.playerCollisionActions) === "function") {
						enemy.playerCollisionActions();
					}
				}
			}

			// check enemy shot collisions as well
			enemy.watchedElements.forEach(function(enemyshot) {
				if (enemyshot.disabled) {
					return;
				}

				var intersection = fastCollisionPlayer(this, enemyshot);
				//var intersection = ndgmrX.checkRectCollision(this.animations, enemyshot.animations);
				if (intersection) {
					if (!this.ignoreDamage) {
						enemyshot.removeSelf();
						this.health -= enemyshot.damage; // should actually come from the enemy
						this.animations.gotoAndPlay("damage");
						this.damageSprite.x = this.animations.x;
						this.damageSprite.y = this.animations.y;
						this.damageSprite.gotoAndPlay("damage");
						this.gamestage.addChild(this.damageSprite);
						setTimeout(function() {
							this.gamestage.removeChild(this.damageSprite);
						}.bind(this), 180);

						playSound("playerdamaged");
						this.ignoreInput = true;
						this.ignoreDamage = true;
						this.blinkTimer = 16;
						this.x += -this.animations.scaleX;
						setTimeout(function() {
							if (dead) {
								return;
							}
							if (this.blinkTimer > 8) {
								this.gamestage.addChild(this.animations);
							}
							this.ignoreDamage = false;
						}.bind(this), 2000);
						setTimeout(function() {
							this.ignoreInput = false;
						}.bind(this), 240);

						if (this.jumpspeed < 2 && this.jumping) {
							this.jumpspeed = 2;
						}
					}
				}
			}.bind(this));
		}.bind(this));
	};

	/**
	 * [defeatedBoss description]
	 * @return {[type]} [description]
	 */
	this.defeatedBoss = function() {
		this.ignoreDamage = true;
		this.ignoreInput = true;
		this.ignoreBounceBack = true;
		setTimeout(function() {
			player.animations.gotoAndPlay("thumbsup");
		}, 2500);
		setTimeout(function() {
			createjs.Ticker.removeEventListener("tick", handleTick);
		}.bind(this), 3800);
		setTimeout(function() {
			this.ignoreDamage = false;
			this.ignoreInput = false;
			this.ignoreBounceBack = false;
			initVars();
			initBossScreen();
		}.bind(this), 4000);
	};
}