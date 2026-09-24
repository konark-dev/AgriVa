import React, { useState, useEffect } from 'react';
import { X, ShieldCheck, Smartphone, CheckCircle, Loader2, QrCode } from 'lucide-react';

export default function PaymentGatewayModal({ amount, onPaymentComplete, onClose }) {
  const [step, setStep] = useState('scan'); // scan | processing | success

  const handleSimulatePayment = (e) => {
    e.preventDefault();
    setStep('processing');
    
    // Simulate API delay for UPI validation
    setTimeout(() => {
      setStep('success');
      setTimeout(() => {
        onPaymentComplete();
      }, 1500);
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-white backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white border border-slate-200 rounded-t-2xl sm:rounded-2xl w-full max-w-sm flex flex-col overflow-hidden shadow-2xl animate-in slide-in-from-bottom">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-white text-white shrink-0">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-[#1B5E20]" />
            <div>
              <h3 className="font-bold text-sm">Secure Escrow Payment</h3>
              <p className="text-[10px] text-slate-500">Powered by Razorpay Simulation</p>
            </div>
          </div>
          <button onClick={onClose} disabled={step !== 'scan'} className="p-1 rounded-full hover:bg-slate-50 text-slate-700 transition-colors disabled:opacity-50">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 flex flex-col items-center justify-center space-y-4">
          
          {step === 'scan' && (
            <>
              <div className="text-center space-y-1">
                <p className="text-slate-500 text-xs font-semibold">Total Amount to Lock in Escrow</p>
                <p className="text-3xl font-black text-white">₹{amount.toLocaleString()}</p>
              </div>

              <div className="bg-white p-4 rounded-xl border-4 border-slate-200 w-48 h-48 flex flex-col items-center justify-center text-slate-800">
                <QrCode className="w-32 h-32" />
                <span className="text-[10px] font-bold mt-2">Scan with any UPI App</span>
              </div>

              <div className="w-full flex items-center space-x-2 my-2">
                <div className="h-px flex-1 bg-slate-50 text-slate-700"></div>
                <span className="text-xs font-bold text-slate-500">OR</span>
                <div className="h-px flex-1 bg-slate-50 text-slate-700"></div>
              </div>

              <form onSubmit={handleSimulatePayment} className="w-full space-y-3">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Smartphone className="w-4 h-4 text-slate-500" />
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="Enter UPI ID (e.g. buyer@upi)"
                    className="w-full pl-10 pr-3 py-3 rounded-xl bg-slate-50 text-slate-700 border border-slate-200 text-slate-800 font-bold text-sm focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <button type="submit" className="w-full btn-touch py-3 rounded-xl bg-[#1B5E20] text-white font-bold text-sm shadow">
                  Pay Securely
                </button>
              </form>
            </>
          )}

          {step === 'processing' && (
            <div className="py-12 flex flex-col items-center justify-center space-y-4 animate-in fade-in zoom-in">
              <Loader2 className="w-12 h-12 text-[#1B5E20] animate-spin" />
              <div className="text-center">
                <h3 className="font-bold text-slate-700 text-sm">Processing Payment...</h3>
                <p className="text-xs text-slate-500">Please do not close this window</p>
              </div>
            </div>
          )}

          {step === 'success' && (
            <div className="py-10 flex flex-col items-center justify-center space-y-4 animate-in fade-in zoom-in duration-300">
              <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center border border-emerald-500/50">
                <CheckCircle className="w-8 h-8 text-[#1B5E20]" />
              </div>
              <div className="text-center">
                <h3 className="font-bold text-[#1B5E20] text-base">Payment Locked!</h3>
                <p className="text-xs text-slate-500 mt-1">Funds are now secure in Escrow.</p>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
