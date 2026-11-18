import React from "react";
import { prisma } from "@/lib/prisma";
import Navbar from "@/components/Navbar";
import HeroBanner from "@/components/HeroBanner";
import MovieRow from "@/components/MovieRow";
import Footer from "@/components/Footer";
import { DEFAULT_MOVIES } from "@/lib/defaultMovies";
import { getCustomMovies } from "@/lib/customStore";
import AdsterraBanner from "@/components/AdsterraBanner";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  let featuredMovie: any = null;
  let trendingMovies: any[] = [];
  let allMovies: any[] = [];
  let headerAd: any = null;

  try {
    const [dbFeatured, dbTrending, dbAll, dbHeaderAd] = await Promise.all([
      prisma.movie.findFirst({
        where: { isFeatured: true },
        orderBy: { createdAt: "desc" },
      }).catch(() => null),
      prisma.movie.findMany({
        where: { isTrending: true },
        orderBy: { views: "desc" },
      }).catch(() => []),
      prisma.movie.findMany({
        orderBy: { createdAt: "desc" },
      }).catch(() => []),
      prisma.adPlacement.findUnique({
        where: { slot: "HEADER" },
      }).catch(() => null),
    ]);

    featuredMovie = dbFeatured;
    trendingMovies = dbTrending || [];
    allMovies = dbAll || [];
    headerAd = dbHeaderAd;
  } catch (error) {
    console.warn("Prisma query failed on Vercel runtime, falling back to default movies:", error);
  }

  // Resilient fallback if database is empty or unavailable
  if (!allMovies || allMovies.length === 0) {
    allMovies = DEFAULT_MOVIES;
  }

  // Include movies published by Admin
  const custom = getCustomMovies();
  if (custom.length > 0) {
    const existingIds = new Set(allMovies.map((m) => m.id));
    const uniqueCustom = custom.filter((m) => !existingIds.has(m.id));
    allMovies = [...uniqueCustom, ...allMovies];
  }
  if (!featuredMovie) {
    featuredMovie = allMovies.find((m) => m.isFeatured) || allMovies[0];
  }
  if (!trendingMovies || trendingMovies.length === 0) {
    trendingMovies = allMovies.filter((m) => m.isTrending);
    if (trendingMovies.length === 0) trendingMovies = allMovies;
  }

  // Filter category subsets
  const actionMovies = allMovies.filter((m) =>
    (m.genres || "").toLowerCase().includes("action") || (m.genres || "").toLowerCase().includes("sci-fi")
  );
  const dramaMovies = allMovies.filter((m) =>
    (m.genres || "").toLowerCase().includes("drama") || (m.genres || "").toLowerCase().includes("crime")
  );

  return (
    <div className="min-h-screen bg-[#0e0f12] text-white selection:bg-red-600 selection:text-white flex flex-col justify-between">
      <div>
        <Navbar />

        <main className="space-y-10 pb-20">
          {/* Hero Spotlight Banner */}
          <HeroBanner movie={featuredMovie} />

          {/* Ad Placement: Official Adsterra Sponsored Banner Slot */}
          <div className="max-w-6xl mx-auto px-4 overflow-hidden my-2 flex justify-center">
            <AdsterraBanner />
          </div>

          {/* Movie Rows (Netflix Style) */}
          <div className="space-y-12 relative z-20">
            <MovieRow
              title="🔥 Trending Now on CinemaFlix"
              movies={trendingMovies}
              rowId="trending"
            />

            <MovieRow
              title="🎬 All Popular Blockbusters"
              movies={allMovies}
              rowId="movies"
            />

            {actionMovies.length > 0 && (
              <MovieRow
                title="⚡ High-Octane Action & Sci-Fi"
                movies={actionMovies}
                rowId="action"
              />
            )}

            {dramaMovies.length > 0 && (
              <MovieRow
                title="🎭 Critically Acclaimed Drama & Crime"
                movies={dramaMovies}
                rowId="drama"
              />
            )}
          </div>
        </main>
      </div>

      {/* Rich, Complete & AdSense-Compliant Footer */}
      <Footer />
    </div>
  );
}
