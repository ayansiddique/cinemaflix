import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, name, email, password, plan } = body;

    if (action === "signup") {
      if (!email || !password || !name) {
        return NextResponse.json({ error: "All fields are required" }, { status: 400 });
      }

      const existing = await prisma.user.findUnique({ where: { email } });
      if (existing) {
        return NextResponse.json({ error: "Email already registered. Please login." }, { status: 400 });
      }

      const user = await prisma.user.create({
        data: {
          name,
          email,
          password, // for production bcrypt would hash, simple store for demo
          plan: "FREE",
        },
      });

      return NextResponse.json({
        user: { id: user.id, name: user.name, email: user.email, plan: user.plan },
      });
    }

    if (action === "login") {
      if (!email || !password) {
        return NextResponse.json({ error: "Email and password required" }, { status: 400 });
      }

      const user = await prisma.user.findUnique({ where: { email } });
      if (!user || user.password !== password) {
        return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
      }

      return NextResponse.json({
        user: { id: user.id, name: user.name, email: user.email, plan: user.plan },
      });
    }

    if (action === "upgrade") {
      const { userId, newPlan } = body;
      const updated = await prisma.user.update({
        where: { id: userId },
        data: { plan: newPlan || "VIP_4K" },
      });

      return NextResponse.json({
        user: { id: updated.id, name: updated.name, email: updated.email, plan: updated.plan },
      });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
