/**
 * [BossHealthBar description]
 * @param {[type]} stage [description]
 * @param {[type]} boss  [description]
 */
var BossHealthBar = function(stage, boss) {
	this.maxheight = 14 * 4 + 1; // 28 bars taking 2px each vertically
	this.stage = stage;
	this.boss = boss;
	this.bars = 28;
	this.x = renderer.gamestage.canvas.width - 36;
	this.y = 48; //this.stage.canvas.height / 2 - this.maxheight / 2 - 2;
	this.barAnimations = [];

	/**
	 * [tickActions description]
	 * @return {[type]} [description]
	 */
	this.tickActions = function() {
		if (this.bars !== this.boss.health) {
			this.bars = this.boss.health;
			this.draw();
		}
	};

	/**
	 * [draw description]
	 * @return {[type]} [description]
	 */
	this.draw = function() {
		console.log("drawing boss health bar!");
		var box = new createjs.Shape();
		box.graphics.beginFill("#000000").drawRect(this.x, this.y, 8, this.maxheight);

		this.stage.addChild(box);

		for (var i = 0; i < this.barAnimations.length; i++) {
			this.stage.removeChild(this.barAnimations[i]);
		}
		this.barAnimations.length = 0;

		var offset = (28 - this.bars) * 2;
		for (i = 0; i < this.bars; i++) {
			var barItem = new createjs.Bitmap("images/bosshealthbar.png");
			barItem.x = renderer.gamestage.canvas.width - 35;
			barItem.y = i * 2 + offset + this.y + 1;
			this.barAnimations.push(barItem);
			this.stage.addChild(barItem);
		}
	};

	setTimeout(function() {
		this.draw();
	}.bind(this), 250);
};