// Force deployment script
const fs = require('fs');
const path = require('path');

// Update package.json to trigger a new deployment
const packagePath = path.join(__dirname, 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));

// Add a timestamp to force Vercel to rebuild
packageJson.deployTimestamp = new Date().toISOString();

fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2));

console.log('Package.json updated to force deployment');
