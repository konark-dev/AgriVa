/**
 * aiService.js
 * 
 * Production-ready interaction with Google Gemini Generative AI API via REST.
 * Supports multi-model fallback (gemini-3.5-flash, gemini-3.5-flash-lite, gemini-3.6-flash),
 * agricultural domain grounding, bilingual voice parsing, and voice narration.
 */

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "YOUR_API_KEY_HERE";
const FALLBACK_MODELS = [
  'gemini-3.5-flash',
  'gemini-3.5-flash-lite',
  'gemini-3.6-flash',
  'gemini-flash-latest'
];

/**
 * Generic Gemini API caller with automatic model fallback
 */
async function callGemini(contents, generationConfig = {}) {
  if (!GEMINI_API_KEY) {
    throw new Error("Missing Gemini API Key. Please provide VITE_GEMINI_API_KEY.");
  }

  let lastError = null;

  for (const model of FALLBACK_MODELS) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`;
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents,
          generationConfig: {
            temperature: 0.3,
            maxOutputTokens: 250,
            ...generationConfig
          }
        })
      });

      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        console.warn(`[Gemini ${model}] failed with status ${response.status}:`, errJson.error?.message);
        lastError = new Error(errJson.error?.message || `HTTP ${response.status}`);
        continue; // Try next model
      }

      const data = await response.json();
      if (data.candidates && data.candidates.length > 0) {
        const text = data.candidates[0].content?.parts?.[0]?.text;
        if (text) return text.trim();
      }
    } catch (err) {
      console.warn(`[Gemini ${model}] network exception:`, err.message);
      lastError = err;
    }
  }

  throw lastError || new Error("All Gemini model endpoints failed.");
}

/**
 * Conversational agricultural assistant response
 */
export const askGemini = async (query, contextData = {}) => {
  const isHindi = contextData.language === 'hi';

  const contextString = `
You are the official AI Assistant for "AgriVa" (एग्रीवा), an Indian digital agricultural marketplace.
Audience: Indian farmers, FPOs, traders, transporters, and mandi operators.
Tone: Respectful, very concise (1-2 sentences maximum), helpful, and direct.

CRITICAL INSTRUCTIONS:
1. ONLY answer questions related to agriculture, AgriVa, the user's platform data (bids, listings, loans, etc.), or supply chain. If the user asks an unrelated question (e.g. general knowledge, politics, coding), politely refuse and state you can only help with AgriVa.
2. If the user asks about their bids, orders, listings, or market prices, ALWAYS use the data provided in the "Screen Context" JSON below to give a specific, accurate answer. Do not hallucinate or give incomplete answers.

Current User Context:
- Role: ${contextData.role || 'farmer'}
- Name: ${contextData.name || 'User'}
- Preferred Language: ${isHindi ? 'Hindi' : 'English'}
- Screen Context (LIVE APP DATA): ${JSON.stringify(contextData.screenData || {})}

Always answer in ${isHindi ? 'simple conversational Hindi (Devanagari script)' : 'clear English'}. If user asks in Hindi, answer in Hindi.
`;

  const contents = [
    {
      role: "user",
      parts: [
        { text: contextString },
        { text: `User Query: ${query}` }
      ]
    }
  ];

  return await callGemini(contents);
};

/**
 * Parse spoken input into structured registration / profile fields
 */
export const parseVoiceToFields = async (voiceTranscript, targetRole = 'farmer') => {
  const prompt = `
Extract structured user profile fields from this spoken Indian audio transcript.
Target Role: ${targetRole}
Spoken text: "${voiceTranscript}"

Respond ONLY with a valid JSON object without markdown formatting. Format:
{
  "name": string or null,
  "district": string or null,
  "state": string or null,
  "village": string or null,
  "crop": string or null,
  "quantity": number or null,
  "aadhaar": string or null,
  "vehicleReg": string or null
}
`;

  try {
    const raw = await callGemini([
      { role: "user", parts: [{ text: prompt }] }
    ], { temperature: 0.1 });

    // Clean JSON response
    const cleanedJson = raw.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleanedJson);
  } catch (e) {
    console.warn("parseVoiceToFields fallback to simple regex:", e.message);
    return { name: voiceTranscript.slice(0, 40) };
  }
};

/**
 * Generates natural narration text for speech synthesis
 */
export const narrateScreen = (stepName, language = 'hi') => {
  const narrations = {
    hi: {
      language: '\u090F\u0917\u094D\u0930\u0940\u0935\u093E \u092E\u0947\u0902 \u0906\u092A\u0915\u093E \u0938\u094D\u0935\u093E\u0917\u0924 \u0939\u0948\u0964 \u0915\u0943\u092A\u092F\u093E \u0905\u092A\u0928\u0940 \u092D\u093E\u0937\u093E \u091A\u0941\u0928\u0947\u0902\u0964',
      phone: '\u0938\u0924\u094D\u092F\u093E\u092A\u0928 \u0915\u0947 \u0932\u093F\u090F \u0905\u092A\u0928\u093E \u0926\u0938 \u0905\u0902\u0915\u094b\u0902 \u0915\u093E \u092E\u094B\u092C\u093E\u0907\u0932 \u0928\u0902\u092C\u0930 \u0926\u0930\u094D\u091C \u0915\u0930\u0947\u0902\u0964',
      otp: '\u091B\u0939 \u0905\u0902\u0915\u094b\u0902 \u0915\u093E \u0913 \u091F\u0940 \u092A\u0940 \u0926\u0930\u094D\u091C \u0915\u0930\u0947\u0902\u0964',
      role: '\u0905\u092A\u0928\u0940 \u092D\u0942\u092E\u093F\u0915\u093E \u091A\u0941\u0928\u0947\u0902\u0964',
      profile: '\u0905\u092A\u0928\u0940 \u092A\u094D\u0930\u094B\u092B\u093E\u0907\u0932 \u092A\u0942\u0930\u0940 \u0915\u0930\u0947\u0902, \u092F\u093E \u092E\u093E\u0907\u0915 \u092E\u0947\u0902 \u092C\u094B\u0932\u0947\u0902\u0964'
    },
    en: {
      language: "Welcome to AgriVa. Please choose your preferred language to continue.",
      phone: "Please enter your 10-digit mobile number for secure verification.",
      otp: "Enter the 6-digit OTP received via SMS or use demo verification.",
      role: "Select your role in the marketplace: Farmer, FPO, Buyer, or Logistics Partner.",
      profile: "Please complete your registration profile or speak into the microphone."
    }
  };

  const lang = language === 'hi' ? 'hi' : 'en';
  return narrations[lang][stepName] || narrations[lang]['profile'];
};

  /**
 * Parse spoken input into an app navigation route
 */
export const parseVoiceNavigation = async (voiceTranscript) => {
  const prompt = `
Map the following spoken text (in Hindi/English) to exactly ONE of these internal app routes based on the user's intent:
- 'warehouse' (user wants space, godown, storage, rent, rakhne ki jagah)
- 'prices' (user wants market prices, bhav, rate, mandi)
- 'feed' (user wants to see buyer requirements, demand, mang, kharidar)
- 'add_listing' (user wants to sell crop, fasal bechni hai, add)
- 'sales' (user wants to see active sales, orders, payment, khata)
- 'dashboard' (default/home/profile/back)

Spoken text: "${voiceTranscript}"

Respond ONLY with the exact route string in lowercase without quotes or markdown.`;

  try {
    const raw = await callGemini([
      { role: "user", parts: [{ text: prompt }] }
    ], { temperature: 0.1 });
    const route = raw.trim().toLowerCase();
    const validRoutes = ['warehouse', 'prices', 'feed', 'add_listing', 'sales', 'dashboard'];
    
    // Check if the exact response is in valid routes or if the AI output contains one
    for (const vr of validRoutes) {
      if (route.includes(vr)) return vr;
    }
    return 'dashboard';
  } catch (e) {
    console.warn("parseVoiceNavigation error:", e);
    return 'dashboard';
  }
};
