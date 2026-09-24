import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import VisualStepper from '../../components/VisualStepper';
import EmptyState from '../../components/EmptyState';
import { Repeat, Truck, ShoppingBag, ShieldAlert, DollarSign, ArrowRightLeft } from 'lucide-react';

export default function MiddlemanDashboard() {
  const { listings, currentUser, triggerToast } = useApp();
  const [activeTab, setActiveTab] = useState('browse'); // browse | deals
  const [promptTransportModal, setPromptTransportModal] = useState(null);

  const vehicleCapacityKg = currentUser.capacityKg || 3500;

  const handleSelfTransportChoice = (listing, choice) => {
    if (choice === 'self') {
      if (listing.quantity > vehicleCapacityKg) {
        triggerToast(
          `⚠️ Insufficient vehicle capacity! Your vehicle (${vehicleCapacityKg}kg) cannot transport ${listing.quantity}kg in one trip. Assigning external transporter pool.`,
          `Capacity Exceeded`,
          `warning`
        );
        return;
      }
      triggerToast(`Self-transport assigned! Registered vehicle ${currentUser.vehicleReg} confirmed.`, `Self-Transport Active`, `success`);
    } else {
      triggerToast(`Delivery assigned to external Kisan Logistics fleet.`, `Transporter Assigned`, `info`);
    }
    setPromptTransportModal(null);
  };

  return (
    <div className="space-y-4 p-4 pb-24">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-800 flex items-center space-x-2">
            <Repeat className="w-5 h-5 text-[#1B5E20]" />
            <span>Middleman Trading & Logistics Hub</span>
          </h2>
          <p className="text-xs text-slate-500">Combined Buyer + Transporter Dual-Ledger</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="grid grid-cols-2 gap-2 bg-white p-1 rounded-2xl border border-slate-200">
        <button
          onClick={() => setActiveTab('browse')}
          className={`py-2 rounded-xl text-xs font-bold transition-colors ${
            activeTab === 'browse' ? 'bg-[#1B5E20] text-white shadow' : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          Browse & Bid Crops
        </button>
        <button
          onClick={() => setActiveTab('deals')}
          className={`py-2 rounded-xl text-xs font-bold transition-colors ${
            activeTab === 'deals' ? 'bg-[#1B5E20] text-white shadow' : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          My Deals Dual-Ledger
        </button>
      </div>

      {/* TAB 1: BROWSE & BID */}
      {activeTab === 'browse' && (
        <div className="space-y-3">
          {listings.map((item) => (
            <div key={item.id} className="bg-white rounded-2xl p-4 border border-slate-200 space-y-3 shadow-md">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-extrabold text-sm text-slate-800">{item.crop}</h3>
                  <p className="text-xs text-slate-600">Farmer: {item.farmerName}</p>
                </div>
                <div className="text-right">
                  <span className="text-base font-extrabold text-[#1B5E20]">₹{item.price}/kg</span>
                  <div className="text-[10px] text-slate-500">{item.quantity} kg</div>
                </div>
              </div>

              <button
                onClick={() => setPromptTransportModal(item)}
                className="w-full btn-touch py-2.5 rounded-xl bg-[#1B5E20] text-white font-bold text-xs shadow flex items-center justify-center space-x-1"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Place Middleman Trade Bid</span>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* TAB 2: MY DEALS DUAL-LEDGER */}
      {activeTab === 'deals' && (
        <div className="space-y-3">
          <div className="bg-gradient-to-r from-emerald-950/80 to-slate-900 border border-emerald-800/60 rounded-2xl p-4 space-y-3 shadow-md text-xs">
            <h3 className="font-bold text-sm text-slate-800 flex items-center space-x-1.5">
              <ArrowRightLeft className="w-4 h-4 text-[#1B5E20]" />
              <span>Two-Leg Financial Ledger</span>
            </h3>

            {/* Leg 1: Purchase from Farmer */}
            <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
              <div className="flex justify-between font-bold text-slate-700">
                <span>Leg 1: Outflow to Farmer (Purchase)</span>
                <span className="text-rose-400">− ₹75,000</span>
              </div>
              <p className="text-[11px] text-slate-500">3000kg Onion @ ₹25/kg paid on pickup confirmation.</p>
            </div>

            {/* Leg 2: Sale to Mandi */}
            <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
              <div className="flex justify-between font-bold text-slate-700">
                <span>Leg 2: Inflow from Mandi Buyer (Sale)</span>
                <span className="text-[#1B5E20]">+ ₹90,000</span>
              </div>
              <p className="text-[11px] text-slate-500">3000kg Onion @ ₹30/kg received on mandi delivery.</p>
            </div>

            <div className="pt-2 border-t border-slate-200 flex justify-between font-extrabold text-sm text-amber-400">
              <span>Middleman Net Arbitrage Margin:</span>
              <span>+ ₹15,000</span>
            </div>
          </div>
        </div>
      )}

      {/* Post-Bid Win Self-Transport Prompt Modal */}
      {promptTransportModal && (
        <div className="fixed inset-0 z-50 bg-white backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white border border-slate-200 rounded-t-2xl sm:rounded-2xl w-full max-w-md p-5 space-y-4 shadow-2xl text-xs">
            <h3 className="font-bold text-base text-slate-800">Transport Choice for Won Deal</h3>
            <p className="text-slate-600">
              You won bid for <strong className="text-[#1B5E20]">{promptTransportModal.quantity}kg {promptTransportModal.crop}</strong>. Choose logistics assignment:
            </p>

            <div className="space-y-2">
              <button
                onClick={() => handleSelfTransportChoice(promptTransportModal, 'self')}
                className="w-full p-3 rounded-xl bg-slate-50 text-slate-700 hover:bg-slate-700 border border-slate-200 text-left flex items-center justify-between font-bold text-slate-800"
              >
                <span>Self-Transport (My Vehicle: {currentUser.vehicleReg})</span>
                <Truck className="w-4 h-4 text-[#1B5E20]" />
              </button>

              <button
                onClick={() => handleSelfTransportChoice(promptTransportModal, 'assign')}
                className="w-full p-3 rounded-xl bg-slate-50 text-slate-700 hover:bg-slate-700 border border-slate-200 text-left flex items-center justify-between font-bold text-slate-800"
              >
                <span>Assign External Transporter Fleet</span>
                <Truck className="w-4 h-4 text-sky-400" />
              </button>
            </div>

            <button onClick={() => setPromptTransportModal(null)} className="w-full py-2.5 rounded-xl bg-slate-50 text-slate-700 text-slate-500 font-semibold">
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
