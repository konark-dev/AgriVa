import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Warehouse, MapPin, Search, Navigation, Snowflake, Sun, ShieldCheck, ChevronDown, CheckCircle2, ArrowRight } from 'lucide-react';

const createStorageIcon = (type, isActive = false) => {
  const isCold = type === 'Cold Storage';
  const color = isCold ? '#0284c7' : '#d97706';
  return new L.DivIcon({
    className: 'custom-storage-icon',
    html: `
      <div style="
        background: ${isActive ? '#2E7D32' : color};
        color: white;
        padding: 5px 9px;
        border-radius: 9999px;
        font-weight: 800;
        font-size: 10px;
        white-space: nowrap;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        border: 2px solid white;
        display: flex;
        align-items: center;
        gap: 4px;
      ">
        ${isCold ? '❄️' : '☀️'} ${type}
      </div>
    `,
    iconSize: [110, 26],
    iconAnchor: [55, 13]
  });
};

const farmIcon = new L.DivIcon({
  className: 'farm-marker',
  html: `
    <div style="
      background: #10b981;
      color: white;
      padding: 4px 10px;
      border-radius: 9999px;
      font-weight: 900;
      font-size: 11px;
      white-space: nowrap;
      box-shadow: 0 4px 12px rgba(16,185,129,0.5);
      border: 2px solid white;
    ">
      Your Farm
    </div>
  `,
  iconSize: [80, 24],
  iconAnchor: [40, 12]
});

export default function FarmerStorageScreen() {
  const { triggerToast } = useApp();
  const [selectedFacility, setSelectedFacility] = useState(0);
  const [commodityFilter, setCommodityFilter] = useState('All Commodities');
  const [typeFilter, setTypeFilter] = useState('All Types');
  const [distanceFilter, setDistanceFilter] = useState('Within 100 km');
  const [availabilityFilter, setAvailabilityFilter] = useState('Available Now (> 0 kg)');
  const [searchQuery, setSearchQuery] = useState('');
  const [routeActive, setRouteActive] = useState(true);

  const farmCoords = [26.9856, 75.7200]; // Chomu Mandi

  const facilities = [
    {
      id: 0,
      name: 'FreshKeep Cold Storage',
      location: 'Chomu Road Agro Corridor, Jaipur',
      type: 'Cold Storage',
      distanceKm: 14.2,
      availableKg: 8000,
      tariffPerKgDay: 0.12,
      tempRange: '2°C–8°C',
      compatibleProduce: 'Tomato, Apple, Vegetables',
      coords: [27.0800, 75.7500],
      wdraApproved: true
    },
    {
      id: 1,
      name: 'Shree Ram Agri Godown B',
      location: 'NH-48 Shahpura Bypass, Jaipur',
      type: 'Dry Storage',
      distanceKm: 28.5,
      availableKg: 25000,
      tariffPerKgDay: 0.08,
      tempRange: 'Ambient / Dry',
      compatibleProduce: 'Wheat, Potato, Grains, Pulses',
      coords: [27.2500, 75.8800],
      wdraApproved: true
    },
    {
      id: 2,
      name: 'Jaipur Central Cold Chain',
      location: 'Vidyadhar Nagar Agro Complex',
      type: 'Cold Storage',
      distanceKm: 31.0,
      availableKg: 12500,
      tariffPerKgDay: 0.15,
      tempRange: '0°C–4°C',
      compatibleProduce: 'Milk, Fruits, Tomato, Exotics',
      coords: [26.9600, 75.7800],
      wdraApproved: true
    }
  ];

  const current = facilities[selectedFacility];

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex flex-col font-sans">
      {/* Top Banner Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-emerald-100 text-[#2E7D32] border border-emerald-200">
              STORAGE NETWORK
            </span>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1">Storage</h1>
            <p className="text-xs text-slate-500 font-medium mt-0.5 flex items-center">
              <span>Nearby warehouses and cold storage facilities</span>
              <span className="mx-2">•</span>
              <span className="text-emerald-700 font-bold">📍 Using your farm location: Chomu Mandi, Jaipur</span>
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button 
              onClick={() => triggerToast('Farm location refreshed to Chomu Mandi', 'Location Updated', 'info')}
              className="px-4 py-2 bg-[#2E7D32] text-white rounded-xl text-xs font-bold shadow-xs hover:bg-emerald-700 transition-colors"
            >
              Use my current location
            </button>
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search city / area manually"
                className="pl-8 pr-4 py-2 bg-slate-100 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-[#2E7D32] w-60"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>
        </div>

        {/* Filters Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-4 pt-3 border-t border-slate-100 text-xs">
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Commodity</label>
            <div className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 flex items-center justify-between font-bold text-slate-700 cursor-pointer">
              <span>{commodityFilter}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Storage Type</label>
            <div className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 flex items-center justify-between font-bold text-slate-700 cursor-pointer">
              <span>{typeFilter}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Distance</label>
            <div className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 flex items-center justify-between font-bold text-slate-700 cursor-pointer">
              <span>{distanceFilter}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Availability</label>
            <div className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 flex items-center justify-between font-bold text-slate-700 cursor-pointer">
              <span>{availabilityFilter}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Split Content: Left Facility List (45%), Right Map (55%) */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-0 overflow-hidden relative">
        {/* Left Column: Facilities & Active Booking Request Card */}
        <div className="lg:col-span-5 p-4 space-y-4 overflow-y-auto custom-scrollbar border-r border-slate-200 bg-white">
          {/* Main Selected Facility Card (Matching Image 2 Card 1) */}
          <div className="bg-white rounded-2xl p-5 border-2 border-emerald-300 shadow-md space-y-4 relative">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-1 bg-blue-100 text-blue-800 rounded-full text-[10px] font-extrabold flex items-center gap-1">
                  {current.type === 'Cold Storage' ? <Snowflake className="w-3 h-3 text-blue-600" /> : <Sun className="w-3 h-3 text-amber-600" />}
                  {current.type}
                </span>
                <span className="text-slate-500 font-bold">{current.distanceKm} km away</span>
              </div>
              <span className="text-emerald-700 font-extrabold text-[10px] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                ✓ WDRA Approved
              </span>
            </div>

            <div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight">{current.name}</h2>
              <p className="text-xs text-slate-500 font-medium">{current.location}</p>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-3 gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200 text-center">
              <div>
                <span className="text-[9px] font-bold text-slate-400 uppercase block">Available</span>
                <span className="text-sm font-black text-slate-800">{current.availableKg.toLocaleString()} kg</span>
              </div>
              <div>
                <span className="text-[9px] font-bold text-slate-400 uppercase block">Tariff</span>
                <span className="text-sm font-black text-slate-800">₹{current.tariffPerKgDay}/kg/day</span>
              </div>
              <div>
                <span className="text-[9px] font-bold text-slate-400 uppercase block">Temperature</span>
                <span className="text-sm font-black text-blue-700">{current.tempRange}</span>
              </div>
            </div>

            <p className="text-xs text-slate-600 font-semibold">
              Compatible Produce: <span className="text-slate-900">{current.compatibleProduce}</span>
            </p>

            {/* Sub-action Row */}
            <div className="flex items-center space-x-2 text-xs">
              <button 
                onClick={() => setRouteActive(!routeActive)}
                className="flex-1 py-2 rounded-xl border border-slate-300 hover:bg-slate-50 font-bold text-slate-700 flex items-center justify-center space-x-1"
              >
                <Navigation className="w-3.5 h-3.5 text-slate-500" />
                <span>Route to storage</span>
              </button>

              <button 
                onClick={() => triggerToast('Multi-farm pickup scheduled', 'Pickup Scheduled', 'info')}
                className="flex-1 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold flex items-center justify-center space-x-1"
              >
                <span>⚡ Multi-farm pickup</span>
              </button>
            </div>

            {/* Main Primary CTA Button */}
            <button 
              onClick={() => triggerToast(`Storage request sent to ${current.name}! Space allocated.`, 'Request Submitted', 'success')}
              className="w-full py-3.5 bg-[#2E7D32] hover:bg-emerald-700 text-white rounded-xl font-bold shadow-md flex items-center justify-center space-x-2 text-sm transition-all"
            >
              <span>Request storage at this facility</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Matching Facilities Header */}
          <div className="pt-2">
            <div className="flex justify-between items-center text-xs mb-3">
              <span className="font-extrabold text-slate-800 uppercase text-[11px] tracking-wider">
                Matching facilities: 9 found
              </span>
              <span className="text-slate-400 text-[10px]">View all</span>
            </div>

            <div className="space-y-2">
              {facilities.map((fac, idx) => {
                const isSelected = idx === selectedFacility;
                return (
                  <div
                    key={fac.id}
                    onClick={() => {
                      setSelectedFacility(idx);
                      setRouteActive(true);
                    }}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'bg-emerald-50/70 border-emerald-300 ring-1 ring-emerald-200'
                        : 'bg-white border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-[9px] font-bold">
                          {fac.type}
                        </span>
                        <span className="text-[10px] text-slate-400 font-bold">{fac.distanceKm} km</span>
                        <span className="text-[10px] text-emerald-700 font-bold">Available</span>
                      </div>
                      <h4 className="font-bold text-xs text-slate-900 mt-1">{fac.name}</h4>
                      <p className="text-[10px] text-slate-500">{fac.location}</p>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-black text-slate-800 block">₹{fac.tariffPerKgDay}/kg/day</span>
                      <button className="text-[10px] font-bold text-[#2E7D32] hover:underline mt-1">View ➔</button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Storage Network Map */}
        <div className="lg:col-span-7 bg-slate-100 relative min-h-[500px] flex flex-col">
          <div className="p-3 bg-white border-b border-slate-200 text-xs flex justify-between items-center z-20">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Storage Network Map</h3>
              <p className="text-[10px] text-slate-500">
                Green pin: Your Farm • Blue/Orange pins: Facilities • Green line: Road route
              </p>
            </div>
          </div>

          <MapContainer 
            center={farmCoords} 
            zoom={10} 
            style={{ height: '100%', width: '100%' }}
            zoomControl={true}
          >
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>'
            />

            {/* Farm Marker */}
            <Marker position={farmCoords} icon={farmIcon}>
              <Popup>Your Farm • Chomu Mandi</Popup>
            </Marker>

            {/* Facility Markers */}
            {facilities.map(fac => (
              <Marker
                key={fac.id}
                position={fac.coords}
                icon={createStorageIcon(fac.type, fac.id === selectedFacility)}
                eventHandlers={{
                  click: () => {
                    setSelectedFacility(fac.id);
                    setRouteActive(true);
                  }
                }}
              >
                <Popup>
                  <div className="p-1 space-y-1">
                    <h4 className="font-bold text-xs text-slate-900">{fac.name}</h4>
                    <p className="text-[10px] text-slate-500">{fac.location}</p>
                    <p className="text-xs font-bold text-emerald-700">Available: {fac.availableKg.toLocaleString()} kg</p>
                    <p className="text-[10px] text-slate-600">Tariff: ₹{fac.tariffPerKgDay}/kg/day • {fac.tempRange}</p>
                  </div>
                </Popup>
              </Marker>
            ))}

            {/* Route Line */}
            {routeActive && current && (
              <Polyline
                positions={[farmCoords, current.coords]}
                color="#10b981"
                weight={5}
                dashArray="6, 10"
              />
            )}
          </MapContainer>
        </div>
      </div>
    </div>
  );
}
