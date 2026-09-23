"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Copy, Check, Lock, LockOpen, Sparkles } from "lucide-react";
import type { GiftConfig } from "@/config/event";

interface TreasureChestProps {
  gift: GiftConfig;
}

type CopyField = "alias" | "cbu" | null;

export default function TreasureChest({ gift }: TreasureChestProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState<CopyField>(null);
  const [hasAutoOpened, setHasAutoOpened] = useState(false);
  const chestRef = useRef<HTMLDivElement>(null);

  // Auto-open when scrolling into view
  useEffect(() => {
    const node = chestRef.current;
    if (!node || hasAutoOpened) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !hasAutoOpened) {
          setHasAutoOpened(true);
          setTimeout(() => setIsOpen(true), 400);
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [hasAutoOpened]);

  const handleCopy = useCallback(
    async (text: string, field: NonNullable<CopyField>) => {
      try {
        await navigator.clipboard.writeText(text);
        setCopied(field);
        setTimeout(() => setCopied(null), 2200);
      } catch {
        const textarea = document.createElement("textarea");
        textarea.value = text;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
        setCopied(field);
        setTimeout(() => setCopied(null), 2200);
      }
    },
    []
  );

  return (
    <div
      ref={chestRef}
      className="glass-card flex flex-col items-center gap-8"
      style={{
        padding: "clamp(1.75rem, 5vw, 3rem)",
        boxSizing: "border-box",
        width: "100%",
      }}
    >
      {/* Section Header */}
      <div className="flex flex-col items-center text-center gap-2 max-w-lg">
        <span
          className="font-jakarta text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full"
          style={{
            background: "linear-gradient(135deg, rgba(197,155,39,0.18), rgba(212,163,115,0.18))",
            color: "var(--gold)",
            border: "1px solid rgba(197,155,39,0.35)",
          }}
        >
          🎁 Mesa de Regalos
        </span>
        <h3
          className="font-cormorant"
          style={{
            fontSize: "clamp(1.85rem, 4vw, 2.5rem)",
            fontWeight: 600,
            color: "var(--dark-brown)",
            lineHeight: 1.15,
          }}
        >
          El cofre de los recuerdos
        </h3>
        <p
          className="font-jakarta text-sm sm:text-base"
          style={{ color: "var(--dark-brown-70)", lineHeight: 1.5 }}
        >
          Tocá el cofre para abrirlo y descubrir los datos bancarios en su interior.
        </p>
      </div>

      {/* Main Chest Stage Container */}
      <div className="relative w-full max-w-xl flex flex-col items-center justify-center py-4">
        {/* Glow & Sparkle Atmosphere */}
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none transition-all duration-1000"
          style={{
            background: isOpen
              ? "radial-gradient(ellipse at 50% 60%, rgba(212,163,115,0.4) 0%, rgba(197,155,39,0.25) 45%, transparent 75%)"
              : "radial-gradient(ellipse at 50% 60%, rgba(197,155,39,0.1) 0%, transparent 60%)",
            filter: "blur(30px)",
            transform: isOpen ? "scale(1.2)" : "scale(0.8)",
            opacity: isOpen ? 1 : 0.4,
          }}
        />

        {/* Floating Sparks when open */}
        {isOpen && (
          <div aria-hidden="true" className="absolute inset-0 pointer-events-none z-10 overflow-visible">
            {[...Array(10)].map((_, i) => (
              <div
                key={i}
                className="absolute rounded-full animate-float"
                style={{
                  width: `${5 + (i % 4) * 3}px`,
                  height: `${5 + (i % 4) * 3}px`,
                  background: i % 2 === 0 ? "#FFD700" : "#FFF5D1",
                  boxShadow: "0 0 12px #FFD700",
                  top: `${10 + (i * 8)}%`,
                  left: `${8 + i * 9}%`,
                  animationDuration: `${2.2 + (i % 3)}s`,
                  animationDelay: `${i * 0.1}s`,
                }}
              />
            ))}
          </div>
        )}

        {/* Interactive Chest Graphic Container */}
        <div className="relative w-full flex flex-col items-center">
          
          {/* TOP LID OF CHEST (PERSPECTIVE 3D) */}
          <div
            onClick={() => setIsOpen((prev) => !prev)}
            role="button"
            tabIndex={0}
            aria-label={isOpen ? "Cerrar cofre" : "Abrir cofre"}
            onKeyDown={(e) => e.key === "Enter" && setIsOpen((prev) => !prev)}
            className="relative z-30 cursor-pointer select-none transition-transform duration-300 hover:scale-[1.02] focus:outline-none"
            style={{
              perspective: "1200px",
              width: "min(340px, 85vw)",
            }}
          >
            {/* Chest Lid SVG */}
            <div
              style={{
                transformOrigin: "50% 100%",
                transform: isOpen
                  ? "rotateX(-120deg) translateY(-25px) translateZ(-20px)"
                  : "rotateX(0deg) translateY(0)",
                transition: "transform 0.9s cubic-bezier(0.34, 1.45, 0.64, 1)",
                filter: "drop-shadow(0 10px 15px rgba(30,15,5,0.4))",
              }}
            >
              <svg viewBox="0 0 340 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
                <defs>
                  <linearGradient id="lidWood" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#7C4323" />
                    <stop offset="50%" stopColor="#542B14" />
                    <stop offset="100%" stopColor="#3B1C0B" />
                  </linearGradient>
                  <linearGradient id="lidGold" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#FFF3B0" />
                    <stop offset="40%" stopColor="#D4A373" />
                    <stop offset="70%" stopColor="#966F17" />
                    <stop offset="100%" stopColor="#E6B84C" />
                  </linearGradient>
                </defs>

                {/* Main Lid Arch */}
                <path d="M15 95 C15 30, 325 30, 325 95 Z" fill="url(#lidWood)" stroke="#241106" strokeWidth="3" />
                
                {/* Wood Grain Lines */}
                <path d="M20 95 C20 48, 320 48, 320 95" stroke="#3B1C0B" strokeWidth="2.5" opacity="0.6" fill="none" />
                <path d="M35 95 C35 62, 305 62, 305 95" stroke="#3B1C0B" strokeWidth="2" opacity="0.4" fill="none" />

                {/* Gold Straps Left / Center / Right */}
                <path d="M50 95 C50 36, 75 36, 75 95 Z" fill="url(#lidGold)" stroke="#523907" strokeWidth="1.2" />
                <path d="M152 95 C152 30, 188 30, 188 95 Z" fill="url(#lidGold)" stroke="#523907" strokeWidth="1.2" />
                <path d="M265 95 C265 36, 290 36, 290 95 Z" fill="url(#lidGold)" stroke="#523907" strokeWidth="1.2" />

                {/* Metallic Bolts */}
                <circle cx="62.5" cy="58" r="3" fill="#FFF" opacity="0.9" />
                <circle cx="170" cy="48" r="3" fill="#FFF" opacity="0.9" />
                <circle cx="277.5" cy="58" r="3" fill="#FFF" opacity="0.9" />

                {/* Front Latch Tongue */}
                <rect x="150" y="80" width="40" height="20" rx="4" fill="url(#lidGold)" stroke="#3B2603" strokeWidth="1.5" />
                <circle cx="170" cy="90" r="4.5" fill="#241106" />
              </svg>
            </div>
          </div>

          {/* INSIDE CHEST CAVITY & RISING SCROLL (WHERE THE MESSAGE & ALIAS LIVE) */}
          <div
            className="relative z-20 w-full flex flex-col items-center -mt-6"
            style={{
              width: "min(340px, 85vw)",
            }}
          >
            {/* SVG CHEST BASE (INTERIOR CAVITY + FRONT WALL) */}
            <div className="relative w-full">
              <svg viewBox="0 0 340 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
                <defs>
                  <linearGradient id="interiorVelvet" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2E0C06" />
                    <stop offset="100%" stopColor="#120402" />
                  </linearGradient>

                  <linearGradient id="bodyWood" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#613318" />
                    <stop offset="50%" stopColor="#44210E" />
                    <stop offset="100%" stopColor="#2A1206" />
                  </linearGradient>

                  <linearGradient id="goldBand" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#E6B84C" />
                    <stop offset="50%" stopColor="#FFF3B0" />
                    <stop offset="100%" stopColor="#966F17" />
                  </linearGradient>

                  <radialGradient id="insideLight" cx="50%" cy="30%" r="70%">
                    <stop offset="0%" stopColor="#FFF7D6" stopOpacity="0.95" />
                    <stop offset="45%" stopColor="#E6B84C" stopOpacity="0.75" />
                    <stop offset="100%" stopColor="#966F17" stopOpacity="0" />
                  </radialGradient>
                </defs>

                {/* Interior Cavity (Visible when open) */}
                <rect x="20" y="5" width="300" height="40" rx="8" fill="url(#interiorVelvet)" />

                {/* Gold Coins Inside Cavity */}
                {isOpen && (
                  <g className="animate-fade-in">
                    <circle cx="150" cy="22" r="35" fill="url(#insideLight)" />
                    {/* Gold coin stacks */}
                    <ellipse cx="80" cy="28" rx="16" ry="6" fill="#FFD700" stroke="#8A6611" strokeWidth="1" />
                    <ellipse cx="110" cy="24" rx="20" ry="8" fill="#FFF2B2" stroke="#C59B27" strokeWidth="1.2" />
                    <ellipse cx="150" cy="20" rx="26" ry="10" fill="#FFD700" stroke="#8A6611" strokeWidth="1.5" />
                    <ellipse cx="190" cy="24" rx="20" ry="8" fill="#FFF2B2" stroke="#C59B27" strokeWidth="1.2" />
                    <ellipse cx="220" cy="28" rx="16" ry="6" fill="#FFD700" stroke="#8A6611" strokeWidth="1" />
                    {/* Sparkle star */}
                    <path d="M150 8 L152 16 L160 18 L152 20 L150 28 L148 20 L140 18 L148 16 Z" fill="#FFF" />
                  </g>
                )}

                {/* CHEST FRONT BODY WALL */}
                <rect x="15" y="25" width="310" height="130" rx="14" fill="url(#bodyWood)" stroke="#1A0A03" strokeWidth="3" />
                
                {/* Horizontal Plank Lines */}
                <line x1="15" y1="68" x2="325" y2="68" stroke="#2A1206" strokeWidth="2" opacity="0.6" />
                <line x1="15" y1="110" x2="325" y2="110" stroke="#2A1206" strokeWidth="2" opacity="0.6" />

                {/* Gold Straps Left / Center / Right */}
                <rect x="50" y="25" width="25" height="130" fill="url(#goldBand)" stroke="#4A3406" strokeWidth="1" />
                <rect x="265" y="25" width="25" height="130" fill="url(#goldBand)" stroke="#4A3406" strokeWidth="1" />

                {/* Metallic Studs */}
                <circle cx="62.5" cy="45" r="3.5" fill="#FFF" opacity="0.9" />
                <circle cx="62.5" cy="88" r="3.5" fill="#FFF" opacity="0.9" />
                <circle cx="62.5" cy="130" r="3.5" fill="#FFF" opacity="0.9" />

                <circle cx="277.5" cy="45" r="3.5" fill="#FFF" opacity="0.9" />
                <circle cx="277.5" cy="88" r="3.5" fill="#FFF" opacity="0.9" />
                <circle cx="277.5" cy="130" r="3.5" fill="#FFF" opacity="0.9" />

                {/* Central Keyhole Lock Escutcheon */}
                <rect x="145" y="45" width="50" height="55" rx="8" fill="url(#goldBand)" stroke="#3B2603" strokeWidth="2" />
                <circle cx="170" cy="65" r="9" fill="#1A0A03" />
                <path d="M166 67 L174 67 L177 86 L163 86 Z" fill="#1A0A03" />
                <circle cx="170" cy="65" r="3" fill="#E6B84C" opacity="0.7" />
              </svg>

              {/* RISING SCROLL CARD FROM INSIDE THE CHEST */}
              <div
                className="absolute left-1/2 -translate-x-1/2 transition-all duration-800 ease-out z-10 w-[92%] sm:w-[88%]"
                style={{
                  top: isOpen ? "-160px" : "30px",
                  opacity: isOpen ? 1 : 0,
                  transform: isOpen
                    ? "translateX(-50%) translateY(0) scale(1)"
                    : "translateX(-50%) translateY(40px) scale(0.6)",
                  pointerEvents: isOpen ? "auto" : "none",
                  transition: "all 0.85s cubic-bezier(0.34, 1.4, 0.64, 1)",
                }}
              >
                {/* Parchment Royal Scroll Card */}
                <div
                  className="rounded-3xl p-6 sm:p-8 flex flex-col gap-5 text-center shadow-2xl relative border-2"
                  style={{
                    background: "linear-gradient(165deg, #FFFDF8 0%, #FAF2E1 50%, #F5E6C4 100%)",
                    borderColor: "#C59B27",
                    boxShadow: "0 20px 40px rgba(43,33,24,0.3), 0 0 20px rgba(197,155,39,0.3)",
                  }}
                >
                  {/* Decorative Scroll Crest */}
                  <div className="flex items-center justify-center gap-2 text-[var(--gold)] mb-1">
                    <span>✦</span>
                    <span className="font-cormorant italic font-bold text-sm tracking-widest uppercase">
                      Datos de Transferencia
                    </span>
                    <span>✦</span>
                  </div>

                  <p
                    className="font-cormorant italic text-base sm:text-lg font-semibold"
                    style={{ color: "var(--dark-brown)", lineHeight: 1.4 }}
                  >
                    “El mejor regalo es tu presencia y compartir este momento inolvidable junto a Gabriel.”
                  </p>

                  <div
                    aria-hidden="true"
                    style={{
                      height: "1px",
                      background: "linear-gradient(to right, transparent, rgba(197,155,39,0.5), transparent)",
                    }}
                  />

                  {/* Bank & Holder Info */}
                  <div className="flex flex-col items-center gap-1">
                    <p
                      className="font-jakarta text-xs font-bold tracking-widest uppercase"
                      style={{ color: "var(--gold)", letterSpacing: "0.18em" }}
                    >
                      {gift.bankName}
                    </p>
                    <p className="font-jakarta text-xs sm:text-sm text-[var(--dark-brown-70)]">
                      Titular: <span className="font-bold text-[var(--dark-brown)]">{gift.holderName}</span>
                    </p>
                  </div>

                  {/* Alias Box */}
                  <div
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-2xl w-full text-left"
                    style={{
                      background: "rgba(197,155,39,0.12)",
                      border: "1.5px solid rgba(197,155,39,0.35)",
                      boxSizing: "border-box",
                    }}
                  >
                    <div className="flex-1 min-w-0 flex flex-col gap-0.5">
                      <p
                        className="font-jakarta font-bold text-[0.7rem] uppercase tracking-wider"
                        style={{ color: "var(--gold)" }}
                      >
                        ALIAS
                      </p>
                      <p className="font-jakarta font-bold text-sm sm:text-base text-[var(--dark-brown)] break-all select-all">
                        {gift.alias}
                      </p>
                    </div>
                    <button
                      onClick={() => handleCopy(gift.alias, "alias")}
                      type="button"
                      aria-label={copied === "alias" ? "Alias copiado" : "Copiar Alias"}
                      className="shrink-0 flex items-center justify-center gap-2 rounded-xl px-4 py-2 font-jakarta font-semibold text-xs transition-all duration-200 shadow-sm self-start sm:self-center"
                      style={{
                        background: copied === "alias" ? "#16a34a" : "linear-gradient(135deg, #C59B27, #D4A373)",
                        color: "#fff",
                        border: "none",
                        cursor: "pointer",
                      }}
                    >
                      {copied === "alias" ? (
                        <>
                          <Check size={14} aria-hidden="true" /> ¡Copiado!
                        </>
                      ) : (
                        <>
                          <Copy size={14} aria-hidden="true" /> Copiar Alias
                        </>
                      )}
                    </button>
                  </div>

                  {/* CBU Box */}
                  <div
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-2xl w-full text-left"
                    style={{
                      background: "rgba(197,155,39,0.12)",
                      border: "1.5px solid rgba(197,155,39,0.35)",
                      boxSizing: "border-box",
                    }}
                  >
                    <div className="flex-1 min-w-0 flex flex-col gap-0.5">
                      <p
                        className="font-jakarta font-bold text-[0.7rem] uppercase tracking-wider"
                        style={{ color: "var(--gold)" }}
                      >
                        CBU
                      </p>
                      <p className="font-jakarta font-bold text-xs sm:text-sm text-[var(--dark-brown)] break-all select-all tracking-wider">
                        {gift.cbu}
                      </p>
                    </div>
                    <button
                      onClick={() => handleCopy(gift.cbu, "cbu")}
                      type="button"
                      aria-label={copied === "cbu" ? "CBU copiado" : "Copiar CBU"}
                      className="shrink-0 flex items-center justify-center gap-2 rounded-xl px-4 py-2 font-jakarta font-semibold text-xs transition-all duration-200 shadow-sm self-start sm:self-center"
                      style={{
                        background: copied === "cbu" ? "#16a34a" : "linear-gradient(135deg, #C59B27, #D4A373)",
                        color: "#fff",
                        border: "none",
                        cursor: "pointer",
                      }}
                    >
                      {copied === "cbu" ? (
                        <>
                          <Check size={14} aria-hidden="true" /> ¡Copiado!
                        </>
                      ) : (
                        <>
                          <Copy size={14} aria-hidden="true" /> Copiar CBU
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* Action Toggle Button */}
        <button
          onClick={() => setIsOpen((prev) => !prev)}
          type="button"
          aria-label={isOpen ? "Cerrar cofre" : "Abrir cofre para ver datos"}
          className="mt-6 z-30 inline-flex items-center gap-2.5 px-6 py-3 rounded-full shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer"
          style={{
            background: isOpen
              ? "linear-gradient(135deg, #8B4513, #A0522D)"
              : "linear-gradient(135deg, #C59B27, #D4A373)",
            color: "#FFF",
            border: "none",
          }}
        >
          {isOpen ? (
            <>
              <LockOpen size={18} aria-hidden="true" />
              <span className="font-jakarta text-xs sm:text-sm font-semibold tracking-wide">
                Cerrar cofre
              </span>
            </>
          ) : (
            <>
              <Sparkles size={18} aria-hidden="true" />
              <span className="font-jakarta text-xs sm:text-sm font-semibold tracking-wide">
                ✨ Abrir cofre del tesoro
              </span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
