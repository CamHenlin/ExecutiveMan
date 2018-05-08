const glob = require('glob');
const fs = require('fs');

module.exports.buildLevel = function(levelName, halfwayPoint) {
    const levelJsonPath = `leveljson/${levelName}`;
    const levelConfig = glob.sync(levelJsonPath + '*');
    const levelpath = 'levels/' + levelName + 'level.js'

    let levelData = "";

    levelData += `var ${levelName}HalfwayPoint = ${halfwayPoint};\n`;
    levelData += `var ${levelName}BossPoint = ${levelConfig.length - 2};\n`;
    levelData += `var ${levelName}maps = [];\n\n`;

    let file;
    for(let i = 0; i < levelConfig.length; i++){
        file = fs.readFileSync(levelJsonPath + (i + 1) + '.json', 'utf-8');
        levelData += `${levelName}maps[${i}] = ${file.replace(/\s/g,'')}\n`;
    }

    const levelFile = fs.writeFileSync(levelpath, levelData);
    console.log(`Successfully built ${levelName}level.js with ${levelConfig.length + 1} screens.`)
}