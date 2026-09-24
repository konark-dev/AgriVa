import ProfileHeader from '../../components/ProfileHeader';
import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import VisualStepper from '../../components/VisualStepper';
import EmptyState from '../../components/EmptyState';
import RatingStars from '../../components/RatingStars';
import TrackingMapModal from '../../components/TrackingMapModal';
import PaymentGatewayModal from '../../components/PaymentGatewayModal';
import { calculateSurplusRescue } from '../../utils/qualityEngine';
import { Search, Filter, ShoppingBag, Clock, ShieldCheck, Tag, DollarSign, CheckCircle2, Map, AlertOctagon } from 'lucide-react';

export default function BuyerMarketplace() {
  const { listings, deliveries, bids, placeBid, confirmBuyerDelivery, raiseDispute, currentUser, triggerToast } = useApp();
  const [selectedCropFilter, setSelectedCropFilter] = useState('All');
  const [activeTab, setActiveTab] = useState('browse'); // browse | my_orders
  const [biddingListing, setBiddingListing] = useState(null);
  const [bidAmount, setBidAmount] = useState('');
  const [escrowStates, setEscrowStates] = useState({}); // { [listingId]: 'pending' | 'escrow_held' | 'released' }
  const [trackingDelivery, setTrackingDelivery] = useState(null);
  const [payingListing, setPayingListing] = useState(null);
  const [disputeListing, setDisputeListing] = useState(null);
  const [disputeCategory, setDisputeCategory] = useState('quality_spoilage');

  const filteredListings = listings.filter(l => {
    if (selectedCropFilter !== 'All' && l.crop.toLowerCase() !== selectedCropFilter.toLowerCase()) return false;
    return true;
  });

  const handlePlaceBid = (e) => {
    e.preventDefault();
    if (!bidAmount || Number(bidAmount) <= 0) return;
    placeBid(biddingListing.id, Number(bidAmount));
    setBiddingListing(null);
    setBidAmount('');
  };

  const handlePayEscrow = (listingId) => {
    setEscrowStates({ ...escrowStates, [listingId]: 'escrow_held' });
    triggerToast(`Payment held in secure Escrow! Funds will release on delivery confirmation.`, `Escrow Locked`, `success`);
    setPayingListing(null);
  };

  return (
    <div className="space-y-4 p-4 pb-24 max-w-4xl mx-auto">
      <ProfileHeader />

      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-800 flex items-center space-x-2">
            <ShoppingBag className="w-5 h-5 text-[#1B5E20]" />
            <span>Buyer Marketplace</span>
          </h2>
          <p className="text-xs text-slate-500">Direct FPO/Farmer Bidding & Consumer Batching</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="grid grid-cols-2 gap-2 bg-white p-1 rounded-2xl border border-slate-200">
        <button
          onClick={() => setActiveTab('browse')}
          className={`py-2 rounded-xl text-xs font-bold transition-colors ${
            activeTab === 'browse' ? 'bg-[#1B5E20] text-white shadow' : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          Browse Marketplace ({filteredListings.length})
        </button>
        <button
          onClick={() => setActiveTab('my_orders')}
          className={`py-2 rounded-xl text-xs font-bold transition-colors ${
            activeTab === 'my_orders' ? 'bg-[#1B5E20] text-white shadow' : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          My Orders & Escrow
        </button>
      </div>

      {/* TAB 1: BROWSE MARKETPLACE */}
      {activeTab === 'browse' && (
        <div className="space-y-3">
          {/* Crop Filter Bar */}
          <div className="bg-white rounded-2xl p-3 border border-slate-200 space-y-2">
            <div className="flex items-center space-x-2 text-xs">
              <Filter className="w-4 h-4 text-[#1B5E20]" />
              <span className="font-semibold text-slate-600">Filter Crop:</span>
            </div>
            <div className="flex space-x-1.5 overflow-x-auto no-scrollbar">
              {['All', 'Wheat', 'Rice', 'Tomato', 'Potato', 'Onion'].map((crop) => (
                <button
                  key={crop}
                  onClick={() => setSelectedCropFilter(crop)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                    selectedCropFilter === crop
                      ? 'bg-[#1B5E20] text-white shadow'
                      : 'bg-slate-50 text-slate-700 text-slate-600 hover:bg-slate-700'
                  }`}
                >
                  {crop}
                </button>
              ))}
            </div>
          </div>

          {/* Consumer Batch Collection Window UI Banner */}
          <div className="bg-sky-50 border border-sky-200 rounded-2xl p-3.5 space-y-2 shadow-sm">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2 font-bold text-sky-800">
                <Clock className="w-4 h-4 text-sky-600 animate-spin" style={{ animationDuration: '6s' }} />
                <span>Consumer Area Collection Window</span>
              </div>
              <span className="px-2 py-0.5 rounded bg-sky-100 text-sky-800 text-[10px] font-bold border border-sky-300">
                Closing in 04h 25m
              </span>
            </div>
            <p className="text-[11px] text-slate-700 leading-relaxed">
              "Your order joins others in your area. Dispatches automatically once the minimum batch size (500kg) is reached."
            </p>
            {/* Visual Batch Fill Bar */}
            <div className="space-y-1 pt-1">
              <div className="flex justify-between text-[10px] text-slate-600">
                <span>Current Batch Fill: 380kg / 500kg</span>
                <span className="text-[#1B5E20] font-bold">76% Full</span>
              </div>
              <div className="w-full bg-white rounded-full h-2 overflow-hidden border border-slate-200">
                <div className="bg-sky-500 h-full rounded-full" style={{ width: '76%' }} />
              </div>
            </div>
          </div>

          {/* Marketplace Listing Cards */}
          <div className="flex flex-col md:grid md:grid-cols-2 md:gap-4 md:space-y-0 space-y-4">
            {filteredListings.length === 0 ? (
              <EmptyState
                title="No Listings Found"
                description={`No active listings found for ${selectedCropFilter}.`}
              />
            ) : (
              filteredListings.map((item) => {
                const surplusCheck = calculateSurplusRescue(item.crop, item.harvestDate, item.price || 0);
                const isSurplus = surplusCheck.isSurplusRescue;
                const finalPrice = isSurplus ? surplusCheck.discountedPrice : (item.price || 0);

                return (
                  <div key={item.id} className={`bg-white rounded-2xl p-4 border ${isSurplus ? 'border-rose-300 shadow-rose-100/50' : 'border-slate-200'} space-y-3 shadow-md relative overflow-hidden`}>
                    {isSurplus && (
                      <div className="absolute top-0 right-0 bg-rose-500 text-white text-[9px] font-bold px-2 py-1 rounded-bl-lg flex items-center shadow-sm">
                        <AlertOctagon className="w-3 h-3 mr-1" />
                        SURPLUS RESCUE
                      </div>
                    )}
                    <div className="flex items-start justify-between mt-1">
                      <div>
                        <h3 className="font-extrabold text-sm text-slate-800">{item.crop}</h3>
                        <p className="text-xs text-slate-600 mt-0.5">Farmer: {item.farmerName}</p>
                        <p className="text-[11px] text-slate-500">Location: {item.location?.name || 'Sonipat Farm'}</p>
                      </div>
                      <div className="text-right mt-3">
                        {isSurplus ? (
                          <div className="flex flex-col items-end">
                            <span className="text-[10px] text-slate-400 line-through">₹{item.price || 0}/kg</span>
                            <span className="text-base font-extrabold text-rose-600">₹{finalPrice}/kg</span>
                            <span className="text-[9px] font-bold text-rose-500 bg-rose-50 px-1 rounded">-{surplusCheck.discountPct}% OFF</span>
                          </div>
                        ) : (
                          <span className="text-base font-extrabold text-[#1B5E20]">₹{finalPrice}/kg</span>
                        )}
                        <div className="text-[10px] font-semibold text-slate-500">{item.quantity} kg available</div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                      <span className="text-xs text-slate-500 flex flex-col">
                        <span>Harvest Date: {item.harvestDate}</span>
                        {isSurplus && <span className="text-[9px] text-rose-500 font-bold">Expires in {surplusCheck.remainingDays} days</span>}
                      </span>
                      <button
                        onClick={() => {
                          setBiddingListing({ ...item, price: finalPrice });
                          setBidAmount(finalPrice.toString());
                        }}
                        className={`btn-touch px-4 py-2 rounded-xl text-white text-xs font-bold shadow flex items-center space-x-1 ${isSurplus ? 'bg-rose-500 hover:bg-rose-600' : 'bg-[#1B5E20]'}`}
                      >
                        <Tag className="w-3.5 h-3.5" />
                        <span>{isSurplus ? 'Auto-Buy (Rescue)' : 'Place Bid / Order'}</span>
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* TAB 2: MY ORDERS & ESCROW */}
      {activeTab === 'my_orders' && (
        <div className="flex flex-col space-y-4">
          {listings.filter(l => l.status !== 'Listed').length === 0 ? (
            <EmptyState
              title="No Orders Placed Yet"
              description="Place a bid on any listing in the Browse tab to activate your delivery order."
            />
          ) : (
            listings.filter(l => l.status !== 'Listed').map((item) => {
              const currentEscrow = escrowStates[item.id] || 'pending';
              const userBid = bids.find(b => b.listingId === item.id && b.buyerId === currentUser.uid);

              return (
                <div key={item.id} className="bg-white rounded-2xl p-4 border border-slate-200 space-y-3 shadow-md">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <div>
                      <h4 className="font-bold text-sm text-slate-800">{item.crop} Delivery</h4>
                      <p className="text-xs text-slate-500">
                        {item.quantity} kg @ ₹{userBid ? userBid.price : (item.price || 0)}/kg
                      </p>
                    </div>

                    {/* Escrow Status Badge */}
                    <div>
                      {currentEscrow === 'escrow_held' ? (
                        <span className="px-2.5 py-1 rounded-full bg-sky-950 text-sky-400 border border-sky-800 text-[10px] font-bold flex items-center space-x-1">
                          <ShieldCheck className="w-3 h-3" />
                          <span>Payment Held in Escrow</span>
                        </span>
                      ) : (
                        <button
                          onClick={() => setPayingListing(item)}
                          className="btn-touch px-3 py-1.5 rounded-xl gradient-amber text-slate-950 font-extrabold text-xs shadow"
                        >
                          Pay Now (Lock Escrow)
                        </button>
                      )}
                      
                      {item.status === 'In Transit' && (
                        <button
                          onClick={() => {
                            const del = deliveries.find(d => d.listingId === item.id);
                            if (del) setTrackingDelivery(del);
                          }}
                          className="btn-touch ml-2 px-3 py-1.5 rounded-xl bg-slate-50 text-slate-700 text-sky-400 border border-slate-200 text-xs font-bold shadow flex items-center space-x-1"
                        >
                          <Map className="w-3.5 h-3.5" />
                          <span>Track Live</span>
                        </button>
                      )}
                      {item.status === 'Delivered' && (
                        <>
                          <button
                            onClick={() => {
                              const del = deliveries.find(d => d.listingId === item.id);
                              if (del) confirmBuyerDelivery(del.id);
                            }}
                            className="btn-touch ml-2 px-3 py-1.5 rounded-xl bg-[#1B5E20] text-white text-xs font-bold shadow flex items-center space-x-1"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Confirm Receipt</span>
                          </button>
                          <button
                            onClick={() => {
                              setDisputeListing(item);
                            }}
                            className="btn-touch ml-2 px-3 py-1.5 rounded-xl bg-rose-50 text-rose-600 border border-rose-200 text-xs font-bold shadow flex items-center space-x-1"
                          >
                            <AlertOctagon className="w-3.5 h-3.5" />
                            <span>Raise Dispute</span>
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Stepper */}
                  <VisualStepper currentStatus={item.status} deliveryMode={item.deliveryMode || 'direct'} />
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Bidding Modal */}
      {biddingListing && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
          <form onSubmit={handlePlaceBid} className="bg-white border border-slate-200 rounded-t-2xl sm:rounded-2xl w-full max-w-md p-5 space-y-4 shadow-2xl">
            <h3 className="font-bold text-base text-slate-800">Place Bid for {biddingListing.crop}</h3>
            <p className="text-xs text-slate-600">
              Target Price: <strong className="text-[#1B5E20]">₹{biddingListing.price}/kg</strong> ({biddingListing.quantity}kg available)
            </p>

            <div>
              <label className="text-xs font-semibold text-slate-600 mb-1 block">Your Offer Bid Price (₹/kg)</label>
              <input
                type="number"
                value={bidAmount}
                onChange={(e) => setBidAmount(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 text-slate-700 border border-slate-200 text-slate-800 text-sm font-bold focus:outline-none focus:border-emerald-500"
              />
            </div>

            {(() => {
              const isRetail = currentUser.role === 'consumer' || currentUser.buyerType === 'retail' || currentUser.buyerTier === 'retailer' || biddingListing.quantity < 500;
              if (!isRetail) return <p className="text-[10px] text-slate-500">Bulk order: Delivery cost is folded into the final negotiated price.</p>;
              
              const baseFee = 250;
              const estimatedOrdersInZone = 8;
              const batchedDeliveryFee = baseFee / estimatedOrdersInZone;
              const orderValue = Number(bidAmount || biddingListing.price) * biddingListing.quantity;
              const isInefficient = orderValue > 0 && batchedDeliveryFee > (0.25 * orderValue);

              return (
                <div className={`p-3 rounded-xl border ${isInefficient ? 'bg-rose-50 border-rose-200' : 'bg-slate-50 border-slate-200'}`}>
                  <div className="flex justify-between items-center text-xs mb-1">
                    <span className="text-slate-600">Batched Delivery Fee (Est.)</span>
                    <span className="font-bold">₹{batchedDeliveryFee.toFixed(2)}</span>
                  </div>
                  {isInefficient ? (
                    <p className="text-[10px] text-rose-600 font-bold mt-1">
                      ⚠️ Add more items to make this order more efficient to deliver. (Delivery exceeds 25% of order value)
                    </p>
                  ) : (
                    <p className="text-[9px] text-slate-500 mt-1">
                      Calculated as Base Fee (₹{baseFee}) ÷ Orders in your zone ({estimatedOrdersInZone})
                    </p>
                  )}
                </div>
              );
            })()}

            <div className="flex space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setBiddingListing(null)}
                className="flex-1 py-3 rounded-xl bg-slate-50 text-slate-700 text-slate-500 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={(() => {
                  const isRetail = currentUser.role === 'consumer' || currentUser.buyerType === 'retail' || currentUser.buyerTier === 'retailer' || biddingListing.quantity < 500;
                  if (!isRetail) return false;
                  const batchedDeliveryFee = 250 / 8;
                  const orderValue = Number(bidAmount || biddingListing.price) * biddingListing.quantity;
                  return orderValue > 0 && batchedDeliveryFee > (0.25 * orderValue);
                })()}
                className="flex-1 py-3 rounded-xl bg-[#1B5E20] text-white text-xs font-bold shadow disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Submit Bid
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Live Tracking Map Modal */}
      {trackingDelivery && (
        <TrackingMapModal 
                          delivery={trackingDelivery} 
          onClose={() => setTrackingDelivery(null)} 
        />
      )}

      {/* Payment Gateway Modal */}
      {payingListing && (
        <PaymentGatewayModal
          amount={(bids.find(b => b.listingId === payingListing.id && b.buyerId === currentUser.uid)?.price || payingListing.price || 0) * payingListing.quantity}
          onClose={() => setPayingListing(null)}
          onPaymentComplete={() => handlePayEscrow(payingListing.id)}
        />
      )}

      {/* Raise Dispute Modal */}
      {disputeListing && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white w-full sm:w-[400px] sm:rounded-3xl rounded-t-3xl p-5 shadow-2xl pb-10 sm:pb-5 max-h-[90vh] overflow-y-auto">
            <h3 className="font-extrabold text-lg text-slate-800 mb-2 flex items-center space-x-2">
              <AlertOctagon className="w-5 h-5 text-rose-600" />
              <span>Raise Dispute</span>
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Please select the primary reason for this dispute. Your payment will remain secure while Admin resolves this.
            </p>

            <div className="space-y-3 mb-5">
              {[
                { id: 'quantity_shortfall', label: 'Quantity Shortfall', desc: 'Delivered less than negotiated weight' },
                { id: 'quality_spoilage', label: 'Quality / Spoilage', desc: 'Crop was damaged or rotten' },
                { id: 'wrong_item', label: 'Wrong Item', desc: 'Received a different crop or grade' },
                { id: 'not_delivered', label: 'Not Delivered', desc: 'Marked as delivered but never arrived' },
              ].map(cat => (
                <label key={cat.id} className={`flex items-center space-x-3 p-3 rounded-xl border cursor-pointer transition ${disputeCategory === cat.id ? 'bg-rose-50 border-rose-300' : 'bg-white border-slate-200'}`}>
                  <input 
                    type="radio" 
                    name="dispute_category" 
                    value={cat.id} 
                    checked={disputeCategory === cat.id} 
                    onChange={(e) => setDisputeCategory(e.target.value)} 
                    className="text-rose-600 focus:ring-rose-500"
                  />
                  <div>
                    <div className={`font-bold text-sm ${disputeCategory === cat.id ? 'text-rose-800' : 'text-slate-700'}`}>{cat.label}</div>
                    <div className="text-[10px] text-slate-500">{cat.desc}</div>
                  </div>
                </label>
              ))}
            </div>

            <div className="flex space-x-2">
              <button
                onClick={() => setDisputeListing(null)}
                className="flex-1 py-3 rounded-xl bg-slate-100 text-slate-600 text-sm font-bold"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const del = deliveries.find(d => d.listingId === disputeListing.id);
                  if (del) {
                    raiseDispute(disputeListing.id, del.id, disputeCategory);
                  }
                  setDisputeListing(null);
                }}
                className="flex-1 py-3 rounded-xl bg-rose-600 text-white text-sm font-bold shadow-md"
              >
                Submit Dispute
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
