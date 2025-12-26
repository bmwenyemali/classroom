"use client";

import { createClient } from "@/lib/supabase/client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ProfileForm({ profile }: { profile: any }) {
  const [fullName, setFullName] = useState(profile?.full_name || "");
  const [phone, setPhone] = useState(profile?.phone || "");
  const [homeAddress, setHomeAddress] = useState(profile?.home_address || "");
  const [loading, setLoading] = useState(false);
  const [geocoding, setGeocoding] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();
  const supabase = createClient();

  const geocodeAddress = async (
    address: string
  ): Promise<{ latitude: number; longitude: number } | null> => {
    if (!address.trim()) return null;

    try {
      const mapboxToken =
        process.env.NEXT_PUBLIC_MAPBOX_TOKEN ||
        "pk.eyJ1IjoiYmllbnZlbnUxMiIsImEiOiJjbWpuMGlrMjQxYnJ0M2dxMXJ1Mmk4dndlIn0.fhS-CcoTfYUN6i4oIrHYrQ";
      const encodedAddress = encodeURIComponent(address);
      const proximity = "15.3136,-4.3276"; // Kinshasa center for better results

      // Bounding box around Kinshasa and greater DRC area
      // Format: minLon,minLat,maxLon,maxLat
      const bbox = "12.0,-6.0,31.0,-3.0"; // Covers Kinshasa and surroundings

      // Restrict to Democratic Republic of Congo
      const country = "cd"; // ISO 3166-1 alpha-2 code for DRC

      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodedAddress}.json?proximity=${proximity}&bbox=${bbox}&country=${country}&access_token=${mapboxToken}`
      );

      if (!response.ok) throw new Error("Geocoding failed");

      const data = await response.json();
      if (data.features && data.features.length > 0) {
        const [longitude, latitude] = data.features[0].center;
        return { latitude, longitude };
      }

      return null;
    } catch (error) {
      console.error("Geocoding error:", error);
      return null;
    }
  };

  const reverseGeocode = async (
    latitude: number,
    longitude: number
  ): Promise<string | null> => {
    try {
      const mapboxToken =
        process.env.NEXT_PUBLIC_MAPBOX_TOKEN ||
        "pk.eyJ1IjoiYmllbnZlbnUxMiIsImEiOiJjbWpuMGlrMjQxYnJ0M2dxMXJ1Mmk4dndlIn0.fhS-CcoTfYUN6i4oIrHYrQ";

      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=${mapboxToken}`
      );

      if (!response.ok) throw new Error("Reverse geocoding failed");

      const data = await response.json();
      if (data.features && data.features.length > 0) {
        return data.features[0].place_name;
      }

      return null;
    } catch (error) {
      console.error("Reverse geocoding error:", error);
      return null;
    }
  };

  const parseCoordinates = (
    input: string
  ): { latitude: number; longitude: number } | null => {
    // Try to match coordinate patterns like:
    // -4.338442, 15.287446
    // (-4.338442, 15.287446)
    // lat: -4.338442, lon: 15.287446
    const coordPattern = /[(-]?\s*(-?\d+\.?\d*)\s*,\s*(-?\d+\.?\d*)\s*[)]?/;
    const match = input.match(coordPattern);

    if (match) {
      const lat = parseFloat(match[1]);
      const lon = parseFloat(match[2]);

      // Validate coordinates are in reasonable range for DRC
      if (lat >= -13.5 && lat <= 5.5 && lon >= 12.0 && lon <= 31.5) {
        return { latitude: lat, longitude: lon };
      }
    }

    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    let coordinates = null;
    let finalAddress = homeAddress;

    // Check if address changed
    if (homeAddress && homeAddress !== profile?.home_address) {
      setGeocoding(true);

      // First, check if input is coordinates
      const parsedCoords = parseCoordinates(homeAddress);

      if (parsedCoords) {
        // Input is coordinates, do reverse geocoding to get address
        coordinates = parsedCoords;
        const addressFromCoords = await reverseGeocode(
          parsedCoords.latitude,
          parsedCoords.longitude
        );
        if (addressFromCoords) {
          finalAddress = addressFromCoords;
        }
      } else {
        // Input is address, do forward geocoding to get coordinates
        coordinates = await geocodeAddress(homeAddress);
      }

      setGeocoding(false);

      if (!coordinates) {
        setMessage(
          "Could not find address in Kinshasa/DRC. Please check and try again."
        );
        setLoading(false);
        return;
      }
    }

    const updateData: any = {
      full_name: fullName,
      phone: phone,
      updated_at: new Date().toISOString(),
    };

    // Add address data if provided
    if (homeAddress) {
      updateData.home_address = finalAddress;
      if (coordinates) {
        updateData.home_latitude = coordinates.latitude;
        updateData.home_longitude = coordinates.longitude;
      }
    } else {
      // Clear address data if removed
      updateData.home_address = null;
      updateData.home_latitude = null;
      updateData.home_longitude = null;
    }

    const { error } = await supabase
      .from("profiles")
      .update(updateData)
      .eq("id", profile.id);

    if (error) {
      console.error("Profile update error:", error);
      setMessage("Error updating profile");
    } else {
      setMessage("Profile updated successfully!");
      router.refresh();
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {message && (
        <div
          className={`p-3 rounded-lg text-sm ${
            message.includes("Error")
              ? "bg-red-50 text-red-700"
              : "bg-green-50 text-green-700"
          }`}
        >
          {message}
        </div>
      )}

      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Email
        </label>
        <input
          id="email"
          type="email"
          value={profile?.email || ""}
          disabled
          className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
        />
      </div>

      <div>
        <label
          htmlFor="fullName"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Full Name
        </label>
        <input
          id="fullName"
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        />
      </div>

      <div>
        <label
          htmlFor="phone"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Phone
        </label>
        <input
          id="phone"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <div>
        <label
          htmlFor="homeAddress"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Home Address
        </label>
        <input
          id="homeAddress"
          type="text"
          value={homeAddress}
          onChange={(e) => setHomeAddress(e.target.value)}
          placeholder="e.g., Avenue Kalembelembe, Kinshasa or -4.338442, 15.287446"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <p className="text-xs text-gray-500 mt-1">
          Enter your home address or paste coordinates from Google Maps. We'll
          find the location in Kinshasa/DRC.
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Role
        </label>
        <input
          type="text"
          value={profile?.role?.replace("_", " ") || "student"}
          disabled
          className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 capitalize"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
      >
        {geocoding
          ? "Finding address..."
          : loading
          ? "Saving..."
          : "Update Profile"}
      </button>
    </form>
  );
}
