import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { recommendBestMandis } from '../../utils/priceTrends';
import { TrendingUp, TrendingDown, Minus, Filter, Sparkles, MapPin, Award, RefreshCw } from 'lucide-react';

export default function PriceDiscovery() {
  const { mandiPrices, currentUser } = useApp();

  const [selectedCrop, setSelectedCrop] = useState('All');
  const [maxDistanceKm, setMaxDistanceKm] = useState(100);
  const [sortBy, setSortBy] = useState('price_desc'); // price_desc | distance_asc
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSync, setLastSync] = useState(new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}));

  const farmerLocation = { lat: 28.9931, lng: 77.0151 }; // Default Sonipat

  // Best Mandi rule-based calculation
  const bestMandis = recommendBestMandis(
    farmerLocation,
    selectedCrop === 'All' ? 'Tomato' : selectedCrop,
    1000,
    mandiPrices
  );

  const filteredPrices = mandiPrices.filter((item) => {
    const cropMatch = selectedCrop === 'All' || item.crop.toLowerCase() === selectedCrop.toLowerCase();
    return cropMatch;
  });

  if (sortBy === 'price_desc') {
    filteredPrices.sort((a, b) => b.modalPrice - a.modalPrice);
  }

  const handleSync = () => {
    setIsSyncing(true);
    // Simulate eNAM API network delay
    setTimeout(() => {
      setIsSyncing(false);
      setLastSync(new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}));
      // We don't actually mutate state because we want to stick to mock data, 
      // but we show a success toast to complete the simulation.
    }, 2000);
  };

  const renderTrendBadge = (trend) => {
    if (trend === 'trending_up') {
      return (
        <span className="inline-flex items-center space-x-0.5 px-2 py-0.5 rounded-full bg-emerald-950 text-[#1B5E20] border border-emerald-800 text-[10px] font-semibold">
          <TrendingUp className="w-3 h-3" />
          <span>Upward</span>
        </span>
      );
    }
    if (trend === 'trending_down') {
      return (
        <span className="inline-flex items-center space-x-0.5 px-2 py-0.5 rounded-full bg-rose-950 text-rose-400 border border-rose-800 text-[10px] font-semibold">
          <TrendingDown className="w-3 h-3" />
          <span>Downward</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center space-x-0.5 px-2 py-0.5 rounded-full bg-slate-50 text-slate-700 text-slate-500 border border-slate-200 text-[10px] font-semibold">
        <Minus className="w-3 h-3" />
        <span>Stable</span>
      </span>
    );
  };

  return (
    <div className="space-y-4 p-4 pb-20">
      {/* Title */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-800 flex items-center space-x-1.5">
            <TrendingUp className="w-5 h-5 text-[#1B5E20]" />
            <span>Mandi Price Discovery</span>
          </h2>
          <p className="text-xs text-slate-500">Live Agmarknet Benchmark Prices</p>
        </div>
        <button
          onClick={handleSync}
          disabled={isSyncing}
          className="btn-touch flex items-center space-x-1.5 px-3 py-1.5 bg-slate-50 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold text-sky-400 shadow disabled:opacity-70"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
          <span>{isSyncing ? 'Syncing...' : 'eNAM Sync'}</span>
        </button>
      </div>

      <div className="text-[10px] text-slate-500 text-right mt-[-10px] mb-2 font-medium">
        Last synced with eNAM: {lastSync}
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-2xl p-3 border border-slate-200 space-y-2.5">
        <div className="flex items-center space-x-2 text-xs">
          <Filter className="w-4 h-4 text-[#1B5E20]" />
          <span className="font-semibold text-slate-600">Filter Crop:</span>
        </div>

        <div className="flex space-x-1.5 overflow-x-auto no-scrollbar pb-1">
          {['All', 'Wheat', 'Rice', 'Tomato', 'Potato', 'Onion'].map((crop) => (
            <button
              key={crop}
              onClick={() => setSelectedCrop(crop)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedCrop === crop
                  ? 'bg-[#1B5E20] text-white shadow-md'
                  : 'bg-slate-50 text-slate-700 text-slate-600 hover:bg-slate-700'
              }`}
            >
              {crop}
            </button>
          ))}
        </div>
      </div>

      {/* Rule-Based "Best Mandi" Recommendation Section */}
      <div className="bg-gradient-to-r from-emerald-950/80 to-slate-900 border border-emerald-800/60 rounded-2xl p-3.5 space-y-2 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Award className="w-5 h-5 text-amber-400" />
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
              Rule-Based Best Mandi Recommendation
            </h3>
          </div>
          <span className="text-[10px] bg-emerald-50 text-emerald-300 px-2 py-0.5 rounded border border-emerald-200">
            Net Yield Ranked
          </span>
        </div>
        <p className="text-[11px] text-slate-600 leading-relaxed">
          Calculated via <code className="text-[#1B5E20] font-mono text-[10px]">netPrice = mandiPrice − transportCost(distance)</code>
        </p>

        <div className="space-y-2 pt-1">
          {bestMandis.map((mandi, idx) => (
            <div key={mandi.id} className="bg-white border border-slate-200 rounded-xl p-2.5 flex items-center justify-between text-xs">
              <div>
                <div className="font-bold text-slate-800 flex items-center space-x-1">
                  <span className="text-amber-400 font-extrabold">#{idx + 1}</span>
                  <span>{mandi.mandiName}</span>
                </div>
                <div className="text-[11px] text-slate-500 flex items-center space-x-2 mt-0.5">
                  <span className="flex items-center"><MapPin className="w-3 h-3 text-[#1B5E20] mr-0.5" />{mandi.distanceKm} km away</span>
                  <span>Transport: ~₹{mandi.estTransportCost}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-extrabold text-[#1B5E20]">₹{mandi.netPricePerKg}/kg</div>
                <div className="text-[10px] text-slate-500">Est Net Payout</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Mandi Price Cards */}
      <div className="space-y-2.5">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">All Agmarknet Mandis</h3>
        
        {filteredPrices.length === 0 ? (
          /* Fallback state-average card when crop not found */
          <div className="bg-white border border-amber-800/60 rounded-2xl p-4 text-center space-y-2">
            <div className="text-amber-400 text-xs font-bold uppercase tracking-wide">State-Average Price Placeholder</div>
            <p className="text-xs text-slate-600">
              No live mandi prices reported today for <strong className="text-white">{selectedCrop}</strong>. Showing Haryana state benchmark average.
            </p>
            <div className="text-xl font-bold text-[#1B5E20] py-1">₹28.50 / kg (Avg)</div>
          </div>
        ) : (
          filteredPrices.map((item) => (
            <div key={item.id} className="bg-white rounded-2xl p-3.5 border border-slate-200 flex items-center justify-between shadow-md">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-sm text-slate-800">{item.crop}</span>
                  {renderTrendBadge(item.trend || 'stable')}
                </div>
                <p className="text-xs text-slate-600 font-medium">{item.mandiName}</p>
                <p className="text-[11px] text-slate-500">Date: {item.date}</p>
              </div>

              <div className="text-right space-y-0.5">
                <div className="text-base font-extrabold text-[#1B5E20]">₹{item.modalPrice}/kg</div>
                <div className="text-[10px] text-slate-500">
                  Min ₹{item.minPrice} • Max ₹{item.maxPrice}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
