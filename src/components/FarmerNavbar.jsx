import React from 'react';
import { useApp } from '../context/AppContext';
import { Store, ChevronDown, Bell, User, UserCheck } from 'lucide-react';

export default function FarmerNavbar({ activeTab, setActiveTab }) {
  const { currentUser, language, setLanguage } = useApp();

  const tabs = [
    { id: 'dashboard', label: 'Home' },
    { id: 'my_produce', label: 'My Produce' },
    { id: 'market', label: 'Market' },
    { id: 'orders', label: 'Orders' },
    { id: 'storage', label: 'Storage' }
  ];

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 px-4 py-2.5 flex items-center justify-between shadow-sm">
      {/* Brand Logo & Tabs */}
      <div className="flex items-center space-x-6">
        <div 
          onClick={() => setActiveTab('dashboard')} 
          className="flex items-center space-x-2 cursor-pointer shrink-0"
        >
          <div className="w-8 h-8 rounded-xl bg-[#2E7D32] flex items-center justify-center text-white shadow-sm">
            <Store className="w-5 h-5" />
          </div>
          <span className="text-lg font-black text-[#2E7D32] tracking-tight">Agriva Market</span>
        </div>

        {/* Navigation Tabs Bar */}
        <nav className="hidden sm:flex items-center space-x-1">
          {tabs.map(tab => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-[#2E7D32] text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Right User Info & Language */}
      <div className="flex items-center space-x-3 text-xs text-slate-700">
        <button
          onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
          className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold border border-slate-200 transition-colors"
        >
          {language === 'hi' ? 'हिंदी' : 'EN'}
        </button>

        <div className="flex items-center space-x-1 font-medium bg-slate-50 border border-slate-200 rounded-full px-3 py-1">
          <span className="text-slate-400 font-normal">Farmer:</span>
          <span className="font-bold text-slate-800">{currentUser?.name || 'Ramesh Kumar'}</span>
          <span className="text-slate-400">({currentUser?.village || 'Chomu Mandi'})</span>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-1" />
        </div>
      </div>
    </header>
  );
}
