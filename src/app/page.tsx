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

  const handleEnvelopeOpen = useCallback(() => {
    setIsOpened(true);
    document.body.style.overflow = "auto";
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
        className="min-h-screen"
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
          className="w-full h-2"
          style={{
            background:
              "linear-gradient(90deg, transparent, #C59B27 30%, #D4A373 50%, #C59B27 70%, transparent)",
          }}
        />

        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-16 flex flex-col gap-20">

          {/* ─── HERO SECTION ────────────────────────────────── */}
          <section
            aria-labelledby="hero-headline"
            className="flex flex-col items-center gap-6 text-center"
          >
            {/* Decorative ornament */}
            <div
              aria-hidden="true"
              className="flex items-center gap-3"
              style={{ color: "var(--gold)", opacity: 0.7 }}
            >
              <span style={{ fontSize: "1.5rem" }}>✦</span>
              <span className="font-cormorant italic" style={{ fontSize: "1rem", letterSpacing: "0.2em" }}>
                CELEBRACIÓN ESPECIAL
              </span>
              <span style={{ fontSize: "1.5rem" }}>✦</span>
            </div>

            {/* Name badge */}
            <div
              className="inline-flex items-center gap-3 px-6 py-2 rounded-full animate-slide-down"
              style={{
                background: "linear-gradient(135deg, rgba(197,155,39,0.15), rgba(212,163,115,0.15))",
                border: "1px solid rgba(197,155,39,0.4)",
              }}
            >
              <span
                className="font-jakarta font-semibold"
                style={{
                  fontSize: "0.8rem",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: "var(--gold)",
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
                fontSize: "clamp(3rem, 10vw, 5.5rem)",
                fontWeight: 700,
                color: "var(--dark-brown)",
                lineHeight: 1.1,
                letterSpacing: "-0.01em",
              }}
            >
              {EVENT_DATA.headline}
            </h1>

            {/* Decorative "70" */}
            <div
              aria-hidden="true"
              className="font-cormorant animate-slide-up delay-200"
              style={{
                fontSize: "clamp(5rem, 18vw, 10rem)",
                fontWeight: 700,
                lineHeight: 0.9,
                background: "linear-gradient(135deg, #C59B27 0%, #D4A373 50%, #C59B27 100%)",
                backgroundSize: "200% auto",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                animation: "shimmer 4s linear infinite, slideUp 0.7s ease forwards 0.2s",
              }}
            >
              70
            </div>

            <p
              className="font-cormorant italic animate-slide-up delay-300"
              style={{
                fontSize: "clamp(1.1rem, 2.5vw, 1.5rem)",
                color: "var(--dark-brown-70)",
                maxWidth: "36ch",
                lineHeight: 1.5,
              }}
            >
              {EVENT_DATA.subheadline}
            </p>

            {/* Scroll hint */}
            <a
              href="#countdown"
              aria-label="Ver cuenta regresiva"
              className="flex flex-col items-center gap-1 mt-4 opacity-50 hover:opacity-100 transition-opacity animate-slide-up delay-500"
              style={{ color: "var(--dark-brown)" }}
            >
              <span className="font-jakarta text-xs tracking-widest uppercase">Descubrí</span>
              <span style={{ animation: "float 2s ease-in-out infinite" }}>↓</span>
            </a>
          </section>

          {/* ─── ORNAMENT DIVIDER ─────────────────────────────── */}
          <OrnamentDivider />

          {/* ─── COUNTDOWN SECTION ───────────────────────────── */}
          <section
            id="countdown"
            aria-labelledby="countdown-heading"
            className="flex flex-col items-center gap-8 animate-slide-up delay-200"
          >
            <SectionHeading id="countdown-heading" emoji="🎊" title="La cuenta regresiva" />
            <Countdown targetDate={EVENT_DATA.targetDate} />
          </section>

          <OrnamentDivider />

          {/* ─── VENUE SECTION ───────────────────────────────── */}
          <section
            id="venue"
            aria-labelledby="venue-heading"
            className="flex flex-col gap-6 animate-slide-up delay-200"
          >
            <SectionHeading id="venue-heading" emoji="📍" title="¿Dónde?" centered />
            <VenueCard venue={EVENT_DATA.venue} />
          </section>

          <OrnamentDivider />

          {/* ─── GIFT SECTION ────────────────────────────────── */}
          <section
            id="regalos"
            aria-labelledby="gift-heading"
            className="flex flex-col gap-6 animate-slide-up delay-200"
          >
            <SectionHeading id="gift-heading" emoji="🎁" title="Regalos" centered />
            <GiftCard gift={EVENT_DATA.gift} />
          </section>

          <OrnamentDivider />

          {/* ─── RSVP SECTION ────────────────────────────────── */}
          <section
            id="rsvp"
            aria-labelledby="rsvp-heading"
            className="flex flex-col gap-6 animate-slide-up delay-200"
          >
            <SectionHeading id="rsvp-heading" emoji="✉️" title="Confirmá tu asistencia" centered />
            <RsvpForm />
          </section>

          <OrnamentDivider />

          {/* ─── FOOTER ──────────────────────────────────────── */}
          <footer className="flex flex-col items-center gap-3 text-center pb-8" role="contentinfo">
            <p
              className="font-cormorant italic"
              style={{
                fontSize: "clamp(1.3rem, 3vw, 1.8rem)",
                color: "var(--gold)",
                fontWeight: 500,
              }}
            >
              ¡Te esperamos con los brazos abiertos! 🥂
            </p>
            <p
              className="font-jakarta text-xs"
              style={{ color: "var(--dark-brown-40)", letterSpacing: "0.05em" }}
            >
              Con todo el amor · {new Date(EVENT_DATA.targetDate).getFullYear()}
            </p>
          </footer>
        </div>

        {/* ─── Bottom flourish ──────────────────────────────── */}
        <div
          aria-hidden="true"
          className="w-full h-2"
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
      <span className="font-cormorant text-xl">✦</span>
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
        fontSize: "clamp(1.8rem, 4vw, 2.5rem)",
        fontWeight: 600,
        color: "var(--dark-brown)",
        display: "flex",
        alignItems: "center",
        justifyContent: centered ? "center" : "flex-start",
        gap: "0.5rem",
      }}
    >
      <span aria-hidden="true">{emoji}</span>
      {title}
    </h2>
  );
}
