import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Mic, MicOff, PlusCircle, Calendar, MapPin, Tag, Weight } from 'lucide-react';
import { initSpeechRecognition, stopListening } from '../../utils/speechUtils';
import NetRealizationWidget from '../../components/NetRealizationWidget';

export default function AddListingModal({ onClose }) {
  const { createListing, checkUnderpricing } = useApp();

  const [form, setForm] = useState({
    crop: 'Wheat',
    quantity: '1000',
    price: '25',
    qualityGrade: 'Grade A',
    harvestDate: '2026-09-22',
    pickupLocation: 'Sonipat Farm, Haryana',
    lat: 28.9931,
    lng: 77.0151
  });

  const [errors, setErrors] = useState({});
  const [activeMicField, setActiveMicField] = useState(null);
  const recognitionRef = React.useRef(null);

  const startVoiceInput = (field) => {
    if (activeMicField === field) {
      stopListening();
      setActiveMicField(null);
      return;
    }
    
    if (activeMicField) stopListening();
    
    setActiveMicField(field);
    const handleResult = (transcript) => {
      // Basic normalization for numbers if needed
      let value = transcript.trim();
      if (field === 'quantity' || field === 'price') {
        const num = value.match(/\d+/);
        if (num) value = num[0];
      }
      setForm(prev => ({ ...prev, [field]: value }));
      setActiveMicField(null);
    };
    
    const handleError = () => setActiveMicField(null);
    const handleEnd = () => setActiveMicField(null);

    recognitionRef.current = initSpeechRecognition(handleResult, handleError, handleEnd);
    if (recognitionRef.current) recognitionRef.current.start();
  };

  React.useEffect(() => {
    return () => stopListening();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = {};
    if (!form.quantity || Number(form.quantity) <= 0) errs.quantity = 'Enter quantity in kg';
    if (!form.price || Number(form.price) <= 0) errs.price = 'Enter valid price per kg';
    if (!form.pickupLocation) errs.pickupLocation = 'Pickup location required';

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    createListing({
      crop: form.crop,
      quantity: Number(form.quantity),
      price: Number(form.price),
      grade: form.qualityGrade,
      harvestDate: form.harvestDate,
      location: { name: form.pickupLocation, lat: form.lat, lng: form.lng }
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-white backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white border border-slate-200 rounded-t-2xl sm:rounded-2xl w-full max-w-md max-h-[85vh] flex flex-col overflow-hidden shadow-2xl animate-in slide-in-from-bottom">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-[#1B5E20] text-white">
          <div className="flex items-center space-x-2">
            <PlusCircle className="w-5 h-5" />
            <h3 className="font-bold text-sm">Add New Crop Listing</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-white/20 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 space-y-3 overflow-y-auto flex-1 text-xs">
          {/* Crop Type Select */}
          <div>
            <label className="text-slate-600 font-semibold mb-1 flex items-center justify-between">
              <span>Crop Type</span>
              <button type="button" onClick={() => startVoiceInput('crop')} className="focus:outline-none">
                {activeMicField === 'crop' ? <MicOff className="w-3.5 h-3.5 text-rose-400 animate-pulse" /> : <Mic className="w-3.5 h-3.5 text-[#1B5E20] opacity-80" />}
              </button>
            </label>
            <select
              value={form.crop}
              onChange={(e) => setForm({ ...form, crop: e.target.value })}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-50 text-slate-700 border border-slate-200 text-slate-800 font-medium focus:outline-none focus:border-emerald-500"
            >
              <option value="Wheat">Wheat (गेहूं)</option>
              <option value="Rice">Rice (चावल)</option>
              <option value="Tomato">Tomato (टमाटर)</option>
              <option value="Potato">Potato (आलू)</option>
              <option value="Onion">Onion (प्याज़)</option>
              <option value="Cotton">Cotton (कपास)</option>
            </select>
          </div>

          {/* Quantity & Expected Price */}
          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="text-slate-600 font-semibold mb-1 flex items-center justify-between">
                <span>Quantity (kg)</span>
                <button type="button" onClick={() => startVoiceInput('quantity')} className="focus:outline-none">
                  {activeMicField === 'quantity' ? <MicOff className="w-3.5 h-3.5 text-rose-400 animate-pulse" /> : <Mic className="w-3.5 h-3.5 text-[#1B5E20] opacity-80" />}
                </button>
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={form.quantity}
                  onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                  placeholder="e.g. 1000"
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-50 text-slate-700 border border-slate-200 text-slate-800 font-medium focus:outline-none focus:border-emerald-500"
                />
              </div>
              {errors.quantity && <p className="text-[10px] text-rose-400 mt-0.5">{errors.quantity}</p>}
            </div>

            <div>
              <label className="text-slate-600 font-semibold mb-1 flex items-center justify-between">
                <span>Price (₹/kg)</span>
                <button type="button" onClick={() => startVoiceInput('price')} className="focus:outline-none">
                  {activeMicField === 'price' ? <MicOff className="w-3.5 h-3.5 text-rose-400 animate-pulse" /> : <Mic className="w-3.5 h-3.5 text-[#1B5E20] opacity-80" />}
                </button>
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  placeholder="e.g. 25"
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-50 text-slate-700 border border-slate-200 text-slate-800 font-medium focus:outline-none focus:border-emerald-500"
                />
              </div>
              {errors.price && <p className="text-[10px] text-rose-400 mt-0.5">{errors.price}</p>}
            </div>
          </div>

          {/* Quality Grade */}
          <div>
            <label className="text-slate-600 font-semibold mb-1 block">Expected Quality Grade</label>
            <div className="relative">
              <select
                value={form.qualityGrade}
                onChange={(e) => setForm({ ...form, qualityGrade: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-50 text-slate-700 border border-slate-200 text-slate-800 font-medium focus:outline-none focus:border-emerald-500 appearance-none"
              >
                <option value="Grade A">Grade A (Premium / &lt;10% Moisture)</option>
                <option value="Grade B">Grade B (Standard)</option>
                <option value="Grade C">Grade C (Low Grade)</option>
                <option value="Processing">Processing Grade (Industrial)</option>
              </select>
            </div>
          </div>

          <NetRealizationWidget price={form.price} quantity={form.quantity} grade={form.qualityGrade} crop={form.crop} />

          {checkUnderpricing(form.crop, form.price) && (
            <div className="bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold p-3 rounded-xl flex items-start gap-2 shadow-sm">
              <span className="text-amber-500 mt-0.5">⚠️</span>
              <span>This price is below the typical mandi rate for this crop.</span>
            </div>
          )}

          {/* Harvest Ready Date */}
          <div>
            <label className="text-slate-600 font-semibold mb-1 block">Harvest Ready Date</label>
            <input
              type="date"
              value={form.harvestDate}
              onChange={(e) => setForm({ ...form, harvestDate: e.target.value })}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-50 text-slate-700 border border-slate-200 text-slate-800 font-medium focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Pickup Location */}
          <div>
            <label className="text-slate-600 font-semibold mb-1 flex items-center justify-between">
              <span>Pickup Farm Location</span>
              <button type="button" onClick={() => startVoiceInput('pickupLocation')} className="focus:outline-none">
                  {activeMicField === 'pickupLocation' ? <MicOff className="w-3.5 h-3.5 text-rose-400 animate-pulse" /> : <Mic className="w-3.5 h-3.5 text-[#1B5E20] opacity-80" />}
              </button>
            </label>
            <input
              type="text"
              value={form.pickupLocation}
              onChange={(e) => setForm({ ...form, pickupLocation: e.target.value })}
              placeholder="Village, District, Pin Code"
              className="w-full px-3 py-2.5 rounded-xl bg-slate-50 text-slate-700 border border-slate-200 text-slate-800 font-medium focus:outline-none focus:border-emerald-500"
            />
            {errors.pickupLocation && <p className="text-[10px] text-rose-400 mt-0.5">{errors.pickupLocation}</p>}
          </div>

          <button
            type="submit"
            className="w-full btn-touch py-3 rounded-xl bg-[#1B5E20] text-white font-bold text-sm shadow-lg mt-3"
          >
            Publish Listing
          </button>
        </form>
      </div>
    </div>
  );
}
