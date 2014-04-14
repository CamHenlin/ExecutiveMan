	var mapData2 = { "height":15,
 "layers":[
        {
         "data":[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 112, 5, 5, 5, 5, 5, 5, 5, 5, 113, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 112, 113, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 112, 113, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 112, 113, 0, 0, 0, 0, 0, 0, 0, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 41, 42, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 12, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 13, 58, 58, 58, 58, 58, 58, 58, 58, 58, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7],
         "height":15,
         "name":"Tile Layer 1",
         "opacity":1,
         "type":"tilelayer",
         "visible":true,
         "width":25,
         "x":0,
         "y":0
        }],
 "orientation":"orthogonal",
 "properties":
    {

    },
 "tileheight":32,
 "tilesets":[
        {
         "firstgid":1,
         "image":"images/map1.png",
         "imageheight":480,
         "imagewidth":320,
         "margin":0,
         "name":"map1",
         "properties":
            {

            },
         "spacing":0,
         "tileheight":32,
         "tilewidth":32
        }],
 "tilewidth":32,
 "version":1,
 "width":25
}

        ;
function Mapper(stage) {
	this.internalStage = new createjs.Stage("offscreen");
	this.tileset = new Image();
	this.mapData = mapData2;
	this.stage = stage;
	this.heightOffset = null;
	this.widthOffset = null;
	this.collisionArray = [[],[]];

	// getting imagefile from first tileset
	this.tileset.src = this.mapData.tilesets[0].image;

	// loading layers
	this.initLayers = function() {
		var w = this.mapData.tilesets[0].tilewidth;
		var h = this.mapData.tilesets[0].tileheight;
		var imageData = {
			images : [ this.tileset ],
			frames : {
				width : w,
				height : h
			}
		};

		this.heightOffset = this.stage.canvas.height - this.mapData.tilesets[0].tileheight * this.mapData.layers[0].height;
		this.widthOffset = (this.stage.canvas.width - this.mapData.tilesets[0].tilewidth * this.mapData.layers[0].width) / 2;

		// create spritesheet
		var tilesetSheet = new createjs.SpriteSheet(imageData);
		var internalStage = this.internalStage;
		// loading each layer at a time
		var mapData = this.mapData;
		for (var i = 0; i < this.mapData.layers.length; i++) {
			var layer = this.mapData.layers[i];
			if (layer.type === 'tilelayer') {
				this.collisionArray = initLayer(layer, tilesetSheet, mapData.tilewidth, mapData.tileheight, internalStage, this.heightOffset, this.widthOffset);
			}
		}

	};

	// layer initialization
	function initLayer(layerData, tilesetSheet, tilewidth, tileheight, internalStage, heightOffset, widthOffset) {
		var collisionArray = new Array(layerData.height);
		console.log(collisionArray);
		for ( var y = 0; y < layerData.height; y++) {
			collisionArray[y] = new Array(layerData.width);
			for ( var x = 0; x < layerData.width; x++) {
				// create a new Bitmap for each cell
				var cellBitmap = new createjs.Sprite(tilesetSheet);
				// layer data has single dimension array
				var idx = x + y * layerData.width;
				// tilemap data uses 1 as first value, EaselJS uses 0 (sub 1 to load correct tile)
				cellBitmap.gotoAndStop(layerData.data[idx] - 1);
				// isometrix tile positioning based on X Y order from Tiled
				cellBitmap.x = widthOffset + x * tilewidth;//300 + x * tilewidth/2 - y * tilewidth/2;
				cellBitmap.y = heightOffset + y * tileheight; // * tileheight/2 + x * tileheight/2;
				// add bitmap to stage
				stage.addChild(cellBitmap);
				// internalStage.addChild(cellBitmap);
				if (layerData.data[idx] !== 0) {
					collisionArray[y][x] = true;
				} else {
					collisionArray[y][x] = false;
				}
			}
		}
		console.log(collisionArray);
		//return internalStage;
		return collisionArray;
	}

	// Map data created on Tiled map editor (mapeditor.org). Use export for JSON format
}

/*
// utility function for loading assets from server
function httpGet(theUrl) {
	var xmlHttp = null;
	xmlHttp = new XMLHttpRequest();
	xmlHttp.open("GET", theUrl, false);
	xmlHttp.send(null);
	return xmlHttp.responseText;
}

// utility function for loading json data from server
function httpGetData(theUrl) {
	var responseText = httpGet(theUrl);
	return JSON.parse(responseText);
}
*/

