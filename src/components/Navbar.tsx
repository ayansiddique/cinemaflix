"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import {
  Search,
  Crown,
  Download,
  User,
  LogOut,
  Globe,
  X,
  Menu,
  Film,
  Sparkles,
  ArrowRight,
} from "lucide-react";

export default function Navbar() {
  const { user, logout, openAuthModal, openUpgradeModal } = useAuth();
  const { lang, setLang, t } = useLanguage();

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdown, setUserDropdown] = useState(false);
  const [langDropdown, setLangDropdown] = useState(false);

  // Search Modal state
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Download App Modal state
  const [downloadModalOpen, setDownloadModalOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Live search
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await fetch(`/api/movies?search=${encodeURIComponent(searchQuery)}`);
        const data = await res.json();
        setSearchResults(Array.isArray(data) ? data.slice(0, 5) : []);
      } catch (err) {
        console.error(err);
      } finally {
        setIsSearching(false);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${isScrolled
          ? "bg-[#0e0f12]/95 backdrop-blur-md shadow-2xl border-b border-neutral-800/80 py-2.5"
          : "bg-gradient-to-b from-black/95 via-black/60 to-transparent py-4"
          }`}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 flex items-center justify-between gap-2">
          {/* Brand Logo & Links */}
          <div className="flex items-center gap-3 md:gap-8 shrink-0">
            <Link href="/" className="flex items-center gap-1.5 sm:gap-2 group shrink-0">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-red-600 flex items-center justify-center font-black text-base sm:text-xl text-white shadow-lg shadow-red-600/40 group-hover:scale-105 transition-transform">
                C
              </div>
              <span className="text-base sm:text-2xl font-black tracking-tight text-red-600">
                CINEMA<span className="text-white">FLIX</span>
              </span>
            </Link>

            <nav className="hidden lg:flex items-center gap-6 text-sm font-semibold text-neutral-300">
              <Link href="/" className="text-white hover:text-red-500 transition-colors">
                {t("home")}
              </Link>
              <Link href="/#trending" className="hover:text-white transition-colors">
                {t("trending")}
              </Link>
              <Link href="/#movies" className="hover:text-white transition-colors">
                {t("allMovies")}
              </Link>
            </nav>
          </div>

          {/* Right Action Bar (Never Overlaps - Ultra-Responsive) */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            {/* 1. Search Icon Button */}
            <button
              onClick={() => setSearchOpen(true)}
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-neutral-900/90 border border-neutral-800 text-neutral-300 hover:text-white hover:border-neutral-700 flex items-center justify-center transition shrink-0"
              title={t("search")}
            >
              <Search className="w-3.5 h-3.5" />
            </button>

            {/* 2. Language Selector (English / اردو) */}
            <div className="relative shrink-0">
              <button
                onClick={() => setLangDropdown(!langDropdown)}
                className="h-7 sm:h-8 px-2 rounded-full bg-neutral-900/90 border border-neutral-800 text-[10px] sm:text-xs font-bold text-neutral-200 hover:border-neutral-700 flex items-center gap-1 transition shrink-0"
              >
                <Globe className="w-3 h-3 text-red-500 shrink-0" />
                <span className="uppercase">{lang === "ur" ? "اردو" : "EN"}</span>
              </button>

              {langDropdown && (
                <div className="absolute right-0 mt-2 w-32 bg-[#18181c] border border-neutral-800 rounded-xl p-1.5 shadow-2xl z-50 text-xs font-semibold space-y-1">
                  <button
                    onClick={() => {
                      setLang("en");
                      setLangDropdown(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 rounded-lg transition ${
                      lang === "en" ? "bg-red-600/20 text-red-400 font-bold" : "text-neutral-300 hover:bg-neutral-800"
                    }`}
                  >
                    English (EN)
                  </button>
                  <button
                    onClick={() => {
                      setLang("ur");
                      setLangDropdown(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 rounded-lg transition ${
                      lang === "ur" ? "bg-red-600/20 text-red-400 font-bold" : "text-neutral-300 hover:bg-neutral-800"
                    }`}
                  >
                    اردو (Urdu)
                  </button>
                </div>
              )}
            </div>

            {/* 3. "Go Premium" Button (Sleek Gold Badge - VIP on Mobile, Full on Desktop) */}
            <button
              onClick={openUpgradeModal}
              className="h-7 sm:h-8 px-2 sm:px-3.5 rounded-full bg-[#f5c518] hover:bg-[#e2b616] text-black font-extrabold text-[10px] sm:text-xs whitespace-nowrap flex items-center gap-1 shadow-md transition hover:scale-105 active:scale-95 shrink-0"
            >
              <Crown className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-black shrink-0" />
              <span className="sm:hidden">VIP</span>
              <span className="hidden sm:inline">{t("goPremium")}</span>
            </button>

            {/* 4. "Download App" Button (Desktop/Tablet Only) */}
            <button
              onClick={() => setDownloadModalOpen(true)}
              className="hidden md:flex h-8 items-center gap-1.5 bg-neutral-800/90 hover:bg-neutral-700 border border-neutral-700 text-white font-semibold text-xs px-3 rounded-full transition shrink-0"
            >
              <Download className="w-3.5 h-3.5 text-neutral-400" />
              <span>{t("downloadApp")}</span>
            </button>

            {/* 5. "Log In" / Profile Button */}
            {user ? (
              <div className="relative shrink-0">
                <button
                  onClick={() => setUserDropdown(!userDropdown)}
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-neutral-900 border border-neutral-700 hover:border-neutral-500 flex items-center justify-center transition"
                >
                  <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-red-600 flex items-center justify-center text-[10px] sm:text-xs font-bold text-white">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                </button>

                {userDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-[#18181c] border border-neutral-800 rounded-xl p-2 shadow-2xl space-y-1 text-xs z-50">
                    <div className="p-2 border-b border-neutral-800">
                      <p className="font-bold text-white">{user.name}</p>
                      <p className="text-[10px] text-neutral-400 truncate">{user.email}</p>
                      <span className="inline-block mt-1 text-[10px] uppercase font-bold text-amber-400">
                        {user.plan === "VIP_4K" ? "★ VIP 4K Pass" : "Free Plan"}
                      </span>
                    </div>

                    {(user.email === "owner@cinemaflix.com" || user.email === "admin@cinemaflix.com") && (
                      <Link
                        href="/admin"
                        onClick={() => setUserDropdown(false)}
                        className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-red-400 hover:bg-neutral-800 transition font-bold text-xs"
                      >
                        <Sparkles className="w-3.5 h-3.5" /> Admin Studio
                      </Link>
                    )}

                    <button
                      onClick={() => {
                        logout();
                        setUserDropdown(false);
                      }}
                      className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-red-400 hover:bg-neutral-800 transition"
                    >
                      <LogOut className="w-3.5 h-3.5" /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={openAuthModal}
                className="w-7 h-7 sm:w-auto sm:h-8 sm:px-3 rounded-full bg-neutral-800/90 hover:bg-neutral-700 border border-neutral-700 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition shrink-0"
                title={t("login")}
              >
                <User className="w-3.5 h-3.5 text-neutral-300" />
                <span className="hidden sm:inline">{t("login")}</span>
              </button>
            )}
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#141416] border-b border-neutral-800 px-6 py-4 space-y-3 text-sm font-medium">
            <Link href="/" onClick={() => setMobileMenuOpen(false)} className="block text-white">
              {t("home")}
            </Link>
            <Link href="/#trending" onClick={() => setMobileMenuOpen(false)} className="block text-neutral-300">
              {t("trending")}
            </Link>
            <Link href="/#movies" onClick={() => setMobileMenuOpen(false)} className="block text-neutral-300">
              {t("allMovies")}
            </Link>
            <button
              onClick={() => {
                setDownloadModalOpen(true);
                setMobileMenuOpen(false);
              }}
              className="w-full text-left text-neutral-300 py-1"
            >
              {t("downloadApp")}
            </button>

          </div>
        )}
      </header>

      {/* SEARCH MODAL */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-black/85 backdrop-blur-md">
          <div className="relative w-full max-w-xl bg-[#18181c] border border-neutral-800 rounded-3xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 border-b border-neutral-800 pb-3">
              <Search className="w-5 h-5 text-red-500" />
              <input
                type="text"
                autoFocus
                placeholder={t("search")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent text-sm text-white placeholder-neutral-500 focus:outline-none"
              />
              <button onClick={() => setSearchOpen(false)} className="text-neutral-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Results */}
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {isSearching ? (
                <div className="p-4 text-center text-xs text-neutral-400">Searching movie library...</div>
              ) : searchResults.length > 0 ? (
                searchResults.map((m) => (
                  <Link
                    key={m.id}
                    href={`/watch/${m.slug}`}
                    onClick={() => setSearchOpen(false)}
                    className="flex items-center gap-3 p-2 rounded-xl hover:bg-neutral-800 transition"
                  >
                    <img src={m.posterUrl} alt={m.title} className="w-10 h-14 object-cover rounded bg-neutral-900" />
                    <div>
                      <h4 className="text-xs font-bold text-white">{m.title}</h4>
                      <p className="text-[11px] text-neutral-400">{m.genres} • ★ {m.rating || "8.0"}</p>
                    </div>
                  </Link>
                ))
              ) : searchQuery ? (
                <div className="p-4 text-center text-xs text-neutral-500">No movies found for &quot;{searchQuery}&quot;</div>
              ) : (
                <div className="p-4 text-center text-xs text-neutral-500">Type movie name to search instantly.</div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* DOWNLOAD APP MODAL */}
      {downloadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="relative w-full max-w-sm bg-[#18181c] border border-neutral-800 rounded-3xl p-6 text-center space-y-4 shadow-2xl">
            <button onClick={() => setDownloadModalOpen(false)} className="absolute top-4 right-4 text-neutral-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
            <div className="w-12 h-12 rounded-2xl bg-red-600/10 text-red-500 flex items-center justify-center mx-auto">
              <Download className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">CinemaFlix Android & Smart TV App</h3>
            <p className="text-xs text-neutral-400">
              Download the APK for Android devices and Android TV for zero-buffer streaming directly on your television screen.
            </p>
            <button
              onClick={() => {
                alert("Download CinemaFlix v1.2 APK started!");
                setDownloadModalOpen(false);
              }}
              className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-red-600/30 transition"
            >
              Download APK (14.2 MB)
            </button>
          </div>
        </div>
      )}
    </>
  );
}
