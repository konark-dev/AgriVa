import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Edit, Trash2, CheckCircle2, Mic, MicOff } from 'lucide-react';
import { initSpeechRecognition, stopListening } from '../../utils/speechUtils';

export default function EditListingModal({ listing, onClose }) {
  const { updateListing, deleteListing, checkUnderpricing, language } = useApp();

  const [form, setForm] = useState({
    crop: listing.crop || 'Wheat',
    quantity: String(listing.quantity || 1000),
    price: String(listing.price || 25),
    qualityGrade: listing.grade || 'Grade A',
    harvestDate: listing.harvestDate || '2026-09-22',
    pickupLocation: listing.location?.name || 'Sonipat Farm, Haryana',
    lat: listing.location?.lat || 28.9931,
    lng: listing.location?.lng || 77.0151,
  });

  const [errors, setErrors] = useState({});
  const [activeMicField, setActiveMicField] = useState(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
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
      let value = transcript.trim();
      if (field === 'quantity' || field === 'price') {
        value = value.replace(/,/g, '');
        const num = value.match(/\d+(\.\d+)?/);
        if (num) value = num[0];
      }
      setForm((prev) => ({ ...prev, [field]: value }));
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

    updateListing(listing.id, {
      crop: form.crop,
      quantity: Number(form.quantity),
      price: Number(form.price),
      grade: form.qualityGrade,
      harvestDate: form.harvestDate,
      location: { name: form.pickupLocation, lat: form.lat, lng: form.lng },
    });

    onClose();
  };

  const handleDelete = async () => {
    await deleteListing(listing.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200 rounded-t-3xl sm:rounded-3xl w-full max-w-md flex flex-col overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-emerald-800 text-white">
          <div className="flex items-center space-x-2">
            <Edit className="w-5 h-5 text-emerald-300" />
            <h3 className="font-extrabold text-sm sm:text-base">Edit Crop Listing (#{listing.id})</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-white/20 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Delete Confirmation Warning overlay */}
        {showConfirmDelete ? (
          <div className="p-6 space-y-4 text-center">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <h4 className="font-black text-slate-900 text-base">Withdraw / Delete Listing?</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Are you sure you want to withdraw this <b>{listing.crop}</b> listing ({listing.quantity} kg @ ₹{listing.price}/kg)? This action cannot be undone.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowConfirmDelete(false)}
                className="flex-1 py-3 bg-slate-100 text-slate-700 font-bold rounded-xl text-xs hover:bg-slate-200 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="flex-1 py-3 bg-rose-600 text-white font-bold rounded-xl text-xs hover:bg-rose-700 transition shadow-md"
              >
                Yes, Withdraw
              </button>
            </div>
          </div>
        ) : (
          /* Form Body */
          <form onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto max-h-[75vh] text-xs leading-relaxed">
            {/* Crop Select */}
            <div>
              <label className="text-slate-700 font-semibold mb-1 flex items-center justify-between">
                <span>Crop Type</span>
                <button type="button" onClick={() => startVoiceInput('crop')} className="focus:outline-none">
                  {activeMicField === 'crop' ? (
                    <MicOff className="w-4 h-4 text-rose-400 animate-pulse" />
                  ) : (
                    <Mic className="w-4 h-4 text-emerald-700 opacity-80" />
                  )}
                </button>
              </label>
              <select
                value={form.crop}
                onChange={(e) => setForm({ ...form, crop: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 text-slate-800 border border-slate-200 font-semibold focus:outline-none focus:border-emerald-500"
              >
                <option value="Wheat">Wheat (गेहूं)</option>
                <option value="Rice">Rice (चावल)</option>
                <option value="Tomato">Tomato (टमाटर)</option>
                <option value="Potato">Potato (आलू)</option>
                <option value="Onion">Onion (प्याज़)</option>
                <option value="Cotton">Cotton (कपास)</option>
              </select>
            </div>

            {/* Quantity & Price */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-slate-700 font-semibold mb-1 flex items-center justify-between">
                  <span>Quantity (kg)</span>
                  <button type="button" onClick={() => startVoiceInput('quantity')} className="focus:outline-none">
                    {activeMicField === 'quantity' ? (
                      <MicOff className="w-4 h-4 text-rose-400 animate-pulse" />
                    ) : (
                      <Mic className="w-4 h-4 text-emerald-700 opacity-80" />
                    )}
                  </button>
                </label>
                <input
                  type="number"
                  value={form.quantity}
                  onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 text-slate-800 border border-slate-200 font-bold focus:outline-none focus:border-emerald-500"
                />
                {errors.quantity && <p className="text-[10px] text-rose-500 mt-1 font-semibold">{errors.quantity}</p>}
              </div>

              <div>
                <label className="text-slate-700 font-semibold mb-1 flex items-center justify-between">
                  <span>Price (₹/kg)</span>
                  <button type="button" onClick={() => startVoiceInput('price')} className="focus:outline-none">
                    {activeMicField === 'price' ? (
                      <MicOff className="w-4 h-4 text-rose-400 animate-pulse" />
                    ) : (
                      <Mic className="w-4 h-4 text-emerald-700 opacity-80" />
                    )}
                  </button>
                </label>
                <input
                  type="number"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 text-slate-800 border border-slate-200 font-bold focus:outline-none focus:border-emerald-500"
                />
                {errors.price && <p className="text-[10px] text-rose-500 mt-1 font-semibold">{errors.price}</p>}
              </div>
            </div>

            {/* Quality Grade */}
            <div>
              <label className="text-slate-700 font-semibold mb-1 block">Expected Quality Grade</label>
              <select
                value={form.qualityGrade}
                onChange={(e) => setForm({ ...form, qualityGrade: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 text-slate-800 border border-slate-200 font-semibold focus:outline-none focus:border-emerald-500"
              >
                <option value="Grade A">Grade A (Premium / &lt;10% Moisture)</option>
                <option value="Grade B">Grade B (Standard Market Quality)</option>
                <option value="Grade C">Grade C (Local Mandi Discounted)</option>
                <option value="Processing">Processing Grade (Industrial Batch)</option>
              </select>
            </div>

            {/* Harvest Ready Date */}
            <div>
              <label className="text-slate-700 font-semibold mb-1 block">Harvest Ready Date</label>
              <input
                type="date"
                value={form.harvestDate}
                onChange={(e) => setForm({ ...form, harvestDate: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 text-slate-800 border border-slate-200 font-semibold focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Pickup Location */}
            <div>
              <label className="text-slate-700 font-semibold mb-1 flex items-center justify-between">
                <span>Pickup Location</span>
                <button type="button" onClick={() => startVoiceInput('pickupLocation')} className="focus:outline-none">
                  {activeMicField === 'pickupLocation' ? (
                    <MicOff className="w-4 h-4 text-rose-400 animate-pulse" />
                  ) : (
                    <Mic className="w-4 h-4 text-emerald-700 opacity-80" />
                  )}
                </button>
              </label>
              <input
                type="text"
                value={form.pickupLocation}
                onChange={(e) => setForm({ ...form, pickupLocation: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 text-slate-800 border border-slate-200 font-semibold focus:outline-none focus:border-emerald-500"
              />
              {errors.pickupLocation && <p className="text-[10px] text-rose-500 mt-1 font-semibold">{errors.pickupLocation}</p>}
            </div>

            {/* Actions */}
            <div className="pt-3 border-t border-slate-200 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setShowConfirmDelete(true)}
                className="py-3 px-4 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold rounded-2xl border border-rose-200 text-xs transition flex items-center gap-1.5"
              >
                <Trash2 className="w-4 h-4" /> Withdraw
              </button>

              <button
                type="submit"
                className="flex-1 py-3 bg-emerald-800 hover:bg-emerald-900 text-white font-extrabold text-xs rounded-2xl shadow-lg transition"
              >
                Save Changes
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
