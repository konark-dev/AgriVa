import React, { useState } from 'react';
import { 
  ArrowLeft, Star, MapPin, CheckCircle, ChevronDown, 
  Filter, Volume2, Zap, TrendingUp, Square, CheckSquare 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function BuyerOffersView({ requirement, onBack }) {
  const { offers, acceptOffer, requirements } = useApp();
  
  // Requirement comes from props, let's destructure safely
  const req = requirement || {};
  
  const reqOffers = offers.filter(o => o.requirementId === req.id && o.status === 'Pending');
  const acceptedOffers = offers.filter(o => o.requirementId === req.id && o.status === 'Accepted');
  const acceptedCount = acceptedOffers.length;
  
  const [selectedIds, setSelectedIds] = useState([]);
  const [sortBy, setSortBy] = useState('price');
  const [loading, setLoading] = useState(false);
  
  const sortedOffers = [...reqOffers].sort((a, b) =>
    sortBy === 'price' ? a.pricePerUnit - b.pricePerUnit : new Date(a.createdAt) - new Date(b.createdAt)
  );
  
  const toggleSelect = (id) =>
    setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  
  const selectedQty = selectedIds.reduce((sum, id) => {
    const o = offers.find(x => x.id === id);
    return sum + (o?.offeredQty || 0);
  }, 0);
  
  const totalFulfilled = (req.fulfilledQty || 0) + selectedQty;
  const pct = Math.min(100, Math.round((totalFulfilled / (req.targetQty || 1)) * 100));
  const gap = Math.max(0, (req.targetQty || 0) - totalFulfilled);
  
  const handleAccept = async () => {
    if (!selectedIds.length) return;
    setLoading(true);
    await acceptOffer(req.id, selectedIds);
    setLoading(false);
    onBack();
  };

  const getSellerBadge = (type) => {
    if (type === 'Verified') return <span className="text-xs bg-green-900 text-white px-2 py-0.5 rounded-full">● अति सत्यापित</span>;
    if (type === 'FPO') return <span className="text-xs border border-blue-500 text-blue-600 px-2 py-0.5 rounded-full">▶ FPO प्रोफ़ाइल</span>;
    return <span className="text-xs border border-gray-400 text-gray-600 px-2 py-0.5 rounded-full">◎ Self-declared</span>;
  };

  return (
    <div className="min-h-screen bg-[#f9f8f3] pb-32">
      {/* Header */}
      <div className="bg-white px-4 py-4 sticky top-0 z-10 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-1 rounded-full hover:bg-slate-100">
            <ArrowLeft className="w-6 h-6 text-slate-700" />
          </button>
          <h1 className="font-bold text-lg text-slate-800">AgriVa / Offers</h1>
        </div>
        <button className="bg-[#F57F17] text-white px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1">
          <Volume2 className="w-4 h-4" />
          बोल कर सुनें
        </button>
      </div>

      <div className="p-4 space-y-3">
        {/* Requirement Summary Card */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-medium flex items-center gap-1">
              ✅ सक्रिय / Active Buyer FPO
            </span>
          </div>
          <h2 className="font-bold text-slate-900 text-lg">
            {req.crop} ({req.cropEn}) — {req.targetQty} क्विंटल आवश्यक
          </h2>
          <div className="flex justify-between items-center mt-2">
            <p className="text-sm text-slate-500">
              {req.variety} • ₹ {req.indicativePrice} / क्विंटल guide
            </p>
            <span className="bg-[#F57F17] text-white text-xs px-2 py-1 rounded-full font-medium flex items-center gap-1">
              <Star className="w-3 h-3 fill-white" />
              {reqOffers.length} Offers
            </span>
          </div>
        </div>

        {/* Fulfillment Progress */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-semibold text-slate-500 tracking-wider">पूर्ण प्रगति / FULFILLMENT PROGRESS</span>
            <span className="text-sm font-bold text-green-700">{pct}% पूर्ण</span>
          </div>
          <div className="h-3 rounded-full bg-slate-100 mb-2 overflow-hidden">
            <div 
              className="h-full bg-[#1B5E20] rounded-full transition-all duration-300" 
              style={{ width: `${pct}%` }}
            ></div>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-500">
              {totalFulfilled} / {req.targetQty} क्विंटल ({acceptedCount} farmers)
            </span>
            <span className="text-[#F57F17] font-medium">
              {gap} क्विंटल (Gap Remaining)
            </span>
          </div>
        </div>

        {/* Sort & Filter Bar */}
        <div className="flex items-center gap-2 overflow-x-auto py-1 scrollbar-hide">
          <span className="text-sm text-slate-700 font-medium whitespace-nowrap">क्रमबद्ध / Sort By:</span>
          <button 
            onClick={() => setSortBy('price')}
            className={`px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1 whitespace-nowrap transition-colors ${
              sortBy === 'price' ? 'bg-[#1B5E20] text-white' : 'border border-slate-300 text-slate-600'
            }`}
          >
            {sortBy === 'price' && '✓'} भाव कम से ज़्यादा (Price: Low)
          </button>
          <button 
            onClick={() => setSortBy('date')}
            className={`px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1 whitespace-nowrap transition-colors ${
              sortBy === 'date' ? 'bg-[#1B5E20] text-white' : 'border border-slate-300 text-slate-600'
            }`}
          >
            {sortBy === 'date' && '✓'} तारीख (Date)
          </button>
          <button className="p-1.5 rounded-full border border-slate-300 text-slate-600 ml-auto">
            <Filter className="w-4 h-4" />
          </button>
        </div>

        {/* Yellow Tip Banner */}
        {gap > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-amber-800 text-sm flex items-start gap-2">
            <span>💡</span>
            <p>पूरी मांग पूरी नहीं होगी एक किसान से... यह बोली आंशिक (Partial Fulfillment) में सहायक होगी।</p>
          </div>
        )}

        {/* Offer Cards */}
        <div className="space-y-3">
          {sortedOffers.map(offer => {
            const isSelected = selectedIds.includes(offer.id);
            const totalPayout = (offer.offeredQty || 0) * (offer.pricePerUnit || 0);

            return (
              <div 
                key={offer.id} 
                className={`rounded-2xl border-2 p-4 transition-all ${
                  isSelected ? 'border-[#1B5E20] bg-green-50' : 'border-slate-200 bg-white'
                }`}
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2">
                    <button onClick={() => toggleSelect(offer.id)} className="text-[#1B5E20]">
                      {isSelected ? <CheckSquare className="w-5 h-5" /> : <Square className="w-5 h-5 text-slate-600" />}
                    </button>
                    {isSelected && (
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full font-medium">
                        ✓ चयनित / Selected
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-1 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">{offer.sellerName}</span>
                    {getSellerBadge(offer.sellerType)}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-500">
                    <span className="flex items-center gap-0.5">
                      <MapPin className="w-3 h-3" /> {offer.distanceKm} किमी दूर ({offer.sellerLocation})
                    </span>
                    <span className="flex items-center gap-0.5">
                      <Star className="w-3 h-3 text-amber-500 fill-amber-500" /> {offer.sellerTrustScore} ({offer.sellerRating})
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 mb-3">
                  <div className="bg-slate-50/50 p-2 rounded-lg border border-slate-100">
                    <div className="text-xs text-slate-500 mb-1">आपूर्ति मात्रा / Quantity</div>
                    <div className="font-medium text-slate-800">{offer.offeredQty} क्विंटल</div>
                  </div>
                  <div className="bg-slate-50/50 p-2 rounded-lg border border-slate-100">
                    <div className="text-xs text-slate-500 mb-1">प्रदायित भाव / Rate</div>
                    <div className="font-bold text-[#1B5E20]">₹ {offer.pricePerUnit} / क्विंटल</div>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-lg p-2 mb-3 flex justify-between items-center text-sm border border-slate-100">
                  <span className="text-slate-600 font-medium">कुल अनुमानित (Total):</span>
                  <span className="font-bold text-slate-900">₹ {totalPayout.toLocaleString('en-IN')}</span>
                </div>

                <div>
                  {isSelected ? (
                    <div className="flex justify-between items-center">
                      <span className="text-[#1B5E20] font-medium flex items-center gap-1 text-sm">
                        ✓ चयनित / Selected <ChevronDown className="w-4 h-4" />
                      </span>
                      <button className="border border-slate-300 text-slate-700 px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1">
                        📊 विवरण पत्र
                      </button>
                    </div>
                  ) : (
                    <button 
                      onClick={() => toggleSelect(offer.id)}
                      className="w-full border border-[#1B5E20] text-[#1B5E20] rounded-xl py-2 font-medium hover:bg-green-50 transition-colors"
                    >
                      + स्वीकार करें / Accept
                    </button>
                  )}
                </div>
              </div>
            );
          })}
          {sortedOffers.length === 0 && (
            <div className="text-center py-8 text-slate-500">
              No offers available for this requirement yet.
            </div>
          )}
        </div>
      </div>

      {/* Sticky Bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 z-20 shadow-[0_-4px_6px_-1px_rgb(0,0,0,0.05)]">
        <button 
          onClick={handleAccept}
          disabled={selectedIds.length === 0 || loading}
          className={`w-full rounded-2xl py-4 font-bold text-base flex flex-col items-center justify-center transition-all
            ${selectedIds.length > 0 ? 'bg-[#1B5E20] text-white shadow-lg active:scale-[0.98]' : 'bg-slate-200 text-slate-500 cursor-not-allowed'}
          `}
        >
          <span>
            {loading ? 'Processing...' : 'चयनित बोलियां स्वीकार करें / Accept All Selected'}
          </span>
          {selectedIds.length > 0 && (
            <span className="text-xs font-normal opacity-90 mt-1">
              ✓ {selectedIds.length} Offers Selected
            </span>
          )}
        </button>
      </div>
    </div>
  );
}
