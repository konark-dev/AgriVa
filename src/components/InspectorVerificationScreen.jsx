import React, { useState } from 'react';
import { Camera, CheckCircle, Scale, Droplet, Eye, ArrowLeft, Image as ImageIcon } from 'lucide-react';

export default function InspectorVerificationScreen({ lot, onBack, onSubmitVerification }) {
  const [verifiedWeight, setVerifiedWeight] = useState(lot?.quantity || '');
  const [moisture, setMoisture] = useState('');
  const [defects, setDefects] = useState('');
  const [foreignMatter, setForeignMatter] = useState('');
  const [color, setColor] = useState('');
  const [photosCount, setPhotosCount] = useState(0);
  const [error, setError] = useState('');

  const handlePhotoChange = (e) => {
    if (e.target.files) {
      setPhotosCount(e.target.files.length);
    }
  };

  const handleSubmit = () => {
    if (!verifiedWeight || !moisture || !defects || !foreignMatter || !color) {
      setError('Please fill in all inspection fields, including weight.');
      return;
    }
    if (photosCount < 2) {
      setError('Please upload at least 2 inspection photos.');
      return;
    }

    const declaredQty = lot?.quantity || 0;
    const verifiedQty = parseFloat(verifiedWeight);
    const diffPercent = declaredQty > 0 ? (Math.abs(verifiedQty - declaredQty) / declaredQty) * 100 : 0;
    
    let weightFlag = 'ok';
    if (diffPercent > 15) {
      weightFlag = 'escalated';
    } else if (diffPercent > 3) {
      weightFlag = 'adjusted';
    }
    
    setError('');
    onSubmitVerification(lot.id, {
      verifiedWeight: verifiedQty,
      weightFlag,
      moisture: parseFloat(moisture),
      defects: parseFloat(defects),
      foreignMatter: parseFloat(foreignMatter),
      color,
      images: ['mock1.jpg', 'mock2.jpg']
    });
  };

  const farmerQuality = lot?.quality || {};
  const farmerImages = lot?.images || [];

  return (
    <div className="w-full max-w-6xl mx-auto p-4 md:p-6 bg-slate-50 min-h-screen">
      <div className="mb-6 flex items-center space-x-4">
        <button 
          onClick={onBack}
          className="p-2 rounded-full hover:bg-slate-200 text-slate-700 transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Verify Lot: {lot?.id}</h1>
          <p className="text-slate-500">Compare farmer's declaration with actual inspection</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Section 1: Farmer's Self-Declared Info */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h2 className="text-xl font-semibold text-slate-800 mb-4 pb-2 border-b border-slate-100 flex items-center">
            <Eye className="w-5 h-5 mr-2 text-[#2E7D32]" />
            Farmer's Declaration
          </h2>
          
          <div className="space-y-4 mb-6">
            <div className="flex justify-between items-center py-2 border-b border-slate-50">
              <span className="flex items-center text-slate-600"><Droplet className="w-4 h-4 mr-2" /> Moisture</span>
              <span className="font-medium text-slate-800">{farmerQuality.moisture}%</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-slate-50">
              <span className="flex items-center text-slate-600"><Scale className="w-4 h-4 mr-2" /> Defects</span>
              <span className="font-medium text-slate-800">{farmerQuality.defects}%</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-slate-50">
              <span className="flex items-center text-slate-600"><Scale className="w-4 h-4 mr-2" /> Foreign Matter</span>
              <span className="font-medium text-slate-800">{farmerQuality.foreignMatter}%</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="flex items-center text-slate-600"><Eye className="w-4 h-4 mr-2" /> Color</span>
              <span className="font-medium text-slate-800">{farmerQuality.color}</span>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-sm font-medium text-slate-700 mb-3 flex items-center">
              <ImageIcon className="w-4 h-4 mr-2" />
              Farmer's Uploaded Photos
            </h3>
            <div className="grid grid-cols-3 gap-2">
              {farmerImages.length > 0 ? (
                farmerImages.map((img, idx) => (
                  <div key={idx} className="aspect-square bg-slate-100 rounded-lg overflow-hidden border border-slate-200 flex items-center justify-center">
                     {/* Replace with actual image in real app */}
                     <span className="text-xs text-slate-400">Photo {idx + 1}</span>
                  </div>
                ))
              ) : (
                <div className="col-span-3 py-4 text-center text-sm text-slate-500 bg-slate-50 rounded-lg border border-dashed border-slate-300">
                  No photos provided
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Section 2: Inspector's Input Form */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h2 className="text-xl font-semibold text-slate-800 mb-4 pb-2 border-b border-slate-100 flex items-center">
            <CheckCircle className="w-5 h-5 mr-2 text-[#2E7D32]" />
            Inspection Details
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Verified Weight (kg) <span className="text-slate-400 font-normal">(Declared: {lot?.quantity} kg)</span>
              </label>
              <input 
                type="number" 
                value={verifiedWeight}
                onChange={(e) => setVerifiedWeight(e.target.value)}
                className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#2E7D32] focus:border-transparent outline-none"
                placeholder={`e.g. ${lot?.quantity || 100}`}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Moisture (%)</label>
              <input 
                type="number" 
                value={moisture}
                onChange={(e) => setMoisture(e.target.value)}
                className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#2E7D32] focus:border-transparent outline-none"
                placeholder="e.g. 12.5"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Defects (%)</label>
                <input 
                  type="number" 
                  value={defects}
                  onChange={(e) => setDefects(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#2E7D32] focus:border-transparent outline-none"
                  placeholder="e.g. 2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Foreign Matter (%)</label>
                <input 
                  type="number" 
                  value={foreignMatter}
                  onChange={(e) => setForeignMatter(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#2E7D32] focus:border-transparent outline-none"
                  placeholder="e.g. 1.5"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Color / Appearance</label>
              <select 
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#2E7D32] focus:border-transparent outline-none bg-white"
              >
                <option value="">Select color grading...</option>
                <option value="Excellent">Excellent</option>
                <option value="Good">Good</option>
                <option value="Average">Average</option>
                <option value="Poor">Poor</option>
              </select>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100">
              <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center">
                <Camera className="w-4 h-4 mr-2" />
                Upload Inspection Photos (Min 2)
              </label>
              <input 
                type="file" 
                multiple 
                accept="image/*"
                onChange={handlePhotoChange}
                className="block w-full text-sm text-slate-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-green-50 file:text-[#2E7D32]
                  hover:file:bg-green-100 transition-colors"
              />
              {photosCount > 0 && (
                <p className="mt-2 text-sm text-slate-600">{photosCount} file(s) selected</p>
              )}
            </div>
            
            {error && (
              <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm border border-red-100">
                {error}
              </div>
            )}
          </div>

          <div className="mt-8 flex gap-3">
            <button 
              onClick={onBack}
              className="flex-1 py-3 px-4 border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button 
              onClick={handleSubmit}
              className="flex-1 py-3 px-4 bg-[#2E7D32] text-white rounded-lg font-medium hover:bg-[#1B5E20] transition-colors"
            >
              Submit Verified Grade
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
