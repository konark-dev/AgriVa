const fs = require('fs');
const filepath = 'src/pages/auth/Onboarding.jsx';
let content = fs.readFileSync(filepath, 'utf8');
const lines = content.split('\n');

const replacement = `    const languages = [
      { id: 'hi', symbol: 'अ', label: 'हिंदी', sub: 'Hindi' },
      { id: 'en', symbol: 'A', label: 'English', sub: 'अंग्रेज़ी' },
      { id: 'pa', symbol: 'ਪੰ', label: 'ਪੰਜਾਬੀ', sub: 'Punjabi' },
      { id: 'mr', symbol: 'म', label: 'मराठी', sub: 'Marathi' },
      { id: 'gu', symbol: 'ગુ', label: 'ગુજરાતી', sub: 'Gujarati' },
      { id: 'bn', symbol: 'ব', label: 'বাংলা', sub: 'Bengali' },
      { id: 'te', symbol: 'తె', label: 'తెలుగు', sub: 'Telugu' },
      { id: 'ta', symbol: 'த', label: 'தமிழ்', sub: 'Tamil' },
    ];

    return (
      <div className={\`flex flex-col min-h-screen \${bgMain} font-sans\`}>
        <div className="flex items-center justify-between p-4 bg-white/70 border-b border-slate-200">
          <div className="flex items-center space-x-2">
            <Tractor className={\`w-6 h-6 \${textGreen}\`} />
            <h1 className="text-xl font-bold text-slate-800">KisanSetu <span className="text-xs font-normal text-slate-500">| किसान सेतु</span></h1>
          </div>
          <button 
            onClick={handleToggleNarration}
            className={\`px-4 py-1.5 rounded-full \${isNarrating ? 'bg-amber-600' : accentOrange} text-white font-medium text-xs flex items-center shadow-sm transition\`}
          >
            {isNarrating ? <VolumeX className="w-3.5 h-3.5 mr-1" /> : <Volume2 className="w-3.5 h-3.5 mr-1" />}
            {isNarrating ? 'रोकें / Stop' : 'बोल कर सुनें'}
          </button>
        </div>`;

lines.splice(323, 26, replacement);

let newContent = lines.join('\n');
// We need to replace the specific corrupted strings:
newContent = newContent.replace('à¤…à¤ªà¤¨à¥€ à¤­à¤¾à¤·à¤¾ à¤šà¥ à¤¨à¥‡à¤‚', 'अपनी भाषा चुनें');
newContent = newContent.replace('A/à¤…', 'A/अ');

fs.writeFileSync(filepath, newContent, 'utf8');
console.log('Done!');
