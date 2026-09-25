import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { t } from '../../utils/translations';
import {
  ArrowLeft, Camera, MapPin, Package, Calendar, Leaf, Plus, X, CheckCircle
} from 'lucide-react';
import imageCompression from 'browser-image-compression';

export default function CreateLotScreen({ onBack, onLotCreated }) {
  const { currentUser, language } = useApp();
  
  const [cropType, setCropType] = useState('');
  const [variety, setVariety] = useState('');
  const [quantity, setQuantity] = useState('');
  const [harvestDate, setHarvestDate] = useState('');
  const [locationName, setLocationName] = useState('');
  const [coords, setCoords] = useState(null);
  const [images, setImages] = useState([]); // array of base64 strings
  const [isCompressing, setIsCompressing] = useState(false);
  const [error, setError] = useState('');

  const fileInputRef = useRef(null);

  const cropOptions = [
    'Wheat', 'Rice', 'Tomato', 'Potato', 'Onion', 
    'Cotton', 'Soybean', 'Maize', 'Sugarcane', 'Mustard'
  ];

  const handleDetectLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCoords({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          setLocationName('Current Location Detected');
        },
        (error) => {
          console.error("Error detecting location: ", error);
          setError("Failed to detect location.");
        }
      );
    } else {
      setError("Geolocation is not supported by this browser.");
    }
  };

  const handleImageChange = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    
    if (images.length + files.length > 5) {
      setError("You can upload a maximum of 5 images.");
      return;
    }
    
    setError('');
    setIsCompressing(true);
    
    try {
      const newImages = [];
      const options = {
        maxSizeMB: 0.2,
        maxWidthOrHeight: 1024,
        useWebWorker: true
      };
      
      for (const file of files) {
        const compressedFile = await imageCompression(file, options);
        const reader = new FileReader();
        const base64Promise = new Promise((resolve, reject) => {
          reader.onload = () => resolve(reader.result);
          reader.onerror = err => reject(err);
        });
        reader.readAsDataURL(compressedFile);
        const base64 = await base64Promise;
        newImages.push(base64);
      }
      
      setImages(prev => [...prev, ...newImages]);
    } catch (err) {
      console.error("Error compressing images: ", err);
      setError("Failed to process images.");
    } finally {
      setIsCompressing(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const removeImage = (indexToRemove) => {
    setImages(images.filter((_, index) => index !== indexToRemove));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    if (!cropType || !variety || !quantity || !harvestDate || !locationName) {
      setError("Please fill in all fields.");
      return;
    }
    
    if (images.length < 3) {
      setError("Please upload at least 3 images.");
      return;
    }

    const today = new Date();
    const dateStr = today.toISOString().slice(0,10).replace(/-/g, '');
    const seqNum = Date.now().toString().slice(-4);
    const lotId = `HR-SNP-${dateStr}-${seqNum}`;
    
    const lotData = {
      id: lotId,
      farmerId: currentUser?.uid || 'anonymous',
      farmerName: currentUser?.displayName || 'Farmer',
      crop: cropType,
      variety,
      quantity: Number(quantity),
      harvestDate,
      location: {
        name: locationName,
        lat: coords?.lat || null,
        lng: coords?.lng || null
      },
      images,
      status: 'pending_grading',
      createdAt: new Date().toISOString()
    };
    
    onLotCreated(lotData);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <div className="bg-[#2E7D32] text-white px-4 py-4 flex items-center shadow-md">
        <button onClick={onBack} className="mr-3 p-1 rounded-full hover:bg-white/20 transition-colors">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-bold">Create New Lot</h1>
      </div>

      <div className="flex-1 p-4 pb-24 overflow-y-auto">
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm border border-red-100">
              {error}
            </div>
          )}

          {/* Crop Info */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-[#2E7D32] font-semibold flex items-center gap-2 mb-2">
              <Leaf size={18} /> Crop Details
            </h2>
            
            <div>
              <label className="block text-xs text-slate-500 mb-1 ml-1 font-medium">Crop Type *</label>
              <select
                value={cropType}
                onChange={(e) => setCropType(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-50 text-slate-700 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2E7D32]/20"
              >
                <option value="">Select Crop</option>
                {cropOptions.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-xs text-slate-500 mb-1 ml-1 font-medium">Variety *</label>
              <input
                type="text"
                placeholder="e.g. Sharbati, Basmati"
                value={variety}
                onChange={(e) => setVariety(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-50 text-slate-700 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2E7D32]/20"
              />
            </div>
          </div>

          {/* Quantity & Date */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-4">
            <div>
              <label className="text-xs text-slate-500 mb-1 ml-1 font-medium flex items-center gap-1">
                <Package size={14}/> Quantity (kg) *
              </label>
              <input
                type="number"
                placeholder="Enter quantity"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-50 text-slate-700 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2E7D32]/20"
                min="1"
              />
            </div>
            
            <div>
              <label className="text-xs text-slate-500 mb-1 ml-1 font-medium flex items-center gap-1">
                <Calendar size={14}/> Harvest Date *
              </label>
              <input
                type="date"
                value={harvestDate}
                onChange={(e) => setHarvestDate(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-50 text-slate-700 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2E7D32]/20"
              />
            </div>
          </div>

          {/* Location */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-3">
            <div className="flex justify-between items-center">
              <h2 className="text-[#2E7D32] font-semibold flex items-center gap-2">
                <MapPin size={18} /> Location
              </h2>
              <button 
                type="button" 
                onClick={handleDetectLocation}
                className="text-xs text-blue-600 font-medium px-2 py-1 bg-blue-50 rounded-lg"
              >
                Auto-detect
              </button>
            </div>
            
            <div>
              <label className="block text-xs text-slate-500 mb-1 ml-1 font-medium">Location Name *</label>
              <input
                type="text"
                placeholder="Village, District"
                value={locationName}
                onChange={(e) => setLocationName(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-50 text-slate-700 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2E7D32]/20"
              />
              {coords && (
                <p className="text-[10px] text-slate-400 mt-1 ml-1">
                  Coords: {coords.lat.toFixed(4)}, {coords.lng.toFixed(4)}
                </p>
              )}
            </div>
          </div>

          {/* Photos */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-[#2E7D32] font-semibold flex items-center gap-2">
                <Camera size={18} /> Photos (3-5 required) *
              </h2>
              <span className={`text-xs px-2 py-1 rounded-full ${images.length >= 3 ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}`}>
                {images.length}/5 photos
              </span>
            </div>
            
            <div className="grid grid-cols-3 gap-2 mb-3">
              {images.map((imgSrc, idx) => (
                <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
                  <img src={imgSrc} alt={`upload-${idx}`} className="w-full h-full object-cover" />
                  <button 
                    type="button"
                    onClick={() => removeImage(idx)}
                    className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
              
              {images.length < 5 && (
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="aspect-square rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 flex flex-col items-center justify-center text-slate-400 cursor-pointer hover:bg-slate-100"
                >
                  <Plus size={24} />
                  <span className="text-[10px] mt-1">Add Photo</span>
                </div>
              )}
            </div>
            
            <input 
              type="file" 
              multiple 
              accept="image/*" 
              className="hidden" 
              ref={fileInputRef}
              onChange={handleImageChange}
            />
            {isCompressing && <p className="text-xs text-blue-500 animate-pulse mt-2">Compressing images...</p>}
          </div>

          {/* Submit */}
          <button 
            type="submit"
            className="w-full py-3 mt-4 rounded-xl bg-[#2E7D32] text-white font-bold text-sm flex justify-center items-center gap-2 shadow-lg shadow-green-900/20 active:scale-95 transition-transform"
          >
            <CheckCircle size={18} />
            Submit Lot
          </button>
          
        </form>
      </div>
    </div>
  );
}
