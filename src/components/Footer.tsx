import React from "react";
import Link from "next/link";
import { ShieldCheck, Film, Globe, Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-neutral-800/80 bg-[#0a0a0c] text-neutral-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        {/* Top Footer Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Brand Info (2 cols on md) */}
          <div className="col-span-2 space-y-3">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center font-black text-xl text-white shadow-lg shadow-red-600/40">
                C
              </div>
              <span className="text-xl font-black tracking-wider text-red-600">
                CINEMA<span className="text-white">FLIX</span>
              </span>
            </Link>
            <p className="text-neutral-400 text-xs leading-relaxed max-w-sm">
              CinemaFlix is your ultimate destination for free, high-speed HD streaming. Watch thousands of blockbusters, series, and trending movies with zero buffering on any device.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-emerald-400 pt-1 font-medium">
              <ShieldCheck className="w-4 h-4" />
              <span>100% Secure & Cloud CDN Accelerated</span>
            </div>
          </div>

          {/* Column 2: Discover & Movies */}
          <div className="space-y-2.5">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider">
              Browse Movies
            </h4>
            <ul className="space-y-1.5 text-neutral-400">
              <li>
                <Link href="/#trending" className="hover:text-white transition">
                  Trending Now
                </Link>
              </li>
              <li>
                <Link href="/#movies" className="hover:text-white transition">
                  Top Rated IMDb
                </Link>
              </li>
              <li>
                <Link href="/#movies" className="hover:text-white transition">
                  Action & Sci-Fi
                </Link>
              </li>
              <li>
                <Link href="/#movies" className="hover:text-white transition">
                  Drama & Crime
                </Link>
              </li>
              <li>
                <Link href="/#movies" className="hover:text-white transition">
                  Hindi & Urdu Dubbed
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Membership & Features */}
          <div className="space-y-2.5">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider">
              Premium & App
            </h4>
            <ul className="space-y-1.5 text-neutral-400">
              <li>
                <Link href="/#go-premium" className="text-amber-400 hover:text-amber-300 font-bold transition">
                  ★ Go Premium (4K)
                </Link>
              </li>
              <li>
                <Link href="/#go-premium" className="hover:text-white transition">
                  Ad-Free Pass
                </Link>
              </li>
              <li>
                <span className="text-neutral-400 hover:text-white transition cursor-pointer">
                  Download Android APK
                </span>
              </li>
              <li>
                <span className="text-neutral-400 hover:text-white transition cursor-pointer">
                  Smart TV Setup
                </span>
              </li>
              <li>
                <span className="text-neutral-400 hover:text-white transition cursor-pointer">
                  Supported Devices
                </span>
              </li>
            </ul>
          </div>

          {/* Column 4: Legal & AdSense Compliant Pages */}
          <div className="space-y-2.5">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider">
              Legal & Help
            </h4>
            <ul className="space-y-1.5 text-neutral-400">
              <li>
                <span className="hover:text-white transition cursor-pointer">
                  DMCA Disclaimer
                </span>
              </li>
              <li>
                <span className="hover:text-white transition cursor-pointer">
                  Privacy Policy
                </span>
              </li>
              <li>
                <span className="hover:text-white transition cursor-pointer">
                  Terms of Service
                </span>
              </li>
              <li>
                <span className="hover:text-white transition cursor-pointer">
                  Contact & Support
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Disclaimer Note (AdSense essential) */}
        <div className="border-t border-neutral-800/80 pt-6 text-[11px] text-neutral-500 leading-relaxed text-center sm:text-left">
          <p>
            <strong>Disclaimer:</strong> CinemaFlix does not host, store, or upload any media files, movies, or video content to its own web servers. All video streams and files are indexed and embedded from non-affiliated third-party public cloud platforms. For copyright inquiries, DMCA notifications, or content removal requests, please submit an official DMCA takedown notice to the respective external file hosts.
          </p>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-neutral-800/60 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-neutral-500 text-[11px]">
          <p>© {new Date().getFullYear()} CinemaFlix. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/" className="hover:text-white transition">Home</Link>
            <Link href="/#trending" className="hover:text-white transition">Trending</Link>
            <Link href="/#movies" className="hover:text-white transition">Movies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
