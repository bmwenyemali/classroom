"use client";

import { useEffect, useRef, useState } from "react";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";

interface AddressInputProps {
  value: string;
  onChange: (address: string, latitude?: number, longitude?: number) => void;
  latitude?: number | null;
  longitude?: number | null;
}

export default function AddressInput({
  value,
  onChange,
  latitude,
  longitude,
}: AddressInputProps) {
  const geocoderContainer = useRef<HTMLDivElement>(null);
  const geocoderRef = useRef<MapboxGeocoder | null>(null);

  const formatCoordinate = (coord: number, isLatitude: boolean): string => {
    const absCoord = Math.abs(coord);
    let direction: string;

    if (isLatitude) {
      direction = coord >= 0 ? "N" : "S";
    } else {
      direction = coord >= 0 ? "E" : "W";
    }

    return `${absCoord.toFixed(6)} ${direction}`;
  };

  useEffect(() => {
    if (!geocoderContainer.current || geocoderRef.current) return;

    const mapboxToken =
      process.env.NEXT_PUBLIC_MAPBOX_TOKEN ||
      "pk.eyJ1IjoiYmllbnZlbnUxMiIsImEiOiJjbWpuMGlrMjQxYnJ0M2dxMXJ1Mmk4dndlIn0.fhS-CcoTfYUN6i4oIrHYrQ";

    const geocoder = new MapboxGeocoder({
      accessToken: mapboxToken,
      placeholder: "e.g., Avenue Kalembelembe, Kinshasa",
      proximity: {
        longitude: 15.3136,
        latitude: -4.3276,
      } as any,
      countries: "CD",
      bbox: [12.0, -6.0, 31.0, -3.0],
      marker: false,
    });

    geocoder.on("result", (e: any) => {
      const [lng, lat] = e.result.center;
      onChange(e.result.place_name, lat, lng);
    });

    geocoder.on("clear", () => {
      onChange("", undefined, undefined);
    });

    // Create a minimal map object for the geocoder
    const dummyMap = {
      on: () => {},
      off: () => {},
      listens: () => false,
    };

    const mapElement = geocoder.onAdd(dummyMap as any);
    if (geocoderContainer.current && mapElement) {
      geocoderContainer.current.appendChild(mapElement);
    }
    geocoderRef.current = geocoder;

    // Set initial value if exists
    if (value) {
      geocoder.setInput(value);
    }

    return () => {
      if (geocoderRef.current) {
        geocoderRef.current.onRemove();
        geocoderRef.current = null;
      }
    };
  }, []);

  // Update geocoder input when value changes externally
  useEffect(() => {
    if (geocoderRef.current) {
      geocoderRef.current.setInput(value);
    }
  }, [value]);

  return (
    <div>
      <div ref={geocoderContainer} className="mb-2" />
      {latitude != null && longitude != null && (
        <div className="text-xs text-gray-600 bg-blue-50 border border-blue-200 rounded px-2 py-1 mt-1">
          📍 Coordinates: {formatCoordinate(latitude, true)},{" "}
          {formatCoordinate(longitude, false)}
        </div>
      )}
      <p className="text-xs text-gray-500 mt-1">
        Search for an address or paste coordinates (e.g., -4.338442, 15.287446)
      </p>
    </div>
  );
}
