import React from 'react';
import { Activity, BarChart2, TrendingUp, TrendingDown, Layers, CheckCircle2, Factory, Truck } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { t } from '../utils/translations';

export default function FpoIntelligenceWidget() {
  const { language } = useApp();
  
  return (
    <div className="space-y-4">
      {/* 1. Demand Forecasting Model */}
      <div className="bg-white border-2 border-emerald-500 rounded-2xl p-4 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 bg-emerald-500 text-white text-[9px] font-black px-3 py-1 rounded-bl-xl tracking-wider uppercase">
          {t(language, 'aiForecastEngine')}
        </div>
        
        <div className="flex items-center space-x-2 mb-3">
          <Activity className="w-5 h-5 text-emerald-600" />
          <h3 className="text-sm font-extrabold text-emerald-900">{t(language, 'forecastTitle')}</h3>
        </div>

        <div className="bg-emerald-50 rounded-xl p-3 border border-emerald-100">
          <div className="flex justify-between items-start mb-2">
            <div>
              <p className="text-xs font-bold text-emerald-800">{t(language, 'forecastCrop')}</p>
              <p className="text-[10px] font-medium text-emerald-600/80 mt-0.5">{t(language, 'forecastTrend')}</p>
            </div>
            <span className="flex items-center text-emerald-700 font-bold bg-emerald-200/50 px-2 py-1 rounded text-xs">
              <TrendingUp className="w-3.5 h-3.5 mr-1" />
              +14% Demand
            </span>
          </div>
          
          <div className="mt-3 pt-3 border-t border-emerald-200/60">
            <p className="text-[11px] font-semibold text-emerald-900 mb-1">{t(language, 'forecastActionLabel')}</p>
            <p className="text-xs text-slate-700 leading-snug" dangerouslySetInnerHTML={{ __html: t(language, 'forecastActionDesc') }} />
          </div>
        </div>
      </div>

      {/* 2. Auto-Aggregation Logic */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm relative">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Layers className="w-5 h-5 text-blue-600" />
            <h3 className="text-sm font-extrabold text-slate-800">{t(language, 'autoAggregation')}</h3>
          </div>
          <span className="text-[9px] bg-blue-100 text-blue-800 border border-blue-200 px-2 py-0.5 rounded font-bold uppercase">
            {t(language, 'activeBatches')}
          </span>
        </div>

        <div className="space-y-3">
          <div className="bg-blue-50/50 p-3 rounded-xl border border-blue-100 flex flex-col">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-bold text-slate-800">Wheat {t(language, 'bulkOrder')} #AGR-8902</span>
              <span className="text-xs font-black text-blue-700">120 {t(language, 'tons')}</span>
            </div>
            
            <div className="flex items-center space-x-4 text-[10px] text-slate-600 mb-3">
              <div className="flex items-center">
                <CheckCircle2 className="w-3 h-3 text-emerald-500 mr-1" />
                {t(language, 'aggregatedFrom')} 50 {t(language, 'smallFarms')}
              </div>
              <div className="flex items-center">
                <Factory className="w-3 h-3 text-slate-400 mr-1" />
                {t(language, 'directToMills')}
              </div>
            </div>

            <div className="relative pt-4">
              <div className="overflow-hidden h-1.5 mb-2 text-xs flex rounded-full bg-blue-200">
                <div style={{ width: "100%" }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-600"></div>
              </div>
              <p className="text-[9px] font-semibold text-slate-500 text-right">{t(language, 'targetReached')}</p>
            </div>
          </div>
          
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex flex-col opacity-75">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-bold text-slate-700">Onion {t(language, 'bulkOrder')} #AGR-8903</span>
              <span className="text-xs font-black text-slate-700">24 / 50 {t(language, 'tons')}</span>
            </div>
            <div className="flex items-center space-x-4 text-[10px] text-slate-600 mb-3">
              <div className="flex items-center">
                <CheckCircle2 className="w-3 h-3 text-amber-500 mr-1" />
                {t(language, 'aggregatedFrom')} 14 {t(language, 'smallFarms')}
              </div>
            </div>
            <div className="relative pt-1">
              <div className="overflow-hidden h-1.5 mb-2 text-xs flex rounded-full bg-slate-200">
                <div style={{ width: "48%" }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-amber-500"></div>
              </div>
              <p className="text-[9px] font-medium text-slate-500">{t(language, 'awaitingLots')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
