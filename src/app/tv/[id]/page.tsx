// app/tv/[id]/page.tsx
// @ts-nocheck
import Image from "next/image";
import { getTVById, getTVVideos, getTVCredits } from "@/lib/tmdb";
import Tabs from "./Tabs";
import TVPlayer from "./TVPlayer";

const IMG_BASE = "https://image.tmdb.org/t/p/original";

export default async function TVPage({ params, searchParams }) {
  const tvId = params.id;

  const [tvShow, videos, credits] = await Promise.all([
    getTVById(tvId),
    getTVVideos(tvId),
    getTVCredits(tvId),
  ]);

  const logoRes = await fetch(
    `https://api.themoviedb.org/3/tv/${tvId}/images?api_key=${process.env.TMDB_API_KEY}&language=en`
  );
  const logoData = await logoRes.json();
  const intertitle = (logoData.logos || [])[0]?.file_path || null;

  const similarRes = await fetch(
    `https://api.themoviedb.org/3/tv/${tvId}/similar?api_key=${process.env.TMDB_API_KEY}&language=en-US&page=1`
  );
  const similarData = await similarRes.json();
  const suggestedShows = similarData.results.slice(0, 8);

  const trailer = (videos.results || []).find(
    (v) => v.type === "Trailer" && v.site === "YouTube"
  );

  const releaseYear = tvShow.first_air_date
    ? new Date(tvShow.first_air_date).getFullYear()
    : "N/A";
  const duration = tvShow.episode_run_time?.[0] ? `${tvShow.episode_run_time[0]} min` : "N/A";
  const genres = tvShow.genres?.map((g) => g.name).join(", ") || "N/A";
  const director = credits.crew?.find((c) => c.job === "Director")?.name || "N/A";
  const cast = credits.cast?.slice(0, 5).map((c) => c.name).join(", ") || "N/A";

  const episodes = tvShow.seasons.flatMap((season) =>
    Array.from({ length: season.episode_count }, (_, i) => ({
      season: season.season_number,
      episode: i + 1,
      name: `${season.name || `Season ${season.season_number}`} Episode ${i + 1}`,
    }))
  );

  const episodesPerSeason = tvShow.seasons.reduce((acc, s) => {
    if (s.season_number && s.episode_count) acc[s.season_number] = s.episode_count;
    return acc;
  }, {});

  return (
    <main className="relative min-h-screen text-white">
      {tvShow.backdrop_path && (
        <div className="absolute inset-0 -z-10">
          <Image
            src={`${IMG_BASE}${tvShow.backdrop_path}`}
            alt={tvShow.name}
            fill
            className="object-cover brightness-50"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-900/90" />
        </div>
      )}

      <div className="relative max-w-6xl mx-auto px-6 py-20 flex flex-col items-start">
        {intertitle ? (
          <Image
            src={`${IMG_BASE}${intertitle}`}
            alt={tvShow.name}
            width={600}
            height={200}
            className="mb-4 object-contain"
          />
        ) : (
          <h1 className="text-5xl md:text-6xl font-extrabold drop-shadow-lg mb-2">
            {tvShow.name}
          </h1>
        )}

        <div className="flex items-center gap-3 mt-2">
          {tvShow.adult ? (
            <span className="px-2 py-1 border border-white rounded text-sm">18+</span>
          ) : (
            <span className="px-2 py-1 border border-white rounded text-sm">PG-13</span>
          )}
        </div>

        <div className="flex flex-wrap gap-4 text-sm text-gray-300 mt-2">
          <span>{releaseYear}</span>
          <span>{duration}</span>
          <span>{genres}</span>
          <span>{tvShow.number_of_seasons} Seasons</span>
        </div>

        <p className="mt-6 text-lg md:text-xl max-w-3xl leading-relaxed drop-shadow-md">
          {tvShow.overview}
        </p>

        <TVPlayer
          tvId={tvShow.id}
          title={tvShow.name}
          trailerKey={trailer?.key}
          season={1}
          episode={1}
          episodesPerSeason={episodesPerSeason}
        />

        <Tabs
          episodes={episodes}
          suggested={suggestedShows}
          details={
            <div className="text-gray-300 space-y-2 max-w-3xl">
              <p>
                <span className="font-semibold text-white">Description:</span> {tvShow.overview}
              </p>
              <p>
                <span className="font-semibold text-white">Episode Duration:</span> {duration}
              </p>
              <p>
                <span className="font-semibold text-white">First Air Date:</span> {tvShow.first_air_date}
              </p>
              <p>
                <span className="font-semibold text-white">Genre:</span> {genres}
              </p>
              <p>
                <span className="font-semibold text-white">Rating:</span> {tvShow.vote_average}/10
              </p>
              <p>
                <span className="font-semibold text-white">Director:</span> {director}
              </p>
              <p>
                <span className="font-semibold text-white">Starring:</span> {cast}
              </p>
            </div>
          }
        />
      </div>
    </main>
  );
}
