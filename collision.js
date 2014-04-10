function TileCollisionDetector() {
	this.checkCollisions = function(playerCollisionPoints, collisionArray) {
		var moves = { leftmove : true, downmove : true, rightmove : true, upmove : true };
		var tilesize = 32; // this is used as width and height!

		var a = Math.floor(playerCollisionPoints.leftTop.y / tilesize);
		var b = Math.floor(playerCollisionPoints.leftTop.x / tilesize);

		if (a <= -1) {
			a = 0;
		}

		if (b <= - 1) {
			b = 0;
		}

		if (collisionArray[a][b]) {
			moves.leftmove = false;
		}

		a = Math.floor(playerCollisionPoints.leftBottom.y / tilesize);
		b = Math.floor(playerCollisionPoints.leftBottom.x / tilesize);

		if (a <= -1) {
			a = 0;
		}

		if (b <= - 1) {
			b = 0;
		}

		if (collisionArray[a][b]) {
			moves.leftmove = false;
		}

		a = Math.floor(playerCollisionPoints.bottomLeft.y / tilesize);
		b = Math.floor(playerCollisionPoints.bottomLeft.x / tilesize);

		if (a <= -1) {
			a = 0;
		}

		if (b <= - 1) {
			b = 0;
		}

		if (collisionArray[a][b]) {
			moves.downmove = false;
		}

		a = Math.floor(playerCollisionPoints.bottomRight.y / tilesize);
		b = Math.floor(playerCollisionPoints.bottomRight.x / tilesize);

		if (a <= -1) {
			a = 0;
		}

		if (b <= - 1) {
			b = 0;
		}

		if (collisionArray[a][b]) {
			moves.downmove = false;
		}

		a = Math.floor(playerCollisionPoints.rightBottom.y / tilesize);
		b = Math.floor(playerCollisionPoints.rightBottom.x / tilesize);

		if (a <= -1) {
			a = 0;
		}

		if (b <= - 1) {
			b = 0;
		}

		if (collisionArray[a][b]) {
			moves.rightmove = false;
		}

		a = Math.floor(playerCollisionPoints.rightTop.y / tilesize);
		b = Math.floor(playerCollisionPoints.rightTop.x / tilesize);

		if (a <= -1) {
			a = 0;
		}

		if (b <= - 1) {
			b = 0;
		}

		if (collisionArray[a][b]) {
			moves.rightmove = false;
		}

		a = Math.floor(playerCollisionPoints.topLeft.y / tilesize);
		b = Math.floor(playerCollisionPoints.topLeft.x / tilesize);

		if (a <= -1) {
			a = 0;
		}

		if (b <= - 1) {
			b = 0;
		}

		if (collisionArray[a][b]) {
			moves.upmove = false;
		}

		a = Math.floor(playerCollisionPoints.topRight.y / tilesize);
		b = Math.floor(playerCollisionPoints.topRight.x / tilesize);

		if (a <= -1) {
			a = 0;
		}

		if (b <= - 1) {
			b = 0;
		}

		if (collisionArray[a][b]) {
			moves.upmove = false;
		}

		return moves;
	};
}