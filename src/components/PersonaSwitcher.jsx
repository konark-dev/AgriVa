import React from 'react';
import { useApp } from '../context/AppContext';
import { UserCheck } from 'lucide-react';
import { t } from '../utils/translations';

export default function PersonaSwitcher() {
  const { currentUser, switchRole, language } = useApp();

  const roles = [
    { key: 'farmer', label: `👨‍🌾 ${t(language, 'verifiedFarmer')}`, match: (u) => u.role === 'farmer' && u.sellerBadge !== 'New Seller' },
    { key: 'farmer_new', label: `🌱 ${t(language, 'newFarmer')}`, match: (u) => u.role === 'farmer' && u.sellerBadge === 'New Seller' },
    { key: 'fpo', label: `🏢 ${t(language, 'fpoCooperative')}`, match: (u) => u.role === 'fpo' || u.isFpo },
    { key: 'consumer', label: `🛒 ${t(language, 'consumerRetail')}`, match: (u) => u.role === 'buyer' && u.buyerType === 'retail' },
    { key: 'bulk_buyer', label: `🏭 ${t(language, 'bulkBuyerRole')}`, match: (u) => u.role === 'buyer' && u.buyerType === 'bulk' },
    { key: 'transporter', label: `🚚 ${t(language, 'driverRole')}`, match: (u) => u.role === 'transporter' && u.transporterType === 'individual' },
    { key: 'transporter_aggregator', label: `🚛 ${t(language, 'fleetAggregator')}`, match: (u) => u.role === 'transporter' && u.transporterType === 'aggregator' },
    { key: 'mandi', label: `🏛️ ${t(language, 'mandiApmcRole')}`, match: (u) => u.role === 'mandi' },
    { key: 'lab', label: `🔬 ${t(language, 'qualityLabRole')}`, match: (u) => u.role === 'lab' },
    { key: 'admin', label: `👑 ${t(language, 'adminRole')}`, match: (u) => u.role === 'admin' },
    { key: 'warehouse', label: `🏢 ${t(language, 'warehouseBooking')}`, match: (u) => u.role === 'warehouse' },
    { key: 'lender', label: `🏦 ${t(language, 'lenderRole')}`, match: (u) => u.role === 'lender' },
    { key: 'middleman', label: `?? Middleman`, match: (u) => u.role === 'middleman' }
  ];

  return (
    <div className="bg-white border-b border-slate-200 px-3 py-1.5 flex items-center justify-between text-xs text-slate-600 overflow-x-auto shadow-sm">
      <div className="flex items-center space-x-1.5 shrink-0 font-bold text-emerald-600 mr-2">
        <UserCheck className="w-3.5 h-3.5" />
        <span>{t(language, 'actorSwitcher')}</span>
      </div>
      <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar py-0.5 flex-1">
        {roles.map((r) => {
          const isActive = r.match ? r.match(currentUser) : currentUser.role === r.key;
          return (
            <button
              key={r.key}
              onClick={() => switchRole(r.key)}
              className={`px-2.5 py-1 rounded-full whitespace-nowrap transition-all text-[11px] font-bold border ${
                isActive
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-300 shadow-sm ring-1 ring-emerald-200'
                  : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {r.label}
            </button>
          );
        })}
      </div>
      <button 
        onClick={() => {
          localStorage.removeItem('agriva_auth_status');
          localStorage.removeItem('agriva_user_data');
          window.location.reload();
        }}
        className="ml-2 shrink-0 px-2.5 py-1 rounded-full bg-rose-50 text-rose-600 border border-rose-200 text-[11px] font-bold hover:bg-rose-100 transition-colors"
      >
        Logout
      </button>
    </div>
  );
}
