import React from 'react';
import { Activity, BarChart2, TrendingUp, TrendingDown, Layers, CheckCircle2, Factory, Truck } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { t } from '../utils/translations';

export default function FpoIntelligenceWidget() {
  const { language } = useApp();
  
  return (
    <div className="space-y-5 font-sans leading-relaxed">
      {/* 1. Demand Forecasting Model */}
      <div className="bg-white border-2 border-emerald-500 rounded-3xl p-5 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 bg-emerald-600 text-white text-[10px] font-bold px-3.5 py-1 rounded-bl-2xl tracking-wider uppercase shadow-xs">
          {t(language, 'aiForecastEngine')}
        </div>
        
        <div className="flex items-center space-x-2.5 mb-4 pt-1">
          <Activity className="w-5 h-5 text-emerald-600 shrink-0" />
          <h3 className="text-base font-extrabold text-emerald-900 leading-relaxed">{t(language, 'forecastTitle')}</h3>
        </div>

        <div className="bg-emerald-50/90 rounded-2xl p-4 border border-emerald-200/80 space-y-4">
          <div className="flex justify-between items-start gap-3">
            <div className="space-y-1.5 flex-1">
              <p className="text-sm font-bold text-emerald-950 leading-relaxed">{t(language, 'forecastCrop')}</p>
              <p className="text-xs font-semibold text-emerald-700/90 leading-relaxed">{t(language, 'forecastTrend')}</p>
            </div>
            <span className="flex items-center text-emerald-800 font-extrabold bg-emerald-200/60 px-3 py-1.5 rounded-xl text-xs border border-emerald-300/70 shrink-0">
              <TrendingUp className="w-4 h-4 mr-1 text-emerald-700" />
              +14% Demand
            </span>
          </div>
          
          <div className="pt-3 border-t border-emerald-200/70 space-y-2">
            <p className="text-xs font-bold text-emerald-950 tracking-wide">{t(language, 'forecastActionLabel')}</p>
            <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-medium" dangerouslySetInnerHTML={{ __html: t(language, 'forecastActionDesc') }} />
          </div>
        </div>
      </div>

      {/* 2. Auto-Aggregation Logic */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm relative space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Layers className="w-5 h-5 text-blue-600 shrink-0" />
            <h3 className="text-base font-extrabold text-slate-900">{t(language, 'autoAggregation')}</h3>
          </div>
          <span className="text-[10px] bg-blue-100 text-blue-800 border border-blue-200 px-2.5 py-1 rounded-full font-bold uppercase">
            {t(language, 'activeBatches')}
          </span>
        </div>

        <div className="space-y-3.5">
          <div className="bg-blue-50/60 p-4 rounded-2xl border border-blue-100 flex flex-col space-y-2.5">
            <div className="flex justify-between items-center">
              <span className="text-xs sm:text-sm font-bold text-slate-900">Wheat {t(language, 'bulkOrder')} #AGR-8902</span>
              <span className="text-xs sm:text-sm font-black text-blue-700">120 {t(language, 'tons')}</span>
            </div>
            
            <div className="flex items-center space-x-4 text-xs text-slate-600">
              <div className="flex items-center">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mr-1.5 shrink-0" />
                {t(language, 'aggregatedFrom')} 50 {t(language, 'smallFarms')}
              </div>
              <div className="flex items-center">
                <Factory className="w-3.5 h-3.5 text-slate-400 mr-1.5 shrink-0" />
                {t(language, 'directToMills')}
              </div>
            </div>

            <div className="relative pt-2">
              <div className="overflow-hidden h-2 mb-1.5 flex rounded-full bg-blue-200">
                <div style={{ width: "100%" }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-600"></div>
              </div>
              <p className="text-[10px] font-semibold text-slate-500 text-right">{t(language, 'targetReached')}</p>
            </div>
          </div>
          
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex flex-col space-y-2.5 opacity-85">
            <div className="flex justify-between items-center">
              <span className="text-xs sm:text-sm font-bold text-slate-800">Onion {t(language, 'bulkOrder')} #AGR-8903</span>
              <span className="text-xs sm:text-sm font-black text-slate-800">24 / 50 {t(language, 'tons')}</span>
            </div>
            <div className="flex items-center space-x-4 text-xs text-slate-600">
              <div className="flex items-center">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-500 mr-1.5 shrink-0" />
                {t(language, 'aggregatedFrom')} 14 {t(language, 'smallFarms')}
              </div>
            </div>
            <div className="relative pt-1">
              <div className="overflow-hidden h-2 mb-1.5 flex rounded-full bg-slate-200">
                <div style={{ width: "48%" }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-amber-500"></div>
              </div>
              <p className="text-[10px] font-medium text-slate-500">{t(language, 'awaitingLots')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
