import React, { useState } from 'react';
import { ArrowLeft, Clock, CheckCircle, Package, MapPin, Calendar, Leaf, Award, ShoppingCart, QrCode, X, BarChart2 } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import MarketIntelligenceScreen from './MarketIntelligenceScreen';

export default function LotDetailScreen({ lot, onBack }) {
  const [selectedImage, setSelectedImage] = useState(null);
  const [showMarketIntel, setShowMarketIntel] = useState(false);

  // Status mapping
  const getStatusConfig = (status) => {
    switch (status) {
      case 'pending_grading':
        return { color: 'bg-amber-100 text-amber-800 border-amber-200', icon: <Clock className="w-5 h-5 text-amber-600" />, text: 'Awaiting Quality Grading' };
      case 'graded':
        return { color: 'bg-blue-100 text-blue-800 border-blue-200', icon: <Award className="w-5 h-5 text-blue-600" />, text: `Graded: ${lot.grade || 'N/A'}` };
      case 'active_listed':
        return { color: 'bg-green-100 text-green-800 border-green-200', icon: <CheckCircle className="w-5 h-5 text-green-600" />, text: 'Active - Listed on Marketplace' };
      case 'sold':
        return { color: 'bg-purple-100 text-purple-800 border-purple-200', icon: <ShoppingCart className="w-5 h-5 text-purple-600" />, text: 'Sold' };
      default:
        return { color: 'bg-slate-100 text-slate-800 border-slate-200', icon: <Clock className="w-5 h-5 text-slate-600" />, text: 'Status Unknown' };
    }
  };

  const statusConfig = getStatusConfig(lot.status);

  // Timeline Steps
  const steps = [
    { key: 'created', label: 'Created', icon: Package },
    { key: 'pending_grading', label: 'Pending Grading', icon: Clock },
    { key: 'graded', label: 'Graded', icon: Award },
    { key: 'active_listed', label: 'Listed', icon: CheckCircle },
    { key: 'sold', label: 'Sold', icon: ShoppingCart },
  ];

  const getStepIndex = (status) => {
    switch(status) {
      case 'pending_grading': return 1;
      case 'graded': return 2;
      case 'active_listed': return 3;
      case 'sold': return 4;
      default: return 0;
    }
  };
  const currentStepIndex = getStepIndex(lot.status);

  if (showMarketIntel) {
    return <MarketIntelligenceScreen cropType={lot.crop} onBack={() => setShowMarketIntel(false)} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Header */}
      <div className="bg-[#2E7D32] text-white p-4 flex items-center sticky top-0 z-10 shadow-md">
        <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-white/20 transition-colors">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="ml-3 text-lg font-semibold truncate flex-1">Lot: {lot.id}</h1>
      </div>

      <div className="p-4 space-y-4 pb-24 overflow-y-auto">
        {/* Status Banner */}
        <div className={`rounded-2xl p-4 flex items-center gap-3 border ${statusConfig.color} shadow-sm`}>
          {statusConfig.icon}
          <span className="font-medium text-sm">{statusConfig.text}</span>
        </div>

        {/* QR Code */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col items-center justify-center">
          <div className="bg-white p-2 rounded-xl shadow-sm border border-slate-100 mb-3">
            <QRCodeSVG value={lot.id} size={160} level="H" />
          </div>
          <div className="flex items-center text-slate-600 gap-2">
            <QrCode className="w-4 h-4" />
            <span className="text-sm font-semibold tracking-wide">{lot.id}</span>
          </div>
        </div>
        
        {/* Market Intelligence CTA */}
        <button
          onClick={() => setShowMarketIntel(true)}
          className="w-full bg-[#1B5E20] text-white rounded-2xl p-4 flex items-center justify-between shadow-sm shadow-[#1B5E20]/20 active:scale-[0.98] transition-transform"
        >
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-xl">
              <BarChart2 className="w-6 h-6 text-white" />
            </div>
            <div className="text-left">
              <h3 className="font-bold text-sm">Nearby Market Intelligence</h3>
              <p className="text-xs text-green-100 mt-0.5">View {lot.crop} demand & prices near you</p>
            </div>
          </div>
          <ArrowLeft className="w-5 h-5 rotate-180 text-white/80" />
        </button>

        {/* Lot Details Card */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-800 mb-4 border-b border-slate-100 pb-2">Lot Details</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col">
              <span className="text-xs text-slate-500 flex items-center gap-1 mb-1"><Leaf className="w-3 h-3" /> Crop</span>
              <span className="text-sm font-medium text-slate-800">{lot.crop}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-slate-500 flex items-center gap-1 mb-1"><Package className="w-3 h-3" /> Variety</span>
              <span className="text-sm font-medium text-slate-800">{lot.variety}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-slate-500 flex items-center gap-1 mb-1"><ShoppingCart className="w-3 h-3" /> Quantity</span>
              <span className="text-sm font-medium text-slate-800">{lot.quantity} kg</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-slate-500 flex items-center gap-1 mb-1"><Calendar className="w-3 h-3" /> Harvest Date</span>
              <span className="text-sm font-medium text-slate-800">{lot.harvestDate}</span>
            </div>
            <div className="flex flex-col col-span-2">
              <span className="text-xs text-slate-500 flex items-center gap-1 mb-1"><MapPin className="w-3 h-3" /> Location</span>
              <span className="text-sm font-medium text-slate-800">{lot.location?.name || 'Unknown Location'}</span>
            </div>
          </div>
        </div>

        {/* Timeline/Status Steps */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-800 mb-4 border-b border-slate-100 pb-2">Tracking Timeline</h2>
          <div className="relative pl-6 space-y-6 before:content-[''] before:absolute before:left-3 before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-200">
            {steps.map((step, index) => {
              const isCompleted = index <= currentStepIndex;
              const isCurrent = index === currentStepIndex;
              const StepIcon = step.icon;
              
              return (
                <div key={step.key} className="relative">
                  {/* Step indicator */}
                  <div className={`absolute -left-9 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full border-2 flex items-center justify-center bg-white z-10 transition-colors ${
                    isCompleted ? 'border-[#2E7D32]' : 'border-slate-300'
                  }`}>
                    <StepIcon className={`w-3 h-3 ${isCompleted ? 'text-[#2E7D32]' : 'text-slate-300'}`} />
                  </div>
                  
                  {/* Step Content */}
                  <div className={`flex flex-col ${isCompleted ? 'opacity-100' : 'opacity-40'}`}>
                    <span className={`text-sm ${isCurrent ? 'font-bold text-[#2E7D32]' : 'font-medium text-slate-700'}`}>
                      {step.label}
                    </span>
                    {isCurrent && index === 1 && (
                      <span className="text-xs text-slate-500 mt-1">Our team will assign a grade soon.</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Image Gallery */}
        {lot.images && lot.images.length > 0 && (
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
            <h2 className="text-sm font-semibold text-slate-800 mb-3 border-b border-slate-100 pb-2">Images ({lot.images.length})</h2>
            <div className="flex overflow-x-auto gap-3 pb-2 -mx-2 px-2 hide-scrollbar" style={{ scrollbarWidth: 'none' }}>
              {lot.images.map((img, idx) => (
                <button 
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className="flex-shrink-0 w-24 h-24 rounded-xl overflow-hidden border border-slate-200 shadow-sm hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[#2E7D32]"
                >
                  <img src={img} alt={`Lot image ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Full Image Modal */}
      {selectedImage && (
        <div className="fixed inset-0 z-50 bg-black/90 flex flex-col items-center justify-center p-4 backdrop-blur-sm transition-opacity">
          <button 
            onClick={() => setSelectedImage(null)}
            className="absolute top-6 right-6 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          <img 
            src={selectedImage} 
            alt="Full view" 
            className="max-w-full max-h-[80vh] object-contain rounded-xl shadow-2xl" 
          />
        </div>
      )}
    </div>
  );
}
