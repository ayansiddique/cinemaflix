import { NextResponse } from "next/server";
import { extractYouTubeId } from "@/lib/youtube";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("url") || searchParams.get("id");

    if (!query) {
      return NextResponse.json({ error: "Missing YouTube URL or video ID" }, { status: 400 });
    }

    const videoId = extractYouTubeId(query);
    if (!videoId) {
      return NextResponse.json({ error: "Invalid YouTube URL or ID" }, { status: 400 });
    }

    // Official free YouTube oEmbed endpoint (no API key needed)
    const oembedUrl = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`;
    const res = await fetch(oembedUrl);

    let title = "Uploaded Movie Stream";
    let author = "Official Channel";

    if (res.ok) {
      const data = await res.json();
      title = data.title || title;
      author = data.author_name || author;
    }

    // High quality YouTube thumbnails
    const backdropUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
    const posterUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

    return NextResponse.json({
      youtubeVideoId: videoId,
      title,
      author,
      backdropUrl,
      posterUrl,
      overview: `Streaming online in HD. Uploaded and hosted via ${author}. Enjoy uninterrupted viewing experience on CinemaFlix.`,
      duration: "2h 15m",
      rating: 8.5,
      genres: "Action, Adventure, HD",
      releaseDate: new Date().getFullYear().toString(),
    });
  } catch (error: any) {
    console.error("YouTube auto-fetch error:", error);
    return NextResponse.json({ error: error.message || "Failed to fetch YouTube details" }, { status: 500 });
  }
}
