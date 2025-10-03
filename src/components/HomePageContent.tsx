// src/components/HomePageContent.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import HoverCard from "./HoverCard";
import FeaturedBannerClient from "./FeaturedBannerClient";
import HorizontalScrollerClient from "./HorizontalScrollerClient";
import { getPopularMovies, getPopularTVShows } from "@/lib/tmdb";
import Navbar from "./Navbar";

export default function HomePageContent() {
  const [movies, setMovies] = useState<any[]>([]);
  const [tvShows, setTvShows] = useState<any[]>([]);
  const [featuredItems, setFeaturedItems] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const [moviesData, tvData] = await Promise.all([getPopularMovies(), getPopularTVShows()]);

      const addExtras = async (items: any[]) =>
        await Promise.all(
          items.map(async (item) => {
            const videoRes = await fetch(
              `https://api.themoviedb.org/3/${item.media_type}/${item.id}/videos?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=en-US`
            );
            const videoData = await videoRes.json();
            const trailer = (videoData.results || []).find(
              (v: any) => v.type === "Trailer" && v.site === "YouTube"
            );

            return { ...item, trailerKey: trailer?.key };
          })
        );

      const moviesExtras = await addExtras(moviesData);
      const tvExtras = await addExtras(tvData);

      setMovies(moviesExtras);
      setTvShows(tvExtras);
      setFeaturedItems([...moviesExtras.slice(0, 3), ...tvExtras.slice(0, 2)]);
    };

    fetchData();
  }, []);

  return (
    <main className="min-h-screen bg-black text-white p-6">
      <Navbar />
      <FeaturedBannerClient items={featuredItems} autoPlayInterval={6000} />

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Popular Movies</h2>
        <HorizontalScrollerClient>
          {movies.map((item) => (
            <div key={item.id} className="flex-shrink-0 w-48 transform transition-transform duration-300 hover:scale-105 hover:z-10">
              <Link href={`/${item.media_type}/${item.id}`}>
                <HoverCard
                  title={item.title}
                  overview={item.overview || "No description available."}
                  posterPath={item.poster_path}
                  trailerKey={item.trailerKey}
                />
              </Link>
            </div>
          ))}
        </HorizontalScrollerClient>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Popular TV Shows</h2>
        <HorizontalScrollerClient>
          {tvShows.map((item) => (
            <div key={item.id} className="flex-shrink-0 w-48 transform transition-transform duration-300 hover:scale-105 hover:z-10">
              <Link href={`/${item.media_type}/${item.id}`}>
                <HoverCard
                  title={item.name}
                  overview={item.overview || "No description available."}
                  posterPath={item.poster_path}
                  trailerKey={item.trailerKey}
                />
              </Link>
            </div>
          ))}
        </HorizontalScrollerClient>
      </section>
    </main>
  );
}
