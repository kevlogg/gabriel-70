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
    <div className="glass-card p-8 md:p-10 flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-start gap-4">
        <div
          className="shrink-0 w-12 h-12 rounded-full flex items-center justify-center"
          style={{ background: "linear-gradient(135deg, #C59B27, #D4A373)" }}
          aria-hidden="true"
        >
          <Gift size={22} color="#fff" />
        </div>
        <div>
          <h3
            className="font-cormorant"
            style={{
              fontSize: "clamp(1.4rem, 2.5vw, 1.75rem)",
              fontWeight: 600,
              color: "var(--dark-brown)",
            }}
          >
            Regalos
          </h3>
          <p
            className="font-jakarta mt-1"
            style={{ fontSize: "0.9rem", color: "var(--dark-brown-70)" }}
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
            "linear-gradient(to right, transparent, var(--gold-pale), transparent)",
        }}
      />

      {/* Bank name */}
      <p
        className="font-jakarta text-center text-sm font-semibold tracking-widest uppercase"
        style={{ color: "var(--dark-brown-40)", letterSpacing: "0.15em" }}
      >
        {gift.bankName}
      </p>
      <p
        className="font-cormorant text-center"
        style={{
          fontSize: "clamp(1rem, 2vw, 1.2rem)",
          color: "var(--dark-brown-70)",
          fontStyle: "italic",
        }}
      >
        Titular: {gift.holderName}
      </p>

      {/* Copy fields */}
      <div className="flex flex-col gap-3">
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
      className="flex items-center justify-between gap-3 rounded-xl px-4 py-3"
      style={{
        background: "rgba(197,155,39,0.07)",
        border: "1px solid rgba(197,155,39,0.2)",
      }}
    >
      <div className="flex-1 min-w-0">
        <p
          className="font-jakarta font-semibold"
          style={{ fontSize: "0.7rem", color: "var(--gold)", letterSpacing: "0.1em", textTransform: "uppercase" }}
        >
          {label}
        </p>
        <p
          className="font-jakarta font-medium truncate"
          style={{ fontSize: "0.95rem", color: "var(--dark-brown)" }}
        >
          {value}
        </p>
      </div>
      <button
        onClick={onCopy}
        aria-label={isCopied ? `${label} copiado` : `Copiar ${label}`}
        aria-pressed={isCopied}
        className="shrink-0 flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-jakarta font-semibold transition-all duration-200"
        style={{
          fontSize: "0.8rem",
          background: isCopied ? "#16a34a" : "linear-gradient(135deg, #C59B27, #D4A373)",
          color: "#fff",
          border: "none",
          cursor: "pointer",
          transform: isCopied ? "scale(1.05)" : "scale(1)",
        }}
      >
        {isCopied ? (
          <>
            <Check size={13} aria-hidden="true" /> ¡Copiado!
          </>
        ) : (
          <>
            <Copy size={13} aria-hidden="true" /> Copiar
          </>
        )}
      </button>
    </div>
  );
}
