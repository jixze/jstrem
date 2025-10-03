import { NextResponse } from "next/server";
import { getPopularMovies, getPopularTVShows } from "@/lib/tmdb";

export async function GET() {
  try {
    const [moviesData, tvData] = await Promise.all([getPopularMovies(1), getPopularTVShows(1)]);

    const movies = moviesData
      .filter(m => m.poster_path)
      .map(m => ({ ...m, media_type: "movie" }));

    const tv = tvData
      .filter(t => t.poster_path)
      .map(t => ({ ...t, media_type: "tv" }));

    return NextResponse.json({ movies, tv });
  } catch (err) {
    console.error("Recommendations API error:", err);
    return NextResponse.json({ movies: [], tv: [] });
  }
}
