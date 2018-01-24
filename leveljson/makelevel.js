const glob = require('glob');
const fs = require('fs');
const args = process.argv;


const levelName = args[2];
const halfwaypoint = args[3] || 0;
const levelJsonPath = `leveljson/${levelName}`;
const levelConfig = glob.sync(levelJsonPath + '*');
const levelpath = 'levels/' + levelName + 'level.js'

let levelData = "";

levelData += `var ${levelName}HalfwayPoint = ${halfwaypoint};\n`;
levelData += `var ${levelName}BossPoint = ${levelConfig.length - 2};\n`;
levelData += `var ${levelName}maps = [];\n\n`;


let file;
for(let i = 0; i < levelConfig.length; i++){
    file = fs.readFileSync(levelJsonPath + (i + 1) + '.json', 'utf-8');
    console.log(file);
    levelData += `${levelName}maps[${i}] = ${file.replace(/\s/g,'')}\n`;
}

const levelFile = fs.writeFileSync(levelpath, levelData)

console.log(levelName);
console.log("Make level script");