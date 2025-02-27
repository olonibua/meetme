import { MeetupLocation } from '../types/meetup';

export interface GeolocationPosition {
  coords: {
    latitude: number;
    longitude: number;
  };
}

export const getUserLocation = async (): Promise<MeetupLocation> => {
  // Check if geolocation is supported
  if (!navigator.geolocation) {
    throw new Error('Geolocation is not supported by your browser');
  }

  // Request permissions explicitly for Safari
  if (typeof navigator.permissions !== 'undefined') {
    try {
      const permission = await navigator.permissions.query({ name: 'geolocation' });
      if (permission.state === 'denied') {
        throw new Error('Location permission was denied');
      }
    } catch {
      // Safari might not support permissions API, continue with regular geolocation
    }
  }

  const position = await new Promise<GeolocationPosition>((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ coords: { latitude: pos.coords.latitude, longitude: pos.coords.longitude } }),
      (error) => {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            reject(new Error('Please enable location access in your browser settings'));
            break;
          case error.POSITION_UNAVAILABLE:
            reject(new Error('Location information is unavailable'));
            break;
          case error.TIMEOUT:
            reject(new Error('Location request timed out'));
            break;
          default:
            reject(new Error('An unknown error occurred'));
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  });

  try {
    const response = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${position.coords.longitude},${position.coords.latitude}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_TOKEN}`
    );
    const data = await response.json();
    
    return {
      lat: position.coords.latitude,
      lng: position.coords.longitude,
      address: data.features[0]?.place_name || 'Unknown location'
    };
  } catch{
    throw new Error('Failed to get address from coordinates');
  }
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