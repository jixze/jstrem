import Image from "next/image";
import { FaVideo } from "react-icons/fa";
import {
  getMovieById,
  getMovieVideos,
  getMovieCredits,
} from "@/lib/tmdb";
import Tabs from "./Tabs";
import MoviePlayer from "./MoviePlayer"; // new client wrapper

const IMG_BASE = "https://image.tmdb.org/t/p/original";

type MoviePageProps = {
  params: { id: string };
};

export default async function MoviePage({ params }: MoviePageProps) {
  const movieId = params.id;

  // Fetch movie, videos, credits
  const [movie, videos, credits] = await Promise.all([
    getMovieById(movieId),
    getMovieVideos(movieId),
    getMovieCredits(movieId),
  ]);

  // Intertitle/logo
  const logoRes = await fetch(
    `https://api.themoviedb.org/3/movie/${movieId}/images?api_key=${process.env.TMDB_API_KEY}&language=en`
  );
  const logoData = await logoRes.json();
  const intertitle = (logoData.logos || [])[0]?.file_path || null;

  // Suggested movies
  let suggestedMovies: any[] = [];
  if (movie.belongs_to_collection) {
    const collectionRes = await fetch(
      `https://api.themoviedb.org/3/collection/${movie.belongs_to_collection.id}?api_key=${process.env.TMDB_API_KEY}&language=en-US`
    );
    const collectionData = await collectionRes.json();
    suggestedMovies = collectionData.parts
      .filter((m: any) => m.id !== movie.id)
      .slice(0, 8);
  }

  const trailer = (videos.results || []).find(
    (v: any) => v.type === "Trailer" && v.site === "YouTube"
  );

  const releaseYear = movie.release_date
    ? new Date(movie.release_date).getFullYear()
    : "N/A";
  const duration = movie.runtime ? `${movie.runtime} min` : "N/A";
  const genres = movie.genres?.map((g: any) => g.name).join(", ") || "N/A";
  const director = credits.crew?.find((c: any) => c.job === "Director")?.name || "N/A";
  const cast = credits.cast?.slice(0, 5).map((c: any) => c.name).join(", ") || "N/A";

  return (
    <main className="relative min-h-screen text-white">
      {/* Background */}
      {movie.backdrop_path && (
        <div className="absolute inset-0 -z-10">
          <Image
            src={`${IMG_BASE}${movie.backdrop_path}`}
            alt={movie.title}
            fill
            className="object-cover brightness-50"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-900/90" />
        </div>
      )}

      <div className="relative max-w-6xl mx-auto px-6 py-20 flex flex-col items-start">
        {/* Intertitle */}
        {intertitle ? (
          <Image
            src={`${IMG_BASE}${intertitle}`}
            alt={movie.title}
            width={600}
            height={200}
            className="mb-4 object-contain"
          />
        ) : (
          <h1 className="text-5xl md:text-6xl font-extrabold drop-shadow-lg mb-2">
            {movie.title}
          </h1>
        )}

        {/* Badges */}
        <div className="flex items-center gap-3 mt-2">
          {movie.adult ? (
            <span className="px-2 py-1 border border-white rounded text-sm">18+</span>
          ) : (
            <span className="px-2 py-1 border border-white rounded text-sm">PG-13</span>
          )}
        </div>

        {/* Year, duration, genres */}
        <div className="flex flex-wrap gap-4 text-sm text-gray-300 mt-2">
          <span>{releaseYear}</span>
          <span>{duration}</span>
          <span>{genres}</span>
        </div>

        {/* Description */}
        <p className="mt-6 text-lg md:text-xl max-w-3xl leading-relaxed drop-shadow-md">
          {movie.overview}
        </p>

        {/* Play / Trailer buttons handled by client wrapper */}
        <MoviePlayer
            movieId={movie.id}
            trailerKey={trailer?.key}
            movieTitle={movie.title} // <-- pass the title
        />
        
        {/* Tabs */}
        <Tabs
          suggested={suggestedMovies}
          details={
            <div className="text-gray-300 space-y-2 max-w-3xl">
              <p><span className="font-semibold text-white">Description:</span> {movie.overview}</p>
              <p><span className="font-semibold text-white">Duration:</span> {duration}</p>
              <p><span className="font-semibold text-white">Release Date:</span> {movie.release_date}</p>
              <p><span className="font-semibold text-white">Genre:</span> {genres}</p>
              <p><span className="font-semibold text-white">Rating:</span> {movie.vote_average}/10</p>
              <p><span className="font-semibold text-white">Director:</span> {director}</p>
              <p><span className="font-semibold text-white">Starring:</span> {cast}</p>
            </div>
          }
        />
      </div>
    </main>
  );
}
