import ProfileHeader from '../../components/ProfileHeader';
import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import EmptyState from '../../components/EmptyState';
import { Building2, PlusCircle, FileText, Gavel, CheckCircle2, AlertTriangle, Printer, TrendingUp } from 'lucide-react';

export default function MandiDashboard() {
  const { mandiLots, createMandiGateEntry, labCertificates, triggerToast, updatePriceSnapshot, currentUser } = useApp();
  const [activeTab, setActiveTab] = useState('lots'); // lots | gate_entry | reports
  const [showGateModal, setShowGateModal] = useState(false);
  const [activeAuctionLot, setActiveAuctionLot] = useState(null);
  const [auctionBidInput, setAuctionBidInput] = useState('26');
  const [gatePassLot, setGatePassLot] = useState(null);
  const [mandiStatus, setMandiStatus] = useState('open');
  const [updateCrop, setUpdateCrop] = useState('Wheat');
  const [updatePrice, setUpdatePrice] = useState('');

  const [gateForm, setGateForm] = useState({
    vehicleNumber: 'HR-10-AB-1234',
    farmerName: 'Ramesh Kumar',
    crop: 'Wheat',
    declaredWeight: '2500',
    actualWeight: '2500'
  });

  const handleGateSubmit = (e) => {
    e.preventDefault();
    createMandiGateEntry(gateForm);
    setShowGateModal(false);
  };

  const handlePlaceAuctionBid = (lot) => {
    lot.winningBid = Number(auctionBidInput);
    lot.winningBuyer = "AgroCorp Mandi Traders";
    triggerToast(`Highest bid of ₹${auctionBidInput}/kg recorded for Lot #${lot.lotId}`, `Bid Placed`, `success`);
    setActiveAuctionLot(null);
  };

  const handleCloseAuction = (lot) => {
    lot.auctionStatus = "Closed";
    lot.gatePassIssued = true;
    triggerToast(`Auction closed for Lot #${lot.lotId}! Gate Pass & Payment Released.`, `Auction Closed`, `success`);
  };

  const generateGatePass = (lot) => {
    setGatePassLot(lot);
  };

  const handleUpdatePrice = () => {
    if (!updatePrice || isNaN(updatePrice)) return;
    updatePriceSnapshot(updateCrop, Number(updatePrice), currentUser.uid, currentUser.name);
    setUpdatePrice('');
  };

  const totalLots = mandiLots.length;
  const totalWeight = mandiLots.reduce((acc, curr) => acc + (curr.actualWeight || 0), 0);
  const totalCommission = Math.round(mandiLots.reduce((acc, curr) => acc + ((curr.winningBid || 25) * curr.actualWeight * 0.015), 0));

  return (
    <div className="space-y-4 p-4 pb-24">
      <ProfileHeader />

      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-800 flex items-center space-x-2">
            <Building2 className="w-5 h-5 text-[#2E7D32]" />
            <span>Mandi Operations & Gate Entry</span>
          </h2>
          <p className="text-xs text-slate-500">APMC Gate Pass & Auction Settlement</p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <button
            onClick={() => setShowGateModal(true)}
            className="btn-touch px-3 py-2 rounded-xl bg-[#2E7D32] text-white text-xs font-bold flex items-center space-x-1 shadow"
            disabled={mandiStatus === 'closed'}
          >
            <PlusCircle className="w-4 h-4" />
            <span>+ Gate Entry</span>
          </button>
          
          <button
            onClick={() => setMandiStatus(prev => prev === 'open' ? 'closed' : 'open')}
            className={`btn-touch px-3 py-1.5 rounded-lg text-[10px] font-bold border transition-colors ${mandiStatus === 'open' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-red-50 text-red-600 border-red-200'}`}
          >
            {mandiStatus === 'open' ? '🟢 Mandi Open' : '🔴 Mandi Closed'}
          </button>
        </div>
      </div>

      {mandiStatus === 'closed' ? (
        <div className="mt-8">
          <EmptyState 
            icon={<Building2 className="w-12 h-12 text-red-300" />}
            title="मंडी आज बंद है (Mandi is Closed)"
            subtitle="The Mandi operations are currently halted. No active lots or auctions available. Toggle the status above to resume operations."
          />
        </div>
      ) : (
        <>
          {/* Tabs */}
      <div className="grid grid-cols-3 gap-1.5 bg-white p-1 rounded-2xl border border-slate-200">
        <button
          onClick={() => setActiveTab('lots')}
          className={`py-2 rounded-xl text-[11px] font-bold transition-colors ${
            activeTab === 'lots' ? 'bg-[#2E7D32] text-white shadow' : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          Expected Lots ({totalLots})
        </button>
        <button
          onClick={() => setActiveTab('auctions')}
          className={`py-2 rounded-xl text-[11px] font-bold transition-colors ${
            activeTab === 'auctions' ? 'bg-[#2E7D32] text-white shadow' : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          Mandi Auctions
        </button>
        <button
          onClick={() => setActiveTab('reports')}
          className={`py-2 rounded-xl text-[11px] font-bold transition-colors ${
            activeTab === 'reports' ? 'bg-[#2E7D32] text-white shadow' : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          Daily Reports
        </button>
      </div>

      {/* TAB 1: LOTS */}
      {activeTab === 'lots' && (
        <div className="space-y-3">
          {mandiLots.length === 0 ? (
            <EmptyState
              title="No Expected Arrivals"
              description="Tap '+ Gate Entry' to record vehicle arrivals and generate Lot IDs."
            />
          ) : (
            mandiLots.map((lot) => {
              const cert = labCertificates.find(c => c.refId === lot.id || c.refId === lot.lotId);

              return (
                <div key={lot.id} className="bg-white rounded-2xl p-4 border border-slate-200 space-y-3 shadow-md">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-extrabold text-sm text-[#2E7D32]">{lot.lotId}</span>
                        <span className="px-2 py-0.5 rounded bg-slate-50 text-slate-700 text-slate-600 text-[10px] font-bold border border-slate-200">
                          {lot.crop}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1">Vehicle: {lot.vehicleNumber} ({lot.farmerName})</p>
                      <p className="text-[11px] text-slate-500">Actual Weight: {lot.actualWeight} kg</p>
                    </div>

                    <div className="text-right">
                      {cert ? (
                        <span className="px-2.5 py-1 rounded-full bg-emerald-950 text-[#2E7D32] border border-emerald-800 text-[10px] font-bold flex items-center space-x-1">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Lab Verified ✅</span>
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full bg-slate-50 text-slate-700 text-slate-500 border border-slate-200 text-[10px] font-semibold">
                          Pre-Check Ready
                        </span>
                      )}
                    </div>
                  </div>

                  {lot.hasWeightMismatch && (
                    <div className={`p-2.5 rounded-xl border text-xs font-semibold flex items-start space-x-1.5 ${lot.weightTier === 3 ? 'bg-rose-50 border-rose-200 text-rose-700' : 'bg-amber-50 border-amber-200 text-amber-700'}`}>
                      <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                      <span className="leading-tight">{lot.mismatchMessage}</span>
                    </div>
                  )}

                  <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                    <button
                      onClick={() => setActiveAuctionLot(lot)}
                      className="btn-touch px-3 py-1.5 rounded-xl bg-slate-50 text-slate-700 border border-slate-200 text-[#2E7D32] text-xs font-bold flex items-center space-x-1"
                    >
                      <Gavel className="w-3.5 h-3.5" />
                      <span>Open Mandi Auction</span>
                    </button>
                    {lot.gatePassIssued && (
                      <button
                        onClick={() => setGatePassLot(lot)}
                        className="btn-touch px-3 py-1.5 rounded-xl bg-[#2E7D32] text-white text-xs font-bold flex items-center space-x-1 shadow"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>View Gate Pass</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* TAB 2: AUCTIONS */}
      {activeTab === 'auctions' && (
        <div className="space-y-3">
          {mandiLots.length === 0 ? (
            <EmptyState title="No Active Mandi Auctions" description="Generated lots can be auctioned live here." />
          ) : (
            mandiLots.map((lot) => (
              <div key={lot.id} className={`bg-white rounded-2xl p-4 border ${lot.blockPayment ? 'border-rose-300' : 'border-slate-200'} space-y-3 shadow-md`}>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-sm text-slate-800">Auction Lot #{lot.lotId}</h4>
                    <p className="text-xs text-slate-500">{lot.crop} • {lot.finalQuantity || lot.actualWeight} kg</p>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                    lot.auctionStatus === 'Admin Hold' ? 'bg-rose-100 text-rose-700 border border-rose-200' :
                    lot.auctionStatus === 'Closed' ? 'bg-slate-50 text-slate-500' : 'bg-emerald-50 text-[#2E7D32] border border-emerald-200'
                  }`}>
                    {lot.auctionStatus || 'Open'}
                  </span>
                </div>

                {lot.blockPayment && (
                  <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-start space-x-1.5">
                    <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold mb-0.5">Payment Captured Blocked</div>
                      <span className="text-[10px] leading-tight opacity-90">{lot.mismatchMessage}</span>
                    </div>
                  </div>
                )}

                {!lot.blockPayment && (
                  <div className="p-2.5 rounded-xl bg-white border border-slate-200 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-slate-500">Winning Bidder:</span>
                      <div className="font-bold text-slate-700">{lot.winningBuyer || 'No Bids Yet'}</div>
                    </div>
                    <div className="text-right">
                      <span className="text-slate-500">Highest Bid:</span>
                      <div className="text-sm font-extrabold text-[#2E7D32]">₹{lot.winningBid || 0}/kg</div>
                    </div>
                  </div>
                )}

                {lot.auctionStatus !== 'Closed' && lot.auctionStatus !== 'Admin Hold' && !lot.blockPayment && (
                  <button
                    onClick={() => handleCloseAuction(lot)}
                    className="w-full btn-touch py-2 rounded-xl bg-[#2E7D32] text-white text-xs font-bold shadow"
                  >
                    Accept Highest Bid & Close Auction
                  </button>
                )}
                {lot.auctionStatus === 'Admin Hold' && (
                  <button
                    disabled
                    className="w-full py-2 rounded-xl bg-slate-100 text-slate-400 text-xs font-bold border border-slate-200 cursor-not-allowed"
                  >
                    Awaiting Admin Resolution
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* TAB 3: DAILY REPORTS */}
      {activeTab === 'reports' && (
        <div className="bg-white rounded-2xl p-4 border border-slate-200 space-y-4 shadow-md text-xs">
          <h3 className="font-bold text-sm text-slate-800 border-b border-slate-200 pb-2">Daily APMC Operations Log</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-white rounded-xl border border-slate-200">
              <span className="text-slate-500">Total Arrivals:</span>
              <div className="text-lg font-extrabold text-[#2E7D32] mt-0.5">{totalLots} Vehicles</div>
            </div>
            <div className="p-3 bg-white rounded-xl border border-slate-200">
              <span className="text-slate-500">Volume Processed:</span>
              <div className="text-lg font-extrabold text-sky-400 mt-0.5">{totalWeight} kg</div>
            </div>
          </div>
          <div className="p-3 bg-white rounded-xl border border-slate-200 flex justify-between items-center">
            <span className="text-slate-500">Mandi Commission Earned (1.5%):</span>
            <span className="text-base font-extrabold text-amber-400">₹{totalCommission}</span>
          </div>

          {/* Update Prices Panel */}
          <div className="mt-6 border-t border-slate-200 pt-4">
            <h3 className="font-bold text-sm text-slate-800 mb-3 flex items-center">
              <TrendingUp className="w-4 h-4 mr-1.5 text-[#FF9800]" /> Update Live Mandi Prices
            </h3>
            <p className="text-[11px] text-slate-500 mb-3">Push manual price updates to the Live Ticker.</p>
            
            <div className="flex gap-2">
              <select
                value={updateCrop}
                onChange={(e) => setUpdateCrop(e.target.value)}
                className="flex-1 px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-medium focus:outline-none"
              >
                <option value="Wheat">Wheat (गेहूं)</option>
                <option value="Soybean">Soybean (सोयाबीन)</option>
                <option value="Chana">Chana (चना)</option>
                <option value="Mustard">Mustard (सरसों)</option>
                <option value="Onion">Onion (प्याज)</option>
                <option value="Tomato">Tomato (टमाटर)</option>
              </select>
              <input
                type="number"
                placeholder="Price (₹)"
                value={updatePrice}
                onChange={(e) => setUpdatePrice(e.target.value)}
                className="w-28 px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-medium focus:outline-none"
              />
              <button
                onClick={handleUpdatePrice}
                className="bg-[#2E7D32] text-white px-4 py-2.5 rounded-xl font-bold shadow-sm"
              >
                Push
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Gate Entry Modal */}
      {showGateModal && (
        <div className="fixed inset-0 z-50 bg-white backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
          <form onSubmit={handleGateSubmit} className="bg-white border border-slate-200 rounded-t-2xl sm:rounded-2xl w-full max-w-md p-5 space-y-3 shadow-2xl text-xs">
            <h3 className="font-bold text-base text-slate-800">Record Mandi Gate Entry</h3>

            <div>
              <label className="text-slate-600 font-semibold mb-1 block">Vehicle Number</label>
              <input
                type="text"
                value={gateForm.vehicleNumber}
                onChange={(e) => setGateForm({ ...gateForm, vehicleNumber: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 text-slate-700 border border-slate-200 text-slate-800 font-bold"
              />
            </div>

            <div>
              <label className="text-slate-600 font-semibold mb-1 block">Farmer Name</label>
              <input
                type="text"
                value={gateForm.farmerName}
                onChange={(e) => setGateForm({ ...gateForm, farmerName: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 text-slate-700 border border-slate-200 text-slate-800 font-bold"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-slate-600 font-semibold mb-1 block">Declared Weight (kg)</label>
                <input
                  type="number"
                  value={gateForm.declaredWeight}
                  onChange={(e) => setGateForm({ ...gateForm, declaredWeight: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 text-slate-700 border border-slate-200 text-slate-800 font-bold"
                />
              </div>
              <div>
                <label className="text-slate-600 font-semibold mb-1 block">Actual Weighbridge (kg)</label>
                <input
                  type="number"
                  value={gateForm.actualWeight}
                  onChange={(e) => setGateForm({ ...gateForm, actualWeight: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 text-slate-700 border border-slate-200 text-slate-800 font-bold"
                />
              </div>
            </div>

            <div className="flex space-x-2 pt-2">
              <button type="button" onClick={() => setShowGateModal(false)} className="flex-1 py-2.5 rounded-xl bg-slate-50 text-slate-700 text-slate-500 font-semibold">
                Cancel
              </button>
              <button type="submit" className="flex-1 py-2.5 rounded-xl bg-[#2E7D32] text-white font-bold shadow">
                Generate Lot ID
              </button>
            </div>
          </form>
        </div>
      )}

      {/* View Gate Pass Modal */}
      {gatePassLot && (
        <div className="fixed inset-0 z-50 bg-white backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-emerald-700 rounded-2xl w-full max-w-md p-5 space-y-4 shadow-2xl text-xs">
            <div className="text-center border-b border-slate-200 pb-3 space-y-1">
              <div className="text-amber-400 font-bold text-sm uppercase tracking-wider">APMC Official Gate Pass</div>
              <h3 className="font-extrabold text-base text-slate-800">Lot #{gatePassLot.lotId}</h3>
              <p className="text-[11px] text-slate-500">Azadpur APMC Mandi, Delhi</p>
            </div>

            <div className="space-y-2 py-1">
              <div className="flex justify-between"><span className="text-slate-500">Vehicle:</span><span className="font-bold text-slate-800">{gatePassLot.vehicleNumber}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Farmer:</span><span className="font-bold text-slate-800">{gatePassLot.farmerName}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Commodity:</span><span className="font-bold text-slate-800">{gatePassLot.crop}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Verified Weight:</span><span className="font-bold text-[#2E7D32]">{gatePassLot.actualWeight} kg</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Accepted Price:</span><span className="font-bold text-[#2E7D32]">₹{gatePassLot.winningBid}/kg</span></div>
            </div>

            <button onClick={() => setGatePassLot(null)} className="w-full btn-touch py-2.5 rounded-xl bg-[#2E7D32] text-white font-bold">
              Close Gate Pass
            </button>
          </div>
        </div>
      )}

      {/* Active Auction Modal */}
      {activeAuctionLot && (
        <div className="fixed inset-0 z-50 bg-white/90 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-md p-5 space-y-4 shadow-2xl text-xs">
            <div className="flex justify-between items-start border-b border-slate-200 pb-3">
              <div>
                <h3 className="font-extrabold text-base text-slate-800">Live Auction: Lot #{activeAuctionLot.lotId}</h3>
                <p className="text-[11px] text-slate-500">{activeAuctionLot.crop} • {activeAuctionLot.actualWeight} kg</p>
              </div>
              <span className="px-2 py-1 bg-rose-100 text-rose-700 rounded text-[10px] font-bold flex items-center animate-pulse">
                <span className="w-1.5 h-1.5 bg-rose-500 rounded-full mr-1"></span> LIVE
              </span>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">Current Highest Bidder:</span>
                <span className="font-bold text-slate-800">{activeAuctionLot.winningBuyer || 'None'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Highest Bid:</span>
                <span className="font-bold text-[#2E7D32]">₹{activeAuctionLot.winningBid || 0}/kg</span>
              </div>
            </div>

            <div className="pt-2">
              <label className="text-slate-600 font-semibold mb-1 block">Place New Bid (₹/kg)</label>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  value={auctionBidInput}
                  onChange={(e) => setAuctionBidInput(e.target.value)}
                  className="flex-1 px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold focus:outline-none"
                  placeholder="Enter bid amount"
                />
                <button
                  onClick={() => handlePlaceAuctionBid(activeAuctionLot)}
                  className="px-4 py-2.5 bg-[#2E7D32] hover:bg-green-800 text-white rounded-xl font-bold shadow transition"
                >
                  Place Bid
                </button>
              </div>
            </div>

            <button
              onClick={() => setActiveAuctionLot(null)}
              className="w-full mt-2 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold transition"
            >
              Cancel / Close
            </button>
          </div>
        </div>
      )}
        </>
      )}
    </div>
  );
}
