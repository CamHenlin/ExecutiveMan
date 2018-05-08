/**
 * [BasicCollision description]
 * @param {[type]} renderer [description]
 */
function BasicCollision(renderer) {
	this.renderer = renderer;

	/**
	 * [basicCollision description]
	 * @param  {[type]} object [description]
	 * @return {[type]}        [description]
	 */
	this.basicCollision = function(object) {
		var modifier = 2;
		var xmodifier = 2;

		return this.checkCollisions({
			left: {
				x: object.x + xmodifier - this.renderer.completedMapsWidthOffset,
				y: object.y + object.animations.spriteSheet._frameHeight / 2
			},
			bottom: {
				x: object.x - this.renderer.completedMapsWidthOffset + object.animations.spriteSheet._frameWidth / 2,
				y: object.y + object.animations.spriteSheet._frameHeight
			},
			right: {
				x: object.x - this.renderer.completedMapsWidthOffset + object.animations.spriteSheet._frameWidth - xmodifier,
				y: object.y + object.animations.spriteSheet._frameHeight / 2
			},
			top: {
				x: object.x - this.renderer.completedMapsWidthOffset + object.animations.spriteSheet._frameWidth / 2,
				y: object.y + modifier
			}
		}, this.renderer.collisionArray, this.renderer.heightOffset, this.renderer.widthOffset);
	};

	/**
	 * [checkCollisions description]
	 * @param  {[type]} playerCollisionPoints [description]
	 * @param  {[type]} collisionArray        [description]
	 * @param  {[type]} heightOffset          [description]
	 * @param  {[type]} widthOffset           [description]
	 * @return {[type]}                       [description]
	 */
	this.checkCollisions = function(playerCollisionPoints, collisionArray, heightOffset, widthOffset) {
		var moves = {
			left: true,
			down: true,
			right: true,
			up: true
		};
		var tilesize = 16; // this is used as width and height!

		try {
			var a = ~~((playerCollisionPoints.left.y - heightOffset) / tilesize);
			var b = ~~((playerCollisionPoints.left.x - widthOffset) / tilesize);

			if (a <= -1 || a > collisionArray.length) {
				a = 0;
			}

			if (b <= -1 || b > collisionArray[a].length) {
				b = 0;
			}

			if (collisionArray[a][b]) {
				moves.left = false;
			}

			a = ~~((playerCollisionPoints.bottom.y - heightOffset) / tilesize);
			b = ~~((playerCollisionPoints.bottom.x - widthOffset) / tilesize);

			if (a <= -1 || a > collisionArray.length) {
				a = 0;
			}

			if (b <= -1 || b > collisionArray[a].length) {
				b = 0;
			}

			if (collisionArray[a][b] && this.isTop(collisionArray, a, b)) {
				moves.down = false;
			}

			a = ~~((playerCollisionPoints.right.y - heightOffset) / tilesize);
			b = ~~((playerCollisionPoints.right.x - widthOffset) / tilesize);

			if (a <= -1 || a > collisionArray.length) {
				a = 0;
			}

			if (b <= -1 || b > collisionArray[a].length) {
				b = 0;
			}

			if (collisionArray[a][b]) {
				moves.right = false;
			}

			a = ~~((playerCollisionPoints.top.y - heightOffset) / tilesize);
			b = ~~((playerCollisionPoints.top.x - widthOffset) / tilesize);

			if (a <= -1 || a > collisionArray.length) {
				a = 0;
			}

			if (b <= -1 || b > collisionArray[a].length) {
				b = 0;
			}

			if (collisionArray[a][b] && this.isBottom(collisionArray, a, b)) {
				moves.up = false;
			}
		} catch (error) {}

		return moves;
	};

	/**
	 * [isTop description]
	 * @param  {[type]}  collisionArray [description]
	 * @param  {[type]}  a              [description]
	 * @param  {[type]}  b              [description]
	 * @return {Boolean}                [description]
	 */
	this.isTop = function(collisionArray, a, b) {
		if (collisionArray[a - 1][b]) {
			return false;
		}

		return true;
	};

	/**
	 * [isBottom description]
	 * @param  {[type]}  collisionArray [description]
	 * @param  {[type]}  a              [description]
	 * @param  {[type]}  b              [description]
	 * @return {Boolean}                [description]
	 */
	this.isBottom = function(collisionArray, a, b) {
		if (collisionArray[a + 1][b]) {
			return false;
		}

		return true;
	};
}