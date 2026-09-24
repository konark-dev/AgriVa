import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Tractor, 
  Volume2, 
  VolumeX,
  Check, 
  ArrowRight, 
  MessageSquare, 
  Phone, 
  ShieldCheck, 
  MapPin, 
  Mic, 
  MicOff,
  Store, 
  Scale, 
  ArrowLeft,
  Truck,
  Building2,
  ShoppingCart,
  FlaskConical,
  AlertTriangle,
  Info,
  CheckCircle2,
  FileText,
  BadgeAlert
} from 'lucide-react';
import { auth } from '../../firebase/config';
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { 
  validateAadhaarVerhoeff, 
  maskAadhaar, 
  validateFpoRegistrationNumber, 
  validateGstin, 
  validateDrivingLicense, 
  validateVehicleRc 
} from '../../utils/verificationEngine';
import { initSpeechRecognition, speakText, stopSpeaking } from '../../utils/speechUtils';
import { narrateScreen, parseVoiceToFields } from '../../services/aiService';

export default function Onboarding({ onComplete }) {
  const { registerUser, switchRole, triggerToast, registeredUsers, language, setLanguage } = useApp();
  
  const [step, setStep] = useState('language'); // language | phone | otp | role | profile | status
  const [selectedLang, setSelectedLang] = useState(language || 'hi');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [cooldown, setCooldown] = useState(30);
  const [selectedRole, setSelectedRole] = useState('farmer'); // farmer | fpo | consumer | bulk_buyer | transporter | mandi | lab

  const [confirmationResult, setConfirmationResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isNarrating, setIsNarrating] = useState(false);
  const [isVoiceInputActive, setIsVoiceInputActive] = useState(false);
  const [activeVoiceField, setActiveVoiceField] = useState(null);
  const recognitionRef = useRef(null);

  // Form State Per Actor
  const [formData, setFormData] = useState({
    // Common
    name: 'Ramesh Kumar',
    phone: '',
    address: 'Village Murthal, GT Road, Sonipat, Haryana',
    state: 'Haryana',
    district: 'Sonipat',
    bankAccount: 'SBI-XXXX-8921',
    upiId: 'ramesh@sbi',

    // Individual Farmer
    aadhaarNumber: '999988887779', // Valid Verhoeff checksum
    farmLocationGps: { lat: 28.9931, lng: 77.0151 },
    landProofNumber: 'KHASRA-HR-2024-112',
    fpoAffiliation: 'Sonipat Kisan Agro FPO',

    // FPO
    registrationNumber: 'U01409HR2021PTC095123',
    memberCount: 350,
    contactPerson: 'Rajinder Singh',
    cropsHandled: ['Wheat', 'Paddy', 'Mustard'],
    mandiJurisdiction: 'Sonipat APMC & Azadpur Sub-yard',

    // Consumer (Retail Buyer)
    deliveryAddress: 'Flat 402, Green Valley Apts, Rohini Sec 14, Delhi - 110085',
    paymentMethod: 'UPI / Razorpay Escrow (Tokenized)',

    // Bulk Buyer
    buyerTier: 'retailer',
    businessName: 'AgroCorp Bulk Traders Pvt Ltd',
    gstin: '07AAAAA0000A1Z5',
    authorizedContact: 'Vikram Singhania',
    paymentTerms: 'Upfront Only (MVP Scope)',

    // Logistics
    transporterType: 'individual', // individual | aggregator
    dlNumber: 'HR-1020180045612',
    vehicleReg: 'HR-10-AB-1234',
    vehicleType: 'Pickup (2.5 Ton)',
    capacityKg: 2500,
    serviceArea: 'Delhi-NCR, Sonipat, Panipat',
    fleetSize: 15,
    aggregateVehicleTypes: '8x Pickups, 7x 5-Ton Trucks',
    apiIntegrationEnabled: true
  });

  const [validationErrors, setValidationErrors] = useState({});
  const [submissionResult, setSubmissionResult] = useState(null);

  // Design Tokens
  const bgMain = "bg-[#f9f8f3]";
  const textDark = "text-[#1d1d1b]";
  const primaryGreen = "bg-[#185c25]";
  const textGreen = "text-[#185c25]";
  const borderGreen = "border-[#185c25]";
  const accentOrange = "bg-[#f57c00]";
  const textOrange = "text-[#f57c00]";

  // Handle Speech Recognition for voice dictation
  const startFieldVoiceInput = (fieldName) => {
    setActiveVoiceField(fieldName);
    setIsVoiceInputActive(true);
    triggerToast(`Listening for ${fieldName}... Speak now`, "Voice Input Active", "info");

    const rec = initSpeechRecognition(
      (transcript) => {
        if (fieldName === 'phone') {
          // Keep only digits for phone number
          const digits = transcript.replace(/\D/g, '').slice(0, 10);
          setPhone(digits);
        } else {
          handleFormChange(fieldName, transcript);
        }
        setIsVoiceInputActive(false);
        setActiveVoiceField(null);
        triggerToast(`Captured: "${transcript}"`, "Voice Recorded", "success");
      },
      (err) => {
        console.warn("Field speech error:", err);
        setIsVoiceInputActive(false);
        setActiveVoiceField(null);
      },
      () => {
        setIsVoiceInputActive(false);
        setActiveVoiceField(null);
      },
      selectedLang === 'hi' ? 'hi-IN' : 'en-IN'
    );

    if (rec) {
      try { rec.start(); } catch (e) { console.warn(e); }
    }
  };

  const startFullFormVoiceInput = () => {
    setIsVoiceInputActive(true);
    triggerToast("सुन रहे हैं... अपना पूरा विवरण बोलें (जैसे: मेरा नाम रमेश है, आधार नंबर...)", "AI Listening", "info");

    const rec = initSpeechRecognition(
      async (transcript) => {
        setIsVoiceInputActive(false);
        triggerToast("AI द्वारा जानकारी निकाली जा रही है...", "Processing", "info");
        try {
          const parsed = await parseVoiceToFields(transcript, selectedRole);
          setFormData(prev => ({ ...prev, ...parsed }));
          triggerToast("फॉर्म भर दिया गया है / Form auto-filled!", "Success", "success");
        } catch (error) {
          triggerToast("आवाज़ स्पष्ट नहीं थी, कृपया दोबारा प्रयास करें।", "Error", "error");
        }
      },
      (err) => {
        console.warn("Full form speech error:", err);
        setIsVoiceInputActive(false);
      },
      () => setIsVoiceInputActive(false),
      selectedLang === 'hi' ? 'hi-IN' : 'en-IN'
    );

    if (rec) {
      try { rec.start(); } catch (e) { console.warn(e); }
    }
  };

  // Screen Narration Toggle
  const handleToggleNarration = () => {
    if (isNarrating) {
      stopSpeaking();
      setIsNarrating(false);
    } else {
      setIsNarrating(true);
      const textToSpeak = narrateScreen(step, selectedLang);
      speakText(textToSpeak, selectedLang === 'hi' ? 'hi-IN' : 'en-IN', () => {
        setIsNarrating(false);
      });
    }
  };

  // Setup RecaptchaVerifier only when on the phone step
  useEffect(() => {
    if (step !== 'phone') return;
    // Wait for DOM to be ready
    const timer = setTimeout(() => {
      try {
        if (!window.recaptchaVerifier && document.getElementById('recaptcha-container')) {
          window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
            size: 'invisible',
            callback: () => {},
            'expired-callback': () => {
              triggerToast("Recaptcha expired, please try again", "Error", "error");
            }
          });
        }
      } catch (err) {
        console.warn('[Onboarding] RecaptchaVerifier init failed:', err.message);
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [step]);

  // Handle OTP Input
  const handleOtpChange = (element, index) => {
    if (isNaN(element.value)) return;
    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);

    if (element.nextSibling && element.value) {
      element.nextSibling.focus();
    }
  };

  const handleSendOtp = async () => {
    if (phone.length < 10) return;
    setIsLoading(true);
    setErrorMsg('');
    try {
      const formattedPhone = `+91${phone}`;
      const appVerifier = window.recaptchaVerifier;
      const confirmation = await signInWithPhoneNumber(auth, formattedPhone, appVerifier);
      setConfirmationResult(confirmation);
      setStep('otp');
      setCooldown(30);
      triggerToast("OTP Sent Successfully via SMS!", "Success", "success");
    } catch (error) {
      console.warn("SMS error, auto-activating demo verification mode:", error.message);
      setErrorMsg('');
      setOtp(['1', '2', '3', '4', '5', '6']);
      setStep('otp');
      triggerToast("Demo Mode: Auto-filled OTP with 123456", "Demo Mode", "info");
    }
    setIsLoading(false);
  };

  const handleVerifyOtp = async () => {
    const otpCode = otp.join('');
    if (otpCode.length !== 6) {
      setErrorMsg("कृपया 6-अंकीय OTP दर्ज करें / Please enter 6-digit OTP");
      return;
    }
    
    setIsLoading(true);
    setErrorMsg('');
    try {
      if (confirmationResult) {
        await confirmationResult.confirm(otpCode);
        triggerToast("Phone verified successfully!", "Success", "success");
      }
      setStep('role');
    } catch (error) {
      console.error("OTP verify error", error);
      setErrorMsg("अमान्य OTP। डेमो मोड में 123456 उपयोग करें। / Invalid OTP. In demo mode, use 123456.");
    }
    setIsLoading(false);
  };

  const handleFormChange = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
    // Clear field validation error
    if (validationErrors[key]) {
      setValidationErrors(prev => ({ ...prev, [key]: null }));
    }
  };

  // Submit Profile Registration with Verification Rules
  const handleProfileSubmit = async (e) => {
    if (e) e.preventDefault();
    setIsLoading(true);
    setValidationErrors({});
    setErrorMsg('');

    const payload = {
      role: selectedRole === 'bulk_buyer' ? 'buyer' : selectedRole,
      isFpo: selectedRole === 'fpo',
      phone: phone || formData.phone || '+91 98765 43210',
      ...formData
    };

    // Specific field adjustments
    if (selectedRole === 'bulk_buyer') {
      payload.buyerType = 'bulk';
      payload.buyerTier = formData.buyerTier || 'bulk'; // bulk | retailer
      payload.name = formData.businessName;
    } else if (selectedRole === 'consumer') {
      payload.buyerType = 'retail';
    } else if (selectedRole === 'fpo') {
      payload.role = 'fpo';
    }

    try {
      const result = await Promise.race([
        registerUser(payload),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Connection timeout. Please try again or use Demo Mode.')), 10000))
      ]);
      
      setIsLoading(false);

      if (!result.success) {
        setErrorMsg(result.error);
        return;
      }

      setSubmissionResult(result);
      setStep('status');
    } catch (error) {
      setIsLoading(false);
      setErrorMsg(error.message || "An error occurred during registration. Please check your connection.");
    }
  };

  const handleNext = () => {
    if (step === 'language') {
      setLanguage(selectedLang);
      setStep('phone');
    } else if (step === 'phone') {
      handleSendOtp();
    } else if (step === 'otp') {
      handleVerifyOtp();
    } else if (step === 'role') {
      setStep('profile');
    } else if (step === 'profile') {
      handleProfileSubmit();
    } else if (step === 'status') {
      if (onComplete) onComplete();
    }
  };

  const handleBack = () => {
    setErrorMsg('');
    if (step === 'phone') setStep('language');
    else if (step === 'otp') setStep('phone');
    else if (step === 'role') setStep('otp');
    else if (step === 'profile') setStep('role');
    else if (step === 'status') setStep('profile');
  };

  // ----------------------------------------------------
  // STEP 1: Language Selection
  // ----------------------------------------------------
  const renderLanguageStep = () => {
    const languages = [
      { id: 'hi', symbol: 'अ', label: 'हिंदी', sub: 'Hindi' },
      { id: 'en', symbol: 'A', label: 'English', sub: 'अंग्रेज़ी' },
      { id: 'pa', symbol: 'ਪੰ', label: 'ਪੰਜਾਬੀ', sub: 'Punjabi' },
      { id: 'mr', symbol: 'म', label: 'मराठी', sub: 'Marathi' },
      { id: 'gu', symbol: 'ગુ', label: 'ગુજરાતી', sub: 'Gujarati' },
      { id: 'bn', symbol: 'ব', label: 'বাংলা', sub: 'Bengali' },
      { id: 'te', symbol: 'తె', label: 'తెలుగు', sub: 'Telugu' },
      { id: 'ta', symbol: 'த', label: 'தமிழ்', sub: 'Tamil' },
    ];

    return (
      <div className={`flex flex-col min-h-screen ${bgMain} font-sans`}>
        <div className="flex items-center justify-between p-4 bg-white/70 border-b border-slate-200">
          <div className="flex items-center space-x-2">
            <Tractor className={`w-6 h-6 ${textGreen}`} />
            <h1 className="text-xl font-bold text-slate-800">AgriVa <span className="text-xs font-normal text-slate-500">| एग्रीवा</span></h1>
          </div>
          <button 
            onClick={handleToggleNarration}
            className={`px-4 py-1.5 rounded-full ${isNarrating ? 'bg-amber-600' : accentOrange} text-white font-medium text-xs flex items-center shadow-sm transition`}
          >
            {isNarrating ? <VolumeX className="w-3.5 h-3.5 mr-1" /> : <Volume2 className="w-3.5 h-3.5 mr-1" />}
            {isNarrating ? 'रोकें / Stop' : 'बोल कर सुनें'}
          </button>
        </div>

        <div className="px-4 flex-1 pb-24 mt-4">
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm mb-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">अपनी भाषा चुनें</p>
                <h2 className="text-xl font-extrabold text-slate-800">Choose Your Language</h2>
              </div>
              <div className="w-10 h-10 bg-emerald-50 text-emerald-800 rounded-full flex items-center justify-center font-bold">
                A/अ
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {languages.map(lang => (
              <button 
                key={lang.id}
                onClick={() => setSelectedLang(lang.id)}
                className={`relative flex flex-col items-start p-4 rounded-2xl border-2 transition-all bg-white shadow-sm ${
                  selectedLang === lang.id ? `${borderGreen} ring-2 ring-[#185c25]/20` : 'border-slate-200'
                }`}
              >
                <div className="flex justify-between w-full mb-2">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-lg font-bold text-slate-700">
                    {lang.symbol}
                  </div>
                  {selectedLang === lang.id ? (
                    <div className={`w-6 h-6 rounded-full ${primaryGreen} flex items-center justify-center text-white`}>
                      <Check className="w-3.5 h-3.5" />
                    </div>
                  ) : (
                    <div className="w-6 h-6 rounded-full border-2 border-slate-200"></div>
                  )}
                </div>
                <p className={`font-bold text-base ${textDark}`}>{lang.label}</p>
                <p className="text-xs text-slate-500 font-medium">{lang.sub}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Fixed Bottom CTA */}
        <div className="fixed bottom-0 left-0 w-full p-4 bg-gradient-to-t from-[#f9f8f3] via-[#f9f8f3] to-transparent">
          <button 
            onClick={handleNext}
            className={`w-full py-4 rounded-xl ${primaryGreen} text-white font-bold text-base flex items-center justify-center shadow-lg transition-transform active:scale-98`}
          >
            <span>आगे बढ़ें / Continue</span>
            <ArrowRight className="w-5 h-5 ml-2" />
          </button>
        </div>
      </div>
    );
  };

  // ----------------------------------------------------
  // STEP 2: Phone Number Input
  // ----------------------------------------------------
  const renderPhoneStep = () => {
    return (
      <div className={`flex flex-col min-h-screen ${bgMain} font-sans`}>
        <div className="flex items-center justify-between p-4 bg-white/80 border-b border-slate-100">
          <div className="flex items-center font-bold text-lg text-slate-800">
             <ArrowLeft onClick={handleBack} className="w-5 h-5 mr-2 cursor-pointer" />
             AgriVa
          </div>
          <button 
            onClick={handleToggleNarration}
            className={`px-3 py-1.5 rounded-full border border-orange-400 ${textOrange} bg-orange-50 font-medium text-xs flex items-center`}
          >
            <Volume2 className="w-3.5 h-3.5 mr-1" />
            बोल कर सुनें
          </button>
        </div>

        <div className="px-4 pb-28 space-y-5 mt-4">
          <div>
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">चरण 1/3 ⬢ मोबाइल सत्यापन</span>
            <h2 className="text-2xl font-extrabold text-slate-900 mt-1">अपना मोबाइल नंबर दर्ज करें,</h2>
            <p className="text-xs text-slate-500 mt-1">सुरक्षा e-KYC के लिए 6-अंक का OTP भेजा जाएगा</p>
          </div>

          {errorMsg && (
             <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-xl text-xs font-bold flex items-center">
                <AlertTriangle className="w-4 h-4 mr-2 shrink-0" />
                {errorMsg}
             </div>
          )}

          <div className="flex items-center space-x-3">
             <div className="flex-1 bg-white border-2 border-slate-200 rounded-2xl flex items-center p-2 focus-within:border-[#185c25] transition-colors shadow-sm h-14">
                <div className="flex items-center px-3 bg-slate-50 rounded-xl py-1.5 font-bold text-slate-700 text-sm border border-slate-200 mr-2">
                   🇮🇳 +91
                </div>
                <input 
                  type="tel"
                  placeholder="98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  className="w-full h-full bg-transparent text-xl font-bold text-slate-800 placeholder-slate-300 focus:outline-none tracking-wider"
                  maxLength={10}
                />
             </div>
             <button 
               onClick={() => startFieldVoiceInput('phone')}
               className={`w-14 h-14 rounded-2xl ${isVoiceInputActive && activeVoiceField === 'phone' ? 'bg-rose-600 animate-pulse' : primaryGreen} text-white flex flex-col items-center justify-center shadow shrink-0`}
             >
                <Mic className="w-5 h-5 mb-0.5" />
                <span className="text-[9px] font-bold">बोलें</span>
             </button>
          </div>

          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-start text-xs text-emerald-900">
             <ShieldCheck className="w-5 h-5 text-emerald-700 mr-2 shrink-0 mt-0.5" />
             <div>
                <strong className="block font-bold">DPDP अधिनियम 2023 के तहत 100% सुरक्षित</strong>
                <span>आपका नंबर केवल कृषि व्यापार दर्ज करने व सत्यापन के लिए उपयोग किया जाता है, कोई भी तीसरा पक्ष इसे एक्सेस नहीं कर सकता।</span>
             </div>
          </div>
        </div>

        <div id="recaptcha-container"></div>
        <div className="fixed bottom-0 left-0 w-full p-4 bg-gradient-to-t from-[#f9f8f3] via-[#f9f8f3] to-transparent text-center">
           <button 
              onClick={handleNext}
              disabled={phone.length < 10 || isLoading}
              className={`w-full py-4 rounded-xl ${phone.length >= 10 && !isLoading ? primaryGreen : 'bg-slate-300'} text-white font-bold text-base flex items-center justify-center shadow-lg transition-colors`}
           >
              <Phone className="w-5 h-5 mr-2" />
              <span>{isLoading ? 'भेज रहा है... / Sending...' : 'मोबाइल OTP प्राप्त करें / Get OTP'}</span>
              {!isLoading && <ArrowRight className="w-5 h-5 ml-2" />}
           </button>
           <button
              type="button"
              onClick={() => {
                setPhone('9876543210');
                setOtp(['1', '2', '3', '4', '5', '6']);
                setStep('role');
              }}
              className="mt-2 text-xs font-bold text-[#185c25] hover:underline flex items-center justify-center mx-auto py-1"
           >
              ⚡ त्वरित डेमो प्रवेश (बिना SMS) / Instant Demo Access
           </button>
        </div>
      </div>
    );
  };

  // ----------------------------------------------------
  // STEP 3: OTP Verification
  // ----------------------------------------------------
  const renderOtpStep = () => {
    return (
      <div className={`flex flex-col min-h-screen ${bgMain} font-sans`}>
        <div className="flex items-center justify-between p-4 bg-white/80 border-b border-slate-100">
          <div className="flex items-center font-bold text-lg text-slate-800">
             <ArrowLeft onClick={handleBack} className="w-5 h-5 mr-2 cursor-pointer" />
             AgriVa
          </div>
          <button 
            onClick={handleToggleNarration}
            className={`px-3 py-1.5 rounded-full border border-orange-400 ${textOrange} bg-orange-50 font-medium text-xs flex items-center`}
          >
            <Volume2 className="w-3.5 h-3.5 mr-1" />
            बोल कर सुनें
          </button>
        </div>

        <div className="px-4 pb-28 space-y-4 mt-4">
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
            <span className="text-xs font-bold text-emerald-800">चरण 2/3 ⬢ सुरक्षा पिन सत्यापन</span>
            <h2 className="text-xl font-extrabold text-slate-900 mt-1">6-अंक का OTP दर्ज करके सत्यापित करें,</h2>
            <p className="text-xs text-slate-500 mt-1">+91 {phone || '98765 43210'} पर भेजा गया कोड दर्ज करें</p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm text-center">
             <div className="flex justify-between space-x-2">
                {otp.map((data, index) => (
                   <input
                      key={index}
                      type="text"
                      maxLength={1}
                      value={data}
                      onChange={e => handleOtpChange(e.target, index)}
                      onFocus={e => e.target.select()}
                      className={`w-11 h-14 rounded-xl text-center text-2xl font-bold focus:outline-none focus:ring-2 focus:ring-[#185c25]
                        ${data ? 'bg-[#f2f8ec] border-2 border-[#185c25] text-slate-800' : 'bg-slate-50 border-2 border-slate-200 text-slate-500'}`}
                   />
                ))}
             </div>
             <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">डेमो कोड: <strong className="text-emerald-700 font-bold">123456</strong></span>
                <button
                   type="button"
                   onClick={() => setOtp(['1', '2', '3', '4', '5', '6'])}
                   className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold rounded-lg border border-emerald-200 transition"
                >
                   123456 भरें
                </button>
             </div>
          </div>
        </div>

        <div className="fixed bottom-0 left-0 w-full p-4 bg-gradient-to-t from-[#f9f8f3] via-[#f9f8f3] to-transparent text-center">
           <button 
             onClick={handleNext}
             disabled={isLoading || otp.join('').length !== 6}
             className={`w-full py-4 rounded-xl ${otp.join('').length === 6 && !isLoading ? primaryGreen : 'bg-slate-300'} text-white font-bold text-base flex items-center justify-center shadow-lg`}
           >
              <Check className="w-5 h-5 mr-2" />
              <span>{isLoading ? 'सत्यापित हो रहा है...' : 'कोड सत्यापित करें, और आगे बढ़ें / Verify'}</span>
           </button>
        </div>
      </div>
    );
  };

  // ----------------------------------------------------
  // STEP 4: Role Selection (STRUCTURAL RULE: NO ADMIN)
  // ----------------------------------------------------
  const renderRoleStep = () => {
          const roles = [
        {
          id: 'farmer',
          title: 'Farmer / \u0915\u093F\u0938\u093E\u0928',
          sub: '12-digit Aadhaar, direct market access, crop listings.',
          icon: Tractor,
          badge: 'Aadhaar Verhoeff',
          color: 'emerald'
        },
        {
          id: 'fpo',
          title: 'FPO (Farmer Producer Org)',
          sub: 'MCA CIN verification, manage group of farmers.',
          icon: Building2,
          badge: 'CIN Required',
          color: 'blue'
        },
        {
          id: 'consumer',
          title: 'Retail Buyer / \u0916\u0941\u0926\u0930\u093E \u0916\u0930\u0940\u0926\u093E\u0930',
          sub: 'Basic KYC via OTP, place consumer requirements.',
          icon: ShoppingCart,
          badge: 'OTP Verified',
          color: 'purple'
        },
        {
          id: 'bulk_buyer',
          title: 'Bulk Trader / \u0925\u094B\u0915 \u0935\u094D\u092F\u093E\u092A\u093E\u0930\u0940',
          sub: '15-digit GSTIN, upfront payments, bulk bidding.',
          icon: Store,
          badge: 'GSTIN + PAN',
          color: 'amber'
        },
        {
          id: 'transporter',
          title: 'Logistics Partner / \u091F\u094D\u0930\u093E\u0902\u0938\u092A\u094B\u0930\u094D\u091F\u0930',
          sub: 'Driver License and Vehicle RC verification.',
          icon: Truck,
          badge: 'DL + RC Check',
          color: 'indigo'
        },
        {
          id: 'mandi',
          title: 'Mandi APMC / \u092E\u0902\u0921\u0940 \u0938\u092E\u093F\u0924\u093F',
          sub: 'Gate pass management and Mandi price dashboard.',
          icon: Building2,
          badge: 'APMC ID',
          color: 'cyan'
        },
        {
          id: 'lab',
          title: 'Quality Lab / \u0932\u0948\u092C',
          sub: 'Quality assaying, soil testing and certifications.',
          icon: FlaskConical,
          badge: 'NABL Certified',
          color: 'rose'
        },
        {
          id: 'warehouse',
          title: 'Warehouse Owner / \u0917\u094B\u0926\u093E\u092E \u092E\u093E\u0932\u093F\u0915',
          sub: 'Rent storage space to farmers and manage inventory.',
          icon: Store,
          badge: 'WDRA Approved',
          color: 'orange'
        },
        {
          id: 'lender',
          title: 'Lender / \u090B\u0923\u0926\u093E\u0924\u093E',
          sub: 'Provide micro-credit and crop loans to verified farmers.',
          icon: Scale,
          badge: 'NBFC/Bank ID',
          color: 'teal'
        }
      ];

    return (
      <div className={`flex flex-col min-h-screen ${bgMain} font-sans`}>
        <div className="flex items-center justify-between p-4 bg-white/80 border-b border-slate-100">
          <div className="flex items-center font-bold text-lg text-slate-800">
             <ArrowLeft onClick={handleBack} className="w-5 h-5 mr-2 cursor-pointer" />
             AgriVa
          </div>
          <button 
            onClick={handleToggleNarration}
            className={`px-3 py-1.5 rounded-full border border-orange-400 ${textOrange} bg-orange-50 font-medium text-xs flex items-center`}
          >
            <Volume2 className="w-3.5 h-3.5 mr-1" />
            बोल कर सुनें
          </button>
        </div>

        <div className="px-4 pb-28 space-y-4 mt-4">
          <div>
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">चरण 3/3 ⬢ भूमिका चयन</span>
            <h2 className="text-2xl font-extrabold text-slate-900 mt-1">आप कौन-सी भूमिका में हैं?</h2>
            <p className="text-xs text-slate-500 mt-1">प्लेटफ़ॉर्म पर अपनी उचित भूमिका (Actor) का चयन करें</p>
          </div>

          {/* STRUCTURAL GOVERNANCE RULE CALLOUT */}
          <div className="bg-amber-50 border border-amber-300 rounded-xl p-3 flex items-start text-xs text-amber-900 shadow-sm">
             <ShieldCheck className="w-4 h-4 text-amber-700 mr-2 shrink-0 mt-0.5" />
             <div>
                <strong>प्लेटफ़ॉर्म सुरक्षा नियम (Platform Governance Rule):</strong>
                <p className="text-[11px] text-amber-800 mt-0.5">
                  एडमिन (Admin) भूमिका को यहाँ से अनुमत नहीं किया जा सकता। यह केवल प्लेटफ़ॉर्म मास्टर द्वारा सुरक्षित प्रक्रिया से बनाए जाते हैं।
                </p>
             </div>
          </div>

          <div className="space-y-3">
             {roles.map(r => {
                const IconComponent = r.icon;
                const isSelected = selectedRole === r.id;
                return (
                   <button
                      key={r.id}
                      onClick={() => setSelectedRole(r.id)}
                      className={`w-full text-left p-4 rounded-2xl border-2 transition-all bg-white shadow-sm flex items-start space-x-3 ${
                        isSelected ? `${borderGreen} ring-2 ring-[#185c25]/20 bg-[#f9fdf9]` : 'border-slate-200'
                      }`}
                   >
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${isSelected ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'}`}>
                         <IconComponent className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                         <div className="flex items-center justify-between">
                            <h3 className="font-bold text-sm text-slate-900">{r.title}</h3>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                               {r.badge}
                            </span>
                         </div>
                         <p className="text-xs text-slate-500 mt-1 leading-snug">{r.sub}</p>
                      </div>
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center border-2 mt-1 shrink-0 ${
                         isSelected ? `${primaryGreen} border-transparent text-white` : 'border-slate-300'
                      }`}>
                         {isSelected && <Check className="w-3 h-3" />}
                      </div>
                   </button>
                );
             })}
          </div>
        </div>

        <div className="fixed bottom-0 left-0 w-full p-4 bg-gradient-to-t from-[#f9f8f3] via-[#f9f8f3] to-transparent">
           <button 
              onClick={handleNext}
              className={`w-full py-4 rounded-xl ${primaryGreen} text-white font-bold text-base flex items-center justify-center shadow-lg transition-transform active:scale-98`}
           >
              <span>प्रोफ़ाइल विवरण भरें / Continue</span>
              <ArrowRight className="w-5 h-5 ml-2" />
           </button>
        </div>
      </div>
    );
  };

  // ----------------------------------------------------
  // STEP 5: Profile Details per Actor
  // ----------------------------------------------------
  const renderProfileStep = () => {
    return (
      <div className={`flex flex-col min-h-screen ${bgMain} font-sans`}>
        <div className="flex items-center justify-between p-4 bg-white/80 border-b border-slate-100 sticky top-0 z-10">
          <div className="flex items-center font-bold text-lg text-slate-800">
             <ArrowLeft onClick={handleBack} className="w-5 h-5 mr-2 cursor-pointer" />
             <span>जरूरी फ़ील्ड व सत्यापन</span>
          </div>
          <button 
            onClick={handleToggleNarration}
            className={`px-3 py-1.5 rounded-full border border-orange-400 ${textOrange} bg-orange-50 font-medium text-xs flex items-center`}
          >
            <Volume2 className="w-3.5 h-3.5 mr-1" />
            बोल कर सुनें
          </button>
        </div>

        <div className="px-4 pb-28 space-y-4 mt-4">
          {/* Global Voice Auto-fill Button */}
          <button 
            type="button" 
            onClick={startFullFormVoiceInput} 
            className={`w-full py-3.5 mb-2 rounded-xl border-2 shadow-sm font-bold flex items-center justify-center transition-all ${isVoiceInputActive ? 'bg-rose-100 border-rose-300 text-rose-700 animate-pulse' : 'bg-emerald-50 border-emerald-500 text-emerald-800'}`}
          >
            <Mic className={`w-5 h-5 mr-2 ${isVoiceInputActive ? 'animate-bounce' : ''}`} />
            {isVoiceInputActive ? 'सुन रहे हैं... (Listening...)' : 'बोलकर पूरा फॉर्म भरें / Auto-fill by Voice'}
          </button>

          {errorMsg && (
             <div className="bg-red-50 border-2 border-red-200 text-red-700 p-3.5 rounded-xl text-xs font-bold flex items-start">
                <AlertTriangle className="w-5 h-5 mr-2 shrink-0 mt-0.5 text-red-600" />
                <div>
                   <p className="font-bold">सत्यापन त्रुटि / Validation Exception</p>
                   <p className="font-normal mt-0.5">{errorMsg}</p>
                </div>
             </div>
          )}

          {/* ----------------- ACTOR: INDIVIDUAL FARMER ----------------- */}
          {selectedRole === 'farmer' && (
             <div className="space-y-4">
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-xs text-emerald-900">
                   <div className="flex items-center font-bold text-sm mb-1 text-emerald-800">
                      <Tractor className="w-4 h-4 mr-1.5" /> किसान सत्यापन विनिर्देश
                   </div>
                   <p>⬢ 12-अंक आधार चेकसम: Verhoeff एल्गोरिदम अनिवार्य।</p>
                   <p>⬢ DPDP अधिनियम 2023: आधार टोकनाइज़्ड/मास्क्ड (XXXX-XXXX-XXXX) रूप में सुरक्षित।</p>
                   <p>⬢ कोई मात्रा सीमा नहीं: नए/कम-विश्वास वाले किसानों को पारदर्शी 'New Seller' बैज मिलता है।</p>
                </div>

                <div className="bg-white rounded-2xl p-4 border border-slate-200 space-y-3 shadow-sm">
                   <div>
                      <label className="text-xs font-bold text-slate-700 flex justify-between">
                         <span>किसान का पूरा नाम (Full Name) *</span>
                         <button type="button" onClick={() => startFieldVoiceInput('name')} className="text-emerald-700 flex items-center text-[10px]">
                            <Mic className="w-3 h-3 mr-0.5" /> बोलें
                         </button>
                      </label>
                      <input 
                        type="text"
                        value={formData.name}
                        onChange={e => handleFormChange('name', e.target.value)}
                        className="w-full mt-1 p-3 rounded-xl border border-slate-200 text-sm font-bold text-slate-800 focus:outline-none focus:border-emerald-600"
                        placeholder="उदा. रमेश कुमार"
                      />
                   </div>

                   <div>
                      <label className="text-xs font-bold text-slate-700 flex justify-between items-center">
                         <span>12-अंक आधार संख्या (Aadhaar Number) *</span>
                         <span className="text-[10px] text-slate-500 font-mono">
                            Verhoeff: {validateAadhaarVerhoeff(formData.aadhaarNumber).valid ? '✅ मान्य' : '⚠️ अमान्य'}
                         </span>
                      </label>
                      <input 
                        type="text"
                        value={formData.aadhaarNumber}
                        onChange={e => handleFormChange('aadhaarNumber', e.target.value.replace(/\D/g, '').slice(0, 12))}
                        className={`w-full mt-1 p-3 rounded-xl border text-sm font-mono tracking-widest font-bold focus:outline-none ${
                           validateAadhaarVerhoeff(formData.aadhaarNumber).valid ? 'border-emerald-500 bg-emerald-50/30 text-emerald-900' : 'border-slate-200 text-slate-800'
                        }`}
                        placeholder="12-digit Aadhaar (e.g. 999988887779)"
                        maxLength={12}
                      />
                      <div className="flex justify-between items-center mt-1 text-[11px] text-slate-500">
                         <span>मास्क्ड दृश्य: {maskAadhaar(formData.aadhaarNumber)}</span>
                         <button 
                           type="button" 
                           onClick={() => handleFormChange('aadhaarNumber', '999988887779')}
                           className="text-emerald-700 font-bold hover:underline"
                         >
                            आधार भरें
                         </button>
                      </div>
                   </div>

                   <div>
                      <label className="text-xs font-bold text-slate-700">खेत का GPS स्थान व पता (Farm GPS & Address) *</label>
                      <input 
                        type="text"
                        value={formData.address}
                        onChange={e => handleFormChange('address', e.target.value)}
                        className="w-full mt-1 p-3 rounded-xl border border-slate-200 text-sm font-bold text-slate-800 focus:outline-none focus:border-emerald-600"
                        placeholder="उदा. ग्राम मुरथल, सोनीपत, हरियाणा"
                      />
                   </div>

                   <div className="grid grid-cols-2 gap-3">
                      <div>
                         <label className="text-xs font-bold text-slate-700">भू-स्वामित्व प्रमाण (वैकल्पिक)</label>
                         <input 
                           type="text"
                           value={formData.landProofNumber}
                           onChange={e => handleFormChange('landProofNumber', e.target.value)}
                           className="w-full mt-1 p-3 rounded-xl border border-slate-200 text-sm font-medium text-slate-800"
                           placeholder="खसरा / 7-12 संख्या"
                         />
                      </div>
                      <div>
                         <label className="text-xs font-bold text-slate-700">FPO संबद्धता (वैकल्पिक)</label>
                         <input 
                           type="text"
                           value={formData.fpoAffiliation}
                           onChange={e => handleFormChange('fpoAffiliation', e.target.value)}
                           className="w-full mt-1 p-3 rounded-xl border border-slate-200 text-sm font-medium text-slate-800"
                           placeholder="उदा. FPO का नाम"
                         />
                      </div>
                   </div>

                   <div>
                      <label className="text-xs font-bold text-slate-700">बैंक / UPI (DBT Direct Transfer) *</label>
                      <input 
                        type="text"
                        value={formData.upiId}
                        onChange={e => handleFormChange('upiId', e.target.value)}
                        className="w-full mt-1 p-3 rounded-xl border border-slate-200 text-sm font-bold text-slate-800"
                        placeholder="उदा. farmer@sbi"
                      />
                   </div>
                </div>
             </div>
          )}

          {/* ----------------- ACTOR: FPO ----------------- */}
          {selectedRole === 'fpo' && (
             <div className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-xs text-blue-900">
                   <div className="flex items-center font-bold text-sm mb-1 text-blue-800">
                      <Building2 className="w-4 h-4 mr-1.5" /> FPO सत्यापन विनिर्देश
                   </div>
                   <p>⬢ कॉर्पोरेट पहचान संख्या (CIN): कंपनी अधिनियम 2013 पर अनिवार्य।</p>
                   <p>⬢ रजिस्ट्रेशन संख्या सत्यापन पर तुरंत अस्थायी अनुमति दी जाती है।</p>
                   <p>⬢ सुरक्षा नोट: यह एक्टिव होने से पहले 'Pending' एडमिन समीक्षा कतार में जाता है।</p>
                </div>

                <div className="bg-white rounded-2xl p-4 border border-slate-200 space-y-3 shadow-sm">
                   <div>
                      <label className="text-xs font-bold text-slate-700">FPO का नाम (Organization Name) *</label>
                      <input 
                        type="text"
                        value={formData.name}
                        onChange={e => handleFormChange('name', e.target.value)}
                        className="w-full mt-1 p-3 rounded-xl border border-slate-200 text-sm font-bold text-slate-800"
                        placeholder="उदा. सोनीपत किसान एग्रो FPO"
                      />
                   </div>

                   <div>
                      <label className="text-xs font-bold text-slate-700 flex justify-between">
                         <span>CIN या कार्यालय पंजीकरण संख्या *</span>
                         <span className="text-[10px] text-slate-500 font-mono">
                            {validateFpoRegistrationNumber(formData.registrationNumber).valid ? '✅ प्रारूप मान्य' : '⚠ 21-अंक CIN अपेक्षित'}
                         </span>
                      </label>
                      <input 
                        type="text"
                        value={formData.registrationNumber}
                        onChange={e => handleFormChange('registrationNumber', e.target.value.toUpperCase())}
                        className="w-full mt-1 p-3 rounded-xl border border-slate-200 text-sm font-mono font-bold text-slate-800 tracking-wider"
                        placeholder="U01409HR2021PTC095123"
                      />
                   </div>

                   <div className="grid grid-cols-2 gap-3">
                      <div>
                         <label className="text-xs font-bold text-slate-700">सदस्य किसान संख्या *</label>
                         <input 
                           type="number"
                           value={formData.memberCount}
                           onChange={e => handleFormChange('memberCount', e.target.value)}
                           className="w-full mt-1 p-3 rounded-xl border border-slate-200 text-sm font-bold text-slate-800"
                           placeholder="350"
                         />
                      </div>
                      <div>
                         <label className="text-xs font-bold text-slate-700">अधिकृत संपर्क व्यक्ति *</label>
                         <input 
                           type="text"
                           value={formData.contactPerson}
                           onChange={e => handleFormChange('contactPerson', e.target.value)}
                           className="w-full mt-1 p-3 rounded-xl border border-slate-200 text-sm font-bold text-slate-800"
                           placeholder="राजिंदर सिंह"
                         />
                      </div>
                   </div>

                   <div>
                      <label className="text-xs font-bold text-slate-700">मंडी क्षेत्राधिकार (APMC Mandi Jurisdiction) *</label>
                      <input 
                        type="text"
                        value={formData.mandiJurisdiction}
                        onChange={e => handleFormChange('mandiJurisdiction', e.target.value)}
                        className="w-full mt-1 p-3 rounded-xl border border-slate-200 text-sm font-bold text-slate-800"
                        placeholder="सोनीपत APMC व आज़ादपुर सब-यार्ड"
                      />
                   </div>
                </div>
             </div>
          )}

          {/* ----------------- ACTOR: CONSUMER (RETAIL BUYER) ----------------- */}
          {selectedRole === 'consumer' && (
             <div className="space-y-4">
                <div className="bg-purple-50 border border-purple-200 rounded-xl p-3 text-xs text-purple-900">
                   <div className="flex items-center font-bold text-sm mb-1 text-purple-800">
                      <ShoppingCart className="w-4 h-4 mr-1.5" /> उपभोक्ता सत्यापन विनिर्देश
                   </div>
                   <p>⬢ न्यूनतम सत्यापन: केवल फोन OTP, कोई ID प्रमाण नहीं।</p>
                   <p>⬢ सुरक्षा: धोखाधड़ी का जोखिम न्यूनतम — भुगतान-पूर्व जमा एस्क्रो द्वारा सुरक्षित।</p>
                   <p>⬢ सत्यापन के बाद तत्काल सक्रिय (Instant Active)।</p>
                </div>

                <div className="bg-white rounded-2xl p-4 border border-slate-200 space-y-3 shadow-sm">
                   <div>
                      <label className="text-xs font-bold text-slate-700">उपभोक्ता का नाम *</label>
                      <input 
                        type="text"
                        value={formData.name}
                        onChange={e => handleFormChange('name', e.target.value)}
                        className="w-full mt-1 p-3 rounded-xl border border-slate-200 text-sm font-bold text-slate-800"
                        placeholder="प्रिया वर्मा"
                      />
                   </div>

                   <div>
                      <label className="text-xs font-bold text-slate-700">डिलीवरी पता (Delivery Address) *</label>
                      <input 
                        type="text"
                        value={formData.deliveryAddress}
                        onChange={e => handleFormChange('deliveryAddress', e.target.value)}
                        className="w-full mt-1 p-3 rounded-xl border border-slate-200 text-sm font-bold text-slate-800"
                        placeholder="फ्लैट 402, ग्रीन वैली अपार्टमेंट्स, रोहिणी सेक्टर 14, दिल्ली - 110085"
                      />
                   </div>

                   <div>
                      <label className="text-xs font-bold text-slate-700">भुगतान विधि (Payment Gateway Tokenized) *</label>
                      <input 
                        type="text"
                        value={formData.paymentMethod}
                        onChange={e => handleFormChange('paymentMethod', e.target.value)}
                        className="w-full mt-1 p-3 rounded-xl border border-slate-200 text-sm font-bold text-slate-800 bg-slate-50"
                        readOnly
                      />
                   </div>
                </div>
             </div>
          )}

          {/* ----------------- ACTOR: BULK BUYER ----------------- */}
          {selectedRole === 'bulk_buyer' && (
             <div className="space-y-4">
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-900">
                   <div className="flex items-center font-bold text-sm mb-1 text-amber-800">
                      <Store className="w-4 h-4 mr-1.5" /> थोक व्यापारी विनिर्देश
                   </div>
                   <p>⬢ 15-अंक GSTIN प्रारूप सत्यापन अनिवार्य।</p>
                   <p>⬢ भुगतान शर्तें: केवल अग्रिम (Upfront Only - MVP Scope; क्रेडिट निषिद्ध)।</p>
                   <p>⬢ FPO की तरह एडमिन सत्यापन पथ: Pending → Admin Verified → Active।</p>
                </div>

                <div className="bg-white rounded-2xl p-4 border border-slate-200 space-y-3 shadow-sm">
                   <div>
                      <label className="text-xs font-bold text-slate-700 block mb-2">Buyer Category (Tier) *</label><div className="grid grid-cols-2 gap-2 mb-4"><label className={`flex items-center space-x-2 p-2 rounded-lg border cursor-pointer ${formData.buyerTier === 'bulk' ? 'bg-amber-50 border-amber-300 text-amber-900' : 'bg-slate-50 border-slate-200 text-slate-600'}`}><input type="radio" name="buyerTier" value="bulk" checked={formData.buyerTier === 'bulk'} onChange={e => handleFormChange('buyerTier', e.target.value)} className="text-amber-600" /><div className="text-xs font-bold">Bulk Buyer<br/><span className="text-[9px] font-normal opacity-80">Full Truckloads</span></div></label><label className={`flex items-center space-x-2 p-2 rounded-lg border cursor-pointer ${formData.buyerTier === 'retailer' ? 'bg-amber-50 border-amber-300 text-amber-900' : 'bg-slate-50 border-slate-200 text-slate-600'}`}><input type="radio" name="buyerTier" value="retailer" checked={formData.buyerTier === 'retailer'} onChange={e => handleFormChange('buyerTier', e.target.value)} className="text-amber-600" /><div className="text-xs font-bold">Retailer<br/><span className="text-[9px] font-normal opacity-80">20-200kg Batched</span></div></label></div><label className="text-xs font-bold text-slate-700">Business Name *</label>
                      <input 
                        type="text"
                        value={formData.businessName}
                        onChange={e => handleFormChange('businessName', e.target.value)}
                        className="w-full mt-1 p-3 rounded-xl border border-slate-200 text-sm font-bold text-slate-800"
                        placeholder="एग्रोकॉर्प बल्क ट्रेडर्स प्रा. लि."
                      />
                   </div>

                   <div>
                      <label className="text-xs font-bold text-slate-700 flex justify-between">
                         <span>15-अंक GSTIN *</span>
                         <span className="text-[10px] text-slate-500 font-mono">
                            {validateGstin(formData.gstin).valid ? '✅ प्रारूप मान्य' : '⚠ 15-अंक GSTIN अपेक्षित'}
                         </span>
                      </label>
                      <input 
                        type="text"
                        value={formData.gstin}
                        onChange={e => handleFormChange('gstin', e.target.value.toUpperCase())}
                        className="w-full mt-1 p-3 rounded-xl border border-slate-200 text-sm font-mono font-bold text-slate-800 tracking-wider"
                        placeholder="07AAAAA0000A1Z5"
                        maxLength={15}
                      />
                   </div>

                   <div>
                      <label className="text-xs font-bold text-slate-700">व्यावसायिक पता *</label>
                      <input 
                        type="text"
                        value={formData.address}
                        onChange={e => handleFormChange('address', e.target.value)}
                        className="w-full mt-1 p-3 rounded-xl border border-slate-200 text-sm font-bold text-slate-800"
                        placeholder="प्लॉट 42, मॉडल टाउन, इंडस्ट्रियल एरिया, हरियाणा"
                      />
                   </div>

                   <div className="grid grid-cols-2 gap-3">
                      <div>
                         <label className="text-xs font-bold text-slate-700">अधिकृत संपर्क व्यक्ति *</label>
                         <input 
                           type="text"
                           value={formData.authorizedContact}
                           onChange={e => handleFormChange('authorizedContact', e.target.value)}
                           className="w-full mt-1 p-3 rounded-xl border border-slate-200 text-sm font-bold text-slate-800"
                           placeholder="विक्रम सिंघानिया"
                         />
                      </div>
                      <div>
                         <label className="text-xs font-bold text-slate-700">भुगतान शर्तें (Payment Terms)</label>
                         <input 
                           type="text"
                           value={formData.paymentTerms}
                           className="w-full mt-1 p-3 rounded-xl border border-slate-200 text-sm font-bold text-slate-700 bg-slate-50"
                           readOnly
                         />
                      </div>
                   </div>
                </div>
             </div>
          )}

          {/* ----------------- ACTOR: TRANSPORTER / LOGISTICS ----------------- */}
          {selectedRole === 'transporter' && (
             <div className="space-y-4">
                <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-3 text-xs text-indigo-900">
                   <div className="flex items-center font-bold text-sm mb-1 text-indigo-800">
                      <Truck className="w-4 h-4 mr-1.5" /> लॉजिस्टिक्स पार्टनर विनिर्देश
                   </div>
                   <p>⬢ व्यक्तिगत चालक: DL व वाहन RC पर सत्यापन। एक RC से एक ही चालक — अनुमति (Double-booking निषेध)।</p>
                   <p>⬢ फ्लीट कंपनी: GSTIN, फ्लीट आकार, API इंटीग्रेशन जॉब (Job Dispatch)।</p>
                   <p>⬢ लोकेशन नियम: फसल ट्रांज़िट सुरक्षा के लिए बार-बार GPS पर लोकेशन अपडेट।</p>
                </div>

                <div className="flex rounded-xl bg-slate-200 p-1 text-xs font-bold">
                   <button 
                     type="button"
                     onClick={() => handleFormChange('transporterType', 'individual')}
                     className={`flex-1 py-2 rounded-lg transition ${formData.transporterType === 'individual' ? 'bg-white shadow text-indigo-900' : 'text-slate-600'}`}
                   >
                     व्यक्तिगत चालक (Driver)
                   </button>
                   <button 
                     type="button"
                     onClick={() => handleFormChange('transporterType', 'aggregator')}
                     className={`flex-1 py-2 rounded-lg transition ${formData.transporterType === 'aggregator' ? 'bg-white shadow text-indigo-900' : 'text-slate-600'}`}
                   >
                     फ्लीट कंपनी (Aggregator)
                   </button>
                </div>

                <div className="bg-white rounded-2xl p-4 border border-slate-200 space-y-3 shadow-sm">
                   <div>
                      <label className="text-xs font-bold text-slate-700">
                         {formData.transporterType === 'individual' ? 'चालक का नाम *' : 'कंपनी का नाम *'}
                      </label>
                      <input 
                        type="text"
                        value={formData.name}
                        onChange={e => handleFormChange('name', e.target.value)}
                        className="w-full mt-1 p-3 rounded-xl border border-slate-200 text-sm font-bold text-slate-800"
                        placeholder={formData.transporterType === 'individual' ? 'सुंदर सिंह' : 'सेतु ट्रांसपोर्ट'}
                      />
                   </div>

                   {formData.transporterType === 'individual' ? (
                      <>
                         <div className="grid grid-cols-2 gap-3">
                            <div>
                               <label className="text-xs font-bold text-slate-700 flex justify-between">
                                  <span>ड्राइविंग लाइसेंस (DL) *</span>
                               </label>
                               <input 
                                 type="text"
                                 value={formData.dlNumber}
                                 onChange={e => handleFormChange('dlNumber', e.target.value.toUpperCase())}
                                 className="w-full mt-1 p-3 rounded-xl border border-slate-200 text-sm font-mono font-bold text-slate-800"
                                 placeholder="HR-1020180045612"
                               />
                            </div>
                            <div>
                               <label className="text-xs font-bold text-slate-700 flex justify-between">
                                  <span>वाहन RC संख्या *</span>
                               </label>
                               <input 
                                 type="text"
                                 value={formData.vehicleReg}
                                 onChange={e => handleFormChange('vehicleReg', e.target.value.toUpperCase())}
                                 className="w-full mt-1 p-3 rounded-xl border border-slate-200 text-sm font-mono font-bold text-slate-800"
                                 placeholder="HR-10-AB-1234"
                               />
                            </div>
                         </div>

                         <div className="grid grid-cols-2 gap-3">
                            <div>
                               <label className="text-xs font-bold text-slate-700">वाहन का प्रकार *</label>
                               <input 
                                 type="text"
                                 value={formData.vehicleType}
                                 onChange={e => handleFormChange('vehicleType', e.target.value)}
                                 className="w-full mt-1 p-3 rounded-xl border border-slate-200 text-sm font-bold text-slate-800"
                                 placeholder="पिकअप / टाटा 407"
                               />
                            </div>
                            <div>
                               <label className="text-xs font-bold text-slate-700">क्षमता (किग्रा में) *</label>
                               <input 
                                 type="number"
                                 value={formData.capacityKg}
                                 onChange={e => handleFormChange('capacityKg', e.target.value)}
                                 className="w-full mt-1 p-3 rounded-xl border border-slate-200 text-sm font-bold text-slate-800"
                                 placeholder="2500"
                               />
                            </div>
                         </div>
                      </>
                   ) : (
                      <>
                         <div>
                            <label className="text-xs font-bold text-slate-700">कंपनी का GSTIN *</label>
                            <input 
                              type="text"
                              value={formData.gstin}
                              onChange={e => handleFormChange('gstin', e.target.value.toUpperCase())}
                              className="w-full mt-1 p-3 rounded-xl border border-slate-200 text-sm font-mono font-bold text-slate-800"
                              placeholder="06AABCG1234F1Z8"
                            />
                         </div>

                         <div className="grid grid-cols-2 gap-3">
                            <div>
                               <label className="text-xs font-bold text-slate-700">फ्लीट आकार (वाहन संख्या) *</label>
                               <input 
                                 type="number"
                                 value={formData.fleetSize}
                                 onChange={e => handleFormChange('fleetSize', e.target.value)}
                                 className="w-full mt-1 p-3 rounded-xl border border-slate-200 text-sm font-bold text-slate-800"
                                 placeholder="24"
                               />
                            </div>
                            <div>
                               <label className="text-xs font-bold text-slate-700">API इंटीग्रेशन ध्वज</label>
                               <div className="mt-2 flex items-center text-xs font-bold text-indigo-900">
                                  <input 
                                    type="checkbox"
                                    checked={formData.apiIntegrationEnabled}
                                    onChange={e => handleFormChange('apiIntegrationEnabled', e.target.checked)}
                                    className="w-4 h-4 mr-2 text-indigo-600 rounded"
                                  />
                                  <span>Porter/Dunzo स्टाइल API जॉब डिस्पैच सक्षम</span>
                               </div>
                            </div>
                         </div>
                      </>
                   )}
                </div>
             </div>
          )}

          {/* Fallback Mandi / Lab Profile details */}
          {(selectedRole === 'mandi' || selectedRole === 'lab') && (
             <div className="bg-white rounded-2xl p-4 border border-slate-200 space-y-3 shadow-sm">
                <div>
                   <label className="text-xs font-bold text-slate-700">संस्था का नाम *</label>
                   <input 
                     type="text"
                     value={formData.name}
                     onChange={e => handleFormChange('name', e.target.value)}
                     className="w-full mt-1 p-3 rounded-xl border border-slate-200 text-sm font-bold text-slate-800"
                     placeholder={selectedRole === 'mandi' ? 'आज़ादपुर APMC मंडी' : 'एग्री टेस्ट लैब'}
                   />
                </div>
                <div>
                   <label className="text-xs font-bold text-slate-700">प्रमाणपत्र / अधिकृत लाइसेंस संख्या *</label>
                   <input 
                     type="text"
                     value={selectedRole === 'mandi' ? 'APMC-DL-2024-001' : 'NABL-AGRI-2024-889'}
                     className="w-full mt-1 p-3 rounded-xl border border-slate-200 text-sm font-mono font-bold text-slate-800"
                     readOnly
                   />
                </div>
             </div>
          )}
        </div>

        <div className="fixed bottom-0 left-0 w-full p-4 bg-gradient-to-t from-[#f9f8f3] via-[#f9f8f3] to-transparent">
           <button 
              onClick={handleProfileSubmit}
              disabled={isLoading}
              className={`w-full py-4 rounded-xl ${primaryGreen} text-white font-bold text-base flex items-center justify-center shadow-lg transition-transform active:scale-98`}
           >
              {isLoading ? (
                 <span>सत्यापन जारी है... / Validating...</span>
              ) : (
                 <>
                    <span>सत्यापित करें, और प्रोफ़ाइल पूर्ण करें</span>
                    <ArrowRight className="w-5 h-5 ml-2" />
                 </>
              )}
           </button>
        </div>
      </div>
    );
  };

  // ----------------------------------------------------
  // STEP 6: Status & Completion Screen
  // ----------------------------------------------------
  const renderStatusStep = () => {
    const isPending = submissionResult?.status === 'Pending';
    const isFlagged = submissionResult?.status === 'Flagged';
    const isActive = submissionResult?.status === 'Active';

    return (
      <div className={`flex flex-col min-h-screen ${bgMain} font-sans justify-center p-6 text-center`}>
        <div className="max-w-md mx-auto w-full bg-white rounded-3xl p-6 shadow-xl border border-slate-200 space-y-4">
           {isActive && (
              <>
                 <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto shadow-inner">
                    <CheckCircle2 className="w-10 h-10" />
                 </div>
                 <h2 className="text-2xl font-extrabold text-slate-900">पंजीकरण सफल — सक्रिय!</h2>
                 <p className="text-xs text-slate-600 leading-relaxed">
                    आपके क्रेडेंशियल्स का सत्यापन हो गया है। एग्रीवा प्लेटफ़ॉर्म मंडी में आपका स्वागत है।
                 </p>
                 <div className="p-3 bg-emerald-50 rounded-xl text-left text-xs text-emerald-900 border border-emerald-200 space-y-1">
                    <p><strong>खाता:</strong> {submissionResult.profile?.name}</p>
                    <p><strong>भूमिका:</strong> {submissionResult.profile?.role?.toUpperCase()}</p>
                    {submissionResult.profile?.sellerBadge && (
                       <p><strong>विक्रेता बैज:</strong><span className="font-bold text-amber-700">{submissionResult.profile.sellerBadge}</span></p>
                    )}
                 </div>
              </>
           )}

           {isPending && (
              <>
                 <div className="w-16 h-16 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center mx-auto shadow-inner">
                    <Building2 className="w-10 h-10" />
                 </div>
                 <h2 className="text-2xl font-extrabold text-slate-900">एडमिन सत्यापन कतार में</h2>
                 <p className="text-xs text-slate-600 leading-relaxed">
                    आपका पंजीकरण प्रारूप मान्य हो गया है, मात्र सुरक्षा कानूनी जाँच के कारण यह अभी <strong>एडमिन अनुमोदन कतार (Admin Approval Queue)</strong> में जमा कर दिया गया है।
                 </p>
                 <div className="p-3 bg-amber-50 rounded-xl text-left text-xs text-amber-900 border border-amber-200 space-y-1">
                    <p><strong>संस्था:</strong> {submissionResult.profile?.name}</p>
                    <p><strong>स्थिति:</strong> Pending Admin Review</p>
                    <p><strong>टिप्पणी:</strong> {submissionResult.profile?.verificationNotes || 'MCA/GSTN Public Database Verification Path'}</p>
                 </div>
              </>
           )}

           {isFlagged && (
              <>
                 <div className="w-16 h-16 bg-rose-100 text-rose-700 rounded-full flex items-center justify-center mx-auto shadow-inner">
                    <BadgeAlert className="w-10 h-10" />
                 </div>
                 <h2 className="text-2xl font-extrabold text-slate-900">अतिरिक्त जाँच के लिए चिह्नित</h2>
                 <p className="text-xs text-slate-600 leading-relaxed">
                    समान पहचान संख्या (आधार/DL) से किसी भिन्न फोन नंबर से अधिकृत — DPDP सुरक्षा जाँच के तहत इसे अतिरिक्त एडमिन समीक्षा हेतु चिह्नित किया गया है।
                 </p>
                 <div className="p-3 bg-rose-50 rounded-xl text-left text-xs text-rose-900 border border-rose-200 space-y-1">
                    <p><strong>कारण:</strong> {submissionResult.profile?.flagReason}</p>
                    <p><strong>स्थिति:</strong> Flagged for Admin Investigation</p>
                 </div>
              </>
           )}

           <button
              onClick={() => {
                 if (onComplete) onComplete();
              }}
              className={`w-full py-3.5 rounded-xl ${primaryGreen} text-white font-bold text-sm shadow-lg`}
           >
              डैशबोर्ड में प्रवेश करें / Enter Platform
           </button>
        </div>
      </div>
    );
  };

  return (
    <>
      {step === 'language' && renderLanguageStep()}
      {step === 'phone' && renderPhoneStep()}
      {step === 'otp' && renderOtpStep()}
      {step === 'role' && renderRoleStep()}
      {step === 'profile' && renderProfileStep()}
      {step === 'status' && renderStatusStep()}
    </>
  );
}
