var dialogUp = false;

/**
 * [Dialog description]
 * @param {[type]} text  [description]
 * @param {[type]} x     [description]
 * @param {[type]} y     [description]
 * @param {[type]} image [description]
 * @param {[type]} top   [description]
 */
function Dialog(text, x, y, image, top) {
	//player.stopAllActions();
	this.triggered = false;
	this.startTicks = 60;
	this.text = text;
	this.top = top;

	/**
	 * [dialogClickHandler description]
	 * @param  {[type]} event [description]
	 * @return {[type]}       [description]
	 */
	this.dialogClickHandler = function(event) {
		event.preventDefault();

		if (!dialogUp) {
			return;
		}

		if (this.currentText === this.targetText) {
			this.remove();
			document.removeEventListener("click", this.dialogClickHandler.bind(this), false);
			document.removeEventListener("keydown", this.dialogKeyDownHandler.bind(this), false);
		}
	};

	this.animations = {};
	this.animations.spriteSheet = {
		_frameWidth: 32,
		_frameHeight: 128
	};
	this.targetText = text;
	this.currentText = "";
	this.dialogTicks = 0;
	dialogUp = false;
	dialogstage = new createjs.Container();

	this.shape = new createjs.Shape();
	if (top) {
		this.shape.graphics.beginFill("#0000FF").drawRect(32, 32, 0, gamestage.canvas.height / 2 - 32);
	} else {
		this.shape.graphics.beginFill("#0000FF").drawRect(32, gamestage.canvas.height - 32, 0, gamestage.canvas.height / 2);
	}

	//var divider = new createjs.this.shape();
	//divider.graphics.beginFill("#6699FF").drawRect(34, gamestage.canvas.height - 96, gamestage.canvas.width - 68, 3);

	this.dialogLabel = new createjs.Text("", "14px '" + FONT + "'", "#FFF");
	this.dialogLabel2 = new createjs.Text("", "14px '" + FONT + "'", "#000");

	this.dialogLabel.x = 86;
	this.dialogLabel.y = 48;

	this.dialogLabel2.x = 87;
	this.dialogLabel2.y = 49;

	this.dialogLabel.lineWidth = gamestage.canvas.width - 138;
	this.dialogLabel2.lineWidth = gamestage.canvas.width - 138;

	dialogstage.addChild(this.shape);

	if (image) {
		var imageSpriteSheet = new createjs.SpriteSheet({
			"images": [loader.getResult(image)],
			"frames": {
				"width": 24,
				"height": 24,
				"count": 1
			},
			"animations": {
				"exist": {
					"frames": [0],
					"next": "exist"
				}
			}
		});
		this.imageSprite = new createjs.Sprite(imageSpriteSheet, "exist");
		this.imageSprite.x = 48;
		this.imageSprite.y = 48;
	}

	//dialogstage.addChild(divider);

	playSound("dialogopen");

	this.animations.x = x - renderer.completedMapsWidthOffset;
	this.animations.y = y;
	this.x = x - renderer.completedMapsWidthOffset;
	this.y = y;

	if (!top) {
		this.dialogLabel.y = 148;
		this.dialogLabel2.y = 149;
		this.imageSprite.y = 148;
	}

	/**
	 * [remove description]
	 * @return {[type]} [description]
	 */
	this.remove = function() {
		this.active = false;
		dialogUp = false;
		playSound("dialogclose");
		gamestage.removeChild(dialogstage);
		player.paused = false;
		player.dialog = false;
		initTouchControls();
	};

	/**
	 * [tickActions description]
	 * @return {[type]} [description]
	 */
	this.tickActions = function() {
		if (this.dialogTicks > 0) {
			if (this.startTicks > 0) {
				this.shape = new createjs.Shape();
				var w = (gamestage.canvas.width - 64);
				if (this.top) {
					this.shape.graphics.beginFill("#0000FF").drawRect(32, 32, w - (w / 60) * this.startTicks, gamestage.canvas.height / 2 - 32);
				} else {
					this.shape.graphics.beginFill("#0000FF").drawRect(32, gamestage.canvas.height / 2, w - (w / 60) * this.startTicks, gamestage.canvas.height - 32);
				}
				dialogstage.addChild(this.shape);
				this.startTicks--;
				if (this.startTicks === 0) {
					dialogstage.addChild(this.dialogLabel2);
					dialogstage.addChild(this.dialogLabel);

					if (this.imageSprite) {

						dialogstage.addChild(this.imageSprite);
					}
				}
			} else if (this.dialogTicks % 3 === 0 && this.currentText !== this.targetText) {
				this.currentText += this.targetText.charAt(this.currentText.length);
				this.dialogLabel.text = this.currentText;
				this.dialogLabel2.text = this.currentText;
				this.dialogTicks--;
			} else {
				this.dialogTicks--;
			}
		}
	};

	/**
	 * [playerCollisionActions description]
	 * @return {[type]} [description]
	 */
	this.playerCollisionActions = function() {
		if (this.triggered) {
			return;
		}

		this.triggered = true;
		this.active = true;
		gamestage.addChild(dialogstage);
		dialogUp = true;
		player.paused = true;
		player.dialog = true;
		this.dialogTicks = this.text.length * 3 + 3;
		if (isDemo) {
			return;
		}
		document.addEventListener("click", this.dialogClickHandler.bind(this), false);
		document.addEventListener("keydown", this.dialogKeyDownHandler.bind(this), false);
	};

	/**
	 * [dialogKeyDownHandler description]
	 * @param  {[type]} event [description]
	 * @return {[type]}       [description]
	 */
	this.dialogKeyDownHandler = function(event) {
		if (!dialogUp) {
			return;
		}
		this.dialogClickHandler(event);
	};
}