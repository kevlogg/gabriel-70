"use client";

import { useState, useCallback, useEffect } from "react";
import type { InvitationRecord } from "@/lib/schemas/invitation.schema";
import Countdown from "@/components/invitation/Countdown";
import VenueCard from "@/components/invitation/VenueCard";
import GiftCard from "@/components/invitation/GiftCard";
import RsvpForm from "@/components/invitation/RsvpForm";
import AudioController from "@/components/invitation/AudioController";
import PhotoCarousel, { parseCarouselSlides } from "@/components/invitation/PhotoCarousel";
import { Sparkles } from "lucide-react";

interface TemplateProps {
  invitation: InvitationRecord;
}

export default function BodaClasicaTemplate({ invitation }: TemplateProps) {
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
      {/* ─── LUXURY BLACK TIE ENVELOPE MODAL ─── */}
      {!isOpened && (
        <ClasicaEnvelopeModal
          onOpen={handleEnvelopeOpen}
          personName={invitation.personName}
          headline={invitation.headline}
        />
      )}

      {/* Audio controller */}
      {invitation.audioTrackPath && (
        <AudioController src={invitation.audioTrackPath} isEnabled={isOpened} />
      )}

      {/* ─── MAIN BLACK TIE LUXURY CONTENT ─── */}
      <main
        id="main-content"
        className="min-h-screen w-full flex flex-col items-center justify-start relative overflow-hidden"
        style={{
          background:
            "linear-gradient(180deg, #0D0D10 0%, #15151A 25%, #181820 60%, #0B0B0E 100%)",
          color: "#FAF5EE",
          opacity: isOpened ? 1 : 0,
          transition: "opacity 0.8s ease 0.3s",
        }}
        aria-label={`Invitación de Boda Clásica de ${invitation.personName}`}
      >
        {/* ─── LUXURY GOLD FILIGREE BACKGROUND DECORATIONS (IMAGES) ─── */}
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none overflow-hidden select-none"
        >
          {/* Top-left gold filigree corner */}
          <img
            src="/images/wedding/gold-filigree.jpg"
            alt=""
            className="absolute -top-14 -left-14 sm:-top-20 sm:-left-20 w-72 sm:w-96 md:w-[460px] max-w-none object-contain pointer-events-none mix-blend-screen opacity-35 transform rotate-6"
          />

          {/* Top-right gold filigree corner */}
          <img
            src="/images/wedding/gold-filigree.jpg"
            alt=""
            className="absolute -top-14 -right-14 sm:-top-20 sm:-right-20 w-72 sm:w-96 md:w-[460px] max-w-none object-contain pointer-events-none mix-blend-screen opacity-35 transform -scale-x-100 -rotate-6"
          />

          {/* Upper-mid left floating filigree */}
          <img
            src="/images/wedding/gold-filigree.jpg"
            alt=""
            className="absolute top-[28%] -left-20 sm:-left-12 w-60 sm:w-80 md:w-96 max-w-none object-contain pointer-events-none mix-blend-screen opacity-25 transform rotate-45"
          />

          {/* Mid-right floating filigree */}
          <img
            src="/images/wedding/gold-filigree.jpg"
            alt=""
            className="absolute top-[52%] -right-20 sm:-right-12 w-60 sm:w-80 md:w-96 max-w-none object-contain pointer-events-none mix-blend-screen opacity-25 transform -scale-x-100 -rotate-30"
          />

          {/* Lower-mid left floating filigree */}
          <img
            src="/images/wedding/gold-filigree.jpg"
            alt=""
            className="absolute top-[74%] -left-16 sm:-left-10 w-56 sm:w-72 md:w-80 max-w-none object-contain pointer-events-none mix-blend-screen opacity-25 transform rotate-15"
          />

          {/* Bottom-right corner */}
          <img
            src="/images/wedding/gold-filigree.jpg"
            alt=""
            className="absolute -bottom-14 -right-14 sm:-bottom-20 sm:-right-20 w-72 sm:w-96 md:w-[440px] max-w-none object-contain pointer-events-none mix-blend-screen opacity-35 transform -scale-x-100 -scale-y-100 -rotate-6"
          />

          {/* Bottom-left corner */}
          <img
            src="/images/wedding/gold-filigree.jpg"
            alt=""
            className="absolute -bottom-14 -left-14 sm:-bottom-20 sm:-left-20 w-72 sm:w-96 md:w-[440px] max-w-none object-contain pointer-events-none mix-blend-screen opacity-35 transform -scale-y-100 rotate-6"
          />
        </div>

        {/* Top Gold Foil Bar */}
        <div
          aria-hidden="true"
          className="w-full h-2 shrink-0"
          style={{
            background:
              "linear-gradient(90deg, transparent, #856d28 20%, #D4AF37 50%, #F5E6C8 60%, #856d28 80%, transparent)",
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
            {/* Top gold monogram ornament */}
            <div
              aria-hidden="true"
              className="flex items-center gap-4 text-[#D4AF37]"
            >
              <span className="text-sm tracking-[0.35em] uppercase font-serif font-light text-[#D4AF37]">
                ✦ BLACK TIE · NUESTRA BODA ✦
              </span>
            </div>

            {/* Date badge */}
            {invitation.badgeText && (
              <div
                className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full shadow-lg max-w-full text-center"
                style={{
                  background: "rgba(212, 175, 55, 0.08)",
                  border: "1px solid rgba(212, 175, 55, 0.4)",
                  backdropFilter: "blur(8px)",
                }}
              >
                <span
                  className="font-sans font-semibold text-[11px] sm:text-xs tracking-[0.18em] uppercase text-[#F5E6C8]"
                >
                  {invitation.badgeText}
                </span>
              </div>
            )}

            {/* Main Couple Names */}
            <h1
              id="hero-headline"
              className="font-serif font-normal text-balance"
              style={{
                fontSize: "clamp(2.75rem, 8.5vw, 5.5rem)",
                lineHeight: 1.1,
                letterSpacing: "0.02em",
                background:
                  "linear-gradient(135deg, #FAF5EE 0%, #F5E6C8 40%, #D4AF37 80%, #FAF5EE 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                filter: "drop-shadow(0 4px 20px rgba(212, 175, 55, 0.2))",
              }}
            >
              {invitation.headline}
            </h1>

            {/* Gold divider line */}
            <div className="flex items-center gap-3 my-1">
              <div className="w-16 h-px bg-gradient-to-r from-transparent to-[#D4AF37]" />
              <span className="text-[#D4AF37] text-xs">✦</span>
              <div className="w-16 h-px bg-gradient-to-l from-transparent to-[#D4AF37]" />
            </div>

            {/* Subheadline / Dedication */}
            <p
              className="font-serif italic font-light"
              style={{
                fontSize: "clamp(1.15rem, 2.8vw, 1.5rem)",
                color: "#E2D7C5",
                maxWidth: "38ch",
                lineHeight: 1.6,
              }}
            >
              {invitation.subheadline ||
                "Los momentos más hermosos de la vida son aquellos que celebramos junto a quienes más amamos."}
            </p>

            {/* Scroll Down Cue */}
            <a
              href="#historia"
              aria-label="Ver nuestra historia"
              className="flex flex-col items-center gap-1.5 mt-4 text-[#D4AF37] opacity-80 hover:opacity-100 transition-opacity"
            >
              <span className="font-sans text-[11px] font-semibold tracking-[0.25em] uppercase">
                Ver Celebración
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
            <ClasicaSectionHeading
              id="historia-heading"
              icon="💍"
              title="Nuestra Historia"
              subtitle="Tres instantes inolvidables que nos guiaron a este momento único"
            />
            <PhotoCarousel
              slides={parseCarouselSlides(invitation.carouselImages)}
              theme="boda-clasica"
            />
          </section>

          {/* ─── COUNTDOWN SECTION ─── */}
          <section
            id="countdown"
            aria-labelledby="countdown-heading"
            className="flex flex-col items-center gap-8"
          >
            <ClasicaSectionHeading
              id="countdown-heading"
              icon="⌛"
              title="Cuenta Regresiva"
              subtitle="Esperando el momento exacto para decir 'Sí, quiero'"
            />
            <Countdown targetDate={invitation.targetDate} theme="boda-clasica" />
          </section>

          {/* ─── VENUE SECTION ─── */}
          <section
            id="venue"
            aria-labelledby="venue-heading"
            className="flex flex-col gap-8"
          >
            <ClasicaSectionHeading
              id="venue-heading"
              icon="🏛️"
              title="Ubicación de la Gala"
              subtitle="Detalles del salón, ceremonia y coordenadas para llegar"
            />
            <VenueCard
              venue={venueConfig}
              targetDate={invitation.targetDate}
              badgeText={invitation.badgeText}
              slug={invitation.slug}
              theme="boda-clasica"
            />
          </section>

          {/* ─── GIFT SECTION (IF CONFIGURED) ─── */}
          {hasGifts && (
            <section
              id="regalos"
              aria-labelledby="gift-heading"
              className="flex flex-col gap-8"
            >
              <ClasicaSectionHeading
                id="gift-heading"
                icon="🥂"
                title="Mesa de Regalos & Luna de Miel"
                subtitle="Tu presencia es nuestro mejor presente. Si deseás agasajarnos..."
              />
              <GiftCard
                gift={giftConfig}
                onChestOpen={handleChestOpen}
                theme="boda-clasica"
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
              <ClasicaSectionHeading
                id="rsvp-heading"
                icon="✉️"
                title="Confirmación de Asistencia"
                subtitle="Agradecemos confirmar con anticipación para la asignación de lugares"
              />
              <RsvpForm
                invitationSlug={invitation.slug}
                personName={invitation.personName}
                allowCompanions={invitation.allowCompanions}
                allowDietary={invitation.allowDietary}
                theme="boda-clasica"
              />
            </section>
          ) : (
            <section className="p-8 rounded-3xl bg-[#141418] border border-[#D4AF37]/30 text-center shadow-md">
              <p className="font-serif italic text-base text-[#F5E6C8]">
                Descubrí los datos de Mesa de Regalos arriba para habilitar tu confirmación.
              </p>
            </section>
          )}

          {/* ─── CLASSIC BLACK TIE CLOSING FOOTER ─── */}
          <footer className="text-center py-10 flex flex-col items-center gap-4 border-t border-[#D4AF37]/20">
            <span className="text-2xl text-[#D4AF37]">✦ 🥂 ✦</span>
            <p className="font-serif italic text-lg text-[#F5E6C8] max-w-md">
              «Será un inmenso honor contar con su presencia en esta noche tan especial.»
            </p>
            <p className="font-sans text-[11px] uppercase tracking-[0.25em] text-[#D4AF37]/80 font-bold">
              Black Tie · Recepción & Celebración
            </p>
          </footer>
        </div>
      </main>
    </>
  );
}

// ─── CLASICA SECTION HEADING ───
function ClasicaSectionHeading({
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
        className="font-serif text-2xl sm:text-3xl md:text-4xl font-normal tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-[#FAF5EE] via-[#F5E6C8] to-[#D4AF37]"
      >
        {title}
      </h2>
      {subtitle && (
        <p className="text-xs sm:text-sm text-[#D4AF37]/80 max-w-md font-sans tracking-wide">
          {subtitle}
        </p>
      )}
      <div className="w-16 h-px bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mt-2" />
    </div>
  );
}

// ─── CLASICA ENVELOPE MODAL ───
function ClasicaEnvelopeModal({
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
      aria-label="Invitación de Boda Clásica Black Tie. Tocá para abrir."
      className="fixed inset-0 z-50 flex flex-col items-center justify-center p-4"
      style={{
        background:
          "radial-gradient(ellipse at center, #1F1F26 0%, #121216 50%, #050507 100%)",
        opacity: isOpening ? 0 : 1,
        transform: isOpening ? "scale(0.92)" : "scale(1)",
        transition: "opacity 0.8s ease, transform 0.8s ease",
      }}
    >
      {/* Decorative gold shimmer particles */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none overflow-hidden"
      >
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              width: `${3 + (i % 3) * 3}px`,
              height: `${3 + (i % 3) * 3}px`,
              background: "#D4AF37",
              boxShadow: "0 0 10px rgba(212, 175, 55, 0.8)",
              top: `${15 + i * 7}%`,
              left: `${10 + i * 8}%`,
              animation: `float ${4 + (i % 3)}s ease-in-out infinite`,
              animationDelay: `${i * 0.35}s`,
            }}
          />
        ))}
      </div>

      <button
        onClick={handleOpen}
        aria-label="Abrir invitación de gala"
        className="group relative flex flex-col items-center gap-6 cursor-pointer border-none bg-transparent p-4 max-w-sm sm:max-w-md w-full"
      >
        {/* Envelope Body */}
        <div
          className="relative w-full max-w-sm sm:max-w-md min-h-[310px] rounded-3xl bg-[#141418] border-2 border-[#D4AF37]/50 shadow-[0_25px_60px_rgba(0,0,0,0.85)] flex flex-col items-center justify-between p-6 sm:p-8 text-center transform transition-transform group-hover:scale-[1.02] duration-300"
          style={{
            backgroundImage:
              "radial-gradient(circle at 50% 10%, rgba(212,175,55,0.12), transparent 70%)",
          }}
        >
          {/* Header block with badge, subtitle and headline */}
          <div className="flex flex-col items-center gap-2 w-full pt-1">
            <div className="inline-flex items-center gap-2 text-xs font-serif text-[#F5E6C8] uppercase tracking-[0.25em] font-light bg-black/60 border border-[#D4AF37]/40 px-4 py-1.5 rounded-full shadow-xs">
              <span>✦</span>
              <span>BLACK TIE · NUESTRA BODA</span>
              <span>✦</span>
            </div>

            <div className="text-xs font-sans uppercase tracking-[0.25em] text-[#D4AF37] font-semibold mt-1">
              Invitación de Boda
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl text-[#FAF5EE] leading-tight font-light tracking-wide">
              {headline}
            </h2>

            <p className="text-xs font-serif italic text-[#E2D7C5] max-w-[28ch] mt-1">
              Nos complace invitarte a la celebración de nuestra unión matrimonial
            </p>
          </div>

          {/* Champagne Gold seal button */}
          <div className="my-3 relative flex items-center justify-center shrink-0">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#F5E6C8] via-[#D4AF37] to-[#856D28] border-2 border-[#FFF] shadow-[0_0_20px_rgba(212,175,55,0.4)] flex flex-col items-center justify-center text-black transform group-hover:scale-110 transition-transform duration-300">
              <span className="text-xl">💍</span>
            </div>
          </div>

          {/* Footer CTA */}
          <span className="text-[11px] font-sans font-bold text-[#D4AF37] uppercase tracking-[0.2em]">
            Hacé clic en el sello de oro ✦
          </span>
        </div>
      </button>
    </div>
  );
}
