"use client"; // Client component for Mapbox
import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import { MapViewProps } from '../types/components';

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

export default function MapView({ userLocation, meetups }: MapViewProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    // Default to a central location if user location is not available
    const center = userLocation 
      ? [userLocation.lng, userLocation.lat] as [number, number]
      : [-0.118092, 51.509865] as [number, number];

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: center,
      zoom: userLocation ? 12 : 2,
    });

    if (userLocation) {
      new mapboxgl.Marker()
        .setLngLat([userLocation.lng, userLocation.lat])
        .addTo(map.current);
    }

    meetups.forEach((meetup) => {
      new mapboxgl.Marker({ color: "#4285F4" })
        .setLngLat([meetup.lng, meetup.lat])
        .setPopup(new mapboxgl.Popup().setText(meetup.title))
        .addTo(map.current!);
    });

    return () => map.current?.remove();
  }, [userLocation, meetups]);

  return <div ref={mapContainer} className="h-96 w-full rounded-lg" />;
}
