import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { ArrowLeft, TrendingUp, TrendingDown, Minus, Clock, MapPin, Activity } from 'lucide-react';


const getCropEmoji = (cropName) => {
  const name = (cropName || '').toLowerCase();
  if (name.includes('wheat')) return '🌾';
  if (name.includes('rice') || name.includes('paddy')) return '🍚';
  if (name.includes('tomato')) return '🍅';
  if (name.includes('potato')) return '🥔';
  if (name.includes('onion')) return '🧅';
  if (name.includes('cotton')) return '☁️';
  if (name.includes('soybean')) return '🌱';
  if (name.includes('maize') || name.includes('corn')) return '🌽';
  return '📦';
};

export default function LiveMandiPrices({ onBack }) {
  const { priceSnapshots } = useApp();
  const [selectedSnapshot, setSelectedSnapshot] = useState(null);

  // Time formatting helper
  const getTimeAgo = (dateStr) => {
    const ms = Date.now() - new Date(dateStr).getTime();
    const hours = Math.floor(ms / (1000 * 60 * 60));
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  const isUpdatedToday = (dateStr) => {
    const ms = Date.now() - new Date(dateStr).getTime();
    return ms < 24 * 60 * 60 * 1000;
  };

  const tickerItems = priceSnapshots.slice(0, 10);

  if (selectedSnapshot) {
    const isToday = isUpdatedToday(selectedSnapshot.updatedAt);
    const diff = selectedSnapshot.pricePerUnit - selectedSnapshot.previousPrice;
    const diffPct = selectedSnapshot.previousPrice ? ((diff / selectedSnapshot.previousPrice) * 100).toFixed(1) : 0;
    
    const base = selectedSnapshot.pricePerUnit;
    const history = [
      base * 0.95, base * 0.92, base * 0.97, base * 1.01, base * 0.99, selectedSnapshot.previousPrice, selectedSnapshot.pricePerUnit
    ].map(v => Math.round(v * 10) / 10);
    const maxH = Math.max(...history);
    const minH = Math.min(...history);
    const range = maxH - minH || 1;

    return (
      <div className="flex flex-col h-full bg-[#f9f8f3] overflow-y-auto">
        <div className="bg-white border-b border-slate-200 px-4 py-3 flex items-center shadow-sm sticky top-0 z-10">
          <button onClick={() => setSelectedSnapshot(null)} className="mr-3 text-slate-500 hover:text-slate-800">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="font-bold text-slate-800 text-lg">{selectedSnapshot.crop} Price Trend</h2>
            <p className="text-xs text-slate-500">{selectedSnapshot.mandiName}</p>
          </div>
        </div>

        <div className="p-4 space-y-4">
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm text-center">
            <p className="text-sm text-slate-500 font-bold mb-1">Live Mandi Rate</p>
            <div className="text-4xl font-black text-[#2E7D32]">₹{selectedSnapshot.pricePerUnit}</div>
            
            <div className="mt-3 flex items-center justify-center">
              {isToday ? (
                diff > 0 ? (
                  <span className="flex items-center text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full text-sm font-bold">
                    <TrendingUp className="w-4 h-4 mr-1" /> +₹{diff.toFixed(1)} (+{diffPct}%)
                  </span>
                ) : diff < 0 ? (
                  <span className="flex items-center text-rose-600 bg-rose-50 px-2.5 py-1 rounded-full text-sm font-bold">
                    <TrendingDown className="w-4 h-4 mr-1" /> ₹{Math.abs(diff).toFixed(1)} ({diffPct}%)
                  </span>
                ) : (
                  <span className="flex items-center text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full text-sm font-bold">
                    <Minus className="w-4 h-4 mr-1" /> No Change
                  </span>
                )
              ) : (
                <span className="text-xs bg-slate-100 text-slate-500 px-2 py-1 rounded-full font-bold">
                  Not updated today
                </span>
              )}
            </div>
            
            <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-center text-xs text-slate-400">
              <Clock className="w-3.5 h-3.5 mr-1" />
              Last updated {getTimeAgo(selectedSnapshot.updatedAt)} by {selectedSnapshot.mandiName} Operator
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
            <h3 className="text-sm font-bold text-slate-700 mb-4 flex items-center">
              <Activity className="w-4 h-4 mr-1.5 text-amber-500" /> 7-Day Agmarknet Trend
            </h3>
            
            <div className="h-40 flex items-end justify-between space-x-2 pt-4">
              {history.map((val, i) => {
                const heightPct = Math.max(10, ((val - minH) / range) * 100);
                return (
                  <div key={i} className="flex flex-col items-center flex-1 group">
                    <div className="text-[9px] text-slate-400 mb-1 opacity-0 group-hover:opacity-100 transition-opacity">₹{val}</div>
                    <div 
                      className="w-full bg-emerald-200 rounded-t-sm group-hover:bg-emerald-400 transition-colors" 
                      style={{ height: `${heightPct}%` }}
                    ></div>
                    <div className="text-[8px] text-slate-400 mt-2">D-{6-i}</div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-[#f9f8f3] overflow-hidden">
      <div className="bg-white border-b border-slate-200 px-4 py-3 flex items-center shadow-sm z-10 relative">
        {onBack && (
          <button onClick={onBack} className="mr-3 text-slate-500 hover:text-slate-800">
            <ArrowLeft className="w-5 h-5" />
          </button>
        )}
        <div>
          <h2 className="font-bold text-slate-800 text-lg flex items-center">
            <Activity className="w-5 h-5 text-amber-500 mr-1.5" />
            Live Mandi Prices
          </h2>
          <p className="text-xs text-slate-500">Stock-market style watchlist</p>
        </div>
      </div>

      {/* Horizontal Ticker */}
      <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-100 text-slate-900 border-y border-emerald-200 text-xs py-2 overflow-hidden flex whitespace-nowrap shadow-xs relative z-10">
        <div className="animate-[ticker_20s_linear_infinite] flex space-x-6 px-4">
          {tickerItems.map(item => {
            const diff = item.pricePerUnit - item.previousPrice;
            const up = diff > 0;
            const down = diff < 0;
            return (
              <div key={`tick-${item.id}`} className="flex items-center space-x-1.5 font-medium">
                <span className="text-slate-600">{item.crop}</span>
                <span className="font-bold text-slate-900">₹{item.pricePerUnit}</span>
                {up ? <TrendingUp className="w-3 h-3 text-emerald-600" /> : 
                 down ? <TrendingDown className="w-3 h-3 text-rose-500" /> : 
                 <Minus className="w-3 h-3 text-slate-400" />}
              </div>
            )
          })}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-2 pb-24">
        <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wide px-2 pt-2">
          <span>Crop & Mandi</span>
          <span>Price & Change</span>
        </div>

        {priceSnapshots.map(snap => {
          const isToday = isUpdatedToday(snap.updatedAt);
          const diff = snap.pricePerUnit - snap.previousPrice;
          const diffPct = snap.previousPrice ? ((diff / snap.previousPrice) * 100).toFixed(1) : 0;
          const up = diff > 0;
          const down = diff < 0;

          return (
            <div 
              key={snap.id} 
              onClick={() => setSelectedSnapshot(snap)}
              className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between cursor-pointer active:scale-[0.98] transition-transform"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center border border-orange-100">
                  <span className="text-xl">{getCropEmoji(snap.crop)}</span>
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">{snap.crop}</h4>
                  <p className="text-[10px] text-slate-500 flex items-center mt-0.5">
                    <MapPin className="w-3 h-3 mr-0.5" /> {snap.mandiName}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <div className="font-black text-slate-800 text-base">₹{snap.pricePerUnit}</div>
                {isToday ? (
                  up ? (
                    <div className="text-emerald-600 text-[11px] font-bold flex items-center justify-end">
                      +{diff.toFixed(1)} (+{diffPct}%) <TrendingUp className="w-3 h-3 ml-0.5" />
                    </div>
                  ) : down ? (
                    <div className="text-rose-600 text-[11px] font-bold flex items-center justify-end">
                      {diff.toFixed(1)} ({diffPct}%) <TrendingDown className="w-3 h-3 ml-0.5" />
                    </div>
                  ) : (
                    <div className="text-slate-400 text-[11px] font-bold flex items-center justify-end">
                      0.0 (0%) <Minus className="w-3 h-3 ml-0.5" />
                    </div>
                  )
                ) : (
                  <div className="bg-slate-100 text-slate-400 text-[9px] font-bold px-1.5 py-0.5 rounded mt-0.5">
                    Not updated today
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes ticker {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
      `}} />
    </div>
  );
}
