import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateSlug, extractYouTubeId } from "@/lib/youtube";
import { DEFAULT_MOVIES } from "@/lib/defaultMovies";
import { getCustomMovies, saveCustomMovie } from "@/lib/customStore";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const featured = searchParams.get("featured");
    const trending = searchParams.get("trending");

    let movies: any[] = [];
    try {
      const where: any = {};

      if (featured === "true") where.isFeatured = true;
      if (trending === "true") where.isTrending = true;
      if (search) {
        where.OR = [
          { title: { contains: search } },
          { genres: { contains: search } },
          { cast: { contains: search } },
        ];
      }
      if (category && category !== "All") {
        where.genres = { contains: category };
      }

      movies = await prisma.movie.findMany({
        where,
        orderBy: { createdAt: "desc" },
      });
    } catch (dbErr) {
      console.warn("DB query failed in /api/movies, using fallback:", dbErr);
    }

    // Merge custom movies published by Admin
    const custom = getCustomMovies();
    if (!movies || movies.length === 0) {
      movies = [...custom, ...DEFAULT_MOVIES];
    } else {
      movies = [...custom, ...movies];
    }

    if (featured === "true") movies = movies.filter((m) => m.isFeatured);
    if (trending === "true") movies = movies.filter((m) => m.isTrending);
    if (category && category !== "All") {
      movies = movies.filter((m) => (m.genres || "").toLowerCase().includes(category.toLowerCase()));
    }
    if (search) {
      const s = search.toLowerCase();
      movies = movies.filter((m) =>
        (m.title || "").toLowerCase().includes(s) ||
        (m.genres || "").toLowerCase().includes(s) ||
        (m.cast || "").toLowerCase().includes(s)
      );
    }

    return NextResponse.json(movies);
  } catch (error: any) {
    console.error("GET /api/movies error:", error);
    return NextResponse.json([...getCustomMovies(), ...DEFAULT_MOVIES]);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      title,
      overview,
      posterUrl,
      backdropUrl,
      youtubeVideoId,
      releaseDate,
      duration,
      rating,
      genres,
      cast,
      isFeatured,
      isTrending,
    } = body;

    if (!title || !youtubeVideoId) {
      return NextResponse.json({ error: "Title and YouTube link/ID are required" }, { status: 400 });
    }

    const cleanVideoId = extractYouTubeId(youtubeVideoId);
    let slug = generateSlug(title);

    const newMovieItem = {
      id: "movie-" + Date.now().toString(),
      title,
      slug,
      overview: overview || "No overview available.",
      posterUrl: posterUrl || "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=500",
      backdropUrl: backdropUrl || "https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=1200",
      youtubeVideoId: cleanVideoId,
      releaseDate: releaseDate || new Date().getFullYear().toString(),
      duration: duration || "2h 00m",
      rating: rating ? parseFloat(rating) : 7.5,
      genres: genres || "Action, Drama",
      cast: cast || "",
      isFeatured: Boolean(isFeatured),
      isTrending: Boolean(isTrending),
      views: 0,
    };

    try {
      const existing = await prisma.movie.findUnique({ where: { slug } });
      if (existing) {
        slug = `${slug}-${Date.now().toString().slice(-4)}`;
        newMovieItem.slug = slug;
      }

      const movie = await prisma.movie.create({
        data: {
          title,
          slug,
          overview: newMovieItem.overview,
          posterUrl: newMovieItem.posterUrl,
          backdropUrl: newMovieItem.backdropUrl,
          youtubeVideoId: cleanVideoId,
          releaseDate: newMovieItem.releaseDate,
          duration: newMovieItem.duration,
          rating: newMovieItem.rating,
          genres: newMovieItem.genres,
          cast: newMovieItem.cast,
          isFeatured: newMovieItem.isFeatured,
          isTrending: newMovieItem.isTrending,
        },
      });

      saveCustomMovie(movie as any);
      return NextResponse.json(movie, { status: 201 });
    } catch (dbErr) {
      console.warn("DB write failed, persisting to serverless custom store:", dbErr);
      saveCustomMovie(newMovieItem);
      return NextResponse.json(newMovieItem, { status: 201 });
    }
  } catch (error: any) {
    console.error("POST /api/movies error:", error);
    return NextResponse.json({ error: error.message || "Failed to create movie" }, { status: 500 });
  }
}
