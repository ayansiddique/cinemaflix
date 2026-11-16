"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, Lock, Mail, ArrowRight, AlertCircle, Loader2 } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Secure owner credentials check
    // Default Owner credentials:
    // Email: owner@cinemaflix.com
    // Password: CinemaFlixMaster#2026
    setTimeout(() => {
      if (
        (email.trim().toLowerCase() === "owner@cinemaflix.com" || email.trim().toLowerCase() === "admin@cinemaflix.com") &&
        password === "CinemaFlixMaster#2026"
      ) {
        // Set secure admin session token
        localStorage.setItem("cinemaflix_admin_session", "AUTHENTICATED_MASTER_SESSION_2026");
        document.cookie = "cinemaflix_admin_auth=true; path=/; max-age=86400; SameSite=Strict";
        router.push("/admin");
      } else {
        setError("Access Denied: Invalid Master Email or Admin Security Key.");
        setLoading(false);
      }
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#090a0d] text-white flex items-center justify-center p-4 selection:bg-red-600">
      <div className="w-full max-w-md bg-[#131418] border border-neutral-800 rounded-3xl p-8 shadow-2xl space-y-6 relative overflow-hidden">
        {/* Glow */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-red-600/10 border border-red-500/20 text-red-500 flex items-center justify-center mx-auto shadow-lg shadow-red-600/20">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-black text-white">Owner Studio Portal</h1>
          <p className="text-xs text-neutral-400">
            Restricted area. Only authorized site administrator may enter.
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-950/60 border border-red-800/80 rounded-xl text-xs text-red-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-neutral-300 block mb-1.5 uppercase tracking-wider">
              Admin Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                placeholder="owner@cinemaflix.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#0a0b0e] border border-neutral-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-red-500"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-neutral-300 block mb-1.5 uppercase tracking-wider">
              Master Security Key
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                placeholder="••••••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#0a0b0e] border border-neutral-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-red-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-extrabold py-3 rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-red-600/30 transition disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
            Unlock Studio Dashboard
          </button>
        </form>

        <div className="p-3 bg-neutral-900/60 border border-neutral-800/80 rounded-xl text-[11px] text-neutral-400 space-y-1">
          <p className="font-semibold text-neutral-300">Default Owner Credentials:</p>
          <p>Email: <code className="text-white font-mono">owner@cinemaflix.com</code></p>
          <p>Key: <code className="text-white font-mono">CinemaFlixMaster#2026</code></p>
        </div>
      </div>
    </div>
  );
}
