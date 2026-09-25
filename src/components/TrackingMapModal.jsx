import React, { useEffect, useState } from 'react';
import { X, Navigation, MapPin } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

function MapResizer() {
  const map = useMap();
  useEffect(() => {
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 400);
    return () => clearTimeout(timer);
  }, [map]);
  return null;
}

// Fix Leaflet's default icon path issues with Webpack/Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// A custom truck icon for the live location
const truckIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/711/711192.png', // Delivery truck icon
  iconSize: [32, 32],
  iconAnchor: [16, 16],
  popupAnchor: [0, -16]
});

export default function TrackingMapModal({ delivery, onClose }) {
  // We'll simulate a truck moving from pickup to delivery.
  const [currentPos, setCurrentPos] = useState(null);
  
  useEffect(() => {
    if (!delivery || !delivery.pickupLocation || !delivery.deliveryLocation) return;
    
    // We'll just interpolate a path over time
    const start = [delivery.pickupLocation?.lat || 28.9931, delivery.pickupLocation?.lng || 77.0151];
    const end = [delivery.deliveryLocation?.lat || 28.7041, delivery.deliveryLocation?.lng || 77.1025];
    
    setCurrentPos(start);
    
    let step = 0;
    const totalSteps = 100;
    
    const interval = setInterval(() => {
      step = (step + 1) % totalSteps;
      const progress = step / totalSteps;
      
      const newLat = start[0] + (end[0] - start[0]) * progress;
      const newLng = start[1] + (end[1] - start[1]) * progress;
      
      setCurrentPos([newLat, newLng]);
    }, 1000); // update every second
    
    return () => clearInterval(interval);
  }, [delivery]);

  if (!delivery) return null;

  const start = [delivery.pickupLocation?.lat || 28.9931, delivery.pickupLocation?.lng || 77.0151];
  const end = [delivery.deliveryLocation?.lat || 28.7041, delivery.deliveryLocation?.lng || 77.1025];

  return (
    <div className="fixed inset-0 z-50 bg-white backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white border border-slate-200 rounded-t-2xl sm:rounded-2xl w-full max-w-md h-[85vh] flex flex-col overflow-hidden shadow-2xl animate-in slide-in-from-bottom">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-[#2E7D32] text-white shrink-0">
          <div className="flex items-center space-x-2">
            <Navigation className="w-5 h-5 animate-pulse text-amber-300" />
            <div>
              <h3 className="font-bold text-sm">Live Vehicle Tracking</h3>
              <p className="text-[10px] text-emerald-100 opacity-90">{delivery.transporterName}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-white/20 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Map Container */}
        <div className="flex-1 w-full bg-slate-50 text-slate-700 relative">
          <MapContainer 
            center={start} 
            zoom={10} 
            scrollWheelZoom={true} 
            style={{ height: '100%', width: '100%', zIndex: 10 }}
          >
            <MapResizer />
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            {/* Origin Marker */}
            <Marker position={start}>
              <Popup>Pickup: {delivery.pickupLocation?.name || (typeof delivery.pickupLocation === 'string' ? delivery.pickupLocation : 'Farm')}</Popup>
            </Marker>

            {/* Destination Marker */}
            <Marker position={end}>
              <Popup>Destination: {delivery.deliveryLocation?.name || (typeof delivery.deliveryLocation === 'string' ? delivery.deliveryLocation : 'Destination')}</Popup>
            </Marker>

            {/* Route Line */}
            <Polyline positions={[start, end]} color="#10b981" weight={4} dashArray="5, 10" />

            {/* Moving Truck */}
            {currentPos && (
              <Marker position={currentPos} icon={truckIcon}>
                <Popup>Vehicle is moving...</Popup>
              </Marker>
            )}
          </MapContainer>
        </div>

        {/* Info Footer */}
        <div className="p-4 bg-white shrink-0 text-xs text-slate-600 space-y-2">
          <div className="flex justify-between items-center bg-slate-50 text-slate-700 p-2.5 rounded-xl border border-slate-200">
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-rose-400" />
              <span className="font-semibold">Status:</span>
            </div>
            <span className="text-[#2E7D32] font-bold">{delivery.status || 'In Transit'}</span>
          </div>
          <p className="text-center text-[10px] text-slate-500">Live Telematics Powered by Mapbox/Leaflet Simulation</p>
        </div>
      </div>
    </div>
  );
}
