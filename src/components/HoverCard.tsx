"use client";

import { useState } from "react";

interface HoverCardProps {
  title: string;
  overview: string;
  posterPath: string;
  trailerKey?: string; // YouTube key
}

const IMG_BASE = "https://image.tmdb.org/t/p/w500";

export default function HoverCard({ title, overview, posterPath, trailerKey }: HoverCardProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="relative w-full h-72 overflow-hidden rounded-lg cursor-pointer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Poster Image */}
      <img
        src={`${IMG_BASE}${posterPath}`}
        alt={title}
        className={`w-full h-full object-cover transition duration-300 ${hovered ? "brightness-50" : ""}`}
      />

      {/* Hover overlay */}
      {hovered && (
        <div className="absolute top-0 left-0 w-full h-full p-2 bg-black bg-opacity-80 flex flex-col justify-between">
          {/* Trailer */}
          {trailerKey && (
            <div className="w-full h-40 mb-2">
              <iframe
                className="w-full h-full rounded"
                src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&mute=1&controls=0&loop=1&playlist=${trailerKey}`}
                title={title}
                allow="autoplay; encrypted-media"
                allowFullScreen
              />
            </div>
          )}
          {/* Title & description */}
          <div className="text-white text-sm overflow-y-auto max-h-20">
            <h3 className="font-bold text-lg mb-1">{title}</h3>
            <p>{overview}</p>
          </div>
        </div>
      )}
    </div>
  );
}
