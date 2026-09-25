import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Tractor, Bell, Volume2, CheckCircle2, ArrowLeft, X } from 'lucide-react';

export default function Navbar() {
  const { currentUser, language, setLanguage, notifications, t } = useApp();
  const [showNotificationsModal, setShowNotificationsModal] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  // Role labels in Hindi
  const roleLabels = {
    farmer: 'किसान',
    buyer: 'खरीदार',
    transporter: 'ट्रांसपोर्टर',
    mandi: 'मंडी संचालक',
    lab: 'लैब',
    admin: 'एडमिन',
    middleman: 'बिचौलिया'
  };

  // Mandi name based on role
  const getSubtitle = () => {
    if (currentUser.role === 'mandi') return currentUser.mandiName || 'खजराना मंडी, इंदौर';
    if (currentUser.role === 'farmer') return `ग्राम: ${currentUser.village || 'सोनीपत'}`;
    return roleLabels[currentUser.role] || currentUser.role;
  };

  return (
    <>
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#2E7D32] flex items-center justify-center text-white shadow-sm">
            <Tractor className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-800 tracking-tight leading-tight flex items-center gap-1.5">
              AgriVa
              <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded bg-green-100 text-[#2E7D32] border border-green-200">
                {roleLabels[currentUser.role] || currentUser.role}
              </span>
            </h1>
            <p className="text-[11px] text-slate-500 font-medium">
              {getSubtitle()}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* Language Switcher */}
          <button
            onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
            className="px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center space-x-1 border border-slate-200 transition-colors"
            title="Toggle Language"
          >
            <span>{language === 'hi' ? 'हिंदी' : 'EN'} ▾</span>
          </button>

          {/* Voice Listen Button */}
          <button className="px-3 py-1.5 rounded-full border border-[#FF9800] text-[#FF9800] bg-orange-50 font-medium text-xs flex items-center space-x-1">
            <Volume2 className="w-4 h-4" />
            <span className="hidden sm:inline">बोल कर सुनें</span>
          </button>

          {/* Notifications Bell */}
          <button
            onClick={() => setShowNotificationsModal(true)}
            className="relative p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 border border-slate-200 transition-colors"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4.5 h-4.5 bg-[#BF360C] text-white font-bold text-[10px] rounded-full flex items-center justify-center min-w-[18px] min-h-[18px]">
                {unreadCount}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Notifications Modal */}
      {showNotificationsModal && (
        <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white border border-slate-200 rounded-t-2xl sm:rounded-2xl w-full max-w-md max-h-[80vh] flex flex-col overflow-hidden shadow-2xl">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-[#f9f8f3]">
              <div className="flex items-center space-x-2">
                <Bell className="w-5 h-5 text-[#2E7D32]" />
                <h3 className="font-bold text-slate-800">सूचनाएं / Notifications</h3>
              </div>
              <button
                onClick={() => setShowNotificationsModal(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-4 overflow-y-auto space-y-3 flex-1 bg-[#f9f8f3]">
              {notifications.length === 0 ? (
                <div className="py-8 text-center text-slate-500 text-sm">कोई नई सूचना नहीं / No new notifications</div>
              ) : (
                notifications.map((n) => (
                  <div key={n.id} className="p-3 rounded-xl bg-white border border-slate-200 space-y-1 shadow-sm">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-700 flex items-center space-x-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#2E7D32]" />
                        <span>{n.title}</span>
                      </span>
                      <span className="text-[10px] text-slate-500">{n.timestamp}</span>
                    </div>
                    <p className="text-xs text-slate-600">{n.message}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
