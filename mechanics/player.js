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
				if (enemy.dead) {
					return;
				}

				//var intersection = ndgmrX.checkRectCollision(this.animations, enemy.animations);
				if (fastCollisionX(this, enemy) && !(enemy.constructor === Platform || enemy.constructor === DroppingPlatform || enemy.constructor === DisappearingPlatform) && enemy.constructor !== KillCopy) {
					if (enemy.hardshell) {
						this.yspeed = 3.5;
						this.direction = this.direction * (this.bounced) ? 1 : -1;
						this.bounced = true;

			            playSound("shotbounce");
						return;
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
			var explosion = shotExplosionSprite.clone(true);
			explosion.x = this.animations.x - this.animations.spriteSheet._frameWidth / 2;
			explosion.y = this.animations.y - this.animations.spriteSheet._frameHeight / 2;
			mapper.enemyContainer.removeChild(this.animations);
			explosion.gotoAndPlay("explode");

			if (this.checkBounds()) {
            	playSound("shotexplode");
        	}
			mapper.enemyContainer.addChild(explosion);
			setTimeout(function() {
				mapper.enemyContainer.removeChild(explosion);
			}.bind(this), 15.625); // approx 2 frames
			this.disabled = true;
		};

		this.checkBounds = function() {
			if (this.y < 0 || Math.abs(this.y - player.y) > mapper.gamestage.canvas.height) {
				return false;
			}

			return !(this.x < 0 || Math.abs(this.x - (player.x - mapper.completedMapsWidthOffset)) > 400);
		};
	};

	var playerSpriteSheet = new createjs.SpriteSheet({
		"images": ["images/businessmanspritesheet.png"],
		"frames": {
			"width": 30, "height": 30, "count": 19
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
				"frames" : [3, 4, 5, 4],
				"next" : "run",
				"speed" : (0.175 / lowFramerate) / skipFrames
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
				"frames" : [7, 8],
				"next" : "runshoot",
				"speed" : (0.175 / lowFramerate) / skipFrames
			},
			"damage": {
				"frames" : [16],
				"next" : "damage",
				"speed" : (5  / lowFramerate) / skipFrames
			},
			"jumpshoot": {
				"frames" : [11],
				"next" : "jumpshoot"
			},
			"thumbsup": {
				"frames" : [18],
				"next" : "thumbsup"
			}
		}
	}); // new createjs.Bitmap("images/businessmanspritesheet.png");

	this.animations                        = new createjs.Sprite(playerSpriteSheet, "stand");
	this.x                                 = 96;
	this.animations.x                      = this.x;
	this.lastx				               = this.x;
	this.y                                 = 90;
	this.goingLeft                         = false;
	this.goingRight                        = false;
	this.jumping                           = false;
	this.onplatform                        = false;
	this.ignoreBounceBack                  = false;
	this.falling                           = false;
	this.pauseMenu                         = new PauseMenu();
	this.transitionedUp                    = false;
	this.jumpreleased                      = true;
	this.jumpspeed                         = 0;
	this.shootTicks                        = 0;
	this.watchedElements                   = [];
	this.paused                            = false;
	this.health                            = 28;
	this.actions                           = {};
	this.gameActions                       = {};
	this.jumpCount                         = 0;
	this.gamestage			               = mapper.gamestage;
	this.ignoreDamage		               = false;
	this.ignoreInput                       = false;
	this.healthbar                         = new HealthBar(gamestage, this);
	this.shotIndex                         = 0;
	this.ignoreLeftRightCollisionThisFrame = 0;
	var skipThisCheck                      = false;

	this.shots = [	new Shot(this, mapper), new Shot(this, mapper), new Shot(this, mapper),
					new Shot(this, mapper), new Shot(this, mapper), new Shot(this, mapper),
					new Shot(this, mapper), new Shot(this, mapper), new Shot(this, mapper),
					new Shot(this, mapper), new Shot(this, mapper), new Shot(this, mapper),
					new Shot(this, mapper), new Shot(this, mapper), new Shot(this, mapper),
					new Shot(this, mapper), new Shot(this, mapper), new Shot(this, mapper),
					new Shot(this, mapper), new Shot(this, mapper), new Shot(this, mapper),
					new Shot(this, mapper), new Shot(this, mapper), new Shot(this, mapper),
					new Shot(this, mapper), new Shot(this, mapper), new Shot(this, mapper)];

	setTimeout(function() {
		this.ignoreDamage = false;
	}.bind(this), 2000);

	this.watchedElements.push(this.healthbar);

	document.onkeydown = function (event) {
		switch (event.keyCode) {
			case 37:
				// keyCode 37 is left arrow
				this.actions.playerLeft = true;
				break;

			case 39:
				// keyCode 39 is right arrow
				this.actions.playerRight = true;
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

			case 80:
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

	document.onkeyup = function (event) {
		switch (event.keyCode) {
			case 37:
				// keyCode 37 is left arrow
				this.actions.playerLeft = false;
				break;

			case 39:
				// keyCode 39 is right arrow
				this.actions.playerRight = false;
				break;

			case 32:
				// keyCode 32 is space
				this.actions.playerJump = false;
				this.jumpreleased = true;
				break;

			case 67:
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

    if (mobile) {
        var touchEventSpriteSheet = new createjs.SpriteSheet({
            "images": ["images/pixel.png"],
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

        this.touchIds = [];

        var eventHandler = function(event) {
            if (!pauseUp && !bossScreenUp) {
            	event.preventDefault();
            }

            for (var i = 0; i < event.touches.length; i++) {
                var touch = event.touches[i];
                touchSprite.x = (event.pageX || touch.pageX) /gamezoom;
                touchSprite.y = (event.pageY || touch.pageY) /gamezoom;
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

		document.getElementById("gamecanvas").addEventListener('touchstart',	eventHandler.bind(this), false);
    	document.getElementById("gamecanvas").addEventListener('touchmove',		eventHandler.bind(this), false);
    	document.getElementById("gamecanvas").addEventListener('touchend',		endTouchEventHandler.bind(this), false);
    	document.getElementById("gamecanvas").addEventListener('touchcancel',	endTouchEventHandler.bind(this), false);
    	document.getElementById("gamecanvas").addEventListener('touchleave',	endTouchEventHandler.bind(this), false);
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
		this.gameActions = actions;
		if (mapper.transitiondown || mapper.transitionup) {
			return;
		}

		if (this.gameActions.collisionResults.nextmapup && this.y < -10 && (mapper.getNextMapDirection() === "up" || mapper.getLastMapDirection() === "up")) { //mapper.getNextMapDirection() === "up") {
			if (mapper.getLastMapDirection() === "up") {
            	mapper.lastMapUp();
            } else {
            	mapper.nextMapUp();
        	}
		}

		if (this.transitionedUp) {
			this.y += this.jumpspeed * lowFramerate;
			this.jumpspeed = this.jumpspeed + 0.25 * lowFramerate;
			this.animations.y = this.y;
		}

        if (this.ignoreInput) {
            if (this.ignoreDamage && !this.ignoreBounceBack) {
            	if ((actions.collisionResults.leftMove && this.animations.scaleX === 1) || (actions.collisionResults.rightMove && this.animations.scaleX === -1)) {
            		this.x += -this.animations.scaleX * lowFramerate;
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
            playSound("playerdamaged");
        }

        if (this.health <= 0) {
            console.log("dead");

            if (mobile) {
		        document.getElementById("gamecanvas").removeEventListener('touchstart', eventHandler.bind(this), false);
		        document.getElementById("gamecanvas").removeEventListener('touchmove', eventHandler.bind(this), false);
		        document.getElementById("gamecanvas").removeEventListener('touchend', endTouchEventHandler.bind(this), false);
		        document.getElementById("gamecanvas").removeEventListener('touchcancel', endTouchEventHandler.bind(this), false);
		        document.getElementById("gamecanvas").removeEventListener('touchleave', endTouchEventHandler.bind(this), false);
    		}
            actions.playerDeath = true;
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
        } else if (this.jumping && this.jumpreleased && !this.falling && this.jumpspeed < 2 && !doubleJump) {
            this.jumpspeed = 2;
		} else if (this.jumping && this.jumpspeed >= 0 && actions.collisionResults.upmove && this.actions.playerJump && doubleJump && this.jumpCount === 1 && this.jumpreleased) {
			this.jumpspeed = -4.875;
			this.jumpCount++;
		}

		if (this.ignoreLeftRightCollisionThisFrame !== 0) {
			this.ignoreLeftRightCollisionThisFrame--;
		}

		if ((this.jumping && actions.collisionResults.downmove && actions.collisionResults.upmove) || (this.jumping && actions.collisionResults.downmove && this.jumpspeed > 0)) {
			this.y += this.jumpspeed * lowFramerate;
			this.jumpspeed = this.jumpspeed + 0.25 * lowFramerate;
			if (this.jumpspeed > 12 / lowFramerate) {
				this.jumpspeed = 12 / lowFramerate; // megaman's terminal velocity
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
			this.y -= (this.y + this.animations.spriteSheet._frameHeight) % 16;
			if (this.y + this.animations.spriteSheet._frameHeight > mapper.gamestage.canvas.height) {
				this.y -= 16;
			}
			this.ignoreLeftRightCollisionThisFrame = 5;
		} else if (this.jumping && !actions.collisionResults.upmove) {
			this.jumpspeed = 0.5; // megaman's jumpspeed set to .5 when he bonks his head
			//this.y += this.jumpspeed * lowFramerate;
			this.ignoreLeftRightCollisionThisFrame = 5;
		} else if (this.onplatform && !actions.collisionResults.upmove) {
			this.y += 38;
			this.onplatform = false;
			this.falling = true;
			this.animations.gotoAndPlay("jump");
		}

		if (this.actions.playerLeft && (actions.collisionResults.leftmove || this.ignoreLeftRightCollisionThisFrame !== 0)) {
			this.goingRight = false;
			this.goingLeft  = true;
			this.animations.scaleX = -1;
			this.animations.regX = 30;
			if ((this.animations.currentAnimation !== "run" && this.animations.currentAnimation !== "startrun" && this.animations.currentAnimation !== "runshoot") && !this.jumping) {
				this.animations.gotoAndPlay("startrun");
				this.movementTicks = 9 / lowFramerate;
			}
		} else if (this.actions.playerRight && (actions.collisionResults.rightmove || this.ignoreLeftRightCollisionThisFrame !== 0)) {
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

			playSound("shoot");
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
			if (this.goingRight && (actions.collisionResults.rightmove || this.ignoreLeftRightCollisionThisFrame !== 0)) {
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
			} else if (this.goingLeft && (actions.collisionResults.leftmove || this.ignoreLeftRightCollisionThisFrame !== 0)) {
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
			if ((actions.collisionResults.rightmove && actions.collisionResults.leftmove) || this.ignoreLeftRightCollisionThisFrame !== 0) {
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
			damageModifier = 1000;
		}
		//console.log(this.x);
		//

		if (this.x + this.animations.spriteSheet._frameWidth > mapper.getMapWidth() + mapper.completedMapsWidthOffset + mapper.widthOffset && (mapper.getNextMapDirection() === "right" || mapper.getLastMapDirection() === "right")) {
			if (mapper.getLastMapDirection() === "right") {
                mapper.lastMapRight(mapper.mapData);
            } else {
            	mapper.nextMapRight(mapper.mapData);
        	}

			this.ignoreInput = true;
			setTimeout(function() {
				this.ignoreInput = false;
			}.bind(this), 300);
		}

		if (actions.collisionResults.nextmap && (mapper.getNextMapDirection() === "down" || mapper.getLastMapDirection() === "down")) {
			if (mapper.getLastMapDirection() === "down") {
            	mapper.lastMapDown(mapper.mapData);
            } else {
            	mapper.nextMapDown(mapper.mapData);
            }

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
				if (enemy.damage < 1) { // for non enemy objects
					if (enemy.constructor === Platform || enemy.constructor === DisappearingPlatform || enemy.constructor === DroppingPlatform) {
						intersection = fastInitialCollisionPlatform(this, enemy);
					} else {
						intersection = fastCollisionPlayerLoose(this, enemy);
					}
				}

				if (intersection) {
					if (enemy.damage > 0) {
						this.health -= enemy.damage / damageModifier;
						this.animations.gotoAndPlay("damage");

			            playSound("playerdamaged");
						this.ignoreInput = true;
						this.ignoreDamage = true;

						this.x += -this.animations.scaleX;
						setTimeout(function() {
							this.ignoreDamage = false;
						}.bind(this), 1000);
						setTimeout(function() {
							this.ignoreInput = false;
						}.bind(this), 200);
					} else if (enemy.damage < 0) { // this is actually health!
						this.health -= enemy.damage;
						enemy.health = -1;
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
					enemyshot.removeSelf();
					this.health -= enemyshot.damage; // should actually come from the enemy
					this.animations.gotoAndPlay("damage");


		            playSound("playerdamaged");
					this.ignoreInput = true;
					this.ignoreDamage = true;

					this.x += -this.animations.scaleX;
					setTimeout(function() {
						this.ignoreDamage = false;
					}.bind(this), 1000);
					setTimeout(function() {
						this.ignoreInput = false;
					}.bind(this), 300);

					if (this.jumpspeed < 2 && this.jumping) {
						this.jumpspeed = 2;
					}
				}
			}.bind(this));
		}.bind(this));
	};

	this.defeatedBoss = function() {
		this.ignoreDamage = true;
		this.ignoreInput = true;
		this.ignoreBounceBack = true;
		setTimeout(function() {
			player.animations.gotoAndPlay("thumbsup");
		}, 1500);
		setTimeout(function() {
			createjs.Ticker.removeEventListener("tick", handleTick);
		}.bind(this), 2800);
		setTimeout(function() {
			this.ignoreDamage = false;
			this.ignoreInput = false;
			this.ignoreBounceBack = false;
			initVars();
			initBossScreen();
		}.bind(this), 3000);
	};
}
