import React from 'react';
import { useApp } from '../context/AppContext';
import { MessageSquare, CheckCircle, AlertCircle, Info } from 'lucide-react';

export default function NotificationToast() {
  const { activeToast } = useApp();

  if (!activeToast) return null;

  const getIcon = () => {
    switch (activeToast.type) {
      case 'success': return <CheckCircle className="w-5 h-5 text-[#2E7D32] shrink-0" />;
      case 'warning': return <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />;
      default: return <MessageSquare className="w-5 h-5 text-sky-400 shrink-0" />;
    }
  };

  return (
    <div className="fixed top-16 left-4 right-4 z-50 max-w-md mx-auto animate-in slide-in-from-top duration-300">
      <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-2xl backdrop-blur-md flex items-start space-x-3 text-slate-800 ring-1 ring-white/10">
        {getIcon()}
        <div className="flex-1 text-xs">
          <div className="font-bold text-slate-800">{activeToast.title}</div>
          <div className="text-slate-600 mt-0.5 leading-relaxed">{activeToast.message}</div>
        </div>
      </div>
    </div>
  );
}
