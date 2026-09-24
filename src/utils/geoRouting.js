/**
 * Shared Route Optimization & Geolocation Utilities
 * Implements real Haversine Great-Circle Distance and Nearest Neighbor Route Heuristic.
 */

/**
 * Calculates the Haversine distance between two geographic coordinates in kilometers.
 * @param {{lat: number, lng: number}} pointA 
 * @param {{lat: number, lng: number}} pointB 
 * @returns {number} Distance in kilometers
 */
export function haversineDistance(pointA, pointB) {
  if (!pointA || !pointB || pointA.lat === undefined || pointB.lat === undefined) return 0;
  
  const R = 6371; // Earth radius in km
  const dLat = (pointB.lat - pointA.lat) * (Math.PI / 180);
  const dLng = (pointB.lng - pointA.lng) * (Math.PI / 180);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(pointA.lat * (Math.PI / 180)) *
    Math.cos(pointB.lat * (Math.PI / 180)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round((R * c) * 10) / 10; // Round to 1 decimal place
}

/**
 * Orders a list of pickup points using the Nearest Neighbor heuristic starting from startPoint.
 * Returns the ordered route array and total distance in kilometers.
 * @param {{lat: number, lng: number, [key: string]: any}} startPoint 
 * @param {Array<{lat: number, lng: number, [key: string]: any}>} pickupPoints 
 * @returns {{ orderedRoute: Array<any>, totalDistanceKm: number }}
 */
export function nearestNeighborRoute(startPoint, pickupPoints) {
  if (!pickupPoints || pickupPoints.length === 0) {
    return { orderedRoute: [], totalDistanceKm: 0 };
  }

  const route = [];
  let current = startPoint;
  const remaining = [...pickupPoints];
  let totalDistanceKm = 0;

  while (remaining.length > 0) {
    let nearestIndex = 0;
    let minDistance = haversineDistance(current, remaining[0]);

    for (let i = 1; i < remaining.length; i++) {
      const dist = haversineDistance(current, remaining[i]);
      if (dist < minDistance) {
        minDistance = dist;
        nearestIndex = i;
      }
    }

    const nearestPoint = remaining.splice(nearestIndex, 1)[0];
    nearestPoint.legDistanceKm = minDistance;
    totalDistanceKm += minDistance;
    route.push(nearestPoint);
    current = nearestPoint;
  }

  return {
    orderedRoute: route,
    totalDistanceKm: Math.round(totalDistanceKm * 10) / 10
  };
}
