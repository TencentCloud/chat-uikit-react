const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Change directory to tuikit/examples/sample-chat
process.chdir(path.join('examples', 'sample-chat'));

// Change directory to src
process.chdir('src');
process.chdir('social-demo');
// Remove file
fs.unlinkSync('index.tsx');
process.chdir('intl');
// // Copy directory to ../
execSync('cp -r index.tsx ../');
