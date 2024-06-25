const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Change directory to tuikit/examples/sample-chat
process.chdir(path.join('examples', 'sample-chat'));

// Change directory to src
process.chdir('src');
process.chdir('demo');
// Remove file
fs.unlinkSync('SampleChat.tsx');
// Rename index-intl.tsx to index
fs.renameSync('SampleChat-experience.tsx', 'SampleChat.tsx');
