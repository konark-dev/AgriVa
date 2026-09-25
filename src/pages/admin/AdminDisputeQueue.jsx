import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AlertTriangle, CheckCircle, Scale, ChevronDown, ChevronUp } from 'lucide-react';

export default function AdminDisputeQueue() {
  const { disputes, resolveDispute } = useApp();
  const [expandedId, setExpandedId] = useState(null);

  // States for resolution form
  const [resolutionAction, setResolutionAction] = useState('Full Refund');
  const [adjustmentAmount, setAdjustmentAmount] = useState('');

  // Fallback for missing/empty disputes
  const activeDisputes = disputes || [];

  if (activeDisputes.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-12 text-center border border-gray-200">
        <Scale className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-1">No Active Disputes</h3>
        <p className="text-gray-500">There are currently no disputes in the queue.</p>
      </div>
    );
  }

  const handleResolve = (disputeId) => {
    const amount = resolutionAction === 'Partial Adjustment' ? Number(adjustmentAmount) : null;
    resolveDispute(disputeId, 'Resolved by Admin', resolutionAction, amount);
    setExpandedId(null);
  };

  return (
    <div className="space-y-4">
      {activeDisputes.map((dispute) => {
        const isExpanded = expandedId === dispute.id;
        const isResolved = dispute.status === 'resolved' || dispute.status === 'closed';

        return (
          <div key={dispute.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
            {/* Header / Summary */}
            <div 
              className={`p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors ${isExpanded ? 'border-b border-gray-100' : ''}`}
              onClick={() => setExpandedId(isExpanded ? null : dispute.id)}
            >
              <div className="flex items-center gap-4">
                <div className={`p-2 rounded-lg ${isResolved ? 'bg-green-50 text-green-600' : 'bg-amber-50 text-amber-600'}`}>
                  {isResolved ? <CheckCircle className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-900">Dispute #{dispute.id?.toString().slice(0, 8) || 'N/A'}</span>
                    <span className="text-sm text-gray-500">•</span>
                    <span className="text-sm font-medium text-gray-700">{dispute.reason}</span>
                  </div>
                  <div className="text-sm text-gray-500 mt-0.5">
                    Raised by User #{dispute.raisedBy} for {dispute.entityType} #{dispute.entityId?.toString().slice(0,8)}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${
                  isResolved ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                }`}>
                  {isResolved ? 'Resolved' : 'Pending Review'}
                </span>
                {isExpanded ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
              </div>
            </div>

            {/* Expanded Content */}
            {isExpanded && (
              <div className="p-4 bg-gray-50">
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Dispute Details</h4>
                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <p className="text-sm text-gray-600">
                      <strong>Description:</strong> {dispute.description || 'No description provided.'}
                    </p>
                    {dispute.evidenceUrl && (
                      <p className="text-sm text-gray-600 mt-2">
                        <strong>Evidence:</strong> <a href="#" className="text-blue-600 underline">{dispute.evidenceUrl}</a>
                      </p>
                    )}
                    {dispute.lockedQuality && (
                      <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                        <p className="text-sm font-semibold text-green-800 mb-1">Locked Quality (From Lot)</p>
                        <p className="text-xs text-green-700">Grade: {dispute.lockedQuality.grade} (Score: {dispute.lockedQuality.totalScore})</p>
                        <p className="text-xs text-green-700">Moisture: {dispute.lockedQuality.moisture} | FM: {dispute.lockedQuality.foreignMatterPct}%</p>
                      </div>
                    )}
                    {dispute.lotImages && dispute.lotImages.length > 0 && (
                      <div className="mt-2">
                        <p className="text-sm font-semibold text-gray-700 mb-1">Lot Images:</p>
                        <div className="flex gap-2">
                           {dispute.lotImages.map((img, idx) => (
                             <img key={idx} src={img} alt="Lot Image" className="w-16 h-16 object-cover rounded-md border" />
                           ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {!isResolved ? (
                  <div className="bg-white p-4 rounded-lg border border-[#2E7D32]/20">
                    <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
                      <Scale className="w-4 h-4 text-[#2E7D32]" />
                      Resolution Panel
                    </h4>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Action</label>
                        <select
                          value={resolutionAction}
                          onChange={(e) => setResolutionAction(e.target.value)}
                          className="w-full md:w-1/2 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-[#2E7D32] focus:border-[#2E7D32] outline-none"
                        >
                          <option value="Full Refund">Full Refund</option>
                          <option value="Partial Adjustment">Partial Adjustment</option>
                          <option value="Reject Dispute">Reject Dispute</option>
                          <option value="Escalate">Escalate</option>
                        </select>
                      </div>

                      {resolutionAction === 'Partial Adjustment' && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Adjustment Amount (₹)</label>
                          <input
                            type="number"
                            value={adjustmentAmount}
                            onChange={(e) => setAdjustmentAmount(e.target.value)}
                            className="w-full md:w-1/2 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-[#2E7D32] focus:border-[#2E7D32] outline-none"
                            placeholder="Enter amount"
                          />
                        </div>
                      )}

                      <div className="pt-2">
                        <button
                          onClick={() => handleResolve(dispute.id)}
                          className="bg-[#2E7D32] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#236026] transition-colors"
                        >
                          Resolve Dispute
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <h4 className="text-sm font-medium text-green-900 mb-1">Resolution Summary</h4>
                    <p className="text-sm text-green-700">
                      <strong>Action Taken:</strong> {dispute.resolution?.action || dispute.resolutionAction || 'Unknown'}
                    </p>
                    {dispute.resolution?.amount && (
                      <p className="text-sm text-green-700">
                        <strong>Amount Adjusted:</strong> ₹{dispute.resolution.amount}
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
