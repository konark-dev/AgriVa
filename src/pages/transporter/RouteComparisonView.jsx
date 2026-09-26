import React, { useState } from 'react';
import { ArrowLeft, Route, Layers, Zap } from 'lucide-react';
import RouteOptimizationDashboard from '../../components/RouteOptimizationDashboard';
import OrderLifecycleFlow from '../../components/OrderLifecycleFlow';

export default function RouteComparisonView({ onBack }) {
  const [activeView, setActiveView] = useState('optimizer'); // optimizer | flow

  return (
    <div className="min-h-screen bg-[#f9f8f3] flex flex-col font-sans">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-white border-b border-slate-200 sticky top-0 z-20">
        <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-slate-100 transition">
          <ArrowLeft className="w-6 h-6 text-slate-800" />
        </button>
        <div className="text-center">
          <h1 className="text-base sm:text-lg font-black text-slate-800 flex items-center justify-center gap-1.5">
            KisanRoute VRP Optima
          </h1>
          <p className="text-[11px] text-slate-500 font-medium">Multi-Vehicle Combinatorial Route Engine</p>
        </div>
        
        {/* Toggle Mode */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
          <button
            onClick={() => setActiveView('optimizer')}
            className={`px-3 py-1 rounded-lg font-bold transition ${
              activeView === 'optimizer'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Route Solver
          </button>
          <button
            onClick={() => setActiveView('flow')}
            className={`px-3 py-1 rounded-lg font-bold transition ${
              activeView === 'flow'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Order Flow
          </button>
        </div>
      </div>

      {/* Main View Container */}
      <div className="p-3 sm:p-6 max-w-7xl mx-auto w-full">
        {activeView === 'optimizer' && <RouteOptimizationDashboard />}
        {activeView === 'flow' && (
          <OrderLifecycleFlow
            onNavigateToRoute={() => setActiveView('optimizer')}
          />
        )}
      </div>
    </div>
  );
}
