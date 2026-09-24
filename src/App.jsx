import React, { useState, useEffect } from 'react';
import BlueScreen from './pages/BlueScreen';
import { AppProvider, useApp } from './context/AppContext';
import Navbar from './components/Navbar';
import BottomNav from './components/BottomNav';
import Sidebar from './components/Sidebar';
import PersonaSwitcher from './components/PersonaSwitcher';
import NotificationToast from './components/NotificationToast';
import AIAssistantModal from './components/AIAssistantModal';

import Onboarding from './pages/auth/Onboarding';
import FarmerDashboard from './pages/farmer/FarmerDashboard';
import PriceDiscovery from './pages/farmer/PriceDiscovery';
import RequirementsFeed from './pages/farmer/RequirementsFeed';
import MakeOfferModal from './pages/farmer/MakeOfferModal';
import BuyerMarketplace from './pages/buyer/BuyerMarketplace';
import BulkBuyerDashboard from './pages/buyer/BulkBuyerDashboard';
import PostRequirementForm from './pages/buyer/PostRequirementForm';
import BuyerOffersView from './pages/buyer/BuyerOffersView';
import TransporterDashboard from './pages/transporter/TransporterDashboard';
import MandiDashboard from './pages/mandi/MandiDashboard';
import LabDashboard from './pages/lab/LabDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import MiddlemanDashboard from './pages/middleman/MiddlemanDashboard';
import LenderDashboard from './pages/lender/LenderDashboard';
import WarehouseDashboard from './pages/warehouse/WarehouseDashboard';
import SettingsPage from './pages/SettingsPage';

function MainLayout() {
  const { currentUser, requirements } = useApp();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('agriva_auth_status') === 'true';
  });
  const [activeRequirement, setActiveRequirement] = useState(null);
  const [showMakeOffer, setShowMakeOffer] = useState(false);

  // Reset to dashboard when user/role changes
  useEffect(() => {
    setActiveTab('dashboard');
    setActiveRequirement(null);
    setShowMakeOffer(false);
  }, [currentUser?.uid]);

  if (!isAuthenticated) {
    return (
      <Onboarding 
        onComplete={() => {
          localStorage.setItem('agriva_auth_status', 'true');
          setIsAuthenticated(true);
        }} 
      />
    );
  }

  // Full-screen Modals
  if (showMakeOffer && activeRequirement) {
    return <MakeOfferModal requirement={activeRequirement} onClose={() => setShowMakeOffer(false)} />;
  }

  if (activeTab === 'buyerOffers' && activeRequirement) {
    return <BuyerOffersView requirement={activeRequirement} onBack={() => setActiveTab('dashboard')} />;
  }

  const renderActiveScreen = () => {
  // Simple URL-based routing for standalone pages
  const path = window.location.pathname;
  if (path === '/blue' || path === '/blue-screen') {
    return <BlueScreen />;
  }
    if (activeTab === 'settings') return <SettingsPage />;

  // Existing role-based rendering continues below

    switch (currentUser.role) {
      case 'farmer':
      case 'fpo':
        if (activeTab === 'prices') return <PriceDiscovery />;
        if (activeTab === 'feed') return <RequirementsFeed onMakeOffer={(req) => { setActiveRequirement(req); setShowMakeOffer(true); }} />;
        return <FarmerDashboard />;

      case 'buyer':
      case 'consumer':
      case 'bulk_buyer':
        if (activeTab === 'postReq') return <PostRequirementForm onBack={() => setActiveTab('dashboard')} />;
        if (activeTab === 'offers') {
          // Fallback to the first seeded requirement if none active for testing the UI
          const mockReq = activeRequirement || (requirements && requirements.length > 0 ? requirements[0] : null);
          return <BuyerOffersView requirement={mockReq} onBack={() => setActiveTab('dashboard')} />;
        }
        return <BuyerMarketplace />;

      case 'transporter':
        return <TransporterDashboard />;

      case 'mandi':
        return <MandiDashboard />;

      case 'lab':
        return <LabDashboard />;

      case 'admin':
        return <AdminDashboard />;

      case 'middleman':
        return <MiddlemanDashboard />;

      case 'lender':
        return <LenderDashboard />;

      default:
        return <FarmerDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-[#e5e5e5] flex justify-center">
      {/* Main Container - Responsive for mobile & PC */}
      <div className="w-full max-w-md md:max-w-7xl flex flex-col relative bg-[#f9f8f3] shadow-2xl h-screen overflow-hidden">
        {/* Persona Switcher Banner */}
        <PersonaSwitcher />

        {/* Notifications & Toast Overlay */}
        <NotificationToast />

        {/* Main Content Viewport */}
        <main className="flex-1 overflow-y-auto pb-20 bg-[#f9f8f3] custom-scrollbar">
          {renderActiveScreen()}
        </main>

        {/* Bottom Role-Aware Navigation Bar */}
        <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Floating AI Assistant Trigger & Modal (Only for specific roles) */}
        {currentUser && ['buyer', 'consumer', 'bulk_buyer', 'admin', 'mandi', 'middleman', 'lender'].includes(currentUser.role) && (
          <AIAssistantModal />
        )}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
