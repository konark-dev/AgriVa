import ProfileHeader from '../../components/ProfileHeader';
import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ArrowLeft, ShieldCheck, FileText, CheckCircle, Info, 
  Calendar, Activity, ChevronRight, Download, Users, 
  TrendingUp, IndianRupee, PieChart, CreditCard, Banknote, 
  List, MapPin, Search, AlertCircle, Building, Check, History
} from 'lucide-react';

export default function LenderDashboard() {
  const { loans, currentUser } = useApp();
  const [activeView, setActiveView] = useState('dashboard');
  const [selectedLoan, setSelectedLoan] = useState(null);

  const safeLoans = loans || [];

  const handleReviewClick = (loan) => {
    setSelectedLoan(loan);
    setActiveView('application_review');
  };

  const renderDashboard = () => (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-slate-800 flex items-center">
          <IndianRupee className="w-5 h-5 mr-2 text-emerald-700" />
          Agricultural Credit Console
        </h1>
        <p className="text-xs text-slate-500 mt-1">Real-time credit underwriting • e-NAM verified receivables</p>
      </div>

      {/* Stats Grid - 2x3 clean mobile layout */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-3.5">
          <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Loan Requests</p>
          <div className="flex items-end justify-between mt-1.5">
            <span className="text-2xl font-black text-slate-800">24</span>
            <span className="text-[9px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-md font-bold border border-amber-200">+4 this week</span>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-3.5">
          <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Under Review</p>
          <span className="text-2xl font-black text-slate-800 mt-1.5 block">11</span>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-3.5">
          <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Approved</p>
          <span className="text-2xl font-black text-emerald-700 mt-1.5 block">8</span>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-3.5">
          <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Disbursed</p>
          <span className="text-2xl font-black text-slate-800 mt-1.5 block">37</span>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-3.5">
          <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Outstanding Portfolio</p>
          <span className="text-2xl font-black text-slate-800 mt-1.5 block">₹18.4L</span>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-3.5">
          <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Active Borrowers</p>
          <span className="text-2xl font-black text-slate-800 mt-1.5 block">126</span>
        </div>
      </div>

      {/* Loan Requests Queue */}
      <div>
        <h2 className="text-sm font-bold text-slate-800 mb-3 flex items-center">
          <List className="w-4 h-4 mr-2 text-amber-600" />
          High Priority Loan Requests
        </h2>
        <div className="space-y-3">
          {safeLoans.length > 0 ? safeLoans.map(loan => (
            <div key={loan.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
              {/* Borrower name + ID */}
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-slate-800">{loan.borrowerName || 'Jaipur Fresh Growers FPO'}</h3>
                <span className="text-[9px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded font-mono border border-slate-200">
                  {loan.registrationId || 'KST-RJ-3029'}
                </span>
              </div>

              {/* Key details in 2-column grid */}
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <p className="text-[9px] text-slate-400 uppercase tracking-wider font-bold">Credit Requested</p>
                  <p className="text-sm font-bold text-slate-800 mt-0.5">₹{loan.amount || '5,00,000'}</p>
                </div>
                <div>
                  <p className="text-[9px] text-slate-400 uppercase tracking-wider font-bold">Receivable Collateral</p>
                  <p className="text-sm font-bold text-emerald-700 mt-0.5">₹{loan.activeBuyerOrdersValue || '2,70,000'}</p>
                </div>
                <div>
                  <p className="text-[9px] text-slate-400 uppercase tracking-wider font-bold">Purpose & Commodity</p>
                  <p className="text-xs font-medium text-slate-700 mt-0.5">{loan.purpose || 'Tomato Harvest, Packing & Cold Transit'}</p>
                </div>
                <div>
                  <p className="text-[9px] text-slate-400 uppercase tracking-wider font-bold">Track Record</p>
                  <div className="flex items-center mt-0.5 space-x-1.5">
                    <span className="text-xs font-medium text-slate-700">42 Orders</span>
                    <span className="text-[9px] bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded font-bold border border-emerald-200">98%</span>
                  </div>
                </div>
              </div>

              {/* Review Button */}
              <button 
                onClick={() => handleReviewClick(loan)}
                className="w-full py-2.5 bg-[#1B5E20] hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-sm flex items-center justify-center transition-colors"
              >
                Review Application
                <ChevronRight className="w-3.5 h-3.5 ml-1.5" />
              </button>
            </div>
          )) : (
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-8 text-center text-sm text-slate-500">
              No loan requests currently in queue.
            </div>
          )}
        </div>
      </div>
    </div>
  );




  const renderApplicationReview = () => (
    <div className="space-y-6">
      <button 
        onClick={() => setActiveView('dashboard')}
        className="flex items-center text-gray-600 hover:text-gray-900 mb-4 transition-colors font-medium"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Dashboard
      </button>

      <div className="mb-2">
        <h1 className="text-2xl font-bold text-gray-900">Underwriting Desk / Loan Application Review</h1>
      </div>

      <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center text-green-800 mb-6 shadow-sm">
        <ShieldCheck className="w-6 h-6 mr-3 text-green-600" />
        <div>
          <h3 className="font-bold text-green-900">Platform Verification Passed (Risk Score: 88/100)</h3>
          <p className="text-sm">Comprehensive platform check completed successfully.</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center border-b pb-2">
            <Building className="w-5 h-5 mr-2 text-gray-500" />
            Borrower Profile
          </h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Name</span>
              <span className="font-semibold text-gray-900">{selectedLoan?.borrowerName || 'Jaipur Fresh Growers FPO'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Registration ID</span>
              <span className="font-mono text-gray-900">{selectedLoan?.registrationId || 'REG-99238'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Location</span>
              <span className="font-medium text-gray-900">Jaipur, Rajasthan</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Member Farmers</span>
              <span className="font-medium text-gray-900">450+</span>
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center border-b pb-2">
            <Banknote className="w-5 h-5 mr-2 text-gray-500" />
            Requested Credit Facility
          </h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Amount</span>
              <span className="font-bold text-lg text-gray-900">₹{selectedLoan?.amount || '5,00,000'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Facility Type</span>
              <span className="font-medium text-gray-900">Working Capital</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Purpose</span>
              <span className="font-medium text-gray-900">{selectedLoan?.purpose || 'Input Procurement'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Tenure</span>
              <span className="font-medium text-gray-900">6 Months</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center border-b pb-2">
            <TrendingUp className="w-5 h-5 mr-2 text-gray-500" />
            Active Buyer Orders (Collateral)
          </h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Linked POs</span>
              <span className="font-medium text-gray-900">3 Verified Orders</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Expected Contract Receivables</span>
              <span className="font-bold text-green-700 text-lg">₹{selectedLoan?.activeBuyerOrdersValue || '2,70,000'}</span>
            </div>
            <div className="mt-4 bg-slate-50 p-3 rounded-lg border border-slate-100">
              <p className="text-xs text-gray-600">These confirmed future receivables serve as dynamic collateral, verified directly through the platform's order system.</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center border-b pb-2">
            <FileText className="w-5 h-5 mr-2 text-gray-500" />
            Verified Platform Documents Checklist
          </h2>
          <ul className="space-y-3 text-sm">
            <li className="flex items-center text-gray-800">
              <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
              <span>FPO Registration Certificate</span>
            </li>
            <li className="flex items-center text-gray-800">
              <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
              <span>Bank Details Verification (Penny Drop)</span>
            </li>
            <li className="flex items-center text-gray-800">
              <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
              <span>Platform Transaction History Ledger</span>
            </li>
            <li className="flex items-center text-gray-800">
              <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
              <span>Confirmed Buyer Purchases Contracts</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start text-amber-900 mb-8 shadow-sm">
        <AlertCircle className="w-5 h-5 mr-3 text-amber-600 mt-0.5 flex-shrink-0" />
        <div>
          <h3 className="font-bold text-amber-900 mb-1">Escrow Recourse Protection Active</h3>
          <p className="text-sm">Repayments for this credit facility will be automatically deducted from the incoming settlements of the linked buyer orders via the platform's secure trade escrow.</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-end gap-4 border-t pt-6 border-slate-200">
        <button className="px-6 py-2.5 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 font-medium transition-colors">
          Reject
        </button>
        <button className="px-6 py-2.5 rounded-xl border border-slate-300 text-gray-700 hover:bg-slate-50 font-medium transition-colors">
          Request More Info
        </button>
        <button 
          onClick={() => setActiveView('activity_assessment')}
          className="px-6 py-2.5 rounded-xl bg-[#1B5E20] text-white hover:bg-green-900 font-medium transition-colors shadow-sm flex items-center"
        >
          Approve Loan / ऋण स्वीकृत करें
          <ChevronRight className="w-4 h-4 ml-2" />
        </button>
      </div>
    </div>
  );

  const renderActivityAssessment = () => (
    <div className="space-y-6">
      <button 
        onClick={() => setActiveView('application_review')}
        className="flex items-center text-gray-600 hover:text-gray-900 mb-4 transition-colors font-medium"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Application Review
      </button>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Platform Activity Assessment</h1>
        <p className="text-gray-500 mt-1">Transparent Operational Assessment for {selectedLoan?.borrowerName || 'Jaipur Fresh Growers FPO'}</p>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden mb-6">
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-200">
          <h2 className="text-lg font-bold text-gray-900 flex items-center">
            <Activity className="w-5 h-5 mr-2 text-indigo-600" />
            Platform Activity Metrics
          </h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
              <p className="text-sm text-gray-500 mb-1 font-medium">Completed Orders</p>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">42</h3>
              <p className="text-xs text-green-600 font-medium flex items-center"><Check className="w-3 h-3 mr-1" />100% verified digital weighment slips</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
              <p className="text-sm text-gray-500 mb-1 font-medium">On-time Deliveries</p>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">39</h3>
              <p className="text-xs text-blue-600 font-medium">92.8% punctuality rate</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
              <p className="text-sm text-gray-500 mb-1 font-medium">Cancelled Orders</p>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">2</h3>
              <p className="text-xs text-gray-500 font-medium">Industry average: 5</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
              <p className="text-sm text-gray-500 mb-1 font-medium">Active Buyer Orders</p>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">3</h3>
              <p className="text-xs text-amber-600 font-medium">Committed value: ₹2,70,000</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
              <p className="text-sm text-gray-500 mb-1 font-medium">Lifetime Platform GMV</p>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">₹18,40,000</h3>
              <p className="text-xs text-gray-500 font-medium">Over last 18 months</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
              <p className="text-sm text-gray-500 mb-1 font-medium">Quality Disputes Raised</p>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">1</h3>
              <p className="text-xs text-green-600 font-medium">Resolved in favor of FPO</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm text-center">
          <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
            <List className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-gray-900 text-sm mb-1">Transaction History</h3>
          <p className="text-xs text-gray-500">Continuously verified ledger data from e-NAM</p>
          <div className="mt-3 inline-flex items-center bg-green-50 text-green-700 px-2.5 py-1 rounded-md text-xs font-semibold border border-green-200">
            <CheckCircle className="w-3 h-3 mr-1" /> Verified Strong
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm text-center">
          <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-gray-900 text-sm mb-1">Documents & KYC</h3>
          <p className="text-xs text-gray-500">Digitally signed and centrally validated</p>
          <div className="mt-3 inline-flex items-center bg-green-50 text-green-700 px-2.5 py-1 rounded-md text-xs font-semibold border border-green-200">
            <CheckCircle className="w-3 h-3 mr-1" /> Fully Compliant
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm text-center">
          <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mx-auto mb-3">
            <Users className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-gray-900 text-sm mb-1">Buyer Counterparty Quality</h3>
          <p className="text-xs text-gray-500">Analysis of linked buyers' payment history</p>
          <div className="mt-3 inline-flex items-center bg-green-50 text-green-700 px-2.5 py-1 rounded-md text-xs font-semibold border border-green-200">
            <CheckCircle className="w-3 h-3 mr-1" /> High Grade Buyers
          </div>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start text-blue-900 mb-8 shadow-sm">
        <Info className="w-5 h-5 mr-3 text-blue-600 mt-0.5 flex-shrink-0" />
        <div>
          <h3 className="font-bold text-blue-900 mb-1">Notice of Institutional Impartiality</h3>
          <p className="text-sm text-blue-800">These metrics are generated automatically from immutable platform data. The platform acts as a neutral technology layer and does not guarantee the performance of any specific loan asset.</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-end gap-4 border-t pt-6 border-slate-200">
        <button className="px-6 py-2.5 rounded-xl border border-slate-300 text-gray-700 hover:bg-slate-50 font-medium transition-colors">
          View Full Transaction Ledger
        </button>
        <button 
          onClick={() => setActiveView('repayment_schedule')}
          className="px-6 py-2.5 rounded-xl bg-[#1B5E20] text-white hover:bg-green-900 font-medium transition-colors shadow-sm flex items-center"
        >
          Proceed to Sanction / ऋण स्वीकृति जारी करें
          <ChevronRight className="w-4 h-4 ml-2" />
        </button>
      </div>
    </div>
  );

  const renderRepaymentSchedule = () => (
    <div className="space-y-6">
      <button 
        onClick={() => setActiveView('activity_assessment')}
        className="flex items-center text-gray-600 hover:text-gray-900 mb-4 transition-colors font-medium"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Activity Assessment
      </button>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Loan Repayment & Schedule</h1>
        <p className="text-gray-500 mt-1">Management console for active sanctioned facility</p>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 mb-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-100 pb-5 mb-5">
          <div>
            <span className="inline-block px-3 py-1 bg-green-100 text-green-800 text-xs font-bold rounded-full mb-2 border border-green-200">ACTIVE SANCTION</span>
            <h2 className="text-xl font-bold text-gray-900">NABARD Refinance Facility</h2>
            <p className="text-sm text-gray-500 font-medium mt-1">Borrower: {selectedLoan?.borrowerName || 'Jaipur Fresh Growers FPO'}</p>
          </div>
          <div className="mt-4 md:mt-0 text-left md:text-right">
            <p className="text-sm text-gray-500 font-medium">Sanction Date</p>
            <p className="font-bold text-gray-900">12 Sep 2024</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
            <p className="text-sm text-gray-500 mb-1 font-medium">Facility Info</p>
            <p className="font-bold text-gray-900 mb-1">Working Capital Credit Line</p>
            <p className="text-xs text-gray-600">Revolving facility linked to receivables</p>
          </div>
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
            <p className="text-sm text-gray-500 mb-1 font-medium">Institutional Collateral</p>
            <p className="font-bold text-gray-900 mb-1">Trade Escrow & CGTMSE</p>
            <p className="text-xs text-gray-600">Dual-layer protection</p>
          </div>
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
            <p className="text-sm text-gray-500 mb-1 font-medium">Total Sanctioned Limit</p>
            <p className="font-bold text-gray-900 text-lg mb-1">₹{selectedLoan?.amount || '5,00,000'}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-slate-50 p-6 rounded-xl border border-slate-100">
          <div>
            <div className="flex justify-between items-end mb-2">
              <div>
                <p className="text-sm text-gray-500 font-medium mb-1">Outstanding Principal</p>
                <h3 className="text-3xl font-bold text-gray-900">₹3,20,000</h3>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500 font-medium mb-1">Total Repaid</p>
                <p className="text-lg font-bold text-green-600">₹1,80,000</p>
              </div>
            </div>
            
            <div className="mt-4">
              <div className="flex justify-between text-xs font-medium text-gray-600 mb-1">
                <span>Loan Clearance Progress</span>
                <span>36% Cleared</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2.5">
                <div className="bg-green-600 h-2.5 rounded-full" style={{ width: '36%' }}></div>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-5 rounded-xl border border-orange-200 shadow-sm">
            <div className="flex items-center text-orange-600 mb-2">
              <Calendar className="w-5 h-5 mr-2" />
              <span className="font-bold text-sm uppercase tracking-wider">Next Installment Due</span>
            </div>
            <h4 className="text-2xl font-bold text-gray-900 mb-1">₹45,000</h4>
            <p className="text-sm text-gray-500 font-medium mb-3">Due by 15 Oct 2024</p>
            <div className="bg-orange-50 px-3 py-2 rounded-lg border border-orange-100">
              <p className="text-xs text-orange-800 font-medium">Automatic deduction scheduled from upcoming Escrow settlement.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-6">
        <div className="md:col-span-2 bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="bg-slate-50 px-6 py-4 border-b border-slate-200">
            <h2 className="text-lg font-bold text-gray-900 flex items-center">
              <History className="w-5 h-5 mr-2 text-gray-500" />
              Repayment History Log
            </h2>
          </div>
          <div className="divide-y divide-slate-100">
            <div className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 mr-4">
                  <CheckCircle className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-sm">₹45,000</p>
                  <p className="text-xs text-gray-500">15 Sep 2024 • Paid via Escrow</p>
                </div>
              </div>
              <span className="px-2.5 py-1 text-xs font-semibold bg-green-100 text-green-800 rounded-md">Successful</span>
            </div>
            <div className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 mr-4">
                  <CheckCircle className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-sm">₹45,000</p>
                  <p className="text-xs text-gray-500">15 Aug 2024 • Paid via Bank Mandate e-NACH</p>
                </div>
              </div>
              <span className="px-2.5 py-1 text-xs font-semibold bg-green-100 text-green-800 rounded-md">Successful</span>
            </div>
            <div className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 mr-4">
                  <CheckCircle className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-sm">₹45,000</p>
                  <p className="text-xs text-gray-500">15 Jul 2024 • Paid via Escrow</p>
                </div>
              </div>
              <span className="px-2.5 py-1 text-xs font-semibold bg-green-100 text-green-800 rounded-md">Successful</span>
            </div>
            <div className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 mr-4">
                  <CheckCircle className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-sm">₹45,000</p>
                  <p className="text-xs text-gray-500">15 Jun 2024 • Paid via Escrow</p>
                </div>
              </div>
              <span className="px-2.5 py-1 text-xs font-semibold bg-green-100 text-green-800 rounded-md">Successful</span>
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 self-start">
          <div className="flex items-center justify-center w-12 h-12 bg-amber-100 text-amber-600 rounded-full mb-4">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-gray-900 mb-2">Automated Trade Escrow Recourse</h3>
          <p className="text-sm text-gray-600 mb-4">This facility is secured by a dynamic lien on platform receivables.</p>
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
            <p className="text-xs font-bold text-amber-900 mb-1">Direct Escrow Recourse Setup</p>
            <p className="text-sm text-amber-800">15% of in-bound trade proceeds automatically routed to loan account upon settlement.</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-end gap-4 border-t pt-6 border-slate-200">
        <button className="px-6 py-2.5 rounded-xl border border-slate-300 text-gray-700 hover:bg-slate-50 font-medium transition-colors flex items-center justify-center">
          <Download className="w-4 h-4 mr-2" />
          Download No-Dues Statement
        </button>
        <button className="px-6 py-2.5 rounded-xl bg-[#F57F17] text-white hover:bg-orange-600 font-medium transition-colors shadow-sm">
          Pay Now / तुरंत भुगतान करें
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f9f8f3] p-4 pb-24 max-w-4xl mx-auto">
      <ProfileHeader />

      <div>
        {activeView === 'dashboard' && renderDashboard()}
        {activeView === 'application_review' && renderApplicationReview()}
        {activeView === 'activity_assessment' && renderActivityAssessment()}
        {activeView === 'repayment_schedule' && renderRepaymentSchedule()}
      </div>
    </div>
  );
}
