"use client";

import { useState } from "react";
import { FaPlay, FaVideo } from "react-icons/fa";

type Props = {
  movieId: string | number;
  trailerKey?: string;
  movieTitle: string; // <- make sure this is passed
};

export default function MoviePlayer({ movieId, trailerKey, movieTitle }: Props) {
  const [showPlayer, setShowPlayer] = useState(false);

  return (
    <>
      <div className="flex gap-4 mt-6">
        <button
          onClick={() => setShowPlayer(true)}
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-6 py-3 rounded font-semibold text-white shadow-lg transition"
        >
          <FaPlay /> Play
        </button>

        {trailerKey && (
          <a
            href={`https://www.youtube.com/watch?v=${trailerKey}`}
            target="_blank"
            className="flex items-center gap-2 border border-white px-6 py-3 rounded font-semibold hover:bg-white hover:text-black transition"
          >
            <FaVideo /> Trailer
          </a>
        )}
      </div>

      {showPlayer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90">
          <div className="w-full h-full relative">
            <iframe
              src={`https://player.videasy.net/movie/${movieId}`}
              width="100%"
              height="100%"
              frameBorder="0"
              allowFullScreen
              allow="encrypted-media"
            />
            {/* Back button */}
            <button
              onClick={() => setShowPlayer(false)}
              className="absolute top-4 left-4 px-3 py-2 text-white text-lg font-semibold hover:underline bg-transparent"
            >
              &lt; {movieTitle}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
