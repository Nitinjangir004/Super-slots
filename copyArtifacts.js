const fs = require('fs');
const path = require('path');

const sourceFile = path.join(__dirname, 'artifacts/contracts/SuperSlot.sol/SuperSlot.json');
const destDir = path.join(__dirname, 'frontend/src/artifacts');

if (!fs.existsSync(destDir)){
    fs.mkdirSync(destDir, { recursive: true });
}

const destFile = path.join(destDir, 'SuperSlot.json');

fs.copyFileSync(sourceFile, destFile);

console.log('SuperSlot artifact copied to frontend');