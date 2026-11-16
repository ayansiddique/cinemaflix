"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  X,
  Crown,
  Check,
  ShieldCheck,
  CreditCard,
  Smartphone,
  Sparkles,
  Lock,
  Loader2,
  Tv,
  Film,
} from "lucide-react";

export default function AuthModals() {
  const {
    user,
    login,
    upgradeToVIP,
    isAuthModalOpen,
    closeAuthModal,
    isUpgradeModalOpen,
    closeUpgradeModal,
  } = useAuth();

  // Auth form state
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(false);

  // Payment form state
  const [paymentMethod, setPaymentMethod] = useState<"jazzcash" | "easypaisa" | "card">("jazzcash");
  const [phoneNo, setPhoneNo] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [payingLoading, setPayingLoading] = useState(false);

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError(null);

    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: isSignUp ? "signup" : "login",
          name: isSignUp ? name : undefined,
          email,
          password,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Authentication failed");
      }

      if (data.user?.role === "ADMIN") {
        localStorage.setItem("cinemaflix_admin_session", "AUTHENTICATED_MASTER_SESSION_2026");
        document.cookie = "cinemaflix_admin_auth=true; path=/; max-age=86400; SameSite=Strict";
      }

      login(data.user);
    } catch (err: any) {
      setAuthError(err.message || "Failed to authenticate");
    } finally {
      setAuthLoading(false);
    }
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPayingLoading(true);
    setTimeout(() => {
      setPayingLoading(false);
      upgradeToVIP();
    }, 1500);
  };

  return (
    <>
      {/* 1. Auth Modal (Sign in / Sign up) */}
      {isAuthModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-md bg-[#18181c] border border-neutral-800 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
            <button
              onClick={closeAuthModal}
              className="absolute top-4 right-4 text-neutral-400 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center space-y-1">
              <div className="w-10 h-10 rounded-xl bg-red-600 flex items-center justify-center font-black text-xl text-white mx-auto shadow-lg shadow-red-600/40">
                C
              </div>
              <h2 className="text-xl font-bold text-white pt-2">
                {isSignUp ? "Create CinemaFlix Account" : "Welcome Back"}
              </h2>
              <p className="text-xs text-neutral-400">
                {isSignUp
                  ? "Sign up to track watchlist, post reviews, and access 4K streams."
                  : "Sign in to your streaming profile."}
              </p>
            </div>

            {authError && (
              <div className="p-3 bg-red-950/60 border border-red-800 rounded-xl text-xs text-red-300">
                {authError}
              </div>
            )}

            <form onSubmit={handleAuthSubmit} className="space-y-4">
              {isSignUp && (
                <div>
                  <label className="text-xs font-semibold text-neutral-300 block mb-1">
                    Your Full Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ali Ahmed"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-[#111113] border border-neutral-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-red-500"
                  />
                </div>
              )}

              <div>
                <label className="text-xs font-semibold text-neutral-300 block mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#111113] border border-neutral-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-neutral-300 block mb-1">
                  Password
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#111113] border border-neutral-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-red-500"
                />
              </div>

              <button
                type="submit"
                disabled={authLoading}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-red-600/30 transition disabled:opacity-50"
              >
                {authLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                {isSignUp ? "Create Free Account" : "Sign In to Stream"}
              </button>
            </form>

            <div className="text-center pt-2 border-t border-neutral-800">
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setAuthError(null);
                }}
                className="text-xs text-neutral-400 hover:text-white"
              >
                {isSignUp
                  ? "Already have an account? Sign In"
                  : "New to CinemaFlix? Create Account"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Upgrade to VIP 4K Modal with Payment Options */}
      {isUpgradeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="relative w-full max-w-xl bg-[#18181c] border border-amber-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
            <button
              onClick={closeUpgradeModal}
              className="absolute top-4 right-4 text-neutral-400 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="text-center space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40 text-xs font-bold uppercase tracking-wider">
                <Crown className="w-4 h-4" />
                VIP 4K Ultra Membership
              </div>
              <h2 className="text-2xl font-black text-white">
                Upgrade to 4K Ultra HD & Zero Ads
              </h2>
              <p className="text-xs text-neutral-400 max-w-md mx-auto">
                Remove all preroll and pause ads. Enjoy high-bitrate 4K streaming and cinema surround audio on all devices.
              </p>
            </div>

            {/* Pricing Box */}
            <div className="bg-gradient-to-r from-amber-500/10 via-neutral-900 to-amber-500/10 border border-amber-500/30 rounded-2xl p-4 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-amber-400 uppercase">Special Monthly Pass</span>
                <p className="text-xl font-black text-white">Rs 499 <span className="text-xs font-normal text-neutral-400">/ month</span></p>
              </div>
              <div className="space-y-1 text-right text-[11px] text-neutral-300">
                <div className="flex items-center gap-1 justify-end text-emerald-400 font-semibold">
                  <Check className="w-3.5 h-3.5" /> 100% Ad-Free Player
                </div>
                <div className="flex items-center gap-1 justify-end text-emerald-400 font-semibold">
                  <Check className="w-3.5 h-3.5" /> 4K Ultra HD Quality
                </div>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-neutral-300 block uppercase tracking-wider">
                Select Payment Method
              </label>
              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod("jazzcash")}
                  className={`p-3 rounded-xl border text-center transition ${
                    paymentMethod === "jazzcash"
                      ? "bg-red-600/20 border-red-500 text-white font-bold"
                      : "bg-neutral-900 border-neutral-800 text-neutral-400"
                  }`}
                >
                  <Smartphone className="w-5 h-5 mx-auto mb-1 text-red-500" />
                  <span className="text-xs block">JazzCash</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod("easypaisa")}
                  className={`p-3 rounded-xl border text-center transition ${
                    paymentMethod === "easypaisa"
                      ? "bg-emerald-600/20 border-emerald-500 text-white font-bold"
                      : "bg-neutral-900 border-neutral-800 text-neutral-400"
                  }`}
                >
                  <Smartphone className="w-5 h-5 mx-auto mb-1 text-emerald-400" />
                  <span className="text-xs block">EasyPaisa</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod("card")}
                  className={`p-3 rounded-xl border text-center transition ${
                    paymentMethod === "card"
                      ? "bg-blue-600/20 border-blue-500 text-white font-bold"
                      : "bg-neutral-900 border-neutral-800 text-neutral-400"
                  }`}
                >
                  <CreditCard className="w-5 h-5 mx-auto mb-1 text-blue-400" />
                  <span className="text-xs block">Debit / Card</span>
                </button>
              </div>
            </div>

            {/* Payment Form */}
            <form onSubmit={handlePaymentSubmit} className="space-y-4">
              {paymentMethod === "jazzcash" || paymentMethod === "easypaisa" ? (
                <div>
                  <label className="text-xs font-semibold text-neutral-300 block mb-1">
                    {paymentMethod === "jazzcash" ? "JazzCash" : "EasyPaisa"} Mobile Number
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="03001234567"
                    value={phoneNo}
                    onChange={(e) => setPhoneNo(e.target.value)}
                    className="w-full bg-[#111113] border border-neutral-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500 font-mono"
                  />
                  <p className="text-[10px] text-neutral-500 mt-1">
                    You will receive an MPIN prompt on your mobile screen to approve Rs 499.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-semibold text-neutral-300 block mb-1">
                      Card Number
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="4242 •••• •••• 4242"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full bg-[#111113] border border-neutral-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500 font-mono"
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={payingLoading}
                className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black font-extrabold py-3.5 rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition disabled:opacity-50"
              >
                {payingLoading ? <Loader2 className="w-4 h-4 animate-spin text-black" /> : <Lock className="w-4 h-4" />}
                Pay Rs 499 & Unlock VIP 4K
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
