"use client";

import React, { useState } from "react";
import {
  Settings,
  Save,
  CheckCircle2,
  Tv,
  MessageSquare,
  ShieldCheck,
  RefreshCw,
  Loader2,
} from "lucide-react";

export default function SettingsPage() {
  const [siteName, setSiteName] = useState("CinemaFlix");
  const [tagline, setTagline] = useState("Watch Unlimited Movies & Shows Free in HD");
  const [enableComments, setEnableComments] = useState(true);
  const [theaterMode, setTheaterMode] = useState(true);
  const [saved, setSaved] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [seedMessage, setSeedMessage] = useState<string | null>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleReSeed = async () => {
    if (!confirm("This will ensure default sample movies and ad slots exist in your database. Continue?")) return;
    try {
      setSeeding(true);
      const res = await fetch("/api/seed", { method: "POST" });
      const data = await res.json();
      setSeedMessage(data.message || `Database seeded with ${data.count || 0} movies.`);
      setTimeout(() => setSeedMessage(null), 4000);
    } catch (err) {
      alert("Failed to seed database");
    } finally {
      setSeeding(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-black text-white flex items-center gap-2">
          <Settings className="w-6 h-6 text-neutral-400" />
          Player & Platform Settings
        </h1>
        <p className="text-sm text-neutral-400 mt-1">
          Customize website branding, video player options, and YouTube comments sync.
        </p>
      </div>

      {saved && (
        <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-sm flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          Settings updated successfully!
        </div>
      )}

      {seedMessage && (
        <div className="p-4 rounded-xl bg-blue-950/60 border border-blue-800 text-blue-300 text-sm flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
          {seedMessage}
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6 bg-[#18181c] border border-neutral-800 rounded-2xl p-6">
        <h2 className="text-base font-bold text-white border-b border-neutral-800 pb-3">
          General Site Configuration
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-neutral-300 block mb-1.5">
              Platform Name
            </label>
            <input
              type="text"
              value={siteName}
              onChange={(e) => setSiteName(e.target.value)}
              className="w-full bg-[#111113] border border-neutral-800 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-red-500"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-neutral-300 block mb-1.5">
              Tagline / Subheading
            </label>
            <input
              type="text"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              className="w-full bg-[#111113] border border-neutral-800 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-red-500"
            />
          </div>
        </div>

        <h2 className="text-base font-bold text-white border-b border-neutral-800 pb-3 pt-2">
          Player & Interactive Features
        </h2>

        <div className="space-y-4">
          <label className="flex items-center gap-3 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={theaterMode}
              onChange={(e) => setTheaterMode(e.target.checked)}
              className="w-4 h-4 accent-red-600 rounded"
            />
            <div>
              <span className="text-sm font-semibold text-white block">Default Theater / Cinema Mode</span>
              <span className="text-xs text-neutral-400">
                Automatically dims background lights and expands the player to full width for an immersive Netflix feel.
              </span>
            </div>
          </label>

          <label className="flex items-center gap-3 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={enableComments}
              onChange={(e) => setEnableComments(e.target.checked)}
              className="w-4 h-4 accent-red-600 rounded"
            />
            <div>
              <span className="text-sm font-semibold text-white block">Enable Discussion & Comments Box</span>
              <span className="text-xs text-neutral-400">
                Allows viewers to comment on movies. Comments are logged and synced directly with your platform and YouTube video engagement.
              </span>
            </div>
          </label>
        </div>

        <div className="border-t border-neutral-800 pt-5 flex justify-end">
          <button
            type="submit"
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 px-6 rounded-xl text-sm flex items-center gap-2 transition"
          >
            <Save className="w-4 h-4" />
            Save Configuration
          </button>
        </div>
      </form>

      {/* Database Quick Actions */}
      <div className="bg-[#18181c] border border-neutral-800 rounded-2xl p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="font-bold text-white text-sm">Quick Seed Sample Catalog</h3>
          <p className="text-xs text-neutral-400 mt-0.5">
            Load sample blockbusters (Inception, Interstellar, The Dark Knight, Avengers) with posters and unlisted players.
          </p>
        </div>
        <button
          onClick={handleReSeed}
          disabled={seeding}
          className="bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-semibold py-2.5 px-4 rounded-xl flex items-center gap-2 shrink-0 transition"
        >
          {seeding ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
          Seed Sample Movies
        </button>
      </div>
    </div>
  );
}
