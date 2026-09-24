/**
 * Price Discovery & Trend Analysis Utilities
 * Uses Agmarknet historical dataset to compute moving averages and rule-based mandi recommendations.
 */
import { haversineDistance } from './geoRouting';

/**
 * Calculates simple moving average over a window of historical price records.
 * @param {Array<{price: number}>} historicalRecords 
 * @returns {number} Moving average rounded to nearest integer
 */
export function calculateMovingAverage(historicalRecords) {
  if (!historicalRecords || historicalRecords.length === 0) return 0;
  const sum = historicalRecords.reduce((acc, curr) => acc + (curr.modalPrice || curr.price || 0), 0);
  return Math.round(sum / historicalRecords.length);
}

/**
 * Classifies price trend based on latest price vs moving average.
 * @param {number} latestPrice 
 * @param {number} movingAverage 
 * @param {number} thresholdPercent Default 2%
 * @returns {'trending_up' | 'trending_down' | 'stable'}
 */
export function classifyTrend(latestPrice, movingAverage, thresholdPercent = 2) {
  if (!movingAverage) return 'stable';
  const diffPercent = ((latestPrice - movingAverage) / movingAverage) * 100;
  
  if (diffPercent >= thresholdPercent) return 'trending_up';
  if (diffPercent <= -thresholdPercent) return 'trending_down';
  return 'stable';
}

/**
 * Rule-based recommendation engine for top candidate mandis based on net price yield.
 * Formula: netPrice = mandiPrice - estimatedTransportCost(distance)
 * @param {{lat: number, lng: number}} farmerLocation 
 * @param {string} crop 
 * @param {number} quantityKg 
 * @param {Array<any>} mandiPriceData 
 * @param {number} ratePerKmPerQuintal Transport cost rate per km per 100kg (default ₹1.5)
 * @returns {Array<any>} Top recommended mandis sorted descending by net payout
 */
export function recommendBestMandis(farmerLocation, crop, quantityKg, mandiPriceData, ratePerKmPerQuintal = 1.5) {
  if (!mandiPriceData || mandiPriceData.length === 0) return [];
  
  const quantityQuintals = quantityKg / 100;

  const evaluated = mandiPriceData
    .filter(mandi => !crop || mandi.crop.toLowerCase() === crop.toLowerCase())
    .map(mandi => {
      const distanceKm = haversineDistance(farmerLocation, mandi.location);
      const estTransportCost = Math.round(distanceKm * ratePerKmPerQuintal * Math.max(1, quantityQuintals));
      const grossRevenue = Math.round(mandi.modalPrice * Math.max(1, quantityQuintals));
      const netPayout = grossRevenue - estTransportCost;
      
      const ma = calculateMovingAverage(mandi.history || []);
      const trend = classifyTrend(mandi.modalPrice, ma);

      return {
        ...mandi,
        distanceKm,
        estTransportCost,
        grossRevenue,
        netPayout,
        netPricePerKg: Math.round((netPayout / Math.max(1, quantityKg)) * 10) / 10,
        trend
      };
    });

  // Sort descending by net payout
  evaluated.sort((a, b) => b.netPayout - a.netPayout);
  return evaluated.slice(0, 3); // Return top 3
}
