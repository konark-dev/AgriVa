import React, { useState } from 'react';
import { ArrowLeft, Volume2, Mic, CheckCircle, XCircle, ArrowRightLeft, Check, Truck, Package, MapPin } from 'lucide-react';
import { speakText, initSpeechRecognition } from '../../utils/speechUtils';

export default function RouteComparisonView({ onBack }) {
  const [activeView, setActiveView] = useState('comparison'); // 'comparison' | 'tracking'
  const [trackingStatus, setTrackingStatus] = useState(0); // 0: Pending, 1: Picked Up, 2: In Transit, 3: Delivered

  const handleListen = () => {
    speakText("रूट तुलना. रूट ए सस्ता है लेकिन खराब सड़क है। रूट बी एग्री-क्यू चयनित सुरक्षित एक्सप्रेस ग्रीन कॉरिडोर है। इसका भाड़ा आठ हजार रुपये है।");
  };

  if (activeView === 'tracking') {
    return (
      <div className="min-h-screen bg-[#f9f8f3] flex flex-col font-sans">
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-white border-b border-slate-200 sticky top-0 z-10">
          <button onClick={() => setActiveView('comparison')} className="p-2 -ml-2 rounded-full hover:bg-slate-100">
            <ArrowLeft className="w-6 h-6 text-slate-800" />
          </button>
          <div className="text-center">
            <h1 className="text-lg font-bold text-slate-800 flex items-center justify-center gap-1">
              AgriVa <span className="bg-[#1B5E20] text-white text-[10px] px-1.5 py-0.5 rounded">AgriQ</span>
            </h1>
            <p className="text-xs text-slate-500">डिस्पैच ट्रैकिंग / Dispatch Tracking</p>
          </div>
          <button onClick={() => speakText("यह ट्रैकिंग पेज है। ड्राइवर द्वारा स्थिति मैन्युअल रूप से अपडेट की जाती है।")} className="flex items-center gap-1 bg-orange-100 text-[#F57F17] px-3 py-1.5 rounded-full text-xs font-medium">
            <Volume2 className="w-3.5 h-3.5" />
            सुनें
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 p-4 space-y-6">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-3 mb-4 border-b border-slate-100 pb-4">
              <span className="text-3xl">🍅</span>
              <div>
                <h3 className="font-bold text-slate-800 text-lg">टमाटर (Tomato)</h3>
                <p className="text-sm text-slate-500">2,000 kg • एक्सप्रेस ग्रीन कॉरिडोर</p>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-800 mb-6 flex items-start gap-2">
              <span className="text-amber-500 mt-0.5">ℹ️</span>
              <p>कृपया ध्यान दें: यह लाइव GPS ट्रैकिंग नहीं है। माल की सुरक्षा और बैटरी बचाने के लिए ड्राइवर द्वारा स्थिति को हर चेकपॉइंट पर मैन्युअल रूप से अपडेट किया जाता है।</p>
            </div>

            {/* Stepper */}
            <div className="relative pl-6 space-y-8 before:absolute before:inset-0 before:ml-8 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
              
              {/* Step 1 */}
              <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full border-4 border-white ${trackingStatus >= 1 ? 'bg-[#1B5E20]' : 'bg-slate-300'} text-white shadow shrink-0 z-10`}>
                  <Package className="w-4 h-4" />
                </div>
                <div className="w-[calc(100%-3rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-slate-200 bg-white shadow-sm ml-4">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className={`font-bold ${trackingStatus >= 1 ? 'text-[#1B5E20]' : 'text-slate-500'}`}>Picked Up (खेत से लोड)</h4>
                  </div>
                  {trackingStatus === 0 && (
                    <button onClick={() => setTrackingStatus(1)} className="mt-2 w-full py-2 bg-[#1B5E20] text-white rounded-lg text-sm font-medium">मार्क पिक-अप</button>
                  )}
                </div>
              </div>

              {/* Step 2 */}
              <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full border-4 border-white ${trackingStatus >= 2 ? 'bg-[#1B5E20]' : 'bg-slate-300'} text-white shadow shrink-0 z-10`}>
                  <Truck className="w-4 h-4" />
                </div>
                <div className="w-[calc(100%-3rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-slate-200 bg-white shadow-sm ml-4">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className={`font-bold ${trackingStatus >= 2 ? 'text-[#1B5E20]' : 'text-slate-500'}`}>In Transit (रास्ते में)</h4>
                  </div>
                  {trackingStatus === 1 && (
                    <button onClick={() => setTrackingStatus(2)} className="mt-2 w-full py-2 bg-[#1B5E20] text-white rounded-lg text-sm font-medium">मार्क इन ट्रांजिट</button>
                  )}
                </div>
              </div>

              {/* Step 3 */}
              <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full border-4 border-white ${trackingStatus >= 3 ? 'bg-[#1B5E20]' : 'bg-slate-300'} text-white shadow shrink-0 z-10`}>
                  <MapPin className="w-4 h-4" />
                </div>
                <div className="w-[calc(100%-3rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-slate-200 bg-white shadow-sm ml-4">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className={`font-bold ${trackingStatus >= 3 ? 'text-[#1B5E20]' : 'text-slate-500'}`}>Delivered (मंडी पहुंच)</h4>
                  </div>
                  {trackingStatus === 2 && (
                    <button onClick={() => setTrackingStatus(3)} className="mt-2 w-full py-2 bg-[#1B5E20] text-white rounded-lg text-sm font-medium">मार्क डिलीवर</button>
                  )}
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    );
  }

  // COMPARISON VIEW
  return (
    <div className="min-h-screen bg-[#f9f8f3] flex flex-col font-sans">
      
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-white border-b border-slate-200 sticky top-0 z-20">
        <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-slate-100">
          <ArrowLeft className="w-6 h-6 text-slate-800" />
        </button>
        <div className="text-center">
          <h1 className="text-lg font-bold text-slate-800 flex items-center justify-center gap-1">
            AgriVa <span className="bg-[#1B5E20] text-white text-[10px] px-1.5 py-0.5 rounded">AgriQ</span>
          </h1>
          <p className="text-xs text-slate-500">रूट तुलना व चयन</p>
        </div>
        <button onClick={handleListen} className="flex items-center gap-1 border border-orange-200 bg-orange-50 text-[#F57F17] px-3 py-1.5 rounded-full text-xs font-medium shadow-sm">
          <Volume2 className="w-3.5 h-3.5" />
          बोल कर सुनें
        </button>
      </div>

      {/* Crop Info Strip */}
      <div className="bg-white border-b border-slate-200 py-2 px-4 flex items-center justify-between z-10">
        <div className="flex items-center gap-2">
          <span className="text-xl">🍅</span>
          <span className="font-bold text-slate-800 text-sm">टमाटर (Tomato)</span>
          <span className="text-slate-500 text-sm">— 2,000 kg</span>
        </div>
        <div className="bg-orange-50 border border-orange-200 text-orange-700 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
          ⏱ 48 घंटे विंडो
        </div>
      </div>

      {/* Map Area Mockup */}
      <div className="relative h-64 bg-[#e8f2ea] overflow-hidden border-b border-slate-200" style={{ backgroundImage: 'radial-gradient(#c6d9c9 1px, transparent 1px)', backgroundSize: '16px 16px' }}>
        
        {/* River */}
        <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
          <path d="M0,70 Q30,70 50,80 T100,85 L100,90 Q50,85 0,75 Z" fill="#b0d4eb" opacity="0.6"/>
          <text x="35" y="72" fontSize="3" fill="#4b7899" fontWeight="bold">नदी / RIVER</text>
        </svg>
        
        {/* Route Lines (SVG) */}
        <svg className="absolute inset-0 w-full h-full" style={{ pointerEvents: 'none' }} viewBox="0 0 100 100" preserveAspectRatio="none">
          {/* Rejected Route (Dashed Red) */}
          <path d="M 20 20 Q -10 60 50 90" fill="none" stroke="#dc2626" strokeWidth="1.5" strokeDasharray="3,2" />
          
          {/* Selected Route (Solid Green) */}
          <path id="greenRoute" d="M 20 20 Q 50 40 75 90" fill="none" stroke="#1B5E20" strokeWidth="2" />
          
          {/* Green Route Outline for glow */}
          <path d="M 20 20 Q 50 40 75 90" fill="none" stroke="#4ade80" strokeWidth="1" opacity="0.8" />
          
          {/* Animated Truck Icon */}
          <g>
            <rect x="-3" y="-2" width="6" height="4" fill="#1B5E20" rx="1" />
            <circle cx="-1.5" cy="2" r="1" fill="#333" />
            <circle cx="1.5" cy="2" r="1" fill="#333" />
            <path d="M 3 -1 L 4.5 -1 L 4.5 1.5 L 3 1.5 Z" fill="#F57F17" />
            <animateMotion dur="4s" repeatCount="indefinite" rotate="auto" keyPoints="0;1" keyTimes="0;1" calcMode="linear">
              <mpath href="#greenRoute" />
            </animateMotion>
          </g>
        </svg>

        {/* Origin Farm */}
        <div className="absolute top-4 left-4 bg-white border-2 border-[#1B5E20] rounded-xl px-3 py-2 shadow-lg flex items-center gap-2">
          <div className="w-2.5 h-2.5 bg-[#1B5E20] rounded-full"></div>
          <div>
            <div className="font-bold text-slate-800 text-sm leading-tight">खेत / Farm</div>
            <div className="text-xs text-slate-500">सांवेर (Sanwer, Indore)</div>
          </div>
        </div>

        {/* Route B Label */}
        <div className="absolute top-[40%] right-4 bg-[#1B5E20] text-white rounded-lg px-3 py-1.5 shadow-md border border-green-800 text-xs">
          <div className="font-medium">✓ AgriQ चयनित (Safe)</div>
          <div className="font-bold">₹8,000 • केवल 5 घंटे</div>
        </div>

        {/* Route A Label */}
        <div className="absolute top-[50%] left-4 bg-white rounded-lg px-3 py-1.5 shadow-md border border-red-200 text-xs text-red-700">
          <div className="font-medium flex items-center gap-1"><XCircle className="w-3 h-3"/> अस्वीकृत (Rejected)</div>
          <div className="font-bold text-slate-800">₹7,000 • 8 घंटे</div>
        </div>

        {/* Destination Mandi */}
        <div className="absolute bottom-6 right-4 bg-white border-2 border-orange-700 rounded-xl px-3 py-2 shadow-lg flex items-center gap-2">
          <div className="w-2.5 h-2.5 bg-orange-700 rounded-full"></div>
          <div>
            <div className="font-bold text-orange-900 text-sm leading-tight">चोइथराम मंडी (Indore)</div>
            <div className="text-xs text-slate-500">मंडी प्रांगण / Gate 2</div>
          </div>
        </div>

        {/* Bottom Legend */}
        <div className="absolute bottom-2 left-2 bg-white/90 px-2 py-1 rounded text-[10px] text-slate-600 border border-slate-200 flex items-center gap-1 shadow-sm">
          <span className="text-orange-500">🧭</span> NH-52 एक्सप्रेस ग्रीन कॉरिडोर
        </div>
        <div className="absolute bottom-2 right-2 bg-white/90 px-2 py-1 rounded text-[10px] text-slate-600 border border-slate-200 flex items-center gap-2 shadow-sm">
          <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-[#1B5E20]"></div> ताज़ा</div>
          <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-red-600"></div> जोखिम</div>
        </div>
      </div>

      {/* Comparison Cards Section */}
      <div className="flex-1 p-4 overflow-y-auto pb-24">
        <div className="flex items-center gap-2 mb-4">
          <ArrowRightLeft className="w-5 h-5 text-[#1B5E20]" />
          <h2 className="text-lg font-bold text-slate-800">दोनों रूटों की तुलना / Route Comparison</h2>
        </div>

        <div className="flex gap-3 relative">
          
          {/* Card A - Rejected */}
          <div className="flex-1 bg-red-50/30 border border-red-100 rounded-2xl p-3 opacity-90">
            <div className="inline-flex items-center gap-1 bg-red-50 text-red-600 border border-red-100 px-2 py-0.5 rounded text-[10px] font-bold mb-3">
              <XCircle className="w-3 h-3" /> अस्वीकृत / Rejected
            </div>
            <h3 className="font-bold text-slate-800">रूट A (सस्ता)</h3>
            <p className="text-xs text-slate-500 mb-4">पुराना स्टेट हाईवे (खराब सड़क)</p>
            
            <div className="space-y-3">
              <div className="border-t border-red-100 pt-2">
                <p className="text-[10px] text-slate-500 uppercase">लागत / Cost</p>
                <p className="text-lg font-bold text-slate-800">₹7,000</p>
                <span className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded font-medium">कम किराया (Lowest)</span>
              </div>
              <div className="border-t border-red-100 pt-2">
                <p className="text-[10px] text-slate-500 uppercase">समय / Transit Time</p>
                <p className="text-lg font-bold text-slate-800">8 घंटे</p>
                <span className="text-[10px] text-red-600 font-medium">+3 घंटे अधिक</span>
              </div>
              <div className="border-t border-red-100 pt-2 pb-2">
                <p className="text-[10px] text-slate-500 uppercase">ताज़गी जोखिम / Freshness</p>
                <p className="text-lg font-bold text-red-600">42%</p>
                <p className="text-[10px] text-slate-500 leading-tight mt-1">खराब सड़क + अधिक समय के कारण टमाटर खराब होने की संभावना</p>
              </div>
            </div>
          </div>

          {/* Card B - Selected */}
          <div className="flex-1 bg-white border-2 border-[#1B5E20] rounded-2xl p-3 shadow-md relative">
            <div className="absolute -top-3 -right-2 bg-[#1B5E20] text-white p-1 rounded-full border-2 border-white shadow-sm">
              <Check className="w-4 h-4" />
            </div>
            <div className="inline-flex items-center gap-1 bg-green-50 text-[#1B5E20] border border-green-200 px-2 py-0.5 rounded text-[10px] font-bold mb-3">
              <Check className="w-3 h-3" /> चयनित / Selected
            </div>
            <h3 className="font-bold text-[#1B5E20]">रूट B (AgriQ)</h3>
            <p className="text-xs text-slate-500 mb-4">एक्सप्रेस ग्रीन कॉरिडोर</p>
            
            <div className="space-y-3">
              <div className="border-t border-slate-100 pt-2">
                <p className="text-[10px] text-slate-500 uppercase">लागत / Cost</p>
                <p className="text-lg font-bold text-slate-800">₹8,000</p>
                <span className="text-[10px] bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded font-medium">+₹1,000 अतिरिक्त</span>
              </div>
              <div className="border-t border-slate-100 pt-2">
                <p className="text-[10px] text-slate-500 uppercase">समय / Transit Time</p>
                <p className="text-lg font-bold text-slate-800">5 घंटे</p>
                <span className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded font-medium">सबसे तेज़ (Fastest)</span>
              </div>
              <div className="border-t border-slate-100 pt-2 pb-2">
                <p className="text-[10px] text-slate-500 uppercase">ताज़गी जोखिम / Freshness</p>
                <p className="text-lg font-bold text-[#1B5E20]">5%</p>
                <p className="text-[10px] text-slate-500 leading-tight mt-1">स्मूथ एक्सप्रेसवे, माल सुरक्षित पहुंचेगा।</p>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Mic Button */}
        <button 
          className="fixed right-4 bottom-24 w-12 h-12 bg-[#F57F17] text-white rounded-full flex items-center justify-center shadow-lg border-2 border-white z-30"
          onClick={() => speakText("रूट बी सबसे सुरक्षित है क्योंकि इसमें टोल रोड और एक्सप्रेसवे शामिल हैं।")}
        >
          <Mic className="w-6 h-6" />
        </button>

      </div>

      {/* Bottom Sticky CTA */}
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t border-slate-200 p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-40">
        <div className="flex items-center justify-between mb-3 text-sm">
          <div className="text-slate-600 font-medium">चयनित: <span className="text-slate-900 font-bold">रूट B (सुरक्षित एक्सप्रेस)</span></div>
          <div className="font-bold text-[#1B5E20]">कुल भाड़ा: ₹8,000</div>
        </div>
        <button 
          onClick={() => setActiveView('tracking')}
          className="w-full bg-[#1B5E20] text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 shadow-md active:scale-95 transition-transform"
        >
          <CheckCircle className="w-5 h-5" />
          रूट स्वीकृत करें एवं डिस्पैच ट्रैक करें
        </button>
      </div>

    </div>
  );
}
