import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Warehouse, Plus, CheckCircle2, XCircle, MapPin, Box, TrendingUp, IndianRupee } from 'lucide-react';

export default function WarehouseDashboard() {
  const { currentUser, triggerToast } = useApp();
  const [activeTab, setActiveTab] = useState('inventory'); // inventory | requests

  // Mock data for warehouse spaces
  const [spaces, setSpaces] = useState([
    { id: 1, name: 'Cold Storage A', capacity: 500, booked: 450, pricePerMT: 150, type: 'Cold Storage' },
    { id: 2, name: 'Dry Warehouse B', capacity: 1000, booked: 200, pricePerMT: 80, type: 'Dry Storage' }
  ]);

  // Mock data for booking requests
  const [requests, setRequests] = useState([
    { id: 101, farmer: 'Ramesh Kumar', crop: 'Potato', quantity: 50, duration: '3 Months', status: 'Pending' },
    { id: 102, farmer: 'Suresh Singh', crop: 'Wheat', quantity: 200, duration: '1 Month', status: 'Pending' }
  ]);

  const totalCapacity = spaces.reduce((acc, curr) => acc + curr.capacity, 0);
  const totalBooked = spaces.reduce((acc, curr) => acc + curr.booked, 0);
  const availableSpace = totalCapacity - totalBooked;

  const handleApprove = (id) => {
    setRequests(reqs => reqs.map(r => r.id === id ? { ...r, status: 'Approved' } : r));
    triggerToast('Booking Approved Successfully!', 'Success', 'success');
  };

  const handleReject = (id) => {
    setRequests(reqs => reqs.map(r => r.id === id ? { ...r, status: 'Rejected' } : r));
    triggerToast('Booking Rejected', 'Info', 'info');
  };

  return (
    <div className="space-y-4 p-4 pb-24 bg-[#f9f8f3] min-h-screen text-slate-800 max-w-4xl mx-auto">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-extrabold text-amber-900 flex items-center">
            <Warehouse className="w-6 h-6 mr-2" />
            {currentUser?.name?.split(' ')[0] || 'Warehouse'} जी 👋
          </h2>
          <p className="text-xs text-slate-500 mt-1 font-medium flex items-center">
            📍 {currentUser?.village || 'Indore District'} 
            <span className="ml-2 px-1.5 py-0.5 bg-emerald-100 text-emerald-800 rounded text-[9px] font-bold uppercase tracking-wider border border-emerald-200">
              ✓ WDRA Verified
            </span>
          </p>
        </div>
        <button className="w-10 h-10 rounded-full bg-amber-100 border border-amber-200 shadow-sm flex items-center justify-center text-amber-800 font-bold">
          {currentUser?.name?.charAt(0) || 'W'}
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-xs font-bold text-slate-500 uppercase">Available Space</p>
          <div className="flex items-end mt-1 space-x-1">
            <span className="text-2xl font-black text-amber-600">{availableSpace}</span>
            <span className="text-sm font-bold text-amber-600 mb-1">MT</span>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden">
            <div className="bg-amber-500 h-full" style={{ width: `${(totalBooked / totalCapacity) * 100}%` }}></div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-xs font-bold text-slate-500 uppercase">Monthly Revenue</p>
          <div className="flex items-end mt-1 space-x-1">
            <span className="text-2xl font-black text-emerald-700">₹45.2k</span>
          </div>
          <p className="text-[10px] text-emerald-600 font-bold mt-1 flex items-center">
            <TrendingUp className="w-3 h-3 mr-1" /> +12% this month
          </p>
        </div>
      </div>

      {/* Action Button */}
      <button 
        onClick={() => triggerToast('Add new storage space unit form will open.', 'Action', 'info')}
        className="w-full py-3 bg-amber-600 text-white rounded-xl font-bold shadow-md flex justify-center items-center hover:bg-amber-700 transition"
      >
        <Plus className="w-5 h-5 mr-2" />
        Add New Storage Space
      </button>

      {/* Tabs */}
      <div className="grid grid-cols-2 gap-2 bg-white rounded-2xl p-1 border border-slate-200">
        <button
          onClick={() => setActiveTab('inventory')}
          className={`py-2 rounded-xl text-xs font-semibold ${activeTab === 'inventory' ? 'bg-amber-900 text-white' : 'text-slate-600'}`}
        >
          My Godowns ({spaces.length})
        </button>
        <button
          onClick={() => setActiveTab('requests')}
          className={`py-2 rounded-xl text-xs font-semibold ${activeTab === 'requests' ? 'bg-amber-900 text-white' : 'text-slate-600'}`}
        >
          Booking Requests ({requests.filter(r => r.status === 'Pending').length})
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'inventory' && (
        <div className="space-y-3">
          {spaces.map(space => (
            <div key={space.id} className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-bold text-slate-800">{space.name}</h3>
                  <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded border border-slate-200">{space.type}</span>
                </div>
                <div className="text-right">
                  <span className="text-lg font-bold text-amber-700">₹{space.pricePerMT}</span>
                  <p className="text-[9px] text-slate-500 font-bold">/ MT / Month</p>
                </div>
              </div>
              <div className="flex justify-between items-center text-xs mt-3">
                <span className="font-medium text-slate-600">Filled: {space.booked} MT</span>
                <span className="font-bold text-emerald-700">Free: {space.capacity - space.booked} MT</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full mt-1 overflow-hidden">
                <div className="bg-emerald-500 h-full" style={{ width: `${(space.booked / space.capacity) * 100}%` }}></div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'requests' && (
        <div className="space-y-3">
          {requests.length === 0 ? (
            <p className="text-center text-sm text-slate-500 py-10">No new booking requests.</p>
          ) : (
            requests.map(req => (
              <div key={req.id} className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-bold text-slate-800">{req.farmer}</h3>
                    <p className="text-xs text-slate-500 flex items-center mt-0.5">
                      <Box className="w-3 h-3 mr-1" /> {req.crop} - {req.quantity} MT
                    </p>
                    <p className="text-xs text-slate-500 flex items-center mt-0.5">
                      🗓️ Duration: {req.duration}
                    </p>
                  </div>
                  <span className={`px-2 py-1 rounded-md text-[10px] font-bold ${
                    req.status === 'Pending' ? 'bg-amber-100 text-amber-800' : 
                    req.status === 'Approved' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                  }`}>
                    {req.status}
                  </span>
                </div>
                
                {req.status === 'Pending' && (
                  <div className="grid grid-cols-2 gap-2 mt-3 border-t border-slate-100 pt-3">
                    <button 
                      onClick={() => handleReject(req.id)}
                      className="py-2 bg-rose-50 text-rose-700 border border-rose-200 rounded-lg text-xs font-bold flex justify-center items-center"
                    >
                      <XCircle className="w-4 h-4 mr-1" /> Reject
                    </button>
                    <button 
                      onClick={() => handleApprove(req.id)}
                      className="py-2 bg-emerald-600 text-white rounded-lg text-xs font-bold flex justify-center items-center shadow-sm"
                    >
                      <CheckCircle2 className="w-4 h-4 mr-1" /> Approve
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
