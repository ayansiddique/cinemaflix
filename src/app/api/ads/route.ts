import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const ads = await prisma.adPlacement.findMany();
    return NextResponse.json(ads);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { slot, title, code, isActive } = body;

    const ad = await prisma.adPlacement.upsert({
      where: { slot },
      update: {
        title,
        code,
        isActive: Boolean(isActive),
      },
      create: {
        slot,
        title,
        code,
        isActive: Boolean(isActive),
      },
    });

    return NextResponse.json(ad);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
