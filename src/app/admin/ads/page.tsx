"use client";

import React, { useState, useEffect } from "react";
import {
  DollarSign,
  ShieldAlert,
  CheckCircle2,
  Sparkles,
  HelpCircle,
  Save,
  Loader2,
  Copy,
  ExternalLink,
} from "lucide-react";

interface AdPlacement {
  id: string;
  title: string;
  slot: string;
  code: string;
  isActive: boolean;
}

export default function AdsManagementPage() {
  const [ads, setAds] = useState<AdPlacement[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingSlot, setSavingSlot] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  // Form states for predefined slots
  const [headerAd, setHeaderAd] = useState({
    code: "",
    isActive: true,
  });

  const [playerAd, setPlayerAd] = useState({
    code: "",
    isActive: true,
  });

  const [popunderAd, setPopunderAd] = useState({
    code: "",
    isActive: false,
  });

  const fetchAds = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/ads");
      const data: AdPlacement[] = await res.json();
      setAds(data);

      data.forEach((ad) => {
        if (ad.slot === "HEADER") setHeaderAd({ code: ad.code, isActive: ad.isActive });
        if (ad.slot === "BELOW_PLAYER") setPlayerAd({ code: ad.code, isActive: ad.isActive });
        if (ad.slot === "POPUNDER") setPopunderAd({ code: ad.code, isActive: ad.isActive });
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAds();
  }, []);

  const saveSlot = async (slot: string, title: string, code: string, isActive: boolean) => {
    try {
      setSavingSlot(slot);
      setMessage(null);

      const res = await fetch("/api/ads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slot, title, code, isActive }),
      });

      if (!res.ok) throw new Error("Failed to save ad slot");
      setMessage(`Slot "${title}" updated successfully!`);
      setTimeout(() => setMessage(null), 3000);
    } catch (err: any) {
      alert(err.message || "Error saving ad");
    } finally {
      setSavingSlot(null);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl font-black text-white flex items-center gap-2">
          <DollarSign className="w-6 h-6 text-green-500" />
          AdSense & Monetization Center
        </h1>
        <p className="text-sm text-neutral-400 mt-1">
          Manage your Google AdSense code snippets, alternative ad networks, and view the approval roadmap.
        </p>
      </div>

      {message && (
        <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-sm flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          {message}
        </div>
      )}

      {/* AdSense Approval Secret Playbook */}
      <div className="bg-gradient-to-r from-neutral-900 to-[#18181c] border border-amber-500/30 rounded-2xl p-6 space-y-4">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-amber-400" />
          <h2 className="text-base font-bold text-white">
            Google AdSense Approval Strategy Guide
          </h2>
        </div>

        <p className="text-xs text-neutral-300 leading-relaxed">
          Google AdSense direct movie streaming sites ko reject karta hai. AdSense approve karwane ka professional tariqa yeh hai:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div className="bg-neutral-900/90 border border-neutral-800 p-3.5 rounded-xl space-y-1.5">
            <span className="text-xs font-bold text-amber-400">Step 1: Reviews & News</span>
            <p className="text-[11px] text-neutral-400">
              Site per movies ke sath unke original plot reviews, trailers aur news articles rakhein. Review content per AdSense khush ho kar approve karta hai.
            </p>
          </div>

          <div className="bg-neutral-900/90 border border-neutral-800 p-3.5 rounded-xl space-y-1.5">
            <span className="text-xs font-bold text-amber-400">Step 2: Mandatory Pages</span>
            <p className="text-[11px] text-neutral-400">
              Privacy Policy, Terms of Service, DMCA Disclaimer aur Contact Us page lazmi live hon. Google bot in pages ko sabse pehle scan karta hai.
            </p>
          </div>

          <div className="bg-neutral-900/90 border border-neutral-800 p-3.5 rounded-xl space-y-1.5">
            <span className="text-xs font-bold text-amber-400">Step 3: Alternative Networks</span>
            <p className="text-[11px] text-neutral-400">
              Agar AdSense ke bajaye high-paying streaming ads lagane hon toh <strong>Adsterra</strong>, <strong>Monetag</strong> ya <strong>PropellerAds</strong> use karein jo direct movie sites ko accept karte hain.
            </p>
          </div>
        </div>
      </div>

      {/* Ad Slots Section */}
      <div className="space-y-6">
        <h3 className="text-lg font-bold text-white">Live Ad Slots</h3>

        {/* Slot 1: Header Top Banner */}
        <div className="bg-[#18181c] border border-neutral-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-bold text-white text-sm">Header Top Banner (728x90 / Responsive)</h4>
              <p className="text-xs text-neutral-400">
                Displays directly above the movie rows on the homepage and watch page.
              </p>
            </div>
            <label className="flex items-center gap-2 text-xs font-medium cursor-pointer">
              <input
                type="checkbox"
                checked={headerAd.isActive}
                onChange={(e) => setHeaderAd({ ...headerAd, isActive: e.target.checked })}
                className="w-4 h-4 accent-green-600 rounded"
              />
              <span className={headerAd.isActive ? "text-green-400" : "text-neutral-500"}>
                {headerAd.isActive ? "Active" : "Disabled"}
              </span>
            </label>
          </div>

          <textarea
            rows={4}
            placeholder="Paste your Google AdSense <ins> script or banner HTML here..."
            value={headerAd.code}
            onChange={(e) => setHeaderAd({ ...headerAd, code: e.target.value })}
            className="w-full bg-[#111113] border border-neutral-800 rounded-xl p-3 text-xs font-mono text-neutral-300 focus:outline-none focus:border-neutral-600"
          />

          <div className="flex justify-end">
            <button
              onClick={() => saveSlot("HEADER", "Header Top Banner", headerAd.code, headerAd.isActive)}
              disabled={savingSlot === "HEADER"}
              className="bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-semibold py-2 px-4 rounded-lg flex items-center gap-2 transition"
            >
              {savingSlot === "HEADER" ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
              Save Header Ad
            </button>
          </div>
        </div>

        {/* Slot 2: Below Video Player Banner */}
        <div className="bg-[#18181c] border border-neutral-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-bold text-white text-sm">Below Movie Player Banner (High Conversion)</h4>
              <p className="text-xs text-neutral-400">
                Positioned directly under the movie streaming player. Generates the highest CTR.
              </p>
            </div>
            <label className="flex items-center gap-2 text-xs font-medium cursor-pointer">
              <input
                type="checkbox"
                checked={playerAd.isActive}
                onChange={(e) => setPlayerAd({ ...playerAd, isActive: e.target.checked })}
                className="w-4 h-4 accent-green-600 rounded"
              />
              <span className={playerAd.isActive ? "text-green-400" : "text-neutral-500"}>
                {playerAd.isActive ? "Active" : "Disabled"}
              </span>
            </label>
          </div>

          <textarea
            rows={4}
            placeholder="Paste your responsive AdSense script or banner HTML..."
            value={playerAd.code}
            onChange={(e) => setPlayerAd({ ...playerAd, code: e.target.value })}
            className="w-full bg-[#111113] border border-neutral-800 rounded-xl p-3 text-xs font-mono text-neutral-300 focus:outline-none focus:border-neutral-600"
          />

          <div className="flex justify-end">
            <button
              onClick={() => saveSlot("BELOW_PLAYER", "Below Movie Player", playerAd.code, playerAd.isActive)}
              disabled={savingSlot === "BELOW_PLAYER"}
              className="bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-semibold py-2 px-4 rounded-lg flex items-center gap-2 transition"
            >
              {savingSlot === "BELOW_PLAYER" ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
              Save Player Ad
            </button>
          </div>
        </div>

        {/* Slot 3: Popunder / Native Script */}
        <div className="bg-[#18181c] border border-neutral-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-bold text-white text-sm">Popunder / Native Ad Tag (Optional)</h4>
              <p className="text-xs text-neutral-400">
                For networks like Monetag or Adsterra that trigger once per user click.
              </p>
            </div>
            <label className="flex items-center gap-2 text-xs font-medium cursor-pointer">
              <input
                type="checkbox"
                checked={popunderAd.isActive}
                onChange={(e) => setPopunderAd({ ...popunderAd, isActive: e.target.checked })}
                className="w-4 h-4 accent-green-600 rounded"
              />
              <span className={popunderAd.isActive ? "text-green-400" : "text-neutral-500"}>
                {popunderAd.isActive ? "Active" : "Disabled"}
              </span>
            </label>
          </div>

          <textarea
            rows={3}
            placeholder="<script type='text/javascript' src='//...popunder.js'></script>"
            value={popunderAd.code}
            onChange={(e) => setPopunderAd({ ...popunderAd, code: e.target.value })}
            className="w-full bg-[#111113] border border-neutral-800 rounded-xl p-3 text-xs font-mono text-neutral-300 focus:outline-none focus:border-neutral-600"
          />

          <div className="flex justify-end">
            <button
              onClick={() => saveSlot("POPUNDER", "Popunder Native Script", popunderAd.code, popunderAd.isActive)}
              disabled={savingSlot === "POPUNDER"}
              className="bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-semibold py-2 px-4 rounded-lg flex items-center gap-2 transition"
            >
              {savingSlot === "POPUNDER" ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
              Save Popunder
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
