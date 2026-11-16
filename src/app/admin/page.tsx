import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import {
  Film,
  Eye,
  HardDriveDownload,
  DollarSign,
  PlusCircle,
  ExternalLink,
  Flame,
  Star,
  Sparkles,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [moviesCount, totalViewsAggregate, adsCount, recentMovies] = await Promise.all([
    prisma.movie.count(),
    prisma.movie.aggregate({
      _sum: { views: true },
    }),
    prisma.adPlacement.count({ where: { isActive: true } }),
    prisma.movie.findMany({
      take: 6,
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const totalViews = totalViewsAggregate._sum.views || 0;
  // If each view was served by own server, ~1.5 GB bandwidth would be used
  const bandwidthSavedGB = ((totalViews * 1.5)).toFixed(1);
  const bandwidthSavedTB = (parseFloat(bandwidthSavedGB) / 1024).toFixed(2);

  return (
    <div className="space-y-8">
      {/* Top Welcome & Summary Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
            Master Studio Overview
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-red-600/20 text-red-400 border border-red-500/30">
              v1.0 Live
            </span>
          </h1>
          <p className="text-sm text-neutral-400 mt-1">
            Manage your video streaming catalog, monitor YouTube offload metrics, and control AdSense slots.
          </p>
        </div>

        <Link
          href="/admin/movies/add"
          className="bg-red-600 hover:bg-red-700 text-white text-sm font-semibold py-2.5 px-4 rounded-lg flex items-center gap-2 shadow-lg shadow-red-600/30 transition-all hover:scale-[1.02]"
        >
          <Sparkles className="w-4 h-4" />
          Add Movie with TMDB Auto-Fetch
        </Link>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-[#18181c] border border-neutral-800 rounded-xl p-5 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
              Total Movies
            </span>
            <div className="p-2.5 bg-red-500/10 text-red-400 rounded-lg">
              <Film className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-black text-white">{moviesCount}</span>
            <span className="text-xs text-neutral-400 ml-2">in library</span>
          </div>
          <div className="mt-3 text-xs text-emerald-400 flex items-center gap-1 font-medium">
            <span>● Ready to Stream</span>
          </div>
        </div>

        <div className="bg-[#18181c] border border-neutral-800 rounded-xl p-5 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
              Bandwidth Cost Saved
            </span>
            <div className="p-2.5 bg-emerald-500/10 text-emerald-400 rounded-lg">
              <HardDriveDownload className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-black text-emerald-400">
              {parseFloat(bandwidthSavedTB) > 1 ? `${bandwidthSavedTB} TB` : `${bandwidthSavedGB} GB`}
            </span>
          </div>
          <div className="mt-3 text-xs text-neutral-400">
            Offloaded to YouTube Hosting
          </div>
        </div>

        <div className="bg-[#18181c] border border-neutral-800 rounded-xl p-5 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
              Simulated Streams
            </span>
            <div className="p-2.5 bg-blue-500/10 text-blue-400 rounded-lg">
              <Eye className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-black text-white">{totalViews.toLocaleString()}</span>
            <span className="text-xs text-neutral-400 ml-2">views</span>
          </div>
          <div className="mt-3 text-xs text-blue-400 font-medium">
            Counted on YouTube & Site
          </div>
        </div>

        <div className="bg-[#18181c] border border-neutral-800 rounded-xl p-5 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
              Monetization Slots
            </span>
            <div className="p-2.5 bg-amber-500/10 text-amber-400 rounded-lg">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-black text-white">{adsCount}</span>
            <span className="text-xs text-neutral-400 ml-2">active ad units</span>
          </div>
          <div className="mt-3 text-xs text-amber-400 font-medium">
            AdSense Ready
          </div>
        </div>
      </div>

      {/* Action Banner / TMDB Highlight */}
      <div className="rounded-2xl p-6 bg-gradient-to-r from-red-950/40 via-neutral-900 to-neutral-900 border border-red-900/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-600/20 text-red-400 text-xs font-semibold border border-red-500/30">
            <Sparkles className="w-3.5 h-3.5" />
            One-Click Metadata Importer
          </div>
          <h2 className="text-xl font-bold text-white">Auto-fill movies directly from TMDB</h2>
          <p className="text-sm text-neutral-400 max-w-xl">
            Type any movie name. The system automatically fetches HD posters, 4K backdrops, cast, overview, and IMDb ratings. Just paste your YouTube unlisted link and hit Publish!
          </p>
        </div>
        <Link
          href="/admin/movies/add"
          className="whitespace-nowrap px-5 py-3 rounded-xl bg-white text-black hover:bg-neutral-200 font-bold text-sm transition-all shadow-lg"
        >
          Try Auto-Add Now &rarr;
        </Link>
      </div>

      {/* Recent Movies Table */}
      <div className="bg-[#18181c] border border-neutral-800 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-neutral-800 flex items-center justify-between">
          <h3 className="font-bold text-white text-base">Recently Added Movies</h3>
          <Link
            href="/admin/movies"
            className="text-xs text-red-400 hover:text-red-300 font-semibold"
          >
            View All ({moviesCount}) &rarr;
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-neutral-300">
            <thead className="bg-[#141416] text-neutral-400 text-xs uppercase font-semibold">
              <tr>
                <th className="px-6 py-3.5">Movie</th>
                <th className="px-6 py-3.5">YouTube Video ID</th>
                <th className="px-6 py-3.5">Rating</th>
                <th className="px-6 py-3.5">Views</th>
                <th className="px-6 py-3.5">Tags</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800">
              {recentMovies.map((movie) => (
                <tr key={movie.id} className="hover:bg-neutral-800/40 transition-colors">
                  <td className="px-6 py-4 flex items-center gap-3">
                    <img
                      src={movie.posterUrl}
                      alt={movie.title}
                      className="w-10 h-14 object-cover rounded shadow bg-neutral-900 shrink-0"
                    />
                    <div>
                      <span className="font-semibold text-white block">{movie.title}</span>
                      <span className="text-xs text-neutral-500">{movie.genres}</span>
                    </div>
                  </td>

                  <td className="px-6 py-4 font-mono text-xs text-neutral-400">
                    <span className="px-2 py-1 rounded bg-neutral-900 border border-neutral-700/80 text-red-400">
                      {movie.youtubeVideoId}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <div className="inline-flex items-center gap-1 text-xs font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded">
                      <Star className="w-3 h-3 fill-amber-400" />
                      {movie.rating}
                    </div>
                  </td>

                  <td className="px-6 py-4 font-mono text-xs">
                    {movie.views.toLocaleString()}
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex gap-1.5 flex-wrap">
                      {movie.isFeatured && (
                        <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-red-600/20 text-red-400 border border-red-500/30">
                          Hero Banner
                        </span>
                      )}
                      {movie.isTrending && (
                        <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-blue-600/20 text-blue-400 border border-blue-500/30">
                          Trending
                        </span>
                      )}
                    </div>
                  </td>

                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/watch/${movie.slug}`}
                        target="_blank"
                        className="p-1.5 text-neutral-400 hover:text-white rounded hover:bg-neutral-800 transition"
                        title="Watch on frontend"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
