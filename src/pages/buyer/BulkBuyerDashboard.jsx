import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Factory, TrendingUp, ShieldCheck, FileText, ClipboardList, Activity, ArrowRight, FileCheck, Plus, Edit, Trash2, Eye, Calendar, MapPin, Package, CheckCircle2 } from 'lucide-react';
import ProfileHeader from '../../components/ProfileHeader';
import { t } from '../../utils/translations';
import PostRequirementForm from './PostRequirementForm';
import EditRequirementModal from './EditRequirementModal';
import BuyerOffersView from './BuyerOffersView';

export default function BulkBuyerDashboard() {
  const { listings, requirements = [], currentUser, deleteRequirement, language } = useApp();
  const [activeTab, setActiveTab] = useState('requirements'); // requirements | aggregated | listings
  const [showPostForm, setShowPostForm] = useState(false);
  const [editingReq, setEditingReq] = useState(null);
  const [viewingOffersReq, setViewingOffersReq] = useState(null);

  // Filter requirements posted by current user (or fallback to all if mock/demo mode)
  const myRequirements = requirements.filter(r => 
    !currentUser || r.buyerId === currentUser.uid || currentUser.role === 'bulk_buyer' || currentUser.role === 'buyer'
  );

  const handleDeleteReq = async (reqId, cropName) => {
    if (window.confirm(`Are you sure you want to withdraw requirement for ${cropName}?`)) {
      await deleteRequirement(reqId);
    }
  };

  if (showPostForm) {
    return <PostRequirementForm onBack={() => setShowPostForm(false)} />;
  }

  if (viewingOffersReq) {
    return <BuyerOffersView requirement={viewingOffersReq} onBack={() => setViewingOffersReq(null)} />;
  }

  return (
    <div className="space-y-6 p-4 pb-24 bg-[#f9f8f3] min-h-screen text-slate-800 leading-relaxed">
      <ProfileHeader />

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-100 text-slate-900 p-6 rounded-3xl shadow-sm border border-emerald-200 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Factory className="w-6 h-6 text-emerald-700" />
            <h1 className="text-xl font-black text-slate-900">Corporate Procurement Hub</h1>
          </div>
          <p className="text-xs text-slate-600 font-medium mt-1">Industrial Bulk Buying & Direct Farmer Crop Tenders</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowPostForm(true)}
            className="px-5 py-3 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white rounded-2xl font-bold text-xs flex items-center gap-2 shadow-md shadow-emerald-700/20 transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Post Buy Requirement (फसल खरीद मांग)
          </button>
        </div>
      </div>

      {/* Analytics Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <div className="flex items-center space-x-2">
            <ClipboardList className="w-4 h-4 text-emerald-600" />
            <span className="text-xs font-bold text-slate-600">Active Buy Requests</span>
          </div>
          <div className="text-2xl font-black text-slate-900">{myRequirements.filter(r => r.status !== 'Closed').length}</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <div className="flex items-center space-x-2">
            <Activity className="w-4 h-4 text-blue-600" />
            <span className="text-xs font-bold text-slate-600">Fulfilled (Quintals)</span>
          </div>
          <div className="text-2xl font-black text-emerald-700">
            {myRequirements.reduce((sum, r) => sum + (r.fulfilledQty || 0), 0).toLocaleString()}
          </div>
        </div>

        <div className="col-span-2 sm:col-span-1 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-amber-500" />
            <span className="text-xs font-bold text-slate-600">Verification</span>
          </div>
          <div className="text-sm font-bold text-slate-800 flex items-center gap-1.5 pt-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span> GSTIN Verified Corporate
          </div>
        </div>
      </div>

      {/* Main Tabs */}
      <div className="grid grid-cols-3 gap-2 bg-white p-1.5 rounded-2xl border border-slate-200 shadow-xs">
        <button
          onClick={() => setActiveTab('requirements')}
          className={`py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'requirements' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          My Buy Listings ({myRequirements.length})
        </button>
        <button
          onClick={() => setActiveTab('aggregated')}
          className={`py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'aggregated' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          Aggregated Batches
        </button>
        <button
          onClick={() => setActiveTab('listings')}
          className={`py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'listings' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          Direct Farmer Lots
        </button>
      </div>

      {/* TAB 1: MY CROP BUY REQUIREMENTS */}
      {activeTab === 'requirements' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h2 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
              <ClipboardList className="w-4 h-4 text-emerald-600" />
              Your Active Crop Buy Requirements
            </h2>
            <button
              onClick={() => setShowPostForm(true)}
              className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Post New Crop Requirement
            </button>
          </div>

          {myRequirements.length === 0 ? (
            <div className="bg-white p-8 rounded-3xl border border-slate-200 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                <Package className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-800 text-sm">No Crop Buy Requirements Posted Yet</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Post your bulk procurement needs to receive direct price quotes and offers from verified farmers and FPOs.
              </p>
              <button
                onClick={() => setShowPostForm(true)}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm transition"
              >
                + Post Buy Requirement
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {myRequirements.map((req) => {
                const fulfilled = req.fulfilledQty || 0;
                const target = req.targetQty || 100;
                const pct = Math.min(100, Math.round((fulfilled / target) * 100));

                return (
                  <div key={req.id} className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm hover:border-emerald-300 transition space-y-4">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-black text-slate-900 text-base">
                            🌾 {req.crop} {req.variety ? `- ${req.variety}` : ''}
                          </span>
                          <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                            req.status === 'Closed' ? 'bg-slate-100 text-slate-600 border-slate-200' :
                            fulfilled > 0 ? 'bg-amber-100 text-amber-800 border-amber-300' :
                            'bg-emerald-100 text-emerald-800 border-emerald-300'
                          }`}>
                            {req.status === 'Closed' ? 'Closed' : (fulfilled > 0 ? `Partial (${pct}%)` : 'Open')}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 flex items-center gap-3">
                          <span>📍 {typeof req.deliveryLocation === 'string' ? req.deliveryLocation : (req.deliveryLocation?.name || 'Local Mandi')}</span>
                          <span>📅 Needed by: {req.neededByDate || 'Next 7 Days'}</span>
                        </p>
                      </div>

                      <div className="text-right">
                        <div className="text-lg font-black text-emerald-700">
                          {req.indicativePrice ? `₹${req.indicativePrice.toLocaleString()}/${req.unit || 'qtl'}` : 'Guide Price Open'}
                        </div>
                        <div className="text-xs text-slate-500 font-bold">
                          Target: {target.toLocaleString()} {req.unit || 'quintals'}
                        </div>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-1">
                      <div className="flex justify-between items-center text-[11px] font-medium text-slate-600">
                        <span>Fulfillment: {fulfilled.toLocaleString()} / {target.toLocaleString()} {req.unit || 'quintals'}</span>
                        <span className="font-bold text-emerald-700">{pct}%</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                        <div className="h-full bg-emerald-600 rounded-full transition-all duration-500" style={{ width: `${pct}%` }}></div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100">
                      <button
                        onClick={() => setViewingOffersReq(req)}
                        className="px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition"
                      >
                        <Eye className="w-3.5 h-3.5 text-emerald-600" />
                        View Farmer Offers
                      </button>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setEditingReq(req)}
                          className="px-3.5 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold flex items-center gap-1 transition"
                        >
                          <Edit className="w-3.5 h-3.5 text-slate-500" />
                          Edit Listing
                        </button>
                        <button
                          onClick={() => handleDeleteReq(req.id, req.crop)}
                          className="px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold flex items-center gap-1 transition"
                        >
                          <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                          Withdraw
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: AGGREGATED BATCHES */}
      {activeTab === 'aggregated' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm relative overflow-hidden space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="font-extrabold text-sm text-slate-800 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              Ready-to-Buy AI Aggregated Batches
            </h2>
            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2.5 py-1 rounded-full border border-emerald-300">
              AI Aggregation Active
            </span>
          </div>

          <div className="border border-emerald-200 bg-emerald-50/40 rounded-2xl p-4 space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-slate-900 text-base">🌾 Wheat (Sharbati) - 120 Metric Tons</h3>
                <p className="text-xs text-slate-600">Aggregated from 50 Farmers • Sonipat APMC Cluster</p>
              </div>
              <span className="bg-emerald-600 text-white font-bold px-3 py-1 rounded-xl text-xs shadow-xs">
                ₹2,850/qtl
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <span className="flex items-center text-[10px] font-bold text-emerald-900 bg-emerald-100 border border-emerald-300 px-2.5 py-1 rounded-lg">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-700 mr-1" /> NABL Grade A (Moisture 8.2%)
              </span>
            </div>

            <button className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition">
              Execute Smart Contract & Lock Escrow <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* TAB 3: DIRECT FARMER LOTS */}
      {activeTab === 'listings' && (
        <div className="space-y-3">
          <h2 className="font-extrabold text-sm text-slate-800 flex items-center px-1">
            <FileCheck className="w-4 h-4 mr-1.5 text-emerald-600" />
            NABL Lab Verified Large Lots Available
          </h2>
          
          {listings.filter(l => l.quantity >= 1000).map(listing => (
            <div key={listing.id} className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm hover:border-emerald-300 transition space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-bold text-slate-900 text-base">🌾 {listing.crop} ({listing.variety || 'Standard'})</span>
                <span className="font-black text-emerald-700 text-base">₹{listing.pricePerUnit}/kg</span>
              </div>
              <p className="text-xs text-slate-500">{(listing.quantity || 5000).toLocaleString()} kg available • {typeof listing.location === 'string' ? listing.location : listing.location?.name || 'Local Farm'}</p>
              <div className="flex justify-between items-center text-xs pt-1">
                <span className="bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-lg font-bold border border-emerald-200 flex items-center">
                  <ShieldCheck className="w-3.5 h-3.5 mr-1 text-emerald-700" /> Lab Certified
                </span>
                <button 
                  onClick={() => setShowPostForm(true)}
                  className="text-emerald-700 font-bold px-3 py-1 bg-emerald-50 border border-emerald-200 rounded-lg hover:bg-emerald-100 transition"
                >
                  Make Counter Offer / Post Buy Request
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Requirement Modal */}
      {editingReq && (
        <EditRequirementModal
          requirement={editingReq}
          isOpen={!!editingReq}
          onClose={() => setEditingReq(null)}
        />
      )}
    </div>
  );
}
