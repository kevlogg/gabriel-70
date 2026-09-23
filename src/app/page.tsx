"use client";

import { useState, useCallback } from "react";
import { EVENT_DATA } from "@/config/event";
import EnvelopeModal from "@/components/invitation/EnvelopeModal";
import Countdown from "@/components/invitation/Countdown";
import VenueCard from "@/components/invitation/VenueCard";
import GiftCard from "@/components/invitation/GiftCard";
import RsvpForm from "@/components/invitation/RsvpForm";
import AudioController from "@/components/invitation/AudioController";

export default function InvitationPage() {
  const [isOpened, setIsOpened] = useState(false);
  const [isChestOpened, setIsChestOpened] = useState(false);

  const handleEnvelopeOpen = useCallback(() => {
    setIsOpened(true);
    document.body.style.overflow = "auto";
  }, []);

  const handleChestOpen = useCallback(() => {
    setIsChestOpened(true);
  }, []);

  // Lock scroll until envelope is opened
  if (!isOpened && typeof document !== "undefined") {
    document.body.style.overflow = "hidden";
  }

  return (
    <>
      {/* Envelope overlay */}
      {!isOpened && <EnvelopeModal onOpen={handleEnvelopeOpen} />}

      {/* Audio controller — only after opened */}
      <AudioController src={EVENT_DATA.audioTrackPath} isEnabled={isOpened} />

      {/* Main invitation content */}
      <main
        id="main-content"
        className="min-h-screen w-full flex flex-col items-center justify-start"
        style={{
          background:
            "linear-gradient(180deg, #FDFBF7 0%, #FAF5EE 40%, #F5EDD9 80%, #FDFBF7 100%)",
          opacity: isOpened ? 1 : 0,
          transition: "opacity 0.8s ease 0.3s",
        }}
        aria-label="Invitación de cumpleaños"
      >
        {/* ─── Decorative Top Flourish ─────────────────────── */}
        <div
          aria-hidden="true"
          className="w-full h-2 shrink-0"
          style={{
            background:
              "linear-gradient(90deg, transparent, #C59B27 30%, #D4A373 50%, #C59B27 70%, transparent)",
          }}
        />

        <div
          className="max-w-3xl w-full mx-auto flex flex-col gap-20 sm:gap-28 md:gap-36"
          style={{
            paddingLeft: "clamp(1.25rem, 5vw, 3rem)",
            paddingRight: "clamp(1.25rem, 5vw, 3rem)",
            paddingTop: "clamp(3rem, 6vw, 6rem)",
            paddingBottom: "clamp(4rem, 8vw, 8rem)",
            boxSizing: "border-box",
          }}
        >

          {/* ─── HERO SECTION ────────────────────────────────── */}
          <section
            aria-labelledby="hero-headline"
            className="flex flex-col items-center gap-8 sm:gap-10 md:gap-12 text-center py-6 md:py-12"
          >
            {/* Decorative ornament */}
            <div
              aria-hidden="true"
              className="flex items-center gap-4"
              style={{ color: "var(--gold)", opacity: 0.85 }}
            >
              <span style={{ fontSize: "1.75rem" }}>✦</span>
              <span className="font-cormorant italic font-semibold" style={{ fontSize: "1.1rem", letterSpacing: "0.25em" }}>
                CELEBRACIÓN ESPECIAL
              </span>
              <span style={{ fontSize: "1.75rem" }}>✦</span>
            </div>

            {/* Name badge */}
            <div
              className="inline-flex items-center justify-center gap-3 px-6 sm:px-8 py-3.5 rounded-full animate-slide-down shadow-sm max-w-full text-center"
              style={{
                background: "linear-gradient(135deg, rgba(197,155,39,0.18), rgba(212,163,115,0.18))",
                border: "1.5px solid rgba(197,155,39,0.45)",
              }}
            >
              <span
                className="font-jakarta font-semibold text-xs sm:text-sm"
                style={{
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: "var(--gold)",
                  lineHeight: 1.4,
                }}
              >
                Sábado · 14 de Noviembre · 20:30 hs
              </span>
            </div>

            {/* Main headline */}
            <h1
              id="hero-headline"
              className="font-cormorant animate-slide-up delay-100"
              style={{
                fontSize: "clamp(3.5rem, 11vw, 6.5rem)",
                fontWeight: 700,
                color: "var(--dark-brown)",
                lineHeight: 1.05,
                letterSpacing: "-0.015em",
              }}
            >
              {EVENT_DATA.headline}
            </h1>

            {/* Decorative "70" */}
            <div
              aria-hidden="true"
              className="font-cormorant animate-slide-up delay-200 my-2"
              style={{
                fontSize: "clamp(6rem, 22vw, 12rem)",
                fontWeight: 700,
                lineHeight: 0.85,
                background: "linear-gradient(135deg, #C59B27 0%, #D4A373 50%, #C59B27 100%)",
                backgroundSize: "200% auto",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                animation: "shimmer 4s linear infinite, slideUp 0.7s ease forwards 0.2s",
                filter: "drop-shadow(0 10px 30px rgba(197,155,39,0.25))",
              }}
            >
              70
            </div>

            <p
              className="font-cormorant italic animate-slide-up delay-300"
              style={{
                fontSize: "clamp(1.25rem, 3vw, 1.75rem)",
                color: "var(--dark-brown-70)",
                maxWidth: "40ch",
                lineHeight: 1.6,
              }}
            >
              {EVENT_DATA.subheadline}
            </p>

            {/* Scroll hint */}
            <a
              href="#countdown"
              aria-label="Ver cuenta regresiva"
              className="flex flex-col items-center gap-2 mt-8 opacity-60 hover:opacity-100 transition-all duration-300 animate-slide-up delay-500"
              style={{ color: "var(--dark-brown)" }}
            >
              <span className="font-jakarta text-xs font-semibold tracking-widest uppercase">Descubrí más</span>
              <span style={{ fontSize: "1.25rem", animation: "float 2s ease-in-out infinite" }}>↓</span>
            </a>
          </section>

          {/* ─── ORNAMENT DIVIDER ─────────────────────────────── */}
          <OrnamentDivider />

          {/* ─── COUNTDOWN SECTION ───────────────────────────── */}
          <section
            id="countdown"
            aria-labelledby="countdown-heading"
            className="flex flex-col items-center gap-10 animate-slide-up delay-200"
          >
            <SectionHeading id="countdown-heading" emoji="🎊" title="La cuenta regresiva" centered />
            <Countdown targetDate={EVENT_DATA.targetDate} />
          </section>

          <OrnamentDivider />

          {/* ─── VENUE SECTION ───────────────────────────────── */}
          <section
            id="venue"
            aria-labelledby="venue-heading"
            className="flex flex-col gap-8 animate-slide-up delay-200"
          >
            <SectionHeading id="venue-heading" emoji="📍" title="¿Dónde se festeja?" centered />
            <VenueCard venue={EVENT_DATA.venue} />
          </section>

          <OrnamentDivider />

          {/* ─── GIFT SECTION ────────────────────────────────── */}
          <section
            id="regalos"
            aria-labelledby="gift-heading"
            className="flex flex-col gap-8 animate-slide-up delay-200"
          >
            <SectionHeading id="gift-heading" emoji="🎁" title="Mesa de Regalos" centered />
            <GiftCard gift={EVENT_DATA.gift} onChestOpen={handleChestOpen} />
          </section>

          {/* ─── RSVP SECTION (LOCKED UNTIL CHEST IS OPENED) ─── */}
          {isChestOpened ? (
            <>
              <OrnamentDivider />
              <section
                id="rsvp"
                aria-labelledby="rsvp-heading"
                className="flex flex-col gap-8 animate-slide-up"
              >
                <SectionHeading id="rsvp-heading" emoji="✉️" title="Confirmación de Asistencia" centered />
                <RsvpForm />
              </section>

              <OrnamentDivider />

              {/* ─── FOOTER ──────────────────────────────────────── */}
              <footer className="flex flex-col items-center gap-4 text-center py-12 animate-slide-up" role="contentinfo">
                <p
                  className="font-cormorant italic"
                  style={{
                    fontSize: "clamp(1.5rem, 3.5vw, 2.25rem)",
                    color: "var(--gold)",
                    fontWeight: 600,
                  }}
                >
                  ¡Te esperamos con los brazos abiertos para brindar juntos! 🥂
                </p>
                <p
                  className="font-jakarta text-xs uppercase tracking-widest font-medium"
                  style={{ color: "var(--dark-brown-40)", letterSpacing: "0.15em" }}
                >
                  Con todo el amor · {new Date(EVENT_DATA.targetDate).getFullYear()}
                </p>
              </footer>
            </>
          ) : (
            <div className="flex flex-col items-center text-center p-6 sm:p-8 rounded-3xl border-2 border-dashed border-[rgba(197,155,39,0.35)] bg-[rgba(197,155,39,0.06)] animate-pulse gap-2 my-4">
              <span className="text-3xl" role="img" aria-label="Candado">🔒</span>
              <p className="font-jakarta font-semibold text-xs sm:text-sm text-[var(--dark-brown)]">
                Tocá el cofre en la sección anterior para abrirlo y desbloquear la confirmación de asistencia
              </p>
            </div>
          )}
        </div>

        {/* ─── Bottom flourish ──────────────────────────────── */}
        <div
          aria-hidden="true"
          className="w-full h-2.5"
          style={{
            background:
              "linear-gradient(90deg, transparent, #C59B27 30%, #D4A373 50%, #C59B27 70%, transparent)",
          }}
        />
      </main>
    </>
  );
}

function OrnamentDivider() {
  return (
    <div
      aria-hidden="true"
      className="ornament-divider"
    >
      <span className="font-cormorant text-2xl">✦</span>
    </div>
  );
}

interface SectionHeadingProps {
  id: string;
  emoji: string;
  title: string;
  centered?: boolean;
}

function SectionHeading({ id, emoji, title, centered = false }: SectionHeadingProps) {
  return (
    <h2
      id={id}
      className={`font-cormorant ${centered ? "text-center" : ""}`}
      style={{
        fontSize: "clamp(2rem, 5vw, 3rem)",
        fontWeight: 600,
        color: "var(--dark-brown)",
        display: "flex",
        alignItems: "center",
        justifyContent: centered ? "center" : "flex-start",
        gap: "0.75rem",
      }}
    >
      <span aria-hidden="true" style={{ fontSize: "0.9em" }}>{emoji}</span>
      {title}
    </h2>
  );
}
