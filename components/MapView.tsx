"use client"; // Client component for Mapbox
import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import { MapViewProps } from '../types/components';

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

export default function MapView({ userLocation, meetups }: MapViewProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (!userLocation || !mapContainer.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [userLocation.lng, userLocation.lat],
      zoom: 12,
    });

    new mapboxgl.Marker()
      .setLngLat([userLocation.lng, userLocation.lat])
      .addTo(map.current);

    meetups.forEach((meetup) => {
      new mapboxgl.Marker({ color: "#4285F4" })
        .setLngLat([meetup.lng, meetup.lat])
        .setPopup(new mapboxgl.Popup().setText(meetup.title))
        .addTo(map.current!);
    });

    return () => map.current!.remove();
  }, [userLocation, meetups]);

  return <div ref={mapContainer} className="h-96 w-full rounded-lg" />;
}
