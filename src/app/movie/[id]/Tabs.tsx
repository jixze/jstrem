"use client";
import { useState } from "react";
import Image from "next/image";

type Movie = {
  poster_path?: string;
  title: string;
  id: number;
};

type TabsProps = {
  suggested: Movie[];
  details: React.ReactNode;
};

export default function Tabs({ suggested, details }: TabsProps) {
  const [activeTab, setActiveTab] = useState<"suggested" | "details">("suggested");

  return (
    <div className="mt-12 w-full">
      {/* Tab buttons */}
      <div className="flex gap-4 border-b border-gray-700">
        <button
          className={`py-2 px-4 ${
            activeTab === "suggested" ? "border-b-2 border-red-600 font-semibold" : ""
          }`}
          onClick={() => setActiveTab("suggested")}
        >
          Suggested
        </button>
        <button
          className={`py-2 px-4 ${
            activeTab === "details" ? "border-b-2 border-red-600 font-semibold" : ""
          }`}
          onClick={() => setActiveTab("details")}
        >
          Details
        </button>
      </div>

      {/* Tab content */}
      <div className="mt-6">
        {activeTab === "suggested" ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {suggested.map((m) => (
              <div key={m.id} className="cursor-pointer">
                {m.poster_path && (
                  <Image
                    src={`https://image.tmdb.org/t/p/w500${m.poster_path}`}
                    alt={m.title}
                    width={300}
                    height={450}
                    className="rounded hover:scale-105 transition"
                  />
                )}
                <p className="mt-2 text-sm">{m.title}</p>
              </div>
            ))}
          </div>
        ) : (
          <div>{details}</div>
        )}
      </div>
    </div>
  );
}
