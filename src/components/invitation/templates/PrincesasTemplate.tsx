"use client";

import { useState, useCallback, useEffect } from "react";
import type { InvitationRecord } from "@/lib/schemas/invitation.schema";
import Countdown from "@/components/invitation/Countdown";
import VenueCard from "@/components/invitation/VenueCard";
import GiftCard from "@/components/invitation/GiftCard";
import RsvpForm from "@/components/invitation/RsvpForm";
import AudioController from "@/components/invitation/AudioController";
import { Crown, Sparkles, Heart, Castle, Clock } from "lucide-react";

interface TemplateProps {
  invitation: InvitationRecord;
}

export default function PrincesasTemplate({ invitation }: TemplateProps) {
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
      {/* ─── PRINCESS ROYAL ENVELOPE MODAL ─── */}
      {!isOpened && (
        <PrincessEnvelopeModal
          onOpen={handleEnvelopeOpen}
          personName={invitation.personName}
          eventNumber={invitation.eventNumber}
        />
      )}

      {/* Audio controller */}
      {invitation.audioTrackPath && (
        <AudioController src={invitation.audioTrackPath} isEnabled={isOpened} />
      )}

      {/* Main page content */}
      <main
        className="min-h-screen w-full flex flex-col items-center justify-start relative overflow-hidden"
        style={{
          background:
            "linear-gradient(180deg, #FDF2F8 0%, #FCE7F3 30%, #F3E8FF 70%, #FDF2F8 100%)",
          opacity: isOpened ? 1 : 0,
          transition: "opacity 0.8s ease 0.3s",
        }}
      >
        {/* Fairy dust sparkles in background */}
        <div aria-hidden="true" className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(16)].map((_, i) => (
            <div
              key={i}
              className="absolute text-pink-300 opacity-60 animate-pulse"
              style={{
                top: `${(i * 13) % 95}%`,
                left: `${(i * 17) % 92}%`,
                fontSize: `${12 + (i % 4) * 6}px`,
                animationDelay: `${i * 0.4}s`,
              }}
            >
              ✦
            </div>
          ))}
        </div>

        {/* Royal gold and pink ribbon */}
        <div
          aria-hidden="true"
          className="w-full h-2.5 shrink-0"
          style={{
            background:
              "linear-gradient(90deg, #F472B6, #FBBF24 50%, #C084FC 100%)",
            boxShadow: "0 2px 10px rgba(244,114,182,0.4)",
          }}
        />

        <div
          className="max-w-3xl w-full mx-auto flex flex-col gap-14 sm:gap-20 relative z-10"
          style={{
            paddingLeft: "clamp(1.25rem, 5vw, 2.5rem)",
            paddingRight: "clamp(1.25rem, 5vw, 2.5rem)",
            paddingTop: "clamp(2rem, 5vw, 4rem)",
            paddingBottom: "clamp(4rem, 8vw, 7rem)",
            boxSizing: "border-box",
          }}
        >
          {/* ─── HERO SECTION WITH INTEGRATED PRINCESSES ─── */}
          <section className="relative flex flex-col items-center gap-5 sm:gap-7 text-center py-4 w-full">
            {/* Authentic Cinderella cutout floating on top-left */}
            <div className="absolute -top-12 -left-4 sm:left-2 md:-left-16 w-28 sm:w-44 md:w-56 pointer-events-none z-20 transform -rotate-6 transition-transform duration-700 hover:rotate-0">
              <img
                src="/images/characters/cinderella.png"
                alt="Cenicienta"
                className="w-full h-auto drop-shadow-[0_15px_30px_rgba(244,114,182,0.4)] select-none"
              />
            </div>

            {/* Authentic Disney Princesses group cutout on bottom-right */}
            <div className="absolute -bottom-12 -right-4 sm:right-0 md:-right-16 w-36 sm:w-56 md:w-72 pointer-events-none z-20 transition-transform duration-700 hover:scale-105">
              <img
                src="/images/characters/princesses.png"
                alt="Princesas Disney"
                className="w-full h-auto drop-shadow-[0_18px_35px_rgba(244,114,182,0.45)] select-none"
              />
            </div>

            {/* Fairy tale ornament */}
            <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-white/90 border border-pink-300 shadow-sm text-pink-700 font-bold text-xs sm:text-sm tracking-wider uppercase">
              <Crown size={18} className="text-amber-500 fill-amber-400" />
              <span>Cuento de Hadas Real</span>
              <Crown size={18} className="text-amber-500 fill-amber-400" />
            </div>

            {/* Date Badge */}
            {invitation.badgeText && (
              <div className="inline-flex items-center justify-center px-6 py-2.5 rounded-2xl bg-white text-pink-900 font-bold text-xs sm:text-sm border-2 border-pink-200 shadow-sm">
                <span>✨ {invitation.badgeText}</span>
              </div>
            )}

            {/* Main Headline */}
            <h1
              className="font-bold text-pink-950 tracking-tight leading-tight"
              style={{
                fontSize: "clamp(2.8rem, 9.5vw, 5.2rem)",
                fontFamily: "var(--font-cormorant), Georgia, serif",
                textShadow: "2px 2px 10px rgba(244,114,182,0.25)",
              }}
            >
              {invitation.headline}
            </h1>

            {/* Princess Tiara Number */}
            {invitation.eventNumber && (
              <div className="relative my-1">
                <div
                  className="font-bold px-8 py-3 rounded-3xl bg-white border-3 border-amber-300 shadow-xl"
                  style={{
                    fontFamily: "var(--font-cormorant), Georgia, serif",
                    fontSize: "clamp(4.5rem, 16vw, 8rem)",
                    lineHeight: 1,
                    color: "#D97706",
                    textShadow: "2px 2px 0px #FDE68A",
                  }}
                >
                  {invitation.eventNumber}
                </div>
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <Crown size={32} className="text-amber-500 fill-amber-400 drop-shadow-md animate-bounce" />
                </div>
              </div>
            )}

            {/* Subheadline */}
            <p
              className="text-lg sm:text-xl font-medium text-pink-900 max-w-lg leading-relaxed bg-white/80 p-5 rounded-3xl border border-pink-200 shadow-sm italic"
              style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
            >
              "{invitation.subheadline}"
            </p>
          </section>

          {/* ─── COUNTDOWN SECTION ─── */}
          <section className="bg-white/95 rounded-3xl p-6 sm:p-10 border-2 border-pink-300 shadow-xl flex flex-col items-center gap-6">
            <div className="flex items-center gap-2 text-pink-900 font-bold text-xl sm:text-2xl tracking-wide">
              <Clock className="text-amber-500" size={24} />
              <span>Antes de la Medianoche</span>
              <Sparkles className="text-pink-400" size={24} />
            </div>
            <Countdown targetDate={invitation.targetDate} theme="princesas" />
          </section>

          {/* ─── VENUE SECTION ─── */}
          <section className="flex flex-col gap-4">
            <div className="flex items-center justify-center gap-2 text-pink-900 font-bold text-xl sm:text-2xl">
              <Castle size={26} className="text-pink-500" />
              <span>El Palacio Real</span>
            </div>
            <VenueCard
              venue={venueConfig}
              badgeText={invitation.badgeText}
              slug={invitation.slug}
              theme="princesas"
            />
          </section>

          {/* ─── GIFTS SECTION (OPTIONAL) ─── */}
          {hasGifts && (
            <section className="flex flex-col gap-4">
              <div className="flex items-center justify-center gap-2 text-pink-900 font-bold text-xl sm:text-2xl">
                <Crown size={22} className="text-amber-500 fill-amber-400" />
                <span>El Baúl de los Deseos Reales</span>
              </div>
              <GiftCard gift={giftConfig} onChestOpen={handleChestOpen} theme="princesas" />
            </section>
          )}

          {/* ─── RSVP SECTION ─── */}
          {canShowRsvp ? (
            <section className="flex flex-col gap-4">
              <div className="flex items-center justify-center gap-2 text-pink-900 font-bold text-xl sm:text-2xl">
                <Heart size={24} className="text-pink-500 fill-pink-400" />
                <span>Confirmación al Gran Baile Real</span>
              </div>
              <RsvpForm
                invitationSlug={invitation.slug}
                personName={invitation.personName}
                allowCompanions={invitation.allowCompanions}
                allowDietary={invitation.allowDietary}
                theme="princesas"
              />

              {invitation.footerPhrase && (
                <footer className="text-center py-4">
                  <p
                    className="text-xl sm:text-2xl text-pink-900 bg-white/90 p-5 rounded-3xl border border-pink-200 shadow-md italic font-semibold"
                    style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
                  >
                    {invitation.footerPhrase}
                  </p>
                </footer>
              )}
            </section>
          ) : (
            <div className="flex flex-col items-center text-center p-6 bg-white/90 rounded-3xl border-2 border-dashed border-pink-400 shadow-sm gap-2">
              <span className="text-3xl">🔒</span>
              <p className="font-semibold text-sm text-pink-900">
                Tocá el cofre en la sección anterior para abrir tu pase al baile real.
              </p>
            </div>
          )}
        </div>
      </main>
    </>
  );
}

function PrincessEnvelopeModal({
  onOpen,
  personName,
  eventNumber,
}: {
  onOpen: () => void;
  personName: string;
  eventNumber?: string;
}) {
  const [isOpening, setIsOpening] = useState(false);
  const [isGone, setIsGone] = useState(false);

  const handleOpen = () => {
    if (isOpening) return;
    setIsOpening(true);
    setTimeout(() => {
      setIsGone(true);
      onOpen();
    }, 800);
  };

  if (isGone) return null;

  return (
    <div
      role="dialog"
      className="fixed inset-0 z-50 flex flex-col items-center justify-center p-4"
      style={{
        background: "radial-gradient(circle at center, #FCE7F3 0%, #F472B6 100%)",
        opacity: isOpening ? 0 : 1,
        transform: isOpening ? "scale(0.9)" : "scale(1)",
        transition: "opacity 0.7s ease, transform 0.7s ease",
      }}
    >
      <button
        onClick={handleOpen}
        className="group flex flex-col items-center gap-6 cursor-pointer border-none bg-transparent"
      >
        <div className="relative w-[340px] sm:w-[380px] h-[230px] rounded-3xl bg-white border-4 border-pink-300 shadow-2xl flex flex-col items-center justify-center p-6 text-center transform transition-transform group-hover:scale-105">
          {/* Authentic Cinderella cutout peeking */}
          <div className="absolute -top-12 -left-8 w-24 sm:w-28 h-auto pointer-events-none transform -rotate-12 z-20">
            <img src="/images/characters/cinderella.png" alt="Cenicienta" className="w-full h-auto drop-shadow-xl" />
          </div>

          {/* Authentic Princesses group cutout peeking */}
          <div className="absolute -bottom-10 -right-8 w-28 sm:w-36 h-auto pointer-events-none z-20">
            <img src="/images/characters/princesses.png" alt="Princesas" className="w-full h-auto drop-shadow-xl" />
          </div>

          <div className="absolute top-3 left-4 text-xs font-bold uppercase text-pink-700 bg-pink-100 px-3 py-1 rounded-full border border-pink-200">
            👑 Decreto Real
          </div>

          <p className="text-xs font-bold text-pink-800 uppercase tracking-widest mt-2">
            Invitación de Honor a la Fiesta de
          </p>

          <h2
            className="text-3xl sm:text-4xl font-bold text-pink-950 my-1"
            style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
          >
            Princesa {personName}
          </h2>

          <div className="mt-2 w-16 h-16 rounded-full bg-gradient-to-tr from-amber-400 to-amber-200 border-2 border-amber-500 shadow-lg flex flex-col items-center justify-center animate-pulse">
            <Crown size={24} className="text-amber-800 fill-amber-700" />
            <span className="text-[10px] font-black text-amber-950 leading-none">
              {eventNumber || "👑"}
            </span>
          </div>

          <span className="text-xs font-bold text-pink-700 uppercase tracking-wider mt-3 underline">
            Tocá el sello real para abrir el sobre ✨
          </span>
        </div>
      </button>
    </div>
  );
}
