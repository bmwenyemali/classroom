"use client";

import { useState } from "react";
import { Book } from "@/lib/types/library";
import { MagnifyingGlassIcon, MapPinIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

interface BooksClientProps {
  books: Book[];
}

export default function BooksClient({ books }: BooksClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterLanguage, setFilterLanguage] = useState("all");
  const [filterAvailability, setFilterAvailability] = useState("all");

  const categories = [
    "all",
    ...Array.from(new Set(books.map((b) => b.category))),
  ];
  const languages = [
    "all",
    ...Array.from(new Set(books.map((b) => b.language))),
  ];

  const filteredBooks = books.filter((book) => {
    const matchesSearch =
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      filterCategory === "all" || book.category === filterCategory;
    const matchesLanguage =
      filterLanguage === "all" || book.language === filterLanguage;
    const matchesAvailability =
      filterAvailability === "all" ||
      (filterAvailability === "available" && book.available > 0) ||
      (filterAvailability === "unavailable" && book.available === 0);

    return (
      matchesSearch && matchesCategory && matchesLanguage && matchesAvailability
    );
  });

  // Group books by library
  const booksByLibrary = filteredBooks.reduce((acc, book) => {
    const libraryName = book.library?.name || "Unknown";
    if (!acc[libraryName]) {
      acc[libraryName] = [];
    }
    acc[libraryName].push(book);
    return acc;
  }, {} as Record<string, Book[]>);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            📚 Catalogue de Livres
          </h1>
          <p className="text-gray-600">
            Parcourez {books.length} livres disponibles dans les bibliothèques
            de Kinshasa
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher titre ou auteur..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Toutes catégories</option>
              {categories.slice(1).map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            <select
              value={filterLanguage}
              onChange={(e) => setFilterLanguage(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Toutes langues</option>
              {languages.slice(1).map((lang) => (
                <option key={lang} value={lang}>
                  {lang}
                </option>
              ))}
            </select>

            <select
              value={filterAvailability}
              onChange={(e) => setFilterAvailability(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Tous</option>
              <option value="available">Disponibles</option>
              <option value="unavailable">Non disponibles</option>
            </select>
          </div>

          <div className="mt-4 text-sm text-gray-600">
            {filteredBooks.length} livre(s) trouvé(s)
          </div>
        </div>

        {/* Books by Library */}
        <div className="space-y-6">
          {Object.entries(booksByLibrary).map(([libraryName, libraryBooks]) => {
            const library = libraryBooks[0].library;
            return (
              <div
                key={libraryName}
                className="bg-white rounded-lg shadow-md p-6"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">
                      {libraryName}
                    </h2>
                    {library && (
                      <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                        <MapPinIcon className="w-4 h-4" />
                        {library.address}
                      </p>
                    )}
                  </div>
                  {library && (
                    <Link
                      href={`/dashboard/libraries/${library.id}`}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm"
                    >
                      Voir bibliothèque
                    </Link>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {libraryBooks.map((book) => (
                    <div
                      key={book.id}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-gray-900 flex-1 pr-2">
                          {book.title}
                        </h3>
                        {book.available > 0 ? (
                          <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded whitespace-nowrap">
                            ✓ Disponible
                          </span>
                        ) : (
                          <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded whitespace-nowrap">
                            ✗ Emprunté
                          </span>
                        )}
                      </div>

                      <p className="text-sm text-gray-600 mb-3">
                        par {book.author}
                      </p>

                      <div className="flex flex-wrap gap-2 mb-3">
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                          {book.category}
                        </span>
                        <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded">
                          {book.language}
                        </span>
                        {book.publication_year && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                            {book.publication_year}
                          </span>
                        )}
                      </div>

                      {book.description && (
                        <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                          {book.description}
                        </p>
                      )}

                      {book.isbn && (
                        <p className="text-xs text-gray-500">
                          ISBN: {book.isbn}
                        </p>
                      )}

                      <div className="mt-3 pt-3 border-t border-gray-200 text-sm text-gray-600">
                        {book.available} sur {book.quantity} exemplaire(s)
                        disponible(s)
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}

          {filteredBooks.length === 0 && (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <p className="text-gray-500 text-lg">
                Aucun livre trouvé avec ces critères
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setFilterCategory("all");
                  setFilterLanguage("all");
                  setFilterAvailability("all");
                }}
                className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Réinitialiser les filtres
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
