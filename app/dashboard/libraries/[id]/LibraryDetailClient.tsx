"use client";

import { useState } from "react";
import { Library, Book } from "@/lib/types/library";
import MapView from "@/components/MapView";
import {
  ArrowLeftIcon,
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  ClockIcon,
  GlobeAltIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";

interface LibraryDetailClientProps {
  library: Library;
  books: Book[];
  userLocation: [number, number] | null;
  homeLocation: [number, number] | null;
}

export default function LibraryDetailClient({
  library,
  books,
  userLocation,
  homeLocation,
}: LibraryDetailClientProps) {
  const [showDirections, setShowDirections] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");

  const categories = [
    "all",
    ...Array.from(new Set(books.map((b) => b.category))),
  ];

  const filteredBooks = books.filter((book) => {
    const matchesSearch =
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      filterCategory === "all" || book.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link
            href="/dashboard/libraries"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            Retour aux bibliothèques
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">{library.name}</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Library Info and Books */}
          <div className="lg:col-span-2 space-y-6">
            {/* Library Details */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Informations
              </h2>

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <MapPinIcon className="w-5 h-5 text-gray-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-gray-900">Adresse</p>
                    <p className="text-gray-600">{library.address}</p>
                  </div>
                </div>

                {library.phone && (
                  <div className="flex items-start gap-3">
                    <PhoneIcon className="w-5 h-5 text-gray-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-gray-900">Téléphone</p>
                      <a
                        href={`tel:${library.phone}`}
                        className="text-blue-600 hover:underline"
                      >
                        {library.phone}
                      </a>
                    </div>
                  </div>
                )}

                {library.email && (
                  <div className="flex items-start gap-3">
                    <EnvelopeIcon className="w-5 h-5 text-gray-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-gray-900">Email</p>
                      <a
                        href={`mailto:${library.email}`}
                        className="text-blue-600 hover:underline"
                      >
                        {library.email}
                      </a>
                    </div>
                  </div>
                )}

                {library.opening_hours && (
                  <div className="flex items-start gap-3">
                    <ClockIcon className="w-5 h-5 text-gray-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-gray-900">Horaires</p>
                      <p className="text-gray-600">{library.opening_hours}</p>
                    </div>
                  </div>
                )}

                {library.website && (
                  <div className="flex items-start gap-3">
                    <GlobeAltIcon className="w-5 h-5 text-gray-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-gray-900">Site web</p>
                      <a
                        href={library.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {library.website}
                      </a>
                    </div>
                  </div>
                )}

                {library.description && (
                  <div>
                    <p className="font-semibold text-gray-900 mb-1">
                      Description
                    </p>
                    <p className="text-gray-600">{library.description}</p>
                  </div>
                )}
              </div>

              {userLocation && (
                <button
                  onClick={() => setShowDirections(!showDirections)}
                  className="mt-6 w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold"
                >
                  {showDirections
                    ? "🗺️ Masquer l'itinéraire"
                    : "📍 Obtenir l'itinéraire"}
                </button>
              )}
            </div>

            {/* Books Section */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Livres disponibles ({books.length})
              </h2>

              {/* Search and Filter */}
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <input
                  type="text"
                  placeholder="Rechercher un livre ou auteur..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat === "all" ? "Toutes catégories" : cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Books Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredBooks.map((book) => (
                  <div
                    key={book.id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
                  >
                    <h3 className="font-bold text-gray-900 mb-1">
                      {book.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      par {book.author}
                    </p>

                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                        {book.category}
                      </span>
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                        {book.language}
                      </span>
                    </div>

                    {book.description && (
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {book.description}
                      </p>
                    )}

                    <div className="flex justify-between items-center text-sm">
                      <span
                        className={
                          book.available > 0 ? "text-green-600" : "text-red-600"
                        }
                      >
                        {book.available > 0
                          ? `✓ ${book.available} disponible(s)`
                          : "✗ Non disponible"}
                      </span>
                      {book.publication_year && (
                        <span className="text-gray-500">
                          {book.publication_year}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {filteredBooks.length === 0 && (
                <p className="text-center text-gray-500 py-8">
                  Aucun livre trouvé
                </p>
              )}
            </div>
          </div>

          {/* Map */}
          <div className="lg:col-span-1">
            <div className="sticky top-6">
              <MapView
                libraries={[library]}
                selectedLibrary={library}
                userLocation={userLocation}
                homeLocation={homeLocation}
                showDirections={showDirections}
                height="600px"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
