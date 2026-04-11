export const toRadians = (value) => (value * Math.PI) / 180;

export const calculateDistanceInKm = (lat1, lng1, lat2, lng2) => {
  const numbers = [lat1, lng1, lat2, lng2].map(Number);
  const hasInvalidValue = numbers.some((value) => Number.isNaN(value));

  if (hasInvalidValue) {
    return null;
  }

  const [startLat, startLng, endLat, endLng] = numbers;
  const earthRadius = 6371;
  const latDiff = toRadians(endLat - startLat);
  const lngDiff = toRadians(endLng - startLng);

  const haversineValue =
    Math.sin(latDiff / 2) * Math.sin(latDiff / 2) +
    Math.cos(toRadians(startLat)) *
      Math.cos(toRadians(endLat)) *
      Math.sin(lngDiff / 2) *
      Math.sin(lngDiff / 2);

  const angularDistance =
    2 * Math.atan2(Math.sqrt(haversineValue), Math.sqrt(1 - haversineValue));

  return Number((earthRadius * angularDistance).toFixed(2));
};
