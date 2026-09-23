"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Copy, Check, Sparkles, Lock, LockOpen } from "lucide-react";
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
          // Slight delay for magic effect when reaching section
          setTimeout(() => setIsOpen(true), 400);
        }
      },
      { threshold: 0.35 }
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
      {/* Header */}
      <div className="flex flex-col items-center text-center gap-2 max-w-lg">
        <span
          className="font-jakarta text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full"
          style={{
            background: "linear-gradient(135deg, rgba(197,155,39,0.15), rgba(212,163,115,0.15))",
            color: "var(--gold)",
            border: "1px solid rgba(197,155,39,0.3)",
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
          El cofre de los deseos
        </h3>
        <p
          className="font-jakarta text-sm sm:text-base"
          style={{ color: "var(--dark-brown-70)", lineHeight: 1.5 }}
        >
          El mejor regalo es tu presencia. Pero si deseás hacernos un presente...
        </p>
      </div>

      {/* Interactive 3D Treasure Chest SVG */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        type="button"
        aria-label={isOpen ? "Cerrar cofre del tesoro" : "Abrir cofre del tesoro"}
        className="group relative flex flex-col items-center cursor-pointer border-none bg-transparent focus:outline-none"
        style={{ perspective: "1000px" }}
      >
        {/* Glow Aura when open */}
        <div
          aria-hidden="true"
          className="absolute inset-0 rounded-full transition-all duration-700 pointer-events-none"
          style={{
            background: isOpen
              ? "radial-gradient(circle, rgba(197,155,39,0.45) 0%, rgba(212,163,115,0.2) 50%, transparent 75%)"
              : "radial-gradient(circle, rgba(197,155,39,0.1) 0%, transparent 60%)",
            filter: "blur(20px)",
            transform: isOpen ? "scale(1.4)" : "scale(0.9)",
            opacity: isOpen ? 1 : 0.5,
          }}
        />

        {/* Sparkles / Light rays container */}
        {isOpen && (
          <div aria-hidden="true" className="absolute inset-0 pointer-events-none z-10 overflow-visible">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="absolute rounded-full animate-float"
                style={{
                  width: `${6 + (i % 4) * 3}px`,
                  height: `${6 + (i % 4) * 3}px`,
                  background: i % 2 === 0 ? "#C59B27" : "#F5EDD9",
                  boxShadow: "0 0 10px #C59B27",
                  top: `${15 + (i * 10)}%`,
                  left: `${10 + i * 11}%`,
                  animationDuration: `${2 + (i % 3)}s`,
                  animationDelay: `${i * 0.15}s`,
                }}
              />
            ))}
          </div>
        )}

        {/* SVG Container */}
        <div
          className="relative transition-transform duration-300 group-hover:scale-105"
          style={{
            width: "min(300px, 75vw)",
            filter: "drop-shadow(0 15px 30px rgba(43,33,24,0.25))",
          }}
        >
          <svg
            viewBox="0 0 300 220"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-auto overflow-visible"
          >
            <defs>
              {/* Wood Gradients */}
              <linearGradient id="woodBase" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#5C3119" />
                <stop offset="50%" stopColor="#3E1F0E" />
                <stop offset="100%" stopColor="#291307" />
              </linearGradient>

              <linearGradient id="woodLid" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#7A4324" />
                <stop offset="60%" stopColor="#5C3119" />
                <stop offset="100%" stopColor="#3E1F0E" />
              </linearGradient>

              <linearGradient id="goldStraps" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#F7E6A9" />
                <stop offset="40%" stopColor="#C59B27" />
                <stop offset="80%" stopColor="#8A6611" />
                <stop offset="100%" stopColor="#D4A373" />
              </linearGradient>

              <linearGradient id="goldGlowInside" x1="0%" y1="100%" x2="0%" y2="0%">
                <stop offset="0%" stopColor="#FFF2B2" stopOpacity="0.95" />
                <stop offset="40%" stopColor="#C59B27" stopOpacity="0.85" />
                <stop offset="100%" stopColor="#D4A373" stopOpacity="0" />
              </linearGradient>

              <radialGradient id="sunburst" cx="50%" cy="100%" r="90%">
                <stop offset="0%" stopColor="#FFF7D6" stopOpacity="0.9" />
                <stop offset="50%" stopColor="#C59B27" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#8A6611" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* Glowing Light Burst when Open */}
            {isOpen && (
              <g className="animate-fade-in">
                <circle cx="150" cy="90" r="85" fill="url(#sunburst)" />
                {/* Light rays */}
                <path d="M150 90 L110 10" stroke="#FDFBF7" strokeWidth="2.5" opacity="0.6" strokeDasharray="4 4" />
                <path d="M150 90 L150 0" stroke="#FDFBF7" strokeWidth="3" opacity="0.7" />
                <path d="M150 90 L190 10" stroke="#FDFBF7" strokeWidth="2.5" opacity="0.6" strokeDasharray="4 4" />
                <path d="M150 90 L70 30" stroke="#FDFBF7" strokeWidth="2" opacity="0.4" />
                <path d="M150 90 L230 30" stroke="#FDFBF7" strokeWidth="2" opacity="0.4" />
              </g>
            )}

            {/* Inside Content Glow (Coins / Gold fill) */}
            <rect x="25" y="85" width="250" height="25" rx="4" fill="url(#goldGlowInside)" opacity={isOpen ? 1 : 0} />
            {isOpen && (
              <g className="animate-scale-in">
                {/* Gold coins stack inside */}
                <ellipse cx="100" cy="95" rx="14" ry="6" fill="#F7E6A9" stroke="#C59B27" strokeWidth="1" />
                <ellipse cx="120" cy="92" rx="16" ry="7" fill="#FFD700" stroke="#8A6611" strokeWidth="1" />
                <ellipse cx="150" cy="90" rx="22" ry="9" fill="#FFF2B2" stroke="#C59B27" strokeWidth="1.5" />
                <ellipse cx="180" cy="93" rx="16" ry="7" fill="#FFD700" stroke="#8A6611" strokeWidth="1" />
                <ellipse cx="200" cy="96" rx="14" ry="6" fill="#F7E6A9" stroke="#C59B27" strokeWidth="1" />
                {/* Sparkle star inside */}
                <path d="M150 78 L152 84 L158 86 L152 88 L150 94 L148 88 L142 86 L148 84 Z" fill="#FFF" />
              </g>
            )}

            {/* CHEST BASE */}
            <rect x="20" y="95" width="260" height="110" rx="12" fill="url(#woodBase)" stroke="#1A0B04" strokeWidth="3" />
            
            {/* Wooden Planks details on Base */}
            <line x1="20" y1="130" x2="280" y2="130" stroke="#291307" strokeWidth="1.5" opacity="0.6" />
            <line x1="20" y1="165" x2="280" y2="165" stroke="#291307" strokeWidth="1.5" opacity="0.6" />

            {/* Gold Straps on Base (Left, Center, Right) */}
            <rect x="45" y="95" width="22" height="110" fill="url(#goldStraps)" stroke="#5C4208" strokeWidth="1" />
            <rect x="233" y="95" width="22" height="110" fill="url(#goldStraps)" stroke="#5C4208" strokeWidth="1" />

            {/* Gold Rivets / Bolts on Straps */}
            <circle cx="56" cy="110" r="2.5" fill="#FFF" opacity="0.9" />
            <circle cx="56" cy="148" r="2.5" fill="#FFF" opacity="0.9" />
            <circle cx="56" cy="185" r="2.5" fill="#FFF" opacity="0.9" />
            <circle cx="244" cy="110" r="2.5" fill="#FFF" opacity="0.9" />
            <circle cx="244" cy="148" r="2.5" fill="#FFF" opacity="0.9" />
            <circle cx="244" cy="185" r="2.5" fill="#FFF" opacity="0.9" />

            {/* Keyhole / Lock Plate on Base */}
            <rect x="132" y="115" width="36" height="42" rx="6" fill="url(#goldStraps)" stroke="#3E2B04" strokeWidth="1.5" />
            <circle cx="150" cy="130" r="7" fill="#1A0B04" />
            <path d="M147 132 L153 132 L155 148 L145 148 Z" fill="#1A0B04" />
            <circle cx="150" cy="130" r="3" fill="#C59B27" opacity="0.5" />

            {/* CHEST LID (ANIMATED 3D ROTATION) */}
            <g
              style={{
                transformOrigin: "150px 95px",
                transformBox: "fill-box",
                transform: isOpen
                  ? "rotateX(-110deg) translateY(-20px) scaleY(0.9)"
                  : "rotateX(0deg) translateY(0px)",
                transition: "transform 0.85s cubic-bezier(0.34, 1.45, 0.64, 1)",
              }}
            >
              {/* Domed Lid SVG Path */}
              <path
                d="M20 95 C20 35, 280 35, 280 95 Z"
                fill="url(#woodLid)"
                stroke="#1A0B04"
                strokeWidth="3"
              />
              {/* Lid Wood grain curve */}
              <path
                d="M20 95 C20 60, 280 60, 280 95"
                fill="none"
                stroke="#3E1F0E"
                strokeWidth="2"
                opacity="0.5"
              />

              {/* Gold Straps on Lid */}
              <path
                d="M45 95 C45 42, 67 42, 67 95 Z"
                fill="url(#goldStraps)"
                stroke="#5C4208"
                strokeWidth="1"
              />
              <path
                d="M233 95 C233 42, 255 42, 255 95 Z"
                fill="url(#goldStraps)"
                stroke="#5C4208"
                strokeWidth="1"
              />

              {/* Gold Rivets on Lid */}
              <circle cx="56" cy="65" r="2.5" fill="#FFF" opacity="0.9" />
              <circle cx="244" cy="65" r="2.5" fill="#FFF" opacity="0.9" />

              {/* Gold Latch on Lid (Overlaps keyhole when closed) */}
              <rect
                x="136"
                y="80"
                width="28"
                height="24"
                rx="4"
                fill="url(#goldStraps)"
                stroke="#3E2B04"
                strokeWidth="1.5"
              />
              <circle cx="150" cy="92" r="3.5" fill="#3E2B04" />
            </g>
          </svg>
        </div>

        {/* Action Toggle Pill */}
        <div className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 rounded-full shadow-md transition-all duration-300 hover:scale-105"
          style={{
            background: isOpen
              ? "linear-gradient(135deg, #C59B27, #D4A373)"
              : "rgba(197,155,39,0.14)",
            border: "1.5px solid rgba(197,155,39,0.45)",
            color: isOpen ? "#FFF" : "var(--dark-brown)",
          }}
        >
          {isOpen ? (
            <>
              <LockOpen size={16} aria-hidden="true" />
              <span className="font-jakarta text-xs sm:text-sm font-semibold tracking-wide">
                ¡Cofre abierto! Tocá para cerrar
              </span>
            </>
          ) : (
            <>
              <Lock size={16} aria-hidden="true" style={{ color: "var(--gold)" }} />
              <span className="font-jakarta text-xs sm:text-sm font-semibold tracking-wide">
                ✨ Hacé clic para abrir el cofre
              </span>
            </>
          )}
        </div>
      </button>

      {/* REVEALED GIFT DETAILS CARD (REVEALED WHEN OPEN) */}
      <div
        className="w-full flex flex-col gap-6 transition-all duration-700 overflow-hidden"
        style={{
          maxHeight: isOpen ? "800px" : "0px",
          opacity: isOpen ? 1 : 0,
          transform: isOpen ? "translateY(0)" : "translateY(24px)",
          pointerEvents: isOpen ? "auto" : "none",
        }}
      >
        <div
          aria-hidden="true"
          style={{
            height: "1px",
            background:
              "linear-gradient(to right, transparent, rgba(197,155,39,0.4), transparent)",
            margin: "0.5rem 0",
          }}
        />

        {/* Bank info container */}
        <div className="flex flex-col items-center gap-1.5 py-1 px-4 text-center">
          <p
            className="font-jakarta text-xs font-bold tracking-widest uppercase"
            style={{ color: "var(--gold)", letterSpacing: "0.2em" }}
          >
            {gift.bankName}
          </p>
          <p
            className="font-cormorant"
            style={{
              fontSize: "clamp(1.15rem, 2.5vw, 1.4rem)",
              color: "var(--dark-brown-70)",
              fontStyle: "italic",
            }}
          >
            Titular: <span className="font-semibold not-italic" style={{ color: "var(--dark-brown)" }}>{gift.holderName}</span>
          </p>
        </div>

        {/* Copy fields */}
        <div className="flex flex-col gap-4">
          <CopyRow
            label="Alias"
            value={gift.alias}
            isCopied={copied === "alias"}
            onCopy={() => handleCopy(gift.alias, "alias")}
          />
          <CopyRow
            label="CBU"
            value={gift.cbu}
            isCopied={copied === "cbu"}
            onCopy={() => handleCopy(gift.cbu, "cbu")}
          />
        </div>
      </div>
    </div>
  );
}

interface CopyRowProps {
  label: string;
  value: string;
  isCopied: boolean;
  onCopy: () => void;
}

function CopyRow({ label, value, isCopied, onCopy }: CopyRowProps) {
  return (
    <div
      className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 rounded-2xl w-full"
      style={{
        padding: "1.25rem 1.5rem",
        background: "rgba(197,155,39,0.08)",
        border: "1.5px solid rgba(197,155,39,0.28)",
        boxSizing: "border-box",
      }}
    >
      <div className="flex-1 min-w-0 flex flex-col gap-1">
        <p
          className="font-jakarta font-bold"
          style={{
            fontSize: "0.75rem",
            color: "var(--gold)",
            letterSpacing: "0.14em",
            textTransform: "uppercase",
          }}
        >
          {label}
        </p>
        <p
          className="font-jakarta font-semibold text-sm sm:text-base break-all select-all"
          style={{
            color: "var(--dark-brown)",
            lineHeight: 1.4,
            letterSpacing: label === "CBU" ? "0.05em" : "normal",
          }}
        >
          {value}
        </p>
      </div>
      <button
        onClick={onCopy}
        type="button"
        aria-label={isCopied ? `${label} copiado` : `Copiar ${label}`}
        aria-pressed={isCopied}
        className="shrink-0 self-start sm:self-center flex items-center justify-center gap-2 rounded-xl font-jakarta font-semibold transition-all duration-200 shadow-sm mt-1 sm:mt-0"
        style={{
          padding: "0.65rem 1.25rem",
          fontSize: "0.85rem",
          background: isCopied ? "#16a34a" : "linear-gradient(135deg, #C59B27, #D4A373)",
          color: "#fff",
          border: "none",
          cursor: "pointer",
          transform: isCopied ? "scale(1.04)" : "scale(1)",
        }}
      >
        {isCopied ? (
          <>
            <Check size={16} aria-hidden="true" /> ¡Copiado!
          </>
        ) : (
          <>
            <Copy size={16} aria-hidden="true" /> Copiar
          </>
        )}
      </button>
    </div>
  );
}
