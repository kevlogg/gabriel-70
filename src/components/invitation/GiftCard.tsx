"use client";

import { useState, useCallback } from "react";
import { Copy, Check, Gift } from "lucide-react";
import type { GiftConfig } from "@/config/event";

interface GiftCardProps {
  gift: GiftConfig;
}

type CopyField = "alias" | "cbu" | null;

export default function GiftCard({ gift }: GiftCardProps) {
  const [copied, setCopied] = useState<CopyField>(null);

  const handleCopy = useCallback(
    async (text: string, field: NonNullable<CopyField>) => {
      try {
        await navigator.clipboard.writeText(text);
        setCopied(field);
        setTimeout(() => setCopied(null), 2200);
      } catch {
        // Fallback for environments without clipboard API
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
    <div className="glass-card p-6 sm:p-10 md:p-12 flex flex-col gap-6 sm:gap-8">
      {/* Header */}
      <div className="flex items-center gap-4 sm:gap-6">
        <div
          className="shrink-0 w-12 h-12 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center shadow-md"
          style={{ background: "linear-gradient(135deg, #C59B27, #D4A373)" }}
          aria-hidden="true"
        >
          <Gift size={26} color="#fff" />
        </div>
        <div className="flex flex-col gap-1">
          <h3
            className="font-cormorant"
            style={{
              fontSize: "clamp(1.75rem, 3.5vw, 2.25rem)",
              fontWeight: 600,
              color: "var(--dark-brown)",
              lineHeight: 1.15,
            }}
          >
            Regalos
          </h3>
          <p
            className="font-jakarta text-sm sm:text-base"
            style={{ color: "var(--dark-brown-70)", lineHeight: 1.5 }}
          >
            El mejor regalo es tu presencia. Pero si deseás hacernos un
            presente...
          </p>
        </div>
      </div>

      <div
        aria-hidden="true"
        style={{
          height: "1px",
          background:
            "linear-gradient(to right, transparent, rgba(197,155,39,0.35), transparent)",
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
      className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 rounded-2xl p-5 sm:px-7 sm:py-5 w-full"
      style={{
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
        className="shrink-0 self-start sm:self-center flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 sm:px-5 sm:py-3 font-jakarta font-semibold transition-all duration-200 shadow-sm mt-1 sm:mt-0"
        style={{
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
