const fs = require('fs');

function cleanLine(line) {
  // Remove Unicode replacement chars
  let cleaned = line.replace(/\uFFFD/g, '');
  
  // Remove control characters (except \n \r \t)
  cleaned = cleaned.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');
  
  // Remove remaining mojibake sequences (Latin-1 upper half chars that aren't valid Hindi)
  // These are chars like à (U+00E0), ¤ (U+00A4), ¥ (U+00A5), etc.
  cleaned = cleaned.replace(/[\u00C0-\u00FF][\u0080-\u00BF]{0,3}/g, '');
  
  // Clean up resulting double/triple spaces
  cleaned = cleaned.replace(/  +/g, ' ');
  
  // Fix broken JSX: empty quotes
  cleaned = cleaned.replace(/placeholder=""/g, 'placeholder="Enter here"');
  cleaned = cleaned.replace(/> *</g, '><');
  
  return cleaned;
}

function fixFile(filepath) {
  console.log(`Processing ${filepath}...`);
  const content = fs.readFileSync(filepath, 'utf8');
  const lines = content.split('\n');
  
  const fixedLines = lines.map((line, idx) => {
    // Check if line has any garbled content
    if (line.match(/[\u00C0-\u00FF][\u0080-\u00BF]/) || line.includes('\uFFFD') || line.match(/[\x00-\x08\x0E-\x1F]/)) {
      return cleanLine(line);
    }
    return line;
  });
  
  fs.writeFileSync(filepath, fixedLines.join('\n'), 'utf8');
  console.log(`  Written ${filepath}`);
}

// Fix both files
fixFile('src/pages/auth/Onboarding.jsx');
fixFile('src/pages/farmer/RequirementsFeed.jsx');
console.log('Done! Running build test...');
