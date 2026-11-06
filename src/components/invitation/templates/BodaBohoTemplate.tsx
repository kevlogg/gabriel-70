"use client";

import { useState, useCallback, useEffect } from "react";
import type { InvitationRecord } from "@/lib/schemas/invitation.schema";
import Countdown from "@/components/invitation/Countdown";
import VenueCard from "@/components/invitation/VenueCard";
import GiftCard from "@/components/invitation/GiftCard";
import RsvpForm from "@/components/invitation/RsvpForm";
import AudioController from "@/components/invitation/AudioController";
import PhotoCarousel, { parseCarouselSlides } from "@/components/invitation/PhotoCarousel";
import { Sun, Heart } from "lucide-react";

interface TemplateProps {
  invitation: InvitationRecord;
}

export default function BodaBohoTemplate({ invitation }: TemplateProps) {
  const [isOpened, setIsOpened] = useState(false);
  const [isChestOpened, setIsChestOpened] = useState(false);

  const hasGifts = Boolean(
    invitation.giftAlias?.trim() ||
      invitation.giftCbu?.trim() ||
      (invitation.giftBankName?.trim() &&
        invitation.giftBankName !== "Banco / Billetera Virtual")
  );

  const handleEnvelopeOpen = useCallback(() => {
    setIsOpened(true);
  }, []);

  const handleChestOpen = useCallback(() => {
    setIsChestOpened(true);
  }, []);

  useEffect(() => {
    if (!isOpened) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpened]);

  const venueConfig = {
    name: invitation.venueName,
    address: invitation.venueAddress,
    mapsUrl: invitation.venueMapsUrl || "#",
    googleCalendarUrl: invitation.venueCalendarUrl || "#",
  };

  const giftConfig = {
    bankName: invitation.giftBankName || "Banco / Billetera Virtual",
    alias: invitation.giftAlias || "",
    cbu: invitation.giftCbu || "",
    holderName: invitation.giftHolderName || invitation.personName,
  };

  const canShowRsvp = !hasGifts || isChestOpened;

  return (
    <>
      {/* ─── BOHO SUNSET ENVELOPE MODAL ─── */}
      {!isOpened && (
        <BohoEnvelopeModal
          onOpen={handleEnvelopeOpen}
          personName={invitation.personName}
          headline={invitation.headline}
        />
      )}

      {/* Audio controller */}
      {invitation.audioTrackPath && (
        <AudioController src={invitation.audioTrackPath} isEnabled={isOpened} />
      )}

      {/* ─── MAIN BOHO SUNSET CONTENT ─── */}
      <main
        id="main-content"
        className="min-h-screen w-full flex flex-col items-center justify-start relative overflow-hidden"
        style={{
          background:
            "linear-gradient(180deg, #FDF8F5 0%, #F8EFE9 25%, #F4E5DC 60%, #FDF8F5 100%)",
          color: "#4A2B20",
          opacity: isOpened ? 1 : 0,
          transition: "opacity 0.8s ease 0.3s",
        }}
        aria-label={`Invitación de Boda Boho de ${invitation.personName}`}
      >
        {/* Subtle decorative pampas warm elements background */}
        <div aria-hidden="true" className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
          <PampasIllustration top="5%" left="2%" rotation={20} size={80} />
          <PampasIllustration top="14%" right="3%" rotation={-35} size={95} />
          <PampasIllustration top="32%" left="1%" rotation={45} size={85} />
          <PampasIllustration top="48%" right="2%" rotation={-25} size={90} />
          <PampasIllustration top="66%" left="3%" rotation={30} size={80} />
          <PampasIllustration top="84%" right="4%" rotation={-40} size={75} />
        </div>

        {/* Top Terracotta Ombre Bar */}
        <div
          aria-hidden="true"
          className="w-full h-2.5 shrink-0"
          style={{
            background:
              "linear-gradient(90deg, transparent, #C86D51 25%, #E39B82 50%, #C86D51 75%, transparent)",
          }}
        />

        <div
          className="max-w-3xl w-full mx-auto flex flex-col gap-16 sm:gap-24 md:gap-32 relative z-10"
          style={{
            paddingLeft: "clamp(1.25rem, 5vw, 3rem)",
            paddingRight: "clamp(1.25rem, 5vw, 3rem)",
            paddingTop: "clamp(2.5rem, 6vw, 5rem)",
            paddingBottom: "clamp(4rem, 8vw, 8rem)",
            boxSizing: "border-box",
          }}
        >
          {/* ─── HERO SECTION ─── */}
          <section
            aria-labelledby="hero-headline"
            className="flex flex-col items-center gap-6 sm:gap-8 text-center py-4 md:py-8"
          >
            {/* Top boho ornament */}
            <div
              aria-hidden="true"
              className="flex items-center gap-3 text-[#C86D51]"
            >
              <span className="text-xl">🌾</span>
              <span
                className="font-serif italic font-semibold text-sm sm:text-base tracking-[0.25em] uppercase text-[#A8583E]"
              >
                Boda Boho Chic · Atardecer
              </span>
              <span className="text-xl">🌾</span>
            </div>

            {/* Date badge */}
            {invitation.badgeText && (
              <div
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 sm:px-7 sm:py-3 rounded-full shadow-sm max-w-full text-center"
                style={{
                  background: "rgba(255, 255, 255, 0.85)",
                  border: "1.5px solid rgba(200, 109, 81, 0.35)",
                  backdropFilter: "blur(6px)",
                }}
              >
                <span
                  className="font-sans font-bold text-[11px] sm:text-xs tracking-wider uppercase text-[#8C3D26]"
                >
                  {invitation.badgeText}
                </span>
              </div>
            )}

            {/* Main Headline */}
            <h1
              id="hero-headline"
              className="font-serif font-normal text-balance"
              style={{
                fontSize: "clamp(2.75rem, 8.5vw, 5.5rem)",
                color: "#6D2B19",
                lineHeight: 1.1,
                letterSpacing: "-0.01em",
              }}
            >
              {invitation.headline}
            </h1>

            {/* Warm heart divider */}
            <div className="flex items-center gap-3 my-1 text-[#C86D51]">
              <div className="w-12 h-px bg-[#C86D51]/40" />
              <Heart size={20} className="fill-[#C86D51]/20 text-[#C86D51]" />
              <div className="w-12 h-px bg-[#C86D51]/40" />
            </div>

            {/* Subheadline / Dedication */}
            <p
              className="font-serif italic"
              style={{
                fontSize: "clamp(1.15rem, 2.8vw, 1.5rem)",
                color: "#8C3D26",
                maxWidth: "38ch",
                lineHeight: 1.6,
              }}
            >
              {invitation.subheadline ||
                "Amor libre, risas eternas y el comienzo de nuestra mayor aventura juntos."}
            </p>

            {/* Scroll Down Cue */}
            <a
              href="#historia"
              aria-label="Ver nuestra historia"
              className="flex flex-col items-center gap-1.5 mt-4 text-[#A8583E] opacity-75 hover:opacity-100 transition-opacity"
            >
              <span className="font-sans text-[11px] font-bold tracking-widest uppercase">
                Descubrí los detalles
              </span>
              <span className="text-lg animate-bounce">↓</span>
            </a>
          </section>

          {/* ─── CAROUSEL SECTION: NUESTRA HISTORIA ─── */}
          <section
            id="historia"
            aria-labelledby="historia-heading"
            className="flex flex-col gap-6"
          >
            <BohoSectionHeading
              id="historia-heading"
              icon="🌾"
              title="Nuestra Historia de Amor"
              subtitle="Tres momentos mágicos que sellaron nuestro destino"
            />
            <PhotoCarousel
              slides={parseCarouselSlides(invitation.carouselImages)}
              theme="boda-boho"
              title="Momentos Únicos"
              subtitle="Bajo el sol y las estrellas, nuestro amor crece cada día"
            />
          </section>

          {/* ─── COUNTDOWN SECTION ─── */}
          <section
            id="countdown"
            aria-labelledby="countdown-heading"
            className="flex flex-col items-center gap-8"
          >
            <BohoSectionHeading
              id="countdown-heading"
              icon="⏳"
              title="Cuenta Regresiva"
              subtitle="Contando los días para bailar juntos hasta el amanecer"
            />
            <Countdown targetDate={invitation.targetDate} theme="boda-boho" />
          </section>

          {/* ─── VENUE SECTION ─── */}
          <section
            id="venue"
            aria-labelledby="venue-heading"
            className="flex flex-col gap-8"
          >
            <BohoSectionHeading
              id="venue-heading"
              icon="⛺"
              title="El Lugar del Encuentro"
              subtitle="Dónde celebraremos al atardecer y cómo llegar"
            />
            <VenueCard
              venue={venueConfig}
              targetDate={invitation.targetDate}
              badgeText={invitation.badgeText}
              slug={invitation.slug}
              theme="boda-boho"
            />
          </section>

          {/* ─── GIFT SECTION (IF CONFIGURED) ─── */}
          {hasGifts && (
            <section
              id="regalos"
              aria-labelledby="gift-heading"
              className="flex flex-col gap-8"
            >
              <BohoSectionHeading
                id="gift-heading"
                icon="✨"
                title="Aventura & Luna de Miel"
                subtitle="Tu presencia es lo más importante. Si deseás regalarnos una experiencia de viaje..."
              />
              <GiftCard
                gift={giftConfig}
                onChestOpen={handleChestOpen}
                theme="boda-boho"
              />
            </section>
          )}

          {/* ─── RSVP SECTION ─── */}
          {canShowRsvp ? (
            <section
              id="rsvp"
              aria-labelledby="rsvp-heading"
              className="flex flex-col gap-8"
            >
              <BohoSectionHeading
                id="rsvp-heading"
                icon="💌"
                title="Confirmá tu Presencia"
                subtitle="Avisanos con tiempo para esperarte con tu copa lista"
              />
              <RsvpForm
                invitationSlug={invitation.slug}
                personName={invitation.personName}
                allowCompanions={invitation.allowCompanions}
                allowDietary={invitation.allowDietary}
                theme="boda-boho"
              />
            </section>
          ) : (
            <section className="p-8 rounded-3xl bg-white/70 border border-[#C86D51]/20 text-center shadow-sm">
              <p className="font-serif italic text-base text-[#8C3D26]">
                Descubrí los datos de Luna de Miel arriba para confirmar tu asistencia.
              </p>
            </section>
          )}

          {/* ─── BOHO CLOSING FOOTER ─── */}
          <footer className="text-center py-10 flex flex-col items-center gap-4 border-t border-[#C86D51]/20">
            <span className="text-2xl">🌾 ☀️ 🌾</span>
            <p className="font-serif italic text-lg text-[#6D2B19] max-w-md">
              «Bailar bajo las estrellas y celebrar el amor con quienes más queremos.»
            </p>
            <p className="font-sans text-xs uppercase tracking-widest text-[#A8583E] font-bold">
              ¡Los esperamos para vivir una noche inolvidable!
            </p>
          </footer>
        </div>
      </main>
    </>
  );
}

// ─── BOHO SECTION HEADING ───
function BohoSectionHeading({
  id,
  icon,
  title,
  subtitle,
}: {
  id: string;
  icon: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="flex flex-col items-center text-center gap-2">
      <span className="text-2xl sm:text-3xl" aria-hidden="true">
        {icon}
      </span>
      <h2
        id={id}
        className="font-serif text-2xl sm:text-3xl md:text-4xl font-normal text-[#6D2B19]"
      >
        {title}
      </h2>
      {subtitle && (
        <p className="text-xs sm:text-sm text-[#A8583E] max-w-md font-sans">
          {subtitle}
        </p>
      )}
      <div className="w-16 h-0.5 bg-[#C86D51]/35 rounded-full mt-1" />
    </div>
  );
}

// ─── PAMPAS SVG DECORATION ───
function PampasIllustration({
  top,
  left,
  right,
  rotation,
  size,
}: {
  top: string;
  left?: string;
  right?: string;
  rotation: number;
  size: number;
}) {
  return (
    <div
      style={{
        position: "absolute",
        top,
        left,
        right,
        transform: `rotate(${rotation}deg)`,
        width: `${size}px`,
        height: `${size}px`,
      }}
    >
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M50 90 Q48 50 50 10"
          stroke="#C86D51"
          strokeWidth="1.5"
          strokeOpacity="0.4"
        />
        <path
          d="M50 60 Q35 45 30 30"
          stroke="#A8583E"
          strokeWidth="1"
          strokeOpacity="0.3"
        />
        <path
          d="M50 50 Q65 35 70 20"
          stroke="#A8583E"
          strokeWidth="1"
          strokeOpacity="0.3"
        />
        <path
          d="M50 35 Q40 25 38 15"
          stroke="#A8583E"
          strokeWidth="1"
          strokeOpacity="0.3"
        />
        <circle cx="50" cy="10" r="3" fill="#C86D51" fillOpacity="0.3" />
      </svg>
    </div>
  );
}

// ─── BOHO ENVELOPE MODAL ───
function BohoEnvelopeModal({
  onOpen,
  personName,
  headline,
}: {
  onOpen: () => void;
  personName: string;
  headline: string;
}) {
  const [isOpening, setIsOpening] = useState(false);
  const [isGone, setIsGone] = useState(false);

  const handleOpen = () => {
    if (isOpening) return;
    setIsOpening(true);
    setTimeout(() => {
      setIsGone(true);
      onOpen();
    }, 850);
  };

  if (isGone) return null;

  return (
    <div
      role="dialog"
      aria-label="Invitación de Boda Boho Chic. Tocá para abrir."
      className="fixed inset-0 z-50 flex flex-col items-center justify-center p-4"
      style={{
        background:
          "radial-gradient(ellipse at center, #FDF8F5 0%, #F5E5DC 50%, #D8A594 100%)",
        opacity: isOpening ? 0 : 1,
        transform: isOpening ? "scale(0.92)" : "scale(1)",
        transition: "opacity 0.8s ease, transform 0.8s ease",
      }}
    >
      {/* Decorative warm sun/pampas particles */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none overflow-hidden"
      >
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              width: `${5 + (i % 4) * 3}px`,
              height: `${5 + (i % 4) * 3}px`,
              background: "rgba(200, 109, 81, 0.25)",
              top: `${14 + i * 8}%`,
              left: `${9 + i * 9}%`,
              animation: `float ${4 + (i % 3)}s ease-in-out infinite`,
              animationDelay: `${i * 0.35}s`,
            }}
          />
        ))}
      </div>

      <button
        onClick={handleOpen}
        aria-label="Abrir invitación de boda boho"
        className="group relative flex flex-col items-center gap-6 cursor-pointer border-none bg-transparent p-4 max-w-sm sm:max-w-md w-full"
      >
        {/* Envelope Paper Container */}
        <div
          className="relative w-full max-w-sm sm:max-w-md min-h-[310px] rounded-3xl bg-[#FAF1EC] border-2 border-[#C86D51]/35 shadow-[0_25px_60px_rgba(200,109,81,0.25)] flex flex-col items-center justify-between p-6 sm:p-8 text-center transform transition-transform group-hover:scale-[1.02] duration-300"
          style={{
            backgroundImage:
              "radial-gradient(circle at 50% 10%, rgba(200,109,81,0.08), transparent 70%)",
          }}
        >
          {/* Header block with badge, subtitle and headline */}
          <div className="flex flex-col items-center gap-2 w-full pt-1">
            <div className="inline-flex items-center gap-2 text-xs font-serif text-[#8C3D26] uppercase tracking-[0.2em] font-semibold bg-[#F5E5DC] border border-[#C86D51]/30 px-4 py-1.5 rounded-full shadow-xs">
              <span>🌾</span>
              <span>Boda Boho Chic</span>
              <span>🌾</span>
            </div>

            <div className="text-xs font-sans uppercase tracking-[0.2em] text-[#A8583E] font-bold mt-1">
              Invitación de Boda
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl text-[#6D2B19] leading-tight font-normal">
              {headline}
            </h2>

            <p className="text-xs font-serif italic text-[#8C3D26] max-w-[28ch] mt-1">
              Queremos celebrar nuestro amor rodeados de las personas más queridas
            </p>
          </div>

          {/* Terracotta Sun seal button */}
          <div className="my-3 relative flex items-center justify-center shrink-0">
            <div className="w-16 h-16 rounded-full bg-[#B2593F] border-2 border-[#FADCD1] shadow-xl flex flex-col items-center justify-center text-white transform group-hover:scale-110 transition-transform duration-300">
              <span className="text-xl">🌾</span>
            </div>
          </div>

          {/* Footer CTA */}
          <span className="text-[11px] font-sans font-bold text-[#8C3D26] uppercase tracking-wider">
            Tocá el sello para abrir ✉️
          </span>
        </div>
      </button>
    </div>
  );
}
