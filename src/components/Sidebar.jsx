import React from 'react';
import { useApp } from '../context/AppContext';
import { Home, TrendingUp, PlusCircle, ShoppingBag, Truck, Building2, Microchip, ShieldCheck, Settings, Repeat } from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab }) {
  const { currentUser } = useApp();

  const getNavItems = () => {
    switch (currentUser.role) {
      case 'farmer':
        return [
          { id: 'dashboard', label: 'My Crops', icon: Home },
          { id: 'prices', label: 'Prices', icon: TrendingUp },
          { id: 'add', label: '+ Add Crop', icon: PlusCircle, isPrimary: true },
          { id: 'settings', label: 'Settings', icon: Settings }
        ];
      case 'buyer':
        return [
          { id: 'browse', label: 'Browse', icon: ShoppingBag },
          { id: 'orders', label: 'Orders', icon: Home },
          { id: 'settings', label: 'Settings', icon: Settings }
        ];
      case 'transporter':
        return [
          { id: 'jobs', label: 'Pickups', icon: Truck },
          { id: 'route', label: 'Route', icon: TrendingUp },
          { id: 'settings', label: 'Settings', icon: Settings }
        ];
      case 'mandi':
        return [
          { id: 'gate', label: 'Gate Entry', icon: Building2 },
          { id: 'auctions', label: 'Auctions', icon: Home },
          { id: 'settings', label: 'Settings', icon: Settings }
        ];
      case 'lab':
        return [
          { id: 'tests', label: 'Sample Tests', icon: Microchip },
          { id: 'settings', label: 'Settings', icon: Settings }
        ];
      case 'admin':
        return [
          { id: 'labs', label: 'Lab Verification', icon: ShieldCheck },
          { id: 'settings', label: 'Settings', icon: Settings }
        ];
      case 'middleman':
        return [
          { id: 'middleman_browse', label: 'Market', icon: ShoppingBag },
          { id: 'deals', label: 'My Deals', icon: Repeat },
          { id: 'settings', label: 'Settings', icon: Settings }
        ];
      default:
        return [
          { id: 'dashboard', label: 'Home', icon: Home },
          { id: 'settings', label: 'Settings', icon: Settings }
        ];
    }
  };

  const navItems = getNavItems();

  return (
    <aside className="hidden md:flex flex-col w-64 bg-white border-r border-slate-200 h-screen sticky top-0 py-6 px-4">
      <div className="mb-8 px-2 flex items-center space-x-2">
        <div className="w-8 h-8 rounded-full bg-[#1B5E20] flex items-center justify-center">
          <span className="font-bold text-white text-sm">KS</span>
        </div>
        <h1 className="text-xl font-bold text-slate-800 tracking-tight">AgriVa</h1>
      </div>
      
      <nav className="flex-1 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          if (item.isPrimary) {
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className="btn-touch w-full flex items-center space-x-3 px-4 py-3 mt-4 rounded-xl bg-[#1B5E20] text-white shadow-lg shadow-emerald-900/50"
              >
                <Icon className="w-5 h-5" />
                <span className="text-sm font-bold">{item.label}</span>
              </button>
            );
          }

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`btn-touch w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors ${
                isActive
                  ? 'bg-slate-50 text-[#1B5E20] font-semibold'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-[#1B5E20]' : 'text-slate-500'}`} />
              <span className="text-sm tracking-tight">{item.label}</span>
            </button>
          );
        })}
      </nav>
      
      <div className="pt-4 border-t border-slate-200 mt-auto">
        <div className="flex items-center space-x-3 px-2">
          <div className="w-10 h-10 rounded-full bg-slate-50 text-slate-700 flex flex-shrink-0 items-center justify-center font-bold text-[#1B5E20] border border-slate-200">
            {currentUser.name.charAt(0)}
          </div>
          <div className="overflow-hidden text-left">
            <p className="text-sm font-bold text-slate-700 truncate">{currentUser.name}</p>
            <p className="text-xs text-slate-500 capitalize truncate">{currentUser.role}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
