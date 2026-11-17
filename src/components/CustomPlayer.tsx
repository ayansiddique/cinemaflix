"use client";

import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import AdsterraBanner from "@/components/AdsterraBanner";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Lightbulb,
  Share2,
  ThumbsUp,
  MessageSquare,
  Sparkles,
  ShieldCheck,
  Send,
  User,
  Crown,
  X,
  Settings as SettingsIcon,
  Check,
  Lock,
  Sliders,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  RotateCw,
  ChevronRight,
} from "lucide-react";

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

interface CustomPlayerProps {
  videoId: string;
  movieTitle: string;
  overview?: string;
  releaseDate?: string;
  views?: number;
  genres?: string;
  cast?: string;
}

export default function CustomPlayer({
  videoId,
  movieTitle,
  overview,
  releaseDate,
  views = 1246,
  genres = "Action, Sci-Fi",
  cast,
}: CustomPlayerProps) {
  const { user, openUpgradeModal } = useAuth();
  const { t } = useLanguage();
  const isVip = user?.plan === "VIP_4K";

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(80);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(150);
  const [lightsOff, setLightsOff] = useState(false);
  const [showControls, setShowControls] = useState(true);

  // In-Player Settings
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [settingsTab, setSettingsTab] = useState<"MAIN" | "QUALITY" | "LANGUAGE" | "SPEED">("MAIN");
  const [selectedQuality, setSelectedQuality] = useState(isVip ? "4K Ultra HD" : "720p HD");
  const [selectedAudioLang, setSelectedAudioLang] = useState("Hindi / Urdu (Default)");
  const [playbackSpeed, setPlaybackSpeed] = useState("1x");

  // In-Stream Ads State
  const [adState, setAdState] = useState<"NONE" | "PREROLL" | "PAUSE_AD">("NONE");
  const [prerollCountdown, setPrerollCountdown] = useState(5);
  const [canSkipPreroll, setCanSkipPreroll] = useState(false);

  // Action Bar & Social
  const [likes, setLikes] = useState(940);
  const [hasLiked, setHasLiked] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showComments, setShowComments] = useState(true);
  const [descExpanded, setDescExpanded] = useState(false);

  const [comments, setComments] = useState([
    {
      id: "1",
      user: "Hamza Riaz",
      time: "2 hours ago",
      text: "Print aur audio dono zabardast hain. Zero buffering!",
    },
    {
      id: "2",
      user: "Zainab Malik",
      time: "4 hours ago",
      text: "Audio and video are perfectly synced. Great stream!",
    },
  ]);
  const [newComment, setNewComment] = useState("");

  const [doubleTapFeedback, setDoubleTapFeedback] = useState<"-10" | "+10" | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const lastTapRef = useRef<{ time: number; x: number }>({ time: 0, x: 0 });

  const playerRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Fullscreen change listener (Landscape & Fullscreen on mobile & desktop)
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isFull = !!document.fullscreenElement;
      setIsFullscreen(isFull);
      setShowControls(true);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener("webkitfullscreenchange", handleFullscreenChange);
    };
  }, []);

  useEffect(() => {
    let checkInterval: any = null;

    const initPlayer = () => {
      if (!window.YT || !window.YT.Player) return;

      playerRef.current = new window.YT.Player(`yt-player-${videoId}`, {
        videoId: videoId,
        playerVars: {
          autoplay: 0,
          controls: 0,
          disablekb: 1,
          fs: 0,
          modestbranding: 1,
          rel: 0,
          showinfo: 0,
          iv_load_policy: 3,
          playsinline: 1,
        },
        events: {
          onReady: (event: any) => {
            setDuration(event.target.getDuration() || 150);
          },
          onStateChange: (event: any) => {
            if (event.data === 1) {
              setIsPlaying(true);
              setAdState("NONE");
            } else if (event.data === 2) {
              setIsPlaying(false);
              if (!isVip) {
                setAdState("PAUSE_AD");
              }
            } else if (event.data === 0) {
              setIsPlaying(false);
            }
          },
        },
      });
    };

    if (!window.YT) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName("script")[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
      window.onYouTubeIframeAPIReady = initPlayer;
    } else {
      initPlayer();
    }

    checkInterval = setInterval(() => {
      if (playerRef.current && typeof playerRef.current.getCurrentTime === "function") {
        const time = playerRef.current.getCurrentTime();
        setCurrentTime(time);
        const dur = playerRef.current.getDuration();
        if (dur && dur > 0) setDuration(dur);
      }
    }, 500);

    return () => {
      clearInterval(checkInterval);
      if (playerRef.current && playerRef.current.destroy) {
        playerRef.current.destroy();
      }
    };
  }, [videoId, isVip]);

  // Preroll Countdown
  useEffect(() => {
    let timer: any = null;
    if (adState === "PREROLL") {
      setPrerollCountdown(5);
      setCanSkipPreroll(false);

      timer = setInterval(() => {
        setPrerollCountdown((prev) => {
          if (prev <= 3) setCanSkipPreroll(true);
          if (prev <= 1) {
            clearInterval(timer);
            startActualMovie();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [adState]);

  const startActualMovie = () => {
    setAdState("NONE");
    if (playerRef.current && playerRef.current.playVideo) {
      playerRef.current.playVideo();
      setIsPlaying(true);
    }
  };

  const handleInitialPlayClick = () => {
    if (isVip) {
      startActualMovie();
    } else {
      setAdState("PREROLL");
    }
  };

  const togglePlay = () => {
    if (adState === "PREROLL") return;

    if (!isPlaying) {
      setAdState("NONE");
      if (playerRef.current && playerRef.current.playVideo) {
        playerRef.current.playVideo();
      }
    } else {
      if (playerRef.current && playerRef.current.pauseVideo) {
        playerRef.current.pauseVideo();
      }
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (playerRef.current && playerRef.current.seekTo) {
      playerRef.current.seekTo(newTime, true);
    }
  };

  const toggleMute = () => {
    if (!playerRef.current) return;
    if (isMuted) {
      playerRef.current.unMute();
      playerRef.current.setVolume(volume);
      setIsMuted(false);
    } else {
      playerRef.current.mute();
      setIsMuted(true);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value);
    setVolume(val);
    if (playerRef.current) {
      playerRef.current.setVolume(val);
      if (val === 0) {
        playerRef.current.mute();
        setIsMuted(true);
      } else if (isMuted) {
        playerRef.current.unMute();
        setIsMuted(false);
      }
    }
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch((err) => console.error(err));
    } else {
      document.exitFullscreen().catch((err) => console.error(err));
    }
  };

  const handleQualitySelect = (quality: string, isPaid: boolean) => {
    if (isPaid && !isVip) {
      setIsSettingsOpen(false);
      openUpgradeModal();
      return;
    }
    setSelectedQuality(quality);
    setIsSettingsOpen(false);
  };

  const handleSpeedSelect = (speedRate: number, label: string) => {
    if (playerRef.current && playerRef.current.setPlaybackRate) {
      playerRef.current.setPlaybackRate(speedRate);
    }
    setPlaybackSpeed(label);
    setIsSettingsOpen(false);
  };

  const skipSeconds = (seconds: number) => {
    if (!playerRef.current) return;
    const curr = typeof playerRef.current.getCurrentTime === "function" ? playerRef.current.getCurrentTime() : currentTime;
    const newTime = Math.max(0, Math.min(duration || 100, curr + seconds));
    if (typeof playerRef.current.seekTo === "function") {
      playerRef.current.seekTo(newTime, true);
    }
    setCurrentTime(newTime);
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying && !isSettingsOpen) setShowControls(false);
    }, 3500);
  };

  const handleScreenTap = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    if (isSettingsOpen) {
      setIsSettingsOpen(false);
      return;
    }
    if (adState !== "NONE") return;

    const now = Date.now();
    const rect = containerRef.current?.getBoundingClientRect();
    let clientX = 0;
    if ("touches" in e && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
    } else if ("clientX" in e) {
      clientX = (e as React.MouseEvent).clientX;
    }

    const tapX = rect ? clientX - rect.left : 0;
    const width = rect ? rect.width : (typeof window !== "undefined" ? window.innerWidth : 360);
    const isDoubleTap = now - lastTapRef.current.time < 300;

    if (isDoubleTap) {
      if (tapX < width * 0.38) {
        // Double tap left = Rewind 10s
        skipSeconds(-10);
        setDoubleTapFeedback("-10");
        setTimeout(() => setDoubleTapFeedback(null), 800);
      } else if (tapX > width * 0.62) {
        // Double tap right = Forward 10s
        skipSeconds(10);
        setDoubleTapFeedback("+10");
        setTimeout(() => setDoubleTapFeedback(null), 800);
      } else {
        // Center double tap = toggle play
        togglePlay();
      }
      lastTapRef.current = { time: 0, x: 0 };
    } else {
      lastTapRef.current = { time: now, x: tapX };
      // Single tap: toggle controls on mobile & desktop!
      setShowControls((prev) => {
        const next = !prev;
        if (next) {
          if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
          controlsTimeoutRef.current = setTimeout(() => {
            if (isPlaying && !isSettingsOpen) setShowControls(false);
          }, 4000);
        }
        return next;
      });
    }
  };

  const formatTime = (secs: number) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = Math.floor(secs % 60);
    if (h > 0) {
      return `${h}:${m < 10 ? "0" : ""}${m}:${s < 10 ? "0" : ""}${s}`;
    }
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying && !isSettingsOpen) setShowControls(false);
    }, 3500);
  };

  return (
    <div className={`space-y-4 ${lightsOff ? "relative z-50" : ""}`}>
      {/* Lights Off Backdrop */}
      {lightsOff && (
        <div
          onClick={() => setLightsOff(false)}
          className="fixed inset-0 bg-black/95 z-40 cursor-pointer backdrop-blur-md"
        />
      )}

      {/* 1. SEAMLESS CINEMA VIDEO CONTAINER */}
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        className={`relative mx-auto overflow-hidden bg-black select-none shadow-2xl transition-all duration-300 w-full ${
          isFullscreen
            ? "fixed inset-0 z-50 rounded-none w-screen h-screen flex items-center justify-center"
            : "rounded-2xl"
        } ${lightsOff ? "z-50 shadow-2xl shadow-red-900/40" : ""}`}
      >
        <div
          className={`relative w-full overflow-hidden bg-black ${
            isFullscreen ? "h-full w-full flex items-center justify-center" : "aspect-video"
          }`}
        >
          {/*
            PERFECT YOUTUBE EXTINCTION CROPPING:
            Scale 136%, top -22%, left -18% completely ejects all YouTube titles,
            avatars, watermarks, and "Watch on YouTube" links outside the frame!
          */}
          <div className="absolute -top-[22%] -left-[18%] w-[136%] h-[144%] pointer-events-none">
            <div id={`yt-player-${videoId}`} className="w-full h-full" />
          </div>

          {/* PERMANENT CINEMATIC LETTERBOX MASKS (Guarantees YouTube is NEVER visible top or bottom) */}
          <div className="absolute top-0 left-0 right-0 h-9 sm:h-11 bg-black z-10 pointer-events-none shadow-md" />
          <div className="absolute bottom-0 left-0 right-0 h-10 sm:h-12 bg-black z-10 pointer-events-none shadow-md" />

          {/* Click / Tap Shield: Toggles controls on mobile, Double-tap rewinds/forwards 10s */}
          <div
            onClick={handleScreenTap}
            className="absolute inset-0 z-20 cursor-pointer"
          />

          {/* Double Tap Seek Feedback Ripple (YouTube Mobile Style) */}
          {doubleTapFeedback === "-10" && (
            <div className="absolute left-6 top-1/2 -translate-y-1/2 z-30 bg-black/80 backdrop-blur-md text-white px-3.5 py-2 rounded-full flex items-center gap-1.5 animate-in fade-in zoom-in-75 duration-200 border border-white/20 shadow-2xl pointer-events-none">
              <RotateCcw className="w-4 h-4 text-amber-400" />
              <span className="font-extrabold text-xs">10 Seconds</span>
            </div>
          )}
          {doubleTapFeedback === "+10" && (
            <div className="absolute right-6 top-1/2 -translate-y-1/2 z-30 bg-black/80 backdrop-blur-md text-white px-3.5 py-2 rounded-full flex items-center gap-1.5 animate-in fade-in zoom-in-75 duration-200 border border-white/20 shadow-2xl pointer-events-none">
              <span className="font-extrabold text-xs">10 Seconds</span>
              <RotateCw className="w-4 h-4 text-amber-400" />
            </div>
          )}

          {/* Preroll Ad - Ultra Sleek & Compact with Real Live Adsterra Banner */}
          {adState === "PREROLL" && (
            <div className="absolute inset-0 z-30 bg-black/95 backdrop-blur-sm flex flex-col justify-between p-3 sm:p-5 select-none animate-in fade-in duration-150 overflow-hidden">
              {/* Top: Sponsor Tag */}
              <div className="flex items-center justify-between">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[10px] sm:text-xs font-bold uppercase tracking-wider">
                  <Sparkles className="w-3 h-3" />
                  {t("sponsorMsg")}
                </div>
                <button
                  onClick={openUpgradeModal}
                  className="text-[10px] sm:text-xs text-amber-400 font-extrabold hover:underline"
                >
                  Remove Ads (VIP) &rarr;
                </button>
              </div>

              {/* Center: Live Adsterra 300x250 Banner Ad */}
              <div className="flex-1 flex items-center justify-center my-1 overflow-hidden">
                <AdsterraBanner minimal={true} />
              </div>

              {/* Bottom: Skip Countdown & Skip Button */}
              <div className="flex justify-end items-center">
                {canSkipPreroll ? (
                  <button
                    onClick={startActualMovie}
                    className="bg-white/20 hover:bg-white text-white hover:text-black font-bold text-[11px] sm:text-xs px-3.5 py-1.5 rounded-lg border border-white/30 backdrop-blur transition flex items-center gap-1 shadow-lg"
                  >
                    <span>{t("skipAd")}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <div className="bg-black/80 px-3 py-1 rounded-lg border border-neutral-800 text-[10px] sm:text-xs text-neutral-300 font-mono">
                    Skip in <strong className="text-amber-400 font-bold">{prerollCountdown}s</strong>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Pause Ad with Real Live Adsterra Banner */}
          {adState === "PAUSE_AD" && (
            <div className="absolute inset-0 z-30 bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 select-none overflow-y-auto">
              <div className="bg-[#141418] border border-neutral-700/80 rounded-2xl p-4 max-w-sm w-full shadow-2xl relative space-y-3 animate-in fade-in zoom-in-95 duration-200">
                <button
                  onClick={() => setAdState("NONE")}
                  className="absolute top-2.5 right-2.5 text-neutral-400 hover:text-white p-1 rounded-lg hover:bg-neutral-800 transition"
                >
                  <X className="w-4 h-4" />
                </button>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-red-600/20 text-red-400 px-2 py-0.5 rounded border border-red-500/30">
                    Paused
                  </span>
                  <span className="text-xs text-neutral-400 font-medium">{t("sponsorMsg")}</span>
                </div>

                {/* Center: Live Adsterra 300x250 Banner Ad */}
                <div className="flex justify-center overflow-hidden">
                  <AdsterraBanner minimal={true} />
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={togglePlay}
                    className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition shadow-lg shadow-red-600/30"
                  >
                    <Play className="w-3.5 h-3.5 fill-white" /> {t("resumeMovie")}
                  </button>
                  <button
                    onClick={openUpgradeModal}
                    className="py-2.5 px-3.5 bg-[#f5c518] hover:bg-[#e2b616] text-black font-extrabold text-xs rounded-xl shadow transition"
                  >
                    👑 VIP
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Center Play & 10s Rewind / Fast-Forward Controls */}
          {adState === "NONE" && (
            <div
              className={`absolute inset-0 z-20 flex items-center justify-center gap-6 sm:gap-10 pointer-events-none transition-opacity duration-300 ${
                showControls || !isPlaying ? "opacity-100" : "opacity-0"
              }`}
            >
              {/* Rewind 10s button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  skipSeconds(-10);
                }}
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/60 hover:bg-black/90 text-white flex flex-col items-center justify-center transition-all hover:scale-110 active:scale-95 pointer-events-auto border border-white/10 backdrop-blur-sm"
                title="Rewind 10s"
              >
                <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="text-[8px] sm:text-[9px] font-bold">10s</span>
              </button>

              {/* Main Play / Pause */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (!isPlaying) {
                    if (currentTime === 0) handleInitialPlayClick();
                    else togglePlay();
                  } else {
                    togglePlay();
                  }
                }}
                className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center shadow-2xl shadow-red-600/60 transform hover:scale-110 active:scale-95 transition-all pointer-events-auto"
                title={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? (
                  <Pause className="w-6 h-6 sm:w-7 sm:h-7 fill-white" />
                ) : (
                  <Play className="w-6 h-6 sm:w-7 sm:h-7 fill-white ml-1" />
                )}
              </button>

              {/* Forward 10s button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  skipSeconds(10);
                }}
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/60 hover:bg-black/90 text-white flex flex-col items-center justify-center transition-all hover:scale-110 active:scale-95 pointer-events-auto border border-white/10 backdrop-blur-sm"
                title="Forward 10s"
              >
                <RotateCw className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="text-[8px] sm:text-[9px] font-bold">10s</span>
              </button>
            </div>
          )}

          {/* Top Cinema Header Bar */}
          <div
            className={`absolute top-0 left-0 right-0 z-20 px-4 sm:px-6 py-3 bg-gradient-to-b from-black/95 via-black/60 to-transparent flex items-center justify-between transition-opacity duration-300 ${
              showControls ? "opacity-100" : "opacity-0"
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse" />
              <span className="font-bold text-white text-xs sm:text-sm drop-shadow truncate max-w-[180px] sm:max-w-md">
                {movieTitle}
              </span>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-black/60 text-neutral-300 border border-neutral-700">
                {selectedQuality}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setLightsOff(!lightsOff)}
                className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition ${
                  lightsOff
                    ? "bg-amber-400 text-black shadow-lg"
                    : "bg-black/60 text-neutral-300 hover:text-white border border-neutral-700 backdrop-blur"
                }`}
                title="Toggle Lights"
              >
                <Lightbulb className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{lightsOff ? "Lights On" : "Lights Off"}</span>
              </button>
            </div>
          </div>

          {/* Settings Popup Menu */}
          {isSettingsOpen && (
            <div className="absolute bottom-14 right-4 z-30 w-64 sm:w-72 bg-[#18181c] border border-neutral-700 rounded-2xl p-2.5 shadow-2xl backdrop-blur-md text-xs text-white space-y-1 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between px-2 py-1 border-b border-neutral-800">
                <span className="font-bold text-white text-xs flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-red-500" />
                  {settingsTab === "MAIN" && "Player Settings"}
                  {settingsTab === "QUALITY" && "Video Quality"}
                  {settingsTab === "LANGUAGE" && "Audio Language"}
                  {settingsTab === "SPEED" && "Playback Speed"}
                </span>
                {settingsTab !== "MAIN" ? (
                  <button
                    onClick={() => setSettingsTab("MAIN")}
                    className="text-[10px] text-neutral-400 hover:text-white"
                  >
                    &larr; Back
                  </button>
                ) : (
                  <button
                    onClick={() => setIsSettingsOpen(false)}
                    className="text-neutral-400 hover:text-white"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {settingsTab === "MAIN" && (
                <div className="py-1 space-y-1">
                  <button
                    onClick={() => setSettingsTab("QUALITY")}
                    className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-neutral-800 transition"
                  >
                    <span className="text-neutral-300">Quality</span>
                    <span className="font-bold text-amber-400 text-[11px] flex items-center gap-1">
                      {selectedQuality} &rarr;
                    </span>
                  </button>

                  <button
                    onClick={() => setSettingsTab("LANGUAGE")}
                    className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-neutral-800 transition"
                  >
                    <span className="text-neutral-300">Audio Language</span>
                    <span className="font-bold text-emerald-400 text-[11px] flex items-center gap-1 truncate max-w-[120px]">
                      {selectedAudioLang} &rarr;
                    </span>
                  </button>

                  <button
                    onClick={() => setSettingsTab("SPEED")}
                    className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-neutral-800 transition"
                  >
                    <span className="text-neutral-300">Playback Speed</span>
                    <span className="font-bold text-neutral-400 text-[11px] flex items-center gap-1">
                      {playbackSpeed} &rarr;
                    </span>
                  </button>
                </div>
              )}

              {settingsTab === "QUALITY" && (
                <div className="py-1 space-y-1 max-h-52 overflow-y-auto pr-0.5">
                  <button
                    onClick={() => handleQualitySelect("360p", false)}
                    className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-neutral-800 transition"
                  >
                    <span className="text-neutral-300">360p (Data Saver)</span>
                    <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded">
                      Free
                    </span>
                  </button>

                  <button
                    onClick={() => handleQualitySelect("480p", false)}
                    className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-neutral-800 transition"
                  >
                    <span className="text-neutral-300">480p (Standard)</span>
                    <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded">
                      Free
                    </span>
                  </button>

                  <button
                    onClick={() => handleQualitySelect("720p HD", false)}
                    className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-neutral-800 transition"
                  >
                    <span className="text-white font-bold">720p HD (Default)</span>
                    <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded">
                      Free
                    </span>
                  </button>

                  <button
                    onClick={() => handleQualitySelect("1080p Full HD", true)}
                    className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-neutral-800 transition"
                  >
                    <span className="text-neutral-300 flex items-center gap-1">
                      <Lock className="w-3 h-3 text-amber-400" /> 1080p Full HD
                    </span>
                    <span className="text-[10px] text-amber-400 font-extrabold bg-amber-400/20 px-1.5 py-0.5 rounded">
                      Go Premium
                    </span>
                  </button>

                  <button
                    onClick={() => handleQualitySelect("4K Ultra HD", true)}
                    className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-neutral-800 transition"
                  >
                    <span className="text-neutral-300 flex items-center gap-1">
                      <Lock className="w-3 h-3 text-amber-400" /> 4K Ultra HD
                    </span>
                    <span className="text-[10px] text-amber-400 font-extrabold bg-amber-400/20 px-1.5 py-0.5 rounded">
                      Go Premium
                    </span>
                  </button>
                </div>
              )}

              {settingsTab === "LANGUAGE" && (
                <div className="py-1 space-y-1">
                  {[
                    { id: "ur-hi", label: "Urdu / Hindi Dubbed (Default)" },
                    { id: "en", label: "English (Original Audio)" },
                  ].map((langItem) => (
                    <button
                      key={langItem.id}
                      onClick={() => {
                        setSelectedAudioLang(langItem.label);
                        setIsSettingsOpen(false);
                      }}
                      className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-neutral-800 transition text-left"
                    >
                      <span className="text-neutral-200">{langItem.label}</span>
                      {selectedAudioLang === langItem.label && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                    </button>
                  ))}
                </div>
              )}

              {settingsTab === "SPEED" && (
                <div className="py-1 space-y-1">
                  {[
                    { rate: 0.75, label: "0.75x" },
                    { rate: 1.0, label: "Normal (1x)" },
                    { rate: 1.25, label: "1.25x" },
                    { rate: 1.5, label: "1.5x" },
                  ].map((s) => (
                    <button
                      key={s.label}
                      onClick={() => handleSpeedSelect(s.rate, s.label)}
                      className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-neutral-800 transition"
                    >
                      <span className="text-neutral-300">{s.label}</span>
                      {playbackSpeed === s.label && <Check className="w-3.5 h-3.5 text-red-500" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Bottom Control Bar */}
          <div
            className={`absolute bottom-0 left-0 right-0 z-20 px-4 sm:px-6 py-3 bg-gradient-to-t from-black/95 via-black/80 to-transparent space-y-1.5 transition-opacity duration-300 ${
              showControls ? "opacity-100" : "opacity-0"
            }`}
          >
            <div className="relative group/timeline flex items-center">
              <input
                type="range"
                min={0}
                max={duration || 100}
                value={currentTime}
                onChange={handleSeek}
                className="w-full h-1 bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-red-600 hover:h-2 transition-all"
              />
            </div>

            <div className="flex items-center justify-between text-xs text-white pt-1">
              <div className="flex items-center gap-2 sm:gap-3">
                <button onClick={togglePlay} className="p-1 hover:text-red-500 transition text-white">
                  {isPlaying ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white" />}
                </button>

                {/* 10s Rewind Button */}
                <button
                  onClick={() => skipSeconds(-10)}
                  className="p-1 text-neutral-300 hover:text-white transition flex items-center gap-0.5"
                  title="Rewind 10s"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span className="text-[9px] font-bold hidden sm:inline">10</span>
                </button>

                {/* 10s Forward Button */}
                <button
                  onClick={() => skipSeconds(10)}
                  className="p-1 text-neutral-300 hover:text-white transition flex items-center gap-0.5"
                  title="Forward 10s"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                  <span className="text-[9px] font-bold hidden sm:inline">10</span>
                </button>

                <div className="flex items-center gap-1.5">
                  <button onClick={toggleMute} className="hover:text-red-500 transition">
                    {isMuted || volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </button>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={isMuted ? 0 : volume}
                    onChange={handleVolumeChange}
                    className="w-12 sm:w-16 h-1 bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-red-600"
                  />
                </div>

                <div className="text-[10px] sm:text-[11px] font-mono text-neutral-300">
                  <span>{formatTime(currentTime)}</span>
                  <span className="text-neutral-500"> / </span>
                  <span className="text-neutral-400">{formatTime(duration)}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setIsSettingsOpen(!isSettingsOpen);
                    setSettingsTab("MAIN");
                  }}
                  className={`p-1.5 rounded-lg transition ${
                    isSettingsOpen ? "bg-red-600 text-white" : "text-neutral-300 hover:text-white hover:bg-neutral-800"
                  }`}
                  title="Player Settings"
                >
                  <SettingsIcon className="w-4 h-4" />
                </button>

                <button onClick={toggleFullscreen} className="hover:text-red-500 transition p-1" title="Fullscreen">
                  <Maximize className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. FLAT BORDERLESS STREAMLINED TITLE & ACTION BAR (ZERO BOXES / NO DABAY) */}
      <div className="pt-2 space-y-3">
        {/* Title & Metadata */}
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            {movieTitle}
          </h1>
          <div className="flex flex-wrap items-center gap-2 text-xs text-neutral-400 mt-1">
            <span className="text-neutral-200 font-semibold">{views.toLocaleString()} views</span>
            <span>•</span>
            <span>{releaseDate || "2024"}</span>
            <span>•</span>
            <span className="text-neutral-300">{genres}</span>
            <span>•</span>
            <span className="text-emerald-400 font-medium">{selectedAudioLang}</span>
          </div>
        </div>

        {/* Action Pills Row: Like, Share, Comments */}
        <div className="flex items-center gap-2 pt-1 border-b border-neutral-800/60 pb-3">
          <button
            onClick={() => {
              setLikes((l) => (hasLiked ? l - 1 : l + 1));
              setHasLiked(!hasLiked);
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition ${
              hasLiked
                ? "bg-red-600 text-white"
                : "bg-neutral-800/70 hover:bg-neutral-700/80 text-neutral-200"
            }`}
          >
            <ThumbsUp className="w-3.5 h-3.5" />
            <span>{likes}</span>
          </button>

          <button
            onClick={() => {
              if (typeof window !== "undefined") {
                navigator.clipboard.writeText(window.location.href);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-neutral-800/70 hover:bg-neutral-700/80 text-neutral-200 text-xs font-semibold transition"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>{copied ? "Link Copied!" : "Share"}</span>
          </button>

          <button
            onClick={() => setShowComments(!showComments)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition ${
              showComments
                ? "bg-neutral-700 text-white"
                : "bg-neutral-800/70 hover:bg-neutral-700/80 text-neutral-200"
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Comments ({comments.length})</span>
          </button>
        </div>

        {/* 3. CLEAN FLAT OVERVIEW DESCRIPTION (DIRECTLY ON BACKGROUND - NO CONTAINER BOX) */}
        <div className="text-xs text-neutral-300 space-y-2 py-1">
          <p className={`leading-relaxed whitespace-pre-line text-neutral-300/90 text-sm ${descExpanded ? "" : "line-clamp-2"}`}>
            {overview || "Watch in full HD with fast streaming on CinemaFlix."}
          </p>

          {cast && (
            <p className="text-xs text-neutral-400">
              <strong className="text-neutral-200 font-semibold">Starring:</strong> {cast}
            </p>
          )}

          <button
            onClick={() => setDescExpanded(!descExpanded)}
            className="text-xs font-bold text-neutral-400 hover:text-white flex items-center gap-1 transition"
          >
            {descExpanded ? (
              <>Show Less <ChevronUp className="w-3 h-3" /></>
            ) : (
              <>Show More <ChevronDown className="w-3 h-3" /></>
            )}
          </button>
        </div>

        {/* 4. FLAT YOUTUBE-STYLE COMMENTS FEED (ZERO BOXES) */}
        {showComments && (
          <div className="pt-4 space-y-4 border-t border-neutral-800/60">
            <h3 className="text-sm font-bold text-white tracking-wide">
              {comments.length} Comments
            </h3>

            {/* Comment Input */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!newComment.trim()) return;
                setComments([
                  {
                    id: Date.now().toString(),
                    user: user?.name || "Guest Viewer",
                    time: "Just now",
                    text: newComment.trim(),
                  },
                  ...comments,
                ]);
                setNewComment("");
              }}
              className="flex gap-2"
            >
              <input
                type="text"
                placeholder="Add a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="flex-1 bg-transparent border-b border-neutral-700 focus:border-red-500 px-1 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none transition"
              />
              <button
                type="submit"
                className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs px-4 py-2 rounded-full flex items-center gap-1.5 transition shrink-0"
              >
                <Send className="w-3 h-3" />
                Comment
              </button>
            </form>

            {/* Comment List - Clean Flat Minimal */}
            <div className="space-y-4 pt-2">
              {comments.map((c) => (
                <div key={c.id} className="flex gap-3 text-xs">
                  <div className="w-7 h-7 rounded-full bg-neutral-800 flex items-center justify-center text-[10px] font-bold text-neutral-300 shrink-0">
                    <User className="w-3.5 h-3.5" />
                  </div>
                  <div className="space-y-0.5 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-neutral-200 text-xs">@{c.user.toLowerCase().replace(/\s+/g, "")}</span>
                      <span className="text-[10px] text-neutral-500">{c.time}</span>
                    </div>
                    <p className="text-xs text-neutral-300 leading-relaxed">{c.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
