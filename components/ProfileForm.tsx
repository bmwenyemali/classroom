"use client";

import { createClient } from "@/lib/supabase/client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import AddressInput from "./AddressInput";

export default function ProfileForm({ profile }: { profile: any }) {
  const [fullName, setFullName] = useState(profile?.full_name || "");
  const [phone, setPhone] = useState(profile?.phone || "");
  const [homeAddress, setHomeAddress] = useState(profile?.home_address || "");
  const [homeLatitude, setHomeLatitude] = useState<number | null>(
    profile?.home_latitude || null
  );
  const [homeLongitude, setHomeLongitude] = useState<number | null>(
    profile?.home_longitude || null
  );
  const [loading, setLoading] = useState(false);
  const [geocoding, setGeocoding] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    // Check if we have address and coordinates
    if (homeAddress && (!homeLatitude || !homeLongitude)) {
      setMessage(
        "Please select an address from the suggestions or ensure coordinates are valid."
      );
      setLoading(false);
      return;
    }

    const updateData: any = {
      full_name: fullName,
      phone: phone,
      updated_at: new Date().toISOString(),
    };

    // Add address data if provided
    if (homeAddress) {
      updateData.home_address = homeAddress;
      updateData.home_latitude = homeLatitude;
      updateData.home_longitude = homeLongitude;
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
        <AddressInput
          value={homeAddress}
          onChange={(address, lat, lng) => {
            setHomeAddress(address);
            if (lat !== undefined && lng !== undefined) {
              setHomeLatitude(lat);
              setHomeLongitude(lng);
            } else {
              setHomeLatitude(null);
              setHomeLongitude(null);
            }
          }}
          latitude={homeLatitude}
          longitude={homeLongitude}
        />
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
