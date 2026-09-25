import ProfileHeader from '../../components/ProfileHeader';
import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { nearestNeighborRoute } from '../../utils/geoRouting';
import { checkWeightMismatch } from '../../utils/qualityEngine';
import VisualStepper from '../../components/VisualStepper';
import EmptyState from '../../components/EmptyState';
import TrackingMapModal from '../../components/TrackingMapModal';
import RouteComparisonView from './RouteComparisonView';
import { Truck, Navigation, CheckCircle, AlertTriangle, Camera, Scale, Clock, ShieldCheck, DollarSign, Map, Route } from 'lucide-react';

export default function TransporterDashboard() {
  const { deliveries, updateDeliveryStatus, completeTransporterDelivery, triggerToast } = useApp();

  const [activeTab, setActiveTab] = useState('pickups'); // pickups | route_optimizer | route_comparison
  const [selectedPickupCheck, setSelectedPickupCheck] = useState(null);
  const [qualityCondition, setQualityCondition] = useState('Good');
  const [photoSelected, setPhotoSelected] = useState(false);
  const [actualWeightInput, setActualWeightInput] = useState('');
  const [delayModal, setDelayModal] = useState(null);
  const [delayReason, setDelayReason] = useState('Traffic & Highway Hold');
  const [trackingDelivery, setTrackingDelivery] = useState(null);

  if (activeTab === 'route_comparison') {
    return <RouteComparisonView onBack={() => setActiveTab('pickups')} />;
  }

  // Multi-pickup test dataset for Nearest Neighbor Route Optimization
  const pickupStops = [
    { id: 'stop-1', name: 'Farm A (Panipat)', lat: 29.3909, lng: 76.9635, quantity: 1500, crop: 'Onion' },
    { id: 'stop-2', name: 'Farm B (Karnal)', lat: 29.6857, lng: 76.9905, quantity: 2000, crop: 'Tomato' },
    { id: 'stop-3', name: 'Farm C (Sonipat)', lat: 28.9931, lng: 77.0151, quantity: 1200, crop: 'Wheat' }
  ];

  const startLocation = { name: 'Transporter Hub (Delhi)', lat: 28.7041, lng: 77.1025 };

  // Calculate Nearest Neighbor Route
  const routeResult = nearestNeighborRoute(startLocation, pickupStops);

  const handleDeclineJob = (delId) => {
    updateDeliveryStatus(delId, 'Transport Declined');
    triggerToast(`Job declined. Reassigned to next available transporter in pool.`, `Job Reassigned`, `warning`);
  };

  const handleCompletePickup = (e) => {
    e.preventDefault();
    if (!photoSelected) {
      triggerToast(`Please attach physical quality inspection photo`, `Photo Required`, `warning`);
      return;
    }

    const del = selectedPickupCheck;
    const weightRes = checkWeightMismatch(del.quantity || 3000, Number(actualWeightInput) || del.quantity);

    updateDeliveryStatus(del.id, 'Picked Up', {
      qualityCheck: { condition: qualityCondition, photoUrl: 'mock_photo.jpg' },
      actualWeight: Number(actualWeightInput) || del.quantity,
      hasWeightMismatch: weightRes.hasMismatch,
      weightMismatchMessage: weightRes.message
    });

    if (weightRes.hasMismatch) {
      triggerToast(weightRes.message, `Dispute Flag Raised`, `warning`);
    } else {
      triggerToast(`Physical check complete & weight verified!`, `Pickup Complete`, `success`);
    }

    setSelectedPickupCheck(null);
  };

  const handleReportDelay = (e) => {
    e.preventDefault();
    if (!delayModal) return;
    
    updateDeliveryStatus(delayModal.id, delayModal.status, {
      delayReason,
      eta: 'Revised ETA: Today 7:15 PM (+45 mins delay)'
    });
    
    triggerToast(`Delay reported to Farmer & Buyer: ${delayReason}`, `ETA Revised`, `info`);
    setDelayModal(null);
  };

  return (
    <div className="space-y-4 p-4 pb-24">
      <ProfileHeader />

      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-800 flex items-center space-x-2">
            <Truck className="w-5 h-5 text-[#2E7D32]" />
            <span>Transporter Logistics Hub</span>
          </h2>
          <p className="text-xs text-slate-500">Multi-Pickup Route Optimization & Inspection</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="grid grid-cols-3 gap-2 bg-white p-1 rounded-2xl border border-slate-200">
        <button
          onClick={() => setActiveTab('pickups')}
          className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-colors ${
            activeTab === 'pickups' ? 'bg-[#2E7D32] text-white shadow-sm' : 'text-slate-600'
          }`}
        >
          Pickups ({deliveries.length})
        </button>
        <button
          onClick={() => setActiveTab('route_optimizer')}
          className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-colors ${
            activeTab === 'route_optimizer' ? 'bg-[#2E7D32] text-white shadow-sm' : 'text-slate-600'
          }`}
        >
          Optimization
        </button>
        <button
          onClick={() => setActiveTab('route_comparison')}
          className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-colors ${
            activeTab === 'route_comparison' ? 'bg-[#2E7D32] text-white shadow-sm' : 'text-slate-600'
          }`}
        >
          AgriQ Routes
        </button>
      </div>

      {/* TAB 1: ASSIGNED PICKUPS */}
      {activeTab === 'pickups' && (
        <div className="space-y-3">
          {deliveries.length === 0 ? (
            
            <div className="space-y-4">
              <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-[#2E7D32] text-white text-[9px] font-black px-3 py-1 rounded-bl-xl tracking-wider uppercase">
                  My Fleet
                </div>
                <h3 className="font-bold text-sm text-slate-800 mb-3 flex items-center">
                  <Truck className="w-4 h-4 mr-1.5 text-emerald-600" />
                  Register Logistics Vehicle
                </h3>
                <form className="space-y-3" onSubmit={(e) => { e.preventDefault(); triggerToast('Vehicle DL-1M-4321 successfully registered in Fleet!', 'Vehicle Added', 'success'); }}>
                  <div>
                    <label className="text-xs font-semibold text-slate-600 block mb-1">Vehicle Type</label>
                    <select className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:border-emerald-500 outline-none">
                      <option>Tata Ace (Small Commercial - 750kg)</option>
                      <option>Eicher Pro (Light Duty - 5 Tons)</option>
                      <option>Ashok Leyland (Heavy Duty - 15 Tons)</option>
                      <option>Refrigerated Cold Truck (Perishables)</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-xs font-semibold text-slate-600 block mb-1">Reg. Number (RC)</label>
                      <input type="text" placeholder="e.g. HR-38-V-1234" className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:border-emerald-500 outline-none" required />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-600 block mb-1">Capacity (Tons)</label>
                      <input type="number" placeholder="Tons" className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:border-emerald-500 outline-none" required />
                    </div>
                  </div>
                  <button type="submit" className="w-full py-2 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl text-xs font-bold hover:bg-emerald-100 transition-colors">
                    + Add Vehicle to Fleet
                  </button>
                </form>
              </div>

              {/* Load Board Dummy */}
              <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
                <h3 className="font-bold text-sm text-slate-800 mb-3 flex items-center">
                  <Map className="w-4 h-4 mr-1.5 text-blue-600" />
                  Live Load Board (Nearby)
                </h3>
                
                <div className="space-y-2">
                  <div className="border border-slate-100 rounded-xl p-3 bg-slate-50 relative">
                    <span className="absolute top-2 right-2 bg-rose-100 text-rose-700 text-[9px] font-bold px-1.5 py-0.5 rounded">Urgent</span>
                    <h4 className="font-bold text-xs text-slate-800">120 Tons Wheat (Bulk Order)</h4>
                    <p className="text-[10px] text-slate-500 mb-2">Panipat Hub &rarr; Britannia Mills, Delhi</p>
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-black text-[#2E7D32]">₹14,500</span>
                      <button onClick={() => triggerToast('Bid submitted for Load #8902', 'Bid Placed', 'success')} className="px-3 py-1 bg-[#2E7D32] text-white rounded font-semibold text-[10px]">
                        Accept Load
                      </button>
                    </div>
                  </div>

                  <div className="border border-slate-100 rounded-xl p-3 bg-slate-50">
                    <h4 className="font-bold text-xs text-slate-800">40 Tons Tomato (Requires Cold Storage)</h4>
                    <p className="text-[10px] text-slate-500 mb-2">Karnal Farms &rarr; Azadpur Mandi</p>
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-black text-[#2E7D32]">₹5,200</span>
                      <button onClick={() => triggerToast('Bid submitted for Load #8903', 'Bid Placed', 'success')} className="px-3 py-1 bg-[#2E7D32] text-white rounded font-semibold text-[10px]">
                        Accept Load
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          ) : (
            deliveries.map((del) => {
              const transportFee = Math.round(45 * 1.5 * (del.quantity / 100)); // distance * rate * quintals

              return (
                <div key={del.id} className="bg-white rounded-2xl p-4 border border-slate-200 space-y-3 shadow-md">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-extrabold text-sm text-slate-800">{del.crop} Pickup</h3>
                      <p className="text-xs text-slate-600">Farmer: {del.farmerName}</p>
                      <p className="text-[11px] text-slate-500">From: {del.pickupLocation?.name || 'Panipat Farm'}</p>
                    </div>

                    <div className="text-right">
                      <div className="text-sm font-extrabold text-[#2E7D32]">₹{transportFee}</div>
                      <div className="text-[10px] text-slate-500">Guaranteed Transport Fee</div>
                    </div>
                  </div>

                  {/* Stepper */}
                  <VisualStepper currentStatus={del.status} deliveryMode={del.deliveryMode || 'direct'} qualityFlag={del.hasWeightMismatch} />

                  {/* Weight Mismatch Warning Banner */}
                  {del.hasWeightMismatch && (
                    <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 text-xs font-semibold flex items-center space-x-1.5">
                      <AlertTriangle className="w-4 h-4 shrink-0" />
                      <span>{del.weightMismatchMessage}</span>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="pt-2 border-t border-slate-200 flex items-center justify-between gap-2">
                    {del.status === 'Transport Assigned' && (
                      <>
                        <button
                          onClick={() => handleDeclineJob(del.id)}
                          className="btn-touch px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 text-rose-400 border border-slate-200 text-xs font-bold"
                        >
                          Decline Job
                        </button>
                        <button
                          onClick={() => {
                            setSelectedPickupCheck(del);
                            setActualWeightInput(del.quantity.toString());
                          }}
                          className="btn-touch flex-1 py-2 rounded-xl bg-[#2E7D32] text-white text-xs font-bold shadow flex items-center justify-center space-x-1"
                        >
                          <Camera className="w-4 h-4" />
                          <span>Do Quality & Weight Check</span>
                        </button>
                      </>
                    )}

                    {del.status === 'Picked Up' && (
                      <div className="w-full flex space-x-2">
                        <button
                          onClick={() => setDelayModal(del)}
                          className="btn-touch flex-1 py-2 rounded-xl bg-slate-100 text-slate-700 border border-slate-200 text-amber-400 text-xs font-bold flex items-center justify-center space-x-1"
                        >
                          <Clock className="w-4 h-4" />
                          <span>Report Delay</span>
                        </button>
                        <button
                          onClick={() => updateDeliveryStatus(del.id, 'In Transit')}
                          className="btn-touch flex-1 py-2 rounded-xl bg-[#2E7D32] text-white text-xs font-bold shadow"
                        >
                          Mark In Transit
                        </button>
                      </div>
                    )}

                    {del.status === 'In Transit' && (
                      <div className="w-full flex space-x-2">
                        <button
                          onClick={() => setTrackingDelivery(del)}
                          className="btn-touch flex-1 py-2.5 rounded-xl bg-slate-100 text-slate-700 text-sky-400 border border-slate-200 text-xs font-bold flex items-center justify-center space-x-1"
                        >
                          <Map className="w-4 h-4" />
                          <span>Track Live</span>
                        </button>
                          <button
                            onClick={() => completeTransporterDelivery(del.id)}
                            className="btn-touch flex-1 py-2.5 rounded-xl bg-[#2E7D32] text-white text-xs font-bold shadow"
                          >
                            Scan & Complete (Release Payout)
                          </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* TAB 2: ROUTE OPTIMIZATION VISUALIZER (Nearest Neighbor Heuristic) */}
      {activeTab === 'route_optimizer' && (
        <div className="space-y-4">
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 space-y-3 shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Navigation className="w-5 h-5 text-[#2E7D32]" />
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                  Nearest Neighbor Route Calculation
                </h3>
              </div>
              <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded border border-emerald-200">
                Real Coordinate Math
              </span>
            </div>

            <p className="text-[11px] text-slate-600 leading-relaxed">
              Calculated using Haversine Great-Circle distance formula across latitude/longitude points:
            </p>

            <div className="p-3 bg-white/90 rounded-xl border border-slate-200 font-mono text-[11px] text-[#2E7D32] flex items-center justify-between">
              <span>Total Estimated Trip Distance:</span>
              <span className="text-sm font-extrabold text-white">{routeResult.totalDistanceKm} KM</span>
            </div>

            {/* Calculated Route Sequence List */}
            <div className="space-y-2 pt-2">
              <div className="text-xs font-bold text-slate-600">Optimal Pickup Sequence:</div>
              {routeResult.orderedRoute.map((stop, idx) => (
                <div key={stop.id} className="bg-white border border-slate-200 rounded-xl p-3 flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-6 h-6 rounded-full bg-[#2E7D32] flex items-center justify-center font-extrabold text-white text-[11px]">
                      {idx + 1}
                    </div>
                    <div>
                      <div className="font-bold text-slate-800">{stop.name}</div>
                      <div className="text-[10px] text-slate-500">{stop.crop} • {stop.quantity} kg</div>
                    </div>
                  </div>
                  <div className="text-right text-[11px] text-[#2E7D32] font-semibold">
                    +{stop.legDistanceKm} km
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Physical Quality & Weight Inspection Modal */}
      {selectedPickupCheck && (
        <div className="fixed inset-0 z-50 bg-white/90/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
          <form onSubmit={handleCompletePickup} className="bg-white border border-slate-200 rounded-t-2xl sm:rounded-2xl w-full max-w-md p-5 space-y-4 shadow-2xl">
            <h3 className="font-bold text-base text-slate-800">Physical Quality & Weight Check</h3>

            {/* Quality Grade 3-Option Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-600 block">Physical Crop Condition</label>
              <div className="grid grid-cols-3 gap-2">
                {['Good', 'Average', 'Poor'].map((cond) => (
                  <button
                    key={cond}
                    type="button"
                    onClick={() => setQualityCondition(cond)}
                    className={`py-2 rounded-xl text-xs font-bold border transition-colors ${
                      qualityCondition === cond
                        ? cond === 'Poor'
                          ? 'bg-rose-950 border-rose-600 text-rose-300'
                          : 'bg-[#2E7D32] text-white border-emerald-500'
                        : 'bg-slate-100 text-slate-700 border-slate-200 text-slate-600'
                    }`}
                  >
                    {cond}
                  </button>
                ))}
              </div>
            </div>

            {/* Mandatory Photo Upload Mock */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-600 block">Mandatory Inspection Photo</label>
              <button
                type="button"
                onClick={() => setPhotoSelected(true)}
                className={`w-full py-3 rounded-xl border border-dashed text-xs font-bold flex items-center justify-center space-x-2 transition-colors ${
                  photoSelected
                    ? 'bg-emerald-50 border-emerald-500 text-[#2E7D32]'
                    : 'bg-slate-100 text-slate-700 border-slate-200 text-slate-500 hover:text-slate-700'
                }`}
              >
                <Camera className="w-4 h-4" />
                <span>{photoSelected ? 'Photo Captured ✅' : 'Tap to Upload Inspection Photo'}</span>
              </button>
            </div>

            {/* Actual Weight Confirmation */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-600 block">
                Confirmed Weighbridge Weight (kg) [Declared: {selectedPickupCheck.quantity}kg]
              </label>
              <input
                type="number"
                value={actualWeightInput}
                onChange={(e) => setActualWeightInput(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-100 text-slate-700 border border-slate-200 text-slate-800 text-sm font-bold focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="flex space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setSelectedPickupCheck(null)}
                className="flex-1 py-3 rounded-xl bg-slate-100 text-slate-700 text-slate-500 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-3 rounded-xl bg-[#2E7D32] text-white text-xs font-bold shadow"
              >
                Complete Pickup
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Delay Modal */}
      {delayModal && (
        <div className="fixed inset-0 z-50 bg-white/90/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
          <form onSubmit={handleReportDelay} className="bg-white border border-slate-200 rounded-t-2xl sm:rounded-2xl w-full max-w-md p-5 space-y-4 shadow-2xl">
            <h3 className="font-bold text-base text-slate-800">Report In-Transit Delay</h3>
            
            <div>
              <label className="text-xs font-semibold text-slate-600 mb-1 block">Reason for Delay</label>
              <select
                value={delayReason}
                onChange={(e) => setDelayReason(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-100 text-slate-700 border border-slate-200 text-slate-800 text-xs font-semibold"
              >
                <option value="Traffic & Highway Hold">Traffic & Highway Hold</option>
                <option value="Vehicle Mechanical Check">Vehicle Mechanical Check</option>
                <option value="Weather / Rain Delay">Weather / Rain Delay</option>
              </select>
            </div>

            <div className="flex space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setDelayModal(null)}
                className="flex-1 py-2.5 rounded-xl bg-slate-100 text-slate-700 text-slate-500 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 rounded-xl gradient-amber text-slate-950 font-bold text-xs shadow"
              >
                Submit Delay & Recalculate ETA
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
    </div>
  );
}
