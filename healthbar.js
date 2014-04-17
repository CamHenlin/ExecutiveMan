var HealthBar = function(stage, player) {
	this.maxheight  = 28 * 4 + 2; // 28 bars taking 4px each vertically
	this.stage      = stage;
	this.bars       = 28;
	this.player     = player;

	this.x          = 18;
	this.y          = this.stage.canvas.height / 2 - this.maxheight / 2 - 2;
	this.barAnimations = [];

	// draw black box:
	var box = new createjs.Shape();
	box.graphics.beginFill("#000000").drawRect(this.x, this.y, 16, this.maxheight);

    this.stage.addChild(box);

	this.tickActions = function(actions) {
		if (this.bars !== this.player.health) {
			this.bars = this.player.health;
			this.draw();
		}
	};

	this.draw = function() {
		for (var i = 0; i < this.barAnimations.length; i++) {
			this.stage.removeChild(this.barAnimations[i]);
		}
		this.barAnimations = [];

		var offset = (28 - this.bars) * 4;
		for (var i = 0; i < this.bars; i++) {
			var barItem = new createjs.Bitmap("images/healthbar.png");
			barItem.x = 20;
			barItem.y = i * 4 + offset + this.y + 2;
			this.barAnimations.push(barItem);
			this.stage.addChild(barItem);
		}
	};

    this.draw();
};