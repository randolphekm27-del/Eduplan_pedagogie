import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();
const TEXT_EXTS = new Set(['.ts', '.tsx', '.js', '.jsx', '.css', '.html', '.md', '.sql', '.json']);
const IGNORE_DIRS = new Set(['node_modules', 'dist', '.git']);
const suspiciousPatterns = [
  /Ã[\u0080-\u00BF\w]/g,
  /Â[\u0080-\u00BF\w]/g,
  /â[\u0080-\u00BF\w]/g,
  /�/g
];

const corrected = [];
const scanned = [];

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (IGNORE_DIRS.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(full);
      continue;
    }
    if (!TEXT_EXTS.has(path.extname(entry.name))) continue;
    scanFile(full);
  }
}

function countSuspicious(text) {
  return suspiciousPatterns.reduce((sum, pattern) => sum + (text.match(pattern) || []).length, 0);
}

function decodeBuffer(buffer) {
  if (buffer.length >= 3 && buffer[0] === 0xef && buffer[1] === 0xbb && buffer[2] === 0xbf) {
    return { text: new TextDecoder('utf-8').decode(buffer.slice(3)), encoding: 'utf8-bom', utf8Valid: true };
  }
  if (buffer.length >= 2 && buffer[0] === 0xff && buffer[1] === 0xfe) {
    return { text: new TextDecoder('utf-16le').decode(buffer.slice(2)), encoding: 'utf16le', utf8Valid: false };
  }
  if (buffer.length >= 2 && buffer[0] === 0xfe && buffer[1] === 0xff) {
    const swapped = Buffer.alloc(buffer.length - 2);
    for (let i = 2; i < buffer.length; i += 2) {
      swapped[i - 2] = buffer[i + 1];
      swapped[i - 1] = buffer[i];
    }
    return { text: new TextDecoder('utf-16le').decode(swapped), encoding: 'utf16be', utf8Valid: false };
  }

  try {
    return { text: new TextDecoder('utf-8', { fatal: true }).decode(buffer), encoding: 'utf8', utf8Valid: true };
  } catch {
    return { text: buffer.toString('latin1'), encoding: 'ansi/latin1', utf8Valid: false };
  }
}

function repairMojibake(text) {
  return Buffer.from(text, 'latin1').toString('utf8');
}

function scanFile(file) {
  const buffer = fs.readFileSync(file);
  const decoded = decodeBuffer(buffer);
  const beforeScore = countSuspicious(decoded.text);
  let nextText = decoded.text;
  let action = null;

  if (decoded.encoding === 'utf8-bom' || decoded.encoding.startsWith('utf16')) {
    action = decoded.encoding + ' -> utf8';
  }

  if (beforeScore > 0) {
    const repaired = repairMojibake(decoded.text);
    const afterScore = countSuspicious(repaired);
    if (afterScore < beforeScore) {
      nextText = repaired;
      action = action ? action + ' + mojibake-fix' : 'mojibake-fix';
    }
  }

  scanned.push({ file, encoding: decoded.encoding, suspicious: beforeScore });

  if (action) {
    fs.writeFileSync(file, nextText, 'utf8');
    corrected.push({ file, from: decoded.encoding, action, suspiciousBefore: beforeScore, suspiciousAfter: countSuspicious(nextText) });
  }
}

walk(ROOT);

console.log('CORRECTED');
for (const item of corrected) {
  console.log(`${item.file} | from=${item.from} | action=${item.action} | suspicious ${item.suspiciousBefore}->${item.suspiciousAfter}`);
}
console.log('SUSPICIOUS_REMAINING');
for (const item of scanned.filter((entry) => entry.suspicious > 0 && !corrected.find((c) => c.file === entry.file))) {
  console.log(`${item.file} | encoding=${item.encoding} | suspicious=${item.suspicious}`);
}
