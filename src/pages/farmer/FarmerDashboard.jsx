import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import GlobalVoiceNavigator from '../../components/GlobalVoiceNavigator';
import VisualStepper from '../../components/VisualStepper';
import EmptyState from '../../components/EmptyState';
import AddListingModal from './AddListingModal';
import LiveMandiPrices from '../shared/LiveMandiPrices';
import RatingStars from '../../components/RatingStars';
import { calculatePayoutBreakdown } from '../../utils/qualityEngine';
import { speakText, initSpeechRecognition } from '../../utils/speechUtils';
import {
  PlusCircle,
  Tag,
  Check,
  X,
  ShieldCheck,
  AlertTriangle,
  DollarSign,
  Star,
  Truck,
  Mic,
  CheckCircle2,
  ArrowRight,
  Eye,
  EyeOff
} from 'lucide-react';

export default function FarmerDashboard() {
  // Context
  const {
    listings,
    bids,
    acceptBid,
    currentUser,
    labRegistrations,
    triggerToast
  } = useApp();

  // UI state
  const [activeTab, setActiveTab] = useState('crops'); // crops | sales
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedBidModal, setSelectedBidModal] = useState(null);
  const [payoutModal, setPayoutModal] = useState(null);
  const [qualityRenegotiationModal, setQualityRenegotiationModal] = useState(null);
  const [ratedDeliveries, setRatedDeliveries] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [hideBalance, setHideBalance] = useState(false);
  const [showListingModal, setShowListingModal] = useState(false);
  const [showTicker, setShowTicker] = useState(false);

  // Derived data
  const myCount = listings.filter(l => l.farmerId === currentUser.uid).length;
  const mySalesCount = listings.filter(l => l.farmerId === currentUser.uid && l.status !== 'Listed' && l.status !== 'Bid Received').length;

  // Lab availability flag (for verified delivery)
  const hasLabAvailable = labRegistrations.some(l => l.verificationStatus === 'approved');

  // Helper: filter listings based on search (crop name)
  const filteredListings = listings
    .filter(l => l.farmerId === currentUser.uid && (l.status === 'Listed' || l.status === 'Bid Received'))
    .filter(l => (searchTerm ? l.crop.toLowerCase().includes(searchTerm.toLowerCase()) : true));

  // Helper: get sales (non‑listed)
  const sales = listings.filter(l => l.farmerId === currentUser.uid && l.status !== 'Listed' && l.status !== 'Bid Received');

  // Dummy ticker data (replace with real data source later)
  const ticker = {
    crop: 'गेहूं',
    variety: 'शर्बती',
    price: 2850,
    change: '+45'
  };

  // Color tokens
  const COLORS = {
    primary: '#1B5E20', // green
    orange: '#F57F17',   // accent / mic
    red: '#BF360C',      // danger
    bgLight: '#f9f8f3'   // main background
  };

  if (showTicker) {
    return <LiveMandiPrices onBack={() => setShowTicker(false)} />;
  }

  return (
    <div className="space-y-4 p-4 pb-24 bg-[#f9f8f3] min-h-screen text-slate-800 max-w-4xl mx-auto">

      {/* ---------- Header with ticker ---------- */}
      <div className="flex items-center justify-between p-3 bg-white rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 bg-green-500 rounded-full" />
          <span className="text-sm font-semibold text-slate-800">
            {ticker.crop} {ticker.variety} ₹{ticker.price.toLocaleString()}/क्वि. {ticker.change}
          </span>
        </div>
        <button 
          onClick={() => setShowTicker(true)}
          className="text-xs font-medium text-[#1B5E20] hover:underline"
        >
          सभी भाव / View More
        </button>
      </div>

      {/* ---------- Welcome card ---------- */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-extrabold text-slate-800">
            नमस्ते, {currentUser.name.split(' ')[0]} जी 👋
          </h2>
          <p className="text-xs text-slate-500 mt-1 font-medium flex items-center">
            📍 {currentUser.village}
            {currentUser.role === 'farmer' && (
              currentUser.sellerBadge === 'New Seller' ? (
                <span className="ml-2 px-1.5 py-0.5 bg-rose-100 text-rose-700 rounded text-[9px] font-bold uppercase tracking-wider border border-rose-200">
                  ❌ Unverified
                </span>
              ) : (
                <span className="ml-2 px-1.5 py-0.5 bg-emerald-100 text-emerald-800 rounded text-[9px] font-bold uppercase tracking-wider border border-emerald-200">
                  ✓ Verified
                </span>
              )
            )}
          </p>
        </div>
        <button className="w-10 h-10 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center text-[#1B5E20] font-bold">
          {currentUser.name.charAt(0)}
        </button>
      </div>

      {/* ---------- Search bar with mic ---------- */}
      <div className="relative">
        <input
          type="text"
          placeholder="फसल या भाव खोजें (या माइक दबाएँ)..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="w-full pl-4 pr-12 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#1B5E20]"
        />
        <button
          onClick={() => {
            initSpeechRecognition((t) => setSearchTerm(t), null, null, 'hi-IN').start();
          }}
          className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center justify-center w-8 h-8 bg-[#F57F17] rounded-full text-white"
        >
          <Mic className="w-4 h-4" />
        </button>
      </div>

      {/* ---------- CTA: Sell My Crop ---------- */}
      <div className="p-4 bg-white rounded-2xl border-2 border-[#1B5E20] shadow-sm flex flex-col space-y-3 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-green-50 rounded-full -mr-8 -mt-8 z-0"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-lg font-extrabold text-[#1B5E20]">मेरी फसल बेचें / Sell My Crop</h3>
            <span className="px-2 py-0.5 bg-green-100 text-green-800 border border-green-200 rounded-full text-[10px] font-bold">
              0% कमीशन
            </span>
          </div>
          <p className="text-xs text-slate-500 mb-3"></p>
          <button
            onClick={() => setShowAddModal(true)}
            className="w-full py-3 bg-[#1B5E20] text-white rounded-xl font-bold shadow flex justify-center items-center"
          >
            <PlusCircle className="w-5 h-5 mr-2" /> फसल सूची जोड़ें / Add Listing
          </button>
        </div>
      </div>

      {/* ---------- Net Realization / Verification Card ---------- */}
      {currentUser.role === 'farmer' && currentUser.sellerBadge === 'New Seller' ? (
        <div className="p-4 bg-rose-50 rounded-2xl border border-rose-200 shadow-sm flex flex-col space-y-3">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold text-rose-700 uppercase tracking-wider">⚠️ e-KYC Pending / सत्यापन शेष</p>
              <p className="text-[10px] text-rose-600 mb-1 leading-snug mt-1">
                
              </p>
            </div>
          </div>
          <button 
            onClick={() => triggerToast('e-KYC Verification process started via e-NAM Gateway.', 'Verification Started', 'info')}
            className="w-full py-2 bg-rose-600 text-white rounded-xl text-xs font-bold shadow-sm"
          >
            Start Aadhaar e-KYC Now →
          </button>
        </div>
      ) : (
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">इस महीने की कुल बैंक प्राप्ति</p>
            <div className="flex items-center gap-2 mb-1">
              <p className="text-[10px] text-slate-500">Direct Bank Deposit</p>
              <button onClick={() => setHideBalance(!hideBalance)} className="text-slate-400 hover:text-slate-600 transition">
                {hideBalance ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>
            <p className="text-2xl font-black text-[#1B5E20]">
              {hideBalance ? '₹ *******' : '₹ 1,48,500'}
            </p>
          </div>
          <div className="flex flex-col items-end">
            <span className="px-2 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg text-xs font-bold flex items-center">
              ↑ +12%
            </span>
          </div>
        </div>
      )}

      {/* ---------- Mandi Alert Card ---------- */}
      <div className="p-3 bg-orange-50 rounded-xl border border-orange-200 flex items-start space-x-3 shadow-sm">
        <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center shrink-0 mt-0.5">
          <AlertTriangle className="w-4 h-4 text-orange-600" />
        </div>
        <div>
          <p className="font-bold text-sm text-orange-900">मंडी बंदी सूचना / Mandi Alert</p>
          <p className="text-xs text-orange-700 leading-snug mt-0.5"></p>
        </div>
      </div>

      {/* ---------- Listing & Sales Tabs ---------- */}
      <div className="grid grid-cols-2 gap-2 bg-white rounded-2xl p-1 border border-slate-200">
        <button
          onClick={() => setActiveTab('crops')}
          className={`py-2 rounded-xl text-xs font-semibold ${activeTab === 'crops' ? 'bg-[#1B5E20] text-white' : 'text-slate-600'}`}
        >
          मेरी सूची ({myCount})
        </button>
        <button
          onClick={() => setActiveTab('sales')}
          className={`py-2 rounded-xl text-xs font-semibold ${activeTab === 'sales' ? 'bg-[#1B5E20] text-white' : 'text-slate-600'}`}
        >
          सक्रिय बिक्री ({mySalesCount})
        </button>
      </div>

      {/* ---------- Content based on tab ---------- */}
      {activeTab === 'crops' && (
        <div className="flex flex-col md:grid md:grid-cols-2 md:gap-4 md:space-y-0 space-y-4">
          {filteredListings.length === 0 ? (
            <EmptyState
              title="कोई सूची नहीं"
              description="फ़सल सूची जोड़ने के लिए ऊपर के ‘फ़सल सूची जोड़ें’ बटन का प्रयोग करें।"
            />
          ) : (
            filteredListings.map(item => {
              const itemBids = bids.filter(b => b.listingId === item.id);
              const hasNoBids = itemBids.length === 0 && item.status === 'Listed';
              return (
                <div key={item.id} className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-extrabold text-sm text-[#1B5E20]">{item.crop}</span>
                        <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full text-xs">{item.quantity} kg</span>
                      </div>
                      <p className="text-xs text-slate-500">स्थान: {item.location?.name || 'सोनिपत फ़ार्म'}</p>
                      <p className="text-xs text-slate-500">भुगतान अपेक्षित: ₹{item.price || 0}/kg</p>
                    </div>
                    <div className="text-right">
                      <span className="text-base font-bold text-[#1B5E20]">₹{item.price || 0}/kg</span>
                    </div>
                  </div>

                  {/* No‑bid suggestion */}
                  {hasNoBids && (
                    <div className="mt-2 p-2 bg-amber-100 text-amber-800 rounded-md text-xs">
                      कोई बोली नहीं। कीमत थोड़ा घटाने से खरीदार आकर्षित हो सकते हैं।
                    </div>
                  )}

                  {/* Received bids */}
                  {itemBids.length > 0 && (
                    <div className="mt-4 border-t border-slate-200 pt-4">
                      <h4 className="text-sm font-bold text-slate-800 flex items-center space-x-1 mb-3">
                        <Tag className="w-4 h-4 text-[#1B5E20]" />
                        <span>Received Offers ({itemBids.length})</span>
                      </h4>
                      <div className="space-y-3">
                        {itemBids
                          .map(b => {
                            const grossVal = item.quantity * (b.price || 0);
                            const payout = calculatePayoutBreakdown({
                              bidPriceTotal: grossVal,
                              distanceKm: b.distance || 25,
                              quantityKg: item.quantity
                            });
                            return { ...b, payout };
                          })
                          .sort((a, b) => b.payout.netRealization - a.payout.netRealization)
                          .map((b, idx) => (
                          <div key={b.id} className={`p-3 rounded-xl border ${idx === 0 ? 'bg-emerald-50 border-emerald-300' : 'bg-slate-50 border-slate-200'} shadow-sm`}>
                            <div className="flex items-center justify-between mb-2">
                              <div>
                                {idx === 0 && (
                                  <span className="inline-block px-2 py-0.5 bg-[#1B5E20] text-white text-[10px] font-bold rounded-full mb-1">
                                    🌟 Best Offer (Highest Net)
                                  </span>
                                )}
                                <h5 className="font-bold text-slate-800 text-sm">{b.buyerName}</h5>
                                <p className="text-xs text-slate-500">Gross Bid: ₹{b.price}/kg</p>
                              </div>
                              <div className="text-right">
                                <span className="block text-lg font-black text-[#1B5E20]">₹{b.payout.netRealization.toLocaleString('en-IN')}</span>
                                <span className="text-[10px] text-slate-500 font-bold uppercase">Net Payout</span>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-3 gap-2 bg-white p-2 rounded-lg border border-slate-200 text-[10px] mb-3">
                              <div className="text-center">
                                <span className="block text-slate-500">Gross</span>
                                <span className="font-bold text-slate-700">₹{b.payout.gross.toLocaleString('en-IN')}</span>
                              </div>
                              <div className="text-center border-l border-slate-100">
                                <span className="block text-rose-500">Logistics</span>
                                <span className="font-bold text-rose-700">-₹{b.payout.transportCost.toLocaleString('en-IN')}</span>
                              </div>
                              <div className="text-center border-l border-slate-100">
                                <span className="block text-rose-500">Platform</span>
                                <span className="font-bold text-rose-700">-₹{b.payout.platformFee.toLocaleString('en-IN')}</span>
                              </div>
                            </div>

                            {(item.status === 'Listed' || item.status === 'Bid Received') && (
                              <button
                                onClick={() => setSelectedBidModal({ listing: item, bid: b })}
                                className={`w-full py-2 rounded-lg text-xs font-bold transition-colors ${idx === 0 ? 'bg-[#1B5E20] text-white hover:bg-[#144718]' : 'bg-white border border-[#1B5E20] text-[#1B5E20] hover:bg-emerald-50'}`}
                              >
                                {idx === 0 ? 'Accept Best Offer' : 'Accept This Offer'}
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}

      {activeTab === 'sales' && (
        <div className="flex flex-col md:grid md:grid-cols-2 md:gap-4 md:space-y-0 space-y-4">
          {sales.length === 0 ? (
            <EmptyState title="कोई सक्रिय बिक्री नहीं" description="एक बोली स्वीकार करने पर बिक्री सक्रिय होगी।" />
          ) : (
            sales.map(item => {
              const acceptedBid = bids.find(b => b.id === item.acceptedBidId) || { price: item.price || 0 };
              const bidPrice = acceptedBid.price || item.price || 0;
              const grossVal = item.quantity * bidPrice;
              const payout = calculatePayoutBreakdown({
                bidPriceTotal: grossVal,
                distanceKm: 35,
                quantityKg: item.quantity
              });
              return (
                <div key={item.id} className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <div>
                      <h4 className="font-bold text-sm text-[#1B5E20]">{item.crop} बिक्री</h4>
                      <p className="text-xs text-slate-500">{item.quantity} kg @ ₹{bidPrice}/kg</p>
                    </div>
                    <button
                      onClick={() => setPayoutModal(payout)}
                      className="flex items-center space-x-1 text-xs text-[#1B5E20]"
                    >
                      <DollarSign className="w-4 h-4" />
                      <span>Payout Math</span>
                    </button>
                  </div>
                  <VisualStepper currentStatus={item.status} deliveryMode={item.deliveryMode || 'direct'} />
                  {item.qualityFlag && (
                    <div className="mt-2 p-2 bg-rose-100 text-rose-800 rounded-md text-xs">
                      गुणवत्ता समस्या: री‑नेगोशिएशन आवश्यक
                    </div>
                  )}
                  {(item.status === 'Payment Done' || item.status === 'Delivered') && (
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-xs text-slate-600">रेट करें:</span>
                      <RatingStars
                        initialScore={ratedDeliveries[item.id] || 5}
                        onRate={s => setRatedDeliveries({ ...ratedDeliveries, [item.id]: s })}
                      />
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}

            {activeTab === 'warehouse_booking' && (
        <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 shadow-sm flex flex-col space-y-3 mt-2">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-lg font-extrabold text-amber-900">भंडारण / Warehouse</h3>
            <span className="px-2 py-0.5 bg-amber-200 text-amber-900 border border-amber-300 rounded-full text-[10px] font-bold">WDRA Approved</span>
          </div>
          <button
            onClick={() => triggerToast('Booking...', 'Booking Started', 'info')}
            className="w-full py-4 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold shadow flex justify-center items-center transition-colors"
          >
            <CheckCircle2 className="w-6 h-6 mr-2" /> सुरक्षित गोदाम बुक करें
          </button>
        </div>
      )}

      {/* ---------- Help Center Card ---------- */}
      <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 shadow-sm flex flex-col space-y-3 mt-2">
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-lg font-extrabold text-amber-900">भंडारण / Warehouse Booking</h3>
          <span className="px-2 py-0.5 bg-amber-200 text-amber-900 border border-amber-300 rounded-full text-[10px] font-bold">
            WDRA Approved
          </span>
        </div>
        <p className="text-xs text-amber-700">फसल रखने की जगह नहीं है? पास का सुरक्षित गोदाम (Warehouse) बुक करें।</p>
        <button
          onClick={() => triggerToast('गोदाम बुकिंग सुविधा जल्द आ रही है / Warehouse booking coming soon', 'Booking Started', 'info')}
          className="w-full py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold shadow-sm flex justify-center items-center transition-colors"
        >
          <CheckCircle2 className="w-5 h-5 mr-2" /> पास का गोदाम बुक करें
        </button>
      </div>

      {/* ---------- Modals ---------- */}
      {showAddModal && <AddListingModal onClose={() => setShowAddModal(false)} />}

      {selectedBidModal && (
        <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-5 shadow-lg">
            <h3 className="font-bold text-lg mb-3">बोली स्वीकारें & डिलीवरी चयन</h3>
            <p className="mb-2">बोली: <strong className="text-[#1B5E20]">₹{selectedBidModal.bid.price || 0}/kg</strong> द्वारा {selectedBidModal.bid.buyerName}</p>
            <p className="text-sm text-slate-600 mb-4">डिलीवरी का प्रकार चुनें:</p>
            <div className="space-y-2">
              <button
                onClick={() => {
                  acceptBid(selectedBidModal.listing.id, selectedBidModal.bid.id, 'direct');
                  setSelectedBidModal(null);
                }}
                className="w-full py-2 bg-[#1B5E20] text-white rounded-md"
              >
                सीधा डिलीवरी (Fast)
              </button>
              <button
                disabled={!hasLabAvailable}
                onClick={() => {
                  if (hasLabAvailable) {
                    acceptBid(selectedBidModal.listing.id, selectedBidModal.bid.id, 'verified');
                    setSelectedBidModal(null);
                  }
                }}
                className={`w-full py-2 rounded-md ${hasLabAvailable ? 'bg-[#1B5E20] text-white' : 'bg-gray-300 text-gray-600 cursor-not-allowed'}`}
              >
                प्रमाणित लैब डिलीवरी
              </button>
            </div>
            <button onClick={() => setSelectedBidModal(null)} className="mt-3 text-sm text-slate-500 underline">रद्द करें</button>
          </div>
        </div>
      )}

      <GlobalVoiceNavigator setActiveTab={setActiveTab} setShowAddModal={setShowAddModal} />

      {payoutModal && (
        <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-5 shadow-lg">
            <h3 className="font-bold text-lg mb-3">वितरण भुगतान विवरण</h3>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between"><span>स्थूल बोली कुल:</span> <span className="font-medium text-[#1B5E20]">₹{payoutModal.bidPriceTotal}</span></div>
              <div className="flex justify-between text-rose-600"><span>− ट्रांसपोर्ट लागत:</span> <span>₹{payoutModal.transportCost}</span></div>
              <div className="flex justify-between text-rose-600"><span>− मंडी शुल्क (1.5%):</span> <span>₹{payoutModal.mandiFee}</span></div>
              <div className="flex justify-between text-rose-600"><span>− प्लेटफ़ॉर्म शुल्क (1%):</span> <span>₹{payoutModal.platformFee}</span></div>
              {payoutModal.qualityDeduction > 0 && (
                <div className="flex justify-between font-bold"><span>− गुणवत्ता छूट:</span> <span>₹{payoutModal.qualityDeduction}</span></div>
              )}
              <div className="flex justify-between font-extrabold text-[#1B5E20] border-t pt-2">
                <span>कुल किसान नेट:</span>
                <span>₹{payoutModal.finalPayout}</span>
              </div>
            </div>
            <button onClick={() => setPayoutModal(null)} className="mt-3 w-full py-2 bg-[#1B5E20] text-white rounded-md">बंद करें</button>
          </div>
        </div>
      )}
    </div>
  );
}
