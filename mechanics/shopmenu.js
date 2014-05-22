var shopUp = false;
function ShopMenu() {
	shopUp = false;
	shopstage = new createjs.Container();

	var shape = new createjs.Shape();
    shape.graphics.beginFill("#3366FF").drawRect(32, 32, gamestage.canvas.width - 64, gamestage.canvas.height - 64);
	var shape2 = new createjs.Shape();
    shape2.graphics.beginFill("#000").drawRect(34, 34, gamestage.canvas.width - 64, gamestage.canvas.height - 64);

	var divider = new createjs.Shape();
    divider.graphics.beginFill("#5577FF").drawRect(34, gamestage.canvas.height - 64, gamestage.canvas.width - 68, 3);
	this.exitShopTouchTarget = new createjs.Shape();
    this.exitShopTouchTarget.graphics.beginFill("#0000FF").drawRect(gamestage.canvas.width / 2 + 5, gamestage.canvas.height - 48, 80, 16);
    this.exitShopTouchTarget.x = gamestage.canvas.width / 2 + 5;
    this.exitShopTouchTarget.y = gamestage.canvas.height - 48;
    this.exitShopTouchTarget.spriteSheet = {};
    this.exitShopTouchTarget.spriteSheet._frameHeight = 16;
    this.exitShopTouchTarget.spriteSheet._frameWidth = 80;

	var executivemanLabel = new createjs.Text("SHOP", "bold 7px Arial", "#FFF");
	var executivemanLabel2 = new createjs.Text("SHOP", "bold 7px Arial", "#000");
	var exitShopLabel = new createjs.Text("EXIT SHOP", "bold 7px Arial", "#FFF");
	var livesLabel = new createjs.Text("", "bold 8px Arial", "#FFF");

	var extraLifeSpriteSheet = new createjs.SpriteSheet({
		"images": [loader.getResult("extralife")],
		"frames": {
			"width": 12, "height": 13, "count": 1
		},
		"animations": {
			"shot": {
				"frames" : [0],
				"next" : "still"
			}
		}
	});

	var extraLifeSprite = new createjs.Sprite(extraLifeSpriteSheet, "still");

	executivemanLabel.x = gamestage.canvas.width / 2 - 5;
	executivemanLabel.y = 38;
	executivemanLabel2.x = gamestage.canvas.width / 2 - 4;
	executivemanLabel2.y = 39;
	exitShopLabel.x = gamestage.canvas.width / 2 + 8;
	exitShopLabel.y = gamestage.canvas.height - 42;
	livesLabel.x = 64;
	livesLabel.y = gamestage.canvas.height - 44;
	extraLifeSprite.x = 42;
	extraLifeSprite.y = gamestage.canvas.height - 49;
    shopstage.addChild(shape2);
    shopstage.addChild(shape);
    shopstage.addChild(executivemanLabel2);
    shopstage.addChild(executivemanLabel);
    shopstage.addChild(this.exitShopTouchTarget);
    shopstage.addChild(exitShopLabel);
    shopstage.addChild(livesLabel);
    shopstage.addChild(extraLifeSprite);
    shopstage.addChild(divider);

    this.remove = function() {
    	shopUp = false;
        playSound("pauseclose");
    	gamestage.removeChild(shopstage);
    };

    this.show = function() {
    	shopUp = true;
        playSound("pauseopen");

		document.addEventListener('click', shopClickHandler.bind(this), false);

    	livesLabel.text = lives;
    	gamestage.addChild(shopstage);
    };
}

function shopClickHandler(event) {
	if (!shopUp) {
		return;
	}
	console.log(event);
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


    touchSprite.x = event.clientX / gamezoom;
    touchSprite.y = event.clientY / gamezoom;
    if (fastCollisionSprite(this.exitShopTouchTarget, touchSprite)) {
    	this.remove();
    	event.target.removeEventListener(event.type, arguments.callee, false);
    }
}