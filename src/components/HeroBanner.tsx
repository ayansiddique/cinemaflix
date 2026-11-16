import React from "react";
import Link from "next/link";
import { Play, Info, Star } from "lucide-react";

interface HeroMovie {
  id: string;
  title: string;
  slug: string;
  overview: string;
  backdropUrl: string;
  rating: number | null;
  releaseDate: string | null;
  duration: string | null;
  genres: string;
}

export default function HeroBanner({ movie }: { movie: HeroMovie | null }) {
  if (!movie) return null;

  return (
    <div className="relative w-full h-[68vh] min-h-[500px] sm:h-[75vh] sm:min-h-[580px] max-h-[800px] overflow-hidden select-none">
      {/* 4K Backdrop - Centered at top on mobile so faces & landscape are never cut off */}
      <div
        className="absolute inset-0 bg-cover bg-[center_12%] sm:bg-center transition-transform duration-1000 scale-100 hover:scale-105"
        style={{
          backgroundImage: `url(${movie.backdropUrl})`,
        }}
      >
        {/* Desktop horizontal vignette (left column text readable, right side clear) */}
        <div className="hidden md:block absolute inset-0 bg-gradient-to-r from-[#0e0f12] via-[#0e0f12]/80 to-transparent" />

        {/* Vertical bottom vignette (smooth fade from page dark background up into artwork) */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0e0f12] via-[#0e0f12]/60 sm:via-[#0e0f12]/20 to-transparent" />

        {/* Top navbar protection shadow */}
        <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/85 via-black/40 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex flex-col justify-end pb-8 sm:pb-16 md:pb-20">
        <div className="max-w-2xl space-y-2.5 sm:space-y-3.5">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-red-600/20 border border-red-500/40 backdrop-blur-sm text-red-400 text-[11px] sm:text-xs font-bold uppercase tracking-wider">
            <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-red-500 animate-ping" />
            Premiere Spotlight
          </div>

          <h1 className="text-2xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-tight sm:leading-none drop-shadow-2xl">
            {movie.title}
          </h1>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm font-semibold text-neutral-300">
            <span className="flex items-center gap-1 bg-amber-500/20 text-amber-400 border border-amber-500/30 px-1.5 py-0.5 rounded font-bold text-[11px] sm:text-xs">
              <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-amber-400" />
              {movie.rating || "8.5"}
            </span>
            <span>{movie.releaseDate?.split("-")[0] || "2024"}</span>
            <span>•</span>
            <span>{movie.duration || "2h 15m"}</span>
            <span>•</span>
            <span className="text-red-400 font-medium">{movie.genres}</span>
          </div>

          <p className="text-neutral-300/90 text-xs sm:text-sm leading-relaxed line-clamp-2 sm:line-clamp-3 drop-shadow max-w-xl">
            {movie.overview}
          </p>

          <div className="flex items-center gap-2.5 sm:gap-3 pt-1">
            <Link
              href={`/watch/${movie.slug}`}
              className="bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs sm:text-sm py-2.5 px-5 sm:py-3 sm:px-6 rounded-xl flex items-center gap-2 shadow-xl shadow-red-600/30 transition-all hover:scale-105 active:scale-95"
            >
              <Play className="w-4 h-4 fill-white" />
              Watch Now (Free)
            </Link>

            <Link
              href={`/watch/${movie.slug}`}
              className="bg-neutral-900/90 hover:bg-neutral-800 text-white font-bold text-xs sm:text-sm py-2.5 px-4 sm:py-3 sm:px-5 rounded-xl flex items-center gap-2 border border-neutral-700 transition"
            >
              <Info className="w-4 h-4" />
              Details
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
