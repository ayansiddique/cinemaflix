"use client";

import React, { useEffect, useRef } from "react";
import { useAuth } from "@/context/AuthContext";

interface AdsterraBannerProps {
  minimal?: boolean;
}

export default function AdsterraBanner({ minimal = false }: AdsterraBannerProps) {
  const { user } = useAuth();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user?.plan === "VIP_4K") return;
    if (!containerRef.current) return;

    // Avoid duplicate execution
    if (containerRef.current.querySelector("iframe")) return;

    const iframe = document.createElement("iframe");
    iframe.width = "300";
    iframe.height = "250";
    iframe.style.border = "none";
    iframe.style.overflow = "hidden";
    iframe.scrolling = "no";
    iframe.className = "rounded-xl";

    containerRef.current.innerHTML = "";
    containerRef.current.appendChild(iframe);

    const doc = iframe.contentWindow?.document || iframe.contentDocument;
    if (doc) {
      doc.open();
      doc.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body { margin: 0; padding: 0; display: flex; align-items: center; justify-content: center; background: transparent; overflow: hidden; }
            </style>
          </head>
          <body>
            <script type="text/javascript">
              atOptions = {
                'key' : 'f86ce7baab3233ec3ace9b6ccf4785b1',
                'format' : 'iframe',
                'height' : 250,
                'width' : 300,
                'params' : {}
              };
            </script>
            <script type="text/javascript" src="https://bancadeltempoidea.org/22/f86ce7baab3233ec3ace9b6ccf4785b1"></script>
          </body>
        </html>
      `);
      doc.close();
    }
  }, [user]);

  if (user?.plan === "VIP_4K") return null;

  if (minimal) {
    return (
      <div
        ref={containerRef}
        className="w-[300px] h-[250px] min-w-[300px] min-h-[250px] bg-neutral-900/60 rounded-xl border border-neutral-800/80 flex items-center justify-center overflow-hidden shadow-lg select-none"
      >
        <span className="text-[11px] text-neutral-500 animate-pulse">Loading Sponsor...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center my-3 overflow-hidden select-none">
      <div className="text-[10px] uppercase font-bold text-neutral-500 tracking-wider mb-1.5 flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
        Sponsored Ad
      </div>
      <div
        ref={containerRef}
        className="w-[300px] h-[250px] min-w-[300px] min-h-[250px] bg-neutral-900/60 rounded-2xl border border-neutral-800/80 flex items-center justify-center overflow-hidden shadow-xl"
      >
        <span className="text-xs text-neutral-600 animate-pulse">Loading Sponsor...</span>
      </div>
    </div>
  );
}
