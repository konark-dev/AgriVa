import React from "react";
import { CheckCircle2, Clock, AlertTriangle, ArrowRight } from "lucide-react";

export default function PaymentTimeline({ order, onDispute }) {
  if (!order) return null;

  const {
    orderPlacedAt,
    escrowAuthorizedAt,
    deliveryConfirmedAt,
    paymentReleasedAt,
    logisticsPaidAt,
  } = order;

  const stages = [
    { key: "placed", label: "Order Placed", timestamp: orderPlacedAt },
    { key: "escrow", label: "Payment Authorized (Escrow)", timestamp: escrowAuthorizedAt },
    { key: "delivered", label: "Produce Delivered", timestamp: deliveryConfirmedAt },
    { key: "released", label: "Payment Released", timestamp: paymentReleasedAt },
    { key: "logistics", label: "Logistics Payment Completed", timestamp: logisticsPaidAt },
  ];

  // Determine current stage (last stage with a timestamp)
  let currentStageIndex = -1;
  stages.forEach((stage, index) => {
    if (stage.timestamp) {
      currentStageIndex = index;
    }
  });

  const isDelayed = () => {
    if (deliveryConfirmedAt && !paymentReleasedAt) {
      const deliveredTime = new Date(deliveryConfirmedAt).getTime();
      const now = Date.now();
      const hoursPassed = (now - deliveredTime) / (1000 * 60 * 60);
      return hoursPassed > 48;
    }
    return false;
  };

  const delayWarning = isDelayed();

  return (
    <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm mt-4">
      <h2 className="text-sm font-semibold text-slate-800 mb-4 border-b border-slate-100 pb-2">
        Payment Status Timeline
      </h2>

      {delayWarning && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-2 text-red-800">
            <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div className="text-sm">
              <strong className="block">Payment is delayed</strong>
              <span className="text-xs">More than 48 hours have passed since delivery. You can raise a dispute.</span>
            </div>
          </div>
          <button 
            onClick={onDispute}
            className="whitespace-nowrap px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg text-xs font-bold transition-colors border border-red-300"
          >
            Raise Dispute
          </button>
        </div>
      )}

      <div className="relative pl-6 space-y-6 before:content-[''] before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-200">
        {stages.map((stage, index) => {
          const isCompleted = !!stage.timestamp;
          const isCurrent = index === currentStageIndex;
          const isPending = !isCompleted && !isCurrent;

          let Icon = CheckCircle2;
          let iconColor = "text-slate-300";
          let bgColor = "bg-white";
          let borderColor = "border-slate-300";

          if (isCompleted) {
            iconColor = "text-[#2E7D32]";
            borderColor = "border-[#2E7D32]";
          }
          if (isCurrent && index !== stages.length - 1) {
            Icon = Clock;
            iconColor = "text-amber-500";
            borderColor = "border-amber-400";
          }

          return (
            <div key={stage.key} className="relative">
              <div
                className={`absolute -left-[33px] top-0 w-6 h-6 rounded-full border-2 flex items-center justify-center bg-white z-10 transition-colors ${borderColor}`}
              >
                <Icon className={`w-3.5 h-3.5 ${iconColor}`} />
              </div>

              <div className="flex flex-col">
                <span
                  className={`text-sm font-semibold ${
                    isCompleted || isCurrent ? "text-slate-800" : "text-slate-400"
                  }`}
                >
                  {stage.label}
                </span>
                <span className="text-xs text-slate-500 mt-0.5">
                  {stage.timestamp
                    ? new Date(stage.timestamp).toLocaleString("en-IN", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })
                    : "Pending"}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
