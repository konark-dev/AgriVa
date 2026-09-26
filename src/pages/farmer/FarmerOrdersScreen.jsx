import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ShoppingBag, CheckCircle2, XCircle, Clock, ShieldCheck, MapPin, Truck, ChevronRight } from 'lucide-react';

export default function FarmerOrdersScreen() {
  const { triggerToast } = useApp();

  const [ordersList, setOrdersList] = useState([
    {
      id: 'ORD-8921',
      buyerName: 'MegaFood Processing Park',
      buyerType: 'Processor',
      crop: 'Tomato (Sharbati Grade A)',
      quantity: '500 kg',
      offeredPrice: 32,
      totalAmount: 16000,
      deliveryLocation: 'Shahpura Mega Food Park, NH-48',
      date: '26 Sep 2026',
      status: 'Pending Farmer Acceptance',
      urgency: 'Immediate Pickup Available'
    },
    {
      id: 'ORD-8922',
      buyerName: 'Jaipur Kisan Mandi Terminal',
      buyerType: 'Mandi Trader',
      crop: 'Wheat (Grade A)',
      quantity: '2,000 kg',
      offeredPrice: 28.5,
      totalAmount: 57000,
      deliveryLocation: 'Muhana APMC Terminal Gate 2',
      date: '25 Sep 2026',
      status: 'Accepted',
      urgency: 'In-Transit'
    }
  ]);

  const handleAccept = (orderId) => {
    setOrdersList(prev => prev.map(o => o.id === orderId ? { ...o, status: 'Accepted' } : o));
    triggerToast(`Order ${orderId} Accepted! Transporter will be notified for pickup.`, 'Order Accepted', 'success');
  };

  const handleReject = (orderId) => {
    setOrdersList(prev => prev.map(o => o.id === orderId ? { ...o, status: 'Declined' } : o));
    triggerToast(`Order ${orderId} Declined.`, 'Order Declined', 'info');
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 p-4 max-w-5xl mx-auto space-y-4">
      {/* Header */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-200">
            FARMER FIRST CHOICE
          </span>
          <h1 className="text-xl font-black text-slate-900 tracking-tight mt-1">Orders & Buyer Proposals</h1>
          <p className="text-xs text-slate-500 font-medium">Review and accept buyer purchase orders directly</p>
        </div>

        <div className="flex items-center space-x-2 text-xs">
          <div className="bg-emerald-50 text-emerald-700 font-bold px-3 py-1.5 rounded-xl border border-emerald-200 flex items-center space-x-1">
            <CheckCircle2 className="w-4 h-4" />
            <span>Direct Escrow Payment</span>
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-3">
        {ordersList.map(order => {
          const isPending = order.status === 'Pending Farmer Acceptance';
          const isAccepted = order.status === 'Accepted';

          return (
            <div key={order.id} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2">
                  <span className="px-2.5 py-1 bg-slate-100 text-slate-700 font-extrabold rounded-md text-[10px]">
                    {order.id}
                  </span>
                  <span className="px-2.5 py-1 bg-blue-100 text-blue-800 font-extrabold rounded-md text-[10px]">
                    {order.buyerType}
                  </span>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-black ${
                  isPending ? 'bg-amber-100 text-amber-800 border border-amber-300' :
                  isAccepted ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-rose-100 text-rose-800'
                }`}>
                  {order.status}
                </span>
              </div>

              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-extrabold text-base text-slate-900">{order.buyerName}</h3>
                  <p className="text-xs font-bold text-slate-700 mt-0.5">{order.crop} • <span className="text-[#2E7D32]">{order.quantity}</span></p>
                  <p className="text-xs text-slate-500 mt-1 flex items-center">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 mr-1" />
                    {order.deliveryLocation}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-400 font-bold block">TOTAL VALUE</span>
                  <span className="text-xl font-black text-emerald-700">₹{order.totalAmount.toLocaleString()}</span>
                  <p className="text-[10px] text-slate-400 font-semibold">₹{order.offeredPrice}/kg offer</p>
                </div>
              </div>

              {isPending && (
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-3">
                  <div className="text-xs text-slate-500 font-medium">
                    ⚡ {order.urgency}
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleReject(order.id)}
                      className="px-4 py-2 bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-700 rounded-xl text-xs font-bold transition-colors"
                    >
                      Decline
                    </button>
                    <button
                      onClick={() => handleAccept(order.id)}
                      className="px-5 py-2 bg-[#2E7D32] hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm transition-colors flex items-center space-x-1"
                    >
                      <CheckCircle2 className="w-4 h-4 mr-1" />
                      <span>Accept Order</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
