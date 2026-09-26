import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Package, Plus, CheckCircle2, AlertTriangle, Eye, ShieldCheck, Tag } from 'lucide-react';
import CreateLotScreen from './CreateLotScreen';

export default function FarmerProduceScreen() {
  const { listings, triggerToast } = useApp();
  const [showCreateLot, setShowCreateLot] = useState(false);

  if (showCreateLot) {
    return <CreateLotScreen onBack={() => setShowCreateLot(false)} onLotCreated={() => setShowCreateLot(false)} />;
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 p-4 max-w-5xl mx-auto space-y-4">
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-200">
            MY PRODUCE & LOTS
          </span>
          <h1 className="text-xl font-black text-slate-900 tracking-tight mt-1">Listed Crops & Harvest Batches</h1>
          <p className="text-xs text-slate-500 font-medium">Manage your active produce listings, grade certificates, and quantities</p>
        </div>

        <button
          onClick={() => setShowCreateLot(true)}
          className="px-4 py-2.5 bg-[#2E7D32] hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm flex items-center space-x-1.5 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add New Produce</span>
        </button>
      </div>

      {/* Produce Grid / List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {listings && listings.length > 0 ? (
          listings.map(item => (
            <div key={item.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 font-bold rounded text-[10px]">
                    {item.variety || 'Sharbati'}
                  </span>
                  <h3 className="font-extrabold text-base text-slate-900 mt-1">{item.crop}</h3>
                </div>
                <span className="text-lg font-black text-emerald-700">₹{item.pricePerUnit || item.price}/kg</span>
              </div>

              <div className="grid grid-cols-2 gap-2 bg-slate-50 p-2.5 rounded-xl text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block">QUANTITY</span>
                  <span className="font-bold text-slate-800">{item.quantity} {item.unit || 'kg'}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block">LOCATION</span>
                  <span className="font-bold text-slate-800">{item.location || 'Chomu, Jaipur'}</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100">
                <span className="text-emerald-700 font-bold flex items-center space-x-1">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Quality Self-Verified</span>
                </span>
                <button 
                  onClick={() => triggerToast(`Listing ${item.crop} is active on AgriVa Marketplace`, 'Listing Active', 'info')}
                  className="text-[#2E7D32] font-bold hover:underline"
                >
                  View Details ➔
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-2 bg-white p-8 rounded-2xl border border-slate-200 text-center space-y-3">
            <Package className="w-10 h-10 text-slate-400 mx-auto" />
            <h3 className="font-bold text-slate-700 text-sm">No produce listed yet</h3>
            <p className="text-xs text-slate-500">Click the button below to list your crop harvest for buyers</p>
            <button
              onClick={() => setShowCreateLot(true)}
              className="px-5 py-2.5 bg-[#2E7D32] text-white rounded-xl text-xs font-bold shadow-sm inline-flex items-center space-x-1"
            >
              <Plus className="w-4 h-4 mr-1" /> Add Your First Produce
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
