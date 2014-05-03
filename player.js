function Player() {

	var Shot = function(player, mapper) {
		var shotSpriteSheet = new createjs.SpriteSheet({
			"images": [loader.getResult("shot")],
			"frames": {
				"width": 8, "height": 8, "count": 1
			},
			"animations": {
				"shot": {
					"frames" : [0],
					"next" : "shot"
				}
			}
		});

		this.animations = new createjs.Sprite(shotSpriteSheet, "shot");
		this.x          = -7.5;
		this.y          = -7.5;
		this.disabled   = true;
		this.direction  = 0;
		this.yspeed     = 0;
		this.bounced    = false;

		this.tickActions = function() {
			if (this.disabled) {
				return;
			}

			this.x = this.x + (3.5 * this.direction) * lowFramerate;
			this.y -= this.yspeed * lowFramerate;
			this.animations.x = this.x;
			this.animations.y = this.y;

			if (!this.checkBounds()) {
				this.removeSelf();
			}

			mapper.enemies.forEach(function(enemy) {
				if (enemy.health <= 0) {
					return;
				}

				//var intersection = ndgmrX.checkRectCollision(this.animations, enemy.animations);
				if (fastCollisionX(this, enemy)) {
					if (enemy.hardshell) {
						this.yspeed = 3.5;
						this.direction = this.direction * (this.bounced) ? 0 : -1;
						this.bounced = true;
						return;
					}

					enemy.health--;
					this.removeSelf();
				}
			}.bind(this));
		};

		this.fireUp = function() {
			//console.log(player.x - mapper.completedMapsWidthOffset);
			this.x = player.x - mapper.completedMapsWidthOffset + ((player.animations.scaleX === 1) ? 26 : -3);
			this.y = player.y + 13.5;
			this.yspeed = 0;
			this.disabled = false;
			this.bounced = false;
			this.direction = player.animations.scaleX;
			this.animations.x = this.x;
			this.animations.y = this.y;
			this.animations.play();
			mapper.enemyContainer.addChild(this.animations);
		};

		this.removeSelf = function() {
			//console.log("removing");
			mapper.enemyContainer.removeChild(this.animations);
			this.disabled = true;
		};

		this.checkBounds = function() {
			if (this.y < 0 || Math.abs(this.y - player.y) > mapper.gamestage.canvas.height) {
				return false;
			}

			return !(this.x < 0 || Math.abs(this.x - (player.x - mapper.completedMapsWidthOffset)) > mapper.gamestage.canvas.width);
		};
	};

	var playerSpriteSheet = new createjs.SpriteSheet({
		"images": ["images/businessmanspritesheet.png"],
		"frames": {
			"width": 30, "height": 30, "count": 18
		},
		"animations": {
			"stand": {
				"frames" : [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
				"next" : "stand",
				"speed" : (0.175 / lowFramerate) / skipFrames
			},
			"startrun" : {
				"frames" : [2],
				"next" : "run",
				"speed" : (0.175 / lowFramerate) / skipFrames
			},
			"run": {
				"frames" : [3, 4, 5],
				"next" : "run",
				"speed" : (0.2 / lowFramerate) / skipFrames
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
				"speed" : (0.2 / lowFramerate) / skipFrames
			},
			"damage": {
				"frames" : [16],
				"next" : "damage",
				"speed" : (5  / lowFramerate) / skipFrames
			},
			"jumpshoot": {
				"frames" : [11],
				"next" : "jumpshoot"
			}
		}
	}); // new createjs.Bitmap("images/businessmanspritesheet.png");

	this.animations         = new createjs.Sprite(playerSpriteSheet, "stand");
	this.x                  = 96;
	this.animations.x       = this.x;
	this.lastx				= this.x;
	this.y                  = 30;
	this.goingLeft          = false;
	this.goingRight         = false;
	this.jumping            = false;
	this.falling            = false;
	this.jumpreleased       = true;
	this.jumpspeed          = 0;
	this.shootTicks         = 0;
	this.watchedElements    = [];
	this.health             = 28;
	this.actions            = {};
	this.gamestage			= mapper.gamestage;
	this.ignoreDamage		= false;
	this.ignoreInput        = false;
	this.healthbar          = new HealthBar(gamestage, this);
	this.shotIndex          = 0;
	var skipThisCheck       = false;

	this.shots = [new Shot(this, mapper), new Shot(this, mapper), new Shot(this, mapper),
				  new Shot(this, mapper), new Shot(this, mapper), new Shot(this, mapper),
				  new Shot(this, mapper), new Shot(this, mapper), new Shot(this, mapper),
				  new Shot(this, mapper), new Shot(this, mapper), new Shot(this, mapper),
				  new Shot(this, mapper), new Shot(this, mapper), new Shot(this, mapper),
				  new Shot(this, mapper), new Shot(this, mapper), new Shot(this, mapper),
				  new Shot(this, mapper), new Shot(this, mapper), new Shot(this, mapper),
				  new Shot(this, mapper), new Shot(this, mapper), new Shot(this, mapper),
				  new Shot(this, mapper), new Shot(this, mapper), new Shot(this, mapper)];

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
				break;

			case 39:
				// keyCode 39 is right arrow
				this.actions.playerRight = true;
				this.actions.playerLeft = false;
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
				break;

			case 39:
				// keyCode 39 is right arrow
				this.actions.playerRight = false;
				this.actions.playerLeft = false;
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
                touchSprite.x = touch.pageX /2;
                touchSprite.y = touch.pageY /2;
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
        this.gamestage.addChild(this.animations);
        this.ignoreInput = false;
    }.bind(this), 1000);

    // lots of weird rules here to make the game as megaman-like as possible
    // as we're aming to be a reimplementation of megaman physics, and not realistic physics
    // most values are doubled from their megaman values as i am using double sized sprites
    this.tickActions = function(actions) {
        if (this.ignoreInput) {
            if (this.ignoreDamage) {
                this.x += -this.animations.scaleX * lowFramerate;
                // prevent us from moving left after a screen transition
                if (this.animations.x < 0 && this.goingLeft) {
                    this.x = this.lastx;
                }

                if ((this.x - mapper.completedMapsWidthOffset > this.gamestage.canvas.width / 2) &&
                    (mapper.getMapWidth() + mapper.completedMapsWidthOffset > this.x + this.gamestage.canvas.width / 2)) {

                    mapper.advance(this.lastx - this.x);
                } else {
                    this.animations.x += this.x - this.lastx;
                }
                this.lastx = this.x;
                this.animations.y = this.y;
                this.watchedElements.forEach(function(element) {
                    element.tickActions(actions);
                }.bind(this));
                this.shots.forEach(function(shot) {
                    shot.tickActions(actions);
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
            this.jumpspeed = -4.875;
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
        } else if (this.jumping && this.jumpreleased && !this.falling && this.jumpspeed < 2) {
            this.jumpspeed = 2;
		}

		var ignoreLeftRightCollisionThisFrame = false;
		if ((this.jumping && actions.collisionResults.downmove && actions.collisionResults.upmove) || (this.jumping && actions.collisionResults.downmove && this.jumpspeed > 0)) {
			this.y += this.jumpspeed * lowFramerate;
			this.jumpspeed = this.jumpspeed + 0.25 * lowFramerate;
			if (this.jumpspeed > 12 / lowFramerate) {
				this.jumpspeed = 12 / lowFramerate; // megaman's terminal velocity
			}
		} else if (this.jumping && !actions.collisionResults.downmove && !actions.collisionResults.nextmap) {
			if (!this.goingLeft && !this.goingRight) {
				this.animations.gotoAndPlay("stand");
			} else {
				this.animations.gotoAndPlay("run");
			}
			this.jumping = false;
			this.falling = false;

			// correcting floor position after a jump/fall:
			this.y -= (this.y + this.animations.spriteSheet._frameHeight) % 16;
			if (this.y + this.animations.spriteSheet._frameHeight > mapper.gamestage.canvas.height) {
				this.y -= 16;
			}
			ignoreLeftRightCollisionThisFrame = true;
		} else if (this.jumping && !actions.collisionResults.upmove) {
			this.jumpspeed = 0.5; // megaman's jumpspeed set to .5 when he bonks his head
			this.y += this.jumpspeed * lowFramerate;
		}

		if (this.actions.playerLeft && (actions.collisionResults.leftmove || ignoreLeftRightCollisionThisFrame)) {
			this.goingRight = false;
			this.goingLeft  = true;
			this.animations.scaleX = -1;
			this.animations.regX = 30;
			if ((this.animations.currentAnimation !== "run" && this.animations.currentAnimation !== "startrun" && this.animations.currentAnimation !== "runshoot") && !this.jumping) {
				this.animations.gotoAndPlay("startrun");
				this.movementTicks = 9 / lowFramerate;
			}
		} else if (this.actions.playerRight && (actions.collisionResults.rightmove || ignoreLeftRightCollisionThisFrame)) {
			this.goingRight = true;
			this.goingLeft  = false;
			this.animations.scaleX = 1;
			this.animations.regX = 0;
			if ((this.animations.currentAnimation !== "run" && this.animations.currentAnimation !== "startrun" && this.animations.currentAnimation !== "runshoot") && !this.jumping) {
				this.animations.gotoAndPlay("startrun");
				this.movementTicks = 9 / lowFramerate;
			}
		} else {
			this.goingRight = false;
			this.goingLeft = false;
			if (this.animations.currentAnimation !== "stand" && this.animations.currentAnimation !== "standshoot" && !this.jumping) {
				this.animations.gotoAndPlay("stand");
				this.movementTicks = 9 / lowFramerate;
			}
		}

		if (this.actions.playerAttack && this.shootTicks <= 0) {
			//this.watchedElements.push(new Shot(this.stage, this, mapper));
			var shot = this.shots[this.shotIndex++ % 27];
			if (shot.disabled) {
				shot.fireUp();
			}

			//var sound = createjs.Sound.play("shoot");
			//sound.volume = 0.05;
			this.shootTicks = 15 / lowFramerate; // not correct

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
					this.x += 1.325 * lowFramerate; // megaman moved slower while jumping...
				} else {
					if (this.movementTicks > 0) {
						this.x += 0.2 * lowFramerate; // megaman moved slower as he began moving
						this.movementTicks--;
					} else {
						this.x += 1.375 * lowFramerate;
					}
				}
			} else if (this.goingLeft && (actions.collisionResults.leftmove || ignoreLeftRightCollisionThisFrame)) {
				if (this.jumping) {
					this.x += -1.325 * lowFramerate; // megaman moved slower while jumping...
				} else {
					if (this.movementTicks > 0) {
						this.x += -0.2 * lowFramerate; // megaman moved slower as he began moving
						this.movementTicks--;
					} else {
						this.x += -1.375 * lowFramerate;
					}
				}
			}
		} else if (this.movementTicks > 0) {
			if ((actions.collisionResults.rightmove && actions.collisionResults.leftmove) || ignoreLeftRightCollisionThisFrame) {
				this.x += 0.4 * this.animations.scaleX * lowFramerate;
				this.movementTicks--;
			} else {
				this.movementTicks = 0;
			}
		}

		// prevent us from moving left after a screen transition
		if (this.animations.x < 0 && this.goingLeft) {
			this.x = this.lastx;
		}

		if ((this.x - mapper.completedMapsWidthOffset > this.gamestage.canvas.width / 2) &&
			(mapper.getMapWidth() + mapper.completedMapsWidthOffset > this.x + this.gamestage.canvas.width / 2)) {

			mapper.advance(this.lastx - this.x);
		} else {
			this.animations.x += this.x - this.lastx;
		}
		this.lastx = this.x;
		this.animations.y = this.y;

		this.watchedElements.forEach(function(element) {
			element.tickActions(actions);
		}.bind(this));

		this.shots.forEach(function(shot) {
			shot.tickActions(actions);
		}.bind(this));

		if (this.actions.playerDebug) {
			mapper.container.visible = (mapper.container.visible) ? false : true;
		}
		//console.log(this.x);
		//

		if (this.x + this.animations.spriteSheet._frameWidth > mapper.getMapWidth() + mapper.completedMapsWidthOffset) {
			mapper.nextMapRight(mapper.mapData);

			this.ignoreInput = true;
			setTimeout(function() {
				this.ignoreInput = false;
			}.bind(this), 300);
		}

		if (actions.collisionResults.nextmap) {
			mapper.nextMapDown(mapper.mapData);
			this.ignoreInput = true;

			setTimeout(function() {
				this.ignoreInput = false;
			}.bind(this), 500);
		}

		if (!this.ignoreDamage) {
			if (!skipThisCheck) {
				this.checkEnemyCollisions();
				skipThisCheck = true;
			} else {
				skipThisCheck = false;
			}
		}
	};

	this.checkEnemyCollisions = function() {
		mapper.enemies.forEach(function(enemy) {

			if (enemy.health > 0 || typeof(enemy.health) === "undefined") {
				var intersection = fastCollisionPlayer(this, enemy);
				//var intersection = ndgmrX.checkRectCollision(this.animations, enemy.animations);
				if (intersection) {
					this.health -= 2; // should come from enemy
					this.animations.gotoAndPlay("damage");
					this.ignoreInput = true;
					this.ignoreDamage = true;

					this.x += -this.animations.scaleX;
					setTimeout(function() {
						this.ignoreDamage = false;
					}.bind(this), 1000);
					setTimeout(function() {
						this.ignoreInput = false;
					}.bind(this), 250);

					if (this.jumpspeed < 2 && this.jumping) {
						this.jumpspeed = 2;
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
					enemyshot.removeSelf();
					this.health -= 4; // should actually come from the enemy
					this.animations.gotoAndPlay("damage");
					this.ignoreInput = true;
					this.ignoreDamage = true;

					this.x += -this.animations.scaleX;
					setTimeout(function() {
						this.ignoreDamage = false;
					}.bind(this), 1000);
					setTimeout(function() {
						this.ignoreInput = false;
					}.bind(this), 500);

					if (this.jumpspeed < 2 && this.jumping) {
						this.jumpspeed = 2;
					}
				}
			}.bind(this));
		}.bind(this));
	};
}