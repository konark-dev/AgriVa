const fs = require('fs');
const path = require('path');

function decodeMojibake(seq) {
  const bytes = [];
  for (let i = 0; i < seq.length; i++) {
    bytes.push(seq.charCodeAt(i));
  }
  try {
    return Buffer.from(bytes).toString('utf8');
  } catch (e) {
    return seq;
  }
}

function fixContent(content) {
  return content.replace(/([\u0080-\u00FF]{2,})/g, (match) => {
    const decoded = decodeMojibake(match);
    if (decoded.includes('�')) return match;
    return decoded;
  });
}

function processFile(filePath) {
  const raw = fs.readFileSync(filePath, 'utf8');
  const fixed = fixContent(raw);
  if (fixed !== raw) {
    fs.writeFileSync(filePath, fixed, 'utf8');
    console.log('Fixed', filePath);
  }
}

function walk(dir) {
  const entries = fs.readdirSync(dir, {withFileTypes:true});
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (['node_modules','dist','.git'].includes(entry.name)) continue;
      walk(full);
    } else if (full.endsWith('.jsx')||full.endsWith('.js')) {
      processFile(full);
    }
  }
}

walk(path.join(__dirname,'src'));
console.log('All files processed');
