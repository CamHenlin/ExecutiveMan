var hasJoystick = false;
var usingJoystick = false;
var joystickPressedList = [];
var joystickButtonLength = 0;

var joystick = {
	"left": -1,
	"right": -1,
	"pause": -1,
	"attack": -1,
	"jump": -1
};

/**
 * [hasJoystickSupport description]
 * @return {Boolean} [description]
 */
function hasJoystickSupport() {
	return "getGamepads" in navigator;
}

/**
 * [gamepadPoll_options description]
 * @return {[type]} [description]
 */
function gamepadPoll_options() {
	if (!optionsUp) {
		return;
	}

	var gp = navigator.getGamepads()[0];

	for (var i = 0; i < gp.buttons.length; i++) {
		if (gp.buttons[i].pressed) {
			if (this.setKey === "left") {
				joystick.left = i;
			} else if (this.setKey === "right") {
				joystick.right = i;
			} else if (this.setKey === "jump") {
				joystick.jump = i;
			} else if (this.setKey === "shoot") {
				joystick.attack = i;
			} else if (this.setKey === "pause") {
				joystick.pause = i;
			}

			this.setKeyLabel.text = "JOYSTICK " + i;
			this.setKeyLabel = null;
			this.setKey = null;
			usingJoystick = true;
			window.clearInterval(gamepadPoll_options.bind(this));
		}
	}
}

/**
 * [gamepadPoll_game description]
 * @return {[type]} [description]
 */
function gamepadPoll_game() {
	var gp = navigator.getGamepads()[0];
	var actions = {
		"playerLeft": false,
		"playerRight": false,
		"playerJump": false,
		"playerAttack": false,
		"jumpReleased": false,
		"attackReleased": false
	};

	for (var i = 0; i < gp.buttons.length; i++) {
		if (gp.buttons[i].pressed) {
			if (i === joystick.left) {
				actions.playerLeft = true;
			} else if (i === joystick.right) {
				actions.playerRight = true;
			} else if (i === joystick.jump) {
				actions.playerJump = true;
			} else if (i === joystick.attack) {
				actions.playerAttack = true;
			} else if (i === joystick.pause) {
				if (this.paused) {
					this.paused = false;
					this.pauseMenu.remove();
				} else {
					this.paused = true;
					this.pauseMenu.show();
				}
			}
		}
	}

	if (!actions.playerJump) {
		actions.jumpReleased = true;
	}

	if (!actions.playerAttack) {
		actions.attackReleased = true;
	}

	return actions;
}

(function() {
	if (hasJoystickSupport()) {
		window.addEventListener("gamepadconnected", function(e) {
			console.log(e);
			hasJoystick = true;
			joystickButtonLength = e.gamepad.buttons.length;
			for (var i = 0; i < joystickButtonLength; i++) {
				joystickPressedList[i] = false;
			}
			console.log("Gamepad connected at index %d: %s. %d buttons, %d axes.",
				e.gamepad.index, e.gamepad.id,
				e.gamepad.buttons.length, e.gamepad.axes.length);
		});

		window.addEventListener("gamepaddisconnected", function(e) {
			hasJoystick = false;
			console.log("Gamepad disconnected at index %d", e.gamepad.index);
		});

		// every 1 seconds we're gonna poll for a new keyboard. may be a good idea to only do this when the options menu is up, look into that later
		var checkGP = window.setInterval(function() {
			if (navigator.getGamepads()[0]) {
				if (!hasJoystick) {
					var event = new CustomEvent("gamepadconnected");

					// Dispatch/Trigger/Fire the event
					window.dispatchEvent(event);
				}
				window.clearInterval(checkGP);
			}
		}, 1000);
	}
})();