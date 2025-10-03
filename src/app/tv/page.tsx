import Link from "next/link";
import HoverCard from "@/components/HoverCard";
import { getPopularTVShows } from "@/lib/tmdb";

interface Props {
  searchParams?: { page?: string };
}

export default async function TVPage({ searchParams }: Props) {
  const page = Number(searchParams?.page) || 1; // default to page 1
  const tvShows = await getPopularTVShows(page); // fetch with page param

  const totalPages = 10; // Optional: max number of pages to show

  return (
    <main className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-3xl font-bold mb-6">TV Shows</h1>

      {/* TV Shows Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
        {tvShows.map((show: any) => (
          <Link key={show.id} href={`/tv/${show.id}`}>
            <HoverCard
              title={show.name}
              overview={show.overview || "No description available."}
              posterPath={show.poster_path}
            />
          </Link>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex space-x-2 justify-center mt-6">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
          <Link
            key={p}
            href={`/tv?page=${p}`}
            className={`px-3 py-1 rounded ${
              p === page
                ? "bg-red-600 text-white"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
          >
            {p}
          </Link>
        ))}
      </div>
    </main>
  );
}
