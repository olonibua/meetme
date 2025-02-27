import { MeetupLocation } from '../types/meetup';

export interface GeolocationPosition {
  coords: {
    latitude: number;
    longitude: number;
  };
}

export const getUserLocation = async (): Promise<MeetupLocation> => {
  if (!navigator.geolocation) {
    throw new Error('Geolocation is not supported by your browser');
  }

  // For Safari and other browsers
  return new Promise<MeetupLocation>((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      reject(new Error('Location request timed out'));
    }, 10000); // 10 second timeout

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        clearTimeout(timeoutId);
        resolve({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          address: "Current Location"
        });
      },
      (error: GeolocationPositionError) => {
        clearTimeout(timeoutId);
        if (error.code === 1) { // PERMISSION_DENIED
          // Trigger a new permission request
          navigator.geolocation.getCurrentPosition(() => {}, () => {}, {});
        }
        reject(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      }
    );
  });
};

export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c; // Distance in km
}