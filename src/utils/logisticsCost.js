/**
 * logisticsCost.js
 * 
 * Transparent logistics cost calculator for agriculture transport
 * based on actual route distance, duration, and payload.
 */

export const DEFAULT_COST_PARAMETERS = {
  fuelPricePerLiter: 94.5, // Indian diesel average ₹/L
  fuelEfficiencyKmPerLiter: 4.5, // Commercial agriculture truck 4-5 km/L
  driverHourlyRate: 220, // Driver + helper wages per hour
  loadingUnloadingPerKg: 0.2, // Hamali / mandi handling charges ₹0.20 per kg
  overheadTollPerKm: 2.8, // Average NHAI toll and permit fees per km
};

/**
 * Calculates transparent logistics cost breakdown
 */
export function calculateLogisticsCost(
  distanceKm,
  durationMinutes,
  totalLoadKg,
  customParams = {}
) {
  const params = {
    ...DEFAULT_COST_PARAMETERS,
    ...customParams,
  };

  // 1. Fuel Cost = (Distance / Efficiency) * Fuel Price
  const litersConsumed = distanceKm / Math.max(0.1, params.fuelEfficiencyKmPerLiter);
  const fuelCost = Math.round(litersConsumed * params.fuelPricePerLiter);

  // 2. Driver & Helper Cost = (Hours) * Hourly rate
  const hours = durationMinutes / 60;
  const driverCost = Math.round(hours * params.driverHourlyRate);

  // 3. Loading & Unloading / Mandi handling charges
  const loadingUnloadingCost = Math.round(totalLoadKg * params.loadingUnloadingPerKg);

  // 4. Tolls, Highway Tax & Vehicle Maintenance overhead
  const tollOverheadCost = Math.round(distanceKm * params.overheadTollPerKm);

  // Total
  const totalCost = fuelCost + driverCost + loadingUnloadingCost + tollOverheadCost;

  return {
    fuelCost,
    driverCost,
    loadingUnloadingCost,
    tollOverheadCost,
    totalCost,
  };
}

/**
 * Combines multiple cost breakdowns into a single grand total
 */
export function aggregateCostBreakdown(breakdowns) {
  return breakdowns.reduce(
    (acc, cur) => ({
      fuelCost: acc.fuelCost + (cur.fuelCost || 0),
      driverCost: acc.driverCost + (cur.driverCost || 0),
      loadingUnloadingCost: acc.loadingUnloadingCost + (cur.loadingUnloadingCost || 0),
      tollOverheadCost: acc.tollOverheadCost + (cur.tollOverheadCost || 0),
      totalCost: acc.totalCost + (cur.totalCost || 0),
    }),
    {
      fuelCost: 0,
      driverCost: 0,
      loadingUnloadingCost: 0,
      tollOverheadCost: 0,
      totalCost: 0,
    }
  );
}
