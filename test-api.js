const GEMINI_API_KEY = "YOUR_API_KEY_HERE";
fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${GEMINI_API_KEY}`)
.then(res => res.json()).then(data => console.log(data.models?.map(m => m.name) || data)).catch(console.error);
