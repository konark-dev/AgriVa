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
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white border border-slate-200 rounded-t-3xl sm:rounded-3xl w-full max-w-sm flex flex-col shadow-2xl animate-in slide-in-from-bottom-4 duration-300">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-white text-slate-800 shrink-0 rounded-t-3xl">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-6 h-6 text-emerald-600" />
            <div>
              <h3 className="font-bold text-sm text-slate-800">Secure Escrow Payment</h3>
              <p className="text-[10px] text-slate-500">Powered by Razorpay Simulation</p>
            </div>
          </div>
          <button onClick={onClose} disabled={step !== 'scan'} className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500 transition-colors disabled:opacity-30">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 flex flex-col items-center justify-center space-y-5">
          
          {step === 'scan' && (
            <>
              <div className="text-center space-y-1 mb-2">
                <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Total Amount to Lock</p>
                <p className="text-4xl font-black text-slate-900">₹{amount.toLocaleString()}</p>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm w-48 h-48 flex flex-col items-center justify-center text-slate-800">
                <QrCode className="w-32 h-32" />
                <span className="text-[10px] font-bold mt-2 text-slate-500">Scan with any UPI App</span>
              </div>

              <div className="w-full flex items-center space-x-2 my-3">
                <div className="h-px flex-1 bg-slate-200"></div>
                <span className="text-xs font-bold text-slate-400">OR</span>
                <div className="h-px flex-1 bg-slate-200"></div>
              </div>

              <form onSubmit={handleSimulatePayment} className="w-full space-y-3 pb-2">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Smartphone className="w-4 h-4 text-slate-400" />
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="Enter UPI ID (e.g. buyer@upi)"
                    className="w-full pl-10 pr-3 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 font-bold text-sm focus:outline-none focus:border-emerald-500 focus:bg-white transition-colors"
                  />
                </div>
                <button type="submit" className="w-full btn-touch py-3.5 rounded-xl bg-emerald-600 text-white font-bold text-sm shadow-md hover:bg-emerald-700 transition-colors">
                  Pay Securely via UPI
                </button>
              </form>
            </>
          )}

          {step === 'processing' && (
            <div className="py-16 flex flex-col items-center justify-center space-y-5 animate-in fade-in zoom-in">
              <Loader2 className="w-14 h-14 text-emerald-600 animate-spin" />
              <div className="text-center">
                <h3 className="font-bold text-slate-800 text-base">Processing Payment...</h3>
                <p className="text-xs text-slate-500 mt-1">Please do not close this window</p>
              </div>
            </div>
          )}

          {step === 'success' && (
            <div className="py-16 flex flex-col items-center justify-center space-y-5 animate-in fade-in zoom-in duration-300">
              <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center border-4 border-emerald-100 shadow-inner">
                <CheckCircle className="w-10 h-10 text-emerald-600" />
              </div>
              <div className="text-center space-y-1.5">
                <h3 className="font-black text-emerald-700 text-xl">Payment Locked!</h3>
                <p className="text-sm font-medium text-slate-600">Funds are now secure in Escrow.</p>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
