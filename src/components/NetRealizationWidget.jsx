import React from 'react';
import { Info, Calculator, TrendingDown, TrendingUp, Truck, Building2, Users, CheckCircle2 } from 'lucide-react';

export default function NetRealizationWidget({ price, quantity, grade, crop, selectedAvenue, onSelectAvenue }) {
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
  let priceTrend = 0;

  if (crop === 'Tomato' || crop === 'Onion' || crop === 'Potato') {
    demandStatus = 'Surplus (Prices dropping)';
    demandColor = 'text-rose-700 bg-rose-50 border-rose-200';
    priceTrend = -2;
  } else if (crop === 'Wheat' || crop === 'Rice') {
    demandStatus = 'High Demand (Export up)';
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

  const fpoPrice = basePrice * 0.98;
  const fpoTransport = 0.20;
  const fpoNet = fpoPrice - fpoTransport - qualityWastageDeduction;

  const mandiPrice = basePrice * 1.0;
  const mandiTransport = 0.85;
  const mandiNet = mandiPrice - mandiTransport - qualityWastageDeduction;

  const bulkPrice = basePrice * (1.0 + (priceTrend / 100));
  const bulkTransport = 0.60;
  const bulkNet = bulkPrice - bulkTransport - qualityWastageDeduction;

  const fmt = (val) => val.toFixed(2);
  const bestOptionNet = Math.max(fpoNet, mandiNet, bulkNet);

  // Auto-select best option on initial render if none selected
  React.useEffect(() => {
    if (!selectedAvenue && onSelectAvenue) {
      if (bestOptionNet === fpoNet) onSelectAvenue('fpo');
      else if (bestOptionNet === mandiNet) onSelectAvenue('mandi');
      else onSelectAvenue('bulk');
    }
  }, [bestOptionNet, fpoNet, mandiNet, bulkNet, selectedAvenue, onSelectAvenue]);

  const AvenueCard = ({ id, title, icon: Icon, iconColor, net, offer, transport, isBest }) => {
    const isSelected = selectedAvenue === id;
    
    return (
      <button
        type="button"
        onClick={() => onSelectAvenue && onSelectAvenue(id)}
        className={`w-full text-left p-3 rounded-xl border-2 transition-all flex flex-col space-y-1.5 relative ${
          isSelected 
            ? 'bg-emerald-50 border-emerald-500 shadow-md transform scale-[1.01]' 
            : 'bg-white border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/30'
        }`}
      >
        {isBest && !isSelected && (
          <span className="absolute -top-2.5 -right-2 bg-[#F57F17] text-white text-[9px] font-bold px-2 py-0.5 rounded-md shadow-sm">
            ⭐ Best Yield
          </span>
        )}
        {isSelected && (
          <span className="absolute -top-2.5 -right-2 bg-emerald-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-md shadow-sm flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> Selected
          </span>
        )}
        
        <div className="flex justify-between items-center w-full">
          <span className={`text-xs font-bold flex items-center ${isSelected ? 'text-emerald-900' : 'text-slate-700'}`}>
             <Icon className={`w-4 h-4 mr-2 ${iconColor}`} />
             {title}
          </span>
          <span className={`text-sm font-black ${isSelected ? 'text-emerald-700' : 'text-slate-800'}`}>
            ₹{fmt(net)} <span className="text-[9px] font-semibold text-slate-500">/kg</span>
          </span>
        </div>
        
        <div className="flex justify-between items-center text-[10px] text-slate-500 font-medium border-t border-slate-100 pt-1.5 w-full">
          <span>Offer: ₹{fmt(offer)}</span>
          <span className="flex items-center text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded">
            <Truck className="w-3 h-3 mr-1" /> -₹{fmt(transport)} Transport
          </span>
        </div>
      </button>
    );
  };

  return (
    <div className="bg-slate-50 rounded-xl border border-slate-300 mt-5 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="bg-[#1B5E20] p-3 flex items-center justify-between text-white">
        <div className="flex items-center font-bold text-xs">
          <Calculator className="w-4 h-4 mr-1.5" />
          <span>Select Buyer Avenue (AI Math)</span>
        </div>
        <span className="text-[9px] bg-emerald-600 px-2 py-0.5 rounded-full border border-emerald-400 tracking-wider">CHOOSE ONE</span>
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

        {qualityPct > 0 && (
          <div className="flex justify-between items-center text-xs font-semibold text-rose-600 bg-rose-50 p-2 rounded-lg border border-rose-100">
            <span>Quality Adjustment ({grade})</span>
            <span>- ₹{fmt(qualityWastageDeduction)}/kg</span>
          </div>
        )}
        
        <div className="space-y-2 pt-1">
          <h4 className="text-[10px] uppercase font-extrabold text-slate-500 tracking-wider mb-1">Target Market</h4>
          
          <AvenueCard
            id="fpo"
            title="Local FPO Center"
            icon={Users}
            iconColor="text-blue-600"
            net={fpoNet}
            offer={fpoPrice}
            transport={fpoTransport}
            isBest={bestOptionNet === fpoNet}
          />
          <AvenueCard
            id="mandi"
            title="Mandi APMC"
            icon={Building2}
            iconColor="text-orange-600"
            net={mandiNet}
            offer={mandiPrice}
            transport={mandiTransport}
            isBest={bestOptionNet === mandiNet}
          />
          <AvenueCard
            id="bulk"
            title="Direct to Bulk Buyer"
            icon={Building2}
            iconColor="text-purple-600"
            net={bulkNet}
            offer={bulkPrice}
            transport={bulkTransport}
            isBest={bestOptionNet === bulkNet}
          />
        </div>

        <div className="pt-2 text-[10px] text-center text-emerald-700 font-bold flex items-center justify-center bg-emerald-50 rounded p-1 border border-emerald-100">
          <Info className="w-3 h-3 mr-1" />
          Zero Platform Commission for Farmers (0%)
        </div>
      </div>
    </div>
  );
}
