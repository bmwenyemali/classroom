"use client";

import { useEffect, useRef, useState } from "react";

interface AddressInputProps {
  value: string;
  onChange: (address: string, latitude?: number, longitude?: number) => void;
  latitude?: number | null;
  longitude?: number | null;
}

interface Suggestion {
  place_name: string;
  center: [number, number];
}

export default function AddressInput({
  value,
  onChange,
  latitude,
  longitude,
}: AddressInputProps) {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  const formatCoordinate = (coord: number, isLatitude: boolean): string => {
    const absCoord = Math.abs(coord);
    const direction = isLatitude
      ? coord >= 0
        ? "N"
        : "S"
      : coord >= 0
      ? "E"
      : "W";
    return `${absCoord.toFixed(6)} ${direction}`;
  };

  // Search for address suggestions
  const searchAddress = async (query: string) => {
    if (!query || query.length < 3) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    setIsSearching(true);
    try {
      const mapboxToken =
        process.env.NEXT_PUBLIC_MAPBOX_TOKEN ||
        "pk.eyJ1IjoiYmllbnZlbnUxMiIsImEiOiJjbWpuMGlrMjQxYnJ0M2dxMXJ1Mmk4dndlIn0.fhS-CcoTfYUN6i4oIrHYrQ";

      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
          query
        )}.json?proximity=15.3136,-4.3276&bbox=12.0,-6.0,31.0,-3.0&country=cd&access_token=${mapboxToken}`
      );

      if (response.ok) {
        const data = await response.json();
        setSuggestions(data.features || []);
        setShowSuggestions(true);
      }
    } catch (error) {
      console.error("Address search error:", error);
    } finally {
      setIsSearching(false);
    }
  };

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue, undefined, undefined);
    searchAddress(newValue);
  };

  // Handle suggestion selection
  const handleSelectSuggestion = (suggestion: Suggestion) => {
    const [lng, lat] = suggestion.center;
    onChange(suggestion.place_name, lat, lng);
    setSuggestions([]);
    setShowSuggestions(false);
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        !inputRef.current?.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative">
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={handleInputChange}
        onFocus={() => {
          if (suggestions.length > 0) setShowSuggestions(true);
        }}
        placeholder="e.g., 35 Avenue Kalembelembe, Kinshasa"
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />

      {/* Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto"
        >
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              onClick={() => handleSelectSuggestion(suggestion)}
              className="px-4 py-2 hover:bg-blue-50 cursor-pointer transition-colors border-b border-gray-100 last:border-b-0"
            >
              <div className="text-sm text-gray-900">
                {suggestion.place_name}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Loading indicator */}
      {isSearching && (
        <div className="text-xs text-gray-500 mt-1">Searching...</div>
      )}

      {/* Coordinates display */}
      {latitude != null && longitude != null && (
        <div className="text-xs text-gray-600 bg-blue-50 border border-blue-200 rounded px-2 py-1 mt-2">
          📍 Coordinates: {formatCoordinate(latitude, true)},{" "}
          {formatCoordinate(longitude, false)}
        </div>
      )}

      <p className="text-xs text-gray-500 mt-1">
        Start typing your address to see suggestions from Kinshasa, DRC
      </p>
    </div>
  );
}
