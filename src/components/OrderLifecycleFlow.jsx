import React, { useState } from "react";
import { CheckCircle2, ArrowDown, Truck, Layers, MapPin, Package, ShieldCheck, Clock, RefreshCw } from "lucide-react";

export default function OrderLifecycleFlow({
  orderId = "KS-1024",
  commodity = "Tomato",
  quantityKg = 10000,
  buyerDestination = "Azadpur APMC Terminal Mandi, Delhi",
  eta = "4h 20m",
  vehicleNumber = "RJ14 GA 5501",
  className = "",
  showControls = true,
  onNavigateToRoute
}) {
  const [viewMode, setViewMode] = useState("visual"); // visual | compact_diagram
  const tonnes = (quantityKg / 1000).toFixed(1);

  return (
    <div className={`rounded-3xl border border-emerald-200 bg-gradient-to-br from-emerald-50/60 via-teal-50/30 to-slate-50 text-slate-900 shadow-lg overflow-hidden transition-all duration-300 ${className}`}>
      {/* Top Banner / Header */}
      <div className="p-6 sm:p-8 border-b border-emerald-200/80 bg-white/90 backdrop-blur-md flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-start sm:items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-700 shrink-0 shadow-xs">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="font-mono text-base font-black px-3.5 py-1 rounded-xl bg-emerald-100 text-emerald-900 border border-emerald-300 tracking-wider">
                Order #{orderId}
              </span>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                Live Fulfillment Flow
              </span>
              <span className="flex items-center gap-2 text-xs font-bold text-emerald-700">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
                In-Transit Dispatch
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1 flex items-center gap-3 flex-wrap">
              <span>{commodity}</span>
              <span className="text-slate-400">•</span>
              <span className="text-emerald-700">{quantityKg.toLocaleString()} kg</span>
              <span className="text-xs font-mono text-slate-500 font-normal">({tonnes}T / 100 qtl)</span>
            </h2>
          </div>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-3 self-start md:self-auto flex-wrap">
          <div className="bg-slate-100 p-1.5 rounded-2xl border border-slate-200 flex items-center text-xs">
            <button
              onClick={() => setViewMode("visual")}
              className={`px-4 py-1.5 rounded-xl font-bold transition ${
                viewMode === "visual"
                  ? "bg-emerald-600 text-white font-extrabold shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Interactive Steps
            </button>
            <button
              onClick={() => setViewMode("compact_diagram")}
              className={`px-4 py-1.5 rounded-xl font-bold transition ${
                viewMode === "compact_diagram"
                  ? "bg-emerald-600 text-white font-extrabold shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Diagram Flow (↓)
            </button>
          </div>

          {showControls && onNavigateToRoute && (
            <button
              onClick={onNavigateToRoute}
              className="px-4 py-2 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
            >
              <span>View Route Optima</span>
              <span>➔</span>
            </button>
          )}
        </div>
      </div>

      {/* View 1: Compact Diagram Flow with ↓ arrows */}
      {viewMode === "compact_diagram" && (
        <div className="p-6 sm:p-10 bg-emerald-50/30">
          <div className="max-w-2xl mx-auto font-mono text-sm space-y-6 bg-white p-6 sm:p-10 rounded-3xl border border-emerald-200 shadow-lg leading-relaxed text-slate-800">
            <div className="pb-4 border-b border-slate-100 flex justify-between items-center text-xs">
              <span className="text-emerald-700 font-bold">Order #{orderId}</span>
              <span className="text-slate-500">{commodity} • {quantityKg.toLocaleString()} kg</span>
            </div>

            {/* Step 1 */}
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <div className="text-xs text-slate-500 font-bold tracking-wider uppercase">Requirement</div>
              <div className="text-slate-900 font-bold text-base">Buyer Requirement</div>
              <div className="text-xs text-slate-600 leading-normal">
                {commodity} • {quantityKg.toLocaleString()} kg ({buyerDestination})
              </div>
            </div>

            <div className="text-center font-bold text-emerald-600 text-xl leading-none">↓</div>

            {/* Step 2 */}
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="text-xs text-slate-500 font-bold tracking-wider uppercase">Farmgate Matching</div>
              <div className="text-slate-900 font-bold text-base">Matched Supply</div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 text-xs">
                <div className="bg-white p-3 rounded-xl border border-slate-200 text-center space-y-1 shadow-xs">
                  <div className="text-slate-600 font-medium">Farmer A</div>
                  <div className="text-emerald-700 font-black text-base">3T</div>
                  <div className="text-[11px] text-slate-500">Ramesh • Chomu</div>
                </div>
                <div className="bg-white p-3 rounded-xl border border-slate-200 text-center space-y-1 shadow-xs">
                  <div className="text-slate-600 font-medium">Farmer B</div>
                  <div className="text-emerald-700 font-black text-base">4T</div>
                  <div className="text-[11px] text-slate-500">Suresh • Ajmer</div>
                </div>
                <div className="bg-white p-3 rounded-xl border border-slate-200 text-center space-y-1 shadow-xs">
                  <div className="text-slate-600 font-medium">Farmer C</div>
                  <div className="text-emerald-700 font-black text-base">3T</div>
                  <div className="text-[11px] text-slate-500">Mukesh • Alwar</div>
                </div>
              </div>
            </div>

            <div className="text-center font-bold text-emerald-600 text-xl leading-none">↓</div>

            {/* Step 3 */}
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <div className="text-xs text-slate-500 font-bold tracking-wider uppercase">Consolidation</div>
              <div className="text-slate-900 font-bold text-base">Aggregation</div>
              <div className="text-xs text-emerald-700 font-bold leading-normal">
                10T consolidated <span className="text-slate-500 font-normal">(3T + 4T + 3T = 10,000 kg exact match)</span>
              </div>
            </div>

            <div className="text-center font-bold text-emerald-600 text-xl leading-none">↓</div>

            {/* Step 4 */}
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <div className="text-xs text-slate-500 font-bold tracking-wider uppercase">Logistics Allocation</div>
              <div className="text-slate-900 font-bold text-base">Transport</div>
              <div className="text-xs text-emerald-700 font-bold leading-normal">
                10T vehicle <span className="text-slate-500 font-normal">(Eicher Pro 3019 • {vehicleNumber})</span>
              </div>
            </div>

            <div className="text-center font-bold text-emerald-600 text-xl leading-none">↓</div>

            {/* Step 5 */}
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="text-xs text-slate-500 font-bold tracking-wider uppercase">Waypoint Planning</div>
              <div className="text-slate-900 font-bold text-base">Optimized Route</div>
              <div className="text-xs text-emerald-700 font-bold flex items-center gap-2 flex-wrap">
                <span>A (Chomu)</span>
                <span className="text-slate-400">→</span>
                <span>B (Ajmer)</span>
                <span className="text-slate-400">→</span>
                <span>C (Alwar)</span>
                <span className="text-slate-400">→</span>
                <span className="text-amber-700">Buyer (Delhi)</span>
                <span className="text-slate-500 font-normal ml-2">(288 km corridor)</span>
              </div>
            </div>

            <div className="text-center font-bold text-emerald-600 text-xl leading-none">↓</div>

            {/* Step 6 */}
            <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50 border border-emerald-300 space-y-2">
              <div className="text-xs text-emerald-800 font-bold tracking-wider uppercase">Arrival Target</div>
              <div className="text-emerald-950 font-bold text-base">Delivery</div>
              <div className="text-xs text-emerald-800 font-bold flex items-center justify-between flex-wrap gap-2">
                <span>ETA {eta}</span>
                <span className="text-xs font-normal text-slate-600">{buyerDestination}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View 2: Interactive Rich Stepper Workflow */}
      {viewMode === "visual" && (
        <div className="p-6 sm:p-10 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative">
            {/* Step 1: Buyer Requirement */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200 hover:border-emerald-400 transition flex flex-col justify-between space-y-6 shadow-sm">
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-xl border border-emerald-300">
                    STEP 1
                  </span>
                  <span className="text-slate-500 font-medium">Demand Input</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <span>📋</span>
                  <span>Buyer Requirement</span>
                </h3>
                <div className="space-y-2 text-xs leading-relaxed">
                  <div className="text-emerald-700 font-bold text-base">
                    {commodity} • {quantityKg.toLocaleString()} kg
                  </div>
                  <div className="text-slate-700">
                    Buyer: <b className="text-slate-900">Delhi Fresh Foods APMC Hub</b>
                  </div>
                  <div className="text-slate-500 leading-normal">
                    Destination: {buyerDestination}
                  </div>
                </div>
              </div>
              <div className="pt-4 border-t border-slate-100 text-xs text-slate-500 flex items-center justify-between">
                <span>Batch requirement confirmed</span>
                <span className="text-emerald-700 font-bold">100% Volume</span>
              </div>
            </div>

            {/* Step 2: Matched Supply */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200 hover:border-emerald-400 transition flex flex-col justify-between space-y-6 shadow-sm">
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono font-bold text-blue-800 bg-blue-100 px-2.5 py-1 rounded-xl border border-blue-300">
                    STEP 2
                  </span>
                  <span className="text-slate-500 font-medium">Multi-Farm Matching</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <span>🚜</span>
                  <span>Matched Supply</span>
                </h3>
                <div className="space-y-2.5 text-xs">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <div>
                      <div className="font-bold text-slate-900">Farmer A</div>
                      <div className="text-xs text-slate-500">Ramesh Kumar • Chomu, Jaipur</div>
                    </div>
                    <span className="font-mono font-black text-emerald-700 text-base">3T</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <div>
                      <div className="font-bold text-slate-900">Farmer B</div>
                      <div className="text-xs text-slate-500">Suresh Kumar • Nasirabad, Ajmer</div>
                    </div>
                    <span className="font-mono font-black text-emerald-700 text-base">4T</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <div>
                      <div className="font-bold text-slate-900">Farmer C</div>
                      <div className="text-xs text-slate-500">Mukesh Kumar • Behror, Alwar</div>
                    </div>
                    <span className="font-mono font-black text-emerald-700 text-base">3T</span>
                  </div>
                </div>
              </div>
              <div className="pt-4 border-t border-slate-100 text-xs text-slate-500 flex items-center justify-between">
                <span>3 Farmgate Nodes</span>
                <span className="text-blue-700 font-bold">3T + 4T + 3T</span>
              </div>
            </div>

            {/* Step 3: Aggregation */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200 hover:border-emerald-400 transition flex flex-col justify-between space-y-6 shadow-sm">
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono font-bold text-purple-800 bg-purple-100 px-2.5 py-1 rounded-xl border border-purple-300">
                    STEP 3
                  </span>
                  <span className="text-slate-500 font-medium">Cluster Math</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <span>📦</span>
                  <span>Aggregation</span>
                </h3>
                <div className="space-y-3 text-xs">
                  <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200 space-y-1">
                    <div className="text-purple-900 font-bold text-base">10T consolidated</div>
                    <p className="text-xs text-slate-700 leading-relaxed">
                      Zero-middleman cluster pooling: 3 fragmented supplies pooled into single unified consignment.
                    </p>
                  </div>
                  <div className="text-slate-600 text-xs space-y-1.5 leading-relaxed">
                    <div>• Dead mileage reduction: <b className="text-emerald-700">64%</b></div>
                    <div>• Packaging standardization: Corrugated Crates</div>
                  </div>
                </div>
              </div>
              <div className="pt-4 border-t border-slate-100 text-xs text-slate-500 flex items-center justify-between">
                <span>Full capacity pool</span>
                <span className="text-purple-700 font-bold">10,000 kg Net</span>
              </div>
            </div>

            {/* Step 4: Transport */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200 hover:border-emerald-400 transition flex flex-col justify-between space-y-6 shadow-sm">
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono font-bold text-amber-800 bg-amber-100 px-2.5 py-1 rounded-xl border border-amber-300">
                    STEP 4
                  </span>
                  <span className="text-slate-500 font-medium">Fleet Allocation</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <span>🚛</span>
                  <span>Transport</span>
                </h3>
                <div className="space-y-3 text-xs">
                  <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 space-y-1">
                    <div className="text-amber-900 font-bold text-base">10T vehicle</div>
                    <div className="text-slate-900 font-semibold">Eicher Pro 3019 Heavy Commercial</div>
                    <div className="font-mono text-slate-500">Reg: {vehicleNumber}</div>
                  </div>
                  <div className="text-slate-700 text-xs space-y-1 leading-relaxed">
                    <div>Carrier: <b className="text-slate-900">Rapid Agri Logistics</b></div>
                    <div>Driver: Mohan Lal (+91 98291 11223)</div>
                  </div>
                </div>
              </div>
              <div className="pt-4 border-t border-slate-100 text-xs text-slate-500 flex items-center justify-between">
                <span>Utilization: 100%</span>
                <span className="text-amber-700 font-bold">No Overload</span>
              </div>
            </div>

            {/* Step 5: Optimized Route */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200 hover:border-emerald-400 transition flex flex-col justify-between space-y-6 shadow-sm">
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono font-bold text-cyan-800 bg-cyan-100 px-2.5 py-1 rounded-xl border border-cyan-300">
                    STEP 5
                  </span>
                  <span className="text-slate-500 font-medium">Highway Corridors</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <span>🗺️</span>
                  <span>Optimized Route</span>
                </h3>
                <div className="space-y-3 text-xs">
                  <div className="p-3 rounded-2xl bg-cyan-50 border border-cyan-200">
                    <div className="font-mono font-bold text-cyan-900 text-base tracking-wider">
                      A → B → C → Buyer
                    </div>
                  </div>
                  <div className="space-y-2 text-xs text-slate-700 leading-relaxed">
                    <div className="flex items-center gap-2">
                      <span className="w-4 h-4 rounded-full bg-slate-200 text-slate-700 font-bold flex items-center justify-center text-[10px]">1</span>
                      <span>Stop A: Chomu (+3,000 kg)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-4 h-4 rounded-full bg-slate-200 text-slate-700 font-bold flex items-center justify-center text-[10px]">2</span>
                      <span>Stop B: Nasirabad (+4,000 kg)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-4 h-4 rounded-full bg-slate-200 text-slate-700 font-bold flex items-center justify-center text-[10px]">3</span>
                      <span>Stop C: Behror (+3,000 kg)</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="pt-4 border-t border-slate-100 text-xs text-slate-500 flex items-center justify-between">
                <span>Total Transit: 288 km</span>
                <span className="text-cyan-700 font-bold">NH-48 Corridor</span>
              </div>
            </div>

            {/* Step 6: Delivery */}
            <div className="p-6 rounded-3xl bg-gradient-to-br from-emerald-100/70 to-teal-50 border border-emerald-300 transition flex flex-col justify-between shadow-md space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono font-bold text-emerald-900 bg-emerald-200 px-2.5 py-1 rounded-xl border border-emerald-400">
                    STEP 6
                  </span>
                  <span className="text-emerald-700 flex items-center gap-1.5 font-semibold">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    Live Tracking
                  </span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <span>🏁</span>
                  <span>Delivery</span>
                </h3>
                <div className="space-y-3 text-xs">
                  <div className="p-4 rounded-2xl bg-white border border-emerald-200 space-y-1 shadow-xs">
                    <div className="text-emerald-800 font-black text-2xl">ETA {eta}</div>
                    <div className="text-slate-600 text-xs">Arrival Window: Today, 18:40 IST</div>
                  </div>
                  <div className="text-xs text-slate-700 space-y-1 leading-relaxed">
                    <div>Location: {buyerDestination}</div>
                    <div>Digital Gate Pass: <b className="font-mono text-emerald-700">GP-1024-DEL</b></div>
                  </div>
                </div>
              </div>
              <div className="pt-4 border-t border-emerald-200 text-xs text-emerald-800 flex items-center justify-between font-semibold">
                <span>Final Verification</span>
                <span>Active On-Road</span>
              </div>
            </div>
          </div>

          {/* Quick Flow Summary Bar */}
          <div className="p-5 rounded-3xl bg-white border border-emerald-200 flex flex-wrap items-center justify-between gap-4 text-xs leading-relaxed shadow-xs">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="font-semibold text-slate-500">Workflow Chain:</span>
              <span className="font-bold text-slate-900">Buyer Requirement</span>
              <span className="text-emerald-600 font-bold">➔</span>
              <span className="font-bold text-blue-700">Matched Supply (3 Farmers)</span>
              <span className="text-emerald-600 font-bold">➔</span>
              <span className="font-bold text-purple-700">10T Aggregation</span>
              <span className="text-emerald-600 font-bold">➔</span>
              <span className="font-bold text-amber-700">10T Vehicle</span>
              <span className="text-emerald-600 font-bold">➔</span>
              <span className="font-bold text-cyan-700">A → B → C Route</span>
              <span className="text-emerald-600 font-bold">➔</span>
              <span className="font-bold text-emerald-700">Delivery (ETA {eta})</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
