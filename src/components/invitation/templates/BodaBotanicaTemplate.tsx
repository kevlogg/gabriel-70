"use client";

import { useState, useCallback, useEffect } from "react";
import type { InvitationRecord } from "@/lib/schemas/invitation.schema";
import Countdown from "@/components/invitation/Countdown";
import VenueCard from "@/components/invitation/VenueCard";
import GiftCard from "@/components/invitation/GiftCard";
import RsvpForm from "@/components/invitation/RsvpForm";
import AudioController from "@/components/invitation/AudioController";
import PhotoCarousel from "@/components/invitation/PhotoCarousel";
import { Heart, Sparkles } from "lucide-react";

interface TemplateProps {
  invitation: InvitationRecord;
}

export default function BodaBotanicaTemplate({ invitation }: TemplateProps) {
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

  // Lock scroll until envelope is opened
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
      {/* ─── BOTANICAL ENVELOPE MODAL ─── */}
      {!isOpened && (
        <BotanicaEnvelopeModal
          onOpen={handleEnvelopeOpen}
          personName={invitation.personName}
          headline={invitation.headline}
        />
      )}

      {/* Audio controller */}
      {invitation.audioTrackPath && (
        <AudioController src={invitation.audioTrackPath} isEnabled={isOpened} />
      )}

      {/* ─── MAIN CONTENT ─── */}
      <main
        id="main-content"
        className="min-h-screen w-full flex flex-col items-center justify-start relative overflow-hidden"
        style={{
          background:
            "linear-gradient(180deg, #FAF7F2 0%, #F3EFE6 25%, #EAF0E8 60%, #FAF7F2 100%)",
          opacity: isOpened ? 1 : 0,
          transition: "opacity 0.8s ease 0.3s",
        }}
        aria-label={`Invitación de Boda de ${invitation.personName}`}
      >
        {/* Subtle decorative floating leaves background */}
        <div aria-hidden="true" className="absolute inset-0 pointer-events-none overflow-hidden opacity-35">
          <BotanicalLeaf top="4%" left="3%" rotation={25} size={70} />
          <BotanicalLeaf top="12%" right="4%" rotation={-45} size={85} />
          <BotanicalLeaf top="28%" left="2%" rotation={60} size={75} />
          <BotanicalLeaf top="42%" right="2%" rotation={-20} size={90} />
          <BotanicalLeaf top="65%" left="4%" rotation={35} size={80} />
          <BotanicalLeaf top="82%" right="5%" rotation={-50} size={75} />
        </div>

        {/* Delicate botanical header banner line */}
        <div
          aria-hidden="true"
          className="w-full h-2.5 shrink-0"
          style={{
            background:
              "linear-gradient(90deg, transparent, #556B2F 25%, #8A9A5B 50%, #556B2F 75%, transparent)",
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
            {/* Top botanical badge ornament */}
            <div
              aria-hidden="true"
              className="flex items-center gap-3 text-[#556B2F]"
            >
              <span className="text-xl">🌿</span>
              <span
                className="font-serif italic font-semibold text-sm sm:text-base tracking-[0.25em] uppercase text-[#4A5D23]"
              >
                Nuestra Boda
              </span>
              <span className="text-xl">🌿</span>
            </div>

            {/* Date badge */}
            {invitation.badgeText && (
              <div
                className="inline-flex items-center justify-center gap-2 px-5 py-2 sm:px-7 sm:py-2.5 rounded-full shadow-sm max-w-full text-center"
                style={{
                  background: "rgba(255, 255, 255, 0.85)",
                  border: "1.5px solid rgba(85, 107, 47, 0.35)",
                  backdropFilter: "blur(6px)",
                }}
              >
                <span
                  className="font-sans font-bold text-[11px] sm:text-xs tracking-wider uppercase text-[#4A5D23]"
                >
                  {invitation.badgeText}
                </span>
              </div>
            )}

            {/* Couple headline */}
            <h1
              id="hero-headline"
              className="font-serif font-normal text-balance"
              style={{
                fontSize: "clamp(2.75rem, 8.5vw, 5.5rem)",
                color: "#2D3E1E",
                lineHeight: 1.1,
                letterSpacing: "-0.01em",
              }}
            >
              {invitation.headline}
            </h1>

            {/* Intertwined rings icon */}
            <div className="flex items-center gap-3 my-1 text-[#556B2F]">
              <div className="w-12 h-px bg-[#556B2F]/40" />
              <Heart size={20} className="fill-[#556B2F]/20 text-[#556B2F]" />
              <div className="w-12 h-px bg-[#556B2F]/40" />
            </div>

            {/* Subheadline / Romantic quote */}
            <p
              className="font-serif italic"
              style={{
                fontSize: "clamp(1.15rem, 2.8vw, 1.5rem)",
                color: "#4A5D23",
                maxWidth: "38ch",
                lineHeight: 1.6,
              }}
            >
              {invitation.subheadline ||
                "Hay momentos en la vida que son inolvidables, y compartirlos con quienes más queremos los hace eternos."}
            </p>

            {/* Scroll Down Cue */}
            <a
              href="#historia"
              aria-label="Ver nuestra historia"
              className="flex flex-col items-center gap-1.5 mt-4 text-[#556B2F] opacity-75 hover:opacity-100 transition-opacity"
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
            <BotanicaSectionHeading
              id="historia-heading"
              icon="📷"
              title="Nuestra Historia de Amor"
              subtitle="Tres momentos que marcaron nuestro camino hacia el altar"
            />
            <PhotoCarousel
              theme="boda-botanica"
              title="Momentos Inolvidables"
              subtitle="Cada paso juntos nos trajo hasta este gran día"
            />
          </section>

          {/* ─── COUNTDOWN SECTION ─── */}
          <section
            id="countdown"
            aria-labelledby="countdown-heading"
            className="flex flex-col items-center gap-8"
          >
            <BotanicaSectionHeading
              id="countdown-heading"
              icon="⏳"
              title="Cuenta Regresiva"
              subtitle="Cada segundo cuenta para nuestro 'Sí, quiero'"
            />
            <Countdown targetDate={invitation.targetDate} theme="boda-botanica" />
          </section>

          {/* ─── VENUE SECTION ─── */}
          <section
            id="venue"
            aria-labelledby="venue-heading"
            className="flex flex-col gap-8"
          >
            <BotanicaSectionHeading
              id="venue-heading"
              icon="🕊️"
              title="Ceremonia & Celebración"
              subtitle="Toda la información del lugar y cómo llegar"
            />
            <VenueCard
              venue={venueConfig}
              targetDate={invitation.targetDate}
              badgeText={invitation.badgeText}
              slug={invitation.slug}
              theme="boda-botanica"
            />
          </section>

          {/* ─── GIFT SECTION (IF CONFIGURED) ─── */}
          {hasGifts && (
            <section
              id="regalos"
              aria-labelledby="gift-heading"
              className="flex flex-col gap-8"
            >
              <BotanicaSectionHeading
                id="gift-heading"
                icon="🌿"
                title="Luna de Miel & Regalos"
                subtitle="El mejor regalo es tu presencia, pero si deseás colaborar con nuestro viaje..."
              />
              <GiftCard
                gift={giftConfig}
                onChestOpen={handleChestOpen}
                theme="boda-botanica"
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
              <BotanicaSectionHeading
                id="rsvp-heading"
                icon="💌"
                title="Confirmación de Asistencia"
                subtitle="Por favor confirmá antes de la fecha límite para organizar tu lugar"
              />
              <RsvpForm
                invitationSlug={invitation.slug}
                personName={invitation.personName}
                allowCompanions={invitation.allowCompanions}
                allowDietary={invitation.allowDietary}
                theme="boda-botanica"
              />
            </section>
          ) : (
            <section className="p-8 rounded-3xl bg-white/70 border border-[#556B2F]/20 text-center shadow-sm">
              <p className="font-serif italic text-base text-[#4A5D23]">
                Descubrí los datos de Luna de Miel arriba para confirmar tu asistencia.
              </p>
            </section>
          )}

          {/* ─── BOTANICAL CLOSING FOOTER ─── */}
          <footer className="text-center py-10 flex flex-col items-center gap-4 border-t border-[#556B2F]/20">
            <span className="text-2xl">🌿 💍 🌿</span>
            <p className="font-serif italic text-lg text-[#2D3E1E] max-w-md">
              «El amor no mira con los ojos, sino con el corazón.»
            </p>
            <p className="font-sans text-xs uppercase tracking-widest text-[#556B2F] font-bold">
              ¡Te esperamos para celebrar juntos nuestro gran día!
            </p>
          </footer>
        </div>
      </main>
    </>
  );
}

// ─── BOTANICAL SECTION HEADING ───
function BotanicaSectionHeading({
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
        className="font-serif text-2xl sm:text-3xl md:text-4xl font-normal text-[#2D3E1E]"
      >
        {title}
      </h2>
      {subtitle && (
        <p className="text-xs sm:text-sm text-[#556B2F] max-w-md font-sans">
          {subtitle}
        </p>
      )}
      <div className="w-16 h-0.5 bg-[#556B2F]/30 rounded-full mt-1" />
    </div>
  );
}

// ─── FLOATING BOTANICAL LEAF SVG ───
function BotanicalLeaf({
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
          d="M20 80 Q35 30 80 20 Q70 65 20 80 Z"
          fill="#556B2F"
          fillOpacity="0.25"
        />
        <path
          d="M20 80 Q45 50 80 20"
          stroke="#4A5D23"
          strokeWidth="1.5"
          strokeOpacity="0.35"
        />
        <path
          d="M40 60 Q50 55 58 62"
          stroke="#4A5D23"
          strokeWidth="1"
          strokeOpacity="0.25"
        />
        <path
          d="M55 45 Q65 40 72 46"
          stroke="#4A5D23"
          strokeWidth="1"
          strokeOpacity="0.25"
        />
      </svg>
    </div>
  );
}

// ─── BOTANICAL ENVELOPE MODAL ───
function BotanicaEnvelopeModal({
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
      aria-label="Invitación de Boda Botánica. Tocá para abrir."
      className="fixed inset-0 z-50 flex flex-col items-center justify-center p-4"
      style={{
        background:
          "radial-gradient(ellipse at center, #F8FAF7 0%, #E6EFE6 50%, #BDD0BD 100%)",
        opacity: isOpening ? 0 : 1,
        transform: isOpening ? "scale(0.92)" : "scale(1)",
        transition: "opacity 0.8s ease, transform 0.8s ease",
      }}
    >
      {/* Decorative leaf particles */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none overflow-hidden"
      >
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              width: `${6 + (i % 4) * 4}px`,
              height: `${12 + (i % 4) * 6}px`,
              background: "rgba(85, 107, 47, 0.18)",
              borderRadius: "50% 0 50% 0",
              top: `${12 + i * 8}%`,
              left: `${8 + i * 9}%`,
              transform: `rotate(${i * 35}deg)`,
              animation: `float ${4 + (i % 3)}s ease-in-out infinite`,
              animationDelay: `${i * 0.4}s`,
            }}
          />
        ))}
      </div>

      <button
        onClick={handleOpen}
        aria-label="Abrir invitación de boda"
        className="group relative flex flex-col items-center gap-6 cursor-pointer border-none bg-transparent p-4 max-w-sm sm:max-w-md w-full"
      >
        {/* Envelope Paper Container */}
        <div
          className="relative w-full max-w-sm sm:max-w-md min-h-[310px] rounded-3xl bg-[#FAF8F5] border-2 border-[#556B2F]/35 shadow-[0_25px_60px_rgba(85,107,47,0.25)] flex flex-col items-center justify-between p-6 sm:p-8 text-center transform transition-transform group-hover:scale-[1.02] duration-300"
          style={{
            backgroundImage:
              "radial-gradient(circle at 50% 10%, rgba(85,107,47,0.06), transparent 70%)",
          }}
        >
          {/* Header block with badge, subtitle and headline */}
          <div className="flex flex-col items-center gap-2 w-full pt-1">
            <div className="inline-flex items-center gap-2 text-xs font-serif text-[#4A5D23] uppercase tracking-[0.2em] font-semibold bg-[#EAF0E8] border border-[#556B2F]/30 px-4 py-1.5 rounded-full shadow-xs">
              <span>🌿</span>
              <span>Nuestra Boda</span>
              <span>🌿</span>
            </div>

            <div className="text-xs font-sans uppercase tracking-[0.2em] text-[#556B2F] font-bold mt-1">
              Invitación Especial
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl text-[#2D3E1E] leading-tight font-normal">
              {headline}
            </h2>

            <p className="text-xs font-serif italic text-[#4A5D23] max-w-[28ch] mt-1">
              Con inmensa alegría queremos invitarte a compartir nuestro gran día
            </p>
          </div>

          {/* Eucalyptus wax seal button */}
          <div className="my-3 relative flex items-center justify-center shrink-0">
            <div className="w-16 h-16 rounded-full bg-[#4A5D23] border-2 border-[#D4AF37] shadow-xl flex flex-col items-center justify-center text-white transform group-hover:scale-110 transition-transform duration-300">
              <span className="text-xl">🌿</span>
            </div>
          </div>

          {/* Footer CTA */}
          <span className="text-[11px] font-sans font-bold text-[#4A5D23] uppercase tracking-wider">
            Hacé clic en el sello para abrir ✉️
          </span>
        </div>
      </button>
    </div>
  );
}
