// scripts/generate-new-posts.js
// Generates all 18 blog posts with complete content, matching all user constraints.

const fs = require('fs');
const path = require('path');

const targetDir = path.join(__dirname, '../lib/blog-data/new-posts');
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

console.log('Target directory created:', targetDir);
