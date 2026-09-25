import ProfileHeader from '../../components/ProfileHeader';
import InspectorVerificationScreen from '../../components/InspectorVerificationScreen';
import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import EmptyState from '../../components/EmptyState';
import { Microchip, ShieldCheck, AlertCircle, FileCheck, Clock, CheckCircle2, ArrowRight } from 'lucide-react';

export default function LabDashboard() {
  const { labRegistrations, currentUser, submitQualityLabTest, labCertificates, deliveries, farmerLots, submitInspectorVerification } = useApp();
  const [activeTab, setActiveTab] = useState('tests');
  const [inspectingLot, setInspectingLot] = useState(null);

  const currentLabReg = labRegistrations.find(l => l.userId === currentUser.uid) || {
    id: "lab-reg-1",
    userId: currentUser.uid,
    labName: currentUser.labName || "AgriCert Quality Labs",
    verificationStatus: "approved" // pending | approved | rejected
  };

  const [testForm, setTestForm] = useState({
    deliveryId: 'del-301',
    crop: 'Onion',
    moisturePct: '12.5',
    foreignMatterPct: '1.2',
    grainGrade: 'Grade A'
  });

  const [latestCert, setLatestCert] = useState(null);

  const handleTestSubmit = async (e) => {
    e.preventDefault();
    const cert = await submitQualityLabTest(
      testForm.deliveryId,
      testForm.crop,
      testForm.moisturePct,
      testForm.foreignMatterPct,
      testForm.grainGrade
    );
    setLatestCert(cert);
  };

  // IF LAB REGISTRATION IS PENDING VERIFICATION: SHOW CLEAR WAITING SCREEN
  if (currentLabReg.verificationStatus === 'pending') {
    return (
      <div className="bg-white border border-slate-200 rounded-3xl p-6 text-center space-y-4 my-8 shadow-2xl">
      <ProfileHeader />

        <div className="w-16 h-16 rounded-full bg-amber-950/80 border border-amber-800 flex items-center justify-center mx-auto text-amber-400">
          <Clock className="w-8 h-8 animate-spin" style={{ animationDuration: '4s' }} />
        </div>
        <div className="space-y-1">
          <h3 className="text-base font-bold text-slate-800">Lab Verification Pending Admin Approval</h3>
          <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
            Your laboratory registration for <strong className="text-white">{currentLabReg.labName}</strong> is under review by AgriVa Admin.
          </p>
        </div>
        <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-800/60 text-amber-300 text-xs font-semibold">
          🛡️ Testing dashboard unlocks automatically once approved by Admin.
        </div>
      </div>
    );
  }

  // IF REJECTED:
  if (currentLabReg.verificationStatus === 'rejected') {
    return (
      <div className="bg-white border border-rose-800/60 rounded-3xl p-6 text-center space-y-4 my-8 shadow-2xl">
        <div className="w-16 h-16 rounded-full bg-rose-950 border border-rose-800 flex items-center justify-center mx-auto text-rose-400">
          <AlertCircle className="w-8 h-8" />
        </div>
        <div className="space-y-1">
          <h3 className="text-base font-bold text-rose-300">Registration Rejected</h3>
          <p className="text-xs text-slate-600">Reason: {currentLabReg.rejectionReason || 'Invalid NABL certificate document'}</p>
        </div>
        <button className="btn-touch px-4 py-2 rounded-xl bg-[#2E7D32] text-white text-xs font-bold">
          Resubmit Registration Documents
        </button>
      </div>
    );
  }

  // APPROVED LAB DASHBOARD
  if (inspectingLot) {
    return <InspectorVerificationScreen lot={inspectingLot} onBack={() => setInspectingLot(null)} onSubmitVerification={(lotId, data) => { submitInspectorVerification(lotId, data); setInspectingLot(null); }} />;
  }

  return (
    <div className="space-y-4 p-4 pb-24 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-800 flex items-center space-x-2">
            <Microchip className="w-5 h-5 text-[#2E7D32]" />
            <span>Quality Verification Dashboard</span>
          </h2>
          <p className="text-xs text-slate-500">{currentLabReg.labName} ? Verified Lab</p>
        </div>
      </div>

      <div className="flex border-b border-slate-200 space-x-4 mb-4">
        <button onClick={() => setActiveTab('tests')} className={`py-2 text-sm font-bold ` + (activeTab === 'tests' ? 'text-[#2E7D32] border-b-2 border-[#2E7D32]' : 'text-slate-500')}>Lab Tests</button>
        <button onClick={() => setActiveTab('inspections')} className={`py-2 text-sm font-bold ` + (activeTab === 'inspections' ? 'text-[#2E7D32] border-b-2 border-[#2E7D32]' : 'text-slate-500')}>Physical Inspections</button>
      </div>

      {activeTab === 'tests' && (
        <div className="space-y-4">

      {/* Test Entry Form */}
      <form onSubmit={handleTestSubmit} className="bg-white rounded-2xl p-4 border border-slate-200 space-y-3 text-xs shadow-md">
        <h3 className="font-bold text-sm text-slate-800 flex items-center space-x-1.5 border-b border-slate-200 pb-2">
          <FileCheck className="w-4 h-4 text-[#2E7D32]" />
          <span>Enter Sample Quality Test Results</span>
        </h3>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-slate-600 font-semibold mb-1 block">Listing ID / Delivery ID</label>
            <input
              type="text"
              value={testForm.deliveryId}
              onChange={(e) => setTestForm({ ...testForm, deliveryId: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 text-slate-700 border border-slate-200 text-slate-800 font-bold"
            />
          </div>
          <div>
            <label className="text-slate-600 font-semibold mb-1 block">Crop Type</label>
            <select
              value={testForm.crop}
              onChange={(e) => setTestForm({ ...testForm, crop: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 text-slate-700 border border-slate-200 text-slate-800 font-bold"
            >
              <option value="Wheat">Wheat</option>
              <option value="Rice">Rice</option>
              <option value="Tomato">Tomato</option>
              <option value="Potato">Potato</option>
              <option value="Onion">Onion</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <div>
            <label className="text-slate-600 font-semibold mb-1 block">Moisture %</label>
            <input
              type="number"
              step="0.1"
              value={testForm.moisturePct}
              onChange={(e) => setTestForm({ ...testForm, moisturePct: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 text-slate-700 border border-slate-200 text-slate-800 font-bold"
            />
          </div>
          <div>
            <label className="text-slate-600 font-semibold mb-1 block">Foreign %</label>
            <input
              type="number"
              step="0.1"
              value={testForm.foreignMatterPct}
              onChange={(e) => setTestForm({ ...testForm, foreignMatterPct: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 text-slate-700 border border-slate-200 text-slate-800 font-bold"
            />
          </div>
          <div>
            <label className="text-slate-600 font-semibold mb-1 block">Grain Grade</label>
            <select
              value={testForm.grainGrade}
              onChange={(e) => setTestForm({ ...testForm, grainGrade: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 text-slate-700 border border-slate-200 text-slate-800 font-bold"
            >
              <option value="Grade A">Grade A</option>
              <option value="Grade B">Grade B</option>
              <option value="Grade C">Grade C</option>
            </select>
          </div>
        </div>

        <button type="submit" className="w-full btn-touch py-2.5 rounded-xl bg-[#2E7D32] text-white text-xs font-bold shadow">
          Run Threshold Auto-Comparison & Issue Certificate
        </button>
      </form>

      {/* Generated Certificate Display */}
      {latestCert && (
        <div className="bg-white border border-emerald-700 rounded-2xl p-4 space-y-3 text-xs shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <h4 className="font-bold text-[#2E7D32] flex items-center space-x-1">
              <CheckCircle2 className="w-4 h-4" />
              <span>Digital Quality Certificate Issued</span>
            </h4>
            <span className="text-[10px] text-slate-500">{latestCert.id}</span>
          </div>

          <div className="space-y-1 text-slate-600">
            <div>Status: <strong className={latestCert.isVerified ? 'text-[#2E7D32]' : 'text-amber-400'}>{latestCert.status}</strong></div>
            <div>Moisture: {latestCert.moisturePct}% | Foreign Matter: {latestCert.foreignMatterPct}%</div>
            <div>Grade: {latestCert.grainGrade}</div>
            <p className="text-[11px] text-slate-500 italic mt-1">{latestCert.notes}</p>
          </div>
        </div>
      )}
      </div>
      )}

        {activeTab === 'inspections' && (
          <div className="space-y-4">
            {farmerLots.filter(l => l.status === 'pending_grading' || l.status === 'active_listed').length === 0 ? (
              <EmptyState title="No Pending Inspections" description="There are no lots waiting for physical verification." />
            ) : (
              farmerLots.filter(l => l.status === 'pending_grading' || l.status === 'active_listed').map(lot => (
                <div key={lot.id} className="bg-white rounded-2xl p-4 border border-slate-200 shadow-md">
                  <div className="flex justify-between items-center border-b border-slate-200 pb-2 mb-3">
                    <div>
                      <h4 className="font-bold text-sm text-[#2E7D32]">Lot #{lot.id}</h4>
                      <p className="text-xs text-slate-500">{lot.crop} - {lot.quantity} kg</p>
                    </div>
                    <span className="bg-amber-100 text-amber-700 text-[10px] font-bold px-2 py-1 rounded-full">Pending</span>
                  </div>
                  <button onClick={() => setInspectingLot(lot)} className="w-full py-2 bg-slate-100 hover:bg-emerald-50 hover:text-[#2E7D32] text-slate-700 text-xs font-bold rounded-xl border border-slate-200 transition-colors">
                    Perform Physical Verification
                  </button>
                </div>
              ))
            )}
          </div>
        )}
    </div>
  );
}

