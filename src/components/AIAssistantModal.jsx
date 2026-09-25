import React, { useState, useEffect, useRef } from 'react';
import { Bot, Sparkles, X, Send, Mic, MicOff, User, Loader2, Volume2, VolumeX } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { askGemini } from '../services/aiService';
import { initSpeechRecognition, speakText, stopSpeaking } from '../utils/speechUtils';

export default function AIAssistantModal() {
  const [isOpen, setIsOpen] = useState(false);
  const { currentUser, language, listings, mandiPrices, bids, deliveries, loans, requirements, offers, orders } = useApp();
  
  const [messages, setMessages] = useState([
    { 
      id: 1, 
      role: 'assistant', 
      text: language === 'hi' 
        ? "नमस्ते! मैं एग्रीवा AI सहायक हूँ। आज मैं आपकी क्या सहायता कर सकता हूँ?" 
        : "Namaste! I am your AgriVa AI Assistant. How can I help you today?" 
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [autoSpeakResponses, setAutoSpeakResponses] = useState(true);
  
  const recognitionRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Auto-scroll chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Setup speech recognition
  useEffect(() => {
    const handleResult = (transcript) => {
      setInputValue(transcript);
      handleSend(transcript, true); 
    };

    const handleError = (error) => {
      console.warn("Speech Error:", error);
      setIsListening(false);
    };

    const handleEnd = () => {
      setIsListening(false);
    };

    recognitionRef.current = initSpeechRecognition(
      handleResult, 
      handleError, 
      handleEnd, 
      language === 'hi' ? 'hi-IN' : 'en-IN'
    );
    
    return () => {
      stopSpeaking();
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch (e) {}
      }
    };
  }, [language]);

  const toggleListening = () => {
    if (isListening) {
      try { recognitionRef.current?.stop(); } catch (e) {}
      setIsListening(false);
    } else {
      stopSpeaking();
      setInputValue('');
      try {
        recognitionRef.current?.start();
        setIsListening(true);
      } catch (e) {
        console.warn("Could not start recognition:", e);
        setIsListening(false);
      }
    }
  };

  const handleSend = async (textToProcess = inputValue, isVoiceInitated = false) => {
    const query = textToProcess.trim();
    if (!query) return;

    // Add user message
    const userMsg = { id: Date.now(), role: 'user', text: query };
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsProcessing(true);
    stopSpeaking();

    const contextData = {
      role: currentUser.role,
      name: currentUser.name,
      language: language,
      screenData: {
        activeListingsCount: listings?.length || 0,
        mandiPricesSample: mandiPrices?.slice(0, 3).map(p => `${p.crop} at ${p.mandiName}: ₹${p.modalPrice}/kg`) || [],
        bidsData: bids?.slice(0, 5) || [],
        requirementsData: requirements?.slice(0, 5) || [],
        offersData: offers?.slice(0, 5) || [],
        loansData: loans?.slice(0, 3) || [],
        ordersData: orders?.slice(0, 3) || [],
        deliveriesData: deliveries?.slice(0, 3) || []
      }
    };

    try {
      const aiResponse = await askGemini(query, contextData);
      const assistantMsg = { id: Date.now() + 1, role: 'assistant', text: aiResponse };
      setMessages(prev => [...prev, assistantMsg]);
      
      if (isVoiceInitated || autoSpeakResponses) {
        speakText(aiResponse, language === 'hi' ? 'hi-IN' : 'en-IN');
      }
    } catch (error) {
      setMessages(prev => [...prev, { 
        id: Date.now() + 1, 
        role: 'assistant', 
        text: language === 'hi' 
          ? "क्षमा करें, AI सेवा से संपर्क नहीं हो पाया। " + (error.message || "")
          : "Sorry, I am having trouble connecting right now. " + (error.message || "")
      }]);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleQuickQuestion = (q) => {
    handleSend(q, true);
  };

  const handleClose = () => {
    stopSpeaking();
    if (isListening) {
      try { recognitionRef.current?.stop(); } catch (e) {}
    }
    setIsOpen(false);
  };

  const quickQuestions = language === 'hi' ? [
    "🌾 आज गेहूं और टमाटर का मंडी भाव क्या है?",
    "📝 नई फसल सूची (Listing) कैसे बनाएं?",
    "🏢 FPO और थोक खरीदार सत्यापन प्रक्रिया क्या है?",
    "🚚 निकटतम ट्रांसपोर्टर कैसे बुक करें?"
  ] : [
    "🌾 What are today's mandi prices for Wheat?",
    "📝 How do I create a crop listing?",
    "🏢 How does FPO & Bulk Buyer verification work?",
    "🚚 How do I assign logistics transport?"
  ];

  return (
    <>
      {/* Floating AI Helper Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="btn-touch absolute bottom-20 right-4 z-40 w-14 h-14 rounded-full bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-xl flex items-center justify-center ring-4 ring-emerald-400/30 hover:scale-105 transition-transform"
        aria-label="AI Assistant"
        title="AgriVa AI Assistant (Gemini Powered)"
      >
        <Bot className="w-7 h-7 animate-pulse" />
      </button>

      {/* AI Assistant Modal Panel */}
      {isOpen && (
        <div className="absolute inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white border border-slate-200 rounded-t-3xl sm:rounded-2xl w-full max-w-md h-[80vh] flex flex-col overflow-hidden shadow-2xl animate-in slide-in-from-bottom">
            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-emerald-700 to-teal-800 flex items-center justify-between text-white">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-amber-300" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm leading-tight">AgriVa AI • किसान सहायक</h3>
                  <p className="text-[10px] text-emerald-200 font-medium">Powered by Google Gemini & Web Voice</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setAutoSpeakResponses(prev => !prev)}
                  className={`p-1.5 rounded-full transition ${autoSpeakResponses ? 'bg-white/20 text-white' : 'text-emerald-200'}`}
                  title={autoSpeakResponses ? 'Auto voice ON' : 'Auto voice OFF'}
                >
                  {autoSpeakResponses ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                </button>
                <button
                  onClick={handleClose}
                  className="p-1 rounded-full hover:bg-white/20 transition-colors text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Quick Question Chips */}
            <div className="bg-white p-2.5 border-b border-slate-200 flex overflow-x-auto gap-2 no-scrollbar">
              {quickQuestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleQuickQuestion(q)}
                  className="px-3 py-1.5 rounded-full bg-white text-slate-600 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200 text-[11px] font-bold whitespace-nowrap border border-slate-200 transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>

            {/* Chat History */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] rounded-2xl p-3 flex space-x-2 ${
                    msg.role === 'user' 
                      ? 'bg-emerald-600 text-white rounded-tr-sm' 
                      : 'bg-slate-50 text-slate-700 border border-slate-200 text-slate-800 rounded-tl-sm'
                  }`}>
                    {msg.role === 'assistant' && <Bot className="w-4 h-4 mt-0.5 text-[#2E7D32] opacity-90 shrink-0" />}
                    <div className="flex-1">
                      <span className="leading-relaxed whitespace-pre-wrap">{msg.text}</span>
                      {msg.role === 'assistant' && (
                        <button
                          onClick={() => speakText(msg.text, language === 'hi' ? 'hi-IN' : 'en-IN')}
                          className="mt-1 flex items-center text-[10px] text-[#2E7D32] hover:underline"
                        >
                          <Volume2 className="w-3 h-3 mr-1" /> सुनें
                        </button>
                      )}
                    </div>
                    {msg.role === 'user' && <User className="w-4 h-4 mt-0.5 opacity-70 shrink-0" />}
                  </div>
                </div>
              ))}
              
              {isProcessing && (
                <div className="flex justify-start">
                  <div className="bg-slate-50 text-slate-700 border border-slate-200 rounded-2xl rounded-tl-sm p-3 flex items-center space-x-2">
                    <Loader2 className="w-4 h-4 text-[#2E7D32] animate-spin" />
                    <span className="text-slate-600">Gemini सोच रहा है... / Thinking...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-3 border-t border-slate-200 bg-white">
              <div className="flex items-center space-x-2">
                <button 
                  onClick={toggleListening}
                  className={`p-3 rounded-full shrink-0 transition-colors ${
                    isListening 
                      ? 'bg-rose-600 text-white animate-pulse ring-4 ring-rose-500/40' 
                      : 'bg-slate-50 text-slate-700 text-slate-600 hover:text-[#2E7D32] hover:bg-emerald-50'
                  }`}
                  title="Speak into microphone"
                >
                  {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                </button>
                
                <form 
                  onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                  className="flex-1 flex bg-slate-50 text-slate-700 rounded-2xl border border-slate-200 overflow-hidden focus-within:border-emerald-500 transition-colors"
                >
                  <input 
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder={isListening ? "Listening... बोलिए..." : (language === 'hi' ? "अपना प्रश्न पूछें या माइक दबाएं..." : "Type or speak your question...")}
                    className="flex-1 bg-transparent px-4 py-3 text-sm text-slate-800 font-medium focus:outline-none placeholder:text-slate-400"
                    disabled={isProcessing}
                  />
                  <button 
                    type="submit"
                    disabled={!inputValue.trim() || isProcessing}
                    className="px-4 text-[#2E7D32] disabled:opacity-30 disabled:hover:bg-transparent hover:bg-emerald-50 transition-colors"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
