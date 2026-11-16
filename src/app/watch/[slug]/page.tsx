import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import Navbar from "@/components/Navbar";
import CustomPlayer from "@/components/CustomPlayer";
import {
  Star,
  ArrowLeft,
  Crown,
} from "lucide-react";

import Footer from "@/components/Footer";

export const dynamic = "force-dynamic";

interface WatchPageProps {
  params: { slug: string };
}

export default async function WatchPage({ params }: WatchPageProps) {
  const { slug } = params;

  // Fetch movie
  const movie = await prisma.movie.findFirst({
    where: {
      OR: [{ slug }, { id: slug }],
    },
  });

  if (!movie) {
    notFound();
  }

  // Increment views
  await prisma.movie.update({
    where: { id: movie.id },
    data: { views: { increment: 1 } },
  });

  // Fetch active Sidebar Ad
  const sidebarAd = await prisma.adPlacement.findFirst({
    where: { isActive: true },
  });

  // Fetch "More Like This" movies
  const moreMovies = await prisma.movie.findMany({
    where: {
      id: { not: movie.id },
    },
    take: 6,
    orderBy: { views: "desc" },
  });

  return (
    <div className="min-h-screen bg-[#0e0f12] text-white selection:bg-red-600 selection:text-white">
      <Navbar />

      <main className="pt-20 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-4">
        {/* Top Header Breadcrumb */}
        <div className="flex items-center justify-between text-xs py-1">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 font-bold text-neutral-400 hover:text-white transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Browse</span>
          </Link>
        </div>

        {/* TWO-COLUMN CINEMA LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT COLUMN: Player, Actions, Title, Description & Comments (8 of 12 columns) */}
          <div className="lg:col-span-8 space-y-4">
            <CustomPlayer
              videoId={movie.youtubeVideoId}
              movieTitle={movie.title}
              overview={movie.overview}
              releaseDate={movie.releaseDate || "2024"}
              views={movie.views}
              genres={movie.genres}
              cast={movie.cast || ""}
            />
          </div>

          {/* RIGHT SIDEBAR: Contained Ad & Clean Recommendations (4 of 12 columns) */}
          <div className="lg:col-span-4 space-y-6">
            {/* 1. Contained Ad Banner Slot */}
            {sidebarAd && sidebarAd.isActive ? (
              <div className="p-2 text-center overflow-hidden">
                <div dangerouslySetInnerHTML={{ __html: sidebarAd.code }} />
              </div>
            ) : (
              <div className="bg-neutral-900/60 border border-neutral-800/60 p-4 rounded-2xl text-left space-y-2">
                <div className="flex items-center gap-2">
                  <Crown className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-black text-white">Go Premium VIP Pass</span>
                </div>
                <p className="text-xs text-neutral-400">
                  Unlock 1080p FHD & 4K Ultra HD. 100% ad-free cinema experience.
                </p>
                <Link
                  href="/#go-premium"
                  className="inline-block w-full py-2 bg-[#f5c518] hover:bg-[#e2b616] text-black font-extrabold text-xs text-center rounded-xl shadow transition"
                >
                  Go Premium (Rs 499)
                </Link>
              </div>
            )}

            {/* 2. "More Like This" Recommendations Grid (Clean flat minimal layout) */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-neutral-300 uppercase tracking-wider">
                More Like This
              </h3>

              <div className="grid grid-cols-2 gap-3">
                {moreMovies.map((m) => (
                  <Link
                    key={m.id}
                    href={`/watch/${m.slug}`}
                    className="group relative rounded-xl overflow-hidden bg-neutral-900 transition hover:opacity-90"
                  >
                    <div className="aspect-[2/3] w-full relative overflow-hidden bg-neutral-800">
                      <img
                        src={m.posterUrl}
                        alt={m.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {m.rating && (
                        <div className="absolute top-1.5 left-1.5 bg-black/80 px-1.5 py-0.5 rounded text-[9px] font-bold text-amber-400 flex items-center gap-0.5">
                          <Star className="w-2.5 h-2.5 fill-amber-400" />
                          {m.rating}
                        </div>
                      )}
                    </div>
                    <div className="p-2">
                      <h4 className="text-xs font-bold text-white truncate group-hover:text-red-400 transition">
                        {m.title}
                      </h4>
                      <p className="text-[10px] text-neutral-500 mt-0.5">{m.releaseDate || "2024"}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Rich Footer */}
      <Footer />
    </div>
  );
}
