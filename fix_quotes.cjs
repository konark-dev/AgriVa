const fs = require('fs');

function fixBrokenQuotesAndText(filepath) {
  console.log(`Fixing ${filepath}...`);
  let content = fs.readFileSync(filepath, 'utf8');
  
  // Fix specific broken patterns where garbled text left stray quotes inside JSX attributes
  // Pattern: attribute="...broken..."  where broken text contains literal " chars
  // Strategy: find all placeholder/title/label attributes and clean their values
  
  const lines = content.split('\n');
  const fixed = [];
  
  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    
    // Fix: stray Hindi chars mixed with leftover garbled text in attributes
    // Replace any placeholder with broken quotes
    if (line.includes('placeholder="') && (line.match(/"/g) || []).length > 3) {
      // More than expected quotes - fix by replacing the placeholder value entirely
      line = line.replace(/placeholder="[^"]*"[^"]*"/g, (match) => {
        // Extract what seems like the intended text, strip it, replace with clean text
        if (match.includes('दा') || match.includes('रम')) return 'placeholder="उदा. रमेश कुमार"';
        if (match.includes('HR') || match.includes('DL')) return 'placeholder="HR-1020180045612"';
        if (match.includes('RC')) return 'placeholder="HR-10-AB-1234"';
        if (match.includes('GSTIN')) return 'placeholder="07AAAAA0000A1Z5"';
        if (match.includes('Ton') || match.includes('ton')) return 'placeholder="Pickup (2.5 Ton)"';
        if (match.includes('APMC') || match.includes('मड')) return 'placeholder="Azadpur APMC Mandi"';
        if (match.includes('Lab') || match.includes('लब')) return 'placeholder="AgriSort Quality Labs"';
        return 'placeholder="Enter here"';
      });
    }
    
    // Also fix title/label attrs with broken quotes
    if (line.includes('title="') && (line.match(/"/g) || []).length > 4) {
      line = line.replace(/title="[^"]*"[^"]*"/g, 'title="Enter details"');
    }
    
    // Remove any remaining standalone Devanagari combining marks that could break syntax
    // (chars like ु ू ो ौ etc. appearing right after a " can break JSX parsing)
    line = line.replace(/"([\u0900-\u097F])/g, (match, char) => {
      // If a Devanagari char appears right after a closing quote, it's broken
      // Check if the previous context was a stray quote from garbled text
      return '"' + char; // keep it - it might be fine
    });
    
    fixed.push(line);
  }
  
  let result = fixed.join('\n');
  
  // Final safety pass: fix any remaining broken placeholder patterns
  result = result.replace(/placeholder="0दा\. रम!श "ुमार"/g, 'placeholder="उदा. रमेश कुमार"');
  result = result.replace(/placeholder="[^"]*"[^"]*"(?=\s|\/|>)/g, (match) => {
    return 'placeholder="Enter here"';
  });
  
  fs.writeFileSync(filepath, result, 'utf8');
  console.log(`  Done: ${filepath}`);
}

fixBrokenQuotesAndText('src/pages/auth/Onboarding.jsx');
fixBrokenQuotesAndText('src/pages/farmer/RequirementsFeed.jsx');
console.log('All fixed!');
