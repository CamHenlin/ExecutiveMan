/**
 * [TileCollisionDetector description]
 */
function TileCollisionDetector() {
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
			leftmove: true,
			downmove: true,
			rightmove: true,
			upmove: true,
			nextmap: false,
			nextmapup: false
		};
		var tilesize = 16; // this is used as width and height!

		try {
			var a = ~~((playerCollisionPoints.leftTop.y - heightOffset) / tilesize);
			var b = ~~((playerCollisionPoints.leftTop.x - widthOffset) / tilesize);

			if (a <= -1 || a > collisionArray.length) {
				a = 0;
			}

			if (b <= -1 || b > collisionArray[a].length) {
				b = 0;
			}

			if (collisionArray[a][b]) {
				moves.leftmove = false;
			}

			a = ~~((playerCollisionPoints.leftBottom.y - heightOffset) / tilesize);
			b = ~~((playerCollisionPoints.leftBottom.x - widthOffset) / tilesize);

			if (a <= -1 || a > collisionArray.length) {
				a = 0;
			}

			if (b <= -1 || b > collisionArray[a].length) {
				b = 0;
			}

			if (collisionArray[a][b]) {
				moves.leftmove = false;
			}

			a = ~~((playerCollisionPoints.bottomLeft.y - heightOffset) / tilesize);
			b = ~~((playerCollisionPoints.bottomLeft.x - widthOffset) / tilesize);

			if (a <= -1 || a > collisionArray.length) {
				a = 0;
			}

			if (b <= -1 || b > collisionArray[a].length) {
				b = 0;
			}

			if (collisionArray[a][b] && this.isTop(collisionArray, a, b)) {
				moves.downmove = false;
			}

			a = ~~((playerCollisionPoints.bottomRight.y - heightOffset) / tilesize);
			b = ~~((playerCollisionPoints.bottomRight.x - widthOffset) / tilesize);

			if (a <= -1 || a > collisionArray.length) {
				a = 0;
			}

			if (b <= -1 || b > collisionArray[a].length) {
				b = 0;
			}

			if (collisionArray[a][b] && this.isTop(collisionArray, a, b)) {
				moves.downmove = false;
			}

			a = ~~((playerCollisionPoints.rightBottom.y - heightOffset) / tilesize);
			b = ~~((playerCollisionPoints.rightBottom.x - widthOffset) / tilesize);

			if (a <= -1 || a > collisionArray.length) {
				a = 0;
			}

			if (b <= -1 || b > collisionArray[a].length) {
				b = 0;
			}

			if (collisionArray[a][b]) {
				moves.rightmove = false;
			}

			a = ~~((playerCollisionPoints.rightTop.y - heightOffset) / tilesize);
			b = ~~((playerCollisionPoints.rightTop.x - widthOffset) / tilesize);

			if (a <= -1 || a > collisionArray.length) {
				a = 0;
			}

			if (b <= -1 || b > collisionArray[a].length) {
				b = 0;
			}

			if (collisionArray[a][b]) {
				moves.rightmove = false;
			}

			a = ~~((playerCollisionPoints.topLeft.y - heightOffset) / tilesize);
			b = ~~((playerCollisionPoints.topLeft.x - widthOffset) / tilesize);

			if (a <= -1 || a > collisionArray.length) {
				a = 0;
				moves.nextmapup = true;
			}

			if (b <= -1 || b > collisionArray[a].length) {
				b = 0;
			}

			if (collisionArray[a][b] && this.isBottom(collisionArray, a, b)) {
				moves.upmove = false;
			}

			a = ~~((playerCollisionPoints.topRight.y - heightOffset) / tilesize);
			b = ~~((playerCollisionPoints.topRight.x - widthOffset) / tilesize);

			if (a <= -1 || a > collisionArray.length) {
				a = 0;
			}

			if (b <= -1 || b > collisionArray[a].length) {
				b = 0;
			}

			if (collisionArray[a][b] && this.isBottom(collisionArray, a, b)) {
				moves.upmove = false;
			}
		} catch (error) {
			moves = {
				leftmove: false,
				downmove: false,
				rightmove: false,
				upmove: false,
				nextmap: true,
				nextmapup: false
			};
		}

		return moves;
	};

	/**
	 * [checkDownCollisions description]
	 * @param  {[type]} playerCollisionPoints [description]
	 * @param  {[type]} collisionArray        [description]
	 * @param  {[type]} heightOffset          [description]
	 * @param  {[type]} widthOffset           [description]
	 * @return {[type]}                       [description]
	 */
	this.checkDownCollisions = function(playerCollisionPoints, collisionArray, heightOffset, widthOffset) {

		var moves = {
			leftmove: true,
			downmove: true,
			rightmove: true,
			upmove: true,
			nextmap: false,
			nextmapup: false
		};
		var tilesize = 16; // this is used as width and height!

		try {
			var a = ~~((playerCollisionPoints.bottomLeft.y - heightOffset) / tilesize);
			var b = ~~((playerCollisionPoints.bottomLeft.x - widthOffset) / tilesize);

			if (a <= -1 || a > collisionArray.length) {
				a = 0;
			}

			if (b <= -1 || b > collisionArray[a].length) {
				b = 0;
			}

			if (collisionArray[a][b] && this.isTop(collisionArray, a, b)) {
				moves.downmove = false;
			}

			a = ~~((playerCollisionPoints.bottomRight.y - heightOffset) / tilesize);
			b = ~~((playerCollisionPoints.bottomRight.x - widthOffset) / tilesize);

			if (a <= -1 || a > collisionArray.length) {
				a = 0;
			}

			if (b <= -1 || b > collisionArray[a].length) {
				b = 0;
			}

			if (collisionArray[a][b] && this.isTop(collisionArray, a, b)) {
				moves.downmove = false;
			}
		} catch (error) {
			moves = {
				leftmove: false,
				downmove: false,
				rightmove: false,
				upmove: false,
				nextmap: true,
				nextmapup: false
			};
		}

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