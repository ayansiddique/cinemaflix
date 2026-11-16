"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type Language = "en" | "ur";

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    home: "Home",
    trending: "Trending",
    allMovies: "All Movies",
    goPremium: "Go Premium",
    downloadApp: "Download App",
    login: "Log In",
    search: "Search movies, genres...",
    moreLikeThis: "More Like This",
    resources: "Streaming Server",
    originalAudio: "Original Audio",
    urduDub: "Urdu Dubbed",
    freeMode: "Quality: HD 720p (Free)",
    vipMode: "Quality: ULTRA HD 4K (Premium)",
    unlock4k: "Unlock 4K",
    sponsorMsg: "Sponsor Message",
    resumeMovie: "Resume Movie",
    skipAd: "Skip Ad & Watch",
    reviews: "Audience Reviews",
    backToBrowse: "Back to Browse",
  },
  ur: {
    home: "ہوم",
    trending: "ٹرینڈنگ",
    allMovies: "تمام فلمیں",
    goPremium: "پریمیم لیں",
    downloadApp: "ایپ ڈاؤن لوڈ",
    login: "لاگ ان",
    search: "فلم تلاش کریں...",
    moreLikeThis: "ملتی جلتی فلمیں",
    resources: "اسٹریمنگ سرور",
    originalAudio: "اصل آڈیو",
    urduDub: "اردو ڈب",
    freeMode: "کوالٹی: HD 720p (مفت)",
    vipMode: "کوالٹی: الٹرا 4K (پریمیم)",
    unlock4k: "4K انلاک کریں",
    sponsorMsg: "اسپانسر شدہ اشتہار",
    resumeMovie: "فلم جاری رکھیں",
    skipAd: "اشتہار چھوڑیں",
    reviews: "ناظرین کی رائے",
    backToBrowse: "پیچھے جائیں",
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Language>("en");

  useEffect(() => {
    const saved = localStorage.getItem("cinemaflix_lang") as Language;
    if (saved && (saved === "en" || saved === "ur")) {
      setLang(saved);
    }
  }, []);

  const changeLang = (newLang: Language) => {
    setLang(newLang);
    localStorage.setItem("cinemaflix_lang", newLang);
  };

  const t = (key: string) => {
    return translations[lang]?.[key] || translations["en"]?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang: changeLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used within LanguageProvider");
  return context;
}
