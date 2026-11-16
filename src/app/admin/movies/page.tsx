"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Film,
  PlusCircle,
  Search,
  Trash2,
  ExternalLink,
  Star,
  Eye,
  Sparkles,
  Flame,
  CheckCircle,
  Loader2,
} from "lucide-react";

interface Movie {
  id: string;
  title: string;
  slug: string;
  posterUrl: string;
  youtubeVideoId: string;
  duration: string | null;
  releaseDate: string | null;
  rating: number | null;
  genres: string;
  views: number;
  isFeatured: boolean;
  isTrending: boolean;
}

export default function ManageMoviesPage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchMovies = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/movies");
      const data = await res.json();
      setMovies(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  const handleToggle = async (id: string, field: "isFeatured" | "isTrending", currentValue: boolean) => {
    try {
      // Optimistic update
      setMovies((prev) =>
        prev.map((m) => (m.id === id ? { ...m, [field]: !currentValue } : m))
      );

      await fetch(`/api/movies/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [field]: !currentValue }),
      });
    } catch (err) {
      console.error(err);
      fetchMovies(); // rollback
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to remove "${title}"?`)) return;

    try {
      setDeletingId(id);
      await fetch(`/api/movies/${id}`, { method: "DELETE" });
      setMovies((prev) => prev.filter((m) => m.id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete movie");
    } finally {
      setDeletingId(null);
    }
  };

  const filteredMovies = movies.filter(
    (m) =>
      m.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.genres.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-white">Movie Catalog</h1>
          <p className="text-sm text-neutral-400">
            View, edit, toggle banners, and manage all your streamed movies.
          </p>
        </div>

        <Link
          href="/admin/movies/add"
          className="bg-red-600 hover:bg-red-700 text-white font-semibold text-sm py-2.5 px-4 rounded-xl flex items-center gap-2 shadow-lg shadow-red-600/30 transition hover:scale-[1.02]"
        >
          <PlusCircle className="w-4 h-4" />
          Add New Movie
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex items-center gap-4 bg-[#18181c] border border-neutral-800 p-3 rounded-xl">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search catalog by title or genre..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#111113] border border-neutral-800 rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-red-500"
          />
        </div>
        <div className="text-xs text-neutral-400 font-medium px-2">
          Total: <span className="text-white font-bold">{filteredMovies.length}</span>
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#18181c] border border-neutral-800 rounded-xl overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-neutral-400 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-6 h-6 animate-spin text-red-500" />
            <span>Loading movie catalog...</span>
          </div>
        ) : filteredMovies.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <Film className="w-12 h-12 text-neutral-600 mx-auto" />
            <h3 className="text-lg font-bold text-white">No Movies Found</h3>
            <p className="text-sm text-neutral-400 max-w-sm mx-auto">
              You haven&apos;t added any movies yet or no matches found for your search.
            </p>
            <Link
              href="/admin/movies/add"
              className="inline-flex items-center gap-2 text-xs font-semibold px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              <PlusCircle className="w-4 h-4" /> Add First Movie
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-neutral-300">
              <thead className="bg-[#141416] text-neutral-400 text-xs uppercase font-semibold">
                <tr>
                  <th className="px-6 py-3.5">Poster & Title</th>
                  <th className="px-6 py-3.5">YouTube Video ID</th>
                  <th className="px-6 py-3.5">Rating & Duration</th>
                  <th className="px-6 py-3.5">Views</th>
                  <th className="px-6 py-3.5 text-center">Hero Banner</th>
                  <th className="px-6 py-3.5 text-center">Trending</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800">
                {filteredMovies.map((movie) => (
                  <tr key={movie.id} className="hover:bg-neutral-800/40 transition-colors">
                    {/* Title & Poster */}
                    <td className="px-6 py-4 flex items-center gap-3">
                      <img
                        src={movie.posterUrl}
                        alt={movie.title}
                        className="w-11 h-16 object-cover rounded shadow bg-neutral-900 shrink-0"
                      />
                      <div className="overflow-hidden">
                        <span className="font-semibold text-white block text-sm">{movie.title}</span>
                        <span className="text-xs text-neutral-400 block mt-0.5 truncate max-w-xs">
                          {movie.genres}
                        </span>
                        <span className="text-[11px] text-neutral-500">
                          {movie.releaseDate?.split("-")[0] || "2024"}
                        </span>
                      </div>
                    </td>

                    {/* YouTube Video ID */}
                    <td className="px-6 py-4 font-mono text-xs">
                      <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-neutral-900 border border-neutral-800 text-red-400">
                        <span>{movie.youtubeVideoId}</span>
                      </div>
                    </td>

                    {/* Rating & Duration */}
                    <td className="px-6 py-4 text-xs">
                      <div className="flex items-center gap-1 font-bold text-amber-400 mb-1">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        {movie.rating || "7.5"}
                      </div>
                      <span className="text-neutral-400">{movie.duration || "2h 00m"}</span>
                    </td>

                    {/* Views */}
                    <td className="px-6 py-4 font-mono text-xs">
                      <div className="flex items-center gap-1 text-neutral-300">
                        <Eye className="w-3.5 h-3.5 text-blue-400" />
                        {movie.views.toLocaleString()}
                      </div>
                    </td>

                    {/* Hero Banner Toggle */}
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => handleToggle(movie.id, "isFeatured", movie.isFeatured)}
                        className={`text-xs font-semibold px-2.5 py-1 rounded-md transition ${
                          movie.isFeatured
                            ? "bg-red-600/20 text-red-400 border border-red-500/30"
                            : "bg-neutral-800 text-neutral-500 hover:text-neutral-300 border border-neutral-700"
                        }`}
                      >
                        {movie.isFeatured ? "Active" : "Set Hero"}
                      </button>
                    </td>

                    {/* Trending Toggle */}
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => handleToggle(movie.id, "isTrending", movie.isTrending)}
                        className={`text-xs font-semibold px-2.5 py-1 rounded-md transition ${
                          movie.isTrending
                            ? "bg-blue-600/20 text-blue-400 border border-blue-500/30"
                            : "bg-neutral-800 text-neutral-500 hover:text-neutral-300 border border-neutral-700"
                        }`}
                      >
                        {movie.isTrending ? "Active" : "Set Trending"}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/watch/${movie.slug}`}
                          target="_blank"
                          className="p-2 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition"
                          title="Preview stream"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(movie.id, movie.title)}
                          disabled={deletingId === movie.id}
                          className="p-2 text-neutral-400 hover:text-red-400 rounded-lg hover:bg-neutral-800 transition disabled:opacity-50"
                          title="Delete movie"
                        >
                          {deletingId === movie.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
