import React, { useState } from 'react';
import { speakText, stopSpeaking } from '../../utils/speechUtils';
import { 
  MapPin, 
  Clock, 
  Zap, 
  Mic, 
  Filter, 
  ChevronRight, 
  Star, 
  TrendingUp, 
  Volume2, 
  Truck, Phone 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function RequirementsFeed({ onMakeOffer }) {
  const { requirements, offers, logCallRequest } = useApp();
  const [cropFilter, setCropFilter] = useState('all');

  const openReqs = requirements.filter(r => r.status === 'Open');
  const filtered = cropFilter === 'all' 
    ? openReqs 
    : openReqs.filter(r => r.crop === cropFilter);

  // crop emoji map
  const getCropEmoji = (crop) => {
    const map = {
      'Wheat': '🌾',
      'Rice': '🍚',
      'Cotton': '🌿',
      'Tomato': '🍅',
      'Soybean': '🫘',
      'Chana': '🫛',
      'Onion': '🧅',
      'Mustard': '🌻'
    };
    return map[crop] || '🌾';
  };

  // urgency badge map
  const getUrgencyBadge = (urgency) => {
    if (urgency === 'urgent') {
      return (
        <div className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded flex items-center gap-1 font-medium">
          🚨 अंतिम दिन
        </div>
      );
    }
    if (urgency === '3days' || urgency === '5days') {
      const days = urgency === '3days' ? 3 : 5;
      return (
        <div className="bg-orange-100 text-orange-700 text-xs px-2 py-1 rounded flex items-center gap-1 font-medium">
          ⏰ {days} दिन शेष
        </div>
      );
    }
    if (urgency === '7days') {
      return (
        <div className="bg-slate-100 text-slate-500 text-xs px-2 py-1 rounded flex items-center gap-1 font-medium">
          ⏰ 7 दिन शेष
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-[#f9f8f3] min-h-screen pb-20 text-slate-800">
      {/* Header bar */}
      <div className="bg-white p-4 flex items-center justify-between shadow-sm">
        <div>
          <h1 className="font-bold text-lg text-slate-900">AgriVa ⬢ मांग फीड</h1>
          <p className="text-xs text-slate-500">Requirements Near You</p>
        </div>
        <button className="bg-orange-50 text-[#F57F17] flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium" onClick={() => speakText('आपके आस पास खरीददारों की सक्रिय मांग उपलब्ध है। नीचे दी गई सूची से अपनी फसल के लिए बोली लगाएं।', 'hi-IN')}>
          <Volume2 size={16} />
          <span>बोल कर सुनें</span>
        </button>
      </div>

      <div className="p-4">
        {/* Sub-header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-slate-800">आपके आस-पास खरीदारों की मांग / Traders & millers</h2>
          <div className="bg-orange-100 p-2 rounded-full text-[#F57F17]">
            <Truck size={16} />
          </div>
        </div>

        {/* Location chip */}
        <div className="bg-white rounded-full py-2 px-3 flex items-center justify-between shadow-sm border border-slate-200 mb-4">
          <span className="text-sm text-slate-700 font-medium">📍 इंदौर संभाग (Indore Region ⬢ 25 किमी)</span>
          <button className="text-sm text-green-700 font-medium">बदलें</button>
        </div>

        {/* Crop filter pills */}
        <div className="flex gap-2 overflow-x-auto mb-4 pb-1">
          <button 
            onClick={() => setCropFilter('all')}
            className={`whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-medium ${cropFilter === 'all' ? 'bg-[#1B5E20] text-white' : 'bg-white text-slate-700 border border-slate-200'}`}
          >
            🌾 सभी फसलें /All Crops
          </button>
          {['Wheat', 'Rice', 'Soybean', 'Cotton'].map(crop => (
            <button
              key={crop}
              onClick={() => setCropFilter(crop)}
              className={`whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-medium ${cropFilter === crop ? 'bg-[#1B5E20] text-white' : 'bg-white text-slate-700 border border-slate-200'}`}
            >
              {getCropEmoji(crop)} {crop}
            </button>
          ))}
        </div>

        {/* Count row */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-[#1B5E20] font-bold text-sm">
            {filtered.length} सक्रिय मांग उपलब्ध ({filtered.length} Active Needs)
          </span>
          <button className="flex items-center gap-1 border border-slate-300 bg-white rounded-lg px-2 py-1 text-xs text-slate-600 font-medium">
            <Filter size={14} /> फ़िल्टर करें
          </button>
        </div>

        {/* Requirement Cards */}
        {filtered.map(req => {
          const offersCount = offers.filter(o => o.requirementId === req.id && o.status === 'Pending').length;
          const fulfilledPct = req.quantity && req.remainingQuantity ? Math.round(((req.quantity - req.remainingQuantity) / req.quantity) * 100) : 60;
          const remainingQty = req.remainingQuantity || Math.round((req.quantity || 2000) * 0.4);
          
          // Fallbacks for data structure
          const crop = req.crop || 'Wheat';
          const grade = req.grade || 'Grade A';
          const buyerName = req.buyerName || 'ITC Chaupal';
          const price = req.price || 2450;
          const quantity = req.quantity || 2000;
          const minQty = req.minQuantity || 30;
          const urgency = req.urgency || '3days';
          const distance = req.distance || 8;
          const location = req.location || 'Sanwer Mandi';
          const trend = req.trend || '+₹80';

          return (
            <div key={req.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 mb-3">
              {/* Top row */}
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{getCropEmoji(crop)}</span>
                  <span className="font-bold text-slate-900">{crop === 'Wheat' ? 'गेहूं' : crop} / {crop}</span>
                  <span className="bg-green-50 text-green-700 text-xs px-2 py-0.5 rounded-full border border-green-200 font-medium">ग्रेड {grade.replace('Grade ', '')} / {grade}</span>
                </div>
                {getUrgencyBadge(urgency)}
              </div>

              {/* Buyer row */}
              <div className="flex items-center gap-2 mb-4">
                <span className="font-bold text-slate-800 text-sm">{buyerName}</span>
                <span className="bg-[#1B5E20] text-white text-[10px] px-1.5 py-0.5 rounded font-medium">सत्यापित</span>
                <span className="flex items-center text-xs text-slate-600 font-medium">
                  <Star size={12} className="text-yellow-400 fill-yellow-400 mr-0.5" /> 4.9
                </span>
              </div>

              {/* Price/Qty Grid */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <div className="text-xs text-slate-500 font-medium mb-1">संभावित भाव (GUIDE PRICE)</div>
                  <div className="flex items-end gap-1">
                    <span className="text-[#1B5E20] font-bold text-xl">₹ {price.toLocaleString('en-IN')}</span>
                    <span className="text-[#1B5E20] text-sm font-medium">/ क्विंटल</span>
                  </div>
                  <div className="text-[10px] text-green-600 flex items-center font-medium mt-0.5">
                    <TrendingUp size={10} className="mr-0.5" /> {trend} पिछले हफ्ते
                  </div>
                </div>
                <div>
                  <div className="text-xs text-slate-500 font-medium mb-1">मांग (TARGET)</div>
                  <div className="font-bold text-slate-900 text-lg">{quantity.toLocaleString('en-IN')} क्विंटल(Qt)</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">न्यूनतम बोली: {minQty} Qt</div>
                </div>
              </div>

              {/* Fulfillment bar */}
              <div className="mb-4">
                <div className="flex justify-between items-center text-xs mb-1">
                  <span className="text-slate-600 font-medium">{fulfilledPct}% मांग पूरी / {fulfilledPct}% Fulfilled</span>
                  <span className="text-[#F57F17] font-bold">{remainingQty.toLocaleString('en-IN')} Qt</span>
                </div>
                <div className="h-1.5 bg-slate-100 rounded-full w-full overflow-hidden mb-1 flex">
                  <div className="h-full bg-[#1B5E20] rounded-full" style={{ width: `${fulfilledPct}%` }}></div>
                </div>
                <div className="text-[10px] text-slate-500">{((quantity * fulfilledPct)/100).toLocaleString('en-IN')} / {quantity.toLocaleString('en-IN')} Qt</div>
              </div>

              {/* Offers placed line */}
              {offersCount > 0 && (
                <div className="text-xs text-slate-500 italic mb-3">
                  {offersCount} किसानों ने भाव दिया
                </div>
              )}

              {/* Distance */}
              <div className="flex items-center text-xs text-slate-500 mb-4 bg-slate-50 p-2 rounded-lg">
                <span>📍 {distance} किमी दूर ⬢ मंडी प्रांगण ({location})</span>
              </div>

              {/* CTA button */}
              <button 
                onClick={() => onMakeOffer && onMakeOffer(req)}
                className="w-full bg-[#1B5E20] text-white rounded-xl py-3 font-bold flex items-center justify-center gap-1 hover:bg-[#144718]"
              >
                अपनी बोली लगाएं / Make an Offer ➔
              </button>
            </div>
          );
        })}

        {/* Empty state orange card */}
        <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4 mt-2">
          <p className="text-sm text-slate-800 leading-relaxed font-medium">फसल का भाव नहीं मिल रहा? माइक दबाएं और बोलें - मंडी मित्र आपकी मांग को पास के व्यापारियों और FPO समूहों को भेजेगा।</p>
          <button className="mt-2 bg-[#F57F17] text-white rounded-xl px-4 py-2 font-medium text-sm flex items-center gap-2"><Mic size={16} /> बोल कर खोजें</button>
        </div>
      </div>
    </div>
  );
}
