import React from 'react';
import { Info, Calculator, TrendingDown, TrendingUp, Truck, Building2, Users } from 'lucide-react';

export default function NetRealizationWidget({ price, quantity, grade, crop }) {
  if (!price || !quantity || Number(price) <= 0 || Number(quantity) <= 0) return null;

  const basePrice = Number(price);

  // Quality Penalty Logic
  let qualityPct = 0;
  if (grade === 'Grade B') qualityPct = 5.0;
  else if (grade === 'Grade C') qualityPct = 12.0;
  else if (grade === 'Processing') qualityPct = 15.0;

  const qualityWastageDeduction = basePrice * (qualityPct / 100);

  // Demand Engine Logic
  let demandStatus = 'Stable Demand';
  let demandColor = 'text-blue-700 bg-blue-50 border-blue-200';
  let priceTrend = 0; // % diff from base

  if (crop === 'Tomato' || crop === 'Onion' || crop === 'Potato') {
    demandStatus = 'Surplus / High Supply (Prices dropping)';
    demandColor = 'text-rose-700 bg-rose-50 border-rose-200';
    priceTrend = -2;
  } else if (crop === 'Wheat' || crop === 'Rice') {
    demandStatus = 'High Demand (Export volume up)';
    demandColor = 'text-emerald-700 bg-emerald-50 border-emerald-200';
    priceTrend = +2.5;
  } else if (crop === 'Cotton') {
    demandStatus = 'Peak Procurement Season';
    demandColor = 'text-emerald-700 bg-emerald-50 border-emerald-200';
    priceTrend = +2;
  } else {
    demandStatus = 'Steady Demand Index';
    demandColor = 'text-blue-700 bg-blue-50 border-blue-200';
    priceTrend = +0.5;
  }

  // Buyer & Transport Comparison
  // 1. FPO Collection Center
  const fpoPrice = basePrice * 0.98; // 2% lower
  const fpoTransport = 0.20; // Local, very cheap
  const fpoNet = fpoPrice - fpoTransport - qualityWastageDeduction;

  // 2. Mandi APMC
  const mandiPrice = basePrice * 1.0; // Market rate exactly
  const mandiTransport = 0.85; // Medium distance (e.g., 50km)
  const mandiNet = mandiPrice - mandiTransport - qualityWastageDeduction;

  // 3. Bulk Buyer / Middleman
  const bulkPrice = basePrice * (1.0 + (priceTrend / 100)); // Price adjusted by dynamic demand
  const bulkTransport = 0.60; // Direct pickup/hub
  const bulkNet = bulkPrice - bulkTransport - qualityWastageDeduction;

  const fmt = (val) => val.toFixed(2);

  const bestOption = Math.max(fpoNet, mandiNet, bulkNet);

  return (
    <div className="bg-white rounded-xl border border-[#1B5E20] mt-4 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="bg-[#1B5E20] p-3 flex items-center justify-between text-white">
        <div className="flex items-center font-bold text-xs">
          <Calculator className="w-4 h-4 mr-1.5" />
          <span>AI Net-Realization & Market Engine</span>
        </div>
        <span className="text-[9px] bg-green-700 px-2 py-0.5 rounded-full border border-green-500 tracking-wider">REAL-TIME</span>
      </div>
      
      <div className="p-3 space-y-3">
        {/* Demand Forecasting */}
        <div className={`p-2 rounded-lg border text-xs font-bold flex items-center justify-between ${demandColor}`}>
           <span>{crop || 'Crop'} Forecast:</span>
           <span className="flex items-center text-[11px]">
             {priceTrend > 0 ? <TrendingUp className="w-3.5 h-3.5 mr-1" /> : <TrendingDown className="w-3.5 h-3.5 mr-1" />}
             {demandStatus}
           </span>
        </div>

        {/* Quality Deduction Warning */}
        {qualityPct > 0 && (
          <div className="flex justify-between items-center text-xs font-semibold text-rose-600 bg-rose-50 p-2 rounded-lg border border-rose-100">
            <span>Quality Adjustment ({grade})</span>
            <span>- ₹{fmt(qualityWastageDeduction)}/kg</span>
          </div>
        )}
        
        {/* Buyer Comparisons */}
        <div className="space-y-2 pt-1">
          <h4 className="text-[10px] uppercase font-extrabold text-slate-400 tracking-wider">Dynamic Buyer Options (Net per Kg)</h4>
          
          {/* FPO */}
          <div className={`p-2 rounded-xl border flex flex-col space-y-1 relative ${bestOption === fpoNet ? 'bg-emerald-50 border-emerald-400 shadow-sm' : 'bg-slate-50 border-slate-200'}`}>
            {bestOption === fpoNet && <span className="absolute -top-2.5 -right-2 bg-[#F57F17] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md shadow-sm">⭐ Best Option</span>}
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-slate-800 flex items-center">
                 <Users className="w-3.5 h-3.5 mr-1.5 text-blue-600" />
                 Sell to FPO (Local)
              </span>
              <span className="text-sm font-black text-[#1B5E20]">₹{fmt(fpoNet)} <span className="text-[9px] font-semibold text-slate-500">/kg</span></span>
            </div>
            <div className="flex justify-between text-[10px] text-slate-500 font-medium border-t border-slate-200/60 pt-1 mt-0.5">
              <span>Offer: ₹{fmt(fpoPrice)}</span>
              <span className="flex items-center"><Truck className="w-3 h-3 mr-0.5" /> Est. Transport: -₹{fmt(fpoTransport)}</span>
            </div>
          </div>

          {/* Mandi */}
          <div className={`p-2 rounded-xl border flex flex-col space-y-1 relative ${bestOption === mandiNet ? 'bg-emerald-50 border-emerald-400 shadow-sm' : 'bg-slate-50 border-slate-200'}`}>
            {bestOption === mandiNet && <span className="absolute -top-2.5 -right-2 bg-[#F57F17] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md shadow-sm">⭐ Best Option</span>}
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-slate-800 flex items-center">
                 <Building2 className="w-3.5 h-3.5 mr-1.5 text-orange-600" />
                 Sell at Mandi APMC
              </span>
              <span className="text-sm font-black text-[#1B5E20]">₹{fmt(mandiNet)} <span className="text-[9px] font-semibold text-slate-500">/kg</span></span>
            </div>
            <div className="flex justify-between text-[10px] text-slate-500 font-medium border-t border-slate-200/60 pt-1 mt-0.5">
              <span>Offer: ₹{fmt(mandiPrice)}</span>
              <span className="flex items-center"><Truck className="w-3 h-3 mr-0.5" /> Est. Transport: -₹{fmt(mandiTransport)}</span>
            </div>
          </div>

          {/* Bulk Buyer */}
          <div className={`p-2 rounded-xl border flex flex-col space-y-1 relative ${bestOption === bulkNet ? 'bg-emerald-50 border-emerald-400 shadow-sm' : 'bg-slate-50 border-slate-200'}`}>
            {bestOption === bulkNet && <span className="absolute -top-2.5 -right-2 bg-[#F57F17] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md shadow-sm">⭐ Best Option</span>}
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-slate-800 flex items-center">
                 <Building2 className="w-3.5 h-3.5 mr-1.5 text-purple-600" />
                 Direct to Bulk Buyer
              </span>
              <span className="text-sm font-black text-[#1B5E20]">₹{fmt(bulkNet)} <span className="text-[9px] font-semibold text-slate-500">/kg</span></span>
            </div>
            <div className="flex justify-between text-[10px] text-slate-500 font-medium border-t border-slate-200/60 pt-1 mt-0.5">
              <span>Offer: ₹{fmt(bulkPrice)}</span>
              <span className="flex items-center"><Truck className="w-3 h-3 mr-0.5" /> Est. Transport: -₹{fmt(bulkTransport)}</span>
            </div>
          </div>
        </div>

        <div className="pt-2 text-[10px] text-center text-slate-400 font-bold flex items-center justify-center border-t border-slate-100">
          <Info className="w-3 h-3 mr-1" />
          Zero Platform Commission for Farmers (0%)
        </div>
      </div>
    </div>
  );
}
