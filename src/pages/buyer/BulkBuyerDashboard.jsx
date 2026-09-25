import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Factory, TrendingUp, ShieldCheck, FileText, ClipboardList, Activity, ArrowRight, FileCheck } from 'lucide-react';
import ProfileHeader from '../../components/ProfileHeader';
import { t } from '../../utils/translations';

export default function BulkBuyerDashboard() {
  const { listings, requirements, currentUser, language } = useApp();
  const [activeTab, setActiveTab] = useState('aggregated'); // aggregated | tenders | contracts

  return (
    <div className="space-y-4 p-4 pb-24 bg-[#f9f8f3] min-h-screen text-slate-800">
      <ProfileHeader />

      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 to-[#2E7D32] text-white p-4 rounded-2xl shadow-lg border border-slate-700">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-black flex items-center">
              <Factory className="w-5 h-5 mr-2 text-amber-400" />
              Corporate Procurement Hub
            </h1>
            <p className="text-xs text-slate-300 font-medium mt-1">Industrial Bulk Buying & e-Tenders</p>
          </div>
          <div className="text-right">
            <span className="text-[10px] bg-white/20 px-2 py-1 rounded border border-white/30">GSTIN Verified</span>
          </div>
        </div>
      </div>

      {/* Analytics */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center space-x-2 mb-1">
            <ClipboardList className="w-4 h-4 text-blue-600" />
            <span className="text-xs font-bold text-slate-600">Active Tenders</span>
          </div>
          <div className="text-xl font-black text-slate-800">3</div>
        </div>
        <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center space-x-2 mb-1">
            <Activity className="w-4 h-4 text-emerald-600" />
            <span className="text-xs font-bold text-slate-600">Fulfilled (Tons)</span>
          </div>
          <div className="text-xl font-black text-emerald-700">1,240</div>
        </div>
      </div>

      {/* Auto-Aggregated Batches (Matching FPO Widget) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 bg-blue-600 text-white text-[9px] font-black px-3 py-1 rounded-bl-xl tracking-wider uppercase shadow-sm">
          AI Aggregation Match
        </div>
        
        <h2 className="font-extrabold text-sm text-slate-800 mb-4 flex items-center">
          <TrendingUp className="w-4 h-4 mr-1.5 text-blue-600" />
          Ready-to-Buy Aggregated Batches
        </h2>

        <div className="space-y-4">
          <div className="border border-blue-100 bg-blue-50/30 rounded-xl p-3">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-bold text-slate-800 text-sm">Wheat (Sharbati) - 120 Tons</h3>
                <p className="text-xs text-slate-500">Aggregated from 50 Farmers • Sonipat Cluster</p>
              </div>
              <span className="bg-emerald-100 text-emerald-700 font-bold px-2 py-0.5 rounded text-xs border border-emerald-200">
                ₹2,850/qtl
              </span>
            </div>

            <div className="flex items-center space-x-2 mb-3">
              <span className="flex items-center text-[10px] font-bold text-slate-600 bg-white border border-slate-200 px-1.5 py-0.5 rounded">
                <ShieldCheck className="w-3 h-3 text-emerald-600 mr-1" /> NABL Grade A (Moisture 8%)
              </span>
            </div>

            <button className="w-full py-2 bg-slate-900 text-white rounded-lg text-xs font-bold flex items-center justify-center hover:bg-slate-800 transition-colors">
              Execute Smart Contract & Escrow <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Quality Assured Direct Listings */}
      <div className="space-y-3">
        <h2 className="font-extrabold text-sm text-slate-800 flex items-center px-1">
          <FileCheck className="w-4 h-4 mr-1.5 text-emerald-600" />
          NABL Verified Large Lots
        </h2>
        
        {listings.filter(l => l.quantity >= 5000).map(listing => (
          <div key={listing.id} className="bg-white rounded-2xl border border-slate-200 p-3 shadow-sm">
             <div className="flex justify-between items-center mb-1">
               <span className="font-bold text-slate-800">{listing.crop}</span>
               <span className="font-black text-emerald-700">₹{listing.pricePerUnit}/kg</span>
             </div>
             <p className="text-xs text-slate-500 mb-2">{listing.quantity.toLocaleString()} kg available • {listing.location}</p>
             <div className="flex justify-between items-center text-[10px]">
               <span className="bg-emerald-50 text-emerald-700 px-2 py-1 rounded font-bold border border-emerald-100 flex items-center">
                 <ShieldCheck className="w-3 h-3 mr-1" /> Lab Verified
               </span>
               <button className="text-blue-600 font-bold px-3 py-1 border border-blue-200 rounded hover:bg-blue-50">
                 View e-NAM Certificate
               </button>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
}
