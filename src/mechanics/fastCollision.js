/**
 * [fastCollision description]
 * @param  {[type]} object1 [description]
 * @param  {[type]} object2 [description]
 * @return {[type]}         [description]
 */
function fastCollision(object1, object2) {
	var obj1 = object1.animations;
	var obj2 = object2.animations;

	return !(
		obj1.y + obj1.spriteSheet._frameHeight < obj2.y ||
		obj1.y > obj2.y + obj2.spriteSheet._frameHeight ||
		obj1.x > obj2.x + obj2.spriteSheet._frameWidth ||
		obj1.x + obj1.spriteSheet._frameWidth < obj2.x
	);
}

/**
 * [fastCollisionX description]
 * @param  {[type]} object1 [description]
 * @param  {[type]} object2 [description]
 * @return {[type]}         [description]
 */
function fastCollisionX(object1, object2) {
	var obj1 = object1.animations;
	var obj2 = object2.animations;

	return !(
		obj1.y + obj1.spriteSheet._frameHeight - 5 < obj2.y ||
		obj1.y > obj2.y + obj2.spriteSheet._frameHeight - 5 ||
		obj1.x > obj2.x + obj2.spriteSheet._frameWidth - 5 ||
		obj1.x + obj1.spriteSheet._frameWidth - 5 < obj2.x
	);
}

/**
 * [fastCollisionKillCopy description]
 * @param  {[type]} object1 [description]
 * @param  {[type]} object2 [description]
 * @return {[type]}         [description]
 */
function fastCollisionKillCopy(object1, object2) {
	var obj1 = object1.animations;
	var obj2 = object2.animations;

	return !(
		obj1.y + obj1.spriteSheet._frameHeight - 5 < obj2.y ||
		obj1.y > obj2.y + obj2.spriteSheet._frameHeight - 5 ||
		obj1.x > obj2.x + obj2.spriteSheet._frameWidth - 50 ||
		obj1.x + obj1.spriteSheet._frameWidth - 5 < obj2.x + 50
	);
}

/**
 * [fastCollisionPhone description]
 * @param  {[type]} object1 [description]
 * @param  {[type]} object2 [description]
 * @return {[type]}         [description]
 */
function fastCollisionPhone(object1, object2) {
	var obj1 = object1.animations;
	var obj2 = object2.animations;

	return !(
		obj1.y + obj1.spriteSheet._frameHeight - 5 < obj2.y + 10 ||
		obj1.y > obj2.y + obj2.spriteSheet._frameHeight - 5 ||
		obj1.x > obj2.x + obj2.spriteSheet._frameWidth - 5 ||
		obj1.x + obj1.spriteSheet._frameWidth - 5 < obj2.x
	);
}

/**
 * [fastCollisionPlayer description]
 * @param  {[type]} obj1 [description]
 * @param  {[type]} obj2 [description]
 * @return {[type]}      [description]
 */
function fastCollisionPlayer(obj1, obj2) {

	return !(
		obj1.y + obj1.animations.spriteSheet._frameHeight - 5 < obj2.y ||
		obj1.y + 10 > obj2.y + obj2.animations.spriteSheet._frameHeight ||
		obj1.x + 10 > obj2.x + obj2.animations.spriteSheet._frameWidth ||
		obj1.x + obj1.animations.spriteSheet._frameWidth - 10 < obj2.x
	);
}

/**
 * [fastCollisionPlayerLoose description]
 * @param  {[type]} obj1 [description]
 * @param  {[type]} obj2 [description]
 * @return {[type]}      [description]
 */
function fastCollisionPlayerLoose(obj1, obj2) {

	return !(
		obj1.y + obj1.animations.spriteSheet._frameHeight < obj2.y + 5 ||
		obj1.y > obj2.y + obj2.animations.spriteSheet._frameHeight + 5 ||
		obj1.x > obj2.x + obj2.animations.spriteSheet._frameWidth + 5 ||
		obj1.x + obj1.animations.spriteSheet._frameWidth < obj2.x + 5
	);
}

/**
 * [fastCollisionPlatform description]
 * @param  {[type]} obj1 [description]
 * @param  {[type]} obj2 [description]
 * @return {[type]}      [description]
 */
function fastCollisionPlatform(obj1, obj2) {

	return !(
		obj1.y + obj1.animations.spriteSheet._frameHeight < obj2.y - 1 ||
		obj1.y > obj2.y + obj2.animations.spriteSheet._frameHeight / 2 ||
		obj1.x > obj2.x + obj2.animations.spriteSheet._frameWidth ||
		obj1.x + obj1.animations.spriteSheet._frameWidth < obj2.x
	);
}

/**
 * [fastInitialCollisionPlatform description]
 * @param  {[type]} obj1 [description]
 * @param  {[type]} obj2 [description]
 * @return {[type]}      [description]
 */
function fastInitialCollisionPlatform(obj1, obj2) {

	return !(
		obj1.y + obj1.animations.spriteSheet._frameHeight < obj2.y - 1 ||
		obj1.y > obj2.y + obj2.animations.spriteSheet._frameHeight / 2 ||
		obj1.x > obj2.x + obj2.animations.spriteSheet._frameWidth - 12 ||
		obj1.x + obj1.animations.spriteSheet._frameWidth - 12 < obj2.x
	);
}

/**
 * [fastCollisionSprite description]
 * @param  {[type]} obj1 [description]
 * @param  {[type]} obj2 [description]
 * @return {[type]}      [description]
 */
function fastCollisionSprite(obj1, obj2) {
	return !(
		obj1.y + obj1.spriteSheet._frameHeight < obj2.y ||
		obj1.y > obj2.y + obj2.spriteSheet._frameHeight ||
		obj1.x > obj2.x + obj2.spriteSheet._frameWidth ||
		obj1.x + obj1.spriteSheet._frameWidth < obj2.x
	);
}