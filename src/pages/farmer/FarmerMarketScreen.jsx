import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, Navigation, TrendingUp, Filter, CheckCircle2, ChevronDown, SlidersHorizontal } from 'lucide-react';

// Custom Map Markers
const createPriceIcon = (price, label, isActive = false) => {
  return new L.DivIcon({
    className: 'custom-price-marker',
    html: `
      <div style="
        background: ${isActive ? '#2E7D32' : '#334155'};
        color: white;
        padding: 4px 8px;
        border-radius: 9999px;
        font-weight: 800;
        font-size: 11px;
        white-space: nowrap;
        box-shadow: 0 4px 10px rgba(0,0,0,0.3);
        border: 2px solid white;
        display: flex;
        align-items: center;
        gap: 3px;
      ">
        ${label ? `<span style="opacity: 0.8; font-size: 9px;">${label}</span>` : ''}
        ₹${price}
      </div>
    `,
    iconSize: [60, 24],
    iconAnchor: [30, 12],
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

export default function FarmerMarketScreen() {
  const { triggerToast } = useApp();
  const [crop, setCrop] = useState('Tomato');
  const [quantity, setQuantity] = useState('500');
  const [distance, setDistance] = useState('50km');
  const [selectedOpportunity, setSelectedOpportunity] = useState(0);
  const [routeActive, setRouteActive] = useState(true);

  const farmCoords = [26.9856, 75.7200]; // Chomu Mandi / Farm Coords
  
  const opportunities = [
    {
      id: 0,
      name: 'MegaFood Processing Park',
      location: 'Shahpura Mega Food Park, NH-48',
      buyerType: 'Processor',
      distanceKm: 47.7,
      buyerOffer: 32,
      freight: 2.8,
      estNet: 29.2,
      demand: 'HIGH',
      volumeNeeded: '2,000–10,000 kg',
      coords: [27.3820, 75.9610]
    },
    {
      id: 1,
      name: 'Jaipur Kisan Mandi (Muhana APMC Terminal)',
      location: 'Terminal Market Gate 2, Jaipur',
      buyerType: 'Mandi',
      distanceKm: 48.2,
      buyerOffer: 31.5,
      freight: 2.8,
      estNet: 28.7,
      demand: 'HIGH',
      volumeNeeded: '5,000–20,000 kg',
      coords: [26.8200, 75.7800]
    },
    {
      id: 2,
      name: 'Organic Harvest India',
      location: 'Chomu Industrial Area, Jaipur',
      buyerType: 'Institution',
      distanceKm: 22.8,
      buyerOffer: 30,
      freight: 1.4,
      estNet: 28.6,
      demand: 'HIGH',
      volumeNeeded: '1,000–3,000 kg',
      coords: [27.0500, 75.7100]
    },
    {
      id: 3,
      name: 'FreshDirect Retail Hub',
      location: 'Vidyadhar Nagar, Jaipur',
      buyerType: 'Retail',
      distanceKm: 34.1,
      buyerOffer: 29.5,
      freight: 2.0,
      estNet: 27.5,
      demand: 'MODERATE',
      volumeNeeded: '500–2,000 kg',
      coords: [26.9600, 75.7700]
    }
  ];

  const current = opportunities[selectedOpportunity];

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex flex-col font-sans">
      {/* Subheader & Controls Bar */}
      <div className="bg-white border-b border-slate-200 px-4 py-3 shadow-xs space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-rose-500" />
              <h2 className="text-base font-extrabold text-slate-900 tracking-tight">
                Nearby Market Opportunities
              </h2>
              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full text-[11px] font-extrabold border border-emerald-200">
                7 Buyers Found
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium pl-6">
              Real-time net realization from Chomu Mandi
            </p>
          </div>

          {/* Filters Row */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            {/* Crop Select */}
            <div className="bg-slate-100 border border-slate-200 rounded-lg px-3 py-1.5 flex items-center space-x-1.5 font-bold">
              <span>{crop}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
            </div>

            {/* Qty Input */}
            <div className="bg-slate-100 border border-slate-200 rounded-lg px-2.5 py-1.5 flex items-center space-x-1 font-bold">
              <input 
                type="number" 
                value={quantity} 
                onChange={(e) => setQuantity(e.target.value)}
                className="w-12 bg-transparent text-slate-900 font-black focus:outline-none"
              />
              <span className="text-slate-500 text-[11px]">kg</span>
            </div>

            {/* Distance Pills */}
            <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-lg border border-slate-200 font-bold">
              {['10km', '25km', '50km', '100km'].map(d => (
                <button
                  key={d}
                  onClick={() => setDistance(d)}
                  className={`px-2 py-0.5 rounded text-[11px] transition-colors ${
                    distance === d ? 'bg-[#2E7D32] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>

            {/* Dropdowns */}
            <div className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 flex items-center space-x-1 text-slate-600 font-semibold cursor-pointer">
              <span>All Buyer Types</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </div>

            <div className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 flex items-center space-x-1 text-slate-600 font-semibold cursor-pointer">
              <span>Best Net</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </div>

            <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-[11px] font-bold">
              <button className="px-2.5 py-1 bg-white text-slate-900 rounded shadow-xs">Buyers</button>
              <button className="px-2.5 py-1 text-slate-500">Zones</button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid View: Map on Left (65%), Cards on Right (35%) */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-0 overflow-hidden relative">
        {/* Left Column: Interactive Map */}
        <div className="lg:col-span-8 relative min-h-[500px] flex flex-col bg-slate-100">
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

            {/* Buyer Opportunity Markers */}
            {opportunities.map(opp => (
              <Marker
                key={opp.id}
                position={opp.coords}
                icon={createPriceIcon(opp.estNet, opp.buyerType, opp.id === selectedOpportunity)}
                eventHandlers={{
                  click: () => {
                    setSelectedOpportunity(opp.id);
                    setRouteActive(true);
                  }
                }}
              >
                <Popup>
                  <div className="p-1 max-w-xs space-y-1">
                    <span className="px-1.5 py-0.5 bg-emerald-100 text-emerald-800 rounded text-[9px] font-bold uppercase">
                      {opp.buyerType}
                    </span>
                    <h4 className="font-bold text-xs text-slate-900">{opp.name}</h4>
                    <p className="text-[10px] text-slate-500">{opp.location}</p>
                    <p className="text-xs font-black text-emerald-700">Buyer Offer: ₹{opp.buyerOffer}/kg | Net: ₹{opp.estNet}/kg</p>
                  </div>
                </Popup>
              </Marker>
            ))}

            {/* Active Route Polyline */}
            {routeActive && current && (
              <Polyline
                positions={[farmCoords, current.coords]}
                color="#10b981"
                weight={5}
                dashArray="6, 10"
              />
            )}
          </MapContainer>

          {/* Active Highway Route Bottom Bar */}
          {routeActive && current && (
            <div className="absolute bottom-4 left-4 right-4 z-20 bg-slate-900/90 text-white backdrop-blur-md p-3 rounded-2xl shadow-xl border border-slate-700 flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
                <span>
                  Active Highway Route to <strong>{current.name}</strong> ({current.distanceKm} km - Est. Transit Freight ₹{current.freight}/kg)
                </span>
              </div>
              <button 
                onClick={() => setRouteActive(false)}
                className="px-3 py-1 bg-slate-800 hover:bg-slate-700 rounded-lg text-[11px] font-bold text-slate-300 border border-slate-600 transition-colors"
              >
                Clear Route
              </button>
            </div>
          )}
        </div>

        {/* Right Column: Intelligence & Opportunity Cards */}
        <div className="lg:col-span-4 bg-white border-l border-slate-200 p-4 space-y-4 overflow-y-auto custom-scrollbar">
          {/* Card 1: Local Market Intelligence */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
                ● LOCAL MARKET INTELLIGENCE
              </span>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                Live Local Sales
              </span>
            </div>
            <div className="flex justify-between items-baseline">
              <div>
                <p className="text-xs text-slate-500 font-medium">Tomato Mandi Range</p>
                <p className="text-lg font-black text-slate-900">₹27–30.5 <span className="text-xs font-normal text-slate-500">/kg</span></p>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-slate-400 uppercase font-bold">RECENT MEDIAN</p>
                <p className="text-xl font-black text-emerald-700">₹29.3 <span className="text-xs font-normal text-slate-500">/kg</span></p>
              </div>
            </div>
            <p className="text-[10px] text-slate-400 italic text-right">Based on 8 recent transactions in your cluster</p>
          </div>

          {/* Card 2: Selected Opportunity Detail Card */}
          <div className="bg-white rounded-2xl p-4 border-2 border-[#2E7D32] shadow-sm space-y-3 relative">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center space-x-1.5">
                <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded-md text-[10px] font-extrabold">
                  {current.buyerType}
                </span>
                <span className="px-2 py-0.5 bg-rose-100 text-rose-700 rounded-md text-[10px] font-extrabold">
                  {current.demand} DEMAND
                </span>
              </div>
              <span className="text-slate-500 font-bold text-xs">{current.distanceKm} km away</span>
            </div>

            <div>
              <h3 className="font-extrabold text-base text-slate-900 leading-snug">{current.name}</h3>
              <p className="text-xs text-slate-500 mt-0.5">{current.location}</p>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-3 gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200 text-center">
              <div>
                <span className="text-[9px] font-bold text-slate-400 uppercase block">BUYER OFFER</span>
                <span className="text-base font-black text-slate-800">₹{current.buyerOffer}<span className="text-[10px] font-medium text-slate-500">/kg</span></span>
              </div>
              <div>
                <span className="text-[9px] font-bold text-rose-500 uppercase block">EST. FREIGHT</span>
                <span className="text-base font-black text-rose-600">-₹{current.freight}<span className="text-[10px] font-medium text-slate-500">/kg</span></span>
              </div>
              <div>
                <span className="text-[9px] font-bold text-emerald-700 uppercase block">ESTIMATED NET</span>
                <span className="text-base font-black text-emerald-700">₹{current.estNet}<span className="text-[10px] font-medium text-slate-500">/kg</span></span>
              </div>
            </div>

            <p className="text-xs text-slate-600 font-semibold">Volume needed: {current.volumeNeeded}</p>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button 
                onClick={() => setRouteActive(!routeActive)}
                className={`py-2.5 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center space-x-1 ${
                  routeActive ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700 border border-slate-300'
                }`}
              >
                <Navigation className="w-3.5 h-3.5 mr-1" />
                <span>{routeActive ? 'Route Active' : 'View Route'}</span>
              </button>
              <button 
                onClick={() => triggerToast(`Negotiation offer sent to ${current.name}!`, 'Offer Sent', 'success')}
                className="py-2.5 rounded-xl bg-[#2E7D32] hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-sm flex items-center justify-center"
              >
                Negotiate Deal
              </button>
            </div>
          </div>

          {/* Card 3: Ranked Opportunities List */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-extrabold text-slate-800 uppercase text-[11px] tracking-wider">
                RANKED OPPORTUNITIES ({opportunities.length})
              </span>
              <span className="text-slate-400 text-[10px]">Sorted by best net</span>
            </div>

            <div className="space-y-2">
              {opportunities.map((opp, idx) => {
                const isSelected = idx === selectedOpportunity;
                return (
                  <div 
                    key={opp.id}
                    onClick={() => {
                      setSelectedOpportunity(idx);
                      setRouteActive(true);
                    }}
                    className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                      isSelected 
                        ? 'bg-emerald-50/70 border-emerald-300 ring-1 ring-emerald-200' 
                        : 'bg-white border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                        idx === 0 ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-700'
                      }`}>
                        {idx + 1}
                      </div>
                      <div>
                        <h4 className="font-bold text-xs text-slate-900 leading-tight">{opp.name}</h4>
                        <p className="text-[10px] text-slate-500">
                          ₹{opp.buyerOffer}/kg • {opp.distanceKm} km • {opp.demand} demand
                        </p>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-[9px] text-slate-400 block font-bold uppercase">EST. NET</span>
                      <span className="font-black text-emerald-700 text-xs">₹{opp.estNet}/kg</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
