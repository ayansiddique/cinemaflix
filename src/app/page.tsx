import React from "react";
import { prisma } from "@/lib/prisma";
import Navbar from "@/components/Navbar";
import HeroBanner from "@/components/HeroBanner";
import MovieRow from "@/components/MovieRow";
import Footer from "@/components/Footer";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [featuredMovie, trendingMovies, allMovies, headerAd] = await Promise.all([
    prisma.movie.findFirst({
      where: { isFeatured: true },
      orderBy: { createdAt: "desc" },
    }) || prisma.movie.findFirst({ orderBy: { createdAt: "desc" } }),
    prisma.movie.findMany({
      where: { isTrending: true },
      orderBy: { views: "desc" },
    }),
    prisma.movie.findMany({
      orderBy: { createdAt: "desc" },
    }),
    prisma.adPlacement.findUnique({
      where: { slot: "HEADER" },
    }),
  ]);

  // Filter category subsets
  const actionMovies = allMovies.filter((m) =>
    m.genres.toLowerCase().includes("action") || m.genres.toLowerCase().includes("sci-fi")
  );
  const dramaMovies = allMovies.filter((m) =>
    m.genres.toLowerCase().includes("drama") || m.genres.toLowerCase().includes("crime")
  );

  return (
    <div className="min-h-screen bg-[#0e0f12] text-white selection:bg-red-600 selection:text-white flex flex-col justify-between">
      <div>
        <Navbar />

        <main className="space-y-10 pb-20">
          {/* Hero Spotlight Banner */}
          <HeroBanner movie={featuredMovie} />

          {/* Ad Placement: Header Ad Slot */}
          {headerAd && headerAd.isActive && (
            <div className="max-w-6xl mx-auto px-4 overflow-hidden my-4">
              <div
                className="text-center"
                dangerouslySetInnerHTML={{ __html: headerAd.code }}
              />
            </div>
          )}

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
