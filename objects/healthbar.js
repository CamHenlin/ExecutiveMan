/**
 * [HealthBar description]
 * @param {[type]} stage  [description]
 * @param {[type]} player [description]
 */
var HealthBar = function(stage, player) {
	this.maxheight = 14 * 4 + 1; // 28 bars taking 2px each vertically
	this.stage = stage;
	this.bars = 28;
	this.x = 18;
	this.y = 48; //this.stage.canvas.height / 2 - this.maxheight / 2 - 2;
	this.barAnimations = [];

	/**
	 * [tickActions description]
	 * @return {[type]} [description]
	 */
	this.tickActions = function() {
		if (player.health > 28) {
			player.health = 28;
		}
		if (this.bars !== player.health) {
			this.bars = player.health;
			this.draw();
		}
	};

	/**
	 * [draw description]
	 * @return {[type]} [description]
	 */
	this.draw = function() {
		var box = new createjs.Shape();
		box.graphics.beginFill("#000000").drawRect(this.x, this.y, 8, this.maxheight);

		this.stage.addChild(box);

		for (var i = 0; i < this.barAnimations.length; i++) {
			this.stage.removeChild(this.barAnimations[i]);
		}
		this.barAnimations.length = 0;

		var offset = (28 - this.bars) * 2;
		for (i = 0; i < this.bars; i++) {
			var barItem = new createjs.Bitmap("images/healthbar.png");
			barItem.x = 19;
			barItem.y = i * 2 + offset + this.y + 1;
			this.barAnimations.push(barItem);
			this.stage.addChild(barItem);
		}
	};

	this.draw();
};