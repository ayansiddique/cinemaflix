"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Youtube,
  Sparkles,
  Film,
  CheckCircle2,
  AlertCircle,
  Star,
  Eye,
  Loader2,
  ArrowLeft,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";

export default function AddMoviePage() {
  const router = useRouter();

  // YouTube Link input for auto fetch
  const [youtubeInput, setYoutubeInput] = useState("");
  const [isFetchingYT, setIsFetchingYT] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    overview: "",
    posterUrl: "",
    backdropUrl: "",
    youtubeVideoId: "",
    releaseDate: "2024",
    duration: "2h 15m",
    rating: "8.5",
    genres: "Action, Thriller, HD",
    cast: "Official Release",
    isFeatured: false,
    isTrending: true,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Fetch from YouTube directly (No TMDB needed)
  const handleFetchFromYouTube = async (urlOrId?: string) => {
    const target = urlOrId || youtubeInput;
    if (!target.trim()) {
      setStatusMessage({ type: "error", text: "Please paste a YouTube link or Video ID first" });
      return;
    }

    setIsFetchingYT(true);
    setStatusMessage(null);

    try {
      const res = await fetch(`/api/youtube/fetch?url=${encodeURIComponent(target)}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to fetch from YouTube");
      }

      setFormData((prev) => ({
        ...prev,
        title: data.title || prev.title,
        overview: data.overview || prev.overview,
        posterUrl: data.posterUrl || prev.posterUrl,
        backdropUrl: data.backdropUrl || prev.backdropUrl,
        youtubeVideoId: data.youtubeVideoId || target,
        releaseDate: data.releaseDate || prev.releaseDate,
        duration: data.duration || prev.duration,
        rating: data.rating?.toString() || prev.rating,
        genres: data.genres || prev.genres,
      }));

      setStatusMessage({
        type: "success",
        text: `Extracted "${data.title}" and HD artwork directly from YouTube!`,
      });
    } catch (err: any) {
      console.error(err);
      setStatusMessage({ type: "error", text: err.message || "Failed to fetch from YouTube" });
    } finally {
      setIsFetchingYT(false);
    }
  };

  // Submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.youtubeVideoId) {
      setStatusMessage({ type: "error", text: "Please provide Movie Title and YouTube Video link/ID" });
      return;
    }

    setIsSubmitting(true);
    setStatusMessage(null);

    try {
      const res = await fetch("/api/movies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to create movie");
      }

      setStatusMessage({ type: "success", text: "Movie saved successfully! Redirecting..." });
      setTimeout(() => {
        router.push("/admin/movies");
      }, 1200);
    } catch (err: any) {
      setStatusMessage({ type: "error", text: err.message || "Failed to save movie" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/movies"
            className="p-2 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-black text-white">Add Movie via YouTube</h1>
            <p className="text-sm text-neutral-400">
              Paste your YouTube link. Title, HD poster, and streaming ID will be fetched automatically.
            </p>
          </div>
        </div>
      </div>

      {/* YouTube Direct Importer Bar */}
      <div className="bg-gradient-to-r from-red-950/40 via-[#18181c] to-[#18181c] border border-red-600/40 rounded-3xl p-6 shadow-2xl relative">
        <div className="flex items-center gap-2 mb-3">
          <Youtube className="w-5 h-5 text-red-500" />
          <span className="text-xs font-bold text-red-400 uppercase tracking-wider">
            Direct YouTube Auto-Metadata Fetcher (Zero TMDB Required)
          </span>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="Paste YouTube Link (e.g. https://www.youtube.com/watch?v=... or https://youtu.be/...)"
            value={youtubeInput}
            onChange={(e) => setYoutubeInput(e.target.value)}
            className="flex-1 bg-[#111113] border border-neutral-700 rounded-xl px-4 py-3 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-red-500 font-mono"
          />
          <button
            type="button"
            onClick={() => handleFetchFromYouTube()}
            disabled={isFetchingYT}
            className="bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-3 rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 shrink-0 shadow-lg shadow-red-600/40 transition disabled:opacity-50"
          >
            {isFetchingYT ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            Fetch Details from YouTube
          </button>
        </div>
        <p className="text-[11px] text-neutral-400 mt-2">
          Upload your movie to YouTube as <strong>Unlisted</strong>. Paste link here, and our system fetches title & 1080p artwork immediately!
        </p>
      </div>

      {statusMessage && (
        <div
          className={`p-4 rounded-xl flex items-center gap-3 text-sm font-medium ${
            statusMessage.type === "success"
              ? "bg-emerald-950/50 border border-emerald-800 text-emerald-300"
              : "bg-red-950/50 border border-red-800 text-red-300"
          }`}
        >
          {statusMessage.type === "success" ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
          )}
          {statusMessage.text}
        </div>
      )}

      {/* Main Form & Live Preview Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Column */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-6 bg-[#18181c] border border-neutral-800 rounded-3xl p-6 sm:p-8">
            <div className="space-y-4">
              <h2 className="text-base font-bold text-white border-b border-neutral-800 pb-3 flex items-center gap-2">
                <Film className="w-4 h-4 text-red-500" />
                Movie Information
              </h2>

              {/* YouTube ID */}
              <div>
                <label className="text-xs font-bold text-red-400 block mb-1.5 uppercase">
                  YouTube Video ID / URL *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. YoHD9XEInc0"
                  value={formData.youtubeVideoId}
                  onChange={(e) => setFormData({ ...formData, youtubeVideoId: e.target.value })}
                  className="w-full bg-[#111113] border border-red-900/60 rounded-xl px-4 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-red-500"
                />
              </div>

              {/* Title */}
              <div>
                <label className="text-xs font-semibold text-neutral-300 block mb-1.5">
                  Movie Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Inception (2010)"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-[#111113] border border-neutral-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-neutral-600"
                />
              </div>

              {/* Overview */}
              <div>
                <label className="text-xs font-semibold text-neutral-300 block mb-1.5">
                  Synopsis / Overview
                </label>
                <textarea
                  rows={3}
                  placeholder="Movie description..."
                  value={formData.overview}
                  onChange={(e) => setFormData({ ...formData, overview: e.target.value })}
                  className="w-full bg-[#111113] border border-neutral-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-neutral-600"
                />
              </div>

              {/* Poster & Backdrop URLs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-neutral-300 block mb-1.5">
                    Poster URL (Auto-fetched from YouTube)
                  </label>
                  <input
                    type="url"
                    value={formData.posterUrl}
                    onChange={(e) => setFormData({ ...formData, posterUrl: e.target.value })}
                    className="w-full bg-[#111113] border border-neutral-800 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-neutral-600"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-neutral-300 block mb-1.5">
                    Backdrop URL (16:9 Banner)
                  </label>
                  <input
                    type="url"
                    value={formData.backdropUrl}
                    onChange={(e) => setFormData({ ...formData, backdropUrl: e.target.value })}
                    className="w-full bg-[#111113] border border-neutral-800 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-neutral-600"
                  />
                </div>
              </div>

              {/* Genres & Rating */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-semibold text-neutral-300 block mb-1.5">
                    Genres
                  </label>
                  <input
                    type="text"
                    value={formData.genres}
                    onChange={(e) => setFormData({ ...formData, genres: e.target.value })}
                    className="w-full bg-[#111113] border border-neutral-800 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-neutral-600"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-neutral-300 block mb-1.5">
                    Duration
                  </label>
                  <input
                    type="text"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    className="w-full bg-[#111113] border border-neutral-800 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-neutral-600"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-neutral-300 block mb-1.5">
                    Rating (IMDb)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.rating}
                    onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                    className="w-full bg-[#111113] border border-neutral-800 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-neutral-600"
                  />
                </div>
              </div>

              {/* Feature Toggles */}
              <div className="pt-2 flex flex-col sm:flex-row gap-6">
                <label className="flex items-center gap-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                    className="w-4 h-4 accent-red-600 rounded"
                  />
                  <div>
                    <span className="text-xs font-bold text-white block">Hero Banner Spotlight</span>
                    <span className="text-[11px] text-neutral-500">Show on very top of home page</span>
                  </div>
                </label>

                <label className="flex items-center gap-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={formData.isTrending}
                    onChange={(e) => setFormData({ ...formData, isTrending: e.target.checked })}
                    className="w-4 h-4 accent-red-600 rounded"
                  />
                  <div>
                    <span className="text-xs font-bold text-white block">Trending Row</span>
                    <span className="text-[11px] text-neutral-500">Feature in Trending carousel</span>
                  </div>
                </label>
              </div>
            </div>

            <div className="border-t border-neutral-800 pt-5 flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-xl text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-red-600/30 transition disabled:opacity-50"
              >
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                Publish Movie Now
              </button>
            </div>
          </form>
        </div>

        {/* Live Card Preview Column */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold text-neutral-400 uppercase tracking-wider">
            <Eye className="w-4 h-4 text-neutral-400" />
            Live Preview Card
          </div>

          <div className="bg-[#18181c] border border-neutral-800 rounded-3xl p-4 space-y-4 shadow-xl">
            <div className="relative rounded-2xl overflow-hidden aspect-[2/3] bg-neutral-900 border border-neutral-800 shadow-2xl group">
              {formData.posterUrl ? (
                <img
                  src={formData.posterUrl}
                  alt={formData.title || "Poster"}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-neutral-600 p-4 text-center">
                  <Film className="w-10 h-10 mb-2" />
                  <span className="text-xs">Paste YouTube link to preview artwork</span>
                </div>
              )}

              {/* Badges */}
              <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                {formData.isFeatured && (
                  <span className="bg-red-600 text-white text-[10px] font-black uppercase px-2 py-0.5 rounded shadow">
                    Hero
                  </span>
                )}
                {formData.rating && (
                  <span className="bg-black/80 backdrop-blur text-amber-400 text-xs font-bold px-2 py-0.5 rounded flex items-center gap-1">
                    <Star className="w-3 h-3 fill-amber-400" />
                    {formData.rating}
                  </span>
                )}
              </div>

              {/* Text overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent p-4 flex flex-col justify-end">
                <h4 className="font-bold text-white text-sm leading-tight truncate">
                  {formData.title || "Movie Title"}
                </h4>
                <div className="flex items-center gap-2 text-[10px] text-neutral-300 mt-1">
                  <span>{formData.releaseDate}</span>
                  <span>•</span>
                  <span>{formData.duration}</span>
                </div>
              </div>
            </div>

            <div className="text-xs space-y-1.5 text-neutral-400 border-t border-neutral-800 pt-3">
              <div className="flex justify-between">
                <span>YouTube ID:</span>
                <span className="text-red-400 font-mono font-medium truncate max-w-[150px]">
                  {formData.youtubeVideoId || "None"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
