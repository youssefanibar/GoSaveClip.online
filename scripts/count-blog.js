const fs = require('fs');

function extractContent(filePath) {
  const file = fs.readFileSync(filePath, 'utf8');
  const startMarker = 'content: `';
  const startIndex = file.indexOf(startMarker);
  if (startIndex === -1) return 0;
  const contentStart = startIndex + startMarker.length;
  const endMarker = '`.trim()';
  const endIndex = file.lastIndexOf(endMarker);
  const content = file.substring(contentStart, endIndex !== -1 ? endIndex : file.length);
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  return { words, content };
}

const files = process.argv.slice(2);
for (const f of files) {
  const { words } = extractContent(f);
  console.log(`${f}: ${words} words`);
}
