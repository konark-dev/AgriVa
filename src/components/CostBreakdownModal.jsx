import React from "react";
import { X, Fuel, UserCheck, Package, Route, Settings2, DollarSign } from "lucide-react";

export default function CostBreakdownModal({
  isOpen,
  onClose,
  breakdown = {},
  costParams = {},
  onUpdateParams,
  totalDistanceKm = 288,
  totalDurationMinutes = 260,
  totalLoadKg = 10000,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-100 text-slate-900 px-6 py-4 border-b border-emerald-200 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold flex items-center gap-2 text-slate-900">
              <DollarSign className="w-5 h-5 text-emerald-600" />
              Logistics Cost Breakdown
            </h3>
            <p className="text-xs text-slate-600">
              Computed from route distance ({totalDistanceKm} km) & duration ({Math.floor(totalDurationMinutes / 60)}h {totalDurationMinutes % 60}m)
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-800 text-xl font-bold p-1 rounded-full hover:bg-emerald-200/50 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Live Breakdown Table */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
            <div className="flex justify-between items-center text-xs sm:text-sm">
              <span className="text-slate-600 flex items-center gap-1.5">
                <span>⛽</span> Fuel Expense (Diesel @ ₹{costParams.fuelPricePerLiter || 94.5}/L)
              </span>
              <span className="font-semibold text-slate-800">₹{(breakdown.fuelCost || 0).toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center text-xs sm:text-sm">
              <span className="text-slate-600 flex items-center gap-1.5">
                <span>👨‍✈️</span> Driver & Crew Wages (@ ₹{costParams.driverHourlyRate || 220}/hr)
              </span>
              <span className="font-semibold text-slate-800">₹{(breakdown.driverCost || 0).toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center text-xs sm:text-sm">
              <span className="text-slate-600 flex items-center gap-1.5">
                <span>📦</span> Loading/Mandi Handling (@ ₹{costParams.loadingUnloadingPerKg || 0.2}/kg)
              </span>
              <span className="font-semibold text-slate-800">₹{(breakdown.loadingUnloadingCost || 0).toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center text-xs sm:text-sm">
              <span className="text-slate-600 flex items-center gap-1.5">
                <span>🛣️</span> NHAI Tolls & Highway Tax (@ ₹{costParams.overheadTollPerKm || 2.8}/km)
              </span>
              <span className="font-semibold text-slate-800">₹{(breakdown.tollOverheadCost || 0).toLocaleString()}</span>
            </div>
            <div className="pt-3 border-t border-slate-300 flex justify-between items-center">
              <span className="font-bold text-slate-900 text-sm sm:text-base">Total Estimated Logistics Cost</span>
              <span className="font-extrabold text-emerald-700 text-lg sm:text-xl">
                ₹{(breakdown.totalCost || 0).toLocaleString()}
              </span>
            </div>
          </div>

          {/* Configurable Parameters Form */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
              <Settings2 className="w-3.5 h-3.5 text-slate-600" />
              Configure Rate Parameters
            </h4>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-slate-600 mb-1 font-medium">Diesel Price (₹/L)</label>
                <input
                  type="number"
                  step="0.5"
                  value={costParams.fuelPricePerLiter || 94.5}
                  onChange={(e) =>
                    onUpdateParams && onUpdateParams({
                      ...costParams,
                      fuelPricePerLiter: parseFloat(e.target.value) || 0,
                    })
                  }
                  className="w-full px-3 py-1.5 border rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-slate-800 font-semibold bg-white"
                />
              </div>

              <div>
                <label className="block text-slate-600 mb-1 font-medium">Fuel Mileage (km/L)</label>
                <input
                  type="number"
                  step="0.1"
                  value={costParams.fuelEfficiencyKmPerLiter || 4.5}
                  onChange={(e) =>
                    onUpdateParams && onUpdateParams({
                      ...costParams,
                      fuelEfficiencyKmPerLiter: parseFloat(e.target.value) || 0.1,
                    })
                  }
                  className="w-full px-3 py-1.5 border rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-slate-800 font-semibold bg-white"
                />
              </div>

              <div>
                <label className="block text-slate-600 mb-1 font-medium">Driver Wage (₹/hr)</label>
                <input
                  type="number"
                  step="10"
                  value={costParams.driverHourlyRate || 220}
                  onChange={(e) =>
                    onUpdateParams && onUpdateParams({
                      ...costParams,
                      driverHourlyRate: parseFloat(e.target.value) || 0,
                    })
                  }
                  className="w-full px-3 py-1.5 border rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-slate-800 font-semibold bg-white"
                />
              </div>

              <div>
                <label className="block text-slate-600 mb-1 font-medium">Handling (₹/kg)</label>
                <input
                  type="number"
                  step="0.05"
                  value={costParams.loadingUnloadingPerKg || 0.2}
                  onChange={(e) =>
                    onUpdateParams && onUpdateParams({
                      ...costParams,
                      loadingUnloadingPerKg: parseFloat(e.target.value) || 0,
                    })
                  }
                  className="w-full px-3 py-1.5 border rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-slate-800 font-semibold bg-white"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-slate-600 mb-1 font-medium">Tolls & Overheads (₹/km)</label>
                <input
                  type="number"
                  step="0.1"
                  value={costParams.overheadTollPerKm || 2.8}
                  onChange={(e) =>
                    onUpdateParams && onUpdateParams({
                      ...costParams,
                      overheadTollPerKm: parseFloat(e.target.value) || 0,
                    })
                  }
                  className="w-full px-3 py-1.5 border rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-slate-800 font-semibold bg-white"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-100 px-6 py-3 flex justify-end border-t border-slate-200">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition"
          >
            Apply & Close
          </button>
        </div>
      </div>
    </div>
  );
}
