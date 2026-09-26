/**
 * freshnessEngine.js
 * 
 * Transparent rule-based commodity freshness and perishability evaluator.
 * Evaluates agronomic perishability based on commodity biology, elapsed time since harvest,
 * transit exposure, and storage environment.
 */

export function assessCommodityFreshness(input = {}) {
  const comm = (input.commodity || "").toLowerCase();

  // Category determination
  let category = "MODERATELY_PERISHABLE";
  let maxShelfLifeDays = 7;

  if (comm.includes("tomato") || comm.includes("banana") || comm.includes("cauliflower") || comm.includes("cabbage")) {
    category = "HIGHLY_PERISHABLE";
    maxShelfLifeDays = 5;
  } else if (comm.includes("potato") || comm.includes("onion") || comm.includes("garlic")) {
    category = "MODERATELY_PERISHABLE";
    maxShelfLifeDays = 30;
  } else if (comm.includes("wheat") || comm.includes("mustard") || comm.includes("gram") || comm.includes("paddy") || comm.includes("rice")) {
    category = "STABLE";
    maxShelfLifeDays = 180;
  }

  // Harvest age calculation
  let harvestAgeDays = 1;
  if (input.harvestDate) {
    const harvestTime = new Date(input.harvestDate).getTime();
    if (!isNaN(harvestTime)) {
      const diffMs = Date.now() - harvestTime;
      harvestAgeDays = Math.max(0, Math.round(diffMs / (1000 * 60 * 60 * 24)));
    }
  }

  const transitHours = input.transitDurationHours || 4;
  const isColdStorage = input.storageType === "COLD_STORAGE";

  let risk = "LOW";
  let recommendation = "Standard procurement & scheduled dispatch";

  if (category === "HIGHLY_PERISHABLE") {
    if (harvestAgeDays >= 3 || transitHours > 8) {
      risk = "HIGH";
      recommendation = "Prioritize immediate direct dispatch or transfer to cold chain storage (2°C–8°C).";
    } else if (harvestAgeDays >= 2 || transitHours > 5) {
      risk = "MEDIUM";
      recommendation = "Schedule dispatch within 24h. Maintain covered/ventilated transport.";
    } else {
      risk = isColdStorage ? "LOW" : "LOW";
      recommendation = "Optimal farmgate condition. Proceed with planned route.";
    }
  } else if (category === "MODERATELY_PERISHABLE") {
    if (harvestAgeDays > 20) {
      risk = "HIGH";
      recommendation = "Inspect for sprouting/spoilage. Prioritize early delivery.";
    } else if (harvestAgeDays > 10) {
      risk = "MEDIUM";
      recommendation = "Ensure dry, well-ventilated warehouse storage.";
    } else {
      risk = "LOW";
      recommendation = "Produce within stable preservation window.";
    }
  } else {
    // STABLE
    if (harvestAgeDays > 120) {
      risk = "MEDIUM";
      recommendation = "Moisture check recommended before bulk transport.";
    } else {
      risk = "LOW";
      recommendation = "Dry grain storage optimal. No urgent perishability risk.";
    }
  }

  return {
    risk,
    harvestAgeDays,
    perishabilityCategory: category,
    shelfLifeDays: maxShelfLifeDays,
    recommendation,
  };
}
