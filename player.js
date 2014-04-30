function Player(mapper) {

	var playerSpriteSheet = new createjs.SpriteSheet({
		"images": ["images/businessmanspritesheet.png"],
		"frames": {
			"width": 60, "height": 60, "count": 18
		},
		"animations": {
			"stand": {
				"frames" : [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
				"next" : "stand",
				"speed" : 0.125 * mapper.lowFramerate
			},
			"startrun" : {
				"frames" : [2],
				"next" : "run",
				"speed" : 0.125 * mapper.lowFramerate
			},
			"run": {
				"frames" : [3, 4, 5],
				"next" : "run",
				"speed" : 0.15 * mapper.lowFramerate
			},
			"jump": {
				"frames" : [10],
				"next" : "jump"
			},
			"standshoot": {
				"frames" : [6],
				"next" : "standshoot"
			},
			"runshoot": {
				"frames" : [7, 8, 9],
				"next" : "runshoot",
				"speed" : 0.15 * mapper.lowFramerate
			},
			"damage": {
				"frames" : [16],
				"next" : "damage",
				"speed" : 5 * mapper.lowFramerate
			},
			"jumpshoot": {
				"frames" : [11],
				"next" : "jumpshoot"
			}
		}
	}); // new createjs.Bitmap("images/businessmanspritesheet.png");

	this.stage              = mapper.gamestage;
	this.animations         = new createjs.Sprite(playerSpriteSheet, "stand");
	this.x                  = 96;
	this.animations.x       = this.x;
	this.lastx				= this.x;
	this.y                  = 30;
	this.goingLeft          = false;
	this.goingRight         = false;
	this.goingLeftReleased  = false;
	this.goingRightReleased = false;
	this.jumping            = false;
	this.falling            = false;
	this.jumpreleased       = true;
	this.jumpspeed          = 0;
	this.shootTicks         = 0;
	this.watchedElements    = [];
	this.health             = 28;
	this.actions            = {};
	this.mapper             = mapper;
	this.gamestage			= mapper.gamestage;
	this.pageflips          = 0;
	this.ignoreDamage		= false;
	this.ignoreInput        = false;
	this.healthbar          = new HealthBar(gamestage, this);
	//createjs.Sound.registerSound("sounds/jump.wav", "jump");
	//createjs.Sound.registerSound("sounds/shoot.wav", "shoot");
	setTimeout(function() {
		this.ignoreDamage = false;
	}.bind(this), 2000);

	this.watchedElements.push(this.healthbar);

	document.onkeydown = function (event) {
		switch (event.keyCode) {
			case 37:
				// keyCode 37 is left arrow
				this.actions.playerLeft = true;
				this.actions.playerRight = false;
				this.goingLeftReleased  = false;
				break;

			case 39:
				// keyCode 39 is right arrow
				this.actions.playerRight = true;
				this.actions.playerLeft = false;
				this.goingRightReleased  = false;
				break;


			case 32:
				// keyCode 32 is space
				this.actions.playerJump = true;
				break;

			case 67:
				// keyCode 67 is c
				this.actions.playerAttack = true;
				break;


			case 68:
				// keyCode 68 is d
				this.actions.playerDebug = true;
				break;
		}
	}.bind(this);

	document.onkeyup = function (event) {
		switch (event.keyCode) {
			case 37:
				// keyCode 37 is left arrow
				this.actions.playerLeft = false;
				this.actions.playerRight = false;
				this.goingLeftReleased  = true;
				break;

			case 39:
				// keyCode 39 is right arrow
				this.actions.playerRight = false;
				this.actions.playerLeft = false;
				this.goingRightReleased  = true;
				break;


			case 32:
				// keyCode 32 is space
				this.actions.playerJump = false;
				this.jumpreleased = true;
				break;

			case 67:
				// keyCode 67 is c
				this.actions.playerAttack = false;
				break;


			case 68:
				// keyCode 68 is d
				this.actions.playerDebug = false;
				break;
		}
	}.bind(this);

	if (mobile) {
		var touchEventSpriteSheet = new createjs.SpriteSheet({
			"images": ["images/businessmanspritesheet.png"],
			"frames": {
				"width": 1, "height": 1, "count": 1
			},
			"animations": {
				"exist": {
					"frames" : [0],
					"next" : "exist"
				}
			}
		});
		var touchSprite = new createjs.Sprite(touchEventSpriteSheet, "exist");

		console.log("binding touch event");

		this.touchIds = [];

		var eventHandler = function(event) {
			event.preventDefault();

			for (var i = 0; i < event.touches.length; i++) {
				var touch = event.touches[i];
				touchSprite.x = touch.pageX;
				touchSprite.y = touch.pageY;
				if (ndgmr.checkRectCollision(leftButtonSprite, touchSprite)) {
					this.actions.playerLeft = true;
					this.actions.playerRight = false;
					this.touchIds[touch.identifier] = "left";
				} else if (ndgmr.checkRectCollision(rightButtonSprite, touchSprite)) {
					this.actions.playerLeft = false;
					this.actions.playerRight = true;
					this.touchIds[touch.identifier] = "right";
				} else if (ndgmr.checkRectCollision(shootButtonSprite, touchSprite)) {
					this.actions.playerAttack = true;
					this.touchIds[touch.identifier] = "shoot";
				} else {
					this.actions.playerJump = true;
					this.touchIds[touch.identifier] = "jump";
				}
			}
		};

		var endTouchEventHandler = function(event) {
			event.preventDefault();

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

		document.getElementById("gamecanvas").addEventListener('touchstart', eventHandler.bind(this), false);
		document.getElementById("gamecanvas").addEventListener('touchmove', eventHandler.bind(this), false);
		document.getElementById("gamecanvas").addEventListener('touchend', endTouchEventHandler.bind(this), false);
		document.getElementById("gamecanvas").addEventListener('touchcancel', endTouchEventHandler.bind(this), false);
		document.getElementById("gamecanvas").addEventListener('touchleave', endTouchEventHandler.bind(this), false);
	}

	this.animations.play();
	this.ignoreInput = true;
	setTimeout(function() {
		this.stage.addChild(this.animations);
		this.ignoreInput = false;
	}.bind(this), 1000);

	// lots of weird rules here to make the game as megaman-like as possible
	// as we're aming to be a reimplementation of megaman physics, and not realistic physics
	// most values are doubled from their megaman values as i am using double sized sprites
	this.tickActions = function(actions) {
		if (this.ignoreInput) {
			if (this.ignoreDamage) {
				this.x += 1 * -this.animations.scaleX * this.mapper.lowFramerate;

				this.watchedElements.forEach(function(element) {
					element.tickActions(actions);
				}.bind(this));
			}
			return;
		}

		if (this.shootTicks > 0) {
			this.shootTicks--;

			if (this.shootTicks <= 0) {
				if (this.animations.currentAnimation === "jumpshoot") {
					this.animations.gotoAndPlay("jump");
				} else if (this.animations.currentAnimation === "runshoot") {
					this.animations.gotoAndPlay("run");
				} else if (this.animations.currentAnimation === "standshoot") {
					this.animations.gotoAndPlay("stand");
				}
			}
		}

		if (actions.playerDeath) {
			this.health = 0;
			this.animations.gotoAndPlay("damage");
		}

		if (this.health <= 0) {
			console.log("dead");
			actions.playerDeath = true;
		}

		if (this.actions.playerJump && !this.jumping && actions.collisionResults.upmove && this.jumpreleased) {
			actions.collisionResults.downmove = true;
			this.jumpreleased = false;
			this.jumpspeed = -9.75;
			this.jumping = true;
			//var sound = createjs.Sound.play("jump");
			//sound.volume = 0.05;
			this.animations.gotoAndPlay("jump");
		} else if (actions.collisionResults.downmove && !this.jumping) {
			actions.collisionResults.downmove = true;
			this.jumpspeed = 0;
			this.falling = true;
			this.jumping = true;
			this.animations.gotoAndPlay("jump");
		} else if (this.jumping && this.jumpreleased && !this.falling && this.jumpspeed < 4) {
			this.jumpspeed = 4;
		}

		var ignoreLeftRightCollisionThisFrame = false;
		if ((this.jumping && actions.collisionResults.downmove && actions.collisionResults.upmove) || (this.jumping && actions.collisionResults.downmove && this.jumpspeed > 0)) {
			this.y += this.jumpspeed * this.mapper.lowFramerate;
			this.jumpspeed = this.jumpspeed + 0.5 * this.mapper.lowFramerate;
			if (this.jumpspeed > 24 / this.mapper.lowFramerate) {
				this.jumpspeed = 24 / this.mapper.lowFramerate; // megaman's terminal velocity
			}
		} else if (this.jumping && !actions.collisionResults.downmove && !actions.collisionResults.nextmap) {
			if (!this.goingLeft && !this.goingRight) {
				this.animations.gotoAndPlay("stand");
			} else {
				this.animations.gotoAndPlay("run");
			}
			this.jumping = false;
			this.falling = false;
			ignoreLeftRightCollisionThisFrame = true;

			// correcting floor position after a jump/fall:
			this.y -= (this.y + this.animations.spriteSheet._frameHeight) % 32;
			if (this.y + this.animations.spriteSheet._frameHeight > this.mapper.gamestage.canvas.height) {
				this.y -= 32;
			}
			ignoreLeftRightCollisionThisFrame = true;
		} else if (this.jumping && !actions.collisionResults.upmove) {
			this.jumpspeed = 1; // megaman's jumpspeed set to 1 when he bonks his head
			this.y += this.jumpspeed * this.mapper.lowFramerate;
		}

		if (this.actions.playerLeft && (actions.collisionResults.leftmove || ignoreLeftRightCollisionThisFrame)) {
			this.goingRight = false;
			this.goingLeft  = true;
			this.animations.scaleX = -1;
			this.animations.regX = 60;
			if ((this.animations.currentAnimation !== "run" && this.animations.currentAnimation !== "startrun" && this.animations.currentAnimation !== "runshoot") && !this.jumping) {
				this.animations.gotoAndPlay("startrun");
				this.movementTicks = 9 / this.mapper.lowFramerate;
			}
		} else if (this.actions.playerRight && (actions.collisionResults.rightmove || ignoreLeftRightCollisionThisFrame)) {
			this.goingRight = true;
			this.goingLeft  = false;
			this.animations.scaleX = 1;
			this.animations.regX = 0;
			if ((this.animations.currentAnimation !== "run" && this.animations.currentAnimation !== "startrun" && this.animations.currentAnimation !== "runshoot") && !this.jumping) {
				this.animations.gotoAndPlay("startrun");
				this.movementTicks = 9 / this.mapper.lowFramerate;
			}
		} else {
			this.goingRight = false;
			this.goingLeft = false;
			if (this.animations.currentAnimation !== "stand" && this.animations.currentAnimation !== "standshoot" && !this.jumping) {
				this.animations.gotoAndPlay("stand");
				this.movementTicks = 9 / this.mapper.lowFramerate;
			}
		}

		if (this.actions.playerAttack && this.shootTicks <= 0) {
			this.watchedElements.push(new Shot(this.stage, this, this.mapper));

			//var sound = createjs.Sound.play("shoot");
			//sound.volume = 0.05;
			this.shootTicks = 15 / this.mapper.lowFramerate; // not correct

			if (this.animations.currentAnimation === "jump") {
				this.animations.gotoAndPlay("jumpshoot");
			} else if (this.animations.currentAnimation === "run") {
				this.animations.gotoAndPlay("runshoot");
			} else if (this.animations.currentAnimation === "stand") {
				this.animations.gotoAndPlay("standshoot");
			}
		}


		if (this.goingRight || this.goingLeft) {
			if (this.goingRight && (actions.collisionResults.rightmove || ignoreLeftRightCollisionThisFrame)) {
				if (this.jumping) {
					this.x += 2.65 * this.mapper.lowFramerate; // megaman moved slower while jumping...
				} else {
					if (this.movementTicks > 0) {
						this.x += 0.4 * this.mapper.lowFramerate; // megaman moved slower as he began moving
						this.movementTicks--;
					} else {
						this.x += 2.75 * this.mapper.lowFramerate;
					}
				}
			} else if (this.goingLeft && (actions.collisionResults.leftmove || ignoreLeftRightCollisionThisFrame)) {
				if (this.jumping) {
					this.x += -2.65 * this.mapper.lowFramerate; // megaman moved slower while jumping...
				} else {
					if (this.movementTicks > 0) {
						this.x += -0.4 * this.mapper.lowFramerate; // megaman moved slower as he began moving
						this.movementTicks--;
					} else {
						this.x += -2.75 * this.mapper.lowFramerate;
					}
				}
			}
		} else if (this.movementTicks > 0) {
			if ((actions.collisionResults.rightmove && actions.collisionResults.leftmove) || ignoreLeftRightCollisionThisFrame) {
				this.x += 0.8 * this.animations.scaleX * this.mapper.lowFramerate;
				this.movementTicks--;
			} else {
				this.movementTicks = 0;
			}
		}

		// prevent us from moving left after a screen transition
		if (this.animations.x < 0 && this.goingLeft) {
			this.x = this.lastx;
		}

		if ((this.x - this.mapper.completedMapsWidthOffset > this.gamestage.canvas.width / 2) &&
			(this.mapper.getMapWidth() + this.mapper.completedMapsWidthOffset > this.x + this.gamestage.canvas.width / 2)) {

			this.mapper.advance(this.lastx - this.x);
		} else {
			this.animations.x += this.x - this.lastx;
		}
		this.lastx = this.x;
		this.animations.y = this.y;

		this.watchedElements.forEach(function(element) {
			element.tickActions(actions);
		}.bind(this));

		if (this.actions.playerDebug) {
			//console.log(this);
		}
		//console.log(this.x);
		//

		if (this.x + this.animations.spriteSheet._frameWidth > this.mapper.getMapWidth() + this.mapper.completedMapsWidthOffset) {
			this.mapper.nextMapRight(this.mapper.mapData);

			this.ignoreInput = true;
			setTimeout(function() {
				this.ignoreInput = false;
			}.bind(this), 500);
		}

		if (actions.collisionResults.nextmap) {
			this.mapper.nextMapDown(this.mapper.mapData);
			this.ignoreInput = true;

			setTimeout(function() {
				this.ignoreInput = false;
			}.bind(this), 500);
		}

		if (!this.ignoreDamage) {
			this.checkEnemyCollisions();
		}
	};

	this.checkEnemyCollisions = function() {
		this.mapper.enemies.forEach(function(enemy) {


			var intersection = ndgmrX.checkRectCollision(this.animations, enemy.animations);
			if (intersection) {
				if (enemy.health <= 0) {
					return;
				}
				this.health -= 2; // should come from enemy
				this.animations.gotoAndPlay("damage");
				this.ignoreInput = true;
				this.ignoreDamage = true;

				this.x += 1 * -this.animations.scaleX;
				setTimeout(function() {
					this.ignoreDamage = false;
				}.bind(this), 1000);
				setTimeout(function() {
					this.ignoreInput = false;
				}.bind(this), 250);

				if (this.jumpspeed < 4 && this.jumping) {
					this.jumpspeed = 4;
				}
			}

			// check enemy shot collisions as well
			enemy.watchedElements.forEach(function(enemyshot) {
				if (enemyshot.disabled) {
					return;
				}

				var intersection = ndgmrX.checkRectCollision(this.animations, enemyshot.animations);
				if (intersection) {
					enemyshot.removeSelf();
					this.health -= 4; // should actually come from the enemy
					this.animations.gotoAndPlay("damage");
					this.ignoreInput = true;
					this.ignoreDamage = true;

					this.x += 1 * -this.animations.scaleX;
					setTimeout(function() {
						this.ignoreDamage = false;
					}.bind(this), 1000);
					setTimeout(function() {
						this.ignoreInput = false;
					}.bind(this), 250);

					if (this.jumpspeed < 4 && this.jumping) {
						this.jumpspeed = 4;
					}
				}
			}.bind(this));
		}.bind(this));
	};

	var Shot = function(stage, player, mapper) {
		var shotSpriteSheet = new createjs.SpriteSheet({
			"images": ["images/shot.png"],
			"frames": {
				"width": 16, "height": 16, "count": 1
			},
			"animations": {
				"shot": {
					"frames" : [0],
					"next" : "shot"
				}
			}
		});

		this.mapper     = mapper;
		this.stage      = stage;
		this.animations = new createjs.Sprite(shotSpriteSheet, "shot");
		this.x          = player.animations.x + ((player.animations.scaleX === 1) ? 52 : -6);
		this.y          = player.animations.y + 27;
		this.done       = false;
		this.playerX    = player.x;
		this.disabled   = false;
		this.direction  = player.animations.scaleX;
		this.player     = player;
		this.yspeed     = 0;
		this.bounced    = false;

		this.animations.play();
		this.stage.addChild(this.animations);

		this.tickActions = function(actions) {
			if (this.disabled) {
				return;
			}

			this.x = this.x + (7 * this.direction) * this.mapper.lowFramerate;
			this.y -= this.yspeed * this.mapper.lowFramerate;
			this.animations.x = this.x;
			this.animations.y = this.y;

			if (!this.checkBounds()) {
				this.removeSelf();
			}

			this.player.mapper.enemies.forEach(function(enemy) {
				if (enemy.health <= 0) {
					return;
				}

				var intersection = ndgmrX.checkRectCollision(this.animations, enemy.animations);
				if (intersection) {
					if (enemy.hardshell && !this.bounced) {
						this.bounced = true;
						this.yspeed = 7;
						this.direction = this.direction * -1;
						return;
					}

					enemy.health--;
					this.removeSelf();
				}
			}.bind(this));
		};

		this.removeSelf = function() {
			this.stage.removeChild(this.animations);
			this.disabled = true;
		};

		this.checkBounds = function() {
			if (this.x < 0 || this.x > this.playerX + 2000) {
				return false;
			}

			return true;
		};
	};
}