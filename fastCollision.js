function fastCollision(object1, object2) {
    var obj1 = object1.animations;
    var obj2 = object2.animations;

    return !(
            obj1.y + obj1.spriteSheet._frameHeight < obj2.y ||
            obj1.y > obj2.y + obj2.spriteSheet._frameHeight ||
            obj1.x > obj2.x + obj2.spriteSheet._frameWidth  ||
            obj1.x + obj1.spriteSheet._frameWidth < obj2.x
    );
}

function fastCollisionX(object1, object2) {
    var obj1 = object1.animations;
    var obj2 = object2.animations;

    return !(
            obj1.y + obj1.spriteSheet._frameHeight - 5 < obj2.y ||
            obj1.y > obj2.y + obj2.spriteSheet._frameHeight - 5 ||
            obj1.x > obj2.x + obj2.spriteSheet._frameWidth - 5  ||
            obj1.x + obj1.spriteSheet._frameWidth - 5 < obj2.x
    );
}

function fastCollisionPlayer(obj1, obj2) {

    return !(
            obj1.y + obj1.animations.spriteSheet._frameHeight - 5 < obj2.y ||
            obj1.y + 10 > obj2.y + obj2.animations.spriteSheet._frameHeight ||
            obj1.x + 10 > obj2.x + obj2.animations.spriteSheet._frameWidth  ||
            obj1.x + obj1.animations.spriteSheet._frameWidth - 10 < obj2.x
    );
}

function fastCollisionPlayerLoose(obj1, obj2) {

    return !(
            obj1.y + obj1.animations.spriteSheet._frameHeight < obj2.y + 5 ||
            obj1.y > obj2.y + obj2.animations.spriteSheet._frameHeight + 5 ||
            obj1.x > obj2.x + obj2.animations.spriteSheet._frameWidth + 5  ||
            obj1.x + obj1.animations.spriteSheet._frameWidth < obj2.x + 5
    );
}

function fastCollisionSprite(obj1, obj2) {
    return !(
            obj1.y + obj1.spriteSheet._frameHeight < obj2.y ||
            obj1.y > obj2.y + obj2.spriteSheet._frameHeight ||
            obj1.x > obj2.x + obj2.spriteSheet._frameWidth  ||
            obj1.x + obj1.spriteSheet._frameWidth < obj2.x
    );
}