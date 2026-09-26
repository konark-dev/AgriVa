import React, { useEffect, useState, Component } from 'react';
import { X, Navigation, MapPin, AlertTriangle } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// --- Error Boundary specifically for the Map ---
class MapErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error, info) {
    console.warn('[TrackingMap] Leaflet error caught:', error?.message);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="flex-1 flex flex-col items-center justify-center bg-slate-50 p-6 text-center space-y-3">
          <AlertTriangle className="w-10 h-10 text-amber-500" />
          <p className="text-sm font-bold text-slate-700">Map could not load</p>
          <p className="text-xs text-slate-500">Location data may be incomplete. The delivery is still active.</p>
          <button
            onClick={() => this.setState({ hasError: false })}
            className="px-4 py-2 bg-emerald-600 text-white text-xs font-bold rounded-xl"
          >
            Retry
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

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
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/711/711192.png',
  iconSize: [32, 32],
  iconAnchor: [16, 16],
  popupAnchor: [0, -16]
});

// Safely extract [lat, lng] from any location format
function safeCoords(loc, fallbackLat, fallbackLng) {
  if (loc && typeof loc === 'object' && typeof loc.lat === 'number' && typeof loc.lng === 'number') {
    return [loc.lat, loc.lng];
  }
  return [fallbackLat, fallbackLng];
}

function safeLocationName(loc, fallback) {
  if (!loc) return fallback;
  if (typeof loc === 'string') return loc;
  if (typeof loc === 'object' && loc.name) return loc.name;
  return fallback;
}

export default function TrackingMapModal({ delivery, onClose }) {
  const [currentPos, setCurrentPos] = useState(null);

  const start = safeCoords(delivery?.pickupLocation, 28.9931, 77.0151);
  const end = safeCoords(delivery?.deliveryLocation, 28.7041, 77.1025);

  useEffect(() => {
    if (!delivery) return;

    setCurrentPos(start);

    let step = 0;
    const totalSteps = 100;

    const interval = setInterval(() => {
      step = (step + 1) % totalSteps;
      const progress = step / totalSteps;

      const newLat = start[0] + (end[0] - start[0]) * progress;
      const newLng = start[1] + (end[1] - start[1]) * progress;

      setCurrentPos([newLat, newLng]);
    }, 1000);

    return () => clearInterval(interval);
  }, [delivery?.id]); // depend on delivery id, not the full object

  if (!delivery) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white border border-slate-200 rounded-t-2xl sm:rounded-2xl w-full max-w-md h-[85vh] flex flex-col overflow-hidden shadow-2xl animate-in slide-in-from-bottom">
        {/* Header */}
        <div className="p-4 border-b border-emerald-200 flex items-center justify-between bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-100 text-slate-900 shrink-0">
          <div className="flex items-center space-x-2">
            <Navigation className="w-5 h-5 animate-pulse text-emerald-600" />
            <div>
              <h3 className="font-bold text-sm text-slate-900">Live Vehicle Tracking</h3>
              <p className="text-[10px] text-slate-600 font-medium">{delivery.transporterName || 'Transporter'}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-emerald-200/60 transition-colors">
            <X className="w-5 h-5 text-slate-700" />
          </button>
        </div>

        {/* Map Container — wrapped in error boundary */}
        <div className="flex-1 w-full bg-slate-50 text-slate-700 relative">
          <MapErrorBoundary>
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
                <Popup>Pickup: {safeLocationName(delivery.pickupLocation, 'Farm')}</Popup>
              </Marker>

              {/* Destination Marker */}
              <Marker position={end}>
                <Popup>Destination: {safeLocationName(delivery.deliveryLocation, 'Mandi / Buyer')}</Popup>
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
          </MapErrorBoundary>
        </div>

        {/* Info Footer */}
        <div className="p-4 bg-white shrink-0 text-xs text-slate-600 space-y-2">
          <div className="flex justify-between items-center bg-slate-50 text-slate-700 p-2.5 rounded-xl border border-slate-200">
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-rose-400" />
              <span className="font-semibold">Status:</span>
            </div>
            <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200">{delivery.status || 'In Transit'}</span>
          </div>
          <div className="flex justify-between text-[10px] text-slate-500 px-1">
            <span>From: {safeLocationName(delivery.pickupLocation, '—')}</span>
            <span>To: {safeLocationName(delivery.deliveryLocation, '—')}</span>
          </div>
          <p className="text-center text-[10px] text-slate-500">Live Telematics Powered by Leaflet Simulation</p>
        </div>
      </div>
    </div>
  );
}
