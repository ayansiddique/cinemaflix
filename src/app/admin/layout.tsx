"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Film,
  PlusCircle,
  LayoutDashboard,
  DollarSign,
  Settings,
  ExternalLink,
  ShieldCheck,
  LogOut,
  Lock,
} from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    // If on login page, no need to check
    if (pathname === "/admin/login") {
      setIsAuthenticated(true);
      return;
    }

    // Check localStorage admin session
    const session = localStorage.getItem("cinemaflix_admin_session");
    if (!session) {
      setIsAuthenticated(false);
      router.push("/admin/login");
    } else {
      setIsAuthenticated(true);
    }
  }, [pathname, router]);

  const handleAdminLogout = () => {
    localStorage.removeItem("cinemaflix_admin_session");
    document.cookie = "cinemaflix_admin_auth=; path=/; max-age=0";
    router.push("/admin/login");
  };

  // If on login page, render clean
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  // Loading auth state
  if (isAuthenticated === null || isAuthenticated === false) {
    return (
      <div className="min-h-screen bg-[#0f0f10] text-white flex items-center justify-center text-xs">
        Verifying Security Credentials...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f0f10] text-neutral-100 flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-neutral-800 bg-[#141416] flex flex-col justify-between shrink-0 fixed inset-y-0 left-0 z-30">
        <div>
          {/* Logo */}
          <div className="h-16 flex items-center px-6 border-b border-neutral-800 gap-3">
            <div className="w-9 h-9 rounded-lg bg-red-600 flex items-center justify-center font-black text-xl text-white shadow-lg shadow-red-600/30">
              C
            </div>
            <div>
              <span className="font-extrabold text-lg tracking-wider text-red-600">
                CINEMA<span className="text-white">FLIX</span>
              </span>
              <span className="block text-[10px] text-neutral-400 font-mono font-medium uppercase tracking-widest">
                Owner Studio
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5 text-sm font-medium">
            <Link
              href="/admin"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-neutral-300 hover:text-white hover:bg-neutral-800/80 transition-colors"
            >
              <LayoutDashboard className="w-4 h-4 text-red-500" />
              <span>Dashboard</span>
            </Link>

            <Link
              href="/admin/movies/add"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg bg-red-600/10 text-red-400 hover:bg-red-600/20 border border-red-500/20 transition-colors font-semibold"
            >
              <PlusCircle className="w-4 h-4 text-red-500" />
              <span>Add Movie</span>
            </Link>

            <Link
              href="/admin/movies"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-neutral-300 hover:text-white hover:bg-neutral-800/80 transition-colors"
            >
              <Film className="w-4 h-4 text-neutral-400" />
              <span>Manage Movies</span>
            </Link>

            <Link
              href="/admin/ads"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-neutral-300 hover:text-white hover:bg-neutral-800/80 transition-colors"
            >
              <DollarSign className="w-4 h-4 text-green-500" />
              <span>AdSense & Monetization</span>
            </Link>

            <Link
              href="/admin/settings"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-neutral-300 hover:text-white hover:bg-neutral-800/80 transition-colors"
            >
              <Settings className="w-4 h-4 text-neutral-400" />
              <span>Settings</span>
            </Link>
          </nav>
        </div>

        {/* Footer info & Logout */}
        <div className="p-4 border-t border-neutral-800 space-y-2">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-center gap-2 w-full py-2 px-3 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-xs font-semibold text-neutral-200 transition-colors"
          >
            <span>Preview Frontend</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          <button
            onClick={handleAdminLogout}
            className="flex items-center justify-center gap-2 w-full py-2 px-3 rounded-lg bg-red-950/40 hover:bg-red-950/70 border border-red-900/50 text-xs font-semibold text-red-400 transition"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Lock & Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 ml-64 flex flex-col min-h-screen">
        <header className="h-16 border-b border-neutral-800 bg-[#141416]/80 backdrop-blur sticky top-0 z-20 px-8 flex items-center justify-between">
          <div className="text-xs text-neutral-400 flex items-center gap-2">
            <Lock className="w-3.5 h-3.5 text-emerald-400" />
            <span>Owner Session: <strong className="text-white">Active & Secured</strong></span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/admin/movies/add"
              className="text-xs bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-3.5 rounded-md flex items-center gap-1.5 shadow shadow-red-600/30"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              New Movie
            </Link>
          </div>
        </header>

        <main className="p-8 flex-1">{children}</main>
      </div>
    </div>
  );
}
