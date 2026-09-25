import React, { useRef, useEffect } from 'react';
import { Check, Clock, AlertTriangle, ShieldCheck } from 'lucide-react';

export default function VisualStepper({ currentStatus, deliveryMode = 'direct', qualityFlag = false }) {
  const baseSteps = [
    { key: 'Listed', label: 'Listed' },
    { key: 'Bid Received', label: 'Bid' },
    { key: 'Accepted', label: 'Accepted' },
    { key: 'Transport Assigned', label: 'Transport' },
    { key: 'Picked Up', label: 'Picked Up' },
    ...(deliveryMode === 'verified' ? [{ key: 'Lab Verified', label: 'Lab Check', isLab: true }] : []),
    { key: 'Delivered', label: 'Delivered' },
    { key: 'Payment Done', label: 'Paid' }
  ];

  const getStepIndex = (status) => {
    switch (status) {
      case 'Listed': return 0;
      case 'Bid Received': return 1;
      case 'Accepted': return 2;
      case 'Transport Assigned': return 3;
      case 'Picked Up': return 4;
      case 'Lab Verified': return deliveryMode === 'verified' ? 5 : 4;
      case 'Delivered': return deliveryMode === 'verified' ? 6 : 5;
      case 'Payment Done': return deliveryMode === 'verified' ? 7 : 6;
      default: return 0;
    }
  };

  const currentIndex = getStepIndex(currentStatus);
  const scrollRef = useRef(null);
  const totalSteps = Math.max(1, baseSteps.length - 1);
  const progressPercent = (currentIndex / totalSteps) * 100;

  // Auto-scroll to current step on mount
  useEffect(() => {
    if (scrollRef.current) {
      const activeStep = scrollRef.current.querySelector('.active-step');
      if (activeStep) {
        activeStep.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  }, [currentIndex]);

  return (
    <div className="w-full py-1">
      {/* Scrollable Container to prevent mobile squishing */}
      <div 
        ref={scrollRef}
        className="overflow-x-auto no-scrollbar pb-2 pt-3 mask-image-fade"
      >
        <div className="flex items-start justify-between relative min-w-[550px] px-4">
          
          {/* Background Connecting Line */}
          <div className="absolute left-8 right-8 top-4 h-0.5 bg-slate-200 -z-0" />
          
          {/* Progress Fill Line */}
          <div
            className="absolute left-8 top-4 h-0.5 bg-emerald-600 transition-all duration-500 -z-0"
            style={{ width: "calc(" + progressPercent + "% - " + (progressPercent / 100 * 32) + "px)" }}
          />

          {baseSteps.map((step, idx) => {
            const isCompleted = idx < currentIndex;
            const isCurrent = idx === currentIndex;
            const isFlagged = isCurrent && qualityFlag;

            return (
              <div 
                key={step.key} 
                className={"flex flex-col items-center z-10 w-12 shrink-0 " + (isCurrent ? 'active-step' : '')}
              >
                <div
                  className={"w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all shadow-sm " + (
                    isFlagged
                      ? 'bg-amber-500 text-slate-950 ring-4 ring-amber-500/30 animate-pulse'
                      : isCurrent
                      ? 'bg-emerald-700 text-white ring-4 ring-emerald-500/30 scale-110 shadow-md'
                      : isCompleted
                      ? 'bg-emerald-600 text-white'
                      : 'bg-white text-slate-400 border border-slate-200'
                  )}
                >
                  {isFlagged ? (
                    <AlertTriangle className="w-4 h-4" />
                  ) : isCompleted ? (
                    <Check className="w-4 h-4" />
                  ) : step.isLab ? (
                    <ShieldCheck className="w-4 h-4" />
                  ) : isCurrent ? (
                    <Clock className="w-4 h-4 animate-spin" style={{ animationDuration: '3s' }} />
                  ) : (
                    <span>{idx + 1}</span>
                  )}
                </div>
                <span className={"text-[10px] text-center font-medium mt-1.5 leading-tight " + (
                  isCurrent ? 'text-emerald-700 font-bold' : isCompleted ? 'text-slate-600' : 'text-slate-400'
                )}>
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
