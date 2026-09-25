import React from 'react';
import { ArrowLeft, Truck, MapPin, Clock, Route, CheckCircle, Navigation, TrendingDown, Factory } from 'lucide-react';

export default function RouteComparisonView({ onBack }) {
  return (
    <div className="min-h-screen bg-[#f9f8f3] flex flex-col font-sans">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-white border-b border-slate-200 sticky top-0 z-10">
        <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-slate-100">
          <ArrowLeft className="w-6 h-6 text-slate-800" />
        </button>
        <div className="text-center">
          <h1 className="text-lg font-bold text-slate-800 flex items-center justify-center gap-1">
            VRP Smart Routing
          </h1>
          <p className="text-xs text-slate-500">Vehicle Routing Problem (VRP) Engine</p>
        </div>
        <div className="w-8"></div>
      </div>

      <div className="p-4 space-y-4">
        
        {/* Explanation Card */}
        <div className="bg-gradient-to-r from-[#2E7D32] to-emerald-800 rounded-2xl p-4 text-white shadow-lg">
          <div className="flex items-center space-x-2 mb-2">
            <Route className="w-5 h-5 text-emerald-300" />
            <h3 className="font-bold">Anti-Spoilage Aggregation Routing</h3>
          </div>
          <p className="text-xs text-emerald-100 leading-relaxed mb-3">
            Sequences pickups across scattered small farms into one bulk buyer drop. 
            By solving the Vehicle Routing Problem (VRP) in real-time, we minimize transit spoilage time—the primary cause of distress selling.
          </p>
          <div className="flex items-center space-x-4 text-[11px] font-bold">
            <span className="flex items-center bg-white/20 px-2 py-1 rounded">
              <TrendingDown className="w-3.5 h-3.5 mr-1 text-emerald-300" /> -18% Transit Time
            </span>
            <span className="flex items-center bg-white/20 px-2 py-1 rounded">
              <TrendingDown className="w-3.5 h-3.5 mr-1 text-emerald-300" /> -12% Fuel Cost
            </span>
          </div>
        </div>

        {/* The Route Sequence */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm relative overflow-hidden">
          <h4 className="font-bold text-slate-800 text-sm mb-4 border-b border-slate-100 pb-2">
            Optimized Bulk Order #AGR-8902 (120 Tons)
          </h4>

          <div className="relative pl-6 space-y-6 before:absolute before:inset-0 before:ml-[1.4rem] before:h-full before:w-0.5 before:bg-slate-200 before:z-0">
            
            {/* Start */}
            <div className="relative z-10 flex items-start group">
              <div className="w-8 h-8 rounded-full bg-slate-100 border-2 border-slate-300 flex items-center justify-center shrink-0 -ml-3">
                <Truck className="w-4 h-4 text-slate-500" />
              </div>
              <div className="ml-4 flex-1">
                <h5 className="font-bold text-xs text-slate-800">Transporter Hub (Start)</h5>
                <p className="text-[10px] text-slate-500">Panipat Highway • 06:00 AM</p>
              </div>
            </div>

            {/* Farm 1 */}
            <div className="relative z-10 flex items-start group">
              <div className="w-8 h-8 rounded-full bg-amber-50 border-2 border-amber-400 flex items-center justify-center shrink-0 -ml-3">
                <MapPin className="w-4 h-4 text-amber-600" />
              </div>
              <div className="ml-4 flex-1">
                <h5 className="font-bold text-xs text-slate-800">Farm A (Node 1)</h5>
                <p className="text-[10px] text-slate-500 mb-1">Karnal Village • Pickup 40 Tons</p>
                <div className="bg-slate-50 border border-slate-200 rounded p-1.5 text-[9px] text-slate-600 font-medium inline-block">
                  <Clock className="w-3 h-3 inline mr-1 text-emerald-600" />
                  Saved 45 mins by grouping with Farm B
                </div>
              </div>
            </div>

            {/* Farm 2 */}
            <div className="relative z-10 flex items-start group">
              <div className="w-8 h-8 rounded-full bg-amber-50 border-2 border-amber-400 flex items-center justify-center shrink-0 -ml-3">
                <MapPin className="w-4 h-4 text-amber-600" />
              </div>
              <div className="ml-4 flex-1">
                <h5 className="font-bold text-xs text-slate-800">Farm B & C (Node 2 Cluster)</h5>
                <p className="text-[10px] text-slate-500 mb-1">Sonipat Farms • Pickup 80 Tons</p>
                <div className="bg-slate-50 border border-slate-200 rounded p-1.5 text-[9px] text-slate-600 font-medium inline-block">
                  <CheckCircle className="w-3 h-3 inline mr-1 text-emerald-600" />
                  Full Truckload Achieved (120 Tons)
                </div>
              </div>
            </div>

            {/* Drop off */}
            <div className="relative z-10 flex items-start group">
              <div className="w-8 h-8 rounded-full bg-emerald-100 border-2 border-emerald-500 flex items-center justify-center shrink-0 -ml-3 shadow-md">
                <Factory className="w-4 h-4 text-emerald-700" />
              </div>
              <div className="ml-4 flex-1">
                <h5 className="font-bold text-sm text-emerald-700">Britannia Mills (Drop-off)</h5>
                <p className="text-[10px] text-emerald-600/80 mb-2">Delhi Industrial Area • 11:30 AM</p>
                <button className="w-full py-2 bg-[#2E7D32] text-white rounded-lg text-xs font-bold shadow-sm flex items-center justify-center">
                  <Navigation className="w-4 h-4 mr-2" /> Start Guided Route
                </button>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
