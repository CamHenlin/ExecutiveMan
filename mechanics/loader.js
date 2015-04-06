var loadFiles = [{
	id: "accountingman",
	src: "images/accountingmansprite.png"
}, {
	id: "accountingmanframe",
	src: "images/accountingmanframe.png"
}, {
	id: "annoyingthing",
	src: "images/annoyingthing.png"
}, {
	id: "beam",
	src: "images/beam.png"
}, {
	id: "bighealth",
	src: "images/bighealth.png"
}, {
	id: "bossframe",
	src: "images/bossframe.png"
}, {
	id: "businessman",
	src: "images/businessmanspritesheet.png"
}, {
	id: "businessman_black",
	src: "images/businessmanspritesheet_black.png"
}, {
	id: "businessman_blue",
	src: "images/businessmanspritesheet_blue.png"
}, {
	id: "businessman_brown",
	src: "images/businessmanspritesheet_brown.png"
}, {
	id: "businessman_green",
	src: "images/businessmanspritesheet_green.png"
}, {
	id: "businessman_pink",
	src: "images/businessmanspritesheet_pink.png"
}, {
	id: "businessman_red",
	src: "images/businessmanspritesheet_red.png"
}, {
	id: "businessman_teal",
	src: "images/businessmanspritesheet_teal.png"
}, {
	id: "businessman_yellow",
	src: "images/businessmanspritesheet_yellow.png"
}, {
	id: "buttons",
	src: "images/buttons.png"
}, {
	id: "computerguy",
	src: "images/computerguy.png"
}, {
	id: "copter",
	src: "images/copter.png"
}, {
	id: "damage",
	src: "images/damage.png"
}, {
	id: "death",
	src: "images/death.png"
}, {
	id: "door",
	src: "images/door.png"
}, {
	id: "sixshooter",
	src: "images/sixshooter.png"
}, {
	id: "shootythingy",
	src: "images/shootythingy.png"
}, {
	id: "enemyshot",
	src: "images/enemyshot.png"
}, {
	id: "executivemantopper",
	src: "images/executivemantopper.png"
}, {
	id: "explosion",
	src: "images/explosion.png"
}, {
	id: "explosivebarrel",
	src: "images/explosivebarrel.png"
}, {
	id: "extralife",
	src: "images/extralife.png"
}, {
	id: "filingcabinet",
	src: "images/filingcabinet.png"
}, {
	id: "flood",
	src: "images/flood.png"
}, {
	id: "health",
	src: "images/healthbar.png"
}, {
	id: "healthbriefcase",
	src: "images/healthbriefcase.png"
}, {
	id: "killcopy",
	src: "images/killcopy.png"
}, {
	id: "littlehealth",
	src: "images/littlehealth.png"
}, {
	id: "logo",
	src: "images/executivemanlogo.png"
}, {
	id: "coffeecopter",
	src: "images/coffeecopter.png"
}, {
	id: "map1",
	src: "images/map1.png"
}, {
	id: "map2",
	src: "images/map2.png"
}, {
	id: "map3",
	src: "images/map3.png"
}, {
	id: "hrmanmap",
	src: "images/hrmanmap.png"
}, {
	id: "map6",
	src: "images/map6.png"
}, {
	id: "materialman",
	src: "images/materialmanspritesheet.png"
}, {
	id: "materialmanframe",
	src: "images/materialmanframe.png"
}, {
	id: "moneyspin",
	src: "images/moneyspin.png"
}, {
	id: "papershot",
	src: "images/papershot.png"
}, {
	id: "phone",
	src: "images/phone.png"
}, {
	id: "execmanface",
	src: "images/execmanface.png"
}, {
	id: "platform",
	src: "images/platform.png"
}, {
	id: "camh",
	src: "images/camh.png"
}, {
	id: "printerguy",
	src: "images/printerguy.png"
}, {
	id: "rotatingplatform",
	src: "images/rotatingplatform.png"
}, {
	id: "shieldguy",
	src: "images/shieldguy.png"
}, {
	id: "shopframe",
	src: "images/shopframe.png"
}, {
	id: "shot",
	src: "images/shot.png"
}, {
	id: "staplerdude",
	src: "images/staplerdude.png"
}, {
	id: "stapler",
	src: "images/stapler.png"
}, {
	id: "shotexplosion",
	src: "images/shotexplode.png"
}, {
	id: "visionarymanframe",
	src: "images/visionarymanframe.png"
}, {
	id: "hrmanframe",
	src: "images/hrmanframe.png"
}, {
	id: "itmanframe",
	src: "images/itmanframe.png"
}, {
	id: "salesmanframe",
	src: "images/salesmanframe.png"
}, {
	id: "wallgun",
	src: "images/wallgun.png"
}, {
	id: "warehouseman",
	src: "images/warehousemanspritesheet.png"
}, {
	id: "warehousemanbigshot",
	src: "images/warehousemanbigshot.png"
}, {
	id: "execmanlogo",
	src: "images/execmanlogo.png"
}, {
	id: "warehousemanframe",
	src: "images/warehousemanframe.png"
}, {
	id: "warehousemanshot",
	src: "images/warehousemanshot.png"
}, {
	id: "wasteman",
	src: "images/wastemanspritesheet.png"
}, {
	id: "wastemanframe",
	src: "images/wastemanframe.png"
}, {
	id: "wastemanshot",
	src: "images/wastemanshot.png"
}, {
	id: "wastemanshotdown",
	src: "images/wastemanshotdown.png"
}];

/**
 * [handleComplete description]
 * @return {[type]} [description]
 */
function handleComplete() {
	init();
}

/**
 * [handleProgress description]
 * @param  {[type]} e [description]
 * @return {[type]}   [description]
 */
var handleProgress = function(e) {
	loadProgress = e.progress;
};

/**
 * [loadTick description]
 * @return {[type]} [description]
 */
var loadTick = function() {
	if (loadProgress === 1) {
		createjs.Ticker.removeEventListener("tick", loadTick);
		return;
	}

	progress = new createjs.Shape(); // Remember to define the progress variable at the top!
	progress.graphics.beginStroke("#F00").beginFill("#F00").drawRect(0, gamestage.canvas.height - 60, gamestage.canvas.width * loadProgress, 20);
	gamestage.addChild(progress);
	gamestage.update();
};

// execute on load:
loader = new createjs.LoadQueue(false);
loader.addEventListener("complete", handleComplete);
loader.addEventListener("progress", handleProgress);
loader.loadManifest(loadFiles);

createjs.Ticker.addEventListener("tick", loadTick);
createjs.Ticker.useRAF = true;

createjs.Ticker.setFPS(60);
