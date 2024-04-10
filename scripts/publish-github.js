const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Change directory to tuikit/examples/sample-chat
process.chdir(path.join('examples', 'sample-chat'));

// Remove .env file
fs.unlinkSync('.env');

// Remove package.json
fs.unlinkSync('package.json');

// Rename package-github.json to package.json
fs.renameSync('package-github.json', 'package.json');

// Change directory to src
process.chdir('src');

// Remove demo directory
fs.rmdirSync('demo', { recursive: true });

// Rename 'components' directory to 'demo'
fs.renameSync('components', 'demo');

// Remove social-demo to demo
fs.rmdirSync('social-demo', { recursive: true });

// Change directory to live-demo
process.chdir('live-demo');

// Remove live-demo.tsx file
fs.unlinkSync('live-demo.tsx');

// Change directory back to src
process.chdir('../');

// Copy live-demo directory to ../../live-chat/src
execSync('cp -r live-demo ../../live-chat/src');

// Remove live-demo directory
fs.rmdirSync('live-demo', { recursive: true });

// Remove bot-demo directory
fs.rmdirSync('bot-demo', { recursive: true });

// Change directory to debug
process.chdir('debug');

// Replace 20000737 with 0 in GenerateTestUserSig.js
fs.writeFileSync('GenerateTestUserSig.js', fs.readFileSync('GenerateTestUserSig.js', 'utf8').replace(/20000737/g, '0'));

// Change directory back to src
process.chdir('../');

// Change directory to ../../live-chat/src/debug
process.chdir(path.join('../', '../', 'live-chat', 'src', 'debug'));

// Replace 20000737 with 0 in GenerateTestUserSig.js
fs.writeFileSync('GenerateTestUserSig.js', fs.readFileSync('GenerateTestUserSig.js', 'utf8').replace(/20000737/g, '0'));