createjs.Sound.registerSound("sounds/jumpland.wav", "jumpland");
createjs.Sound.registerSound("sounds/shotbounce.wav", "shotbounce");
createjs.Sound.registerSound("sounds/pauseopen.wav", "pauseopen");
createjs.Sound.registerSound("sounds/pauseclose.wav", "pauseclose");
createjs.Sound.registerSound("sounds/playerdamaged.wav", "playerdamaged");
createjs.Sound.registerSound("sounds/shoot.wav", "shoot");
createjs.Sound.registerSound("sounds/shotexplode.wav", "shotexplode");
createjs.Sound.registerSound("sounds/shotexplode.wav", "shotexplode");
createjs.Sound.registerSound("sounds/error.wav", "error");
createjs.Sound.registerSound("sounds/papershot.wav", "papershot");

loader.installPlugin(createjs.SoundJS);

function playSound(sound) {
    var fx = createjs.Sound.play(sound);
    fx.volume = 0.25;
}

function playSoundLoop(sound) {
	var loop = createjs.Sound.play(sound, {loop:-1});
	loop.volume = 0.15;
}

function stopMusic() {
	createjs.Sound.stop();
}