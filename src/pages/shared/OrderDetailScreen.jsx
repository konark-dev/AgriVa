import React from "react";
import { ArrowLeft, Package, MapPin, Calendar, FileText } from "lucide-react";
import PaymentTimeline from "../../components/PaymentTimeline";

export default function OrderDetailScreen({ order, onBack, onDispute }) {
  if (!order) return null;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <div className="bg-[#2E7D32] text-white px-4 py-4 flex items-center shadow-md sticky top-0 z-50">
        <button onClick={onBack} className="mr-3 p-1 rounded-full hover:bg-white/20 transition-colors">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-bold">Order Details</h1>
      </div>

      <div className="flex-1 p-4 pb-24 overflow-y-auto space-y-4">
        {/* Order Summary Card */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start border-b border-slate-100 pb-3 mb-3">
            <div>
              <h2 className="text-sm font-semibold text-slate-800">Order #{order.id}</h2>
              <span className="text-xs text-slate-500">Placed on {new Date(order.orderPlacedAt).toLocaleDateString()}</span>
            </div>
            <span className="px-2 py-1 bg-emerald-100 text-emerald-800 rounded-lg text-[10px] font-bold uppercase tracking-wider">
              {order.status || "Active"}
            </span>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col">
              <span className="text-xs text-slate-500 flex items-center gap-1 mb-1"><Package className="w-3 h-3" /> Item</span>
              <span className="text-sm font-medium text-slate-800">{order.crop} - {order.variety}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-slate-500 flex items-center gap-1 mb-1"><FileText className="w-3 h-3" /> Quantity</span>
              <span className="text-sm font-medium text-slate-800">{order.quantity} kg</span>
            </div>
            <div className="flex flex-col col-span-2">
              <span className="text-xs text-slate-500 flex items-center gap-1 mb-1"><MapPin className="w-3 h-3" /> Delivery Address</span>
              <span className="text-sm font-medium text-slate-800">{order.deliveryLocation || "Not specified"}</span>
            </div>
          </div>
        </div>

        {/* Payment Timeline Component */}
        <PaymentTimeline order={order} onDispute={() => onDispute && onDispute(order)} />
      </div>
    </div>
  );
}

