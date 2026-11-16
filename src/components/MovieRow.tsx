"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Star, Play } from "lucide-react";

interface MovieItem {
  id: string;
  title: string;
  slug: string;
  posterUrl: string;
  backdropUrl: string;
  rating: number | null;
  releaseDate: string | null;
  duration: string | null;
  genres: string;
}

interface MovieRowProps {
  title: string;
  movies: MovieItem[];
  rowId: string;
}

export default function MovieRow({ title, movies, rowId }: MovieRowProps) {
  const rowRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (rowRef.current) {
      const { scrollLeft, clientWidth } = rowRef.current;
      const scrollAmount = clientWidth * 0.75;
      rowRef.current.scrollTo({
        left: direction === "left" ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: "smooth",
      });
    }
  };

  if (!movies || movies.length === 0) return null;

  return (
    <div id={rowId} className="space-y-3 px-4 sm:px-6 lg:px-8 select-none group/row">
      {/* Row Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg sm:text-xl font-bold text-white tracking-wide flex items-center gap-2">
          {title}
        </h2>
      </div>

      {/* Carousel Container */}
      <div className="relative">
        {/* Left Arrow */}
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 top-0 bottom-0 z-20 w-10 bg-black/60 hover:bg-black/90 text-white flex items-center justify-center opacity-0 group-hover/row:opacity-100 transition-opacity rounded-r-lg backdrop-blur-sm"
          aria-label="Scroll left"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        {/* Scrollable Track */}
        <div
          ref={rowRef}
          className="flex gap-3 sm:gap-4 overflow-x-auto no-scrollbar scroll-smooth py-2"
        >
          {movies.map((movie) => (
            <Link
              key={movie.id}
              href={`/watch/${movie.slug}`}
              className="group relative flex-none w-[140px] sm:w-[180px] md:w-[210px] rounded-xl overflow-hidden bg-neutral-900 border border-neutral-800/80 transition-all duration-300 hover:scale-[1.05] hover:shadow-2xl hover:shadow-red-600/10 hover:border-neutral-700"
            >
              {/* Poster Image */}
              <div className="aspect-[2/3] w-full relative overflow-hidden bg-neutral-800">
                <img
                  src={movie.posterUrl}
                  alt={movie.title}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-108"
                />

                {/* Rating Badge */}
                {movie.rating && (
                  <div className="absolute top-2 left-2 bg-black/80 backdrop-blur-md px-1.5 py-0.5 rounded text-[10px] font-bold text-amber-400 flex items-center gap-1 border border-neutral-700">
                    <Star className="w-2.5 h-2.5 fill-amber-400" />
                    {movie.rating}
                  </div>
                )}

                {/* Play Button Overlay on Hover */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="w-11 h-11 rounded-full bg-red-600 flex items-center justify-center shadow-lg shadow-red-600/50 transform scale-75 group-hover:scale-100 transition-transform">
                    <Play className="w-5 h-5 text-white fill-white ml-0.5" />
                  </div>
                </div>
              </div>

              {/* Title & Metadata Card Footer */}
              <div className="p-2.5 bg-neutral-900/90">
                <h3 className="text-xs sm:text-sm font-bold text-white truncate group-hover:text-red-400 transition-colors">
                  {movie.title}
                </h3>
                <div className="flex items-center justify-between text-[10px] text-neutral-400 mt-1">
                  <span>{movie.releaseDate?.split("-")[0] || "2024"}</span>
                  <span className="truncate max-w-[90px]">{movie.genres?.split(",")[0]}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Right Arrow */}
        <button
          onClick={() => scroll("right")}
          className="absolute right-0 top-0 bottom-0 z-20 w-10 bg-black/60 hover:bg-black/90 text-white flex items-center justify-center opacity-0 group-hover/row:opacity-100 transition-opacity rounded-l-lg backdrop-blur-sm"
          aria-label="Scroll right"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}
