function Player(stage, heightOffset, widthOffset, mapper, gamestage) {

	var playerSpriteSheet = new createjs.SpriteSheet({
		"images": ["images/businessmanspritesheet.png"],
		"frames": {
			"width": 60, "height": 60, "count": 18
		},
		"animations": {
			"stand": {
				"frames" : [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
				"next" : "stand",
				"speed" : 0.125
			},
			"startrun" : {
				"frames" : [2],
				"next" : "run",
				"speed" : 0.125
			},
			"run": {
				"frames" : [3, 4, 5],
				"next" : "run",
				"speed" : 0.15
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
				"speed" : 0.15
			},
			"jumpshoot": {
				"frames" : [11],
				"next" : "jumpshoot"
			}
		}
	}); // new createjs.Bitmap("images/businessmanspritesheet.png");

	this.stage              = stage;
	this.animations         = new createjs.Sprite(playerSpriteSheet, "stand");
	this.x                  = widthOffset + 30;
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
	this.gamestage			= gamestage;
	this.pageflips 			= 0;
	this.advancing          = false;

	this.watchedElements.push(new HealthBar(gamestage, this));

	document.onkeydown = function () {
		switch (window.event.keyCode) {
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

	document.onkeyup = function () {
		switch (window.event.keyCode) {
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

	this.animations.play();
	this.stage.addChild(this.animations);

	// lots of weird rules here to make the game as megaman-like as possible
	// as we're aming to be a reimplementation of megaman physics, and not realistic physics
	// most values are doubled from their megaman values as i am using double sized sprites
	this.tickActions = function(actions) {
		if (this.advancing) {
			return;
		}

		if (this.shootTicks > 0) {
			this.shootTicks--;

			if (this.shootTicks === 0) {
				if (this.animations.currentAnimation === "jumpshoot") {
					this.animations.gotoAndPlay("jump");
				} else if (this.animations.currentAnimation === "runshoot") {
					this.animations.gotoAndPlay("run");
				} else if (this.animations.currentAnimation === "standshoot") {
					this.animations.gotoAndPlay("stand");
				}
			}
		}

		if (this.actions.playerLeft && actions.collisionResults.leftmove) {
			this.goingRight = false;
			this.goingLeft  = true;
			this.animations.scaleX = -1;
			this.animations.regX = 60;
			if ((this.animations.currentAnimation !== "run" && this.animations.currentAnimation !== "startrun" && this.animations.currentAnimation !== "runshoot") && !this.jumping) {
				this.animations.gotoAndPlay("startrun");
				this.movementTicks = 9;
			}
		} else if (this.actions.playerRight && actions.collisionResults.rightmove) {
			this.goingRight = true;
			this.goingLeft  = false;
			this.animations.scaleX = 1;
			this.animations.regX = 0;
			if ((this.animations.currentAnimation !== "run" && this.animations.currentAnimation !== "startrun" && this.animations.currentAnimation !== "runshoot") && !this.jumping) {
				this.animations.gotoAndPlay("startrun");
				this.movementTicks = 9;
			}
		} else {
			this.goingRight = false;
			this.goingLeft = false;
			if (this.animations.currentAnimation !== "stand" && this.animations.currentAnimation !== "standshoot" && !this.jumping) {
				this.animations.gotoAndPlay("stand");
				this.movementTicks = 9;
			}
		}

		if (this.actions.playerJump && !this.jumping && actions.collisionResults.upmove && this.jumpreleased) {
			actions.collisionResults.downmove = true;
			this.jumpreleased = false;
			this.jumpspeed = -9.75;
			this.jumping = true;

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

		if (this.actions.playerAttack && this.shootTicks === 0) {
			this.watchedElements.push(new Shot(stage, this.x, this.y, this.animations.scaleX));
			this.shootTicks = 15; // not correct for megaman
			if (this.animations.currentAnimation === "jump") {
				this.animations.gotoAndPlay("jumpshoot");
			} else if (this.animations.currentAnimation === "run") {
				this.animations.gotoAndPlay("runshoot");
			} else if (this.animations.currentAnimation === "stand") {
				this.animations.gotoAndPlay("standshoot");
			}
		}

		if (this.goingRight || this.goingLeft) {
			if (this.goingRight && actions.collisionResults.rightmove) {
				if (this.jumping) {
					this.x += 2.65; // megaman moved slower while jumping...
				} else {
					if (this.movementTicks > 0) {
						this.x += 0.4; // megaman moved slower as he began moving
						this.movementTicks--;
					} else {
						this.x += 2.75;
					}
				}
			} else if (this.goingLeft && actions.collisionResults.leftmove) {
				if (this.jumping) {
					this.x += -2.65; // megaman moved slower while jumping...
				} else {
					if (this.movementTicks > 0) {
						this.x += -0.4; // megaman moved slower as he began moving
						this.movementTicks--;
					} else {
						this.x += -2.75;
					}
				}
			}
		} else if (this.movementTicks > 0) {
			if (actions.collisionResults.rightmove && actions.collisionResults.leftmove) {
				this.x += 0.8 * this.animations.scaleX;
				this.movementTicks--;
			} else {
				this.movementTicks = 0;
			}
		}

		if ((this.jumping && actions.collisionResults.downmove && actions.collisionResults.upmove) || (this.jumping && actions.collisionResults.downmove && this.jumpspeed > 0)) {
			this.y += this.jumpspeed;
			this.jumpspeed = this.jumpspeed + 0.5;
			if (this.jumpspeed > 24) {
				this.jumpspeed = 24; // megaman's terminal velocity
			}
		} else if (this.jumping && !actions.collisionResults.downmove) {
			if (!this.goingLeft && !this.goingRight) {
				this.animations.gotoAndPlay("stand");
			} else {
				this.animations.gotoAndPlay("run");
			}
			this.jumping = false;
			this.falling = false;

			// correcting floor position after a jump/fall:
			var yMod = this.y % 32;
			if (yMod >= 2) {
				this.y = this.y - (yMod - 4);
			}
		} else if (this.jumping && !actions.collisionResults.upmove) {
			this.jumpspeed = 1; // megaman's jumpspeed set to 1 when he bonks his head
			this.y += this.jumpspeed;
		}

		this.animations.x = this.x;
		this.animations.y = this.y;

		this.watchedElements.forEach(function(element) {
			element.tickActions(actions);
		});

		if (this.actions.playerDebug) {	
			this.mapper.nextMap(this.mapper.map2, this.x, this.y);
			this.pageflips = 0;
			this.advancing = true;
			this.stage.addChild(this.animations);

			setTimeout(function() {
				this.advancing = false;
			}.bind(this), 1000);
		}
		//console.log(this.x);
		if (this.x > this.gamestage.canvas.width - 200 + 660 * this.pageflips) {
			this.pageflips++;
			this.advancing = true;
			this.mapper.advance();

			setTimeout(function() {
				this.advancing = false;
			}.bind(this), 1000);
		} else if (this.x < 200 + 660 * this.pageflips && this.pageflips > 0) {
			this.pageflips--;
			this.advancing = true;
			this.mapper.reverse();

			setTimeout(function() {
				this.advancing = false;
			}.bind(this), 1000);
		} else if (actions.collisionResults.nextmap) {
			this.mapper.nextMap(this.mapper.map2, this.x, this.y);
			this.pageflips = 0;
			this.advancing = true;
			this.stage.addChild(this.animations);

			setTimeout(function() {
				this.advancing = false;
			}.bind(this), 1000);
		}


	};

	var Shot = function(stage, playerX, playerY, direction) {
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

		this.stage      = stage;
		this.direction  = direction;
		this.animations = new createjs.Sprite(shotSpriteSheet, "shot");
		this.x          = playerX + ((this.direction === 1) ? 52 : -6);
		this.y          = playerY + 27;
		this.done       = false;

		this.animations.play();
		this.stage.addChild(this.animations);

		this.tickActions = function(actions) {
			this.x = this.x + (7 * this.direction);
			this.animations.x = this.x;
			this.animations.y = this.y;

			if (this.x > 2000) {
				this.done = true;
			}
		};
	};
}