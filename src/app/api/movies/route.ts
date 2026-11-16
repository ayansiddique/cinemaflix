import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateSlug, extractYouTubeId } from "@/lib/youtube";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const featured = searchParams.get("featured");
    const trending = searchParams.get("trending");

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

    const movies = await prisma.movie.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(movies);
  } catch (error: any) {
    console.error("GET /api/movies error:", error);
    return NextResponse.json({ error: error.message || "Failed to fetch movies" }, { status: 500 });
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

    // Ensure unique slug
    const existing = await prisma.movie.findUnique({ where: { slug } });
    if (existing) {
      slug = `${slug}-${Date.now().toString().slice(-4)}`;
    }

    const movie = await prisma.movie.create({
      data: {
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
      },
    });

    return NextResponse.json(movie, { status: 201 });
  } catch (error: any) {
    console.error("POST /api/movies error:", error);
    return NextResponse.json({ error: error.message || "Failed to create movie" }, { status: 500 });
  }
}
