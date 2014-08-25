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
createjs.Sound.registerSound("sounds/health.wav", "health");
createjs.Sound.registerSound("sounds/death.wav", "death");
createjs.Sound.registerSound("sounds/extralife.wav", "extralife");

createjs.Sound.registerSound("sounds/warehousemanshoot.wav", "warehousemanshoot");
createjs.Sound.registerSound("sounds/warehousemanshothit.wav", "warehousemanshothit");
createjs.Sound.registerSound("sounds/warehousemanshothitsmall.wav", "warehousemanshothitsmall");

createjs.Sound.registerSound("songs/trust.mp3", "wastemansong");
createjs.Sound.registerSound("songs/psychotron.mp3", "accountingmansong");

loader.installPlugin(createjs.SoundJS);

function playSound(sound) {
    var fx = createjs.Sound.play(sound);
    fx.volume = 0.25;
}

function playSoundTwice(sound) {
	var loop = createjs.Sound.play(sound, {loop:1});
	loop.volume = 0.25;
}

function playSoundLoop(sound) {
	if (musicOff) { return; }

	var loop = createjs.Sound.play(sound, {loop:-1});
	loop.volume = 0.15;
}

function stopMusic() {
	createjs.Sound.stop();
}