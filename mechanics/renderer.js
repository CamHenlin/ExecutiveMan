/**
 * [Renderer description]
 * @param {[type]} gamestage [description]
 */
function Renderer(gamestage) {
	this.collisionArray = [
		[],
		[]
	];
	this.container = new createjs.Container();
	this.container.x = 0;
	this.container.y = 0;
	this.gamestage = gamestage;
	this.heightOffset = 0;
	this.mapData = maps[0];
	this.lastWidthOffset = 0;
	this.tileset = new Image();
	this.transitioncount = 0;
	this.transitiondown = false;
	this.transitionup = false;
	this.widthOffset = null;
	this.backgroundContainer1 = new createjs.Container();
	this.backgroundContainer2 = new createjs.Container();
	this.lastbackgroundContainer1 = new createjs.Container();
	this.lastbackgroundContainer2 = new createjs.Container();
	this.backgroundTicks = 1;
	this.basicCollision = null;
	this.completedMapsWidthOffset = 0;
	this.deathCollisionArray = [
		[],
		[]
	];
	this.doneRendering = false;
	this.enemies = [];
	this.objects = [];
	this.enemyContainer = new createjs.Container();
	this.lastContainer = new createjs.Container();
	this.mapcounter = 0;
	this.stitchingoffset = 0;
	this.screenHeightDelta = 0;
	this.screenWidthDelta = 0;
	this.parentContainer = new createjs.Container();
	this.lastParentContainer = new createjs.Container();

	// figure out offsets:
	this.heightOffset = this.gamestage.canvas.height - this.mapData.tilesets[0].tileheight * this.mapData.layers[0].height;
	if (mobile) {
		this.heightOffset -= 48;
	}
	// correct for collisions:
	this.heightOffset -= (this.heightOffset + 16) % 16;

	if (this.gamestage.canvas.width > this.mapData.tilesets[0].tilewidth * this.mapData.layers[0].width) {
		this.widthOffset = (this.gamestage.canvas.width - this.mapData.tilesets[0].tilewidth * this.mapData.layers[0].width) / 2;
		//this.completedMapsWidthOffset += this.widthOffset;
	} else {
		this.widthOffset = 0;
	}

	// getting imagefile from first tileset
	if (this.mapData.tilesets[0].image.indexOf("..\/") > -1) {
		this.mapData.tilesets[0].image = this.mapData.tilesets[0].image.replace("..\/", "");
	}

	this.tileset.src = this.mapData.tilesets[0].image;

	/**
	 * [beginCaching description]
	 * @param  {[type]} container [description]
	 * @return {[type]}           [description]
	 */
	this.beginCaching = function(container) {
		container.cache(0, 0, (this.getMapWidth() > gamestage.canvas.width) ? this.getMapWidth() : gamestage.canvas.width, this.gamestage.canvas.height); //this.mapData.tilesets[0].tileheight * this.mapData.layers[0].height);
	};

	/**
	 * [advance description]
	 * @param  {[type]} amount [description]
	 * @return {[type]}        [description]
	 */
	this.advance = function(amount) {
		this.parentContainer.x += amount;
		this.enemyContainer.x += amount;
	};

	this.showingReadyLabel = false;
	var readyLabel = new createjs.Text("READY", "14px '" + FONT + "'", "#FFF");
	var readyLabel2 = new createjs.Text("READY", "14px '" + FONT + "'", "#000");
	readyLabel.x = this.gamestage.canvas.width / 2 - 14;
	readyLabel.y = this.gamestage.canvas.height / 2;
	readyLabel2.x = this.gamestage.canvas.width / 2 - 13;
	readyLabel2.y = this.gamestage.canvas.height / 2 + 1;

	/**
	 * [initMap description]
	 * @return {[type]} [description]
	 */
	this.initMap = function() {
		this.prepareRenderer();
		this.initLayers();
		this.completeRenderer();

		this.enemyContainer.visible = false;
		player.animations.visible = false;
		this.doneRendering = true;

		if (isDemo) {
			player.animations.visible = true;
			this.enemyContainer.visible = true;
			player.x += this.widthOffset;
			return;
		}

		this.showingReadyLabel = true;

		this.gamestage.addChild(readyLabel2);
		readyLabel2.visible = true;
		this.gamestage.addChild(readyLabel);
		readyLabel.visible = true;

		var iterations = 8;
		for (var i = 1; i <= iterations; i++) {
			setTimeout(function() {
				readyLabel.visible = true;
				readyLabel2.visible = true;
			}.bind(this), (180 * i + 240));
			setTimeout(function() {
				readyLabel.visible = false;
				readyLabel2.visible = false;
			}.bind(this), (180 * i + 120 + 240));
		}

		setTimeout(function() {
			this.gamestage.removeChild(readyLabel);
			this.gamestage.removeChild(readyLabel2);
		}.bind(this), (iterations * 180 + 60 + 240));
		setTimeout(function() {
			this.showingReadyLabel = false;
		}.bind(this), 3000);
		setTimeout(function() {
			player.animations.visible = true;
			this.enemyContainer.visible = true;
			player.x += this.widthOffset;
		}.bind(this), 3100);
	};

	/**
	 * [prepareRenderer description]
	 * @return {[type]} [description]
	 */
	this.prepareRenderer = function() {
		this.collisionArray = [
			[],
			[]
		];
		this.deathCollisionArray = [
			[],
			[]
		];
		this.lastParentContainer = this.parentContainer.clone(true);
		this.gamestage.addChild(this.lastParentContainer);
		this.gamestage.removeChild(this.parentContainer);
		/*
				for (var i = 0; i < this.enemies.length; i++) {
					this.enemyContainer.removeChild(this.enemies[i]);
					this.enemies[i] = null;
				}

				for (i = 0; i < this.objects.length; i++) {
					this.enemyContainer.removeChild(this.objects[i]);
					this.objects[i] = null;
				}
		*/
		this.gamestage.removeChild(this.enemyContainer);

		this.backgroundContainer1.removeAllChildren();
		this.backgroundContainer2.removeAllChildren();
		this.parentContainer.removeAllChildren();
		this.container = new createjs.Container();
		var fillColor = new createjs.Shape();
		fillColor.graphics.beginFill("#" + this.mapData.properties.backgroundColor).drawRect(0, 0, (this.getMapWidth() > gamestage.canvas.width) ? this.getMapWidth() : gamestage.canvas.width, this.getMapHeight() + this.heightOffset + this.mapData.tileheight);
		this.backgroundContainer1.addChild(fillColor);

		this.enemyContainer.removeAllChildren();
		this.enemyContainer = new createjs.Container();
		this.doneRendering = false;

		player.fallThroughFloor = false;
	};

	/**
	 * [completeRenderer description]
	 * @return {[type]} [description]
	 */
	this.completeRenderer = function() {
		this.parentContainer.tickEnabled = false;
		this.parentContainer.snapToPixel = true;
		this.enemyContainer.tickEnabled = true;

		this.parentContainer.addChild(this.backgroundContainer1);
		this.parentContainer.addChild(this.backgroundContainer2);
		this.parentContainer.addChild(this.container);
		this.gamestage.addChild(this.parentContainer);
		this.gamestage.addChild(this.enemyContainer);

		this.gamestage.removeChild(player.animations);
		this.gamestage.addChild(player.animations);
		player.healthbar.draw();
		if (logFPS) {
			gamestage.addChild(fpsLabel);
		}
		//gamestage.addChild(scoreLabel);


		if (mobile) {
			initTouchControls();
		}
	};

	/**
	 * [getNextMapDirection description]
	 * @return {[type]} [description]
	 */
	this.getNextMapDirection = function() {
		return this.mapData.properties.nextMapDirection;
	};

	/**
	 * [getLastMapDirection description]
	 * @return {[type]} [description]
	 */
	this.getLastMapDirection = function() {
		return this.mapData.properties.lastMapDirection;
	};

	/**
	 * [nextMapDown description]
	 * @return {[type]} [description]
	 */
	this.nextMapDown = function() {
		var lastOffScreenWidth = this.getOffScreenWidth();
		this.lastWidthOffset = this.widthOffset;

		this.mapData = maps[++this.mapcounter];

		if (this.gamestage.canvas.width > this.mapData.tilesets[0].tilewidth * this.mapData.layers[0].width) {
			this.widthOffset = (this.gamestage.canvas.width - this.mapData.tilesets[0].tilewidth * this.mapData.layers[0].width) / 2;
		} else {
			this.widthOffset = 0;
		}

		this.prepareRenderer();

		this.transitiondown = true;

		this.initLayers();
		this.parentContainer.y = this.gameBottom;
		this.enemyContainer.y = this.gameBottom;

		if (parseInt(this.mapData.properties.stitchx) !== 0) {
			// console.log('stitchx');
			this.stitchingoffset = parseInt(this.mapData.properties.stitchx) - (lastOffScreenWidth) + this.lastWidthOffset - this.widthOffset;
			this.completedMapsWidthOffset += parseInt(this.mapData.properties.stitchx) + this.lastWidthOffset - this.widthOffset;
		} else {
			// console.log('no stitchx');
			this.stitchingoffset = this.lastWidthOffset - this.widthOffset - (lastOffScreenWidth);
			this.completedMapsWidthOffset += this.lastWidthOffset; // maybe lastOffScreenWidth shouldnt bethere
		}

		this.parentContainer.x = this.stitchingoffset;
		this.enemyContainer.x = this.stitchingoffset;

		this.completeRenderer();

		this.doneRendering = true;
		if (mobile) {
			initTouchControls();
		}

		this.screenWidthDelta = (this.stitchingoffset) / 60;
	};

	/**
	 * [lastMapDown description]
	 * @return {[type]} [description]
	 */
	this.lastMapDown = function() {
		var lastOffScreenWidth = this.getOffScreenWidth();
		this.lastWidthOffset = this.widthOffset;
		this.lastMapData = this.mapData;

		this.mapData = maps[--this.mapcounter];

		if (this.gamestage.canvas.width > this.mapData.tilesets[0].tilewidth * this.mapData.layers[0].width) {
			this.widthOffset = (this.gamestage.canvas.width - this.mapData.tilesets[0].tilewidth * this.mapData.layers[0].width) / 2;
		} else {
			this.widthOffset = 0;
		}

		this.prepareRenderer();

		this.transitiondown = true;

		this.initLayers();
		this.parentContainer.y = this.gameBottom;
		this.enemyContainer.y = this.gameBottom;

		if (parseInt(this.mapData.properties.stitchx) !== 0) {
			// console.log('stitchx');
			this.stitchingoffset = -parseInt(this.lastMapData.properties.stitchx) - (lastOffScreenWidth) + this.lastWidthOffset - this.widthOffset;
			this.completedMapsWidthOffset += -parseInt(this.mapData.properties.stitchx) + this.lastWidthOffset - this.widthOffset;
		} else {
			// console.log('no stitchx');
			this.stitchingoffset = this.lastWidthOffset - this.widthOffset - (lastOffScreenWidth);
			this.completedMapsWidthOffset += this.lastWidthOffset; // maybe lastOffScreenWidth shouldnt bethere
		}

		this.parentContainer.x = this.stitchingoffset;
		this.enemyContainer.x = this.stitchingoffset;

		this.completeRenderer();

		this.doneRendering = true;
		if (mobile) {
			initTouchControls();
		}

		this.screenWidthDelta = (this.stitchingoffset) / 60;
	};

	/**
	 * [nextMapUp description]
	 * @return {[type]} [description]
	 */
	this.nextMapUp = function() {
		var lastOffScreenWidth = this.getOffScreenWidth();
		this.lastWidthOffset = this.widthOffset;

		this.mapData = maps[++this.mapcounter];

		if (this.gamestage.canvas.width > this.mapData.tilesets[0].tilewidth * this.mapData.layers[0].width) {
			this.widthOffset = (this.gamestage.canvas.width - this.mapData.tilesets[0].tilewidth * this.mapData.layers[0].width) / 2;
		} else {
			this.widthOffset = 0;
		}

		this.prepareRenderer();

		this.transitionup = true;

		this.initLayers();
		this.parentContainer.y = -this.gameBottom;
		this.enemyContainer.y = -this.gameBottom;

		if (parseInt(this.mapData.properties.stitchx) !== 0) {
			// console.log('stitchx');
			this.stitchingoffset = parseInt(this.mapData.properties.stitchx) - (lastOffScreenWidth) + this.lastWidthOffset - this.widthOffset;
			this.completedMapsWidthOffset += parseInt(this.mapData.properties.stitchx) + this.lastWidthOffset - this.widthOffset;
		} else {
			// console.log('no stitchx');
			this.stitchingoffset = this.lastWidthOffset - this.widthOffset - (lastOffScreenWidth);
			this.completedMapsWidthOffset += this.lastWidthOffset; // maybe lastOffScreenWidth shouldnt bethere
		}

		this.parentContainer.x = this.stitchingoffset;
		this.enemyContainer.x = this.stitchingoffset;

		this.completeRenderer();

		this.doneRendering = true;
		if (mobile) {
			initTouchControls();
		}

		this.screenWidthDelta = (this.stitchingoffset) / 60;
	};

	/**
	 * [lastMapUp description]
	 * @return {[type]} [description]
	 */
	this.lastMapUp = function() {
		var lastOffScreenWidth = this.getOffScreenWidth();
		console.log(this.getOffScreenWidth());
		this.lastWidthOffset = this.widthOffset;
		this.lastMapData = this.mapData;
		this.mapData = maps[--this.mapcounter];


		if (this.gamestage.canvas.width > this.mapData.tilesets[0].tilewidth * this.mapData.layers[0].width) {
			this.widthOffset = (this.gamestage.canvas.width - this.mapData.tilesets[0].tilewidth * this.mapData.layers[0].width) / 2;
		} else {
			this.widthOffset = 0;
		}

		this.prepareRenderer();

		this.transitionup = true;

		this.initLayers();
		this.parentContainer.y = -this.gameBottom;
		this.enemyContainer.y = -this.gameBottom;

		// build new map
		if (parseInt(this.mapData.properties.stitchx) !== 0) {
			// console.log('stitchx');
			this.stitchingoffset = -parseInt(this.lastMapData.properties.stitchx) - (lastOffScreenWidth) + this.lastWidthOffset - this.widthOffset;
			this.completedMapsWidthOffset += -parseInt(this.mapData.properties.stitchx) + this.lastWidthOffset - this.widthOffset;
		} else {
			// console.log('no stitchx');
			this.stitchingoffset = this.lastWidthOffset - this.widthOffset - (lastOffScreenWidth);
			this.completedMapsWidthOffset += this.lastWidthOffset; // maybe lastOffScreenWidth shouldnt bethere
		}

		this.parentContainer.x = this.stitchingoffset;
		this.enemyContainer.x = this.stitchingoffset;

		this.completeRenderer();

		this.doneRendering = true;
		if (mobile) {
			initTouchControls();
		}

		this.screenWidthDelta = (this.stitchingoffset) / 60;
	};

	/**
	 * [nextMapRight description]
	 * @return {[type]} [description]
	 */
	this.nextMapRight = function() {
		this.lastWidthOffset = this.widthOffset;
		this.mapData = maps[++this.mapcounter];

		this.collisionArray = [
			[],
			[]
		];
		this.deathCollisionArray = [
			[],
			[]
		];

		if (this.gamestage.canvas.width > this.mapData.tilesets[0].tilewidth * this.mapData.layers[0].width) {
			this.widthOffset = (this.gamestage.canvas.width - this.mapData.tilesets[0].tilewidth * this.mapData.layers[0].width) / 2;
		} else {
			this.widthOffset = 0;
		}

		this.completedMapsWidthOffset += this.getMapWidth() + this.lastWidthOffset + this.widthOffset;
		// clear out currently displayed map:


		this.prepareRenderer();

		// build new map
		this.initLayers();
		this.parentContainer.x = this.gamestage.canvas.width - (this.lastWidthOffset);
		this.enemyContainer.x = this.gamestage.canvas.width - (this.lastWidthOffset);
		this.transitionright = true;


		this.completeRenderer();

		this.doneRendering = true;

		this.screenWidthDelta = (this.gamestage.canvas.width - (this.lastWidthOffset)) / 60;
	};

	/**
	 * [initLayers description]
	 * @return {[type]} [description]
	 */
	this.initLayers = function() {
		// console.log(this.mapData.tilesets[0].image.split("/")[1].split(".")[0]);
		player.watchedElements = [player.healthbar];
		var w = this.mapData.tilesets[0].tilewidth;
		var h = this.mapData.tilesets[0].tileheight;
		this.enemies = [];
		this.objects = [];

		if (this.mapData.tilesets[0].image.indexOf("..\/") > -1) {
			this.mapData.tilesets[0].image = this.mapData.tilesets[0].image.replace("..\/", "");
		}

		var imageData = {
			images: [loader.getResult(this.mapData.tilesets[0].image.split("/")[1].split(".")[0])],
			frames: {
				width: w,
				height: h
			}
		};

		this.container = new createjs.Container();

		// create spritesheet
		var tilesetSheet = new createjs.SpriteSheet(imageData);
		// loading each layer at a time
		for (var i = 0; i < this.mapData.layers.length; i++) {
			var layer = this.mapData.layers[i];
			// console.log(layer);
			if (layer.type === "tilelayer") {
				if (i === 1) { // layer one is ground collision layer
					this.container.addChild(this.initLayerWithCollisionArray(layer, tilesetSheet, this.mapData.tilewidth, this.mapData.tileheight, this.heightOffset, this.widthOffset));
					this.basicCollision = new BasicCollision(this);
				} else if (i === 3) {
					this.enemies = this.initEnemies(layer, tilesetSheet, this.mapData.tilewidth, this.mapData.tileheight, this.heightOffset, this.widthOffset);
				} else if (i === 2) {
					this.container.addChild(this.initLayerWithDeathCollisionArray(layer, tilesetSheet, this.mapData.tilewidth, this.mapData.tileheight, this.heightOffset, this.widthOffset));
				} else if (i === 0) { // bg layer
					this.initBackgroundLayer(layer, tilesetSheet, this.mapData.tilewidth, this.mapData.tileheight, this.heightOffset, this.widthOffset);
				} else {
					this.container.addChild(this.initLayer(layer, tilesetSheet, this.mapData.tilewidth, this.mapData.tileheight, this.heightOffset, this.widthOffset));
				}
			}

			if (layer.type === "objectgroup") {
				for (var j = 0; j < layer.objects.length; j++) {
					if (layer.objects[j].type === "platform") {
						this.objects.push(new Platform(this.enemyContainer, this.basicCollision, this.widthOffset + this.completedMapsWidthOffset + layer.objects[j].x, this.heightOffset + layer.objects[j].y,
							parseInt(layer.objects[j].properties.yrange), parseInt(layer.objects[j].properties.yduration),
							parseInt(layer.objects[j].properties.xrange), parseInt(layer.objects[j].properties.xduration), parseInt(layer.objects[j].properties.delay)));
					}

					if (layer.objects[j].type === "disappearingplatform") {
						this.objects.push(new DisappearingPlatform(this.enemyContainer, this.basicCollision, this.widthOffset + this.completedMapsWidthOffset + layer.objects[j].x, this.heightOffset + layer.objects[j].y,
							parseInt(layer.objects[j].properties.starttimer), parseInt(layer.objects[j].properties.onduration),
							parseInt(layer.objects[j].properties.offduration)));
					}

					if (layer.objects[j].type === "droppingplatform") {
						this.objects.push(new DroppingPlatform(this.enemyContainer, this.basicCollision, this.widthOffset + this.completedMapsWidthOffset + layer.objects[j].x, this.heightOffset + layer.objects[j].y,
							parseInt(layer.objects[j].properties.duration)));
					}

					if (layer.objects[j].type === "rotatingplatform") {
						this.objects.push(new RotatingPlatform(this.enemyContainer, this.basicCollision, this.widthOffset + this.completedMapsWidthOffset + layer.objects[j].x, this.heightOffset + layer.objects[j].y,
							parseFloat(layer.objects[j].properties.xspeed), parseFloat(layer.objects[j].properties.yspeed)));
					}

					if (layer.objects[j].type === "beam") {
						this.objects.push(new Beam(this.enemyContainer, this.basicCollision, this.widthOffset + this.completedMapsWidthOffset + layer.objects[j].x, this.heightOffset + layer.objects[j].y,
							parseFloat(layer.objects[j].properties.xspeed), parseFloat(layer.objects[j].properties.yspeed)));
					}

					if (layer.objects[j].type === "halfwaypoint") {
						this.enemies.push(new HalfwayPoint(this.enemyContainer, this.basicCollision, this.widthOffset + this.completedMapsWidthOffset + layer.objects[j].x));
					}

					if (layer.objects[j].type === "bosspoint") {
						this.enemies.push(new BossPoint(this.enemyContainer, this.basicCollision, this.widthOffset + this.completedMapsWidthOffset + layer.objects[j].x));
					}

					if (layer.objects[j].type === "explosivebarrel") {
						this.enemies.push(new ExplosiveBarrel(this.enemyContainer, this.basicCollision, this.widthOffset + this.completedMapsWidthOffset + layer.objects[j].x, layer.objects[j].y));
					}

					if (layer.objects[j].type === "dialog") {
						this.objects.push(new Dialog(layer.objects[j].properties.text, this.widthOffset + this.completedMapsWidthOffset + layer.objects[j].x, this.heightOffset + layer.objects[j].y, layer.objects[j].properties.image, layer.objects[j].properties.top === "true"));
					}
				}
			}
		}


		this.enemyContainer.tickEnabled = true;
		//this.container.snapToPixel = true;
		this.beginCaching(this.container);

		return this.container;
	};

	/**
	 * [initEnemies description]
	 * @param  {[type]} layerData    [description]
	 * @param  {[type]} tilesetSheet [description]
	 * @param  {[type]} tilewidth    [description]
	 * @param  {[type]} tileheight   [description]
	 * @param  {[type]} heightOffset [description]
	 * @param  {[type]} widthOffset  [description]
	 * @return {[type]}              [description]
	 */
	this.initEnemies = function(layerData, tilesetSheet, tilewidth, tileheight, heightOffset, widthOffset) {
		var enemyArray = [];
		for (var y = 0; y < layerData.height; y++) {
			for (var x = 0; x < layerData.width; x++) {
				// layer data has single dimension array
				var idx = x + y * layerData.width;

				if (layerData.data[idx] !== 0) {
					if (layerData.data[idx] === 1) {
						enemyArray.push(new ShieldGuy(this.enemyContainer, this.basicCollision, widthOffset + this.completedMapsWidthOffset + x * tilewidth, heightOffset + y * tileheight));
					} else if (layerData.data[idx] === 2) {
						enemyArray.push(new Flood(this.enemyContainer, this.basicCollision, widthOffset + this.completedMapsWidthOffset + x * tilewidth, heightOffset + y * tileheight, true));
					} else if (layerData.data[idx] === 3) {
						enemyArray.push(new PrinterGuy(this.enemyContainer, this.basicCollision, widthOffset + this.completedMapsWidthOffset + x * tilewidth, heightOffset + y * tileheight));
					} else if (layerData.data[idx] === 4) {
						enemyArray.push(new Copter(this.enemyContainer, widthOffset + this.completedMapsWidthOffset + x * tilewidth, heightOffset + y * tileheight));
					} else if (layerData.data[idx] === 5) {
						enemyArray.push(new FilingCabinet(this.enemyContainer, this.basicCollision, widthOffset + this.completedMapsWidthOffset + x * tilewidth, heightOffset + y * tileheight));
					} else if (layerData.data[idx] === 6) {
						enemyArray.push(new Door(this.enemyContainer, this.basicCollision, widthOffset + this.completedMapsWidthOffset + x * tilewidth, heightOffset + y * tileheight));
					} else if (layerData.data[idx] === 7) {
						enemyArray.push(new Phone(this.enemyContainer, this.basicCollision, widthOffset + this.completedMapsWidthOffset + x * tilewidth, heightOffset + y * tileheight));
					} else if (layerData.data[idx] === 8) {
						enemyArray.push(new AnnoyingThing(this.enemyContainer, this.basicCollision, widthOffset + this.completedMapsWidthOffset + x * tilewidth, heightOffset + y * tileheight));
					} else if (layerData.data[idx] === 9) {
						enemyArray.push(new WallGun(this.enemyContainer, widthOffset + this.completedMapsWidthOffset + x * tilewidth, heightOffset + y * tileheight, true));
					} else if (layerData.data[idx] === 10) {
						enemyArray.push(new WallGun(this.enemyContainer, widthOffset + this.completedMapsWidthOffset + x * tilewidth, heightOffset + y * tileheight, false));
					} else if (layerData.data[idx] === 11) {
						enemyArray.push(new ComputerGuy(this.enemyContainer, this.basicCollision, widthOffset + this.completedMapsWidthOffset + x * tilewidth, heightOffset + y * tileheight));
					} else if (layerData.data[idx] === 12) {
						enemyArray.push(new SixShooter(this.enemyContainer, widthOffset + this.completedMapsWidthOffset + x * tilewidth, heightOffset + y * tileheight));
					} else if (layerData.data[idx] === 13) {
						enemyArray.push(new ShootyThingy(this.enemyContainer, this.basicCollision, widthOffset + this.completedMapsWidthOffset + x * tilewidth, heightOffset + y * tileheight));
					} else if (layerData.data[idx] === 14) {
						enemyArray.push(new StaplerDude(this.enemyContainer, this.basicCollision, widthOffset + this.completedMapsWidthOffset + x * tilewidth, heightOffset + y * tileheight));
					} else if (layerData.data[idx] === 15) {
						enemyArray.push(new CoffeeCopter(this.enemyContainer, widthOffset + this.completedMapsWidthOffset + x * tilewidth, heightOffset + y * tileheight));
					} else if (layerData.data[idx] === 97) {
						enemyArray.push(new HealthBriefCase(this.enemyContainer, widthOffset + this.completedMapsWidthOffset + x * tilewidth, heightOffset + y * tileheight, this.basicCollision));
					} else if (layerData.data[idx] === 98) {
						enemyArray.push(new ExtraLife(this.enemyContainer, widthOffset + this.completedMapsWidthOffset + x * tilewidth, heightOffset + y * tileheight, this.basicCollision));
					} else if (layerData.data[idx] === 99) {
						enemyArray.push(new BigHealth(this.enemyContainer, widthOffset + this.completedMapsWidthOffset + x * tilewidth, heightOffset + y * tileheight, this.basicCollision));
					} else if (layerData.data[idx] === 100) {
						enemyArray.push(new WasteMan(this.enemyContainer, this.basicCollision, widthOffset + this.completedMapsWidthOffset + x * tilewidth, heightOffset + y * tileheight));
					} else if (layerData.data[idx] === 101) {
						enemyArray.push(new AccountingMan(this.enemyContainer, this.basicCollision, widthOffset + this.completedMapsWidthOffset + x * tilewidth, heightOffset + y * tileheight));
					} else if (layerData.data[idx] === 102) {
						enemyArray.push(new WarehouseMan(this.enemyContainer, this.basicCollision, widthOffset + this.completedMapsWidthOffset + x * tilewidth, heightOffset + y * tileheight));
					} else if (layerData.data[idx] === 103) {
						enemyArray.push(new MaterialMan(this.enemyContainer, this.basicCollision, widthOffset + this.completedMapsWidthOffset + x * tilewidth, heightOffset + y * tileheight));
					} else if (layerData.data[idx] === 50) {
						enemyArray.push(new KillCopy(this.enemyContainer, this.basicCollision, widthOffset + this.completedMapsWidthOffset + x * tilewidth, heightOffset + y * tileheight));
					}
				}
			}
		}

		return enemyArray;
	};

	/**
	 * [initLayer description]
	 * @param  {[type]} layerData    [description]
	 * @param  {[type]} tilesetSheet [description]
	 * @param  {[type]} tilewidth    [description]
	 * @param  {[type]} tileheight   [description]
	 * @param  {[type]} heightOffset [description]
	 * @param  {[type]} widthOffset  [description]
	 * @return {[type]}              [description]
	 */
	this.initLayer = function(layerData, tilesetSheet, tilewidth, tileheight, heightOffset, widthOffset) {
		var container = new createjs.Container();

		for (var y = 0; y < layerData.height; y++) {
			for (var x = 0; x < layerData.width; x++) {
				// create a new Bitmap for each cell

				// layer data has single dimension array
				var idx = x + y * layerData.width;
				if (layerData.data[idx] !== 0) {
					var cellBitmap = new createjs.Sprite(tilesetSheet);
					// tilemap data uses 1 as first value, EaselJS uses 0 (sub 1 to load correct tile)
					cellBitmap.gotoAndStop(layerData.data[idx] - 1);
					// isometrix tile positioning based on X Y order from Tiled
					cellBitmap.x = widthOffset + x * tilewidth; //300 + x * tilewidth/2 - y * tilewidth/2;
					cellBitmap.y = heightOffset + y * tileheight; // * tileheight/2 + x * tileheight/2;
					// add bitmap to gamestage
					container.addChild(cellBitmap);
					// internalgamestage.addChild(cellBitmap);
				}
			}
		}

		container.tickEnabled = false;
		container.snapToPixel = true;
		return container;
	};


	/**
	 * [initBackgroundLayer description]
	 * @param  {[type]} layerData    [description]
	 * @param  {[type]} tilesetSheet [description]
	 * @param  {[type]} tilewidth    [description]
	 * @param  {[type]} tileheight   [description]
	 * @param  {[type]} heightOffset [description]
	 * @param  {[type]} widthOffset  [description]
	 * @return {[type]}              [description]
	 */
	this.initBackgroundLayer = function(layerData, tilesetSheet, tilewidth, tileheight, heightOffset, widthOffset) {
		for (var y = 0; y < layerData.height; y++) {
			for (var x = 0; x < layerData.width; x++) {
				// create a new Bitmap for each cell

				// layer data has single dimension array
				var idx = x + y * layerData.width;
				if (layerData.data[idx] !== 0) {
					var cellBitmap1 = new createjs.Sprite(tilesetSheet);
					// tilemap data uses 1 as first value, EaselJS uses 0 (sub 1 to load correct tile)
					var spriteLocation = layerData.data[idx] - 1;
					cellBitmap1.gotoAndStop(spriteLocation);
					// isometrix tile positioning based on X Y order from Tiled
					cellBitmap1.x = widthOffset + x * tilewidth; //300 + x * tilewidth/2 - y * tilewidth/2;
					cellBitmap1.y = heightOffset + y * tileheight; // * tileheight/2 + x * tileheight/2;

					if (spriteLocation <= 17) {
						if (spriteLocation % 2 === 1) {
							spriteLocation--;
						} else {
							spriteLocation++;
						}
						var cellBitmap2 = new createjs.Sprite(tilesetSheet);
						// tilemap data uses 1 as first value, EaselJS uses 0 (sub 1 to load correct tile)
						cellBitmap2.gotoAndStop(spriteLocation);
						// isometrix tile positioning based on X Y order from Tiled
						cellBitmap2.x = widthOffset + x * tilewidth; //300 + x * tilewidth/2 - y * tilewidth/2;
						cellBitmap2.y = heightOffset + y * tileheight; // * tileheight/2 + x * tileheight/2;
						this.backgroundContainer2.addChild(cellBitmap2);
					}

					// add bitmap to gamestage
					this.backgroundContainer1.addChild(cellBitmap1);
					// internalgamestage.addChild(cellBitmap);
				}
			}
		}
		this.beginCaching(this.backgroundContainer1);
		this.beginCaching(this.backgroundContainer2);
	};

	/**
	 * [initLayerWithCollisionArray description]
	 * @param  {[type]} layerData    [description]
	 * @param  {[type]} tilesetSheet [description]
	 * @param  {[type]} tilewidth    [description]
	 * @param  {[type]} tileheight   [description]
	 * @param  {[type]} heightOffset [description]
	 * @param  {[type]} widthOffset  [description]
	 * @return {[type]}              [description]
	 */
	this.initLayerWithCollisionArray = function(layerData, tilesetSheet, tilewidth, tileheight, heightOffset, widthOffset) {
		var container = new createjs.Container();

		this.collisionArray = new Array(layerData.height);
		for (var y = 0; y < layerData.height; y++) {
			this.collisionArray[y] = new Array(layerData.width);
			for (var x = 0; x < layerData.width; x++) {
				// create a new Bitmap for each cell
				// layer data has single dimension array
				var idx = x + y * layerData.width;
				if (layerData.data[idx] !== 0) {
					var cellBitmap = null;
					if (y === 0) {
						for (var i = 1; i <= this.getRepeatedTopRows(); i++) {
							cellBitmap = new createjs.Sprite(tilesetSheet);
							// tilemap data uses 1 as first value, EaselJS uses 0 (sub 1 to load correct tile)
							cellBitmap.gotoAndStop(layerData.data[idx] - 1);
							cellBitmap.x = widthOffset + x * tilewidth;
							cellBitmap.y = heightOffset + (y - i) * tileheight;
							container.addChild(cellBitmap);
						}
					}

					cellBitmap = new createjs.Sprite(tilesetSheet);
					// tilemap data uses 1 as first value, EaselJS uses 0 (sub 1 to load correct tile)
					cellBitmap.gotoAndStop(layerData.data[idx] - 1);
					cellBitmap.x = widthOffset + x * tilewidth;
					cellBitmap.y = heightOffset + y * tileheight;
					container.addChild(cellBitmap);

					// internalgamestage.addChild(cellBitmap);

					this.collisionArray[y][x] = true;
				} else {
					this.collisionArray[y][x] = false;
				}
			}
		}

		container.tickEnabled = false;
		container.snapToPixel = true;
		return container;
	};

	/**
	 * [initLayerWithDeathCollisionArray description]
	 * @param  {[type]} layerData    [description]
	 * @param  {[type]} tilesetSheet [description]
	 * @param  {[type]} tilewidth    [description]
	 * @param  {[type]} tileheight   [description]
	 * @param  {[type]} heightOffset [description]
	 * @param  {[type]} widthOffset  [description]
	 * @return {[type]}              [description]
	 */
	this.initLayerWithDeathCollisionArray = function(layerData, tilesetSheet, tilewidth, tileheight, heightOffset, widthOffset) {
		var container = new createjs.Container();

		this.deathCollisionArray = new Array(layerData.height);
		for (var y = 0; y < layerData.height; y++) {
			this.deathCollisionArray[y] = new Array(layerData.width);
			for (var x = 0; x < layerData.width; x++) {
				// create a new Bitmap for each cell
				// layer data has single dimension array
				var idx = x + y * layerData.width;
				if (layerData.data[idx] !== 0) {
					var cellBitmap = new createjs.Sprite(tilesetSheet);
					// tilemap data uses 1 as first value, EaselJS uses 0 (sub 1 to load correct tile)
					cellBitmap.gotoAndStop(layerData.data[idx] - 1);
					// isometrix tile positioning based on X Y order from Tiled
					cellBitmap.x = widthOffset + x * tilewidth; //300 + x * tilewidth/2 - y * tilewidth/2;
					cellBitmap.y = heightOffset + y * tileheight; // * tileheight/2 + x * tileheight/2;
					// add bitmap to gamestage
					container.addChild(cellBitmap);
					// internalgamestage.addChild(cellBitmap);

					this.deathCollisionArray[y][x] = true;
				} else {
					this.deathCollisionArray[y][x] = false;
				}
			}
		}

		container.tickEnabled = false;
		container.snapToPixel = true;
		return container;
	};

	/**
	 * [tickActions description]
	 * @return {[type]} [description]
	 */
	this.tickActions = function() {
		this.backgroundTicks--;
		if (this.backgroundTicks === 0) {
			if (this.backgroundContainer2.visible) {
				this.backgroundContainer2.visible = false;
				//this.backgroundContainer1.visible = true;
			} else {
				this.backgroundContainer2.visible = true;
				//this.backgroundContainer1.visible = false;
			}

			this.backgroundTicks = 16;
		}

		var halfIt = 1;

		if (this.transitionright) {
			if (this.transitioncount < 60) {
				this.transitioncount++;
				this.parentContainer.x -= this.screenWidthDelta;
				this.enemyContainer.x -= this.screenWidthDelta;
				this.lastParentContainer.x -= this.screenWidthDelta;
				player.animations.x -= this.screenWidthDelta;
				player.x += player.animations.spriteSheet._frameWidth / 60;

				if (this.parentContainer.x < 0) {
					this.parentContainer.x = 0;
					this.enemyContainer.x = 0;
				}

				if (player.animations.x < this.widthOffset) {
					player.animations.x = this.widthOffset;
					player.x = this.completedMapsWidthOffset;
					player.lastx = player.x;
				}
			} else {
				this.enemyContainer.x = 0;
				this.parentContainer.x = 0;
				player.animations.x = this.widthOffset;
				player.x = this.completedMapsWidthOffset + this.widthOffset;
				player.lastx = player.x;
				this.transitioncount = 0;
				this.transitionright = false;

				//this.lastParentContainer.removeChild(player.animations);
				//this.parentContainer.addChild(player.animations);
				this.lastParentContainer.removeAllChildren();
				this.gamestage.removeChild(this.lastParentContainer);
			}
		} else if (this.transitiondown) {
			if (this.transitioncount < 60) {
				this.transitioncount++;
				this.parentContainer.y -= this.screenHeightDelta;
				this.enemyContainer.y -= this.screenHeightDelta;
				this.lastParentContainer.y -= this.screenHeightDelta;
				player.animations.y -= this.screenHeightDelta;
				player.y -= this.screenHeightDelta;

				if (parseInt(this.mapData.properties.stitchx) !== 0) {
					this.parentContainer.x -= this.screenWidthDelta;
					this.enemyContainer.x -= this.screenWidthDelta;
					this.lastParentContainer.x -= this.screenWidthDelta;
					player.animations.x -= this.screenWidthDelta;
					//player.x -= this.screenWidthDelta;
					//player.animations.x += player.animations.spritesheet._frameWidth /  30;

				}


				if (this.parentContainer.y < 0) {
					this.parentContainer.y = 0;
				}

				if (player.animations.y < 0) {
					player.animations.y = 0;
					player.y = 0;
				}
			} else {
				//player.x -= this.lastWidthOffset;
				//player.x -= this.widthOffset;
				player.lastx = player.x;
				if (this.stitchingoffset !== 0) {
					this.stitchingoffset = 0;
				} else {
					this.parentContainer.x = 0;
					this.enemyContainer.x = 0;
				}
				player.animations.y = 0;
				player.y = 0;
				this.transitioncount = 0;
				this.transitiondown = false;

				//this.lastParentContainer.removeChild(player.animations);
				//this.parentContainer.addChild(player.animations);
				this.lastParentContainer.removeAllChildren();
				this.gamestage.removeChild(this.lastParentContainer);
			}
		} else if (this.transitionup) {
			if (this.transitioncount < 60) {
				this.transitioncount++;
				this.parentContainer.y += this.screenHeightDelta;
				this.enemyContainer.y += this.screenHeightDelta;
				this.lastParentContainer.y += this.screenHeightDelta;
				player.animations.y += this.screenHeightDelta;
				player.y += this.screenHeightDelta;

				if (parseInt(this.mapData.properties.stitchx) !== 0) {
					this.parentContainer.x -= this.screenWidthDelta;
					this.enemyContainer.x -= this.screenWidthDelta;
					this.lastParentContainer.x -= this.screenWidthDelta;
					player.animations.x -= this.screenWidthDelta;

				}

				if (this.parentContainer.y > 0) {
					this.parentContainer.y = 0;
				}

				if (player.animations.y < 0) {
					player.animations.y = 0;
					player.y = 0;
				}

			} else {
				player.lastx = player.x;
				if (this.stitchingoffset !== 0) {
					this.stitchingoffset = 0;
				} else {
					this.parentContainer.x = 0;
					this.enemyContainer.x = 0;
				}
				//player.animations.y = 0;
				//player.y = 0;
				player.jumping = true;
				player.ignoreInput = true;
				player.actions.playerJump = true;
				player.jumpspeed = -4.875;
				player.transitionedUp = true;
				player.animations.gotoAndPlay("jump");
				setTimeout(function() {
					player.ignoreInput = false;
					player.actions.playerJump = false;
					player.actions.jumpReleased = true;
					player.transitionedUp = false;
				}.bind(this), 500);
				this.transitioncount = 0;
				this.transitionup = false;

				//this.lastParentContainer.removeChild(player.animations);
				//this.parentContainer.addChild(player.animations);
				this.lastParentContainer.removeAllChildren();
				this.gamestage.removeChild(this.lastParentContainer);

			}
		}
	};

	this.bighealthCounter = 0;
	this.littlehealthCounter = 0;
	/**
	 * [itemDrop description]
	 * @param  {[type]} x [description]
	 * @param  {[type]} y [description]
	 * @return {[type]}   [description]
	 */
	this.itemDrop = function(x, y) {
		if (itemDropCount === 1) {
			this.bighealthCounter += 18;
			this.littlehealthCounter += 20;
		} else if (itemDropCount === 2) {
			this.bighealthCounter += 30;
			this.littlehealthCounter += 30;
		} else if (itemDropCount === 3) {
			this.bighealthCounter += 8;
			this.littlehealthCounter += 8;
		} else if (itemDropCount === 4) {
			this.bighealthCounter += 10;
			this.littlehealthCounter += 18;
		} else if (itemDropCount === 5) {
			this.bighealthCounter += 8;
			this.littlehealthCounter += 10;
		}

		if (this.bighealthCounter > 256) {
			this.enemies.push(new BigHealth(this.enemyContainer, x + 10, y, this.basicCollision));
			this.bighealthCounter -= 256;
		} else if (this.littlehealthCounter > 128) {
			this.enemies.push(new LittleHealth(this.enemyContainer, x + 14, y, this.basicCollision));
			this.littlehealthCounter -= 128;
		}
	};

	/**
	 * [getMapWidth description]
	 * @return {[type]} [description]
	 */
	this.getMapWidth = function() {
		return this.mapData.tilewidth * (this.mapData.width);
	};

	/**
	 * [getMapHeight description]
	 * @return {[type]} [description]
	 */
	this.getMapHeight = function() {
		return this.mapData.tileheight * (this.mapData.height - 1);
	};

	/**
	 * [getCurrentHeightOffset description]
	 * @return {[type]} [description]
	 */
	this.getCurrentHeightOffset = function() {
		return this.heightOffset;
	};

	/**
	 * [getOffScreenWidth description]
	 * @return {[type]} [description]
	 */
	this.getOffScreenWidth = function() {
		if (this.gamestage.canvas.width > this.getMapWidth()) {
			return 0;
		} else if (player.animations.x - this.gamestage.canvas.width / 2 >= -4 && player.animations.x - this.gamestage.canvas.width / 2 <= 4) {
			return (player.x - this.completedMapsWidthOffset) - this.gamestage.canvas.width / 2;
		} else if (player.animations.x - this.gamestage.canvas.width / 2 < -4) {
			return 0;
		} else if (player.animations.x - this.gamestage.canvas.width / 2 > 4) {
			return this.getMapWidth() - this.gamestage.canvas.width;
		}
		return 0;
	};

	// the next variable is set up to repeat the top set of rows of the map to make it appear taller so map transitions look right on arbitrary sized screens
	/**
	 * [getRepeatedTopRows description]
	 * @return {[type]} [description]
	 */
	this.getRepeatedTopRows = function() {
		return this.heightOffset / this.mapData.tileheight;
	};

	this.gameBottom = this.heightOffset + this.getMapHeight();
	this.screenHeightDelta = this.gameBottom / 60;
}