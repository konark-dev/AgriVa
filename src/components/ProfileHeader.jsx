import React from 'react';
import { useApp } from '../context/AppContext';
import { ShieldCheck, MapPin, Phone, Star, ShieldAlert } from 'lucide-react';

export default function ProfileHeader() {
  const { currentUser } = useApp();
  
  if (!currentUser) return null;

  return (
    <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between mb-4 w-full">
      <div className="flex items-center space-x-3">
        <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center font-bold text-xl shadow-inner uppercase shrink-0">
          {currentUser.name ? currentUser.name.charAt(0) : 'U'}
        </div>
        <div className="flex flex-col">
          <h2 className="text-lg font-extrabold text-slate-800 flex items-center">
            {currentUser.name} 
            {currentUser.sellerBadge !== 'New Seller' ? (
              <ShieldCheck className="w-4 h-4 text-emerald-600 ml-1 shrink-0" />
            ) : (
              <ShieldAlert className="w-4 h-4 text-amber-500 ml-1 shrink-0" />
            )}
          </h2>
          <div className="text-[10px] text-slate-500 font-medium flex items-center mt-0.5 overflow-hidden text-ellipsis whitespace-nowrap max-w-[200px]">
            <span className="capitalize text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded mr-2 font-bold border border-emerald-200 shrink-0">
              {currentUser.role}
            </span>
            <MapPin className="w-3 h-3 mr-0.5 shrink-0" /> {currentUser.village || currentUser.district || 'India'}
          </div>
        </div>
      </div>
      <div className="flex flex-col items-end shrink-0">
        <div className="flex items-center text-[10px] text-slate-600 font-semibold mb-1">
          <Phone className="w-3 h-3 mr-1 text-slate-400" />
          {currentUser.phone || '+91-XXXXXXXXXX'}
        </div>
        <div className="flex items-center text-amber-500 text-xs font-bold">
          <Star className="w-3.5 h-3.5 mr-0.5 fill-current" />
          {currentUser.rating || '4.8'}
        </div>
      </div>
    </div>
  );
}
