

function saveGame() {
	localStorage.setItem("score", score);
	localStorage.setItem("lives", lives);
	localStorage.setItem("doubleJump", doubleJump);
	localStorage.setItem("damageModifier", damageModifier);
	localStorage.setItem("healthModifier", healthModifier);
	localStorage.setItem("scoreModifier", scoreModifier);
}

function loadGame() {
	score = localStorage.getItem("score");
	lives = localStorage.getItem("lives");
	doubleJump = localStorage.getItem("doubleJump");
	damageModifier = localStorage.getItem("damageModifier");
	healthModifier = localStorage.getItem("healthModifier");
	scoreModifier = localStorage.getItem("scoreModifier");
}