const fs = require('fs');
const filepath = 'src/pages/auth/Onboarding.jsx';
let lines = fs.readFileSync(filepath, 'utf8').split('\n');

for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('Choose Your Language')) {
    // Replace the line right before it
    lines[i - 1] = '                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">अपनी भाषा चुनें</p>';
    break;
  }
}

fs.writeFileSync(filepath, lines.join('\n'), 'utf8');
console.log('Fixed header text!');
