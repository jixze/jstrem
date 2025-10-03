"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image"; // <-- added

interface FeaturedBannerItem {
  id: number;
  title: string;
  name?: string;
  overview: string;
  backdrop_path: string;
  media_type: "movie" | "tv";
  logo_path?: string | null; // <-- new optional property
}

interface FeaturedBannerProps {
  items: FeaturedBannerItem[];
  autoPlayInterval?: number; // milliseconds
}

const IMG_BASE = "https://image.tmdb.org/t/p/original";

export default function FeaturedBanner({
  items,
  autoPlayInterval = 5000,
}: FeaturedBannerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length);
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [items.length, autoPlayInterval]);

  if (items.length === 0) return null;

  const current = items[currentIndex];

  return (
    <div className="relative w-full h-[500px] md:h-[600px] rounded-lg overflow-hidden mb-8">
      {/* Background image */}
      <div
        className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
        style={{
          backgroundImage: `url(${IMG_BASE}${current.backdrop_path})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      ></div>

      {/* Dark gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>

      {/* Content */}
      <div className="relative p-6 md:p-12 max-w-3xl text-white flex flex-col justify-end h-full">
        {/* Use official logo if available */}
        {current.logo_path ? (
          <div className="mb-4">
            <Image
              src={`https://image.tmdb.org/t/p/original${current.logo_path}`}
              alt={current.title || current.name}
              width={400} // adjust as needed
              height={100} // adjust as needed
              className="object-contain"
            />
          </div>
        ) : (
          <h1 className="text-3xl md:text-5xl font-bold mb-4">{current.title || current.name}</h1>
        )}

        <p className="hidden md:block mb-6 text-gray-200 line-clamp-3">{current.overview}</p>

        {/* Buttons */}
        <div className="flex space-x-4">
          <Link
            href={`/${current.media_type}/${current.id}`}
            className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded font-semibold transition"
          >
            Watch
          </Link>
          <Link
            href={`/${current.media_type}/${current.id}`}
            className="bg-white text-gray-900 hover:bg-gray-200 px-6 py-3 rounded font-semibold transition"
          >
            Details
          </Link>
        </div>
      </div>

      {/* Optional: small navigation dots */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {items.map((_, i) => (
          <button
            key={i}
            className={`w-3 h-3 rounded-full ${
              i === currentIndex ? "bg-white" : "bg-gray-400"
            }`}
            onClick={() => setCurrentIndex(i)}
          />
        ))}
      </div>
    </div>
  );
}
