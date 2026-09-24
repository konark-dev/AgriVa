import React from 'react';
import { calculateNetRealizationPerUnit } from '../utils/qualityEngine';
import { Info, Calculator, TrendingDown } from 'lucide-react';

export default function NetRealizationWidget({ price, quantity, grade }) {
  if (!price || !quantity || Number(price) <= 0 || Number(quantity) <= 0) return null;

  const breakdown = calculateNetRealizationPerUnit({
    pricePerUnit: Number(price),
    quantityKg: Number(quantity),
    qualityGrade: grade || 'Grade A'
  });

  if (!breakdown) return null;

  const fmt = (val) => val.toFixed(2);

  return (
    <div className="bg-emerald-50 rounded-xl p-3 border border-emerald-200 mt-4 space-y-2 text-xs shadow-sm">
      <div className="flex items-center text-emerald-800 font-extrabold pb-2 border-b border-emerald-200">
        <Calculator className="w-4 h-4 mr-1.5" />
        <span>Net-Realization Engine (Per Kg Breakdown)</span>
      </div>
      
      <div className="space-y-1.5 pt-1 text-slate-700">
        <div className="flex justify-between font-semibold">
          <span>Market Price (Declared)</span>
          <span className="text-slate-900">?{fmt(breakdown.pricePerUnit)}</span>
        </div>
        
        <div className="flex justify-between text-rose-600">
          <span className="flex items-center gap-1">
            <TrendingDown className="w-3 h-3" />
            Transport Est. (50km Hub)
          </span>
          <span>- ?{fmt(breakdown.transportCostEstimate)}</span>
        </div>
        
        <div className="flex justify-between text-rose-600">
          <span className="flex items-center gap-1">
            <TrendingDown className="w-3 h-3" />
            Platform Commission (5%)
          </span>
          <span>- ?{fmt(breakdown.commissionAmount)}</span>
        </div>
        
        <div className="flex justify-between text-rose-600">
          <span className="flex items-center gap-1">
            <TrendingDown className="w-3 h-3" />
            Quality Wastage ({grade})
          </span>
          <span>- ?{fmt(breakdown.qualityWastageDeduction)}</span>
        </div>
      </div>
      
      <div className="mt-2 pt-2 border-t border-emerald-200 flex justify-between items-center bg-emerald-100 p-2 rounded-lg">
        <span className="font-bold text-emerald-900 flex items-center">
          <Info className="w-3.5 h-3.5 mr-1 text-emerald-600" />
          Actual Take-Home (Net)
        </span>
        <span className="text-lg font-black text-emerald-700">?{fmt(breakdown.netRealization)}</span>
      </div>
    </div>
  );
}
