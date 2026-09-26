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
    <div className={`rounded-3xl border border-emerald-500/30 bg-gradient-to-br from-slate-900 via-slate-900/95 to-slate-950 text-white shadow-2xl overflow-hidden transition-all duration-300 ${className}`}>
      {/* Top Banner / Header */}
      <div className="p-5 sm:p-6 border-b border-slate-800/80 bg-slate-950/60 backdrop-blur-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 shadow-inner">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="font-mono text-sm sm:text-base font-black px-3 py-1 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 tracking-wider">
                Order #{orderId}
              </span>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                Live Fulfillment Flow
              </span>
              <span className="flex items-center gap-1.5 text-xs font-medium text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                In-Transit Dispatch
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white mt-1.5 flex items-center gap-2">
              <span>{commodity}</span>
              <span className="text-slate-500">•</span>
              <span className="text-emerald-400">{quantityKg.toLocaleString()} kg</span>
              <span className="text-xs font-mono text-slate-400 font-normal">({tonnes}T / 100 qtl)</span>
            </h2>
          </div>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          <div className="bg-slate-800/80 p-1 rounded-xl border border-slate-700/80 flex items-center text-xs">
            <button
              onClick={() => setViewMode("visual")}
              className={`px-3 py-1 rounded-lg font-medium transition ${
                viewMode === "visual"
                  ? "bg-emerald-500 text-slate-950 font-bold shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Interactive Steps
            </button>
            <button
              onClick={() => setViewMode("compact_diagram")}
              className={`px-3 py-1 rounded-lg font-medium transition ${
                viewMode === "compact_diagram"
                  ? "bg-emerald-500 text-slate-950 font-bold shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Diagram Flow (↓)
            </button>
          </div>

          {showControls && onNavigateToRoute && (
            <button
              onClick={onNavigateToRoute}
              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center gap-1"
            >
              <span>View Route Optima</span>
              <span>➔</span>
            </button>
          )}
        </div>
      </div>

      {/* View 1: Compact Diagram Flow with ↓ arrows */}
      {viewMode === "compact_diagram" && (
        <div className="p-6 sm:p-8 bg-slate-950/40">
          <div className="max-w-xl mx-auto font-mono text-sm space-y-4 bg-slate-900/90 p-6 sm:p-8 rounded-2xl border border-slate-800 shadow-xl">
            <div className="pb-3 border-b border-slate-800 flex justify-between items-center text-xs">
              <span className="text-emerald-400 font-bold">Order #{orderId}</span>
              <span className="text-slate-400">{commodity} • {quantityKg.toLocaleString()} kg</span>
            </div>

            {/* Step 1 */}
            <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60">
              <div className="text-xs text-slate-400 font-bold tracking-wider uppercase">Requirement</div>
              <div className="text-white font-bold text-base mt-0.5">Buyer Requirement</div>
              <div className="text-xs text-slate-300 mt-1">
                {commodity} • {quantityKg.toLocaleString()} kg ({buyerDestination})
              </div>
            </div>

            <div className="text-center font-bold text-emerald-400 text-lg leading-none">↓</div>

            {/* Step 2 */}
            <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-1.5">
              <div className="text-xs text-slate-400 font-bold tracking-wider uppercase">Farmgate Matching</div>
              <div className="text-white font-bold text-base">Matched Supply</div>
              <div className="grid grid-cols-3 gap-2 pt-1 text-xs">
                <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-700 text-center">
                  <div className="text-slate-300 font-medium">Farmer A</div>
                  <div className="text-emerald-400 font-black text-sm mt-0.5">3T</div>
                  <div className="text-[10px] text-slate-400 truncate">Ramesh • Chomu</div>
                </div>
                <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-700 text-center">
                  <div className="text-slate-300 font-medium">Farmer B</div>
                  <div className="text-emerald-400 font-black text-sm mt-0.5">4T</div>
                  <div className="text-[10px] text-slate-400 truncate">Suresh • Ajmer</div>
                </div>
                <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-700 text-center">
                  <div className="text-slate-300 font-medium">Farmer C</div>
                  <div className="text-emerald-400 font-black text-sm mt-0.5">3T</div>
                  <div className="text-[10px] text-slate-400 truncate">Mukesh • Alwar</div>
                </div>
              </div>
            </div>

            <div className="text-center font-bold text-emerald-400 text-lg leading-none">↓</div>

            {/* Step 3 */}
            <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60">
              <div className="text-xs text-slate-400 font-bold tracking-wider uppercase">Consolidation</div>
              <div className="text-white font-bold text-base mt-0.5">Aggregation</div>
              <div className="text-xs text-emerald-300 font-bold mt-1">
                10T consolidated <span className="text-slate-400 font-normal">(3T + 4T + 3T = 10,000 kg exact match)</span>
              </div>
            </div>

            <div className="text-center font-bold text-emerald-400 text-lg leading-none">↓</div>

            {/* Step 4 */}
            <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60">
              <div className="text-xs text-slate-400 font-bold tracking-wider uppercase">Logistics Allocation</div>
              <div className="text-white font-bold text-base mt-0.5">Transport</div>
              <div className="text-xs text-emerald-300 font-bold mt-1">
                10T vehicle <span className="text-slate-400 font-normal">(Eicher Pro 3019 • {vehicleNumber})</span>
              </div>
            </div>

            <div className="text-center font-bold text-emerald-400 text-lg leading-none">↓</div>

            {/* Step 5 */}
            <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60">
              <div className="text-xs text-slate-400 font-bold tracking-wider uppercase">Waypoint Planning</div>
              <div className="text-white font-bold text-base mt-0.5">Optimized Route</div>
              <div className="text-xs text-emerald-400 font-bold mt-1 flex items-center gap-1.5 flex-wrap">
                <span>A (Chomu)</span>
                <span className="text-slate-400">→</span>
                <span>B (Ajmer)</span>
                <span className="text-slate-400">→</span>
                <span>C (Alwar)</span>
                <span className="text-slate-400">→</span>
                <span className="text-amber-300">Buyer (Delhi)</span>
                <span className="text-slate-400 font-normal ml-2">(288 km corridor)</span>
              </div>
            </div>

            <div className="text-center font-bold text-emerald-400 text-lg leading-none">↓</div>

            {/* Step 6 */}
            <div className="p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-600/50">
              <div className="text-xs text-emerald-400 font-bold tracking-wider uppercase">Arrival Target</div>
              <div className="text-white font-bold text-base mt-0.5">Delivery</div>
              <div className="text-xs text-emerald-300 font-bold mt-1 flex items-center justify-between">
                <span>ETA {eta}</span>
                <span className="text-[11px] font-normal text-slate-300">{buyerDestination}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View 2: Interactive Rich Stepper Workflow */}
      {viewMode === "visual" && (
        <div className="p-6 sm:p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 relative">
            {/* Step 1: Buyer Requirement */}
            <div className="p-5 rounded-2xl bg-slate-850/80 border border-slate-800 hover:border-emerald-500/40 transition flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-mono font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800/80">
                    STEP 1
                  </span>
                  <span className="text-slate-400">Demand Input</span>
                </div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <span>📋</span>
                  <span>Buyer Requirement</span>
                </h3>
                <div className="mt-3 space-y-1.5 text-xs">
                  <div className="text-emerald-400 font-bold text-sm">
                    {commodity} • {quantityKg.toLocaleString()} kg
                  </div>
                  <div className="text-slate-300">
                    Buyer: <b className="text-white">Delhi Fresh Foods APMC Hub</b>
                  </div>
                  <div className="text-slate-400">
                    Destination: {buyerDestination}
                  </div>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
                <span>Batch requirement confirmed</span>
                <span className="text-emerald-400 font-bold">100% Volume</span>
              </div>
            </div>

            {/* Step 2: Matched Supply */}
            <div className="p-5 rounded-2xl bg-slate-850/80 border border-slate-800 hover:border-emerald-500/40 transition flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-mono font-bold text-blue-400 bg-blue-950/80 px-2 py-0.5 rounded border border-blue-800/80">
                    STEP 2
                  </span>
                  <span className="text-slate-400">Multi-Farm Matching</span>
                </div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <span>🚜</span>
                  <span>Matched Supply</span>
                </h3>
                <div className="mt-3 space-y-2 text-xs">
                  <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/80 border border-slate-800">
                    <div>
                      <div className="font-bold text-white">Farmer A</div>
                      <div className="text-[10px] text-slate-400">Ramesh Kumar • Chomu, Jaipur</div>
                    </div>
                    <span className="font-mono font-black text-emerald-400 text-sm">3T</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/80 border border-slate-800">
                    <div>
                      <div className="font-bold text-white">Farmer B</div>
                      <div className="text-[10px] text-slate-400">Suresh Kumar • Nasirabad, Ajmer</div>
                    </div>
                    <span className="font-mono font-black text-emerald-400 text-sm">4T</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/80 border border-slate-800">
                    <div>
                      <div className="font-bold text-white">Farmer C</div>
                      <div className="text-[10px] text-slate-400">Mukesh Kumar • Behror, Alwar</div>
                    </div>
                    <span className="font-mono font-black text-emerald-400 text-sm">3T</span>
                  </div>
                </div>
              </div>
              <div className="mt-3 pt-2 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
                <span>3 Farmgate Nodes</span>
                <span className="text-blue-400 font-bold">3T + 4T + 3T</span>
              </div>
            </div>

            {/* Step 3: Aggregation */}
            <div className="p-5 rounded-2xl bg-slate-850/80 border border-slate-800 hover:border-emerald-500/40 transition flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-mono font-bold text-purple-400 bg-purple-950/80 px-2 py-0.5 rounded border border-purple-800/80">
                    STEP 3
                  </span>
                  <span className="text-slate-400">Cluster Math</span>
                </div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <span>📦</span>
                  <span>Aggregation</span>
                </h3>
                <div className="mt-3 space-y-2 text-xs">
                  <div className="p-3 rounded-xl bg-purple-950/40 border border-purple-800/50">
                    <div className="text-purple-300 font-bold text-sm">10T consolidated</div>
                    <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
                      Zero-middleman cluster pooling: 3 fragmented supplies pooled into single unified consignment.
                    </p>
                  </div>
                  <div className="text-slate-400 text-[11px] space-y-1">
                    <div>• Dead mileage reduction: <b className="text-emerald-400">64%</b></div>
                    <div>• Packaging standardization: Corrugated Crates</div>
                  </div>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
                <span>Full capacity pool</span>
                <span className="text-purple-400 font-bold">10,000 kg Net</span>
              </div>
            </div>

            {/* Step 4: Transport */}
            <div className="p-5 rounded-2xl bg-slate-850/80 border border-slate-800 hover:border-emerald-500/40 transition flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-mono font-bold text-amber-400 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-800/80">
                    STEP 4
                  </span>
                  <span className="text-slate-400">Fleet Allocation</span>
                </div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <span>🚛</span>
                  <span>Transport</span>
                </h3>
                <div className="mt-3 space-y-2 text-xs">
                  <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-800/40">
                    <div className="text-amber-300 font-bold text-sm">10T vehicle</div>
                    <div className="text-white font-semibold mt-1">Eicher Pro 3019 Heavy Commercial</div>
                    <div className="font-mono text-slate-400 mt-0.5">Reg: {vehicleNumber}</div>
                  </div>
                  <div className="text-slate-300 text-[11px] space-y-0.5">
                    <div>Carrier: <b className="text-white">Rapid Agri Logistics</b></div>
                    <div>Driver: Mohan Lal (+91 98291 11223)</div>
                  </div>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
                <span>Utilization: 100%</span>
                <span className="text-amber-400 font-bold">No Overload</span>
              </div>
            </div>

            {/* Step 5: Optimized Route */}
            <div className="p-5 rounded-2xl bg-slate-850/80 border border-slate-800 hover:border-emerald-500/40 transition flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-mono font-bold text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800/80">
                    STEP 5
                  </span>
                  <span className="text-slate-400">Highway Corridors</span>
                </div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <span>🗺️</span>
                  <span>Optimized Route</span>
                </h3>
                <div className="mt-3 space-y-2.5 text-xs">
                  <div className="p-2.5 rounded-xl bg-cyan-950/30 border border-cyan-800/40">
                    <div className="font-mono font-bold text-cyan-300 text-sm tracking-wider">
                      A → B → C → Buyer
                    </div>
                  </div>
                  <div className="space-y-1.5 text-[11px] text-slate-300">
                    <div className="flex items-center gap-1.5">
                      <span className="w-4 h-4 rounded-full bg-slate-800 text-slate-300 font-bold flex items-center justify-center text-[10px]">1</span>
                      <span>Stop A: Chomu (+3,000 kg)</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-4 h-4 rounded-full bg-slate-800 text-slate-300 font-bold flex items-center justify-center text-[10px]">2</span>
                      <span>Stop B: Nasirabad (+4,000 kg)</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-4 h-4 rounded-full bg-slate-800 text-slate-300 font-bold flex items-center justify-center text-[10px]">3</span>
                      <span>Stop C: Behror (+3,000 kg)</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
                <span>Total Transit: 288 km</span>
                <span className="text-cyan-400 font-bold">NH-48 Corridor</span>
              </div>
            </div>

            {/* Step 6: Delivery */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-950/70 to-slate-850 border border-emerald-500/50 hover:border-emerald-400 transition flex flex-col justify-between shadow-lg">
              <div>
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-mono font-bold text-emerald-300 bg-emerald-900/80 px-2 py-0.5 rounded border border-emerald-700/80">
                    STEP 6
                  </span>
                  <span className="text-emerald-400 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    Live Tracking
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <span>🏁</span>
                  <span>Delivery</span>
                </h3>
                <div className="mt-3 space-y-2 text-xs">
                  <div className="p-3 rounded-xl bg-emerald-900/40 border border-emerald-500/40">
                    <div className="text-emerald-300 font-black text-xl">ETA {eta}</div>
                    <div className="text-slate-300 text-xs mt-1">Arrival Window: Today, 18:40 IST</div>
                  </div>
                  <div className="text-[11px] text-slate-300 space-y-1">
                    <div>Location: {buyerDestination}</div>
                    <div>Digital Gate Pass: <b className="font-mono text-emerald-400">GP-1024-DEL</b></div>
                  </div>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-emerald-800/60 text-[11px] text-emerald-300 flex items-center justify-between font-medium">
                <span>Final Verification</span>
                <span>Active On-Road</span>
              </div>
            </div>
          </div>

          {/* Quick Flow Summary Bar */}
          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold text-slate-400">Workflow Chain:</span>
              <span className="font-bold text-white">Buyer Requirement</span>
              <span className="text-emerald-400 font-bold">➔</span>
              <span className="font-bold text-blue-300">Matched Supply (3 Farmers)</span>
              <span className="text-emerald-400 font-bold">➔</span>
              <span className="font-bold text-purple-300">10T Aggregation</span>
              <span className="text-emerald-400 font-bold">➔</span>
              <span className="font-bold text-amber-300">10T Vehicle</span>
              <span className="text-emerald-400 font-bold">➔</span>
              <span className="font-bold text-cyan-300">A → B → C Route</span>
              <span className="text-emerald-400 font-bold">➔</span>
              <span className="font-bold text-emerald-400">Delivery (ETA {eta})</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
