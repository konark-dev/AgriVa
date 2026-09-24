import React, { useState } from 'react';
import { ArrowLeft, Mic, MapPin, Calendar, CheckCircle, Volume2, Play, Lock, BrainCircuit } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { speakText, initSpeechRecognition } from '../../utils/speechUtils';
import AIDemandForecasting from './AIDemandForecasting';

export default function PostRequirementForm({ onBack }) {
  const [selectedCrop, setSelectedCrop] = useState('Wheat');
  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState('quintal');
  const [indicativePrice, setIndicativePrice] = useState('');
  const [deliveryLocation, setDeliveryLocation] = useState('');
  const [urgency, setUrgency] = useState('7days');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showAI, setShowAI] = useState(false);
  
  // Use mock useApp context, assuming postRequirement is available
  const { postRequirement = async () => {} } = useApp() || {};

  const handleSubmit = async () => {
    if (!quantity) return;
    setLoading(true);
    const daysMap = { urgent: 0, '3days': 3, '7days': 7 };
    const days = daysMap[urgency] || 7;
    await postRequirement({
      crop: selectedCrop,
      unit,
      targetQty: Number(quantity),
      indicativePrice: indicativePrice ? Number(indicativePrice) : null,
      deliveryLocation,
      urgency,
      neededByDate: new Date(Date.now() + days * 86400000).toISOString().split('T')[0]
    });
    setLoading(false);
    setSubmitted(true);
  };

  const crops = [
    { id: 'Wheat', emoji: '🌾', hi: 'गेहूं', en: 'Wheat' },
    { id: 'Rice', emoji: '🍚', hi: 'चावल', en: 'Rice' },
    { id: 'Cotton', emoji: '🌿', hi: 'कपास', en: 'Cotton' },
    { id: 'Tomato', emoji: '🍅', hi: 'टमाटर', en: 'Tomato' },
    { id: 'Soybean', emoji: '🫘', hi: 'सोयाबीन', en: 'Soybean' },
    { id: 'Gram', emoji: '🫛', hi: 'चना', en: 'Gram' },
  ];

  if (showAI) {
    return <AIDemandForecasting onBack={() => setShowAI(false)} />;
  }

  return (
    <div className="min-h-screen bg-[#f9f8f3] pb-24 font-sans text-slate-800">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-white shadow-sm sticky top-0 z-10">
        <button onClick={onBack} className="p-2">
          <ArrowLeft className="w-6 h-6 text-slate-700" />
        </button>
        <div className="text-center">
          <h1 className="font-bold text-lg text-slate-900">AgriVa • मांग</h1>
          <p className="text-xs text-slate-500">Post Requirement</p>
        </div>
        <button onClick={() => speakText("यह मांग फॉर्म है। आप यहाँ अपनी फसल की जरूरत दर्ज कर सकते हैं।")} className="flex items-center gap-1 bg-orange-100 text-orange-700 px-3 py-1.5 rounded-full text-sm font-medium">
          <Volume2 className="w-4 h-4" />
          सुनें
        </button>
      </div>

      <div className="px-4 pt-4 max-w-2xl mx-auto">
        {/* Success Banner */}
        {submitted && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4 flex items-start gap-2">
            <CheckCircle className="w-5 h-5 text-[#1B5E20] shrink-0 mt-0.5" />
            <div className="text-sm text-green-900 leading-tight">
              <span className="font-semibold block mb-1">✅ आपकी मांग दर्ज हुई!</span>
              आपके आसपास के 12 किसानों को सूचित किया गया<br/>
              Notified 12 nearby farmers
            </div>
          </div>
        )}

        {/* Intro */}
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">आपको क्या चाहिए?</h2>
            <p className="text-sm font-medium text-slate-700 mb-1">What do you need?</p>
            <p className="text-[11px] text-slate-500">सीधे सत्यापित किसानों से खरीदें</p>
          </div>
          <button 
            onClick={() => setShowAI(true)}
            className="flex items-center gap-1.5 bg-[#F1F8EC] border border-[#C5E1A5] text-[#1B5E20] px-3 py-2 rounded-xl shadow-sm hover:bg-[#E8F5E9] transition"
          >
            <BrainCircuit className="w-4 h-4" />
            <div className="text-left">
              <span className="block text-[10px] font-bold leading-tight">AI Demand</span>
              <span className="block text-[10px] font-bold leading-tight">Forecasting</span>
            </div>
          </button>
        </div>

        {/* §1 Crop Selection */}
        <div className="mb-6 relative">
          <div className="absolute -top-3 right-0 bg-green-100 text-[#1B5E20] text-xs font-bold px-2 py-0.5 rounded-md">
            आवश्यक
          </div>
          <h3 className="font-bold text-slate-800 mb-3 text-sm">1. फसल चुनें / Select Crop</h3>
          <div className="grid grid-cols-3 gap-3">
            {crops.map((c) => {
              const isSelected = selectedCrop === c.id;
              return (
                <button
                  key={c.id}
                  onClick={() => setSelectedCrop(c.id)}
                  className={`relative flex flex-col items-center justify-center p-3 rounded-xl bg-white shadow-sm transition-all ${
                    isSelected ? 'border-2 border-[#1B5E20]' : 'border border-slate-200'
                  }`}
                >
                  {isSelected && (
                    <div className="absolute -top-1.5 -right-1.5 bg-[#1B5E20] rounded-full p-0.5 shadow-sm">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                  )}
                  <span className="text-3xl mb-1 block">{c.emoji}</span>
                  <span className="font-bold text-slate-800 text-sm leading-tight">{c.hi}</span>
                  <span className="text-[10px] text-slate-500">{c.en}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* §2 Quantity */}
        <div className="mb-6 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-3 text-sm">2. आवश्यक मात्रा / Quantity</h3>
          <div className="flex items-center gap-2 mb-3">
            <div className="relative flex-1">
              <input
                type="number"
                placeholder="0"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full text-2xl font-bold border-b-2 border-slate-300 focus:border-[#1B5E20] outline-none py-2 pr-12 text-slate-900 bg-transparent"
              />
              <span className="absolute right-0 top-1/2 -translate-y-1/2 text-slate-500 font-medium">Qty</span>
            </div>
            <button onClick={() => {
              initSpeechRecognition((t) => {
                const match = t.match(/\d+/);
                if (match) setQuantity(match[0]);
              }, null, null, 'hi-IN').start();
            }} className="p-2 bg-orange-100 text-[#F57F17] rounded-full shrink-0">
              <Mic className="w-5 h-5" />
            </button>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setUnit('quintal')}
              className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                unit === 'quintal' ? 'bg-[#1B5E20] text-white' : 'border border-slate-300 text-slate-700 bg-white'
              }`}
            >
              {unit === 'quintal' && '✓ '}क्विंटल/Quintal
            </button>
            <button
              onClick={() => setUnit('kg')}
              className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                unit === 'kg' ? 'bg-[#1B5E20] text-white' : 'border border-slate-300 text-slate-700 bg-white'
              }`}
            >
              {unit === 'kg' && '✓ '}किलो/Kg
            </button>
          </div>
        </div>

        {/* §3 Indicative Price */}
        <div className="mb-6 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-slate-800 text-sm">3. सांकेतिक भाव (वैकल्पिक) / Indicative Price</h3>
          <p className="text-xs text-slate-500 mb-3">आपका अनुमानित भाव (अंतिम नहीं) / Your guide price (not final)</p>
          <div className="flex items-center gap-2">
            <div className="relative flex-1 flex items-center border border-slate-300 rounded-lg overflow-hidden bg-slate-50 focus-within:border-[#1B5E20] focus-within:bg-white transition-colors">
              <span className="pl-3 text-slate-500 font-medium text-lg">₹</span>
              <input
                type="number"
                value={indicativePrice}
                onChange={(e) => setIndicativePrice(e.target.value)}
                placeholder="भाव / Price"
                className="w-full py-2.5 px-2 outline-none bg-transparent text-slate-900 font-medium"
              />
              <span className="pr-3 text-slate-500 text-sm bg-slate-100 h-full flex items-center px-2 border-l border-slate-200">/ क्विंटल</span>
            </div>
            <button onClick={() => {
              initSpeechRecognition((t) => {
                const match = t.match(/\d+/);
                if (match) setIndicativePrice(match[0]);
              }, null, null, 'hi-IN').start();
            }} className="p-2 bg-orange-100 text-[#F57F17] rounded-full shrink-0">
              <Mic className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* §4 Delivery Location */}
        <div className="mb-6 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-3 text-sm">4. डिलीवरी स्थान / Delivery Location</h3>
          <button className="w-full flex items-center justify-center gap-2 bg-green-50 text-[#1B5E20] py-2.5 rounded-lg border border-green-200 font-medium text-sm mb-3">
            <MapPin className="w-4 h-4" />
            📍 मेरा स्थान चुनें / Use my location
          </button>
          <div className="relative">
             <input
              type="text"
              value={deliveryLocation}
              onChange={(e) => setDeliveryLocation(e.target.value)}
              placeholder="सांवेर रोड वेयरहाउस, इंदौर (Sanwer..."
              className="w-full border border-slate-300 rounded-lg py-3 px-3 outline-none focus:border-[#1B5E20] text-sm pr-10"
            />
            <button 
              onClick={() => {
                initSpeechRecognition((t) => setDeliveryLocation(t), null, null, 'hi-IN').start();
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-[#F57F17] p-1"
            >
              <Mic className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* §5 Needed-by Date */}
        <div className="mb-6 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-3 text-sm">5. कब तक चाहिए / Needed-by Date</h3>
          <div className="flex items-center justify-between border border-slate-200 bg-slate-50 rounded-full px-4 py-2 mb-3">
             <div className="flex items-center gap-2">
               <Calendar className="w-4 h-4 text-slate-500" />
               <span className="text-sm font-medium text-slate-800">18 नवंबर 2024 • 7 दिनों में / Within 7 days</span>
             </div>
             <button className="text-[#1B5E20] text-xs font-bold">बदलें</button>
          </div>
          <div className="flex flex-wrap gap-2">
             <button
              onClick={() => setUrgency('urgent')}
              className={`py-1.5 px-4 rounded-full text-xs font-medium transition-colors border ${
                urgency === 'urgent' ? 'bg-[#1B5E20] text-white border-[#1B5E20]' : 'border-slate-300 text-slate-700 bg-white'
              }`}
             >
               {urgency === 'urgent' && '✓ '}तुरंत/Urgent
             </button>
             <button
              onClick={() => setUrgency('3days')}
              className={`py-1.5 px-4 rounded-full text-xs font-medium transition-colors border ${
                urgency === '3days' ? 'bg-[#1B5E20] text-white border-[#1B5E20]' : 'border-slate-300 text-slate-700 bg-white'
              }`}
             >
               {urgency === '3days' && '✓ '}3 दिन/3 Days
             </button>
             <button
              onClick={() => setUrgency('7days')}
              className={`py-1.5 px-4 rounded-full text-xs font-medium transition-colors border ${
                urgency === '7days' ? 'bg-[#1B5E20] text-white border-[#1B5E20]' : 'border-slate-300 text-slate-700 bg-white'
              }`}
             >
               {urgency === '7days' && '✓ '}7 दिन/7 Days
             </button>
          </div>
        </div>

        {/* Note & CTA */}
        <div className="text-center mb-4">
          <p className="flex items-center justify-center gap-1 text-xs text-slate-500 font-medium">
            <Lock className="w-3 h-3" />
            🔒 100% सुरक्षित भुगतान via e-NAM मानकीकृत अनुभव
          </p>
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading || submitted}
          className="w-full flex items-center justify-center gap-2 bg-[#1B5E20] text-white py-4 rounded-xl font-bold shadow-sm active:scale-[0.98] transition-transform disabled:opacity-70 disabled:active:scale-100"
        >
          {loading ? (
             <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <Play className="w-5 h-5 fill-white" />
              ▶ मांग पोस्ट करें / Post Requirement
            </>
          )}
        </button>
        <p className="text-center text-xs text-slate-500 mt-2">
          आपके मंडी के किसानों से सीधी बोलियां मिलेंगी
        </p>

      </div>

      {/* Floating FAB */}
      <button 
        onClick={() => {
          speakText("कृपया फॉर्म भरने के लिए माइक का उपयोग करें।");
        }}
        className="fixed bottom-6 right-6 w-14 h-14 bg-[#F57F17] text-white rounded-full flex items-center justify-center shadow-lg hover:bg-orange-600 transition-colors z-20"
      >
        <Mic className="w-6 h-6" />
      </button>

    </div>
  );
}
