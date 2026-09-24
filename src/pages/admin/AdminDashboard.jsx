import ProfileHeader from '../../components/ProfileHeader';
import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import EmptyState from '../../components/EmptyState';
import { 
  ShieldCheck, 
  Check, 
  X, 
  FileText, 
  AlertCircle, 
  Building2, 
  Store, 
  Truck, 
  BadgeAlert, 
  FlaskConical,
  Users,
  Search,
  ExternalLink,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Info,
  AlertOctagon
} from 'lucide-react';

export default function AdminDashboard() {
  const { 
    fpoApprovals, 
    approveFpo, 
    rejectFpo,
    bulkBuyerApprovals, 
    approveBulkBuyer, 
    rejectBulkBuyer,
    flaggedRegistrations,
    resolveFlaggedRegistration,
    suspendedTransporters,
    reinstateTransporter,
    suspendTransporter,
    labRegistrations, 
    approveLabRegistration, 
    rejectLabRegistration,
    registeredUsers,
    disputes,
    resolveDispute
  } = useApp();

  const [activeTab, setActiveTab] = useState('fpo'); // fpo | bulk | flagged | logistics | labs
  const [rejectionModal, setRejectionModal] = useState(null); // { type, item }
  const [rejectReason, setRejectReason] = useState('');

  const pendingFpos = fpoApprovals.filter(f => f.status === 'pending');
  const pendingBulkBuyers = bulkBuyerApprovals.filter(b => b.status === 'pending');
  const pendingFlagged = flaggedRegistrations.filter(f => f.status === 'flagged_review');
  const pendingLabs = labRegistrations.filter(l => l.verificationStatus === 'pending');

  const handleOpenReject = (type, item) => {
    setRejectionModal({ type, item });
    setRejectReason(
      type === 'fpo' ? 'CIN not found in Ministry of Corporate Affairs (MCA) database' :
      type === 'bulk' ? 'GSTIN verification failed or tax compliance record invalid' :
      type === 'lab' ? 'NABL Accreditation certificate expired or unverified' :
      'Identity documentation mismatch'
    );
  };

  const handleConfirmReject = (e) => {
    e.preventDefault();
    if (!rejectionModal) return;
    const { type, item } = rejectionModal;

    if (type === 'fpo') rejectFpo(item.id, rejectReason);
    else if (type === 'bulk') rejectBulkBuyer(item.id, rejectReason);
    else if (type === 'lab') rejectLabRegistration(item.id, rejectReason);
    else if (type === 'flagged') resolveFlaggedRegistration(item.id, 'block', rejectReason);

    setRejectionModal(null);
  };

  return (
    <div className="space-y-5 p-4 pb-24 font-sans text-slate-800">
      <ProfileHeader />

      {/* Header & Platform Governance Banner */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-bold mb-2">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              <span>प्लेटफ़ॉर्म ऑपरेटर सुपरविजन (Platform Operator Supervision)</span>
            </div>
            <h1 className="text-xl font-extrabold text-slate-900">Actor Verification & Governance Console</h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Strict platform rule: Admin accounts are database-provisioned only. Manages FPO, Bulk Buyer, Driver & Aadhaar queues.
            </p>
          </div>
          <div className="flex items-center space-x-2 text-xs font-bold text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
            <span>कुल पंजीकृत अभिनेता:</span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-600 text-white font-mono">{registeredUsers.length}</span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex overflow-x-auto gap-2 pt-4 border-t border-slate-100 mt-4 text-xs font-bold">
          <button
            onClick={() => setActiveTab('fpo')}
            className={`px-3.5 py-2 rounded-xl flex items-center space-x-1.5 whitespace-nowrap transition ${
              activeTab === 'fpo' 
                ? 'bg-blue-600 text-white shadow-sm' 
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>FPO सत्यापन ({pendingFpos.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('bulk')}
            className={`px-3.5 py-2 rounded-xl flex items-center space-x-1.5 whitespace-nowrap transition ${
              activeTab === 'bulk' 
                ? 'bg-amber-600 text-white shadow-sm' 
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Store className="w-3.5 h-3.5" />
            <span>थोक खरीदार (Bulk) ({pendingBulkBuyers.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('flagged')}
            className={`px-3.5 py-2 rounded-xl flex items-center space-x-1.5 whitespace-nowrap transition ${
              activeTab === 'flagged' 
                ? 'bg-rose-600 text-white shadow-sm' 
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <BadgeAlert className="w-3.5 h-3.5" />
            <span>ध्वजांकित ID (Flagged) ({pendingFlagged.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('logistics')}
            className={`px-3.5 py-2 rounded-xl flex items-center space-x-1.5 whitespace-nowrap transition ${
              activeTab === 'logistics' 
                ? 'bg-indigo-600 text-white shadow-sm' 
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Truck className="w-3.5 h-3.5" />
            <span>लॉजिस्टिक्स सस्पेंशन ({suspendedTransporters.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('labs')}
            className={`px-3.5 py-2 rounded-xl flex items-center space-x-1.5 whitespace-nowrap transition ${
              activeTab === 'labs' 
                ? 'bg-cyan-600 text-white shadow-sm' 
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <FlaskConical className="w-3.5 h-3.5" />
            <span>NABL 🧪 , ({pendingLabs.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('disputes')}
            className={`px-3.5 py-2 rounded-xl flex items-center space-x-1.5 whitespace-nowrap transition ${
              activeTab === 'disputes' 
                ? 'bg-rose-600 text-white shadow-sm' 
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <AlertOctagon className="w-3.5 h-3.5" />
            <span>Disputes ({disputes.filter(d => d.liability === 'unresolved').length})</span>
          </button>
        </div>
      </div>

      {/* ---------------- 1. FPO QUEUE ---------------- */}
      {activeTab === 'fpo' && (
        <div className="space-y-3">
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-900 flex items-start">
            <Info className="w-4 h-4 text-blue-700 mr-2 shrink-0 mt-0.5" />
            <div>
              <strong>FPO Verification Gate Rationale:</strong> CIN format check is mandatory under Companies Act 2013 / State Cooperative law. In live production, cross-checked against MCA public database; demo uses this manual Admin-approval queue. Duplicate registration numbers are blocked at validation.
            </div>
          </div>

          {pendingFpos.length === 0 ? (
            <EmptyState title="No Pending FPO Approvals" description="All submitted FPO registrations have been audited against MCA criteria." />
          ) : (
            pendingFpos.map(fpo => (
              <div key={fpo.id} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3 text-xs">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                  <div>
                    <span className="font-mono text-[10px] bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-bold">
                      {fpo.type || 'CIN (Companies Act 2013)'}
                    </span>
                    <h3 className="font-extrabold text-base text-slate-900 mt-1">{fpo.fpoName}</h3>
                    <p className="text-slate-500 font-mono">Reg #: {fpo.registrationNumber}</p>
                    <p className="text-slate-600 mt-1">📍 {fpo.address}</p>
                  </div>
                  <div className="text-right">
                    <span className="px-2.5 py-1 bg-amber-100 text-amber-800 border border-amber-300 font-bold rounded-full text-[10px]">
                      Pending MCA Review
                    </span>
                    <p className="text-[10px] text-slate-500 mt-1">सदस्य किसान: {fpo.memberCount}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <div>
                    <span className="text-slate-500 block text-[10px]">अधिकृत संपर्क:</span>
                    <span className="font-bold text-slate-800">{fpo.contactPerson} ({fpo.phone})</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">फसलें (Crops Handled):</span>
                    <span className="font-bold text-slate-800">{Array.isArray(fpo.cropsHandled) ? fpo.cropsHandled.join(', ') : fpo.cropsHandled}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">मंडी क्षेत्राधिकार:</span>
                    <span className="font-bold text-slate-800">{fpo.mandiJurisdiction}</span>
                  </div>
                </div>

                <div className="flex space-x-2 pt-1">
                  <button
                    onClick={() => handleOpenReject('fpo', fpo)}
                    className="flex-1 py-2.5 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold flex items-center justify-center space-x-1"
                  >
                    <X className="w-4 h-4" />
                    <span>अस्वीकार (Reject)</span>
                  </button>
                  <button
                    onClick={() => approveFpo(fpo.id)}
                    className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow flex items-center justify-center space-x-1"
                  >
                    <Check className="w-4 h-4" />
                    <span>सत्यापित व सक्रिय करें (Approve FPO ✅)</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* ---------------- 2. BULK BUYER QUEUE ---------------- */}
      {activeTab === 'bulk' && (
        <div className="space-y-3">
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start">
            <Info className="w-4 h-4 text-amber-700 mr-2 shrink-0 mt-0.5" />
            <div>
              <strong>Bulk Buyer Verification Gate:</strong> Bulk buyers require the same <code>Pending → Admin Verified → Active</code> gate as FPOs because bulk volumes create high escrow and tax-compliance exposure. MVP payment terms are restricted to <em>Upfront Only</em>.
            </div>
          </div>

          {pendingBulkBuyers.length === 0 ? (
            <EmptyState title="No Pending Bulk Buyer Approvals" description="All wholesale buyer and mill registrations have been verified." />
          ) : (
            pendingBulkBuyers.map(buyer => (
              <div key={buyer.id} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3 text-xs">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                  <div>
                    <h3 className="font-extrabold text-base text-slate-900">{buyer.businessName}</h3>
                    <p className="text-slate-600 font-mono font-bold text-xs mt-0.5">GSTIN: {buyer.gstin}</p>
                    <p className="text-slate-500 mt-1">📍 {buyer.businessAddress}</p>
                  </div>
                  <span className="px-2.5 py-1 bg-amber-100 text-amber-800 border border-amber-300 font-bold rounded-full text-[10px] shrink-0 self-start">
                    Pending Escrow/Tax Gate
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <div>
                    <span className="text-slate-500 block text-[10px]">अधिकृत प्रतिनिधि:</span>
                    <span className="font-bold text-slate-800">{buyer.contactPerson} ({buyer.phone})</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">भुगतान शर्तें (MVP Rule):</span>
                    <span className="font-bold text-emerald-800">{buyer.paymentTerms || 'Upfront Only (MVP Scope)'}</span>
                  </div>
                </div>

                <div className="flex space-x-2 pt-1">
                  <button
                    onClick={() => handleOpenReject('bulk', buyer)}
                    className="flex-1 py-2.5 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold flex items-center justify-center space-x-1"
                  >
                    <X className="w-4 h-4" />
                    <span>अस्वीकार (Reject)</span>
                  </button>
                  <button
                    onClick={() => approveBulkBuyer(buyer.id)}
                    className="flex-1 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold shadow flex items-center justify-center space-x-1"
                  >
                    <Check className="w-4 h-4" />
                    <span>सत्यापित करें (Approve Bulk Buyer ✅)</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* ---------------- 3. FLAGGED DUPLICATE IDENTITIES ---------------- */}
      {activeTab === 'flagged' && (
        <div className="space-y-3">
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-900 flex items-start">
            <AlertTriangle className="w-4 h-4 text-rose-700 mr-2 shrink-0 mt-0.5" />
            <div>
              <strong>DPDP Act 2023 Identity Flagging Rule:</strong> When the same Aadhaar or Driving License is submitted under a different phone number already on file, the system NEVER auto-accepts or auto-rejects; it holds the registration in this manual investigation queue.
            </div>
          </div>

          {pendingFlagged.length === 0 ? (
            <EmptyState title="No Flagged Registrations" description="No duplicate Aadhaar or cross-phone identity conflicts detected." />
          ) : (
            pendingFlagged.map(flag => (
              <div key={flag.id} className="bg-white rounded-2xl p-5 border border-rose-200 shadow-sm space-y-3 text-xs">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="font-mono text-[10px] bg-rose-100 text-rose-800 px-2 py-0.5 rounded font-bold">
                      {flag.ruleTriggered || 'DPDP Identity Flag'}
                    </span>
                    <h3 className="font-extrabold text-base text-slate-900 mt-1">{flag.name}</h3>
                    <p className="text-slate-600 font-bold">फोन: {flag.phone}</p>
                    {flag.aadhaarMasked && <p className="text-slate-500 font-mono">मास्क्ड आधार: {flag.aadhaarMasked}</p>}
                    {flag.dlNumber && <p className="text-slate-500 font-mono">लाइसेंस संख्या: {flag.dlNumber}</p>}
                  </div>
                  <span className="px-2.5 py-1 bg-rose-100 text-rose-800 border border-rose-300 font-bold rounded-full text-[10px]">
                    Action Required
                  </span>
                </div>

                <div className="p-3 bg-rose-50/50 rounded-xl border border-rose-100 text-rose-900">
                  <strong>ध्वजांकन कारण:</strong> {flag.flagReason}
                </div>

                <div className="flex space-x-2 pt-1">
                  <button
                    onClick={() => handleOpenReject('flagged', flag)}
                    className="flex-1 py-2.5 rounded-xl border border-rose-300 bg-rose-600 hover:bg-rose-700 text-white font-bold flex items-center justify-center space-x-1 shadow"
                  >
                    <X className="w-4 h-4" />
                    <span>ब्लॉक करें (Block Fraud Duplicate)</span>
                  </button>
                  <button
                    onClick={() => resolveFlaggedRegistration(flag.id, 'approve', 'Phone number update verified via physical call')}
                    className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow flex items-center justify-center space-x-1"
                  >
                    <Check className="w-4 h-4" />
                    <span>पुष्टि करें व अनुमति दें (Verify & Clear)</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* ---------------- 4. LOGISTICS & SUSPENDED QUEUE ---------------- */}
      {activeTab === 'logistics' && (
        <div className="space-y-3">
          <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-xl text-xs text-indigo-900 flex items-start">
            <Info className="w-4 h-4 text-indigo-700 mr-2 shrink-0 mt-0.5" />
            <div>
              <strong>Logistics Governance & Perishable Protection:</strong> Delivery delays and cooling failures directly cause agricultural spoilage (the target problem of this PS). Transporters with accumulated complaints are auto-suspended pending inspection rather than permanently banned.
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">सस्पेंड किए गए ट्रांसपोर्टर / वाहन</h3>
            {suspendedTransporters.length === 0 ? (
              <EmptyState title="No Suspended Transporters" description="All drivers and fleet aggregators are operating in active good standing." />
            ) : (
              suspendedTransporters.map(trans => (
                <div key={trans.id} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3 text-xs">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-extrabold text-base text-slate-900">{trans.name}</h4>
                      <p className="text-slate-500">वाहन RC: <span className="font-mono font-bold text-slate-800">{trans.vehicleReg}</span></p>
                      <p className="text-slate-500">फोन: {trans.phone}</p>
                    </div>
                    <span className="px-2.5 py-1 bg-rose-100 text-rose-800 border border-rose-300 font-bold rounded-full text-[10px]">
                      SUSPENDED (Auto-gated)
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                    <p className="text-slate-700"><strong>निलंबन कारण:</strong> {trans.reason}</p>
                    {trans.reviewActionRequired && (
                      <p className="text-indigo-900 font-medium"><strong>समीक्षा शर्त:</strong> {trans.reviewActionRequired}</p>
                    )}
                  </div>

                  <div className="flex space-x-2 pt-1">
                    <button
                      onClick={() => reinstateTransporter(trans.id || trans.transporterId)}
                      className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow flex items-center justify-center space-x-1"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>निरीक्षण पश्चात बहाल करें (Reinstate Driver Active)</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ---------------- 5. NABL QUALITY TESTING LABS ---------------- */}
      {activeTab === 'labs' && (
        <div className="space-y-3">
          <div className="p-3 rounded-2xl bg-cyan-50 border border-cyan-200 text-cyan-950 text-xs leading-relaxed">
            🛡️ <strong>Quality Checker Gate:</strong> Admin verification ensures unverified accounts cannot fake certified lab status, preserving marketplace trust for farmers & bulk buyers.
          </div>

          {pendingLabs.length === 0 ? (
            <EmptyState title="No Pending Lab Approvals" description="All Quality Checker lab registrations have been reviewed." />
          ) : (
            pendingLabs.map(lab => (
              <div key={lab.id} className="bg-white rounded-2xl p-5 border border-slate-200 space-y-3 shadow-sm text-xs">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">{lab.labName}</h4>
                    <p className="text-slate-600">Location: {lab.location}</p>
                    <p className="text-slate-500 font-mono">NABL #: {lab.certificateNumber}</p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 border border-amber-300 font-bold text-[10px]">
                    Pending NABL Verification
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center space-x-2 text-slate-600">
                  <FileText className="w-4 h-4 text-cyan-700 shrink-0" />
                  <span className="truncate">Accreditation Document: {lab.documentUrl || 'NABL_Certificate_2026.pdf'}</span>
                </div>

                <div className="flex items-center space-x-2 pt-1">
                  <button
                    onClick={() => handleOpenReject('lab', lab)}
                    className="flex-1 py-2 rounded-xl bg-rose-50 text-rose-700 border border-rose-200 font-bold flex items-center justify-center space-x-1"
                  >
                    <X className="w-4 h-4" />
                    <span>Reject</span>
                  </button>
                  <button
                    onClick={() => approveLabRegistration(lab.id)}
                    className="flex-1 py-2 rounded-xl bg-cyan-700 hover:bg-cyan-800 text-white font-bold shadow flex items-center justify-center space-x-1"
                  >
                    <Check className="w-4 h-4" />
                    <span>Approve Lab ✅</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* ---------------- 6. DISPUTES QUEUE ---------------- */}
      {activeTab === 'disputes' && (
        <div className="space-y-3">
          <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-950 text-xs leading-relaxed">
            <strong>Disputes Resolution Center:</strong> Admin can intervene on contested deliveries (quantity shortages, quality spoilage, etc.) to void payments or uphold transactions based on offline investigation.
          </div>

          {disputes.length === 0 ? (
            <EmptyState title="No Active Disputes" description="All deliveries are proceeding smoothly." />
          ) : (
            disputes.map(disp => (
              <div key={disp.id} className="bg-white rounded-2xl p-5 border border-slate-200 space-y-3 shadow-sm text-xs">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">Dispute #{disp.id}</h4>
                    <p className="text-slate-600">Order ID: {disp.orderId}</p>
                    <p className="text-slate-500 font-bold capitalize text-rose-600 mt-1">Issue: {disp.category.replace('_', ' ')}</p>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full border font-bold text-[10px] ${
                    disp.liability === 'unresolved' ? 'bg-amber-100 text-amber-800 border-amber-300' : 'bg-emerald-100 text-emerald-800 border-emerald-300'
                  }`}>
                    {disp.liability === 'unresolved' ? 'Action Required' : 'Resolved'}
                  </span>
                </div>

                {disp.liability === 'unresolved' ? (
                  <div className="pt-2 border-t border-slate-200 flex flex-col space-y-2">
                    <div className="font-bold text-slate-600 mb-1">Admin Action:</div>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => resolveDispute(disp.id, 'farmer', 'full_void')}
                        className="py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold flex flex-col items-center justify-center space-x-1"
                      >
                        <span>At Fault: Farmer</span>
                        <span className="text-[10px] font-normal opacity-80">Full Void & Refund</span>
                      </button>
                      <button
                        onClick={() => resolveDispute(disp.id, 'logistics_partner', 'partial_capture')}
                        className="py-2.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 font-bold flex flex-col items-center justify-center space-x-1"
                      >
                        <span>At Fault: Transporter</span>
                        <span className="text-[10px] font-normal opacity-80">Partial Refund</span>
                      </button>
                    </div>
                    <button
                      onClick={() => resolveDispute(disp.id, 'buyer_false_claim', 'contested_upheld')}
                      className="w-full py-2.5 rounded-xl bg-[#1B5E20] hover:bg-green-800 text-white font-bold"
                    >
                      Uphold Transaction (Release Funds)
                    </button>
                  </div>
                ) : (
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 text-[10px]">
                    <strong>Resolution:</strong> {disp.resolution} (Fault: {disp.liability})
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* Rejection Reason Modal */}
      {rejectionModal && (
        <div className="fixed inset-0 z-50 bg-white backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleConfirmReject} className="bg-white rounded-2xl w-full max-w-md p-5 space-y-4 shadow-2xl text-xs">
            <div className="flex items-center space-x-2 text-rose-700">
              <AlertCircle className="w-5 h-5" />
              <h3 className="font-extrabold text-base text-slate-900">अस्वीकृति पुष्टि (Confirm Rejection)</h3>
            </div>
            
            <div>
              <label className="text-slate-700 font-bold mb-1 block">अस्वीकृति का वैधानिक कारण (Required Reason):</label>
              <textarea
                rows={3}
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 text-slate-900 font-medium focus:outline-none focus:border-rose-500"
                required
              />
            </div>

            <div className="flex space-x-2 pt-2">
              <button 
                type="button" 
                onClick={() => setRejectionModal(null)} 
                className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
              >
                रद्द करें / Cancel
              </button>
              <button 
                type="submit" 
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold shadow"
              >
                अस्वीकृति दर्ज करें / Confirm
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
