function fastCollision(object1, object2) {
    var obj1an = object1.animations;
    var obj2an = object2.animations;

    if (obj1an.x + obj1an.spriteSheet._frameWidth >= obj2an.x  &&
        obj1an.x <= obj2an.x + obj2an.spriteSheet._frameWidth  &&
        obj1an.y + obj1an.spriteSheet._frameHeight >= obj2an.y &&
        obj1an.y <= obj2an.y + obj2an.spriteSheet._frameWidth) {

        return true;
    }

    return false;
}

function fastCollisionX(object1, object2) {
    var obj1an = object1.animations;
    var obj2an = object2.animations;

    if (obj1an.x + obj1an.spriteSheet._frameWidth - 10 >= obj2an.x  &&
        obj1an.x <= obj2an.x + obj2an.spriteSheet._frameWidth - 10  &&
        obj1an.y + obj1an.spriteSheet._frameHeight - 10 >= obj2an.y &&
        obj1an.y <= obj2an.y + obj2an.spriteSheet._frameWidth - 10) {

        return true;
    }

    return false;
}