import os

filepath = 'src/pages/auth/Onboarding.jsx'
with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
    content = f.read()

replacements = {
    "symbol: 'à¤…', label: 'à¤¹à¤¿à¤‚à¤¦à¥€'": "symbol: 'अ', label: 'हिंदी'",
    "sub: 'à¤…à¤‚à¤—à¥ à¤°à¥‡à¤œà¤¼à¥€'": "sub: 'अंग्रेज़ी'",
    "symbol: 'à©³', label: 'à¨ªà©°à¨œà¨¾à¨¬à©€'": "symbol: 'ਪੰ', label: 'ਪੰਜਾਬੀ'",
    "symbol: 'à¤®', label: 'à¤®à¤°à¤¾à¤ à¥€'": "symbol: 'म', label: 'मराठी'",
    "symbol: 'àª—', label: 'àª—à« àªœàª°àª¾àª¤à«€'": "symbol: 'ગુ', label: 'ગુજરાતી'",
    "symbol: 'à¦•', label: 'à¦¬à¦¾à¦‚à¦²à¦¾'": "symbol: 'ব', label: 'বাংলা'",
    "symbol: 'à°¤à±†', label: 'à°¤à±†à°²à± à°—à± '": "symbol: 'తె', label: 'తెలుగు'",
    "symbol: 'à®¤', label: 'à®¤à®®à®¿à®´à¯ '": "symbol: 'த', label: 'தமிழ்'",
    "KisanSetu <span className=\"text-xs font-normal text-slate-500\">| à¤•à¤¿à¤¸à¤¾à¤¨ à¤¸à¥‡à¤¤à¥ </span>": "KisanSetu <span className=\"text-xs font-normal text-slate-500\">| किसान सेतु</span>",
    "à¤°à¥‹à¤•à¥‡à¤‚ / Stop": "रोकें / Stop",
    "à¤¬à¥‹à¤² à¤•à¤° à¤¸à¥ à¤¨à¥‡à¤‚": "बोल कर सुनें",
    "à¤…à¤ªà¤¨à¥€ à¤­à¤¾à¤·à¤¾ à¤šà¥ à¤¨à¥‡à¤‚": "अपनी भाषा चुनें",
    "A/à¤…": "A/अ"
}

for old, new in replacements.items():
    content = content.replace(old, new)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print('Fixed encoding issues in Onboarding!')
