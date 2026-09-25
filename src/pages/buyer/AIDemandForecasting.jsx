import React, { useState } from 'react';
import { ArrowLeft, Volume2, Info, TrendingUp, Package, Box, CheckCircle, Phone, Mic } from 'lucide-react';
import { speakText } from '../../utils/speechUtils';

export default function AIDemandForecasting({ onBack }) {
  const [crop, setCrop] = useState('Tomato');
  const [mandi, setMandi] = useState('Jaipur');
  const [duration, setDuration] = useState('7');

  const fpos = [
    { id: 1, name: 'Malwa / Jaipur Kisan FPO', location: 'Jaipur', dist: 0, time: 'मंडी के पास', qty: 450, price: '₹24 - 26/kg', letter: 'A', bg: 'bg-green-200', text: 'text-green-800' },
    { id: 2, name: 'Ajmer Krishi Producer Co.', location: 'Ajmer', dist: 130, time: '3 घंटे परिवहन', qty: 300, price: '₹23 - 25/kg', letter: 'B', bg: 'bg-slate-200', text: 'text-slate-800' },
    { id: 3, name: 'Alwar Agro FPO', location: 'Alwar', dist: 150, time: '3.5 घंटे परिवहन', qty: 250, price: '₹22 - 25/kg', letter: 'C', bg: 'bg-slate-200', text: 'text-slate-800' }
  ];

  return (
    <div className="min-h-screen bg-[#f9f8f3] pb-24 font-sans text-slate-800">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-white shadow-sm sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-1">
            <ArrowLeft className="w-6 h-6 text-[#2E7D32]" />
          </button>
          <div>
            <h1 className="font-bold text-sm text-slate-900 leading-tight">मांग पूर्वानुमान / AI Demand<br/>Forecasting</h1>
          </div>
        </div>
        <button 
          onClick={() => speakText("यह एआई मांग पूर्वानुमान है। जयपुर में टमाटर की मांग 1,427 किलो है, जबकि उपलब्ध आपूर्ति 1,100 किलो है।")} 
          className="flex items-center gap-1.5 bg-orange-100 text-[#FF9800] px-3 py-1.5 rounded-full text-xs font-bold"
        >
          <Volume2 className="w-4 h-4" />
          बोल कर सुनें
        </button>
      </div>

      <div className="p-4 md:p-8 space-y-4 md:space-y-0 md:grid md:grid-cols-2 md:gap-6 pb-32 max-w-6xl mx-auto">
        <div className="space-y-4">
          {/* Info Banner */}
          <div className="bg-[#F1F8EC] border border-[#C5E1A5] rounded-xl p-3 flex items-start gap-2.5 shadow-sm">
            <Info className="w-5 h-5 text-[#2E7D32] shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold text-[#2E7D32] leading-snug">Agmarknet व क्षेत्रीय ऐतिहासिक डेटा पर आधारित पूर्वानुमान</p>
              <p className="text-[10px] text-slate-600 mt-1">Weekly batch forecast • Non real-time proxy for mandi trade planning</p>
            </div>
          </div>

          {/* Selectors */}
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-2 shadow-sm relative">
              <span className="text-[10px] text-slate-500 block mb-0.5">फसल / Crop</span>
              <select 
                value={crop}
                onChange={(e) => setCrop(e.target.value)}
                className="w-full bg-transparent text-sm font-bold text-slate-800 focus:outline-none appearance-none"
              >
                <option value="Tomato">🍅 टमाटर</option>
                <option value="Wheat">🌾 गेहूं</option>
                <option value="Onion">🧅 प्याज</option>
              </select>
            </div>
            <div className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-2 shadow-sm relative">
              <span className="text-[10px] text-slate-500 block mb-0.5">स्थान / Mandi</span>
              <select 
                value={mandi}
                onChange={(e) => setMandi(e.target.value)}
                className="w-full bg-transparent text-sm font-bold text-slate-800 focus:outline-none appearance-none"
              >
                <option value="Jaipur">📍 जयपुर</option>
                <option value="Indore">📍 इंदौर</option>
                <option value="Delhi">📍 दिल्ली</option>
              </select>
            </div>
            <div className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-2 shadow-sm relative">
              <span className="text-[10px] text-slate-500 block mb-0.5">अवधि / Time</span>
              <select 
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full bg-transparent text-sm font-bold text-slate-800 focus:outline-none appearance-none"
              >
                <option value="7">⏱️ 7 दिन</option>
                <option value="15">⏱️ 15 दिन</option>
                <option value="30">⏱️ 30 दिन</option>
              </select>
            </div>
          </div>

          {/* Demand & Supply Summary */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="font-extrabold text-[#2E7D32] text-base">मांग एवं आपूर्ति सारांश</h2>
                <p className="text-[10px] text-slate-500 font-medium mt-0.5">Forecast Summary (अगले {duration} दिनों के लिए अनुमानित आंकड़े)</p>
              </div>
              <div className="bg-[#a5d6a7] text-[#2E7D32] px-3 py-1.5 rounded-lg text-xs font-bold text-center leading-tight">
                Tomato<br/>(हाइब्रिड)
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-3">
              {/* Expected Demand */}
              <div className="bg-[#f9f8f3] border border-slate-200 rounded-xl p-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] font-bold text-slate-600">अनुमानित मांग</span>
                  <Package className="w-3.5 h-3.5 text-[#2E7D32]" />
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-xl font-black text-[#2E7D32]">1,427</span>
                  <span className="text-xs font-bold text-slate-600">kg</span>
                </div>
                <p className="text-[9px] text-slate-500 mt-0.5">Expected Demand</p>
              </div>

              {/* Available Supply */}
              <div className="bg-[#f9f8f3] border border-slate-200 rounded-xl p-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] font-bold text-slate-600">उपलब्ध आपूर्ति</span>
                  <Box className="w-3.5 h-3.5 text-amber-600" />
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-xl font-black text-slate-800">1,100</span>
                  <span className="text-xs font-bold text-slate-600">kg</span>
                </div>
                <p className="text-[9px] text-slate-500 mt-0.5">Available Supply</p>
              </div>
            </div>

            {/* Trend */}
            <div className="bg-[#f9f8f3] border border-slate-200 rounded-xl p-3 w-[calc(50%-6px)]">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-bold text-slate-600">मांग का रुझान</span>
                <TrendingUp className="w-3.5 h-3.5 text-[#2E7D32]" />
              </div>
              <div className="text-[#2E7D32] font-black text-sm flex items-center gap-1">
                ▲ तेज (High)
              </div>
              <p className="text-[9px] text-slate-500 mt-0.5">Increasing / बढ़ती मांग</p>
            </div>
          </div>
        </div>

        {/* Recommended Supply Matching */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
          <h3 className="text-[10px] font-bold text-[#2E7D32] uppercase tracking-wider mb-1">Recommended Supply Matching</h3>
          <h2 className="font-extrabold text-slate-800 text-lg">अनुशंसित आपूर्ति मिलान</h2>
          <p className="text-[10px] text-slate-500 mb-4">नज़दीकी किसान उत्पादक संगठन (Verified FPO Supply)</p>

          <div className="bg-[#f9f8f3] border border-slate-200 rounded-xl p-3 mb-4">
            <div className="flex justify-between items-end mb-2">
              <div>
                <span className="text-xs font-extrabold text-slate-800 block">आपूर्ति कवरेज</span>
                <span className="text-[10px] text-slate-600 font-bold">(Fulfillment Ratio)</span>
              </div>
              <div className="text-right">
                <span className="text-xs font-extrabold text-[#2E7D32] block">77% Covered (1,000 /</span>
                <span className="text-xs font-extrabold text-[#2E7D32] block">1,427 kg)</span>
              </div>
            </div>
            
            <div className="w-full bg-slate-200 rounded-full h-2.5 mb-1.5 overflow-hidden flex">
              <div className="bg-[#2E7D32] h-2.5 rounded-full" style={{ width: '77%' }}></div>
            </div>
            <p className="text-[9px] text-slate-500">उपलब्ध FPO: 1,000 kg</p>
          </div>

          <div className="space-y-3">
            {fpos.map((fpo) => (
              <div key={fpo.id} className="border border-slate-200 rounded-xl p-3 flex gap-3 relative">
                <div className={`w-8 h-8 rounded-lg ${fpo.bg} ${fpo.text} flex items-center justify-center font-black text-sm shrink-0`}>
                  {fpo.letter}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <h4 className="font-bold text-slate-800 text-sm truncate pr-2">{fpo.name}</h4>
                    <div className="text-right shrink-0">
                      <span className="font-black text-[#2E7D32] text-sm block leading-none">{fpo.qty}</span>
                      <span className="text-[10px] font-bold text-[#2E7D32]">kg</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1 mt-1 text-[10px] text-slate-500">
                    <span className="text-rose-500">📍</span>
                    <span>{fpo.location} ({fpo.dist} km) • {fpo.time}</span>
                  </div>
                  
                  <div className="flex items-center justify-between mt-2">
                    <div className="bg-green-100 border border-green-200 text-green-800 text-[9px] font-bold px-2 py-0.5 rounded flex items-center gap-1">
                      <CheckCircle className="w-2.5 h-2.5" />
                      Verified Stock
                    </div>
                    <span className="text-[10px] text-slate-400 font-medium">{fpo.price}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Fixed Bottom Bar */}
      <div className="fixed bottom-[60px] md:bottom-[72px] left-1/2 -translate-x-1/2 w-full max-w-md md:max-w-7xl mx-auto p-4 md:px-8 bg-white/95 backdrop-blur-md border-t border-slate-200 flex items-center gap-3 pb-6 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        <button className="flex-1 bg-[#2E7D32] text-white py-3.5 rounded-xl font-bold text-sm shadow flex items-center justify-center gap-2 hover:bg-[#154c19] transition">
          <Phone className="w-4 h-4" />
          <span>FPO से संपर्क करें / Connect with FPOs</span>
        </button>
        <button 
          onClick={() => speakText("क्षमा करें, वॉयस एआई फिलहाल इस स्क्रीन पर उपलब्ध नहीं है। (Voice AI is currently not available on this screen.)")}
          className="w-12 h-12 bg-[#FF9800] text-white rounded-full flex items-center justify-center shadow-lg shrink-0 hover:bg-[#e67300] transition"
        >
          <Mic className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}
