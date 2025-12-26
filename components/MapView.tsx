"use client";

import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import MapboxDirections from "@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import "@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions.css";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";
import "mapbox-gl/dist/mapbox-gl.css";
import { Library } from "@/lib/types/library";

mapboxgl.accessToken =
  process.env.NEXT_PUBLIC_MAPBOX_TOKEN ||
  "pk.eyJ1IjoiYmllbnZlbnUxMiIsImEiOiJjbWpuMGlrMjQxYnJ0M2dxMXJ1Mmk4dndlIn0.fhS-CcoTfYUN6i4oIrHYrQ";

interface MapViewProps {
  libraries: Library[];
  selectedLibrary?: Library | null;
  userLocation?: [number, number] | null;
  homeLocation?: [number, number] | null;
  showDirections?: boolean;
  height?: string;
}

export default function MapView({
  libraries,
  selectedLibrary,
  userLocation,
  homeLocation,
  showDirections = false,
  height = "600px",
}: MapViewProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [userMarker, setUserMarker] = useState<mapboxgl.Marker | null>(null);
  const [homeMarker, setHomeMarker] = useState<mapboxgl.Marker | null>(null);
  const directionsRef = useRef<MapboxDirections | null>(null);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    // Center on Kinshasa by default
    const defaultCenter: [number, number] = [15.3136, -4.3276];
    const centerPoint = homeLocation || userLocation || defaultCenter;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: centerPoint,
      zoom: homeLocation || userLocation ? 13 : 11,
    });

    map.current.addControl(new mapboxgl.NavigationControl(), "top-right");
    map.current.addControl(new mapboxgl.FullscreenControl(), "top-right");
    map.current.addControl(
      new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true,
        },
        trackUserLocation: true,
        showUserHeading: true,
      }),
      "top-right"
    );

    // Add geocoder (search) control
    const geocoder = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken!,
      mapboxgl: mapboxgl,
      marker: false,
      placeholder:
        "Search for places (e.g., Hopital Kalembelembe, Stade de Martyr)",
      proximity: {
        longitude: 15.3136,
        latitude: -4.3276,
      } as any,
      countries: "CD", // Limit to Democratic Republic of Congo
    });

    map.current.addControl(geocoder as any, "top-left");

    map.current.on("load", () => {
      setMapLoaded(true);
    });

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, []);

  // Add library markers
  useEffect(() => {
    if (!map.current || !mapLoaded) return;

    // Clear existing library markers
    const existingMarkers = document.querySelectorAll(".library-marker");
    existingMarkers.forEach((marker) => marker.remove());

    // Add markers for all libraries
    libraries.forEach((library) => {
      const el = document.createElement("div");
      el.className = "library-marker";
      el.style.cssText = `
        position: relative;
        width: 40px;
        height: 50px;
        cursor: pointer;
      `;

      // Create marker pin
      const pin = document.createElement("div");
      pin.style.cssText = `
        background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="%23${
          selectedLibrary?.id === library.id ? "dc2626" : "2563eb"
        }" stroke="white" stroke-width="1.5"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3" fill="white"/></svg>');
        background-size: contain;
        width: 32px;
        height: 32px;
        position: absolute;
        left: 4px;
        top: 0;
      `;

      // Create label
      const label = document.createElement("div");
      label.textContent = library.name;
      label.style.cssText = `
        position: absolute;
        top: 34px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 2px 6px;
        border-radius: 4px;
        font-size: 10px;
        white-space: nowrap;
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.2s;
        z-index: 1;
      `;

      el.appendChild(pin);
      el.appendChild(label);

      el.addEventListener("mouseenter", () => {
        pin.style.filter = "brightness(1.2)";
        label.style.opacity = "1";
      });
      el.addEventListener("mouseleave", () => {
        pin.style.filter = "brightness(1)";
        label.style.opacity = "0";
      });

      const popupContent = document.createElement("div");
      popupContent.style.cssText = "padding: 8px; min-width: 200px;";
      popupContent.innerHTML = `
        <h3 style="font-weight: bold; margin-bottom: 8px; font-size: 14px;">${
          library.name
        }</h3>
        <p style="margin: 4px 0; font-size: 12px;">${library.address}</p>
        ${
          library.phone
            ? `<p style="margin: 4px 0; font-size: 12px;">📞 ${library.phone}</p>`
            : ""
        }
        ${
          library.opening_hours
            ? `<p style="margin: 4px 0; font-size: 12px;">🕐 ${library.opening_hours}</p>`
            : ""
        }
        <button 
          id="directions-${library.id}" 
          style="
            width: 100%;
            margin-top: 8px;
            padding: 6px;
            background: #10b981;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 12px;
          "
        >
          📍 Get Directions
        </button>
      `;

      const popup = new mapboxgl.Popup({ offset: 25 });
      popup.setDOMContent(popupContent);

      const marker = new mapboxgl.Marker(el)
        .setLngLat([library.longitude, library.latitude])
        .setPopup(popup)
        .addTo(map.current!);

      // Add click handler for directions button after popup opens
      popup.on("open", () => {
        const btn = document.getElementById(`directions-${library.id}`);
        if (btn) {
          btn.addEventListener("click", () => {
            if (selectedLibrary?.id !== library.id) {
              // Trigger direction setup
              window.dispatchEvent(
                new CustomEvent("getDirections", { detail: library })
              );
            }
            popup.remove();
          });
        }
      });
    });
  }, [libraries, mapLoaded, selectedLibrary]);

  // Add user location marker
  useEffect(() => {
    if (!map.current || !mapLoaded || !userLocation) return;

    if (userMarker) {
      userMarker.remove();
    }

    const el = document.createElement("div");
    el.className = "user-marker";
    el.style.cssText = `
      background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="%2310b981"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6" fill="white"/></svg>');
      background-size: contain;
      width: 24px;
      height: 24px;
    `;

    const marker = new mapboxgl.Marker(el)
      .setLngLat(userLocation)
      .setPopup(
        new mapboxgl.Popup().setHTML(
          '<div style="padding: 4px; font-size: 12px;">📍 Your Location</div>'
        )
      )
      .addTo(map.current);

    setUserMarker(marker);
  }, [userLocation, mapLoaded]);

  // Add home location marker
  useEffect(() => {
    if (!map.current || !mapLoaded || !homeLocation) return;

    if (homeMarker) {
      homeMarker.remove();
    }

    const el = document.createElement("div");
    el.className = "home-marker";
    el.style.cssText = `
      background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="%23f59e0b" stroke="white" stroke-width="1"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>');
      background-size: contain;
      width: 28px;
      height: 28px;
    `;

    const marker = new mapboxgl.Marker(el)
      .setLngLat(homeLocation)
      .setPopup(
        new mapboxgl.Popup().setHTML(
          '<div style="padding: 4px; font-size: 12px;">🏠 Home</div>'
        )
      )
      .addTo(map.current);

    setHomeMarker(marker);
  }, [homeLocation, mapLoaded]);

  // Handle directions
  useEffect(() => {
    if (
      !map.current ||
      !mapLoaded ||
      !showDirections ||
      !selectedLibrary ||
      !userLocation
    ) {
      // Remove directions if conditions not met
      if (directionsRef.current && map.current) {
        map.current.removeControl(directionsRef.current);
        directionsRef.current = null;
      }
      return;
    }

    // Initialize directions
    if (!directionsRef.current) {
      directionsRef.current = new MapboxDirections({
        accessToken: mapboxgl.accessToken!,
        unit: "metric",
        profile: "mapbox/driving-traffic", // Shows traffic
        alternatives: true,
        congestion: true,
        interactive: false,
      });

      map.current.addControl(directionsRef.current, "top-left");
    }

    // Set origin and destination
    directionsRef.current.setOrigin(userLocation);
    directionsRef.current.setDestination([
      selectedLibrary.longitude,
      selectedLibrary.latitude,
    ]);

    // Fit bounds to show both points
    const bounds = new mapboxgl.LngLatBounds();
    bounds.extend(userLocation);
    bounds.extend([selectedLibrary.longitude, selectedLibrary.latitude]);
    map.current.fitBounds(bounds, { padding: 100 });
  }, [showDirections, selectedLibrary, userLocation, mapLoaded]);

  // Center on selected library
  useEffect(() => {
    if (!map.current || !selectedLibrary) return;

    map.current.flyTo({
      center: [selectedLibrary.longitude, selectedLibrary.latitude],
      zoom: 15,
      duration: 2000,
    });
  }, [selectedLibrary]);

  return (
    <div className="relative">
      <div
        ref={mapContainer}
        style={{ width: "100%", height }}
        className="rounded-lg shadow-lg"
      />
      {showDirections && (!userLocation || !selectedLibrary) && (
        <div className="absolute top-4 left-4 bg-yellow-50 border border-yellow-200 rounded-lg p-3 shadow-lg max-w-xs">
          <p className="text-sm text-yellow-800">
            {!userLocation && "📍 Enable location to get directions"}
            {!selectedLibrary &&
              userLocation &&
              "📚 Select a library to get directions"}
          </p>
        </div>
      )}
    </div>
  );
}
