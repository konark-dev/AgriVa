import ProfileHeader from '../../components/ProfileHeader';
import React, { useState } from 'react';
import { t } from '../../utils/translations';
import { useApp } from '../../context/AppContext';
import { Warehouse, Plus, CheckCircle2, XCircle, Box, TrendingUp, Snowflake, Sun, ArrowRight } from 'lucide-react';

export default function WarehouseDashboard() {
  const { currentUser, triggerToast, language } = useApp();
  const [activeTab, setActiveTab] = useState('inventory'); // inventory | requests

  const [spaces, setSpaces] = useState([
    { id: 1, name: 'Cold Storage A', capacity: 500, booked: 450, pricePerMT: 150, type: 'Cold Storage', icon: Snowflake },
    { id: 2, name: 'Dry Warehouse B', capacity: 1000, booked: 200, pricePerMT: 80, type: 'Dry Storage', icon: Sun }
  ]);

  const [requests, setRequests] = useState([
    { id: 101, farmer: 'Ramesh Kumar', crop: 'Potato', quantity: 50, duration: '3 Months', status: 'Pending' },
    { id: 102, farmer: 'Suresh Singh', crop: 'Wheat', quantity: 200, duration: '1 Month', status: 'Pending' }
  ]);

  const [showAddForm, setShowAddForm] = useState(false);

  const totalCapacity = spaces.reduce((acc, curr) => acc + curr.capacity, 0);
  const totalBooked = spaces.reduce((acc, curr) => acc + curr.booked, 0);
  const availableSpace = totalCapacity - totalBooked;
  const utilizationPercent = Math.round((totalBooked / totalCapacity) * 100);

  const handleApprove = (id) => {
    setRequests(reqs => reqs.map(r => r.id === id ? { ...r, status: 'Approved' } : r));
    triggerToast('Booking Approved! Space allocated to farmer.', 'Success', 'success');
    setSpaces(s => s.map((godown, index) => {
      if (index === 1) return { ...godown, booked: godown.booked + 200 };
      return godown;
    }));
  };

  const handleReject = (id) => {
    setRequests(reqs => reqs.map(r => r.id === id ? { ...r, status: 'Rejected' } : r));
    triggerToast('Booking Rejected. Farmer notified.', 'Info', 'info');
  };

  const handleAddSpace = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newSpace = {
      id: Date.now(),
      name: formData.get('name'),
      capacity: Number(formData.get('capacity')),
      booked: 0,
      pricePerMT: Number(formData.get('price')),
      type: formData.get('type'),
      icon: formData.get('type') === 'Cold Storage' ? Snowflake : Sun
    };
    setSpaces([...spaces, newSpace]);
    setShowAddForm(false);
    triggerToast('New storage space added to your inventory!', 'Success', 'success');
  };

  return (
    <div className="space-y-4 p-4 pb-24 bg-[#f9f8f3] min-h-screen text-slate-800 max-w-4xl mx-auto">
      <ProfileHeader />
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-800 flex items-center">
            <Warehouse className="w-5 h-5 mr-2 text-emerald-700" />
            {t(language, 'helloWarehouse')} {currentUser?.name?.split(' ')[0] || 'Warehouse Owner'}
          </h2>
          <p className="text-xs text-slate-500 mt-1 flex items-center">
            <span className="text-rose-500 mr-1">📍</span> {currentUser?.village || 'Indore District'} 
            <span className="ml-2 px-1.5 py-0.5 bg-emerald-100 text-emerald-700 rounded text-[9px] uppercase tracking-wider border border-emerald-200 font-bold">
              ✓ WDRA Verified
            </span>
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">{t(language, 'availableSpace')}</p>
          <div className="flex items-end mt-1.5 space-x-1">
            <span className="text-2xl font-black text-slate-800">{availableSpace}</span>
            <span className="text-sm text-slate-500 mb-0.5 font-medium">MT</span>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2.5 overflow-hidden">
            <div className="bg-emerald-500 h-full transition-all duration-500 rounded-full" style={{ width: `${utilizationPercent}%` }}></div>
          </div>
          <p className="text-[9px] text-slate-400 mt-1">{t(language, 'utilized')}</p>
        </div>
        
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">{t(language, 'monthlyRevenue')}</p>
          <div className="flex items-end mt-1.5 space-x-1">
            <span className="text-2xl font-black text-slate-800">₹145.2k</span>
          </div>
          <p className="text-[10px] text-emerald-600 mt-1.5 flex items-center font-medium">
            <TrendingUp className="w-3 h-3 mr-1" /> +12% this month
          </p>
        </div>
      </div>

      {/* Action Button */}
      <button 
        onClick={() => setShowAddForm(!showAddForm)}
        className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl shadow-sm flex justify-center items-center transition-colors text-sm font-bold"
      >
        <Plus className="w-4 h-4 mr-2" />
        {t(language, 'addNewStorage')}
      </button>

      {/* Add Space Form */}
      {showAddForm && (
        <form onSubmit={handleAddSpace} className="bg-white rounded-2xl p-4 border border-emerald-200 shadow-sm space-y-3 animate-in slide-in-from-top-2 duration-200">
          <h3 className="font-bold text-sm text-slate-800">{t(language, 'registerGodown')}</h3>
          <div>
            <label className="text-xs font-semibold text-slate-600 block mb-1">{t(language, 'spaceName')}</label>
            <input name="name" type="text" required placeholder="e.g. Cold Room C" className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:border-emerald-500 outline-none" />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs font-semibold text-slate-600 block mb-1">{t(language, 'storageType')}</label>
              <select name="type" className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:border-emerald-500 outline-none">
                <option>{t(language, 'coldStorage')}</option>
                <option>{t(language, 'dryStorage')}</option>
                <option>Mixed / Open</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600 block mb-1">{t(language, 'capacityMT')}</label>
              <input name="capacity" type="number" required placeholder="500" className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:border-emerald-500 outline-none" />
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-600 block mb-1">{t(language, 'priceMTMonth')}</label>
            <input name="price" type="number" required placeholder="150" className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:border-emerald-500 outline-none" />
          </div>
          <div className="flex space-x-2 pt-1">
            <button type="button" onClick={() => setShowAddForm(false)} className="flex-1 py-2 rounded-xl border border-slate-200 text-slate-600 text-xs font-semibold hover:bg-slate-50">
              {t(language, 'cancel')}
            </button>
            <button type="submit" className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition-colors">
              {t(language, 'registerBtn')}
            </button>
          </div>
        </form>
      )}

      {/* Tabs */}
      <div className="grid grid-cols-2 gap-2 bg-white rounded-2xl p-1 border border-slate-200">
        <button
          onClick={() => setActiveTab('inventory')}
          className={"py-2.5 rounded-xl text-xs font-bold transition-colors " + (activeTab === 'inventory' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50')}
        >
          {t(language, 'myGodowns')} ({spaces.length})
        </button>
        <button
          onClick={() => setActiveTab('requests')}
          className={"py-2.5 rounded-xl text-xs font-bold transition-colors " + (activeTab === 'requests' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50')}
        >
          {t(language, 'bookingRequests')} ({requests.filter(r => r.status === 'Pending').length})
        </button>
      </div>

      {/* Inventory Tab */}
      {activeTab === 'inventory' && (
        <div className="space-y-3">
          {spaces.map(space => {
            const SpaceIcon = space.icon || Box;
            const fillPercent = Math.round((space.booked / space.capacity) * 100);
            const isCritical = fillPercent > 85;

            return (
              <div key={space.id} className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center space-x-2">
                    <div className={"w-8 h-8 rounded-lg flex items-center justify-center " + (space.type === 'Cold Storage' ? 'bg-blue-50 text-blue-600' : 'bg-amber-50 text-amber-600')}>
                      <SpaceIcon className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-slate-800 font-bold text-sm">{space.name}</h3>
                      <span className={"text-[10px] font-medium px-1.5 py-0.5 rounded " + (space.type === 'Cold Storage' ? 'bg-blue-50 text-blue-700' : 'bg-amber-50 text-amber-700')}>{space.type}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-black text-slate-800">₹{space.pricePerMT}</span>
                    <p className="text-[9px] text-slate-400 font-medium">/ MT / Month</p>
                  </div>
                </div>

                <div className="flex justify-between items-center text-xs mb-1.5">
                  <span className="text-slate-500 font-medium">{t(language, 'filled')}: {space.booked} MT</span>
                  <span className={isCritical ? "text-rose-600 font-bold" : "text-emerald-700 font-bold"}>
                    {t(language, 'free')}: {space.capacity - space.booked} MT
                  </span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className={(isCritical ? "bg-rose-500" : "bg-emerald-500") + " h-full transition-all duration-500 rounded-full"} style={{ width: `${fillPercent}%` }}></div>
                </div>
                <p className="text-[9px] text-slate-400 mt-1 text-right">{fillPercent}% {t(language, 'capacityUsed')}</p>
              </div>
            );
          })}
        </div>
      )}

      {/* Requests Tab */}
      {activeTab === 'requests' && (
        <div className="space-y-3">
          {requests.length === 0 ? (
            <p className="text-center text-sm text-slate-500 py-10">{t(language, 'noRequests')}</p>
          ) : (
            requests.map(req => (
              <div key={req.id} className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-slate-800 font-bold text-sm">{req.farmer}</h3>
                    <p className="text-xs text-slate-500 flex items-center mt-1">
                      <Box className="w-3 h-3 mr-1" /> {req.crop} — {req.quantity} MT
                    </p>
                    <p className="text-xs text-slate-500 flex items-center mt-0.5">
                      🕒 {t(language, 'duration')}: {req.duration}
                    </p>
                  </div>
                  <span className={"px-2 py-1 rounded-lg text-[10px] font-bold " + (
                    req.status === 'Pending' ? 'bg-amber-50 text-amber-700 border border-amber-200' : 
                    req.status === 'Approved' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'
                  )}>
                    {t(language, req.status.toLowerCase())}
                  </span>
                </div>
                
                {req.status === 'Pending' && (
                  <div className="grid grid-cols-2 gap-2 mt-3 border-t border-slate-100 pt-3">
                    <button 
                      onClick={() => handleReject(req.id)}
                      className="py-2 bg-white hover:bg-rose-50 text-rose-600 border border-rose-200 rounded-xl text-xs font-bold flex justify-center items-center transition-colors"
                    >
                      <XCircle className="w-3.5 h-3.5 mr-1" /> Reject
                    </button>
                    <button 
                      onClick={() => handleApprove(req.id)}
                      className="py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex justify-center items-center shadow-sm transition-colors"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Approve
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
