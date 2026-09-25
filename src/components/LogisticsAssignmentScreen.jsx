import React, { useState } from 'react';
import { Truck, Star, CheckCircle, Navigation, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { saveDocument } from '../firebase/services';

const MOCK_PARTNERS = [
  {
    id: 'tr-1',
    name: 'Kisan Logistics (HR-10-AB-1234)',
    eta: '4 hrs',
    score: 98,
    price: 1200,
    vehicleType: 'Tata Ace',
    rank: 1,
  },
  {
    id: 'tr-2',
    name: 'FastTrack Transports',
    eta: '5 hrs',
    score: 92,
    price: 1100,
    vehicleType: 'Eicher Pro',
    rank: 2,
  },
  {
    id: 'tr-3',
    name: 'Village Movers',
    eta: '6 hrs',
    score: 85,
    price: 950,
    vehicleType: 'Mahindra Bolero Pickup',
    rank: 3,
  }
];

export default function LogisticsAssignmentScreen({ order, onAssigned, onCancel }) {
  const { triggerToast } = useApp();
  const [selectedPartnerId, setSelectedPartnerId] = useState(MOCK_PARTNERS[0].id);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleConfirm = async () => {
    setIsSubmitting(true);
    try {
      const selectedPartner = MOCK_PARTNERS.find(p => p.id === selectedPartnerId);
      const delId = `del-${Date.now().toString().slice(-4)}`;
      const newDelivery = {
        id: delId,
        orderId: order?.id || 'unknown-order',
        transporterId: selectedPartner.id,
        transporterName: selectedPartner.name,
        crop: order?.crop || '',
        quantity: order?.qty || '',
        status: 'Transport Assigned',
        deliveryMode: 'verified'
      };

      await saveDocument('deliveries', delId, newDelivery);
      triggerToast('Logistics partner assigned successfully', 'success');
      onAssigned(newDelivery);
    } catch (error) {
      console.error(error);
      triggerToast('Failed to assign partner', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b flex items-center justify-between bg-green-50">
          <div className="flex items-center gap-2 text-green-800">
            <Truck className="h-6 w-6" />
            <h2 className="text-xl font-bold">Assign Logistics Partner</h2>
          </div>
          <button onClick={onCancel} className="p-1 hover:bg-green-100 rounded-full text-green-700">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          <p className="text-sm text-gray-600 mb-4">
            Select an AgriQ verified logistics partner for order {order?.id}. Ranked based on routing efficiency and reliability.
          </p>

          <div className="space-y-3">
            {MOCK_PARTNERS.map((partner) => (
              <div 
                key={partner.id}
                onClick={() => setSelectedPartnerId(partner.id)}
                className={`p-3 border rounded-lg cursor-pointer transition-all ${
                  selectedPartnerId === partner.id 
                    ? 'border-green-500 bg-green-50 shadow-sm' 
                    : 'border-gray-200 hover:border-green-300'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-start gap-2">
                    <div className="mt-1">
                      {selectedPartnerId === partner.id ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : (
                        <div className="h-5 w-5 rounded-full border-2 border-gray-300" />
                      )}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 flex items-center gap-2">
                        {partner.name}
                        {partner.rank === 1 && (
                          <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
                            <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" /> Top Pick
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-gray-500">{partner.vehicleType}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-gray-900">₹{partner.price}</div>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-sm mt-3 ml-7">
                  <div className="flex items-center gap-1 text-gray-600">
                    <Navigation className="h-4 w-4" /> ETA: {partner.eta}
                  </div>
                  <div className="flex items-center gap-1 text-gray-600">
                    <Star className="h-4 w-4" /> Score: {partner.score}/100
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t flex justify-end gap-3 bg-gray-50">
          <button 
            onClick={onCancel}
            disabled={isSubmitting}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 font-medium"
          >
            Cancel
          </button>
          <button 
            onClick={handleConfirm}
            disabled={isSubmitting}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium disabled:opacity-50"
          >
            {isSubmitting ? 'Assigning...' : 'Confirm Assignment'}
          </button>
        </div>
      </div>
    </div>
  );
}
