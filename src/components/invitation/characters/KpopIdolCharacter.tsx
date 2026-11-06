"use client";

import { Sparkles, Heart, Star, Music } from "lucide-react";

export default function KpopIdolCharacter() {
  return (
    <div className="relative flex flex-col items-center justify-center my-3 select-none pointer-events-none">
      {/* Glow aura */}
      <div className="absolute w-48 h-48 rounded-full bg-pink-500/20 blur-2xl -z-10" />

      {/* SVG Idol Illustration */}
      <div className="relative animate-bounce duration-1000">
        <svg
          viewBox="0 0 160 210"
          className="w-32 sm:w-40 h-auto drop-shadow-[0_0_25px_rgba(236,72,153,0.6)]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Stage Backlight Spotlight Rays */}
          <polygon points="10,0 80,80 150,0" fill="rgba(236, 72, 153, 0.15)" />

          {/* Flowing Pastel Pink & Purple Hair */}
          <path
            d="M30 75 C20 120, 40 150, 48 160 C42 120, 50 80, 55 60 Z"
            fill="url(#pinkHairGrad)"
          />
          <path
            d="M130 75 C140 120, 120 150, 112 160 C118 120, 110 80, 105 60 Z"
            fill="url(#pinkHairGrad)"
          />
          {/* Main Hair Bun / Top */}
          <ellipse cx="80" cy="55" rx="38" ry="32" fill="url(#pinkHairGrad)" />

          {/* Cute Cat/Star Hair Clips */}
          <polygon points="50,35 55,42 62,42 56,46 59,53 52,48 45,52 48,46 42,41 49,42" fill="#FDE047" />
          <polygon points="110,35 105,42 98,42 104,46 101,53 108,48 115,52 112,46 118,41 111,42" fill="#38BDF8" />

          {/* Head & Face */}
          <circle cx="80" cy="78" r="26" fill="#FDF2F8" />
          {/* Bangs */}
          <path d="M55 65 Q80 82 105 65 Q95 55 80 56 Q65 55 55 65 Z" fill="#F472B6" />

          {/* Big Anime Idol Eyes with Star Highlights */}
          <ellipse cx="68" cy="78" rx="6" ry="8" fill="#581C87" />
          <ellipse cx="92" cy="78" rx="6" ry="8" fill="#581C87" />
          <circle cx="66" cy="75" r="2.5" fill="#FFF" />
          <circle cx="90" cy="75" r="2.5" fill="#FFF" />
          <polygon points="69,81 70,83 72,83 71,85 71,87 70,86 68,87 69,85 67,84 69,84" fill="#38BDF8" />
          <polygon points="93,81 94,83 96,83 95,85 95,87 94,86 92,87 93,85 91,84 93,84" fill="#38BDF8" />

          {/* Rosy Cheeks */}
          <ellipse cx="60" cy="86" rx="4" ry="2" fill="#FDA4AF" />
          <ellipse cx="100" cy="86" rx="4" ry="2" fill="#FDA4AF" />

          {/* Idol Smile with Sparkle */}
          <path d="M75 88 Q80 94 85 88" stroke="#BE185D" strokeWidth="2.5" strokeLinecap="round" />

          {/* Headset Mic */}
          <path d="M102 78 Q108 95 90 98" stroke="#E2E8F0" strokeWidth="2" strokeLinecap="round" />
          <circle cx="89" cy="98" r="3" fill="#EC4899" />

          {/* Stage Outfit (Holographic Jacket & Crop Top) */}
          <path d="M56 108 L104 108 L98 160 L62 160 Z" fill="#3B0764" stroke="#C084FC" strokeWidth="2" />
          {/* Crop Top Sparkle */}
          <path d="M68 112 L92 112 L88 135 L72 135 Z" fill="url(#neonTopGrad)" />

          {/* Heart Lightstick in Hand */}
          <line x1="120" y1="135" x2="135" y2="165" stroke="#E2E8F0" strokeWidth="4" strokeLinecap="round" />
          {/* Glowing Lightstick Head */}
          <path
            d="M110 128 C105 115, 120 110, 126 122 C132 110, 147 115, 142 128 C136 138, 126 148, 126 148 C126 148, 116 138, 110 128 Z"
            fill="#EC4899"
            stroke="#FFF"
            strokeWidth="2"
          />

          {/* Idol Skirt */}
          <path d="M60 158 L100 158 L108 185 L52 185 Z" fill="#EC4899" />
          {/* Pleat lines */}
          <line x1="72" y1="158" x2="70" y2="185" stroke="#BE185D" strokeWidth="1.5" />
          <line x1="88" y1="158" x2="90" y2="185" stroke="#BE185D" strokeWidth="1.5" />

          {/* Boots */}
          <rect x="64" y="186" width="12" height="20" rx="3" fill="#0F172A" />
          <rect x="84" y="186" width="12" height="20" rx="3" fill="#0F172A" />

          {/* Gradients */}
          <defs>
            <linearGradient id="pinkHairGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#F472B6" />
              <stop offset="100%" stopColor="#C084FC" />
            </linearGradient>
            <linearGradient id="neonTopGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#06B6D4" />
              <stop offset="100%" stopColor="#EC4899" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Floating Idol Badge */}
      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 text-white font-black text-xs shadow-[0_0_15px_rgba(236,72,153,0.8)] border border-white/50 -mt-2">
        <Sparkles size={13} className="text-pink-200" />
        <span>K-Pop Center Idol</span>
        <Star size={13} className="text-yellow-300 fill-yellow-300" />
      </div>
    </div>
  );
}
