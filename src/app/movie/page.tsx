import Link from "next/link";
import HoverCard from "@/components/HoverCard";
import { getPopularMovies } from "@/lib/tmdb";

interface Props {
  searchParams?: { page?: string };
}

export default async function MoviesPage({ searchParams }: Props) {
  const page = Number(searchParams?.page) || 1; // default to page 1
  const movies = await getPopularMovies(page);   // update tmdb.ts to accept page param

  const totalPages = 10; // Optional: limit for demo, or get from TMDB API

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Movies</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
        {movies.map((movie: any) => (
          <Link key={movie.id} href={`/movie/${movie.id}`}>
            <HoverCard
              title={movie.title}
              overview={movie.overview || "No description available."}
              posterPath={movie.poster_path}
            />
          </Link>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex space-x-2 justify-center mt-6">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
          <Link
            key={p}
            href={`/movies?page=${p}`}
            className={`px-3 py-1 rounded ${
              p === page ? "bg-red-600 text-white" : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
          >
            {p}
          </Link>
        ))}
      </div>
    </div>
  );
}
