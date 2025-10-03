import Link from "next/link";
import HoverCard from "@/components/HoverCard";
import FeaturedBanner from "@/components/FeaturedBanner";
import HorizontalScroller from "@/components/HorizontalScroller";
import { getPopularMovies, getPopularTVShows } from "@/lib/tmdb";
import Navbar from "@/components/Navbar";

export default async function HomePage() {
  const [movies, tvShows] = await Promise.all([getPopularMovies(), getPopularTVShows()]);

  const addExtras = async (items: any[]) =>
    await Promise.all(
      items.map(async (item) => {
        const videoRes = await fetch(
          `https://api.themoviedb.org/3/${item.media_type}/${item.id}/videos?api_key=${process.env.TMDB_API_KEY}&language=en-US`
        );
        const videoData = await videoRes.json();
        const trailer = (videoData.results || []).find(
          (v: any) => v.type === "Trailer" && v.site === "YouTube"
        );

        const logoRes = await fetch(
          `https://api.themoviedb.org/3/${item.media_type}/${item.id}/images?api_key=${process.env.TMDB_API_KEY}&language=en`
        );
        const logoData = await logoRes.json();
        const logo = (logoData.logos || [])[0]?.file_path || null;

        return { ...item, trailerKey: trailer?.key, logo_path: logo };
      })
    );

  const moviesWithExtras = await addExtras(movies);
  const tvWithExtras = await addExtras(tvShows);

  const featuredItems = [...moviesWithExtras.slice(0, 3), ...tvWithExtras.slice(0, 2)];

  return (
    <>
      <main className="min-h-screen bg-black text-white p-6">
        <FeaturedBanner items={featuredItems} autoPlayInterval={6000} />

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Popular Movies</h2>
          <HorizontalScroller>
            {moviesWithExtras.map((item: any) => (
              <div
                key={item.id}
                className="flex-shrink-0 w-48 transform transition-transform duration-300 hover:scale-105 hover:z-10"
              >
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
          </HorizontalScroller>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">Popular TV Shows</h2>
          <HorizontalScroller>
            {tvWithExtras.map((item: any) => (
              <div
                key={item.id}
                className="flex-shrink-0 w-48 transform transition-transform duration-300 hover:scale-105 hover:z-10"
              >
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
          </HorizontalScroller>
        </section>
      </main>
    </>
  );
}
