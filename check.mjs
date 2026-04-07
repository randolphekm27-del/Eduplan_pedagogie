import fs from 'fs';
import path from 'path';

function checkFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  const badLines = [];
  lines.forEach((line, index) => {
    if (line.includes('\uFFFD')) {
      badLines.push({ line: index + 1, text: line.trim() });
    }
  });
  if (badLines.length > 0) {
    return badLines;
  }
  return null;
}

function walkDir(dir) {
  let results = {};
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      Object.assign(results, walkDir(filePath));
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      const bad = checkFile(filePath);
      if (bad) {
        results[filePath] = bad;
      }
    }
  });
  return results;
}

const res = walkDir('src');
fs.writeFileSync('bad_lines.json', JSON.stringify(res, null, 2));
console.log('Done!');
