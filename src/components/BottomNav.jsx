import React from 'react';
import { useApp } from '../context/AppContext';
import { Home, Store, Bell, User, Truck, Building2, Microscope, ShieldCheck, BarChart3, AlertCircle, Package } from 'lucide-react';
import { t } from '../utils/translations';

export default function BottomNav({ activeTab, setActiveTab }) {
  const { currentUser, language } = useApp();

  // Unified translation mapping for bottom nav
  const getNavItems = () => {
    switch (currentUser.role) {
      case 'farmer':
      case 'fpo':
        return [
          { id: 'dashboard', label: 'Home', icon: Home },
          { id: 'my_produce', label: 'My Produce', icon: Package },
          { id: 'market', label: 'Market', icon: Store },
          { id: 'orders', label: 'Orders', icon: Bell },
          { id: 'storage', label: 'Storage', icon: Building2 }
        ];
      case 'buyer':
      case 'consumer':
      case 'bulk_buyer':
        return [
          { id: 'dashboard', label: t(language, 'home'), icon: Home },
          { id: 'postReq', label: t(language, 'postReq'), icon: Bell },
          { id: 'offers', label: t(language, 'offers'), icon: Store },
          { id: 'settings', label: t(language, 'profile'), icon: User }
        ];
      case 'transporter':
        return [
          { id: 'dashboard', label: t(language, 'pickups'), icon: Truck },
          { id: 'route_comparison', label: t(language, 'smartRoute'), icon: BarChart3 },
          { id: 'notifications', label: t(language, 'alerts'), icon: Bell },
          { id: 'settings', label: t(language, 'profile'), icon: User }
        ];
      case 'mandi':
        return [
          { id: 'dashboard', label: t(language, 'home'), icon: Home },
          { id: 'gate', label: 'Gate', icon: Building2 }, // Optional: Add gate to translations if needed
          { id: 'notifications', label: t(language, 'alerts'), icon: Bell },
          { id: 'settings', label: t(language, 'profile'), icon: User }
        ];
      case 'lab':
        return [
          { id: 'dashboard', label: t(language, 'tests'), icon: Microscope },
          { id: 'notifications', label: t(language, 'alerts'), icon: Bell },
          { id: 'settings', label: t(language, 'profile'), icon: User }
        ];
      case 'admin':
        return [
          { id: 'dashboard', label: t(language, 'home'), icon: ShieldCheck },
          { id: 'notifications', label: t(language, 'alerts'), icon: Bell },
          { id: 'settings', label: t(language, 'profile'), icon: User }
        ];
      default:
        return [
          { id: 'dashboard', label: t(language, 'home'), icon: Home },
          { id: 'notifications', label: t(language, 'alerts'), icon: Bell },
          { id: 'settings', label: t(language, 'profile'), icon: User }
        ];
    }
  };

  const navItems = getNavItems();

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md md:max-w-7xl z-30 bg-white/95 backdrop-blur-md border-t border-slate-200 px-2 md:px-8 py-1.5 md:py-3 flex items-center justify-around shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;

        return (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex-1 flex flex-col items-center justify-center py-1.5 rounded-xl transition-all ${
              isActive
                ? 'text-[#2E7D32]'
                : 'text-slate-500 hover:text-slate-600'
            }`}
          >
            <div className={`p-1.5 rounded-xl transition-all ${isActive ? 'bg-green-100' : ''}`}>
              <Icon className={`w-5 h-5 ${isActive ? 'text-[#2E7D32]' : 'text-slate-500'}`} />
            </div>
            <span className={`text-[10px] mt-0.5 font-bold leading-tight ${isActive ? 'text-[#2E7D32]' : 'text-slate-500'}`}>
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
