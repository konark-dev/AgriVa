/**
 * speechUtils.js
 * 
 * Web Speech API implementation for speech-to-text (STT) and text-to-speech (TTS),
 * optimized for Indian linguistic contexts (Hindi & English).
 */

export const isSpeechRecognitionSupported = () => {
  return typeof window !== 'undefined' && Boolean(window.SpeechRecognition || window.webkitSpeechRecognition);
};

export const isSpeechSynthesisSupported = () => {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
};

// --- Speech to Text (Listening) ---

let activeRecognition = null;

export const initSpeechRecognition = (onResult, onError, onEnd, lang = 'hi-IN', continuous = true) => {
  if (!isSpeechRecognitionSupported()) {
    console.warn("Speech Recognition API not supported in this browser.");
    if (onError) onError("Browser microphone not supported. Please type your input.");
    return null;
  }

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();
  
  recognition.continuous = continuous;
  recognition.lang = lang; // 'hi-IN' or 'en-IN'
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
    let finalTranscript = '';
    for (let i = event.resultIndex; i < event.results.length; ++i) {
      if (event.results[i].isFinal) {
        finalTranscript += event.results[i][0].transcript;
      }
    }
    if (finalTranscript.trim() !== '') {
      if (onResult) onResult(finalTranscript.trim());
      // Auto-stop after getting a final result to behave like a single command
      if (continuous) recognition.stop();
    }
  };

  recognition.onerror = (event) => {
    console.warn("Speech recognition error:", event.error);
    if (onError) onError(event.error);
  };

  recognition.onend = () => {
    if (onEnd) onEnd();
  };

  activeRecognition = recognition;
  return recognition;
};

export const startListening = (recognitionInstance) => {
  const rec = recognitionInstance || activeRecognition;
  if (rec) {
    try {
      rec.start();
    } catch (e) {
      console.warn("Recognition start exception:", e.message);
    }
  }
};

export const stopListening = (recognitionInstance) => {
  const rec = recognitionInstance || activeRecognition;
  if (rec) {
    try {
      rec.stop();
    } catch (e) {
      // already stopped
    }
  }
};


// --- Text to Speech (Speaking) ---

export const speakText = (text, lang = 'hi-IN', onEnd) => {
  if (!isSpeechSynthesisSupported()) {
    console.warn("Speech Synthesis API not supported.");
    if (onEnd) onEnd();
    return;
  }

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  if (!text) {
    if (onEnd) onEnd();
    return;
  }

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang;
  utterance.rate = 0.95; // Slightly slower for clear rural / regional comprehension
  utterance.pitch = 1.0;

  // Try to pick Hindi / Indian voice if available
  const voices = window.speechSynthesis.getVoices();
  if (voices && voices.length > 0) {
    const matchingVoice = voices.find(v => 
      lang.startsWith('hi') ? (v.lang.includes('hi') || v.name.toLowerCase().includes('hindi')) :
      (v.lang.includes('en-IN') || v.name.toLowerCase().includes('india'))
    );
    if (matchingVoice) {
      utterance.voice = matchingVoice;
    }
  }

  utterance.onend = () => {
    if (onEnd) onEnd();
  };

  utterance.onerror = (e) => {
    console.warn("Speech synthesis error:", e);
    if (onEnd) onEnd();
  };

  window.speechSynthesis.speak(utterance);
};

export const stopSpeaking = () => {
  if (isSpeechSynthesisSupported()) {
    window.speechSynthesis.cancel();
  }
};
