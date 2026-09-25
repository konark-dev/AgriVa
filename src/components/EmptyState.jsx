import React from 'react';
import { Inbox, FilterX } from 'lucide-react';

export default function EmptyState({ title = "No items found", description = "There are no listings matching your request right now.", icon: CustomIcon, onClearFilters }) {
  const IconComponent = CustomIcon || Inbox;

  return (
    <div className="bg-white rounded-2xl p-6 my-4 text-center flex flex-col items-center justify-center border border-slate-200 space-y-3">
      <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-500">
        <IconComponent className="w-7 h-7 text-[#2E7D32]/80" />
      </div>
      <div className="space-y-1">
        <h4 className="text-sm font-bold text-slate-700">{title}</h4>
        <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">{description}</p>
      </div>
      {onClearFilters && (
        <button
          onClick={onClearFilters}
          className="btn-touch mt-2 px-4 py-2 rounded-xl bg-slate-50 text-slate-700 hover:bg-slate-700 text-[#2E7D32] border border-slate-200 text-xs font-semibold flex items-center space-x-1.5"
        >
          <FilterX className="w-4 h-4" />
          <span>Clear Filters</span>
        </button>
      )}
    </div>
  );
}
