import React from 'react';
import { useApp } from '../context/AppContext';
import { Globe, Shield, Sparkles, Smartphone, CreditCard, Navigation, ExternalLink } from 'lucide-react';

export default function SettingsPage() {
  const { language, setLanguage, currentUser, switchRole, t } = useApp();

  return (
    <div className="space-y-4 p-4 pb-24 text-xs">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-800">Settings & App Info</h2>
          <p className="text-slate-500">Language preferences & platform future scope</p>
        </div>
      </div>

      {/* Language Toggle */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 space-y-3 shadow-md">
        <h3 className="font-bold text-sm text-slate-800 flex items-center space-x-2">
          <Globe className="w-4 h-4 text-[#2E7D32]" />
          <span>Multilingual Language Selection</span>
        </h3>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => setLanguage('en')}
            className={`py-3 rounded-xl font-bold border transition-colors ${
              language === 'en' ? 'bg-[#2E7D32] text-white border-emerald-500' : 'bg-slate-50 text-slate-700 border-slate-200 text-slate-600'
            }`}
          >
            English 🇬🇧
          </button>
          <button
            onClick={() => setLanguage('hi')}
            className={`py-3 rounded-xl font-bold border transition-colors ${
              language === 'hi' ? 'bg-[#2E7D32] text-white border-emerald-500' : 'bg-slate-50 text-slate-700 border-slate-200 text-slate-600'
            }`}
          >
            हिंदी 🇮🇳
          </button>
        </div>
      </div>

      {/* Active Persona Switcher Panel */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 space-y-3 shadow-md">
        <h3 className="font-bold text-sm text-slate-800 flex items-center space-x-2">
          <Smartphone className="w-4 h-4 text-sky-400" />
          <span>Active Persona Manager</span>
        </h3>
        <p className="text-slate-600">Logged in as: <strong className="text-white">{currentUser.name}</strong> ({currentUser.role})</p>
        <div className="grid grid-cols-2 gap-2 pt-1">
          {[
            { key: 'farmer', label: '🌾 Farmer/FPO' },
            { key: 'buyer', label: '🛍️ Bulk Buyer' },
            { key: 'transporter', label: '🚚 Transporter' },
            { key: 'mandi', label: '🏛️ Mandi Operator' },
            { key: 'lab', label: '🔬 Quality Lab' },
            { key: 'middleman', label: '⚖️ Middleman' },
            { key: 'admin', label: '🛡️ Admin' }
          ].map((r) => (
            <button
              key={r.key}
              onClick={() => switchRole(r.key)}
              className={`p-2.5 rounded-xl text-left border font-semibold transition-colors ${
                currentUser.role === r.key
                  ? 'bg-emerald-950 border-emerald-500 text-[#2E7D32] font-bold'
                  : 'bg-slate-50 text-slate-700 border-slate-200 text-slate-600'
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* Explicit FUTURE SCOPE Section */}
      <div className="bg-gradient-to-r from-slate-900 to-emerald-950 border border-emerald-800 rounded-2xl p-4 space-y-3 shadow-lg">
        <h3 className="font-bold text-sm text-white flex items-center space-x-2">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>Future Scope & Production Roadmap</span>
        </h3>
        <p className="text-xs text-slate-300 leading-relaxed font-medium">
          The following enterprise integrations are intentionally explicitly reserved for future production phases:
        </p>

        <div className="space-y-2">
          <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
            <div className="font-bold text-amber-600 flex items-center space-x-1.5">
              <Sparkles className="w-4 h-4" />
              <span>Phase 2: Bhashini & Gemini AI Voice Assistant</span>
            </div>
            <p className="text-xs text-slate-700 font-medium">
              Government-backed Bhashini speech-to-text + Google Gemini API for regional voice q&a.
            </p>
          </div>

          <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
            <div className="font-bold text-sky-600 flex items-center space-x-1.5">
              <CreditCard className="w-4 h-4" />
              <span>Real UPI / Escrow Payment Gateway</span>
            </div>
            <p className="text-xs text-slate-700 font-medium">
              Integration with Razorpay / Cashfree UPI escrow APIs for instant payout disbursement.
            </p>
          </div>

          <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
            <div className="font-bold text-emerald-600 flex items-center space-x-1.5">
              <Navigation className="w-4 h-4" />
              <span>Live Vehicle Telematics & GPS Tracking</span>
            </div>
            <p className="text-xs text-slate-700 font-medium">
              Real-time Mapbox live vehicle movement telemetry & geofencing alerts.
            </p>
          </div>

          <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
            <div className="font-bold text-fuchsia-600 flex items-center space-x-1.5">
              <ExternalLink className="w-4 h-4" />
              <span>Government eNAM & Agmarknet Direct API Sync</span>
            </div>
            <p className="text-xs text-slate-700 font-medium">
              Official eNAM electronic trading portal synchronization.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
