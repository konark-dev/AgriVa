import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Upload, AlertCircle } from 'lucide-react';

export default function RaiseDisputeModal({ entityId, entityType, lotId, onBack }) {
  const { raiseDispute } = useApp();
  const [reason, setReason] = useState('Quality Mismatch');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const reasons = [
    'Quality Mismatch',
    'Quantity Mismatch',
    'Non-Payment',
    'Non-Delivery',
    'Other'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const evidenceStr = file ? file.name : 'mock_evidence.jpg';
      const orderId = entityType === 'order' ? entityId : (entityType === 'listing' ? entityId : null);
      const deliveryId = entityType === 'delivery' ? entityId : null;
      await raiseDispute(orderId, deliveryId, lotId, reason, description, evidenceStr);
      onBack();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md p-6 relative shadow-xl">
        <button 
          onClick={onBack}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-red-100 rounded-full text-red-600">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">Raise a Dispute</h2>
            <p className="text-sm text-gray-500">For {entityType} #{entityId}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-[#2E7D32] focus:border-transparent outline-none bg-white"
            >
              {reasons.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Please provide details about the issue..."
              rows={4}
              className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-[#2E7D32] focus:border-transparent outline-none resize-none"
              required
            ></textarea>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Evidence (Optional)</label>
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:bg-gray-50 transition-colors">
              <input
                type="file"
                id="evidence-upload"
                className="hidden"
                onChange={(e) => setFile(e.target.files[0])}
              />
              <label htmlFor="evidence-upload" className="cursor-pointer flex flex-col items-center gap-2">
                <Upload className="w-6 h-6 text-gray-400" />
                <span className="text-sm text-gray-500">
                  {file ? file.name : 'Click to upload photo or document'}
                </span>
              </label>
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t mt-6">
            <button
              type="button"
              onClick={onBack}
              className="flex-1 py-2.5 px-4 rounded-xl border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-2.5 px-4 rounded-xl bg-[#2E7D32] text-white font-medium hover:bg-[#236026] transition-colors disabled:opacity-50"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Dispute'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
