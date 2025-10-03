"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

const IMG_BASE = "https://image.tmdb.org/t/p/w500";
const DEBOUNCE_DELAY = 300; // ms

const getTitle = (item: any) => {
  return item.title || item.name || item.original_title || item.original_name || "No Title";
};

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [recommended, setRecommended] = useState<any[]>([]);

  // Fetch recommendations on mount
  useEffect(() => {
    async function fetchRecommended() {
      try {
        const res = await fetch("/api/recommendations", { cache: "no-store" });
        const data = await res.json();
        if (!data.movies || !data.tv) return;

        let recs = [
          ...data.movies.filter((m: any) => m.poster_path),
          ...data.tv.filter((t: any) => t.poster_path),
        ];

        for (let i = recs.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [recs[i], recs[j]] = [recs[j], recs[i]];
        }

        setRecommended(recs.slice(0, 20));
      } catch (err) {
        console.error("Failed to load recommendations:", err);
      }
    }

    fetchRecommended();
  }, []);

  // Live search effect (debounced)
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timeout = setTimeout(() => {
      handleSearch();
    }, DEBOUNCE_DELAY);

    return () => clearTimeout(timeout);
  }, [query]);

  const handleSearch = async () => {
    if (!query.trim()) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      const data = await res.json();

      const sortedResults = (data.results || [])
        .filter((item: any) => item.poster_path)
        .sort((a: any, b: any) => (b.popularity || 0) - (a.popularity || 0));

      setResults(sortedResults);
    } catch (err) {
      console.error("Search failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const genres = [
    "Action", "Comedy", "Drama", "Fantasy", "Horror",
    "Romance", "Sci-Fi", "Thriller", "Documentary",
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-white flex">
      {/* Left Sidebar */}
      <aside className="hidden md:block w-48 p-4 border-r border-gray-800">
        <h2 className="text-lg font-bold mb-4">Genres</h2>
        <ul className="space-y-2">
          {genres.map((genre) => (
            <li key={genre}>
              <button className="w-full text-left px-3 py-2 rounded-lg bg-transparent-800 hover:bg-red-600 hover:shadow-[0_0_8px_rgba(255,0,0,0.6)] transition">
                {genre}
              </button>
            </li>
          ))}
        </ul>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        {/* Search Bar */}
        <form onSubmit={(e) => { e.preventDefault(); handleSearch(); }} className="max-w-2xl mx-auto flex space-x-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search"
            className="w-full px-4 py-3 rounded-lg bg-gray-800 text-gray-200 focus:outline-none focus:ring-2 focus:ring-neutral-700"
          />
          <button
            type="submit"
            className="px-6 py-3 rounded-lg bg-red-600 hover:bg-red-500 transition font-semibold"
          >
            Search
          </button>
        </form>

        {/* Recommendations or Search Results */}
        <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {loading && <p className="col-span-full text-center">Loading...</p>}

          {!loading && query.trim() === "" && recommended.map((item) => (
            <Link
              key={item.id}
              href={`/${item.media_type === "movie" ? "movie" : "tv"}/${item.id}`}
              className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-red-500/50 transition transform hover:scale-105"
            >
              <div className="relative w-full aspect-[2/3]">
                <Image
                  src={`${IMG_BASE}${item.poster_path}`}
                  alt={getTitle(item)}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-2">
                <h3 className="text-sm font-semibold truncate">{getTitle(item)}</h3>
                <p className="text-xs text-gray-400">
                  {item.media_type === "movie"
                    ? `${item.release_date?.slice(0, 4) || "N/A"} • ⭐ ${item.vote_average?.toFixed(1)}`
                    : `${item.first_air_date?.slice(0, 4) || "N/A"} • ⭐ ${item.vote_average?.toFixed(1)}`}
                </p>
              </div>
            </Link>
          ))}

          {!loading && query.trim() !== "" && results.map((item) => (
            <Link
              key={item.id}
              href={`/${item.media_type === "movie" ? "movie" : "tv"}/${item.id}`}
              className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-red-500/50 transition transform hover:scale-105"
            >
              <div className="relative w-full aspect-[2/3]">
                <Image
                  src={`${IMG_BASE}${item.poster_path}`}
                  alt={getTitle(item)}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-3">
                <h3 className="text-sm font-semibold truncate">{getTitle(item)}</h3>
                <p className="text-xs text-gray-400">
                  {item.media_type === "movie"
                    ? `${item.release_date?.slice(0, 4) || "N/A"} • ⭐ ${item.vote_average?.toFixed(1)}`
                    : `${item.first_air_date?.slice(0, 4) || "N/A"} • ⭐ ${item.vote_average?.toFixed(1)}`}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
