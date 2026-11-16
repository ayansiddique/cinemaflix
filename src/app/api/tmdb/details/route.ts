import { NextResponse } from "next/server";
import { getTMDBDetails } from "@/lib/tmdb";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Missing movie ID" }, { status: 400 });
  }

  const details = await getTMDBDetails(id);
  if (!details) {
    return NextResponse.json({ error: "Movie not found on TMDB" }, { status: 404 });
  }

  return NextResponse.json(details);
}
