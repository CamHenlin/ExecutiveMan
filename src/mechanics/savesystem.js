/**
 * [saveGame description]
 * @return {[type]} [description]
 */
function saveGame() {
	localStorage.setItem("score", score);
	localStorage.setItem("lives", lives);
	localStorage.setItem("doubleJump", doubleJump);
	localStorage.setItem("damageModifier", damageModifier);
	localStorage.setItem("healthModifier", healthModifier);
	localStorage.setItem("scoreModifier", scoreModifier);
	localStorage.setItem("joystick", JSON.stringify(joystick));
	localStorage.setItem("usingJoystick", usingJoystick);
	localStorage.setItem("keyCodes", JSON.stringify(keyCodes));
}

/**
 * [loadGame description]
 * @return {[type]} [description]
 */
function loadGame() {
	score = localStorage.getItem("score");
	lives = localStorage.getItem("lives");
	doubleJump = localStorage.getItem("doubleJump");
	damageModifier = localStorage.getItem("damageModifier");
	healthModifier = localStorage.getItem("healthModifier");
	scoreModifier = localStorage.getItem("scoreModifier");
	joystick = JSON.parse(localStorage.getItem("joystick"));
	if (hasJoystick) {
		usingJoystick = localStorage.getItem("usingJoystick");
	}
	keyCodes = JSON.parse(localStorage.getItem("keyCodes"));
}