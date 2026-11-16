const TMDB_API_KEY = process.env.TMDB_API_KEY || "841432f6460e54d32e9f84da3122ee61"; // Public demo key
const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p";

export interface TMDBMovieSummary {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
}

export interface TMDBMovieDetails {
  id: number;
  title: string;
  overview: string;
  posterUrl: string;
  backdropUrl: string;
  releaseDate: string;
  duration: string;
  rating: number;
  genres: string;
  cast: string;
}

export async function searchTMDB(query: string): Promise<TMDBMovieSummary[]> {
  try {
    const res = await fetch(
      `${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}&page=1`,
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) return [];
    const data = await res.json();
    return data.results || [];
  } catch (error) {
    console.error("TMDB search error:", error);
    return [];
  }
}

export async function getTMDBDetails(movieId: number | string): Promise<TMDBMovieDetails | null> {
  try {
    const [detailsRes, creditsRes] = await Promise.all([
      fetch(`${TMDB_BASE_URL}/movie/${movieId}?api_key=${TMDB_API_KEY}`, { next: { revalidate: 3600 } }),
      fetch(`${TMDB_BASE_URL}/movie/${movieId}/credits?api_key=${TMDB_API_KEY}`, { next: { revalidate: 3600 } }),
    ]);

    if (!detailsRes.ok) return null;
    const details = await detailsRes.json();
    const credits = creditsRes.ok ? await creditsRes.json() : null;

    const genres = (details.genres || []).map((g: { name: string }) => g.name).join(", ");
    const cast = (credits?.cast || []).slice(0, 5).map((c: { name: string }) => c.name).join(", ");
    const runtimeHours = Math.floor((details.runtime || 0) / 60);
    const runtimeMins = (details.runtime || 0) % 60;
    const duration = details.runtime ? `${runtimeHours}h ${runtimeMins}m` : "2h 15m";

    return {
      id: details.id,
      title: details.title,
      overview: details.overview || "",
      posterUrl: details.poster_path ? `${TMDB_IMAGE_BASE}/w500${details.poster_path}` : "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=500",
      backdropUrl: details.backdrop_path ? `${TMDB_IMAGE_BASE}/original${details.backdrop_path}` : "https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=1200",
      releaseDate: details.release_date || "",
      duration,
      rating: Math.round((details.vote_average || 7.0) * 10) / 10,
      genres: genres || "Action, Drama",
      cast: cast || "N/A",
    };
  } catch (error) {
    console.error("TMDB details error:", error);
    return null;
  }
}
