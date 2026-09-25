import React, { useState } from 'react';
import { Mic, Loader2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { initSpeechRecognition } from '../utils/speechUtils';
import { parseVoiceNavigation } from '../services/aiService';

export default function GlobalVoiceNavigator({ setActiveTab, setShowAddModal }) {
  const { triggerToast, language, currentUser } = useApp();
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // If user is not a farmer, we might still show it but routes differ. 
  // Let's assume it mainly handles farmer intents for now.
  if (currentUser?.role !== 'farmer' && currentUser?.role !== 'fpo') return null;

  const handleVoiceCommand = () => {
    if (isListening || isProcessing) return;
    
    setIsListening(true);
    triggerToast("सुन रहे हैं... आपको कहाँ जाना है? (Listening...)", "AI Navigator", "info");

    const rec = initSpeechRecognition(
      async (transcript) => {
        setIsListening(false);
        setIsProcessing(true);
        triggerToast("रास्ता खोज रहे हैं... (Routing...)", "AI Navigator", "info");
        
        try {
          const route = await parseVoiceNavigation(transcript);
          setIsProcessing(false);
          
          if (route === 'warehouse') {
             // For farmer, switch context to warehouse view. Wait, does farmer have warehouse? 
             // We can map this to changing activeTab in FarmerDashboard, or we need to pass a callback.
             // Actually, if we just set activeTab to something FarmerDashboard understands, we can handle it.
             setActiveTab('warehouse_booking'); 
          } else if (route === 'add_listing') {
             setShowAddModal(true);
          } else {
             setActiveTab(route); // 'prices', 'feed', 'sales', 'crops'
          }
          triggerToast("नेविगेट किया गया! (Navigated!)", "Success", "success");
        } catch (e) {
          setIsProcessing(false);
          triggerToast("समझ नहीं आया, कृपया फिर से बोलें। (Could not understand)", "Error", "error");
        }
      },
      (err) => {
        console.warn("Voice Nav Error:", err);
        setIsListening(false);
      },
      () => setIsListening(false),
      language === 'hi' ? 'hi-IN' : 'en-IN'
    );

    if (rec) {
      try { rec.start(); } catch (e) { console.warn(e); }
    }
  };

  return (
    <button
      onClick={handleVoiceCommand}
      className={`fixed bottom-20 left-4 z-40 w-16 h-16 rounded-full shadow-2xl flex flex-col items-center justify-center ring-4 ring-amber-200 transition-transform ${
        isListening ? 'bg-amber-500 scale-110 animate-pulse text-white' : 
        isProcessing ? 'bg-emerald-600 scale-100 text-white' : 
        'bg-amber-400 text-amber-800 hover:scale-105'
      }`}
      aria-label="Voice Navigator"
    >
      {isProcessing ? (
        <Loader2 className="w-8 h-8 animate-spin" />
      ) : (
        <>
          <Mic className="w-7 h-7 mb-0.5" />
          <span className="text-[10px] font-black tracking-wider leading-none">बोलें</span>
        </>
      )}
    </button>
  );
}
