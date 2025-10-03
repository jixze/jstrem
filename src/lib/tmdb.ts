// src/lib/tmdb.ts

const TMDB_BASE = "https://api.themoviedb.org/3";
const API_KEY = process.env.TMDB_API_KEY;

// ---------------------
// Popular
// ---------------------
export async function getPopularMovies(page: number = 1) {
  const res = await fetch(`${TMDB_BASE}/movie/popular?api_key=${API_KEY}&language=en-US&page=${page}`);
  const data = await res.json();
  return (data.results || []).map((m: any) => ({ ...m, media_type: "movie" }));
}

export async function getPopularTVShows(page: number = 1) {
  const res = await fetch(`${TMDB_BASE}/tv/popular?api_key=${API_KEY}&language=en-US&page=${page}`);
  const data = await res.json();
  return (data.results || []).map((t: any) => ({ ...t, media_type: "tv" }));
}

// ---------------------
// Multi-search
// ---------------------
export async function searchMulti(query: string) {
  const res = await fetch(`${TMDB_BASE}/search/multi?api_key=${API_KEY}&query=${encodeURIComponent(query)}&language=en-US&page=1&include_adult=false`);
  if (!res.ok) return { results: [] };
  return res.json();
}

// ---------------------
// Movies
// ---------------------
export async function getMovieById(id: string) {
  const res = await fetch(`${TMDB_BASE}/movie/${id}?api_key=${API_KEY}&language=en-US`);
  if (!res.ok) return null;
  return res.json();
}

export async function getMovieVideos(id: string) {
  const res = await fetch(`${TMDB_BASE}/movie/${id}/videos?api_key=${API_KEY}&language=en-US`);
  if (!res.ok) return { results: [] };
  return res.json();
}

export async function getMovieCredits(id: string) {
  const res = await fetch(`${TMDB_BASE}/movie/${id}/credits?api_key=${API_KEY}&language=en-US`);
  return res.json();
}

export async function getSimilarMovies(id: string) {
  const res = await fetch(`${TMDB_BASE}/movie/${id}/similar?api_key=${API_KEY}&language=en-US&page=1`);
  return res.json();
}

// ---------------------
// TV Shows
// ---------------------
export async function getTVById(tvId: string | number) {
  const res = await fetch(`${TMDB_BASE}/tv/${tvId}?api_key=${API_KEY}&language=en-US`);
  if (!res.ok) throw new Error("Failed to fetch TV show");
  return res.json();
}

export async function getTVVideos(tvId: string | number) {
  const res = await fetch(`${TMDB_BASE}/tv/${tvId}/videos?api_key=${API_KEY}&language=en-US`);
  if (!res.ok) throw new Error("Failed to fetch TV videos");
  return res.json();
}

export async function getTVCredits(tvId: string | number) {
  const res = await fetch(`${TMDB_BASE}/tv/${tvId}/credits?api_key=${API_KEY}&language=en-US`);
  if (!res.ok) throw new Error("Failed to fetch TV credits");
  return res.json();
}

// ✅ New: Get TV seasons & episodes
export async function getTVSeasons(tvId: string | number) {
  const tvShow = await getTVById(tvId);
  // Returns an array of season numbers and episode counts
  return (tvShow.seasons || []).map((s: any) => ({
    season_number: s.season_number,
    episode_count: s.episode_count,
    name: s.name,
    overview: s.overview,
  }));
}
