"use client";

import { useState, useEffect } from "react";
import { Library } from "@/lib/types/library";
import MapView from "@/components/MapView";
import {
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  ClockIcon,
  BookOpenIcon,
  GlobeAltIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";

interface LibrariesClientProps {
  libraries: (Library & { bookCount: number })[];
  userLocation: [number, number] | null;
}

export default function LibrariesClient({
  libraries,
  userLocation: initialUserLocation,
}: LibrariesClientProps) {
  const [selectedLibrary, setSelectedLibrary] = useState<Library | null>(null);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(
    initialUserLocation
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [showDirections, setShowDirections] = useState(false);
  const [sortBy, setSortBy] = useState<"name" | "distance">("name");

  // Get user's current location
  useEffect(() => {
    if ("geolocation" in navigator && !initialUserLocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([
            position.coords.longitude,
            position.coords.latitude,
          ]);
        },
        (error) => {
          console.log("Location access denied:", error);
        }
      );
    }
  }, [initialUserLocation]);

  // Calculate distance between two points (Haversine formula)
  const calculateDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // Filter and sort libraries
  const filteredLibraries = libraries
    .filter(
      (lib) =>
        lib.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lib.address.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .map((lib) => ({
      ...lib,
      distance: userLocation
        ? calculateDistance(
            userLocation[1],
            userLocation[0],
            lib.latitude,
            lib.longitude
          )
        : null,
    }))
    .sort((a, b) => {
      if (sortBy === "distance" && a.distance !== null && b.distance !== null) {
        return a.distance - b.distance;
      }
      return a.name.localeCompare(b.name);
    });

  const handleGetDirections = (library: Library) => {
    setSelectedLibrary(library);
    setShowDirections(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            📚 Bibliothèques de Kinshasa
          </h1>
          <p className="text-gray-600">
            Découvrez les bibliothèques et trouvez votre chemin
          </p>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              placeholder="Rechercher une bibliothèque..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as "name" | "distance")}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={!userLocation}
            >
              <option value="name">Trier par nom</option>
              <option value="distance">Trier par distance</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Library List */}
          <div className="lg:col-span-1 space-y-4 max-h-[800px] overflow-y-auto">
            {filteredLibraries.map((library) => (
              <div
                key={library.id}
                className={`bg-white rounded-lg shadow-md p-4 cursor-pointer transition-all hover:shadow-lg ${
                  selectedLibrary?.id === library.id
                    ? "ring-2 ring-blue-500"
                    : ""
                }`}
                onClick={() => {
                  setSelectedLibrary(library);
                  setShowDirections(false);
                }}
              >
                <h3 className="font-bold text-lg text-gray-900 mb-2">
                  {library.name}
                </h3>

                <div className="space-y-2 text-sm">
                  <div className="flex items-start gap-2 text-gray-600">
                    <MapPinIcon className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>{library.address}</span>
                  </div>

                  {library.phone && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <PhoneIcon className="w-4 h-4 flex-shrink-0" />
                      <span>{library.phone}</span>
                    </div>
                  )}

                  {library.opening_hours && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <ClockIcon className="w-4 h-4 flex-shrink-0" />
                      <span>{library.opening_hours}</span>
                    </div>
                  )}

                  <div className="flex items-center gap-2 text-gray-600">
                    <BookOpenIcon className="w-4 h-4 flex-shrink-0" />
                    <span>{library.bookCount} livres disponibles</span>
                  </div>

                  {library.distance !== null && (
                    <div className="text-blue-600 font-semibold">
                      📍 {library.distance.toFixed(1)} km de votre position
                    </div>
                  )}
                </div>

                <div className="mt-4 flex gap-2">
                  <Link
                    href={`/dashboard/libraries/${library.id}`}
                    className="flex-1 text-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm"
                  >
                    Voir détails
                  </Link>
                  {userLocation && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleGetDirections(library);
                      }}
                      className="flex-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm"
                    >
                      📍 Itinéraire
                    </button>
                  )}
                </div>
              </div>
            ))}

            {filteredLibraries.length === 0 && (
              <div className="bg-white rounded-lg shadow-md p-8 text-center text-gray-500">
                Aucune bibliothèque trouvée
              </div>
            )}
          </div>

          {/* Map */}
          <div className="lg:col-span-2">
            <MapView
              libraries={filteredLibraries}
              selectedLibrary={selectedLibrary}
              userLocation={userLocation}
              showDirections={showDirections}
              height="800px"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
