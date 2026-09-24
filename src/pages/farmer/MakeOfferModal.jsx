import React, { useState } from 'react';
import { ArrowLeft, Mic, AlertTriangle, CheckCircle, Zap, Volume2, ToggleRight, ToggleLeft, ChevronDown } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { speakText, initSpeechRecognition } from '../../utils/speechUtils';
import NetRealizationWidget from '../../components/NetRealizationWidget';

export default function MakeOfferModal({ requirement, onClose }) {
  const [offeredQty, setOfferedQty] = useState(500);
  const [pricePerUnit, setPricePerUnit] = useState('');
  const [linkListing, setLinkListing] = useState(true);
  const [loading, setLoading] = useState(false);
  
  const { makeOffer, listings, currentUser, checkUnderpricing } = useApp();
  const myListings = listings.filter(l => l.farmerId === currentUser.uid);
  const myListing = myListings[0] || null;

  const handleSubmit = async () => {
    if (!pricePerUnit || !offeredQty) return;
    setLoading(true);
    await makeOffer(requirement.id, {
      offeredQty: Number(offeredQty),
      pricePerUnit: Number(pricePerUnit),
      sellerLocation: currentUser.farmLocation?.name || 'N/A',
      sellerDistanceKm: 8,
      linkedListingId: linkListing && myListing ? myListing.id : null
    });
    setLoading(false);
    onClose();
  };

  const showWarning = pricePerUnit > 0 && pricePerUnit < requirement.indicativePrice * 0.7;
  const totalPayout = (Number(offeredQty) || 0) * (Number(pricePerUnit) || 0);

  const handleListenScreen = () => {
    speakText(`यह बोली लगाने का पेज है। खरीदार ${requirement.buyerName || 'ITC'} को ${requirement.targetQty} क्विंटल ${requirement.crop} की आवश्यकता है। कृपया अपनी मात्रा और प्रति क्विंटल मूल्य दर्ज करें।`);
  };

  const handleMicInput = (setter) => {
    initSpeechRecognition((transcript) => {
      const match = transcript.match(/\d+/);
      if (match) setter(match[0]);
    }, null, null, 'hi-IN').start();
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#f9f8f3] overflow-y-auto pb-20">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-white border-b border-slate-200">
        <button onClick={onClose} className="p-2 -ml-2 rounded-full hover:bg-slate-100">
          <ArrowLeft className="w-6 h-6 text-slate-800" />
        </button>
        <h1 className="text-lg font-bold text-slate-800">बोली लगाएं / Make an Offer</h1>
        <button onClick={handleListenScreen} className="flex items-center gap-1 bg-orange-100 text-[#F57F17] px-3 py-1 rounded-full text-xs font-medium">
          <Volume2 className="w-3 h-3" />
          बोल कर सुनें
        </button>
      </div>

      <div className="p-4 space-y-6">
        {/* Requirement Summary Strip */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 mb-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xl">🌾</span>
            <span className="font-bold text-slate-800">{requirement.crop}</span>
            <span className="text-slate-600">({requirement.variety})</span>
            <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full flex items-center gap-1">
              <CheckCircle className="w-3 h-3" />
              सत्यापित
            </span>
          </div>
          <div className="flex flex-col mb-3">
            <span className="font-bold text-slate-800">{requirement.buyerName || 'ITC Rural Procurement Ltd.'}</span>
            <span className="text-xs text-slate-500">ITC Rural Procurement Ltd.</span>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-3 border-y border-slate-100 py-3">
            <div>
              <p className="text-xs text-slate-500">फसल मांग / Target Qty</p>
              <p className="font-medium">{requirement.targetQty} क्विंटल</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">संदर्भ भाव / Guide</p>
              <p className="font-medium text-[#1B5E20]">₹ {requirement.indicativePrice}/क्विंटल</p>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-600 flex items-center gap-1">
              📍 {requirement.deliveryLocation} (8 किमी)
            </p>
            <span className="bg-orange-100 text-orange-700 text-xs px-2 py-1 rounded-lg font-medium flex items-center gap-1">
              ⏰ 3 दिन शेष (Closing soon)
            </span>
          </div>
        </div>

        {/* Section 1: Offered Quantity */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 bg-[#1B5E20] text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
            <h2 className="font-bold text-slate-800">आप कितनी मात्रा बेचना चाहते हैं?</h2>
            <span className="bg-green-100 text-[#1B5E20] text-xs px-2 py-0.5 rounded-full">अनिवार्य</span>
          </div>
          
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 bg-white border border-slate-300 rounded-2xl flex items-center overflow-hidden focus-within:border-[#1B5E20]">
              <input 
                type="number" 
                value={offeredQty}
                onChange={(e) => setOfferedQty(e.target.value)}
                className="w-full py-3 px-4 text-xl font-bold text-slate-800 outline-none"
                placeholder="0"
              />
              <span className="pr-4 text-slate-500 font-medium">क्विंटल/Qtl</span>
            </div>
            <button onClick={() => handleMicInput(setOfferedQty)} className="bg-orange-100 p-3 rounded-2xl text-[#F57F17]">
              <Mic className="w-6 h-6" />
            </button>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {[100, 250, 500].map(qty => (
              <button
                key={qty}
                onClick={() => setOfferedQty(qty)}
                className={`whitespace-nowrap px-4 py-2 rounded-xl text-sm font-medium border ${Number(offeredQty) === qty ? 'bg-[#1B5E20] text-white border-[#1B5E20]' : 'bg-white text-slate-700 border-slate-300'}`}
              >
                {qty} Qtl
              </button>
            ))}
            <button
              onClick={() => setOfferedQty(requirement.targetQty)}
              className={`whitespace-nowrap px-4 py-2 rounded-xl text-sm font-medium border ${Number(offeredQty) === requirement.targetQty ? 'bg-[#1B5E20] text-white border-[#1B5E20]' : 'bg-white text-slate-700 border-slate-300'}`}
            >
              पूरा {requirement.targetQty}
            </button>
          </div>
        </div>

        {/* Section 2: Price Per Unit */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 bg-[#1B5E20] text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
            <h2 className="font-bold text-slate-800">आपकी प्रति क्विंटल मांग / Offered Price Per Unit</h2>
            <span className="bg-green-100 text-[#1B5E20] text-xs px-2 py-0.5 rounded-full flex items-center gap-1">
              📊 भाव मंत्र
            </span>
          </div>

          <div className="flex items-center gap-3 mb-2">
            <div className="flex-1 bg-white border border-slate-300 rounded-2xl flex items-center overflow-hidden focus-within:border-[#1B5E20]">
              <span className="pl-4 text-xl font-medium text-slate-500">₹</span>
              <input 
                type="number" 
                value={pricePerUnit}
                onChange={(e) => setPricePerUnit(e.target.value)}
                className="w-full py-3 px-2 text-xl font-bold text-slate-800 outline-none"
                placeholder="0"
              />
              <span className="pr-4 text-slate-500 font-medium">/ क्विंटल</span>
            </div>
            <button onClick={() => handleMicInput(setPricePerUnit)} className="bg-orange-100 p-3 rounded-2xl text-[#F57F17]">
              <Mic className="w-6 h-6" />
            </button>
          </div>
          <p className="text-xs text-slate-500 ml-1 mb-3">
            आज का मंडी औसत (Mandi Avg): ₹ {requirement.indicativePrice || 2450} / क्विंटल
          </p>

          {showWarning && (
            <div className="bg-orange-50 border border-orange-300 rounded-2xl p-3 flex gap-3 items-start">
              <AlertTriangle className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-orange-800 font-medium mb-1">
                  ⚠️ यह भाव सामान्य मंडी भाव से काफी कम है!
                </p>
                <p className="text-xs text-orange-700 mb-1">
                  This is below 70% of typical mandi price (₹ {requirement.indicativePrice}). आपको नुकसान हो सकता है।
                </p>
                <p className="text-xs text-orange-800 font-medium bg-orange-100 inline-block px-2 py-1 rounded">
                  सलाह: ₹ {Math.round(requirement.indicativePrice * 0.92)} - ₹ {requirement.indicativePrice} की बोली लगाएं
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Section 3: Link Active Listing */}
        {myListing && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 flex items-center justify-between bg-slate-50 border-b border-slate-100">
              <div className="flex-1">
                <p className="text-sm font-bold text-slate-800">मेरी सक्रिय लिस्टिंग से जोड़ें</p>
                <p className="text-xs text-slate-500">Link to active listing for instant trust</p>
              </div>
              <button onClick={() => setLinkListing(!linkListing)} className="text-[#1B5E20]">
                {linkListing ? <ToggleRight className="w-8 h-8" /> : <ToggleLeft className="w-8 h-8 text-slate-600" />}
              </button>
            </div>
            
            {linkListing && (
              <div className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-medium text-slate-700">चयनित बैच (Selected Batch)</span>
                  <span className="bg-green-100 text-[#1B5E20] text-[10px] px-2 py-0.5 rounded-full font-medium">स्टॉक सत्यापित / Stock Verified</span>
                </div>
                <div className="border border-slate-200 rounded-xl p-3 mb-2 flex justify-between items-center bg-slate-50">
                  <div>
                    <p className="text-sm font-bold text-slate-800">लिस्टिंग #KS-{myListing.id?.slice(-4) || '1023'}</p>
                    <p className="text-xs text-slate-600">{myListing.quantity} क्विंटल {myListing.crop} (Godown में सुरक्षित)</p>
                  </div>
                  <ChevronDown className="w-5 h-5 text-slate-500" />
                </div>
                <p className="text-xs text-slate-500 mb-3 flex items-center gap-1">
                  <span className="text-slate-500">📎</span> परिवहन तौल रसीद संलग्न (Direct weighbridge receipt attached)
                </p>
                <p className="text-[10px] italic text-slate-500">
                  परिवर्तन संभव नहीं है; लिस्टिंग और संदर्भ भाव की शर्तों से सहमत होना होगा।
                </p>
              </div>
            )}
          </div>
        )}

        {/* Total Payout Preview */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 border-l-4 border-l-[#1B5E20]">
          <p className="text-sm font-medium text-slate-600 mb-1">बुल अनुमानित राशि / Total Payout</p>
          <p className="text-3xl font-bold text-[#1B5E20] mb-2">₹ {totalPayout.toLocaleString('en-IN')}</p>
          <div className="flex justify-between items-end">
            <p className="text-xs text-slate-500">सामग्री: {offeredQty || 0} Qt × ₹{pricePerUnit || 0}</p>
            <p className="text-xs font-medium text-[#1B5E20] bg-green-50 px-2 py-1 rounded">डीपीसी बैंक खाते में (Direct Bank Settlement)</p>
          </div>
        </div>
        
        <NetRealizationWidget price={pricePerUnit} quantity={offeredQty} grade={requirement?.grade || 'Grade A'} />

        {checkUnderpricing(requirement?.crop, pricePerUnit) && (
          <div className="bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold p-3 rounded-xl flex items-start gap-2 shadow-sm mt-4">
            <span className="text-amber-500 mt-0.5">⚠️</span>
            <span>This price is below the typical mandi rate for this crop.</span>
          </div>
        )}

        <p className="text-xs text-center text-slate-500 pt-2 pb-24">
          ऑफर देने के बाद खरीदार से पुष्टि की प्रतीक्षा करें
        </p>

      </div>

      {/* Footer CTA */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-slate-200">
        <button 
          onClick={handleSubmit}
          disabled={loading || !pricePerUnit || !offeredQty}
          className="w-full bg-[#1B5E20] text-white rounded-2xl py-4 font-bold text-lg flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {loading ? 'कृपया प्रतीक्षा करें...' : (
            <>
              <Zap className="w-5 h-5 fill-current" />
              ⚡ बोली जमा करें / Submit Offer →
            </>
          )}
        </button>
      </div>
    </div>
  );
}
