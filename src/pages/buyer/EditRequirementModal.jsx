import React, { useState } from 'react';
import { X, Save, Package, Calendar, MapPin, DollarSign, Tag, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function EditRequirementModal({ requirement, isOpen, onClose }) {
  const { updateRequirement } = useApp();

  if (!isOpen || !requirement) return null;

  const [formData, setFormData] = useState({
    crop: requirement.crop || 'Wheat',
    variety: requirement.variety || '',
    targetQty: requirement.targetQty || 100,
    unit: requirement.unit || 'quintal',
    indicativePrice: requirement.indicativePrice || '',
    deliveryLocation: typeof requirement.deliveryLocation === 'string' ? requirement.deliveryLocation : (requirement.deliveryLocation?.name || ''),
    neededByDate: requirement.neededByDate || new Date().toISOString().split('T')[0],
    urgency: requirement.urgency || '7days',
    minOfferQty: requirement.minOfferQty || 10,
    grade: requirement.grade || 'Grade A',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await updateRequirement(requirement.id, {
        crop: formData.crop,
        variety: formData.variety,
        targetQty: Number(formData.targetQty),
        unit: formData.unit,
        indicativePrice: formData.indicativePrice ? Number(formData.indicativePrice) : null,
        deliveryLocation: formData.deliveryLocation,
        neededByDate: formData.neededByDate,
        urgency: formData.urgency,
        minOfferQty: Number(formData.minOfferQty),
        grade: formData.grade,
      });
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const cropOptions = ['Wheat', 'Rice', 'Cotton', 'Tomato', 'Soybean', 'Gram', 'Potato', 'Onion', 'Maize', 'Mustard', 'Pulses'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden border border-slate-200 shadow-2xl space-y-0">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-100 px-6 py-4 border-b border-emerald-200 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
              <span>✏️</span> Edit Buying Requirement
            </h3>
            <p className="text-xs text-slate-600">Update target quantity, price, and delivery preferences</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white hover:bg-emerald-100 text-slate-700 flex items-center justify-center font-bold transition shadow-xs"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* Crop & Variety */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Crop (फसल)</label>
              <select
                value={formData.crop}
                onChange={(e) => setFormData({ ...formData, crop: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:border-emerald-500 outline-none bg-slate-50/50"
              >
                {cropOptions.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Variety / Grade</label>
              <input
                type="text"
                value={formData.variety}
                onChange={(e) => setFormData({ ...formData, variety: e.target.value })}
                placeholder="e.g. Sharbati / Grade A"
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:border-emerald-500 outline-none bg-slate-50/50"
              />
            </div>
          </div>

          {/* Target Qty & Unit */}
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                <Package className="w-3.5 h-3.5 text-emerald-600" /> Target Quantity (मांग मात्रा)
              </label>
              <input
                type="number"
                required
                min="1"
                value={formData.targetQty}
                onChange={(e) => setFormData({ ...formData, targetQty: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-bold focus:border-emerald-500 outline-none bg-slate-50/50"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Unit</label>
              <select
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-bold focus:border-emerald-500 outline-none bg-slate-50/50"
              >
                <option value="quintal">Quintals (क्विंटल)</option>
                <option value="kg">Kilograms (kg)</option>
                <option value="ton">Metric Tons (MT)</option>
              </select>
            </div>
          </div>

          {/* Indicative Price & Min Offer Qty */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                <DollarSign className="w-3.5 h-3.5 text-emerald-600" /> Indicative Price (₹/{formData.unit})
              </label>
              <input
                type="number"
                value={formData.indicativePrice}
                onChange={(e) => setFormData({ ...formData, indicativePrice: e.target.value })}
                placeholder="Target Buy Price"
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-emerald-800 focus:border-emerald-500 outline-none bg-slate-50/50"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Min Offer Qty</label>
              <input
                type="number"
                value={formData.minOfferQty}
                onChange={(e) => setFormData({ ...formData, minOfferQty: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:border-emerald-500 outline-none bg-slate-50/50"
              />
            </div>
          </div>

          {/* Delivery Location */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-rose-500" /> Delivery Depot / Mandi Location
            </label>
            <input
              type="text"
              required
              value={formData.deliveryLocation}
              onChange={(e) => setFormData({ ...formData, deliveryLocation: e.target.value })}
              placeholder="e.g. Sonipat APMC Hub / Processing Plant Address"
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:border-emerald-500 outline-none bg-slate-50/50"
            />
          </div>

          {/* Needed By Date & Urgency */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-blue-500" /> Needed By Date
              </label>
              <input
                type="date"
                required
                value={formData.neededByDate}
                onChange={(e) => setFormData({ ...formData, neededByDate: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:border-emerald-500 outline-none bg-slate-50/50"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Urgency</label>
              <select
                value={formData.urgency}
                onChange={(e) => setFormData({ ...formData, urgency: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:border-emerald-500 outline-none bg-slate-50/50"
              >
                <option value="urgent">Urgent (Immediate / 24 Hours)</option>
                <option value="3days">3 Days</option>
                <option value="7days">7 Days</option>
                <option value="15days">15 Days</option>
                <option value="30days">1 Month Contract</option>
              </select>
            </div>
          </div>

          {/* Submit / Cancel Buttons */}
          <div className="flex gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-4 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition disabled:opacity-50 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
