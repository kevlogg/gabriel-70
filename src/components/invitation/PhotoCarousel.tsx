"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { ChevronLeft, ChevronRight, Heart } from "lucide-react";
import type { TemplateId } from "@/lib/schemas/invitation.schema";

export interface CarouselSlide {
  src: string;
  alt: string;
  caption?: string;
  tag?: string;
}

interface PhotoCarouselProps {
  slides?: CarouselSlide[];
  theme?: TemplateId;
  title?: string;
  subtitle?: string;
  showHeading?: boolean;
}

export const DEFAULT_SLIDES: CarouselSlide[] = [
  {
    src: "/images/wedding/wedding-1.jpg",
    alt: "Nuestra historia - El comienzo",
    caption: "Donde comenzó nuestro camino juntos 💕",
    tag: "El Comienzo",
  },
  {
    src: "/images/wedding/wedding-2.jpg",
    alt: "El gran sí - Amor eterno",
    caption: "Un atardecer inolvidable y el gran Sí 💍",
    tag: "El Compromiso",
  },
  {
    src: "/images/wedding/wedding-3.jpg",
    alt: "Listos para dar el paso juntos",
    caption: "Listos para celebrar nuestro amor con vos ✨",
    tag: "Nuestro Gran Día",
  },
];

export function parseCarouselSlides(raw?: string): CarouselSlide[] | undefined {
  if (!raw || !raw.trim()) return undefined;
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0 && parsed[0]?.src) {
      return parsed;
    }
  } catch {
    // ignore
  }
  return undefined;
}

// ─── AUTHENTIC FRAME CORNER ORNAMENTS ───
function CornerBracket({
  position,
  theme,
}: {
  position: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  theme: TemplateId;
}) {
  const isClasica = theme === "boda-clasica";
  const isBotanica = theme === "boda-botanica";

  const positionClasses = {
    "top-left": "top-0 left-0",
    "top-right": "top-0 right-0 rotate-90",
    "bottom-right": "bottom-0 right-0 rotate-180",
    "bottom-left": "bottom-0 left-0 -rotate-90",
  }[position];

  if (isClasica) {
    return (
      <div
        aria-hidden="true"
        className={`absolute ${positionClasses} pointer-events-none z-10 w-8 h-8 sm:w-11 sm:h-11`}
      >
        <svg
          viewBox="0 0 44 44"
          fill="none"
          className="w-full h-full drop-shadow-[0_2px_4px_rgba(0,0,0,0.7)]"
        >
          <path
            d="M2 2H32C26 6 22 12 20 20H13C13 24 11 28 9 32C7 36 5 40 2 42V2Z"
            fill="url(#gold-corner-moulding)"
            stroke="#8A6708"
            strokeWidth="0.8"
          />
          <path
            d="M5 5H22C18 8 15 13 14 18M5 5V26C8 22 12 19 16 17"
            stroke="#FFF4D0"
            strokeWidth="0.9"
            strokeLinecap="round"
          />
          <circle cx="7" cy="7" r="2.2" fill="#4A3403" />
          <circle cx="7" cy="7" r="1.3" fill="#FFEAA8" />
          <defs>
            <linearGradient id="gold-corner-moulding" x1="0" y1="0" x2="44" y2="44" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FFF4D0" />
              <stop offset="35%" stopColor="#D4AF37" />
              <stop offset="70%" stopColor="#8C6814" />
              <stop offset="100%" stopColor="#D4AF37" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    );
  }

  if (isBotanica) {
    return (
      <div
        aria-hidden="true"
        className={`absolute ${positionClasses} pointer-events-none z-10 w-7 h-7 sm:w-9 sm:h-9`}
      >
        <svg
          viewBox="0 0 38 38"
          fill="none"
          className="w-full h-full drop-shadow-[0_1px_3px_rgba(0,0,0,0.5)]"
        >
          <path
            d="M2 2H24C20 5 17 9 16 15H10C10 18 8 21 7 24C5 27 4 31 2 35V2Z"
            fill="url(#wood-brass-corner)"
            stroke="#3B2A13"
            strokeWidth="0.75"
          />
          <circle cx="6" cy="6" r="1.8" fill="#24190B" />
          <circle cx="6" cy="6" r="1" fill="#EADBBF" />
          <defs>
            <linearGradient id="wood-brass-corner" x1="0" y1="0" x2="38" y2="38" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#EADBBF" />
              <stop offset="50%" stopColor="#9C7F4A" />
              <stop offset="100%" stopColor="#5E4924" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    );
  }

  // Boda Boho: Warm Copper / Terracotta Bracket
  return (
    <div
      aria-hidden="true"
      className={`absolute ${positionClasses} pointer-events-none z-10 w-7 h-7 sm:w-9 sm:h-9`}
    >
      <svg
        viewBox="0 0 38 38"
        fill="none"
        className="w-full h-full drop-shadow-[0_1px_3px_rgba(0,0,0,0.45)]"
      >
        <path
          d="M2 2H24C20 5 17 9 16 15H10C10 18 8 21 7 24C5 27 4 31 2 35V2Z"
          fill="url(#copper-corner)"
          stroke="#421808"
          strokeWidth="0.75"
        />
        <circle cx="6" cy="6" r="1.8" fill="#2C0F04" />
        <circle cx="6" cy="6" r="1" fill="#FAD1C2" />
        <defs>
          <linearGradient id="copper-corner" x1="0" y1="0" x2="38" y2="38" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FBD6C9" />
            <stop offset="50%" stopColor="#B8694C" />
            <stop offset="100%" stopColor="#692812" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

export default function PhotoCarousel({
  slides = DEFAULT_SLIDES,
  theme = "boda-botanica",
  title = "Nuestra Historia de Amor",
  subtitle = "Momentos inolvidables que nos trajeron hasta este gran día",
  showHeading = false,
}: PhotoCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const isBotanica = theme === "boda-botanica";
  const isClasica = theme === "boda-clasica";
  const isBoho = theme === "boda-boho";

  const total = slides.length;

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % total);
  }, [total]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  // Auto-play timer (paused on hover)
  useEffect(() => {
    if (isHovered || total <= 1) return;
    const interval = setInterval(() => {
      nextSlide();
    }, 6000);
    return () => clearInterval(interval);
  }, [isHovered, nextSlide, total]);

  // Touch Swipe Handlers for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const diff = touchStartX.current - touchEndX.current;
    if (diff > 50) {
      nextSlide();
    } else if (diff < -50) {
      prevSlide();
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  // ─── THEME STYLES (PHYSICAL PICTURE FRAME / CUADRO LITERAL) ───

  // Wall nail and hanging wire styling
  const nailClass = isClasica
    ? "bg-gradient-to-br from-[#FFF3C4] via-[#D4AF37] to-[#7A580F]"
    : isBotanica
    ? "bg-gradient-to-br from-[#EADBBF] via-[#9C7F4A] to-[#453315]"
    : "bg-gradient-to-br from-[#FBD6C9] via-[#B8694C] to-[#5C210C]";

  const wireClass = isClasica
    ? "border-[#D4AF37]/50"
    : isBotanica
    ? "border-[#8C6D3B]/45"
    : "border-[#C86D51]/45";

  // Outer frame moulding (El marco exterior / moldura tallada)
  const outerMouldingStyle: React.CSSProperties = isClasica
    ? {
        background:
          "linear-gradient(135deg, #F7E9CE 0%, #D4AF37 25%, #8C6814 45%, #EAD08B 65%, #7A580F 85%, #4A3304 100%)",
        boxShadow:
          "0 35px 80px -15px rgba(0,0,0,0.85), 0 15px 35px -5px rgba(212,175,55,0.25), inset 0 2px 4px rgba(255,255,255,0.7), inset 0 -2px 4px rgba(0,0,0,0.7), inset 2px 0 4px rgba(255,255,255,0.5), inset -2px 0 4px rgba(0,0,0,0.7)",
      }
    : isBotanica
    ? {
        background:
          "linear-gradient(135deg, #7D5330 0%, #5A381B 25%, #3D230D 50%, #6E4624 75%, #4F2D13 90%, #291506 100%)",
        boxShadow:
          "0 30px 70px -15px rgba(35,45,15,0.35), 0 12px 30px -5px rgba(0,0,0,0.3), inset 0 2px 3px rgba(255,255,255,0.35), inset 0 -3px 4px rgba(0,0,0,0.6), inset 2px 0 3px rgba(255,255,255,0.25), inset -2px 0 3px rgba(0,0,0,0.6)",
      }
    : {
        background:
          "linear-gradient(135deg, #A86447 0%, #854528 25%, #5E2B15 50%, #975133 75%, #6F331A 90%, #441C0C 100%)",
        boxShadow:
          "0 30px 70px -15px rgba(110,47,26,0.35), 0 12px 30px -5px rgba(0,0,0,0.3), inset 0 2px 3px rgba(255,255,255,0.4), inset 0 -3px 4px rgba(0,0,0,0.6), inset 2px 0 3px rgba(255,255,255,0.25), inset -2px 0 3px rgba(0,0,0,0.6)",
      };

  // Mat board (Paspartú / María Luisa de museo)
  const matBoardClass = isClasica
    ? "bg-gradient-to-b from-[#18161D] via-[#121115] to-[#0A0A0D] border-2 border-[#D4AF37]/50 shadow-[inset_0_3px_12px_rgba(0,0,0,0.85)]"
    : isBotanica
    ? "bg-[#FAF7F2] border-2 border-[#556B2F]/25 shadow-[inset_0_2px_6px_rgba(0,0,0,0.14)]"
    : "bg-[#F7EFE8] border-2 border-[#C86D51]/30 shadow-[inset_0_2px_6px_rgba(0,0,0,0.14)]";

  // Photo cut bevel border
  const photoBevelClass = isClasica
    ? "border-2 border-[#D4AF37]/70 shadow-[inset_0_5px_15px_rgba(0,0,0,0.85)]"
    : isBotanica
    ? "border-2 border-[#E5DAC4] shadow-[inset_0_4px_12px_rgba(0,0,0,0.35)]"
    : "border-2 border-[#E2CEBF] shadow-[inset_0_4px_12px_rgba(0,0,0,0.35)]";

  // Engraved plaque styling (Placa grabada de galería)
  const plaqueClass = isClasica
    ? "bg-gradient-to-b from-[#FFF5CE] via-[#D4AF37] via-50%-[#A17C14] to-[#F3DB8E] border border-[#FFE8A3] text-[#1A1406] shadow-[0_3px_12px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.9)]"
    : isBotanica
    ? "bg-gradient-to-b from-[#FBF8EF] via-[#EADBBD] to-[#C7AE7E] border border-[#8C6D3B] text-[#241A0B] shadow-[0_2px_8px_rgba(0,0,0,0.18),inset_0_1px_0_rgba(255,255,255,0.8)]"
    : "bg-gradient-to-b from-[#FDF5F0] via-[#E8C5B3] to-[#C9947E] border border-[#91563E] text-[#3D1405] shadow-[0_2px_8px_rgba(0,0,0,0.18),inset_0_1px_0_rgba(255,255,255,0.8)]";

  const plaqueTagClass = isClasica
    ? "font-serif text-[11px] sm:text-xs tracking-[0.2em] uppercase font-bold text-[#2A1E05]"
    : isBotanica
    ? "font-serif text-[11px] sm:text-xs tracking-[0.2em] uppercase font-bold text-[#352511]"
    : "font-serif text-[11px] sm:text-xs tracking-[0.2em] uppercase font-bold text-[#4F1A07]";

  const plaqueCaptionClass = isClasica
    ? "text-xs sm:text-[13px] font-medium text-[#1A1406]/90 font-serif italic"
    : isBotanica
    ? "text-xs sm:text-[13px] font-medium text-[#241A0B]/90 font-serif italic"
    : "text-xs sm:text-[13px] font-medium text-[#3D1405]/90 font-serif italic";

  // Navigation button class (Antique metallic coin buttons)
  const navBtnClass = isClasica
    ? "w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-black/85 hover:bg-black text-[#F5E6C8] border border-[#D4AF37]/80 shadow-[0_4px_16px_rgba(0,0,0,0.7),0_0_12px_rgba(212,175,55,0.4)] flex items-center justify-center transition-all cursor-pointer hover:scale-110 active:scale-95"
    : isBotanica
    ? "w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-[#FAF7F2]/95 hover:bg-white text-[#463116] border border-[#8C6D3B]/70 shadow-[0_4px_16px_rgba(0,0,0,0.25)] flex items-center justify-center transition-all cursor-pointer hover:scale-110 active:scale-95"
    : "w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-[#FDF8F5]/95 hover:bg-white text-[#6E2F1A] border border-[#C86D51]/70 shadow-[0_4px_16px_rgba(0,0,0,0.25)] flex items-center justify-center transition-all cursor-pointer hover:scale-110 active:scale-95";

  // Dot indicator active color
  const getDotClass = (idx: number) => {
    const isActive = idx === currentIndex;
    if (isActive) {
      if (isBotanica) return "w-8 bg-[#556B2F] shadow-[0_0_8px_rgba(85,107,47,0.5)]";
      if (isClasica) return "w-8 bg-gradient-to-r from-[#D4AF37] to-[#F5E6C8] shadow-[0_0_12px_rgba(212,175,55,0.8)]";
      if (isBoho) return "w-8 bg-[#C86D51] shadow-[0_0_8px_rgba(200,109,81,0.5)]";
      return "w-8 bg-[var(--gold)]";
    }
    return isClasica
      ? "w-2.5 bg-white/25 hover:bg-white/40"
      : isBotanica
      ? "w-2.5 bg-[#556B2F]/25 hover:bg-[#556B2F]/45"
      : "w-2.5 bg-[#C86D51]/25 hover:bg-[#C86D51]/45";
  };

  const currentSlide = slides[currentIndex];

  return (
    <section
      aria-label="Galería de fotos de los novios"
      className="flex flex-col items-center w-full relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Optional Heading (if not already handled by the parent section) */}
      {showHeading && (
        <div className="flex flex-col items-center text-center gap-2 mb-4">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest opacity-80">
            <Heart size={14} className="fill-current text-rose-400" />
            <span>Nuestra Galería</span>
            <Heart size={14} className="fill-current text-rose-400" />
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight">
            {title}
          </h2>
          {subtitle && (
            <p className="text-xs sm:text-sm font-medium opacity-80 max-w-md mx-auto">
              {subtitle}
            </p>
          )}
        </div>
      )}

      {/* ─── WALL HANGER (Wall nail & hanging wires/cords) ─── */}
      <div className="flex flex-col items-center select-none pt-1" aria-hidden="true">
        {/* Wall nail head with cast shadow */}
        <div className="relative z-10 flex items-center justify-center">
          <div className="absolute w-4 h-4 rounded-full bg-black/40 blur-[2px] translate-y-1.5" />
          <div className={`w-3.5 h-3.5 rounded-full ${nailClass} shadow-md border border-white/20`} />
        </div>

        {/* Hanging V-Wires / Ribbons */}
        <div className="relative w-40 sm:w-56 h-7 sm:h-9 -mt-1.5 overflow-hidden">
          <div
            className={`absolute top-0 right-1/2 w-[55%] h-full origin-top-right border-r-1.5 ${wireClass}`}
            style={{ transform: "rotate(24deg)", transformOrigin: "top right" }}
          />
          <div
            className={`absolute top-0 left-1/2 w-[55%] h-full origin-top-left border-l-1.5 ${wireClass}`}
            style={{ transform: "rotate(-24deg)", transformOrigin: "top left" }}
          />
        </div>
      </div>

      {/* ─── PHYSICAL PICTURE FRAME (CUADRO LITERAL) ─── */}
      <div className="relative w-full max-w-2xl px-2 sm:px-0">
        {/* Outer Frame Moulding with Realistic Bevels & Relief */}
        <div
          className="relative p-3 sm:p-5 md:p-6 rounded-xs select-none"
          style={outerMouldingStyle}
        >
          {/* 4 Authentic Ornamental Corner Brackets */}
          <CornerBracket position="top-left" theme={theme} />
          <CornerBracket position="top-right" theme={theme} />
          <CornerBracket position="bottom-left" theme={theme} />
          <CornerBracket position="bottom-right" theme={theme} />

          {/* Miter Joint Diagonal Seam Highlights */}
          <div
            aria-hidden="true"
            className="absolute inset-0 pointer-events-none rounded-xs border border-white/25"
          />

          {/* Inner Museum Passepartout / Mat Board (Paspartú) */}
          <div
            className={`relative p-3 sm:p-5 md:p-6 pb-4 sm:pb-6 rounded-xs ${matBoardClass}`}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {/* Fine Inset Filet Line inside Mat Board */}
            <div
              aria-hidden="true"
              className="absolute inset-2 sm:inset-3 pointer-events-none border border-current opacity-20"
            />

            {/* 45-degree Beveled Photo Cut Window */}
            <div
              className={`relative w-full aspect-[4/3] sm:aspect-[16/10] overflow-hidden bg-black/30 rounded-none ${photoBevelClass}`}
            >
              <img
                key={currentIndex}
                src={currentSlide.src}
                alt={currentSlide.alt}
                className="w-full h-full object-cover object-center animate-fade-in transition-all duration-700 select-none transform hover:scale-[1.02]"
                loading="lazy"
              />

              {/* Realistic Museum Anti-Glare Glass Sheen / Reflection */}
              <div
                aria-hidden="true"
                className="absolute inset-0 pointer-events-none opacity-40 mix-blend-screen"
                style={{
                  background:
                    "linear-gradient(120deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.1) 28%, transparent 55%, rgba(255,255,255,0.08) 82%, rgba(255,255,255,0.25) 100%)",
                }}
              />

              {/* Mat Cut Inset Shadow onto Photo Print */}
              <div
                aria-hidden="true"
                className="absolute inset-0 pointer-events-none shadow-[inset_0_4px_12px_rgba(0,0,0,0.5),inset_0_1px_3px_rgba(0,0,0,0.3)]"
              />
            </div>

            {/* ─── ENGRAVED COMMEMORATIVE GALLERY PLAQUE ─── */}
            <div className="mt-3 sm:mt-5 flex justify-center px-1">
              <div
                key={`plaque-${currentIndex}`}
                className={`relative px-5 sm:px-8 py-2 sm:py-2.5 rounded-xs flex flex-col items-center text-center max-w-md w-full animate-fade-in ${plaqueClass}`}
              >
                {/* Left & Right Engraved Screw Rivets with driver slot */}
                <div
                  aria-hidden="true"
                  className="absolute left-2.5 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-black/40 shadow-inner flex items-center justify-center"
                >
                  <div className="w-1.2 h-[0.6px] bg-black/70 rotate-45" />
                </div>
                <div
                  aria-hidden="true"
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-black/40 shadow-inner flex items-center justify-center"
                >
                  <div className="w-1.2 h-[0.6px] bg-black/70 -rotate-45" />
                </div>

                {/* Plaque Header: Chapter / Tag & Photo Index */}
                <div className="flex items-center gap-2">
                  <span className={plaqueTagClass}>
                    {currentSlide.tag || `MOMENTO ${currentIndex + 1}`}
                  </span>
                  <span className="opacity-40 text-[9px]">•</span>
                  <span className="text-[10px] sm:text-[11px] font-sans font-bold tracking-widest opacity-75">
                    {currentIndex + 1} / {total}
                  </span>
                </div>

                {/* Plaque Inscribed Caption */}
                {currentSlide.caption && (
                  <p className={`mt-0.5 leading-snug line-clamp-2 ${plaqueCaptionClass}`}>
                    {currentSlide.caption}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Navigation Arrows (Sculpted Metallic Coins on Frame Edges) */}
          {total > 1 && (
            <>
              <button
                type="button"
                onClick={prevSlide}
                aria-label="Ver foto anterior"
                className={`absolute top-1/2 -translate-y-1/2 -left-3 sm:-left-5 md:-left-6 z-20 ${navBtnClass}`}
              >
                <ChevronLeft size={20} />
              </button>

              <button
                type="button"
                onClick={nextSlide}
                aria-label="Ver foto siguiente"
                className={`absolute top-1/2 -translate-y-1/2 -right-3 sm:-right-5 md:-right-6 z-20 ${navBtnClass}`}
              >
                <ChevronRight size={20} />
              </button>
            </>
          )}
        </div>

        {/* Exhibition Dots / Indicators Below Picture Frame */}
        {total > 1 && (
          <div className="flex items-center justify-center gap-2.5 pt-4 sm:pt-6">
            {slides.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => goToSlide(idx)}
                aria-label={`Ir a la foto ${idx + 1}`}
                className={`h-2 sm:h-2.5 rounded-full transition-all duration-300 cursor-pointer ${getDotClass(
                  idx
                )}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
