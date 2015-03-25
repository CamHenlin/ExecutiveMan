cd leveljson
./makelevel.sh accountingman 7
./makelevel.sh materialman 8
./makelevel.sh visionaryman 8
./makelevel.sh warehouseman 0
./makelevel.sh wasteman 6
./makelevel.sh hrman 0
./makelevel.sh itman 0
./makelevel.sh salesman 0
./makelevel.sh demo 0
cd ../
java -jar compiler.jar \
	--js=libs/easeljs-0.8.0.min.js --js=libs/soundjs-0.6.0.min.js --js=libs/preload-NEXT.min.js \
	\
	--js=levels/wastemanlevel.js --js=levels/accountingmanlevel.js  --js=levels/materialmanlevel.js --js=levels/visionarymanlevel.js \
	--js=levels/warehousemanlevel.js --js=levels/hrmanlevel.js --js=levels/itmanlevel.js --js=levels/salesmanlevel.js \
	--js=levels/demolevel.js \
	\
	--js=objects/healthbar.js --js=objects/death.js --js=objects/bosspoint.js --js=objects/door.js --js=objects/explosivebarrel.js \
	--js=objects/platform.js --js=objects/droppingplatform.js --js=objects/disappearingplatform.js --js=objects/rotatingplatform.js \
	--js=objects/bosshealthbar.js --js=objects/bighealth.js --js=objects/littlehealth.js --js=objects/extralife.js --js=objects/beam.js \
	--js=objects/halfwaypoint.js --js=objects/weaponbar.js --js=objects/healthbriefcase.js \
	\
	--js=enemies/killcopy.js --js=enemies/wasteman.js  --js=enemies/accountingman.js --js=enemies/printerguy.js \
	--js=enemies/flood.js --js=enemies/shieldguy.js --js=enemies/copter.js --js=enemies/phone.js \
	--js=enemies/filingcabinet.js --js=enemies/warehouseman.js --js=enemies/materialman.js --js=enemies/wallgun.js \
	--js=enemies/annoyingthing.js --js=enemies/computerguy.js --js=enemies/sixshooter.js --js=enemies/shootythingy.js \
	--js=enemies/staplerdude.js --js=enemies/coffeecopter.js \
	\
	--js=mechanics/constants.js --js=mechanics/common.js --js=mechanics/globals.js --js=mechanics/loader.js \
	--js=mechanics/main.js --js=mechanics/collision.js --js=mechanics/fastCollision.js \
	--js=mechanics/renderer.js --js=mechanics/player.js  --js=mechanics/titlescreen.js \
	--js=mechanics/pausemenu.js --js=mechanics/showoffboss.js \
	--js=mechanics/bossscreen.js --js=mechanics/soundwrapper.js --js=mechanics/basiccollision.js \
	--js=mechanics/savesystem.js --js=mechanics/optionsmenu.js --js=mechanics/joystick.js \
	--js=mechanics/mainmenu.js --js=mechanics/dialog.js \
	\
	--js_output_file=game.min.js