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

  // Auto-open on scroll into view
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
      className="glass-card flex flex-col items-center gap-6 sm:gap-8 w-full"
      style={{
        padding: "clamp(1.5rem, 5vw, 3rem)",
        boxSizing: "border-box",
      }}
    >
      {/* Header */}
      <div className="flex flex-col items-center text-center gap-2 max-w-lg w-full">
        <span
          className="font-jakarta text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full inline-block"
          style={{
            background: "linear-gradient(135deg, rgba(197,155,39,0.15), rgba(212,163,115,0.15))",
            color: "var(--gold)",
            border: "1px solid rgba(197,155,39,0.35)",
          }}
        >
          🎁 Mesa de Regalos
        </span>
        <h3
          className="font-cormorant"
          style={{
            fontSize: "clamp(1.75rem, 3.5vw, 2.25rem)",
            fontWeight: 600,
            color: "var(--dark-brown)",
            lineHeight: 1.15,
          }}
        >
          Mesa de Regalos
        </h3>
        <p
          className="font-jakarta text-sm sm:text-base"
          style={{ color: "var(--dark-brown-70)", lineHeight: 1.5 }}
        >
          El mejor regalo es tu presencia. Pero si deseás hacernos un presente...
        </p>
      </div>

      {/* Animated Chest Graphic Section */}
      <div className="flex flex-col items-center w-full max-w-md my-2 relative">
        
        {/* Glow behind chest */}
        <div
          aria-hidden="true"
          className="absolute inset-0 rounded-full transition-all duration-700 pointer-events-none"
          style={{
            background: isOpen
              ? "radial-gradient(circle, rgba(197,155,39,0.35) 0%, rgba(212,163,115,0.15) 50%, transparent 70%)"
              : "radial-gradient(circle, rgba(197,155,39,0.1) 0%, transparent 60%)",
            filter: "blur(25px)",
            transform: isOpen ? "scale(1.3)" : "scale(0.9)",
            opacity: isOpen ? 1 : 0.4,
          }}
        />

        {/* Chest SVG */}
        <button
          onClick={() => setIsOpen((prev) => !prev)}
          type="button"
          aria-label={isOpen ? "Cerrar cofre del tesoro" : "Abrir cofre del tesoro"}
          className="relative group cursor-pointer border-none bg-transparent focus:outline-none w-full max-w-[260px] flex justify-center py-2"
          style={{ perspective: "1000px" }}
        >
          <svg
            viewBox="0 0 240 160"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-auto overflow-visible transition-transform duration-300 group-hover:scale-105"
            style={{ filter: "drop-shadow(0 12px 24px rgba(43,33,24,0.22))" }}
          >
            <defs>
              <linearGradient id="chestWood" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#7A3E1D" />
                <stop offset="50%" stopColor="#542810" />
                <stop offset="100%" stopColor="#361708" />
              </linearGradient>

              <linearGradient id="chestGold" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#FFF2B2" />
                <stop offset="40%" stopColor="#C59B27" />
                <stop offset="80%" stopColor="#8A6611" />
                <stop offset="100%" stopColor="#D4A373" />
              </linearGradient>

              <radialGradient id="goldLightInside" cx="50%" cy="40%" r="60%">
                <stop offset="0%" stopColor="#FFF9E6" stopOpacity="0.9" />
                <stop offset="50%" stopColor="#FFD700" stopOpacity="0.7" />
                <stop offset="100%" stopColor="#C59B27" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* Glowing Light Beam from Inside when Open */}
            {isOpen && (
              <g className="animate-fade-in">
                <circle cx="120" cy="55" r="45" fill="url(#goldLightInside)" />
                <path d="M120 55 L80 0 L160 0 Z" fill="url(#goldLightInside)" opacity="0.6" />
                {/* Gold coins popping */}
                <ellipse cx="95" cy="58" rx="12" ry="5" fill="#FFD700" stroke="#8A6611" strokeWidth="1" />
                <ellipse cx="120" cy="54" rx="16" ry="6" fill="#FFF2B2" stroke="#C59B27" strokeWidth="1" />
                <ellipse cx="145" cy="58" rx="12" ry="5" fill="#FFD700" stroke="#8A6611" strokeWidth="1" />
                <path d="M120 40 L122 45 L127 47 L122 49 L120 54 L118 49 L113 47 L118 45 Z" fill="#FFF" />
              </g>
            )}

            {/* CHEST BASE BODY */}
            <rect x="20" y="60" width="200" height="90" rx="10" fill="url(#chestWood)" stroke="#1F0C04" strokeWidth="2.5" />
            
            {/* Horizontal Plank Separator Lines */}
            <line x1="20" y1="90" x2="220" y2="90" stroke="#2D1205" strokeWidth="1.5" opacity="0.6" />
            <line x1="20" y1="120" x2="220" y2="120" stroke="#2D1205" strokeWidth="1.5" opacity="0.6" />

            {/* Gold Straps Left / Right */}
            <rect x="45" y="60" width="18" height="90" fill="url(#chestGold)" stroke="#4A3406" strokeWidth="1" />
            <rect x="177" y="60" width="18" height="90" fill="url(#chestGold)" stroke="#4A3406" strokeWidth="1" />

            {/* Metallic Studs */}
            <circle cx="54" cy="75" r="2.5" fill="#FFF" opacity="0.85" />
            <circle cx="54" cy="105" r="2.5" fill="#FFF" opacity="0.85" />
            <circle cx="54" cy="135" r="2.5" fill="#FFF" opacity="0.85" />
            <circle cx="186" cy="75" r="2.5" fill="#FFF" opacity="0.85" />
            <circle cx="186" cy="105" r="2.5" fill="#FFF" opacity="0.85" />
            <circle cx="186" cy="135" r="2.5" fill="#FFF" opacity="0.85" />

            {/* Central Keyhole Lock Escutcheon */}
            <rect x="105" y="75" width="30" height="38" rx="5" fill="url(#chestGold)" stroke="#3B2603" strokeWidth="1.5" />
            <circle cx="120" cy="89" r="6" fill="#1F0C04" />
            <path d="M117 90 L123 90 L125 103 L115 103 Z" fill="#1F0C04" />

            {/* CHEST LID (ANIMATED 3D SWING) */}
            <g
              style={{
                transformOrigin: "120px 60px",
                transform: isOpen
                  ? "rotateX(-115deg) translateY(-15px) translateZ(-10px)"
                  : "rotateX(0deg) translateY(0)",
                transition: "transform 0.8s cubic-bezier(0.34, 1.45, 0.64, 1)",
              }}
            >
              {/* Lid Arch Path */}
              <path d="M20 60 C20 15, 220 15, 220 60 Z" fill="url(#chestWood)" stroke="#1F0C04" strokeWidth="2.5" />
              <path d="M20 60 C20 32, 220 32, 220 60" fill="none" stroke="#2D1205" strokeWidth="1.5" opacity="0.5" />

              {/* Lid Gold Straps */}
              <path d="M45 60 C45 22, 63 22, 63 60 Z" fill="url(#chestGold)" stroke="#4A3406" strokeWidth="1" />
              <path d="M177 60 C177 22, 195 22, 195 60 Z" fill="url(#chestGold)" stroke="#4A3406" strokeWidth="1" />

              {/* Lid Studs */}
              <circle cx="54" cy="38" r="2.5" fill="#FFF" opacity="0.85" />
              <circle cx="186" cy="38" r="2.5" fill="#FFF" opacity="0.85" />

              {/* Front Latch Lock Tongue */}
              <rect x="108" y="50" width="24" height="16" rx="3" fill="url(#chestGold)" stroke="#3B2603" strokeWidth="1.2" />
              <circle cx="120" cy="58" r="3" fill="#1F0C04" />
            </g>
          </svg>
        </button>

        {/* Action Toggle Button */}
        <button
          onClick={() => setIsOpen((prev) => !prev)}
          type="button"
          aria-label={isOpen ? "Cerrar cofre" : "Abrir cofre para ver datos"}
          className="mt-3 inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full shadow-md transition-all duration-300 hover:scale-105 cursor-pointer"
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
              <LockOpen size={16} aria-hidden="true" />
              <span className="font-jakarta text-xs sm:text-sm font-semibold tracking-wide">
                Cerrar cofre
              </span>
            </>
          ) : (
            <>
              <Sparkles size={16} aria-hidden="true" />
              <span className="font-jakarta text-xs sm:text-sm font-semibold tracking-wide">
                ✨ Abrir cofre para ver datos
              </span>
            </>
          )}
        </button>
      </div>

      {/* REVEALED CONTENT CARD INSIDE THE SECTION (FLUID EXPANSION) */}
      <div
        className="w-full flex flex-col gap-5 transition-all duration-700 ease-in-out overflow-hidden"
        style={{
          maxHeight: isOpen ? "600px" : "0px",
          opacity: isOpen ? 1 : 0,
          transform: isOpen ? "translateY(0)" : "translateY(16px)",
          pointerEvents: isOpen ? "auto" : "none",
        }}
      >
        <div
          aria-hidden="true"
          style={{
            height: "1px",
            background: "linear-gradient(to right, transparent, rgba(197,155,39,0.35), transparent)",
            margin: "0.25rem 0",
          }}
        />

        {/* Bank & Holder Info Container */}
        <div
          className="rounded-2xl p-5 sm:p-6 flex flex-col gap-4 w-full"
          style={{
            background: "linear-gradient(165deg, rgba(253,251,247,0.95), rgba(250,245,238,0.95))",
            border: "1.5px solid rgba(197,155,39,0.3)",
            boxShadow: "0 10px 30px rgba(43,33,24,0.06)",
            boxSizing: "border-box",
          }}
        >
          <div className="flex flex-col items-center gap-1 text-center">
            <p
              className="font-jakarta text-xs font-bold tracking-widest uppercase"
              style={{ color: "var(--gold)", letterSpacing: "0.18em" }}
            >
              {gift.bankName}
            </p>
            <p className="font-cormorant italic text-base sm:text-lg text-[var(--dark-brown-70)]">
              Titular: <span className="font-semibold not-italic text-[var(--dark-brown)]">{gift.holderName}</span>
            </p>
          </div>

          {/* Copy fields */}
          <div className="flex flex-col gap-3 w-full">
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
      className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl w-full"
      style={{
        padding: "1rem 1.25rem",
        background: "rgba(197,155,39,0.09)",
        border: "1.5px solid rgba(197,155,39,0.28)",
        boxSizing: "border-box",
      }}
    >
      <div className="flex-1 min-w-0 flex flex-col gap-0.5">
        <p
          className="font-jakarta font-bold"
          style={{
            fontSize: "0.725rem",
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
          padding: "0.6rem 1.15rem",
          fontSize: "0.825rem",
          background: isCopied ? "#16a34a" : "linear-gradient(135deg, #C59B27, #D4A373)",
          color: "#fff",
          border: "none",
          cursor: "pointer",
          transform: isCopied ? "scale(1.04)" : "scale(1)",
        }}
      >
        {isCopied ? (
          <>
            <Check size={15} aria-hidden="true" /> ¡Copiado!
          </>
        ) : (
          <>
            <Copy size={15} aria-hidden="true" /> Copiar
          </>
        )}
      </button>
    </div>
  );
}
