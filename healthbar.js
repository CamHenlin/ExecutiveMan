var HealthBar = function(stage, player) {
	this.maxheight  = 28 * 4 + 2; // 28 bars taking 4px each vertically
	this.stage      = stage;
	this.bars       = 28;
	this.x          = 18;
	this.y          = 18; //this.stage.canvas.height / 2 - this.maxheight / 2 - 2;
	this.barAnimations = [];

	this.tickActions = function(actions) {
		if (this.bars !== player.health) {
			this.bars = player.health;
			this.draw();
		}
	};

	this.draw = function() {
		var box = new createjs.Shape();
		box.graphics.beginFill("#000000").drawRect(this.x, this.y, 16, this.maxheight);

	    this.stage.addChild(box);

		for (var i = 0; i < this.barAnimations.length; i++) {
			this.stage.removeChild(this.barAnimations[i]);
		}
		this.barAnimations = [];

		var offset = (28 - this.bars) * 4;
		for (i = 0; i < this.bars; i++) {
			var barItem = new createjs.Bitmap("images/healthbar.png");
			barItem.x = 20;
			barItem.y = i * 4 + offset + this.y + 2;
			this.barAnimations.push(barItem);
			this.stage.addChild(barItem);
		}
	};

    this.draw();
};