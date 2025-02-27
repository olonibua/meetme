// "use client";
// import { useEffect, useRef } from 'react';
// import mapboxgl from 'mapbox-gl';
// import 'mapbox-gl/dist/mapbox-gl.css';
// import { useTheme } from '../lib/theme';
// import { cn } from '@/lib/utils';
// import { MeetupLocation } from '@/types/meetup';

// interface LocationPickerProps {
//   initialLocation: MeetupLocation;
//   onLocationChange: (location: { lat: number; lng: number; address: string }) => void;
// }

// export default function LocationPicker({ initialLocation, onLocationChange }: LocationPickerProps) {
//   const mapContainer = useRef<HTMLDivElement>(null);
//   const map = useRef<mapboxgl.Map | null>(null);
//   const marker = useRef<mapboxgl.Marker | null>(null);
//   const { theme } = useTheme();

//   useEffect(() => {
//     if (!mapContainer.current) return;

//     mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;
    
//     map.current = new mapboxgl.Map({
//       container: mapContainer.current,
//       style: theme === 'dark' ? 
//         'mapbox://styles/mapbox/dark-v11' : 
//         'mapbox://styles/mapbox/light-v11',
//       center: [initialLocation.lng, initialLocation.lat],
//       zoom: 13
//     });

//     marker.current = new mapboxgl.Marker({
//       draggable: true
//     })
//       .setLngLat([initialLocation.lng, initialLocation.lat])
//       .addTo(map.current);

//     marker.current.on('dragend', async () => {
//       const lngLat = marker.current!.getLngLat();
//       try {
//         const response = await fetch(
//           `https://api.mapbox.com/geocoding/v5/mapbox.places/${lngLat.lng},${lngLat.lat}.json?access_token=${mapboxgl.accessToken}`
//         );
//         const data = await response.json();
//         const address = data.features[0]?.place_name || 'Unknown location';
//         onLocationChange({
//           lat: lngLat.lat,
//           lng: lngLat.lng,
//           address
//         });
//       } catch (error) {
//         console.error('Failed to get address:', error);
//       }
//     });

//     return () => {
//       map.current?.remove();
//     };
//   }, [theme, initialLocation]);

//   return (
//     <div 
//       ref={mapContainer} 
//       className={cn(
//         "h-[200px] rounded-lg overflow-hidden",
//         theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
//       )} 
//     />
//   );
// } 