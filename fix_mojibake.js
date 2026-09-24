const fs = require('fs');
const path = require('path');

function isMojibakeChar(ch) {
  const code = ch.charCodeAt(0);
  // Latin-1 range (0x00-0xFF) but excluding typical ASCII printable (0x20-0x7E)
  return code >= 0x80 && code <= 0xFF;
}

function decodeMojibake(seq) {
  // Convert each char to its byte value (0-255) and decode as UTF-8
  const bytes = [];
  for (let i = 0; i < seq.length; i++) {
    bytes.push(seq.charCodeAt(i));
  }
  try {
    return Buffer.from(bytes).toString('utf8');
  } catch (e) {
    return seq; // fallback
  }
}

function fixContent(content) {
  // Replace each contiguous sequence of mojibake chars
  return content.replace(/([\u0080-\u00FF]{2,})/g, (match) => {
    const decoded = decodeMojibake(match);
    // If decoding yields replacement characters, keep original
    if (decoded.includes('�')) return match;
    return decoded;
  });
}

function processFile(filePath) {
  const raw = fs.readFileSync(filePath, 'utf8');
  const fixed = fixContent(raw);
  // Write back only if changed
  if (fixed !== raw) {
    fs.writeFileSync(filePath, fixed, 'utf8');
    console.log('Fixed', filePath);
  }
}

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (['node_modules', 'dist', '.git'].includes(entry.name)) continue;
      walk(full);
    } else if (full.endsWith('.jsx') || full.endsWith('.js')) {
      processFile(full);
    }
  }
}

const root = path.join(__dirname, 'src');
walk(root);
console.log('All done');
