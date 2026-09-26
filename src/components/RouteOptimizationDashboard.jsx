import React, { useState, useEffect } from "react";
import { optimizeKisanSetuRoute } from "../utils/kisanOptimizer";
import CostBreakdownModal from "./CostBreakdownModal";
import AdminOptimizationDemoModal from "./AdminOptimizationDemoModal";
import { Truck, Plus, Trash2, MapPin, Zap, RefreshCw, CheckCircle2, AlertTriangle, Layers, DollarSign, Clock, ShieldCheck } from "lucide-react";

export default function RouteOptimizationDashboard() {
  // Input State
  const [deal, setDeal] = useState({
    buyerName: "Azadpur APMC Mandi, Delhi",
    commodity: "Tomato",
    destination: "Azadpur Terminal Mandi, North Delhi",
    destLat: 28.7159,
    destLng: 77.1772,
    deliveryDeadline: "18:00",
    totalQuantityKg: 10000,
  });

  const [fpos, setFpos] = useState([
    {
      id: "fpo-1",
      name: "Chomu Farmer Producer Org",
      locationName: "Chomu Mandi, Jaipur",
      lat: 27.1738,
      lng: 75.7236,
      quantityKg: 3000,
      farmerName: "Farmer A (Ramesh Kumar)",
      timeWindow: ["08:00", "14:00"],
    },
    {
      id: "fpo-2",
      name: "Ajmer Agro Cooperative",
      locationName: "Nasirabad Road, Ajmer",
      lat: 26.425,
      lng: 74.652,
      quantityKg: 4000,
      farmerName: "Farmer B (Suresh Kumar)",
      timeWindow: ["08:00", "14:00"],
    },
    {
      id: "fpo-3",
      name: "Alwar Produce Cluster",
      locationName: "Behror Rural Hub, Alwar",
      lat: 27.887,
      lng: 76.281,
      quantityKg: 3000,
      farmerName: "Farmer C (Mukesh Kumar)",
      timeWindow: ["08:00", "14:00"],
    },
  ]);

  const [vehicles, setVehicles] = useState([
    {
      id: "v-1",
      name: "Eicher Pro 3019 (10T Commercial)",
      vehicleNumber: "RJ14 GA 5501",
      capacityKg: 10000,
      startLocation: { name: "Regional Transport Hub", lat: 26.9, lng: 75.8 },
      availableFrom: "07:00",
      availableUntil: "21:00",
    },
    {
      id: "v-2",
      name: "Tata LPT 1613 (7T Truck)",
      vehicleNumber: "RJ14 GB 8892",
      capacityKg: 7000,
      startLocation: { name: "Jaipur Depot", lat: 26.92, lng: 75.82 },
      availableFrom: "07:00",
      availableUntil: "21:00",
    },
  ]);

  const [costParams, setCostParams] = useState({
    fuelPricePerLiter: 94.5,
    fuelEfficiencyKmPerLiter: 4.5,
    driverHourlyRate: 220,
    loadingUnloadingPerKg: 0.2,
    overheadTollPerKm: 2.8,
  });

  // Optimization Result State
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [result, setResult] = useState(null);
  const [selectedVehicleId, setSelectedVehicleId] = useState(null);
  const [isCostModalOpen, setIsCostModalOpen] = useState(false);
  const [isAdminBenchmarkOpen, setIsAdminBenchmarkOpen] = useState(false);
  const [dispatchStatus, setDispatchStatus] = useState(null);
  const [apiError, setApiError] = useState(null);

  // Sync Deal total quantity with sum of FPOs
  useEffect(() => {
    const totalFpoQty = fpos.reduce((sum, f) => sum + (Number(f.quantityKg) || 0), 0);
    setDeal((prev) => ({ ...prev, totalQuantityKg: totalFpoQty }));
  }, [fpos]);

  const handleAddFPO = () => {
    const newFpo = {
      id: `fpo-${Date.now()}`,
      name: `FPO Cluster ${fpos.length + 1}`,
      locationName: "Sikar Road, Rajasthan",
      lat: 27.2 + Math.random() * 0.4,
      lng: 75.6 + Math.random() * 0.5,
      quantityKg: 2000,
      farmerName: `Farmer ${String.fromCharCode(68 + fpos.length)}`,
      timeWindow: ["08:00", "14:00"],
    };
    setFpos([...fpos, newFpo]);
  };

  const handleRemoveFPO = (id) => {
    if (fpos.length <= 1) {
      alert("At least 1 FPO pickup point is required.");
      return;
    }
    setFpos(fpos.filter((f) => f.id !== id));
  };

  const handleAddVehicle = () => {
    const newVeh = {
      id: `truck-${Date.now()}`,
      name: `Commercial Truck ${vehicles.length + 1}`,
      vehicleNumber: `RJ14 GC ${1000 + vehicles.length * 111}`,
      capacityKg: 8000,
      startLocation: { name: "Regional Transport Hub", lat: 26.9, lng: 75.8 },
      availableFrom: "07:00",
      availableUntil: "21:00",
    };
    setVehicles([...vehicles, newVeh]);
  };

  const handleRemoveVehicle = (id) => {
    if (vehicles.length <= 1) {
      alert("At least 1 vehicle is required.");
      return;
    }
    setVehicles(vehicles.filter((v) => v.id !== id));
  };

  const handleOptimize = async () => {
    setIsOptimizing(true);
    setApiError(null);
    setDispatchStatus(null);

    try {
      const res = await optimizeKisanSetuRoute(
        {
          id: "deal-sih-1",
          buyerName: deal.buyerName,
          commodity: deal.commodity,
          destination: deal.destination,
          destLat: deal.destLat,
          destLng: deal.destLng,
        },
        fpos,
        vehicles,
        costParams
      );

      setResult(res);
    } catch (err) {
      console.error("Optimization failed:", err);
      setApiError("Failed to calculate optimal route.");
    } finally {
      setIsOptimizing(false);
    }
  };

  const handleAcceptRoute = () => {
    setDispatchStatus("DISPATCHED");
  };

  return (
    <div className="space-y-8 text-slate-800 font-sans p-2 sm:p-4 leading-relaxed">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-100/80 text-slate-900 p-6 sm:p-8 rounded-3xl shadow-sm border border-emerald-200 flex flex-wrap items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-100 border border-emerald-300 flex items-center justify-center font-bold text-3xl shadow-inner text-emerald-800 shrink-0">
            🌾
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">KisanRoute Optima</h1>
              <span className="text-xs bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold px-3 py-1 rounded-full">
                Multi-Vehicle Agriculture Solver
              </span>
            </div>
            <p className="text-sm text-slate-600 leading-normal">
              Combinatorial Vehicle Fleet Capacity Batching & Road Geometry Engine
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={() => setIsAdminBenchmarkOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-2xl text-xs font-bold transition shadow-sm"
          >
            <Zap className="w-4 h-4 text-amber-600" />
            Before/After Benchmark
          </button>
          <button
            onClick={() => setIsCostModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-2xl text-xs font-bold transition shadow-sm"
          >
            <DollarSign className="w-4 h-4 text-emerald-600" />
            Cost Parameters
          </button>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT COLUMN: Inputs */}
        <div className="lg:col-span-5 space-y-6">
          {/* Card 1: Deal Specification */}
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200/90 overflow-hidden transition">
            <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <span>🏢</span> Shipment / Deal Specification
              </h2>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                Buyer Mandi
              </span>
            </div>
            <div className="p-6 space-y-4 text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1.5 text-xs">Buyer / Mandi Name</label>
                  <input
                    type="text"
                    value={deal.buyerName}
                    onChange={(e) => setDeal({ ...deal, buyerName: e.target.value })}
                    className="w-full px-3.5 py-2.5 border rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none text-slate-800 font-semibold bg-slate-50/50"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1.5 text-xs">Commodity</label>
                  <input
                    type="text"
                    value={deal.commodity}
                    onChange={(e) => setDeal({ ...deal, commodity: e.target.value })}
                    className="w-full px-3.5 py-2.5 border rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none text-slate-800 font-semibold bg-slate-50/50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1.5 text-xs">Destination Location</label>
                <input
                  type="text"
                  value={deal.destination}
                  onChange={(e) => setDeal({ ...deal, destination: e.target.value })}
                  className="w-full px-3.5 py-2.5 border rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none text-slate-800 bg-slate-50/50"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-slate-600">
                <span className="text-xs font-medium">Total Requirement Demand:</span>
                <span className="text-base font-black text-slate-900">
                  {deal.totalQuantityKg.toLocaleString()} kg ({(deal.totalQuantityKg / 1000).toFixed(1)} MT)
                </span>
              </div>
            </div>
          </div>

          {/* Card 2: FPO Pickup Nodes */}
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200/90 overflow-hidden transition">
            <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">🌾 FPO Pickup Points</h2>
                <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2.5 py-0.5 rounded-full">
                  {fpos.length} FPOs
                </span>
              </div>
              <button
                onClick={handleAddFPO}
                className="text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 px-3 py-1.5 rounded-xl transition flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" /> Add FPO
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[420px] overflow-y-auto custom-scrollbar">
              {fpos.map((fpo, index) => (
                <div
                  key={fpo.id}
                  className="bg-slate-50/90 p-4 rounded-2xl border border-slate-200/90 relative text-xs hover:border-emerald-400 transition space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-emerald-900 text-sm flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold">
                        {index + 1}
                      </span>
                      {fpo.name}
                    </span>

                    {fpos.length > 1 && (
                      <button
                        onClick={() => handleRemoveFPO(fpo.id)}
                        className="text-red-500 hover:text-red-700 font-semibold p-1.5 rounded-lg hover:bg-red-50 transition"
                        title="Remove FPO"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-slate-500 font-medium block mb-1">Farmer / FPO Name</label>
                      <input
                        type="text"
                        value={fpo.farmerName}
                        onChange={(e) => {
                          const updated = [...fpos];
                          updated[index].farmerName = e.target.value;
                          setFpos(updated);
                        }}
                        className="w-full px-3 py-2 border rounded-xl text-slate-800 bg-white font-medium"
                      />
                    </div>
                    <div>
                      <label className="text-slate-500 font-medium block mb-1">Pickup Payload (kg)</label>
                      <input
                        type="number"
                        step="500"
                        value={fpo.quantityKg}
                        onChange={(e) => {
                          const updated = [...fpos];
                          updated[index].quantityKg = parseFloat(e.target.value) || 0;
                          setFpos(updated);
                        }}
                        className="w-full px-3 py-2 border rounded-xl text-slate-800 font-bold bg-white"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Card 3: Vehicles Fleet */}
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200/90 overflow-hidden transition">
            <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">🚛 Commercial Vehicle Fleet</h2>
                <span className="text-xs bg-slate-200 text-slate-800 font-bold px-2.5 py-0.5 rounded-full">
                  {vehicles.length} Trucks
                </span>
              </div>
              <button
                onClick={handleAddVehicle}
                className="text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-300 px-3 py-1.5 rounded-xl transition flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" /> Add Truck
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[360px] overflow-y-auto custom-scrollbar">
              {vehicles.map((veh, index) => (
                <div
                  key={veh.id}
                  className="bg-slate-50/90 p-4 rounded-2xl border border-slate-200/90 relative text-xs hover:border-blue-300 transition space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-sm flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-slate-800 text-white flex items-center justify-center text-xs font-bold">
                        {index + 1}
                      </span>
                      {veh.name}
                    </span>

                    {vehicles.length > 1 && (
                      <button
                        onClick={() => handleRemoveVehicle(veh.id)}
                        className="text-red-500 hover:text-red-700 p-1.5 rounded-lg hover:bg-red-50 transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-slate-500 font-medium block mb-1">Vehicle Registration</label>
                      <input
                        type="text"
                        value={veh.vehicleNumber}
                        onChange={(e) => {
                          const updated = [...vehicles];
                          updated[index].vehicleNumber = e.target.value;
                          setVehicles(updated);
                        }}
                        className="w-full px-3 py-2 border rounded-xl text-slate-800 bg-white font-medium"
                      />
                    </div>
                    <div>
                      <label className="text-slate-500 font-medium block mb-1">Max Capacity (kg)</label>
                      <input
                        type="number"
                        step="500"
                        value={veh.capacityKg}
                        onChange={(e) => {
                          const updated = [...vehicles];
                          updated[index].capacityKg = parseFloat(e.target.value) || 0;
                          setVehicles(updated);
                        }}
                        className="w-full px-3 py-2 border rounded-xl text-slate-800 font-bold bg-white"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Primary Action Button */}
          <button
            onClick={handleOptimize}
            disabled={isOptimizing}
            className="w-full py-5 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white font-black rounded-3xl shadow-xl shadow-emerald-700/25 text-base flex items-center justify-center gap-3 transition disabled:opacity-60 cursor-pointer"
          >
            {isOptimizing ? (
              <>
                <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Solving Multi-Vehicle Combinatorial Route...</span>
              </>
            ) : (
              <>
                <span>🚀</span> OPTIMIZE ROUTES NOW
              </>
            )}
          </button>
        </div>

        {/* RIGHT COLUMN: Optimization Results & Routing Manifest */}
        <div className="lg:col-span-7 space-y-6">
          {dispatchStatus && (
            <div className="bg-emerald-50 border-2 border-emerald-300 rounded-3xl p-5 text-emerald-900 shadow-sm flex items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <CheckCircle2 className="w-7 h-7 text-emerald-600 shrink-0" />
                <div className="space-y-0.5">
                  <h3 className="font-bold text-base">Fleet Dispatched Successfully!</h3>
                  <p className="text-xs text-emerald-700">Digital manifest sent to truck drivers and APMC buyer terminal.</p>
                </div>
              </div>
              <span className="px-4 py-1.5 bg-emerald-600 text-white font-bold rounded-xl text-xs tracking-wide">
                DISPATCHED
              </span>
            </div>
          )}

          {result && result.success ? (
            <div className="space-y-6 animate-in fade-in duration-300">
              {/* Summary Cards Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-4">
                <div className="bg-white p-4 rounded-3xl border border-slate-200/90 shadow-sm space-y-1">
                  <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">TOTAL FPOs</div>
                  <div className="text-2xl font-black text-slate-900">{result.totalFposServed}</div>
                  <div className="text-xs text-slate-400">nodes pooled</div>
                </div>

                <div className="bg-white p-4 rounded-3xl border border-slate-200/90 shadow-sm space-y-1">
                  <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">TRUCKS USED</div>
                  <div className="text-2xl font-black text-blue-700">{result.totalVehiclesUsed}</div>
                  <div className="text-xs text-slate-400">of {vehicles.length} in fleet</div>
                </div>

                <div className="bg-white p-4 rounded-3xl border border-slate-200/90 shadow-sm space-y-1">
                  <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">TOTAL LOAD</div>
                  <div className="text-xl font-black text-emerald-700">
                    {result.totalLoadKg.toLocaleString()} <span className="text-xs font-normal">kg</span>
                  </div>
                  <div className="text-xs text-slate-400">{(result.totalLoadKg / 1000).toFixed(1)} MT Net</div>
                </div>

                <div className="bg-white p-4 rounded-3xl border border-slate-200/90 shadow-sm space-y-1">
                  <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">DISTANCE</div>
                  <div className="text-xl font-black text-slate-900">
                    {result.totalDistanceKm} <span className="text-xs font-normal">km</span>
                  </div>
                  <div className="text-xs text-slate-400">highway corridor</div>
                </div>

                <div className="bg-white p-4 rounded-3xl border border-slate-200/90 shadow-sm space-y-1">
                  <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">TRAVEL TIME</div>
                  <div className="text-xl font-black text-slate-900">
                    {Math.floor(result.totalDurationMinutes / 60)}h {result.totalDurationMinutes % 60}m
                  </div>
                  <div className="text-xs text-slate-400">incl. mandi load</div>
                </div>

                <div className="bg-emerald-50/80 p-4 rounded-3xl border border-emerald-200 shadow-sm space-y-1">
                  <div className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">LOGISTICS COST</div>
                  <div className="text-xl font-black text-emerald-900">
                    ₹{result.estimatedCost.toLocaleString()}
                  </div>
                  <button
                    onClick={() => setIsCostModalOpen(true)}
                    className="text-xs text-emerald-700 font-bold hover:underline cursor-pointer block mt-1"
                  >
                    View Breakdown &rsaquo;
                  </button>
                </div>
              </div>

              {/* Action Bar */}
              <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/90 flex flex-wrap items-center justify-between gap-4 shadow-sm">
                <div className="flex items-center gap-3 text-xs text-slate-600 flex-wrap">
                  <span><strong className="text-slate-900">Computation:</strong> {result.computationTimeMs}ms</span>
                  <span className="text-slate-300">•</span>
                  <span><strong className="text-slate-900">Engine:</strong> {result.routingEngine}</span>
                </div>
                <button
                  onClick={handleAcceptRoute}
                  disabled={dispatchStatus === "DISPATCHED"}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white rounded-2xl text-xs font-bold transition shadow-sm"
                >
                  {dispatchStatus === "DISPATCHED" ? "✓ Route Dispatched" : "Accept & Dispatch Fleet"}
                </button>
              </div>

              {/* Per-Vehicle Routing Manifest Cards */}
              <div className="space-y-4">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <span>🗺️</span> Vehicle Routing Manifest ({result.routes.length} Trucks)
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {result.routes.map((route, rIdx) => (
                    <div
                      key={route.vehicleId}
                      className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-sm space-y-4"
                    >
                      <div className="flex items-start justify-between pb-3 border-b border-slate-100">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span
                              className="w-3.5 h-3.5 rounded-full inline-block"
                              style={{ backgroundColor: route.color }}
                            ></span>
                            <h4 className="font-bold text-base text-slate-900">{route.vehicleName}</h4>
                          </div>
                          <div className="text-xs text-slate-500">
                            Reg: <b>{route.vehicleNumber}</b> • Distance: <b>{route.distanceKm} km</b>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-sm font-black text-emerald-700 block">
                            ₹{route.costBreakdown.totalCost.toLocaleString()}
                          </span>
                          <div className="text-xs text-slate-400 mt-0.5">
                            {Math.floor(route.durationMinutes / 60)}h {route.durationMinutes % 60}m
                          </div>
                        </div>
                      </div>

                      {/* Payload Capacity Bar */}
                      <div className="space-y-1.5">
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-slate-500 font-medium">Payload Utilization</span>
                          <span className="font-bold text-slate-800">
                            {route.loadKg.toLocaleString()} / {route.capacityKg.toLocaleString()} kg ({route.utilizationPercent}%)
                          </span>
                        </div>
                        <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{
                              width: `${Math.min(100, route.utilizationPercent)}%`,
                              backgroundColor: route.color,
                            }}
                          ></div>
                        </div>
                      </div>

                      {/* Stop Sequence List */}
                      <div className="space-y-2 pt-2">
                        <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                          Stop Sequence & ETAs:
                        </div>
                        <div className="space-y-2">
                          {route.stops.map((stop, sIdx) => (
                            <div key={stop.id || sIdx} className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                              <span className="font-semibold text-slate-800 flex items-center gap-2">
                                <span className="w-4 h-4 rounded-full bg-slate-800 text-white flex items-center justify-center text-[10px] font-bold">
                                  {stop.sequence}
                                </span>
                                {stop.name}
                              </span>
                              <span className="font-mono text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-2.5 py-1 rounded-lg">
                                ETA {stop.eta}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white p-10 rounded-3xl border border-slate-200/90 text-center space-y-4 shadow-sm">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                <Truck className="w-7 h-7" />
              </div>
              <h3 className="font-bold text-slate-900 text-lg">Ready for Route Optimization</h3>
              <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
                Click <b>OPTIMIZE ROUTES NOW</b> on the left to compute optimal vehicle batching, road distance, travel duration, and transparent logistics cost.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <CostBreakdownModal
        isOpen={isCostModalOpen}
        onClose={() => setIsCostModalOpen(false)}
        breakdown={result?.routes?.[0]?.costBreakdown || {}}
        costParams={costParams}
        onUpdateParams={(newParams) => setCostParams(newParams)}
        totalDistanceKm={result?.totalDistanceKm || 288}
        totalDurationMinutes={result?.totalDurationMinutes || 260}
        totalLoadKg={result?.totalLoadKg || 10000}
      />

      <AdminOptimizationDemoModal
        isOpen={isAdminBenchmarkOpen}
        onClose={() => setIsAdminBenchmarkOpen(false)}
      />
    </div>
  );
}
