"use client";

export default function WoodyAndBuzzCharacter() {
  return (
    <div className="relative flex items-end justify-center gap-2 sm:gap-6 my-2 select-none pointer-events-none">
      {/* ─── WOODY ─── */}
      <div className="flex flex-col items-center animate-bounce duration-1000">
        <svg
          viewBox="0 0 160 210"
          className="w-28 sm:w-36 h-auto drop-shadow-xl"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Cowboy Hat */}
          <path
            d="M20 50 C40 30, 120 30, 140 50 C155 55, 145 70, 125 65 C100 58, 60 58, 35 65 C15 70, 5 55, 20 50 Z"
            fill="#854D0E"
          />
          <path
            d="M48 55 C48 20, 112 20, 112 55 Z"
            fill="#A16207"
            stroke="#713F12"
            strokeWidth="3"
          />
          {/* Hat band */}
          <path d="M48 50 C70 46, 90 46, 112 50" stroke="#451A03" strokeWidth="4" />

          {/* Head */}
          <circle cx="80" cy="80" r="28" fill="#FDE68A" />
          {/* Hair ears */}
          <path d="M52 75 C48 70, 48 85, 52 82" stroke="#713F12" strokeWidth="4" />
          <path d="M108 75 C112 70, 112 85, 108 82" stroke="#713F12" strokeWidth="4" />

          {/* Eyes */}
          <circle cx="70" cy="78" r="4" fill="#451A03" />
          <circle cx="90" cy="78" r="4" fill="#451A03" />
          <circle cx="71" cy="76" r="1.5" fill="#FFF" />
          <circle cx="91" cy="76" r="1.5" fill="#FFF" />

          {/* Smile */}
          <path
            d="M68 92 C74 100, 86 100, 92 92"
            stroke="#713F12"
            strokeWidth="3"
            strokeLinecap="round"
          />
          {/* Rosy cheeks */}
          <circle cx="62" cy="86" r="4" fill="#FCA5A5" opacity="0.6" />
          <circle cx="98" cy="86" r="4" fill="#FCA5A5" opacity="0.6" />

          {/* Red Bandana */}
          <path d="M62 104 Q80 115 98 104 L80 120 Z" fill="#DC2626" />
          <circle cx="80" cy="110" r="2" fill="#FFF" />

          {/* Torso / Shirt (Yellow Plaid) */}
          <path d="M50 115 L110 115 L105 175 L55 175 Z" fill="#FACC15" />
          {/* Red Grid lines on shirt */}
          <line x1="65" y1="115" x2="65" y2="175" stroke="#DC2626" strokeWidth="1.5" />
          <line x1="80" y1="115" x2="80" y2="175" stroke="#DC2626" strokeWidth="1.5" />
          <line x1="95" y1="115" x2="95" y2="175" stroke="#DC2626" strokeWidth="1.5" />
          <line x1="52" y1="135" x2="108" y2="135" stroke="#DC2626" strokeWidth="1.5" />
          <line x1="53" y1="155" x2="107" y2="155" stroke="#DC2626" strokeWidth="1.5" />

          {/* Cow-print Vest */}
          <path d="M50 115 L72 115 L66 170 L52 170 Z" fill="#F8FAFC" stroke="#0F172A" strokeWidth="2" />
          <path d="M110 115 L88 115 L94 170 L108 170 Z" fill="#F8FAFC" stroke="#0F172A" strokeWidth="2" />
          {/* Cow spots */}
          <ellipse cx="58" cy="130" rx="5" ry="7" fill="#0F172A" />
          <ellipse cx="62" cy="155" rx="4" ry="5" fill="#0F172A" />
          <ellipse cx="102" cy="135" rx="6" ry="8" fill="#0F172A" />
          <ellipse cx="98" cy="160" rx="4" ry="4" fill="#0F172A" />

          {/* Sheriff Star */}
          <polygon
            points="63,138 65,143 70,144 66,148 67,153 63,150 59,153 60,148 56,144 61,143"
            fill="#FBBF24"
            stroke="#B45309"
            strokeWidth="1.5"
          />

          {/* Belt */}
          <rect x="54" y="170" width="52" height="12" fill="#78350F" rx="2" />
          <rect x="72" y="168" width="16" height="16" fill="#FBBF24" rx="3" stroke="#B45309" strokeWidth="1.5" />

          {/* Jeans */}
          <path d="M55 182 L77 182 L76 205 L55 205 Z" fill="#1D4ED8" />
          <path d="M83 182 L105 182 L105 205 L84 205 Z" fill="#1D4ED8" />
        </svg>
        <span className="text-[11px] font-black uppercase text-amber-950 bg-amber-400 px-3 py-0.5 rounded-full shadow-sm mt-1">
          🤠 Woody
        </span>
      </div>

      {/* ─── BUZZ LIGHTYEAR ─── */}
      <div className="flex flex-col items-center animate-bounce duration-1000 delay-150">
        <svg
          viewBox="0 0 170 210"
          className="w-28 sm:w-36 h-auto drop-shadow-xl"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Extended Wings */}
          <path d="M15 110 L45 125 L45 145 L15 130 Z" fill="#7C3AED" stroke="#4C1D95" strokeWidth="2" />
          <path d="M155 110 L125 125 L125 145 L155 130 Z" fill="#7C3AED" stroke="#4C1D95" strokeWidth="2" />
          {/* Wing Tips (Red & Green) */}
          <rect x="10" y="108" width="8" height="24" fill="#EF4444" rx="2" />
          <rect x="152" y="108" width="8" height="24" fill="#22C55E" rx="2" />

          {/* Clear Helmet Dome Glow */}
          <ellipse cx="85" cy="72" rx="36" ry="34" fill="rgba(186, 230, 253, 0.45)" stroke="#38BDF8" strokeWidth="2" />

          {/* Purple Cowl / Head */}
          <circle cx="85" cy="75" r="23" fill="#6B21A8" />
          {/* Face Area */}
          <ellipse cx="85" cy="78" rx="16" ry="15" fill="#FED7AA" />

          {/* Eyes */}
          <circle cx="79" cy="76" r="3" fill="#1E3A8A" />
          <circle cx="91" cy="76" r="3" fill="#1E3A8A" />
          <circle cx="80" cy="75" r="1" fill="#FFF" />
          <circle cx="92" cy="75" r="1" fill="#FFF" />

          {/* Determined Smile & Chin Swirl */}
          <path d="M79 86 Q85 91 91 86" stroke="#9A3412" strokeWidth="2" strokeLinecap="round" />
          <circle cx="85" cy="89" r="1.5" fill="#9A3412" />

          {/* Space Armor Torso (White & Lime Green) */}
          <path d="M52 110 L118 110 L112 175 L58 175 Z" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="2" />
          {/* Green Chest Plate */}
          <path d="M55 110 L115 110 L110 142 L60 142 Z" fill="#22C55E" stroke="#15803D" strokeWidth="2" />

          {/* Blue, Red, Yellow buttons on chest */}
          <circle cx="98" cy="122" r="3.5" fill="#3B82F6" />
          <circle cx="98" cy="132" r="3.5" fill="#EF4444" />
          <circle cx="98" cy="142" r="3.5" fill="#FACC15" />

          {/* Space Ranger Badge */}
          <rect x="65" y="122" width="22" height="10" rx="3" fill="#1E293B" />
          <text x="68" y="129" fill="#38BDF8" fontSize="5" fontWeight="bold">SPACE</text>

          {/* Waist Band (Black & Green) */}
          <rect x="58" y="165" width="54" height="12" fill="#0F172A" rx="2" />
          <circle cx="85" cy="171" r="4" fill="#22C55E" />

          {/* Armor Legs */}
          <rect x="62" y="177" width="20" height="26" fill="#F8FAFC" rx="4" stroke="#CBD5E1" strokeWidth="2" />
          <rect x="88" y="177" width="20" height="26" fill="#F8FAFC" rx="4" stroke="#CBD5E1" strokeWidth="2" />
          <rect x="62" y="186" width="20" height="6" fill="#22C55E" />
          <rect x="88" y="186" width="20" height="6" fill="#22C55E" />
        </svg>
        <span className="text-[11px] font-black uppercase text-white bg-purple-600 px-3 py-0.5 rounded-full shadow-sm mt-1">
          🚀 Buzz
        </span>
      </div>

      {/* ─── LITTLE GREEN ALIEN CAMEO ─── */}
      <div className="hidden sm:flex flex-col items-center animate-bounce duration-1000 delay-300">
        <svg
          viewBox="0 0 110 140"
          className="w-20 h-auto drop-shadow-md"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Antenna */}
          <line x1="55" y1="20" x2="55" y2="40" stroke="#84CC16" strokeWidth="4" strokeLinecap="round" />
          <circle cx="55" cy="18" r="6" fill="#84CC16" />

          {/* Alien Head (3 eyes!) */}
          <ellipse cx="55" cy="55" rx="38" ry="24" fill="#84CC16" />
          {/* Pointy Ears */}
          <path d="M18 55 L2 45 L15 62 Z" fill="#84CC16" />
          <path d="M92 55 L108 45 L95 62 Z" fill="#84CC16" />

          {/* 3 Eyes */}
          <circle cx="40" cy="52" r="7" fill="#FFF" />
          <circle cx="55" cy="50" r="7" fill="#FFF" />
          <circle cx="70" cy="52" r="7" fill="#FFF" />
          <circle cx="40" cy="52" r="3" fill="#0F172A" />
          <circle cx="55" cy="50" r="3" fill="#0F172A" />
          <circle cx="70" cy="52" r="3" fill="#0F172A" />

          {/* Wide cute open mouth "Ooooh!" */}
          <ellipse cx="55" cy="67" rx="8" ry="5" fill="#4D7C0F" />

          {/* Blue Jumpsuit with collar */}
          <path d="M30 80 L80 80 L76 130 L34 130 Z" fill="#2563EB" />
          <path d="M40 80 Q55 92 70 80" stroke="#7C3AED" strokeWidth="5" />
          {/* Planet Pizza Logo */}
          <ellipse cx="66" cy="98" rx="6" ry="4" fill="#EA580C" />
          <circle cx="68" cy="98" r="2" fill="#FACC15" />
        </svg>
        <span className="text-[10px] font-black uppercase text-white bg-emerald-600 px-2 py-0.5 rounded-full shadow-xs mt-1">
          ¡Ooooh! ⭐
        </span>
      </div>
    </div>
  );
}

