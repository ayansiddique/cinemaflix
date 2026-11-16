import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { extractYouTubeId } from "@/lib/youtube";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    // can be uuid or slug
    const movie = await prisma.movie.findFirst({
      where: {
        OR: [{ id }, { slug: id }],
      },
    });

    if (!movie) {
      return NextResponse.json({ error: "Movie not found" }, { status: 404 });
    }

    // Increment views
    await prisma.movie.update({
      where: { id: movie.id },
      data: { views: { increment: 1 } },
    });

    return NextResponse.json(movie);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();

    if (body.youtubeVideoId) {
      body.youtubeVideoId = extractYouTubeId(body.youtubeVideoId);
    }

    const updated = await prisma.movie.update({
      where: { id },
      data: {
        ...body,
        rating: body.rating ? parseFloat(body.rating) : undefined,
      },
    });

    return NextResponse.json(updated);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    await prisma.movie.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
