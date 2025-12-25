import { storeLocation, deliveryZones, maxDeliveryDistance } from '@/data/products';
import { DeliveryZone } from '@/types';

// Haversine formula to calculate distance between two points
export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const toRad = (deg: number): number => {
  return deg * (Math.PI / 180);
};

export const getDeliveryZone = (lat: number, lon: number): DeliveryZone | null => {
  const distance = calculateDistance(
    storeLocation.latitude,
    storeLocation.longitude,
    lat,
    lon
  );

  if (distance > maxDeliveryDistance) {
    return null;
  }

  for (const zone of deliveryZones) {
    if (distance >= zone.minDistance && distance < zone.maxDistance) {
      return zone;
    }
  }

  return null;
};

export const getDistanceFromStore = (lat: number, lon: number): number => {
  return calculateDistance(storeLocation.latitude, storeLocation.longitude, lat, lon);
};

export const formatDistance = (distance: number): string => {
  if (distance < 1) {
    return `${Math.round(distance * 1000)} m`;
  }
  return `${distance.toFixed(1)} km`;
};
