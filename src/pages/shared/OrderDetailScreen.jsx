import React from "react";
import { ArrowLeft, Package, MapPin, Calendar, FileText } from "lucide-react";
import PaymentTimeline from "../../components/PaymentTimeline";
import OrderLifecycleFlow from "../../components/OrderLifecycleFlow";

export default function OrderDetailScreen({ order, onBack, onDispute, onNavigateToRoute }) {
  if (!order) return null;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-100 text-slate-900 border-b border-emerald-200 px-4 py-4 flex items-center shadow-sm sticky top-0 z-50">
        <button onClick={onBack} className="mr-3 p-1 rounded-full hover:bg-emerald-200/60 transition-colors">
          <ArrowLeft size={24} className="text-emerald-950" />
        </button>
        <h1 className="text-xl font-bold text-slate-900">Order Details</h1>
      </div>

      <div className="flex-1 p-4 pb-24 overflow-y-auto space-y-4">
        {/* Order Summary Card */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start border-b border-slate-100 pb-3 mb-3">
            <div>
              <h2 className="text-sm font-semibold text-slate-800">Order #{order.id}</h2>
              <span className="text-xs text-slate-500">Placed on {order.orderPlacedAt ? new Date(order.orderPlacedAt).toLocaleDateString() : 'Today'}</span>
            </div>
            <span className="px-2 py-1 bg-emerald-100 text-emerald-800 rounded-lg text-[10px] font-bold uppercase tracking-wider">
              {order.status || "Active"}
            </span>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col">
              <span className="text-xs text-slate-500 flex items-center gap-1 mb-1"><Package className="w-3 h-3" /> Item</span>
              <span className="text-sm font-medium text-slate-800">{order.crop} {order.variety ? `- ${order.variety}` : ''}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-slate-500 flex items-center gap-1 mb-1"><FileText className="w-3 h-3" /> Quantity</span>
              <span className="text-sm font-medium text-slate-800">{(order.qty || order.quantity || 10000).toLocaleString()} kg</span>
            </div>
            <div className="flex flex-col col-span-2">
              <span className="text-xs text-slate-500 flex items-center gap-1 mb-1"><MapPin className="w-3 h-3" /> Delivery Address</span>
              <span className="text-sm font-medium text-slate-800">{order.deliveryLocation || "Azadpur APMC Mandi, Delhi"}</span>
            </div>
          </div>
        </div>

        {/* Order Lifecycle Visual Flow */}
        <OrderLifecycleFlow
          orderId={order.id}
          commodity={order.crop || "Tomato"}
          quantityKg={order.qty || order.quantity || 10000}
          buyerDestination={order.deliveryLocation || "Azadpur APMC Terminal Mandi, Delhi"}
          onNavigateToRoute={onNavigateToRoute}
        />

        {/* Payment Timeline Component */}
        <PaymentTimeline order={order} onDispute={() => onDispute && onDispute(order)} />
      </div>
    </div>
  );
}
