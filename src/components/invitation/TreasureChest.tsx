"use client";

import { useState, useCallback } from "react";
import { Copy, Check, Gift } from "lucide-react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import type { GiftConfig } from "@/config/event";

interface TreasureChestProps {
  gift: GiftConfig;
}

type CopyField = "alias" | "cbu" | null;

export default function TreasureChest({ gift }: TreasureChestProps) {
  const [copied, setCopied] = useState<CopyField>(null);

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
      className="glass-card flex flex-col items-center gap-6 sm:gap-8 w-full"
      style={{
        padding: "clamp(1.75rem, 5vw, 3rem)",
        boxSizing: "border-box",
      }}
    >
      {/* Header */}
      <div className="flex flex-col items-center text-center gap-2 max-w-lg w-full">
        <span
          className="font-jakarta text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full inline-block mb-1"
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

      {/* Lottie Animation Display */}
      <div className="relative w-full flex flex-col items-center justify-center py-2">
        <div
          aria-hidden="true"
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{
            background: "radial-gradient(circle, rgba(197,155,39,0.25) 0%, rgba(212,163,115,0.1) 50%, transparent 70%)",
            filter: "blur(25px)",
            transform: "scale(1.1)",
          }}
        />

        <div className="relative z-10 w-full max-w-[280px] sm:max-w-[320px] flex justify-center">
          <DotLottieReact
            src="/treasure-chest.lottie"
            loop
            autoplay
            style={{ width: "100%", height: "auto" }}
          />
        </div>
      </div>

      <div
        aria-hidden="true"
        className="w-full"
        style={{
          height: "1px",
          background: "linear-gradient(to right, transparent, rgba(197,155,39,0.35), transparent)",
        }}
      />

      {/* Bank Info Container */}
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
