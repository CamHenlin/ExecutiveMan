function TileCollisionDetector() {
	this.checkCollisions = function(player, collisionArray, actions) {
		var tilesize = 32; // this is used as width and height!
		var playerCollisionPoints = {
			leftTop : { x: player.x, y: player.y + 5 },
			leftBottom : { x: player.x, y: player.y + player.animations.spriteSheet._frameHeight - 5 },
			bottomLeft : { x: player.x + 5, y: player.y + player.animations.spriteSheet._frameHeight },
			bottomRight : { x: player.x + player.animations.spriteSheet._frameWidth - 5, y: player.y + player.animations.spriteSheet._frameHeight },
			rightBottom : { x: player.x + player.animations.spriteSheet._frameWidth, y: player.y + player.animations.spriteSheet._frameHeight - 5 },
			rightTop : { x: player.x + player.animations.spriteSheet._frameWidth, y: player.y - 5 },
			topRight : { x: player.x + player.animations.spriteSheet._frameWidth - 5, y: player.y },
			topLeft : { x: player.x + 5, y: player.y }
		};
;
		var a = Math.floor(playerCollisionPoints.leftTop.y / tilesize);
		var b = Math.floor(playerCollisionPoints.leftTop.x / tilesize);
		//console.log(a);
		//console.log(b);
		if (a <= -1) {
			a = 0;
		}

		if (b <= - 1) {
			b = 0;
		}

		if (collisionArray[a][b]) {
			console.log("collision");
		}
	}
}