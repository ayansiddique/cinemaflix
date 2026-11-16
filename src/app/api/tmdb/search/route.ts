import { NextResponse } from "next/server";
import { searchTMDB } from "@/lib/tmdb";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q");

  if (!query) {
    return NextResponse.json({ results: [] });
  }

  const results = await searchTMDB(query);
  return NextResponse.json({ results });
}
