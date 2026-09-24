import React from 'react';
import { useApp } from '../context/AppContext';
import { UserCheck } from 'lucide-react';

export default function PersonaSwitcher() {
  const { currentUser, switchRole } = useApp();

  const roles = [
    { key: 'farmer', label: '🌾 Verified Farmer', match: (u) => u.role === 'farmer' && u.sellerBadge !== 'New Seller' },
    { key: 'farmer_new', label: '🌱 New Farmer (Badge)', match: (u) => u.role === 'farmer' && u.sellerBadge === 'New Seller' },
    { key: 'fpo', label: '🏢 FPO (Cooperative)', match: (u) => u.role === 'fpo' || u.isFpo },
    { key: 'consumer', label: '🛒 Consumer (Retail)', match: (u) => u.role === 'buyer' && u.buyerType === 'retail' },
    { key: 'bulk_buyer', label: '🛍️ Bulk Buyer (GSTIN)', match: (u) => u.role === 'buyer' && u.buyerType === 'bulk' },
    { key: 'transporter', label: '🚚 Driver (DL/RC)', match: (u) => u.role === 'transporter' && u.transporterType === 'individual' },
    { key: 'transporter_aggregator', label: '🚛 Fleet Aggregator', match: (u) => u.role === 'transporter' && u.transporterType === 'aggregator' },
    { key: 'mandi', label: '🏛️ Mandi APMC', match: (u) => u.role === 'mandi' },
    { key: 'lab', label: '🔬 Quality Lab', match: (u) => u.role === 'lab' },
    { key: 'admin', label: '🛡️ Admin (Supervision)', match: (u) => u.role === 'admin' },
    { key: 'lender', label: '🏦 Lender (Credit)', match: (u) => u.role === 'lender' }
  ];

  return (
    <div className="bg-white border-b border-slate-200 px-3 py-1.5 flex items-center justify-between text-xs text-slate-600 overflow-x-auto shadow-sm">
      <div className="flex items-center space-x-1.5 shrink-0 font-bold text-emerald-600 mr-2">
        <UserCheck className="w-3.5 h-3.5" />
        <span>Actor Switcher:</span>
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
