"use client";

import { useState, useCallback } from "react";
import { EVENT_DATA } from "@/config/event";

interface EnvelopeModalProps {
  onOpen: () => void;
}

export default function EnvelopeModal({ onOpen }: EnvelopeModalProps) {
  const [isOpening, setIsOpening] = useState(false);
  const [isGone, setIsGone] = useState(false);

  const handleOpen = useCallback(() => {
    if (isOpening) return;
    setIsOpening(true);

    setTimeout(() => {
      setIsGone(true);
      onOpen();
    }, 900);
  }, [isOpening, onOpen]);

  if (isGone) return null;

  return (
    <div
      role="dialog"
      aria-label="Invitación de cumpleaños. Hacé clic para abrir."
      aria-modal="true"
      className="fixed inset-0 z-50 flex flex-col items-center justify-center"
      style={{
        background:
          "radial-gradient(ellipse at 50% 40%, #F5EDD9 0%, #EDD9A3 40%, #C59B27 100%)",
        opacity: isOpening ? 0 : 1,
        transform: isOpening ? "scale(0.9)" : "scale(1)",
        transition: "opacity 0.8s ease, transform 0.8s ease",
      }}
    >
      {/* Decorative gold particles */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none overflow-hidden"
      >
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              width: `${4 + (i % 5) * 3}px`,
              height: `${4 + (i % 5) * 3}px`,
              background: `rgba(197,155,39,${0.15 + (i % 4) * 0.1})`,
              top: `${10 + i * 7}%`,
              left: `${5 + i * 8}%`,
              animation: `float ${3 + (i % 3)}s ease-in-out infinite`,
              animationDelay: `${i * 0.3}s`,
            }}
          />
        ))}
      </div>

      {/* Envelope wrapper */}
      <button
        onClick={handleOpen}
        aria-label="Abrir invitación"
        className="group relative flex flex-col items-center gap-8 cursor-pointer border-none bg-transparent p-4"
        style={{ perspective: "1000px" }}
      >
        {/* Envelope SVG */}
        <div
          className="relative"
          style={{
            width: "min(380px, 85vw)",
            filter: "drop-shadow(0 25px 50px rgba(139,69,19,0.38))",
            animation: "float 4s ease-in-out infinite",
          }}
        >
          <svg
            viewBox="0 0 320 220"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            {/* Envelope body */}
            <rect x="0" y="40" width="320" height="180" rx="12" fill="#FDFBF7" />
            <rect
              x="0"
              y="40"
              width="320"
              height="180"
              rx="12"
              stroke="#C59B27"
              strokeWidth="2"
            />

            {/* Envelope bottom fold lines */}
            <path d="M0 220 L160 130 L320 220" fill="#FAF5EE" stroke="#C59B27" strokeWidth="1.5" />
            <path d="M0 40 L120 130" stroke="#EDD9A3" strokeWidth="1" />
            <path d="M320 40 L200 130" stroke="#EDD9A3" strokeWidth="1" />

            {/* Lid */}
            <g
              style={{
                transformOrigin: "160px 40px",
                transformBox: "fill-box",
                animation: isOpening
                  ? "envelopeLidOpen 0.7s ease forwards"
                  : undefined,
              }}
            >
              <path
                d="M0 40 L160 140 L320 40"
                fill="#FAF0D0"
                stroke="#C59B27"
                strokeWidth="2"
              />
            </g>

            {/* Wax seal */}
            <circle cx="160" cy="130" r="28" fill="#8B4513" />
            <circle cx="160" cy="130" r="23" fill="#A0522D" />
            <circle cx="160" cy="130" r="18" fill="none" stroke="#C59B27" strokeWidth="1.5" />
            <text
              x="160"
              y="135"
              textAnchor="middle"
              fontSize="11"
              fontWeight="700"
              fill="#EDD9A3"
              fontFamily="Georgia, serif"
              letterSpacing="1"
            >
              70
            </text>
          </svg>
        </div>

        {/* Call to action text */}
        <div className="flex flex-col items-center gap-3 text-center pt-2">
          <p
            className="font-cormorant font-semibold"
            style={{
              fontSize: "clamp(1.6rem, 4.5vw, 2.25rem)",
              color: "#2B2118",
              letterSpacing: "0.02em",
            }}
          >
            {EVENT_DATA.personName} te invita
          </p>
          <span
            className="btn-terracotta animate-wax-pulse py-4 px-8 text-base font-semibold shadow-lg"
            style={{ pointerEvents: "none" }}
          >
            ✉ Abrir invitación
          </span>
          <p
            className="font-jakarta text-xs uppercase tracking-widest font-semibold opacity-60 mt-1"
            style={{ color: "#2B2118" }}
          >
            Hacé clic en el sobre para continuar
          </p>
        </div>
      </button>
    </div>
  );
}
