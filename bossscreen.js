var bossScreenUp = false;
function initBossScreen() {
	if (lives < 2) {
		lives = 2;
	}

	var bossframeSpriteSheet = new createjs.SpriteSheet({
		"images": [loader.getResult("bossframe")],
		"frames": {
			"width": 45, "height": 45, "count": 1
		},
		"animations": {
			"frame": {
				"frames" : [0],
				"next" : "frame"
			}
		}
	});

	var executivemanTopperSpriteSheet = new createjs.SpriteSheet({
		"images": [loader.getResult("executivemantopper")],
		"frames": {
			"width": 160, "height": 45, "count": 1
		},
		"animations": {
			"frame": {
				"frames" : [0],
				"next" : "frame"
			}
		}
	});
	var executivemanTopper = new createjs.Sprite(executivemanTopperSpriteSheet, "frame");

	var wastemanFrameSpriteSheet = new createjs.SpriteSheet({
		"images": [loader.getResult("wastemanframe")],
		"frames": {
			"width": 24, "height": 24, "count": 2
		},
		"animations": {
			"frame": {
				"frames" : [0],
				"next" : "breathout",
				"speed" : 0.01
			},
			"breathout" : {
				"frames" : [1],
				"next" : "frame",
				"speed" : 0.09
			}
		}
	});
	var wastemanFrame = new createjs.Sprite(wastemanFrameSpriteSheet, "frame");
	var wastemanLabel = new createjs.Text("WASTE MAN", "bold 7px Arial", "#FFF");
	var accountingmanLabel = new createjs.Text("ACCOUNTING \n        MAN", "bold 7px Arial", "#FFF");
	var shopLabel = new createjs.Text("SHOP", "bold 7px Arial", "#FFF");

	bossframes = [];
	for (var i = 0; i < 9; i++) {
		bossframes.push(new createjs.Sprite(bossframeSpriteSheet, "frame"));
	}

	bossScreenUp = true;
	bossscreenCounter = 60;
	stage = new createjs.Container();
	altstage = new createjs.Container();
	gamestage = new createjs.Stage("gamecanvas");
	gamestage.snapToPixelEnabled = true;
	var zoomAmount = window.innerHeight / 240;

	gamezoom = zoomAmount;
	gamestage.canvas.width = window.innerWidth / zoomAmount;
	gamestage.canvas.height = window.innerHeight / zoomAmount;
	document.getElementById("gamecanvas").style.zoom = zoomAmount;
	document.getElementById("gamecanvas").style.MozTransform = "scale("+zoomAmount+")";
	gamestage.canvas.style.backgroundColor = "#000";
	gamestage.addChild(altstage);
	gamestage.addChild(stage);
	this.shopMenu = new ShopMenu();
	stage.x = -gamestage.canvas.width;
	altstage.x = gamestage.canvas.width;
    var fillColor = new createjs.Shape();
    fillColor.graphics.beginFill("#0000FF").drawRect(0, 0, gamestage.canvas.width, gamestage.canvas.height);
    altstage.addChild(fillColor);

	var width = bossframes[0].spriteSheet._frameWidth;
	var framewidth = bossframes[0].spriteSheet._frameWidth;
	var centerx = gamestage.canvas.width / 2 - bossframes[0].spriteSheet._frameWidth / 2;
	var centery = 10 + gamestage.canvas.height / 2 - bossframes[0].spriteSheet._frameWidth / 2;
	for (i = 0; i < 9; i++) {
		if (i === 0) {
			wastemanFrame.x = centerx - 4/3 * width  + (framewidth + framewidth / 2) * (i % 3) + wastemanFrame.spriteSheet._frameWidth /2 -2;
			wastemanFrame.y = centery - width + (framewidth + framewidth / 2) * Math.floor(i / 3) - width / 2 + wastemanFrame.spriteSheet._frameWidth/2 -2;
			wastemanLabel.x = centerx - 4/3 * width  + (framewidth + framewidth / 2) * (i % 3) + 1;
			wastemanLabel.y = centery - width + (framewidth + framewidth / 2) * Math.floor(i / 3) - width / 2 + framewidth + 5;
		}
		if (i === 1) {
			accountingmanLabel.x = centerx - 4/3 * width  + (framewidth + framewidth / 2) * (i % 3) - 1;
			accountingmanLabel.y = centery - width + (framewidth + framewidth / 2) * Math.floor(i / 3) - width / 2 + framewidth + 5;
		}
		if (i === 4) { // middle frame
			shopLabel.x = centerx - 4/3 * width  + (framewidth + framewidth / 2) * (i % 3) + 12;
			shopLabel.y = centery - width + (framewidth + framewidth / 2) * Math.floor(i / 3) - width / 2 + framewidth + 5;
		}
		bossframes[i].x = centerx - 4/3 * width  + (framewidth + framewidth / 2) * (i % 3);
		bossframes[i].y = centery - width + (framewidth + framewidth / 2) * Math.floor(i / 3) - width / 2;
	}
	executivemanTopper.x = centerx - executivemanTopper.spriteSheet._frameWidth / 2 + width / 2 + 10;
	executivemanTopper.y = centery - width * 2 - width / 2;
	startlevel = false;

	createjs.Ticker.addEventListener("tick", handleBossScreenTick);
	createjs.Ticker.setFPS(60);


	document.getElementById("gamecanvas").addEventListener('click', bossClickHandler.bind(this), false);
	document.onkeydown = function (event) {
		switch (event.keyCode) {
			case 32:
				// keyCode 32 is space
	               	initVars();
	               	initShowOffBossScreen();
					document.getElementById("gamecanvas").removeEventListener('click', bossClickHandler.bind(this), false) ;
				break;
		}
	}.bind(this);


	stage.addChild(executivemanTopper);
	for (i = 0; i < bossframes.length; i++) {
		stage.addChild(bossframes[i]);
	}

	stage.addChild(wastemanFrame);
	stage.addChild(wastemanLabel);
	stage.addChild(shopLabel);
	//stage.addChild(accountingmanFrame);
	stage.addChild(accountingmanLabel);


}

function bossClickHandler(event) {
	if (!bossScreenUp) {
		return;
	}

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

    event.preventDefault();
    console.log(event);

	touchSprite.x = event.clientX / gamezoom;
	touchSprite.y = event.clientY / gamezoom;
	console.log(touchSprite);
	for (var k = 0; k < 5; k++) { // should be 9
	    if (k === 4 && fastCollisionSprite(bossframes[k], touchSprite)) {
	    	this.shopMenu.show();
            //event.target.removeEventListener(event.type, arguments.callee);
	    } else if (fastCollisionSprite(bossframes[k], touchSprite)) {
	       	initVars();
	       	initShowOffBossScreen(k);
            event.target.removeEventListener(event.type, arguments.callee);
			bossScreenUp = false;
	    }
	}
}

function handleBossScreenTick(event) {
	if (bossscreenCounter > 0) {
		stage.x += gamestage.canvas.width / 60;
		altstage.x -= gamestage.canvas.width / 60;
		bossscreenCounter--;
	}

	if (startlevel) {
		initVars();
		beginGame(true);
		event.remove();
	}

	if (gamestage) {
		gamestage.update();
	}
}