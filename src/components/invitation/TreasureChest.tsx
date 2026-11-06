"use client";

import { useState, useCallback } from "react";
import { Copy, Check, Sparkles, RefreshCw } from "lucide-react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import type { GiftConfig } from "@/config/event";
import type { TemplateId } from "@/lib/schemas/invitation.schema";

interface TreasureChestProps {
  gift: GiftConfig;
  onChestOpen?: () => void;
  theme?: TemplateId;
}

type CopyField = "alias" | "cbu" | null;

export default function TreasureChest({
  gift,
  onChestOpen,
  theme = "classic-gold",
}: TreasureChestProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState<CopyField>(null);

  const isToyStory = theme === "toy-story";
  const isKpop = theme === "k-pop";
  const isPrincess = theme === "princesas";
  const isFootball = theme === "futbol-infantil";

  const handleOpen = useCallback(() => {
    setIsOpen(true);
    onChestOpen?.();
  }, [onChestOpen]);

  const handleReset = useCallback(() => {
    setIsOpen(false);
  }, []);

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

  // Outer card styling
  const cardContainerClass = isToyStory
    ? "bg-white rounded-3xl border-4 border-amber-400 shadow-xl flex flex-col items-center justify-center w-full relative overflow-hidden text-blue-950 font-sans p-6 sm:p-10"
    : isKpop
    ? "bg-black/60 rounded-3xl border border-pink-500/50 shadow-[0_0_30px_rgba(236,72,153,0.3)] flex flex-col items-center justify-center w-full relative overflow-hidden text-white backdrop-blur-xl font-sans p-6 sm:p-10"
    : isPrincess
    ? "bg-white/95 rounded-3xl border-2 border-pink-300 shadow-xl flex flex-col items-center justify-center w-full relative overflow-hidden text-pink-950 font-sans p-6 sm:p-10"
    : isFootball
    ? "bg-white rounded-3xl border-4 border-emerald-500 shadow-xl flex flex-col items-center justify-center w-full relative overflow-hidden text-emerald-950 font-sans p-6 sm:p-10"
    : "glass-card flex flex-col items-center justify-center w-full relative overflow-hidden text-[var(--dark-brown)]";

  // Glow aura behind closed chest
  const auraBackground = isToyStory
    ? "radial-gradient(circle, rgba(56,189,248,0.35) 0%, rgba(251,191,36,0.2) 55%, transparent 75%)"
    : isKpop
    ? "radial-gradient(circle, rgba(236,72,153,0.4) 0%, rgba(168,85,247,0.25) 55%, transparent 75%)"
    : isPrincess
    ? "radial-gradient(circle, rgba(244,114,182,0.35) 0%, rgba(253,230,138,0.2) 55%, transparent 75%)"
    : isFootball
    ? "radial-gradient(circle, rgba(16,185,129,0.35) 0%, rgba(251,191,36,0.2) 55%, transparent 75%)"
    : "radial-gradient(circle, rgba(197,155,39,0.35) 0%, rgba(212,163,115,0.18) 55%, transparent 75%)";

  // Open button styling
  const openBtnClass = isToyStory
    ? "px-8 py-3.5 text-base font-black text-amber-950 bg-amber-400 hover:bg-amber-500 border-2 border-amber-600 rounded-2xl shadow-lg cursor-pointer transition-transform hover:scale-105 flex items-center gap-2"
    : isKpop
    ? "px-8 py-3.5 text-base font-bold text-white bg-gradient-to-r from-pink-500 to-purple-600 hover:opacity-95 rounded-2xl shadow-[0_0_20px_rgba(236,72,153,0.6)] cursor-pointer transition-transform hover:scale-105 flex items-center gap-2"
    : isPrincess
    ? "px-8 py-3.5 text-base font-bold text-white bg-gradient-to-r from-pink-500 via-rose-400 to-amber-300 hover:opacity-95 rounded-2xl shadow-md cursor-pointer transition-transform hover:scale-105 flex items-center gap-2"
    : isFootball
    ? "px-8 py-3.5 text-base font-black text-white bg-emerald-600 hover:bg-emerald-700 border-2 border-emerald-800 rounded-2xl shadow-lg cursor-pointer transition-transform hover:scale-105 flex items-center gap-2"
    : "btn-gold px-8 py-3.5 text-base shadow-lg animate-wax-pulse cursor-pointer flex items-center gap-2";

  const openBtnText = isToyStory
    ? "🐷 Tocá para abrir la alcancía"
    : isKpop
    ? "✨ Tocá para abrir pase de regalo"
    : isPrincess
    ? "👑 Tocá para abrir el cofre real"
    : isFootball
    ? "🏆 Tocá para abrir la copa de regalos"
    : "✨ Tocá para abrir el cofre";

  // Opened phrases
  const phraseTitle = isToyStory
    ? "“¡Hay un amigo en mí!”"
    : isKpop
    ? "“¡Sos parte de nuestro Fandom!”"
    : isPrincess
    ? "“Un deseo se pide con el corazón.”"
    : isFootball
    ? "“¡El mejor equipo es con vos en la cancha!”"
    : "“Menos chiches, más chanchito.”";

  const phraseSubtitle = isToyStory
    ? "Tu presencia en esta misión es nuestro mejor regalo. Si querés hacernos un presente:"
    : isKpop
    ? "Tu energía y compañía en este recital es lo que más nos importa. Si deseás hacernos un obsequio:"
    : isPrincess
    ? "Tu presencia iluminará este baile real. Si deseás hacernos un obsequio:"
    : isFootball
    ? "Tu aliento en este gran partido es lo que más vale. Si querés sumarte a la jugada con un regalo:"
    : "Tu presencia es mi mejor regalo, tu transferencia, el combustible para seguir festejando.";

  const phraseTitleClass = isToyStory
    ? "font-black text-2xl sm:text-3xl text-blue-950"
    : isKpop
    ? "font-black text-2xl sm:text-3xl text-pink-300"
    : isPrincess
    ? "font-bold text-2xl sm:text-3xl text-pink-900"
    : isFootball
    ? "font-black text-2xl sm:text-3xl text-emerald-950 uppercase"
    : "font-cormorant italic font-bold text-2xl sm:text-3xl text-[var(--gold)]";

  const phraseSubtitleClass = isToyStory
    ? "font-bold text-sm sm:text-base text-blue-900"
    : isKpop
    ? "font-medium text-sm sm:text-base text-pink-100/90"
    : isPrincess
    ? "font-medium text-sm sm:text-base text-pink-950/80"
    : isFootball
    ? "font-bold text-sm sm:text-base text-emerald-900"
    : "font-cormorant italic font-semibold text-lg sm:text-xl text-[var(--dark-brown)]";

  // Bank box styling
  const bankBoxClass = isToyStory
    ? "rounded-2xl p-5 sm:p-8 flex flex-col gap-5 w-full bg-sky-50 border-2 border-sky-200 shadow-sm"
    : isKpop
    ? "rounded-2xl p-5 sm:p-8 flex flex-col gap-5 w-full bg-white/10 border border-pink-500/40 shadow-sm"
    : isPrincess
    ? "rounded-2xl p-5 sm:p-8 flex flex-col gap-5 w-full bg-pink-50/70 border border-pink-200 shadow-sm"
    : isFootball
    ? "rounded-2xl p-5 sm:p-8 flex flex-col gap-5 w-full bg-emerald-50/70 border-2 border-emerald-200 shadow-sm"
    : "rounded-2xl p-5 sm:p-8 flex flex-col gap-5 w-full bg-gradient-to-br from-[#FDFBF7] to-[#FAF5EE] border-1.5 border-[rgba(197,155,39,0.35)] shadow-md";

  const bankNameClass = isToyStory
    ? "font-black text-xs sm:text-sm tracking-widest uppercase text-blue-900"
    : isKpop
    ? "font-extrabold text-xs sm:text-sm tracking-widest uppercase text-pink-300"
    : isPrincess
    ? "font-bold text-xs sm:text-sm tracking-widest uppercase text-pink-800"
    : isFootball
    ? "font-black text-xs sm:text-sm tracking-widest uppercase text-emerald-800"
    : "font-jakarta text-xs font-bold tracking-widest uppercase text-[var(--gold)]";

  // RSVP link pill class
  const rsvpPillClass = isToyStory
    ? "flex items-center gap-2.5 px-6 py-3 rounded-full shadow-md bg-amber-400 border-2 border-amber-500 text-amber-950 font-black text-xs sm:text-sm uppercase tracking-wider"
    : isKpop
    ? "flex items-center gap-2.5 px-6 py-3 rounded-full shadow-[0_0_15px_rgba(236,72,153,0.5)] bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold text-xs sm:text-sm uppercase tracking-wider"
    : isPrincess
    ? "flex items-center gap-2.5 px-6 py-3 rounded-full shadow-md bg-pink-100 border border-pink-300 text-pink-900 font-bold text-xs sm:text-sm uppercase tracking-wider"
    : isFootball
    ? "flex items-center gap-2.5 px-6 py-3 rounded-full shadow-md bg-emerald-600 border-2 border-emerald-800 text-white font-black text-xs sm:text-sm uppercase tracking-wider"
    : "flex items-center gap-2.5 px-6 py-3 rounded-full shadow-md bg-[rgba(197,155,39,0.18)] border-1.5 border-[rgba(197,155,39,0.5)] text-[var(--dark-brown)] font-bold text-xs sm:text-sm uppercase tracking-wider";

  return (
    <div
      className={cardContainerClass}
      style={{
        padding: "clamp(2rem, 6vw, 3.5rem)",
        boxSizing: "border-box",
        minHeight: "380px",
      }}
    >
      {/* ─── STATE 1: CHEST CLOSED ─── */}
      {!isOpen && (
        <div className="flex flex-col items-center justify-center w-full gap-6 animate-fade-in py-2">
          {/* Subtle Glow Aura behind Chest */}
          <div className="relative w-full flex flex-col items-center justify-center py-4">
            <div
              aria-hidden="true"
              className="absolute inset-0 rounded-full pointer-events-none"
              style={{
                background: auraBackground,
                filter: "blur(30px)",
                transform: "scale(1.4)",
              }}
            />

            {/* Interactive Lottie Chest */}
            <button
              onClick={handleOpen}
              type="button"
              aria-label="Abrir cofre para ver datos de regalo"
              className="relative z-10 w-full max-w-[420px] sm:max-w-[500px] flex justify-center items-center cursor-pointer border-none bg-transparent focus:outline-none transition-transform duration-300 hover:scale-105"
            >
              <DotLottieReact
                src="/treasure-chest.lottie"
                loop
                autoplay
                style={{
                  width: "100%",
                  height: "auto",
                  transform: "scale(2.1)",
                  transformOrigin: "center center",
                }}
              />
            </button>
          </div>

          {/* Action Call to Action Button */}
          <button onClick={handleOpen} type="button" className={openBtnClass}>
            <Sparkles size={18} aria-hidden="true" />
            <span>{openBtnText}</span>
          </button>
        </div>
      )}

      {/* ─── STATE 2: CHEST OPENED (REVEALED MESSAGE & BANK DETAILS) ─── */}
      {isOpen && (
        <div className="flex flex-col items-center gap-6 w-full animate-scale-in">
          {/* Main Phrase / Message */}
          <div className="flex flex-col items-center text-center gap-2 max-w-lg px-2">
            <p className={phraseTitleClass} style={{ lineHeight: 1.3 }}>
              {phraseTitle}
            </p>
            <p className={phraseSubtitleClass} style={{ lineHeight: 1.45 }}>
              {phraseSubtitle}
            </p>
          </div>

          <div
            aria-hidden="true"
            className="w-full h-px opacity-30"
            style={{
              background: isToyStory
                ? "#0284C7"
                : isKpop
                ? "#EC4899"
                : isPrincess
                ? "#F472B6"
                : isFootball
                ? "#10B981"
                : "rgba(197,155,39,0.35)",
            }}
          />

          {/* Bank Info Container */}
          <div className={bankBoxClass}>
            <div className="flex flex-col items-center gap-1 text-center pb-1">
              <p className={bankNameClass}>{gift.bankName}</p>
              <p className="text-sm sm:text-base opacity-80">
                Titular: <span className="font-bold opacity-100">{gift.holderName}</span>
              </p>
            </div>

            {/* Copy fields */}
            <div className="flex flex-col gap-3.5 w-full px-1 sm:px-3 box-border">
              <CopyRow
                label="Alias"
                value={gift.alias}
                isCopied={copied === "alias"}
                onCopy={() => handleCopy(gift.alias, "alias")}
                theme={theme}
              />
              <CopyRow
                label="CBU"
                value={gift.cbu}
                isCopied={copied === "cbu"}
                onCopy={() => handleCopy(gift.cbu, "cbu")}
                theme={theme}
              />
            </div>
          </div>

          {/* Reset button */}
          <button
            onClick={handleReset}
            type="button"
            className="text-xs opacity-75 hover:opacity-100 font-bold transition-opacity flex items-center gap-1.5 mt-1 cursor-pointer"
          >
            <RefreshCw size={13} aria-hidden="true" />
            Volver a ver el cofre
          </button>

          {/* Mensaje destacado con flecha parpadeando para seguir bajando al RSVP */}
          <a
            href="#rsvp"
            className="flex flex-col items-center gap-2 mt-3 text-center group cursor-pointer"
            aria-label="Bajá para confirmar tu asistencia"
          >
            <div className={`${rsvpPillClass} transition-all duration-300 group-hover:scale-105`}>
              <span className="text-lg animate-bounce" role="img" aria-label="Flecha abajo">
                👇
              </span>
              <span>Bajá para confirmar tu asistencia</span>
              <span className="text-lg animate-bounce" role="img" aria-label="Flecha abajo">
                👇
              </span>
            </div>
          </a>
        </div>
      )}
    </div>
  );
}

interface CopyRowProps {
  label: string;
  value: string;
  isCopied: boolean;
  onCopy: () => void;
  theme?: TemplateId;
}

function CopyRow({ label, value, isCopied, onCopy, theme = "classic-gold" }: CopyRowProps) {
  const isToyStory = theme === "toy-story";
  const isKpop = theme === "k-pop";
  const isPrincess = theme === "princesas";
  const isFootball = theme === "futbol-infantil";

  const rowContainerClass = isToyStory
    ? "flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 sm:p-4 rounded-2xl w-full bg-white border-2 border-sky-300 shadow-xs"
    : isKpop
    ? "flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 sm:p-4 rounded-2xl w-full bg-black/40 border border-pink-400/40 shadow-xs"
    : isPrincess
    ? "flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 sm:p-4 rounded-2xl w-full bg-white border border-pink-200 shadow-xs"
    : isFootball
    ? "flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 sm:p-4 rounded-2xl w-full bg-white border-2 border-emerald-300 shadow-xs"
    : "flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 sm:p-4 rounded-2xl w-full bg-[rgba(197,155,39,0.09)] border-1.5 border-[rgba(197,155,39,0.28)]";

  const labelClass = isToyStory
    ? "text-[11px] font-black uppercase tracking-wider text-blue-700"
    : isKpop
    ? "text-[11px] font-bold uppercase tracking-wider text-pink-300"
    : isPrincess
    ? "text-[11px] font-bold uppercase tracking-wider text-pink-700"
    : isFootball
    ? "text-[11px] font-black uppercase tracking-wider text-emerald-800"
    : "text-[11px] font-bold uppercase tracking-wider text-[var(--gold)]";

  const buttonClass = isCopied
    ? "bg-emerald-600 text-white"
    : isToyStory
    ? "bg-blue-600 hover:bg-blue-700 text-white font-black"
    : isKpop
    ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold"
    : isPrincess
    ? "bg-pink-500 hover:bg-pink-600 text-white font-bold"
    : isFootball
    ? "bg-emerald-600 hover:bg-emerald-700 text-white font-black"
    : "bg-gradient-to-r from-[#C59B27] to-[#D4A373] text-white font-semibold";

  return (
    <div className={rowContainerClass}>
      <div className="flex-1 min-w-0 flex flex-col gap-0.5">
        <p className={labelClass}>{label}</p>
        <p className="font-bold text-sm sm:text-base break-all select-all leading-snug">
          {value}
        </p>
      </div>
      <button
        onClick={onCopy}
        type="button"
        aria-label={isCopied ? `${label} copiado` : `Copiar ${label}`}
        aria-pressed={isCopied}
        className={`shrink-0 self-start sm:self-center flex items-center justify-center gap-2 py-2 px-4 rounded-xl text-xs transition-all duration-200 shadow-xs cursor-pointer ${buttonClass}`}
      >
        {isCopied ? (
          <>
            <Check size={14} aria-hidden="true" />
            <span>¡Copiado!</span>
          </>
        ) : (
          <>
            <Copy size={14} aria-hidden="true" />
            <span>Copiar</span>
          </>
        )}
      </button>
    </div>
  );
}
