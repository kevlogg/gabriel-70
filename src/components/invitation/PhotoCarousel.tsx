"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { ChevronLeft, ChevronRight, Heart, Sparkles } from "lucide-react";
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
}

const DEFAULT_SLIDES: CarouselSlide[] = [
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

export default function PhotoCarousel({
  slides = DEFAULT_SLIDES,
  theme = "boda-botanica",
  title = "Nuestra Historia de Amor",
  subtitle = "Momentos inolvidables que nos trajeron hasta este gran día",
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

  // Auto-play timer
  useEffect(() => {
    if (isHovered || total <= 1) return;
    const interval = setInterval(() => {
      nextSlide();
    }, 5500);
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
      // Swiped left -> next
      nextSlide();
    } else if (diff < -50) {
      // Swiped right -> prev
      prevSlide();
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  // ─── THEME STYLES ───
  // Outer frame container
  const outerFrameClass = isBotanica
    ? "bg-[#FAF7F2] rounded-3xl p-4 sm:p-7 border-2 border-[#556B2F]/30 shadow-[0_20px_45px_rgba(85,107,47,0.12)]"
    : isClasica
    ? "bg-gradient-to-b from-[#1C1917] to-[#0C0A09] rounded-3xl p-4 sm:p-7 border-2 border-[#D4AF37]/50 shadow-[0_25px_50px_rgba(0,0,0,0.6)]"
    : isBoho
    ? "bg-[#FDF8F5] rounded-3xl p-4 sm:p-7 border-2 border-[#C86D51]/30 shadow-[0_20px_45px_rgba(200,109,81,0.14)]"
    : "glass-card p-4 sm:p-7 rounded-3xl shadow-xl";

  // Inner passepartout / mat frame around the photo
  const innerMatClass = isBotanica
    ? "bg-white p-3 sm:p-4 rounded-2xl border border-[#556B2F]/20 shadow-inner"
    : isClasica
    ? "bg-black/80 p-3 sm:p-4 rounded-2xl border-1.5 border-[#D4AF37]/40 shadow-inner"
    : isBoho
    ? "bg-[#FAF1EC] p-3 sm:p-4 rounded-2xl border border-[#C86D51]/25 shadow-inner"
    : "bg-white/80 p-3 sm:p-4 rounded-2xl border border-gray-200";

  // Title styling
  const titleClass = isBotanica
    ? "font-serif text-2xl sm:text-3xl text-[#2D3E1E] tracking-normal font-bold"
    : isClasica
    ? "font-serif text-2xl sm:text-3xl text-transparent bg-clip-text bg-gradient-to-r from-[#F5E6C8] via-[#FAF5EE] to-[#D4AF37] tracking-wider uppercase font-semibold"
    : isBoho
    ? "font-serif text-2xl sm:text-3xl text-[#8C3D26] tracking-tight font-bold"
    : "font-cormorant font-bold text-2xl sm:text-3xl text-[var(--dark-brown)]";

  // Subtitle styling
  const subtitleClass = isBotanica
    ? "text-xs sm:text-sm text-[#556B2F] font-medium max-w-md mx-auto"
    : isClasica
    ? "text-xs sm:text-sm text-[#D4AF37]/80 font-medium tracking-widest uppercase max-w-md mx-auto"
    : isBoho
    ? "text-xs sm:text-sm text-[#A8583E] font-medium max-w-md mx-auto"
    : "text-xs sm:text-sm text-[var(--dark-brown-70)] max-w-md mx-auto";

  // Caption badge styling
  const captionClass = isBotanica
    ? "bg-white/95 text-[#2D3E1E] border border-[#556B2F]/30"
    : isClasica
    ? "bg-black/90 text-[#FAF5EE] border border-[#D4AF37]/50"
    : isBoho
    ? "bg-[#FDF8F5]/95 text-[#6D2B19] border border-[#C86D51]/35"
    : "bg-white/90 text-gray-800";

  // Navigation button class
  const navBtnClass = isBotanica
    ? "w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/90 hover:bg-white text-[#556B2F] border border-[#556B2F]/40 shadow-lg flex items-center justify-center transition-all cursor-pointer hover:scale-105 active:scale-95"
    : isClasica
    ? "w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/80 hover:bg-black text-[#D4AF37] border border-[#D4AF37]/60 shadow-[0_0_15px_rgba(212,175,55,0.4)] flex items-center justify-center transition-all cursor-pointer hover:scale-105 active:scale-95"
    : isBoho
    ? "w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/90 hover:bg-white text-[#C86D51] border border-[#C86D51]/40 shadow-lg flex items-center justify-center transition-all cursor-pointer hover:scale-105 active:scale-95"
    : "w-10 h-10 rounded-full bg-white text-gray-800 shadow-md flex items-center justify-center cursor-pointer";

  // Dot indicator active color
  const getDotClass = (idx: number) => {
    const isActive = idx === currentIndex;
    if (isActive) {
      if (isBotanica) return "w-7 bg-[#556B2F]";
      if (isClasica) return "w-7 bg-[#D4AF37] shadow-[0_0_10px_#D4AF37]";
      if (isBoho) return "w-7 bg-[#C86D51]";
      return "w-7 bg-[var(--gold)]";
    }
    return isClasica ? "w-2.5 bg-white/30" : "w-2.5 bg-gray-300";
  };

  const currentSlide = slides[currentIndex];

  return (
    <section
      aria-label="Galería de fotos de los novios"
      className="flex flex-col gap-6 w-full relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Heading */}
      <div className="flex flex-col items-center text-center gap-2">
        <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest opacity-80">
          <Heart size={14} className="fill-current text-rose-400" />
          <span>Nuestra Galería</span>
          <Heart size={14} className="fill-current text-rose-400" />
        </div>
        <h2 className={titleClass}>{title}</h2>
        {subtitle && <p className={subtitleClass}>{subtitle}</p>}
      </div>

      {/* ─── CAROUSEL FRAME CONTAINER ─── */}
      <div className={outerFrameClass}>
        {/* Decorative corner accents for wedding frame */}
        <div className="relative">
          {/* Top Frame Stamp */}
          <div className="flex items-center justify-between px-2 pb-3 text-[11px] font-bold uppercase tracking-widest opacity-75">
            <span className="flex items-center gap-1.5">
              <Sparkles size={13} className="text-amber-500" />
              <span>{currentSlide.tag || `Foto ${currentIndex + 1} de ${total}`}</span>
            </span>
            <span>
              {currentIndex + 1} / {total}
            </span>
          </div>

          {/* Inner Matting Box */}
          <div
            className={`${innerMatClass} relative overflow-hidden`}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {/* The Photo Container with aspect ratio */}
            <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] overflow-hidden rounded-xl bg-black/10">
              <img
                key={currentIndex}
                src={currentSlide.src}
                alt={currentSlide.alt}
                className="w-full h-full object-cover object-center animate-fade-in transition-all duration-700 select-none transform hover:scale-105"
                loading="lazy"
              />

              {/* Elegant vignette / shadow overlay */}
              <div
                aria-hidden="true"
                className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/60 via-transparent to-black/20"
              />

              {/* Caption Overlay on bottom */}
              {currentSlide.caption && (
                <div className="absolute bottom-3 sm:bottom-4 left-3 right-3 sm:left-5 sm:right-5 z-10 flex justify-center">
                  <div
                    className={`px-4 sm:px-6 py-2 rounded-full backdrop-blur-md shadow-lg text-xs sm:text-sm font-semibold text-center max-w-lg ${captionClass}`}
                  >
                    {currentSlide.caption}
                  </div>
                </div>
              )}
            </div>

            {/* Navigation Arrows */}
            {total > 1 && (
              <>
                <button
                  type="button"
                  onClick={prevSlide}
                  aria-label="Ver foto anterior"
                  className={`absolute top-1/2 -translate-y-1/2 left-4 sm:left-6 z-20 ${navBtnClass}`}
                >
                  <ChevronLeft size={22} />
                </button>

                <button
                  type="button"
                  onClick={nextSlide}
                  aria-label="Ver foto siguiente"
                  className={`absolute top-1/2 -translate-y-1/2 right-4 sm:right-6 z-20 ${navBtnClass}`}
                >
                  <ChevronRight size={22} />
                </button>
              </>
            )}
          </div>

          {/* Bottom Dots Indicator */}
          {total > 1 && (
            <div className="flex items-center justify-center gap-2 pt-4">
              {slides.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => goToSlide(idx)}
                  aria-label={`Ir a la foto ${idx + 1}`}
                  className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${getDotClass(
                    idx
                  )}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

