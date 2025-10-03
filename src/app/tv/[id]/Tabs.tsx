"use client";
import { useState } from "react";
import Image from "next/image";

type TV = {
  poster_path?: string;
  title: string;
  id: number;
};

type Episode = {
  season: number;
  episode: number;
  name: string;
};

type TabsProps = {
  suggested: TV[];
  details: React.ReactNode;
  episodes?: Episode[]; // optional, for TV shows
  onSelectEpisode?: (season: number, episode: number) => void;
};

export default function Tabs({ suggested, details, episodes = [], onSelectEpisode }: TabsProps) {
  const [activeTab, setActiveTab] = useState<"suggested" | "details" | "episodes">("suggested");

  return (
    <div className="mt-12 w-full">
      {/* Tab buttons */}
      <div className="flex gap-4 border-b border-gray-700">
        <button
          className={`py-2 px-4 ${activeTab === "suggested" ? "border-b-2 border-red-600 font-semibold" : ""}`}
          onClick={() => setActiveTab("suggested")}
        >
          Suggested
        </button>
        <button
          className={`py-2 px-4 ${activeTab === "details" ? "border-b-2 border-red-600 font-semibold" : ""}`}
          onClick={() => setActiveTab("details")}
        >
          Details
        </button>
        {episodes.length > 0 && (
          <button
            className={`py-2 px-4 ${activeTab === "episodes" ? "border-b-2 border-red-600 font-semibold" : ""}`}
            onClick={() => setActiveTab("episodes")}
          >
            Episodes
          </button>
        )}
      </div>

      {/* Tab content */}
      <div className="mt-6">
        {activeTab === "suggested" && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {suggested.map((m) => (
              <div key={m.id} className="cursor-pointer">
                {m.poster_path && (
                  <Image
                    src={`https://image.tmdb.org/t/p/w500${m.poster_path}`}
                    alt={m.title || "TV Show Poster"}
                    width={300}
                    height={450}
                    className="rounded hover:scale-105 transition"
                  />
                )}
                <p className="mt-2 text-sm">{m.title}</p>
              </div>
            ))}
          </div>
        )}
        {activeTab === "details" && <div>{details}</div>}
        {activeTab === "episodes" && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {episodes.map((ep) => (
              <button
                key={`${ep.season}-${ep.episode}`}
                className="p-2 border border-gray-600 rounded hover:bg-red-600 hover:text-white transition"
                onClick={() => onSelectEpisode && onSelectEpisode(ep.season, ep.episode)}
              >
                S{ep.season}E{ep.episode} - {ep.name}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
