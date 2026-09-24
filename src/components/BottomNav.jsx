import React from 'react';
import { useApp } from '../context/AppContext';
import { Home, Store, Bell, User, Truck, Building2, Microscope, ShieldCheck, BarChart3 } from 'lucide-react';

export default function BottomNav({ activeTab, setActiveTab }) {
  const { currentUser } = useApp();

  const getNavItems = () => {
    switch (currentUser.role) {
      case 'farmer':
        return [
          { id: 'dashboard', label: 'होम', sublabel: 'Home', icon: Home },
          { id: 'feed', label: 'मांग फ़ीड', sublabel: 'Feed', icon: Bell },
          { id: 'prices', label: 'बेचें', sublabel: 'Sell', icon: Store },
          { id: 'settings', label: 'प्रोफ़ाइल', sublabel: 'Profile', icon: User }
        ];
      case 'buyer':
        return [
          { id: 'dashboard', label: 'होम', sublabel: 'Home', icon: Home },
          { id: 'postReq', label: 'मांग', sublabel: 'My Posts', icon: Bell },
          { id: 'offers', label: 'बोलियां', sublabel: 'Offers', icon: Store },
          { id: 'settings', label: 'प्रोफ़ाइल', sublabel: 'Profile', icon: User }
        ];
      case 'transporter':
        return [
          { id: 'dashboard', label: 'पिकअप', sublabel: 'Pickups', icon: Truck },
          { id: 'route', label: 'रूट', sublabel: 'Route', icon: BarChart3 },
          { id: 'notifications', label: 'अलर्ट', sublabel: 'Alerts', icon: Bell },
          { id: 'settings', label: 'प्रोफ़ाइल', sublabel: 'Profile', icon: User }
        ];
      case 'mandi':
        return [
          { id: 'dashboard', label: 'होम', sublabel: 'Home', icon: Home },
          { id: 'gate', label: 'गेट', sublabel: 'Gate', icon: Building2 },
          { id: 'notifications', label: 'अलर्ट', sublabel: 'Alerts', icon: Bell },
          { id: 'settings', label: 'प्रोफ़ाइल', sublabel: 'Profile', icon: User }
        ];
      case 'lab':
        return [
          { id: 'dashboard', label: 'परीक्षण', sublabel: 'Tests', icon: Microscope },
          { id: 'notifications', label: 'अलर्ट', sublabel: 'Alerts', icon: Bell },
          { id: 'settings', label: 'प्रोफ़ाइल', sublabel: 'Profile', icon: User }
        ];
      case 'admin':
        return [
          { id: 'dashboard', label: 'सत्यापन', sublabel: 'Verify', icon: ShieldCheck },
          { id: 'notifications', label: 'अलर्ट', sublabel: 'Alerts', icon: Bell },
          { id: 'settings', label: 'प्रोफ़ाइल', sublabel: 'Profile', icon: User }
        ];
      default:
        return [
          { id: 'dashboard', label: 'होम', sublabel: 'Home', icon: Home },
          { id: 'notifications', label: 'अलर्ट', sublabel: 'Alerts', icon: Bell },
          { id: 'settings', label: 'प्रोफ़ाइल', sublabel: 'Profile', icon: User }
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
                ? 'text-[#1B5E20]'
                : 'text-slate-500 hover:text-slate-600'
            }`}
          >
            <div className={`p-1.5 rounded-xl transition-all ${isActive ? 'bg-green-100' : ''}`}>
              <Icon className={`w-5 h-5 ${isActive ? 'text-[#1B5E20]' : 'text-slate-500'}`} />
            </div>
            <span className={`text-[10px] mt-0.5 font-bold leading-tight ${isActive ? 'text-[#1B5E20]' : 'text-slate-500'}`}>
              {item.label}
            </span>
            <span className={`text-[8px] font-medium leading-tight ${isActive ? 'text-[#1B5E20]' : 'text-slate-500'}`}>
              {item.sublabel}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
