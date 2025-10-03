"use client";

import { useState, useEffect } from "react";
import { FaPlay, FaVideo } from "react-icons/fa";

type Props = {
  tvId: string | number;
  season?: number;
  episode?: number;
  trailerKey?: string;
  title: string;
  totalSeasons?: number;
  episodesPerSeason?: Record<number, number>; // optional
};

export default function TVPlayer({
  tvId,
  season = 1,
  episode = 1,
  trailerKey,
  title,
  episodesPerSeason = {},
}: Props) {
  const [showPlayer, setShowPlayer] = useState(false);
  const [selectedSeason, setSelectedSeason] = useState(season);
  const [selectedEpisode, setSelectedEpisode] = useState(episode);

  // Available seasons
  const seasons = Object.keys(episodesPerSeason).length
    ? Object.keys(episodesPerSeason).map(Number)
    : [1];

  // Ensure selectedSeason exists
  const currentSeason = seasons.includes(selectedSeason) ? selectedSeason : seasons[0];

  // Update episode count for the current season
  const epCount = episodesPerSeason[currentSeason] ?? 1;

  // Reset episode if season changes
  useEffect(() => {
    setSelectedEpisode(1);
  }, [currentSeason]);

  const src = `https://player.videasy.net/tv/${tvId}/${selectedSeason}/${selectedEpisode}`;

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

      {/* Season & Episode selectors */}
      <div className="flex gap-4 mt-4">
        <select
          value={selectedSeason}
          onChange={(e) => setSelectedSeason(Number(e.target.value))}
          className="bg-gray-800 text-white px-3 py-2 rounded"
        >
          {seasons.map((s) => (
            <option key={s} value={s}>
              Season {s}
            </option>
          ))}
        </select>

        <select
          value={selectedEpisode}
          onChange={(e) => setSelectedEpisode(Number(e.target.value))}
          className="bg-gray-800 text-white px-3 py-2 rounded"
        >
          {Array.from({ length: epCount }, (_, i) => i + 1).map((ep) => (
            <option key={ep} value={ep}>
              Episode {ep}
            </option>
          ))}
        </select>
      </div>

      {showPlayer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90">
          <div className="w-full h-full relative">
            <iframe
              src={src}
              width="100%"
              height="100%"
              frameBorder="0"
              allowFullScreen
              allow="encrypted-media"
            />
            <button
              onClick={() => setShowPlayer(false)}
              className="absolute top-4 left-4 px-3 py-2 text-white text-lg font-semibold hover:underline bg-transparent"
            >
              &lt; {title}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
