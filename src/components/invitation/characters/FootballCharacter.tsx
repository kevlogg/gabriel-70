"use client";

import { Trophy, Star } from "lucide-react";

interface FootballCharacterProps {
  jerseyNumber?: string;
}

export default function FootballCharacter({ jerseyNumber = "10" }: FootballCharacterProps) {
  return (
    <div className="relative flex flex-col items-center justify-center my-3 select-none pointer-events-none">
      {/* Turf aura */}
      <div className="absolute w-48 h-48 rounded-full bg-emerald-400/20 blur-2xl -z-10" />

      {/* SVG Football Champion Illustration */}
      <div className="relative animate-bounce duration-1000">
        <svg
          viewBox="0 0 160 210"
          className="w-32 sm:w-40 h-auto drop-shadow-xl"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Hair */}
          <path d="M54 55 C54 25, 106 25, 106 55 Z" fill="#78350F" />
          <path d="M50 50 Q80 30 110 50" stroke="#451A03" strokeWidth="4" />

          {/* Head & Face */}
          <circle cx="80" cy="62" r="24" fill="#FDE68A" />

          {/* Enthusiastic Football Eyes */}
          <circle cx="72" cy="60" r="3.5" fill="#1E293B" />
          <circle cx="88" cy="60" r="3.5" fill="#1E293B" />
          <circle cx="73" cy="58" r="1.5" fill="#FFF" />
          <circle cx="89" cy="58" r="1.5" fill="#FFF" />

          {/* Champion Smile */}
          <path d="M72 70 Q80 78 88 70" stroke="#9A3412" strokeWidth="3" strokeLinecap="round" />
          {/* Cheeks */}
          <circle cx="65" cy="66" r="3" fill="#FCA5A5" />
          <circle cx="95" cy="66" r="3" fill="#FCA5A5" />

          {/* Soccer Jersey (Green & White stripes with Gold Collar) */}
          <path d="M54 84 L106 84 L100 135 L60 135 Z" fill="#15803D" stroke="#166534" strokeWidth="2" />
          {/* White vertical stripes */}
          <rect x="68" y="84" width="8" height="51" fill="#FFFFFF" />
          <rect x="84" y="84" width="8" height="51" fill="#FFFFFF" />
          {/* Sleeves */}
          <polygon points="54,84 38,105 48,110 60,94" fill="#15803D" />
          <polygon points="106,84 122,105 112,110 100,94" fill="#15803D" />

          {/* Dorsal Jersey Number */}
          <circle cx="80" cy="110" r="12" fill="#EAB308" />
          <text
            x="80"
            y="115"
            textAnchor="middle"
            fill="#0F172A"
            fontSize="12"
            fontWeight="900"
            fontFamily="sans-serif"
          >
            {jerseyNumber || "10"}
          </text>

          {/* Shorts (White) */}
          <path d="M58 135 L102 135 L106 162 L82 162 L80 145 L78 162 L54 162 Z" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="1.5" />
          {/* Green stripe on shorts */}
          <line x1="56" y1="135" x2="54" y2="162" stroke="#15803D" strokeWidth="2.5" />
          <line x1="104" y1="135" x2="106" y2="162" stroke="#15803D" strokeWidth="2.5" />

          {/* Legs & Soccer Socks */}
          <rect x="62" y="162" width="10" height="26" fill="#FDE68A" />
          <rect x="88" y="162" width="10" height="26" fill="#FDE68A" />
          {/* Socks (Green with yellow stripe) */}
          <rect x="61" y="172" width="12" height="20" fill="#15803D" rx="2" />
          <rect x="87" y="172" width="12" height="20" fill="#15803D" rx="2" />
          <rect x="61" y="174" width="12" height="3" fill="#EAB308" />
          <rect x="87" y="174" width="12" height="3" fill="#EAB308" />

          {/* Soccer Cleats (Black & White studs) */}
          <ellipse cx="66" cy="195" rx="9" ry="5" fill="#0F172A" />
          <ellipse cx="94" cy="192" rx="9" ry="5" fill="#0F172A" />

          {/* Soccer Ball at feet */}
          <g transform="translate(102, 168)">
            <circle cx="16" cy="16" r="16" fill="#FFFFFF" stroke="#0F172A" strokeWidth="2" />
            <polygon points="16,8 23,13 20,21 12,21 9,13" fill="#0F172A" />
            <line x1="16" y1="8" x2="16" y2="0" stroke="#0F172A" strokeWidth="1.5" />
            <line x1="23" y1="13" x2="31" y2="10" stroke="#0F172A" strokeWidth="1.5" />
            <line x1="20" y1="21" x2="27" y2="28" stroke="#0F172A" strokeWidth="1.5" />
            <line x1="12" y1="21" x2="5" y2="28" stroke="#0F172A" strokeWidth="1.5" />
            <line x1="9" y1="13" x2="1" y2="10" stroke="#0F172A" strokeWidth="1.5" />
          </g>

          {/* Golden Trophy in left hand */}
          <g transform="translate(18, 90)">
            <path d="M6 10 C6 2 22 2 22 10 C22 18 16 22 14 26 L14 30 L20 32 L8 32 L14 30 L14 26 C12 22 6 18 6 10 Z" fill="#FBBF24" stroke="#D97706" strokeWidth="1.5" />
            <path d="M6 8 C0 8 0 16 6 16" stroke="#D97706" strokeWidth="2" fill="none" />
            <path d="M22 8 C28 8 28 16 22 16" stroke="#D97706" strokeWidth="2" fill="none" />
            <polygon points="14,10 15,13 18,13 16,15 17,18 14,16 11,18 12,15 10,13 13,13" fill="#FFF" />
          </g>
        </svg>
      </div>

      {/* Floating Champion Badge */}
      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400 text-gray-950 font-black text-xs shadow-lg border-2 border-amber-300 -mt-2">
        <Trophy size={14} className="text-gray-950" />
        <span>Goleador del Partido</span>
        <Star size={14} className="text-gray-950 fill-gray-950" />
      </div>
    </div>
  );
}
