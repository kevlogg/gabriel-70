"use client";

import { Crown, Sparkles, Heart } from "lucide-react";

export default function PrincessCharacter() {
  return (
    <div className="relative flex flex-col items-center justify-center my-3 select-none pointer-events-none">
      {/* Fairy dust aura */}
      <div className="absolute w-48 h-48 rounded-full bg-pink-300/30 blur-2xl -z-10" />

      {/* SVG Princess Illustration */}
      <div className="relative animate-bounce duration-1000">
        <svg
          viewBox="0 0 160 210"
          className="w-32 sm:w-40 h-auto drop-shadow-xl"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Golden Tiara / Crown */}
          <polygon
            points="62,45 66,28 72,42 80,24 88,42 94,28 98,45"
            fill="#FBBF24"
            stroke="#D97706"
            strokeWidth="2"
          />
          <circle cx="80" cy="30" r="3" fill="#EC4899" />
          <circle cx="66" cy="33" r="2" fill="#38BDF8" />
          <circle cx="94" cy="33" r="2" fill="#38BDF8" />

          {/* Blonde / Golden Fairytale Curls */}
          <path
            d="M36 70 C24 110, 35 150, 44 165 C38 120, 48 80, 54 60 Z"
            fill="#FDE047"
          />
          <path
            d="M124 70 C136 110, 125 150, 116 165 C122 120, 112 80, 106 60 Z"
            fill="#FDE047"
          />
          {/* Main Hair Volume */}
          <circle cx="80" cy="58" r="30" fill="#FDE047" />

          {/* Face */}
          <circle cx="80" cy="74" r="24" fill="#FEF08A" />
          {/* Bangs */}
          <path d="M58 64 Q80 76 102 64 Q92 56 80 58 Q68 56 58 64 Z" fill="#FACC15" />

          {/* Sweet Eyes */}
          <circle cx="70" cy="74" r="3.5" fill="#1E3A8A" />
          <circle cx="90" cy="74" r="3.5" fill="#1E3A8A" />
          <circle cx="71" cy="72" r="1.5" fill="#FFF" />
          <circle cx="91" cy="72" r="1.5" fill="#FFF" />
          {/* Eyelashes */}
          <path d="M66 70 L64 68 M74 70 L76 68" stroke="#1E3A8A" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M86 70 L84 68 M94 70 L96 68" stroke="#1E3A8A" strokeWidth="1.5" strokeLinecap="round" />

          {/* Cheeks */}
          <circle cx="63" cy="80" r="4" fill="#FDA4AF" opacity="0.7" />
          <circle cx="97" cy="80" r="4" fill="#FDA4AF" opacity="0.7" />

          {/* Princess Smile */}
          <path d="M75 83 Q80 88 85 83" stroke="#BE185D" strokeWidth="2" strokeLinecap="round" />

          {/* Pearl Necklace */}
          <path d="M68 96 Q80 104 92 96" stroke="#FFFFFF" strokeWidth="3" strokeDasharray="1,4" strokeLinecap="round" />

          {/* Bodice / Corset (Pink & Gold Trim) */}
          <path d="M64 98 L96 98 L90 135 L70 135 Z" fill="#F472B6" stroke="#FB7185" strokeWidth="1.5" />
          {/* Puff Sleeves */}
          <ellipse cx="58" cy="105" rx="10" ry="12" fill="#FBCFE8" />
          <ellipse cx="102" cy="105" rx="10" ry="12" fill="#FBCFE8" />

          {/* Star Wand in Hand */}
          <line x1="110" y1="110" x2="135" y2="150" stroke="#FBBF24" strokeWidth="3" strokeLinecap="round" />
          <polygon
            points="110,105 112,110 117,110 113,113 115,118 110,115 105,118 107,113 103,110 108,110"
            fill="#FBBF24"
            stroke="#D97706"
            strokeWidth="1.5"
          />

          {/* Grand Ballgown Skirt (Layered Tulle) */}
          {/* Outer Layer */}
          <path
            d="M70 132 C50 150, 25 180, 20 205 L140 205 C135 180, 110 150, 90 132 Z"
            fill="url(#gownGrad)"
          />
          {/* Inner Drape */}
          <path
            d="M65 135 C65 170, 45 195, 38 205 L122 205 C115 195, 95 170, 95 135 Z"
            fill="#FDF2F8"
            opacity="0.85"
          />
          {/* Bow on waist */}
          <circle cx="80" cy="135" r="4" fill="#FBBF24" />
          <path d="M80 135 L72 130 L74 140 Z" fill="#FBBF24" />
          <path d="M80 135 L88 130 L86 140 Z" fill="#FBBF24" />

          {/* Gown Gradient */}
          <defs>
            <linearGradient id="gownGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#F472B6" />
              <stop offset="60%" stopColor="#FBCFE8" />
              <stop offset="100%" stopColor="#E879F9" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Floating Princess Badge */}
      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-pink-700 font-extrabold text-xs shadow-md border-2 border-pink-200 -mt-2">
        <Crown size={14} className="text-amber-500 fill-amber-400" />
        <span>Princesa Encantada</span>
        <Sparkles size={14} className="text-pink-400" />
      </div>
    </div>
  );
}
