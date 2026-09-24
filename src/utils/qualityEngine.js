/**
 * Quality Verification & Payout Calculation Engine
 * Contains automatic threshold checking, weight discrepancy detection, and itemized payout math.
 */

/**
 * Standard thresholds for crops (Moisture % and Foreign Matter %)
 */
const CROP_QUALITY_THRESHOLDS = {
  Wheat: { maxMoisture: 13.5, maxForeignMatter: 2.0 },
  Rice: { maxMoisture: 14.0, maxForeignMatter: 2.5 },
  Tomato: { maxMoisture: 90.0, maxForeignMatter: 3.0 },
  Potato: { maxMoisture: 80.0, maxForeignMatter: 2.0 },
  Onion: { maxMoisture: 82.0, maxForeignMatter: 2.5 },
  Cotton: { maxMoisture: 8.5, maxForeignMatter: 3.0 },
  default: { maxMoisture: 14.0, maxForeignMatter: 2.5 }
};

/**
 * Auto-compares laboratory test parameters against crop standards.
 * @param {string} crop 
 * @param {number} moisturePct 
 * @param {number} foreignMatterPct 
 * @param {'Grade A' | 'Grade B' | 'Grade C'} grainGrade 
 * @returns {{ isVerified: boolean, resultStatus: 'Verified ✅' | 'Flagged ⚠️', grade: string, notes: string }}
 */
export function evaluateQualityGrade(crop, moisturePct, foreignMatterPct, grainGrade) {
  const threshold = CROP_QUALITY_THRESHOLDS[crop] || CROP_QUALITY_THRESHOLDS.default;
  
  const moistureOk = moisturePct <= threshold.maxMoisture;
  const foreignOk = foreignMatterPct <= threshold.maxForeignMatter;
  const gradeOk = grainGrade === 'Grade A' || grainGrade === 'Grade B';

  const isVerified = moistureOk && foreignOk && gradeOk;

  const notes = [];
  if (!moistureOk) notes.push(`Moisture (${moisturePct}%) exceeds safe limit (${threshold.maxMoisture}%)`);
  if (!foreignOk) notes.push(`Foreign matter (${foreignMatterPct}%) exceeds tolerance (${threshold.maxForeignMatter}%)`);
  if (!gradeOk) notes.push(`Grain grade '${grainGrade}' below commercial threshold`);

  return {
    isVerified,
    resultStatus: isVerified ? 'Verified ✅' : 'Flagged ⚠️',
    grade: grainGrade || (isVerified ? 'Grade A' : 'Grade C'),
    notes: notes.length > 0 ? notes.join('. ') : 'Meets all certified quality standards.'
  };
}

/**
 * Checks weight mismatch with a 3-tier logic.
 * Tier 1 (<= 3%): Auto-update, proceed silently.
 * Tier 2 (3% < x <= 15%): Auto-update, but flag for Admin review.
 * Tier 3 (> 15%): Do NOT auto-update. Hold entirely, block payment, escalate to Admin.
 * @param {number} declaredWeightKg 
 * @param {number} actualWeightKg 
 * @returns {{ tier: number, hasMismatch: boolean, differenceKg: number, diffPercent: number, message: string }}
 */
export function checkWeightMismatch(declaredWeightKg, actualWeightKg) {
  if (!declaredWeightKg || !actualWeightKg) {
    return { tier: 1, hasMismatch: false, differenceKg: 0, diffPercent: 0, message: 'Weight pending confirmation' };
  }

  const diffKg = Math.abs(actualWeightKg - declaredWeightKg);
  const diffPct = (diffKg / declaredWeightKg) * 100;
  
  let tier = 1;
  let hasMismatch = false;
  let message = `✓ Weight verified within acceptable tolerance (${diffPct.toFixed(1)}% variation).`;

  if (diffPct > 15) {
    tier = 3;
    hasMismatch = true;
    message = `🚨 CRITICAL MISMATCH: ${diffPct.toFixed(1)}% difference. Exceeds 15% safety limit. Order placed on Admin Hold. Payment capture blocked.`;
  } else if (diffPct > 3) {
    tier = 2;
    hasMismatch = true;
    message = `⚠️ Warning: ${diffPct.toFixed(1)}% mismatch (exceeds 3% silent threshold). Quantity updated, but flagged for Admin review.`;
  }

  return {
    tier,
    hasMismatch,
    differenceKg: Math.round(diffKg * 10) / 10,
    diffPercent: Math.round(diffPct * 10) / 10,
    message
  };
}

/**
 * Itemizes the complete payout breakdown for a sale.
 * @param {object} params 
 * @returns {object} Itemized financial breakdown
 */
export function calculatePayoutBreakdown({
  bidPriceTotal,
  distanceKm = 25,
  ratePerKmPerQuintal = 1.5,
  quantityKg = 1000,
  mandiFeePct = 1.5,
  platformFeePct = 1.0,
  qualityDeduction = 0
}) {
  const quintals = quantityKg / 100;
  const transportCost = Math.round(distanceKm * ratePerKmPerQuintal * Math.max(1, quintals));
  const mandiFee = Math.round((bidPriceTotal * mandiFeePct) / 100);
  const platformFee = Math.round((bidPriceTotal * platformFeePct) / 100);
  
  const totalDeductions = transportCost + mandiFee + platformFee + qualityDeduction;
  const finalPayout = Math.max(0, bidPriceTotal - totalDeductions);

  return {
    bidPriceTotal,
    transportCost,
    mandiFee,
    platformFee,
    qualityDeduction,
    totalDeductions,
    finalPayout
  };
}

export const PLATFORM_COMMISSION_PCT = 5.0;

export function calculateNetRealizationPerUnit({
  pricePerUnit,
  quantityKg,
  distanceKm = 50,
  ratePerKmPerQuintal = 1.5,
  qualityGrade = 'Grade A'
}) {
  if (!pricePerUnit || !quantityKg) return null;

  const commissionAmount = pricePerUnit * (PLATFORM_COMMISSION_PCT / 100);
  const transportCostEstimate = (distanceKm * ratePerKmPerQuintal) / 100;

  let qualityPct = 0;
  if (qualityGrade === 'Grade B') qualityPct = 5.0;
  else if (qualityGrade === 'Grade C') qualityPct = 12.0;
  else if (qualityGrade === 'Processing') qualityPct = 15.0;
  
  const qualityWastageDeduction = pricePerUnit * (qualityPct / 100);

  const netRealization = pricePerUnit - transportCostEstimate - commissionAmount - qualityWastageDeduction;

  return {
    pricePerUnit: Number(pricePerUnit),
    transportCostEstimate,
    commissionAmount,
    qualityWastageDeduction,
    netRealization
  };
}

/**
 * Shelf life defaults (in days)
 */
export const SHELF_LIFE_DAYS = {
  Wheat: 180,
  Rice: 180,
  Tomato: 7,
  Potato: 45,
  Onion: 45,
  Soybean: 120,
  Chana: 120,
  Mustard: 120,
  default: 30
};

/**
 * Computes surplus rescue status.
 * @param {string} crop
 * @param {string} harvestDate (YYYY-MM-DD)
 * @returns {{ isSurplusRescue: boolean, discountPct: number, remainingDays: number, originalPrice?: number, discountedPrice?: number }}
 */
export function calculateSurplusRescue(crop, harvestDate, currentPrice = 0) {
  if (!harvestDate) return { isSurplusRescue: false, discountPct: 0, remainingDays: 999 };
  const shelfLife = SHELF_LIFE_DAYS[crop] || SHELF_LIFE_DAYS.default;
  const msPerDay = 24 * 60 * 60 * 1000;
  
  // Real world elapsed time:
  const elapsedDays = (Date.now() - new Date(harvestDate).getTime()) / msPerDay;
  const remainingDays = shelfLife - elapsedDays;
  const remainingPct = remainingDays / shelfLife;

  // We consider it surplus rescue if it's within the final 25% of its shelf life
  if (remainingPct <= 0.25 && remainingDays > 0) {
    const discountPct = 30 - ((remainingPct / 0.25) * 15);
    const roundedDiscount = Math.round(discountPct);
    const discountedPrice = currentPrice ? Math.round(currentPrice * (1 - (roundedDiscount / 100))) : 0;
    return {
      isSurplusRescue: true,
      discountPct: roundedDiscount,
      remainingDays: Math.floor(remainingDays),
      originalPrice: currentPrice,
      discountedPrice
    };
  }

  return { isSurplusRescue: false, discountPct: 0, remainingDays: Math.max(0, Math.floor(remainingDays)) };
}
