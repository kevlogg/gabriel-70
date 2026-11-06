"use client";

import { useState, useCallback, useEffect } from "react";
import type { InvitationRecord } from "@/lib/schemas/invitation.schema";
import Countdown from "@/components/invitation/Countdown";
import VenueCard from "@/components/invitation/VenueCard";
import GiftCard from "@/components/invitation/GiftCard";
import RsvpForm from "@/components/invitation/RsvpForm";
import AudioController from "@/components/invitation/AudioController";
import WoodyAndBuzzCharacter from "@/components/invitation/characters/WoodyAndBuzzCharacter";
import { Rocket, Star, MapPin, Sparkles } from "lucide-react";

interface TemplateProps {
  invitation: InvitationRecord;
}

export default function ToyStoryTemplate({ invitation }: TemplateProps) {
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
      {/* ─── TOY STORY ENVELOPE MODAL ─── */}
      {!isOpened && (
        <ToyStoryEnvelopeModal
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
            "linear-gradient(180deg, #38BDF8 0%, #7DD3FC 30%, #BAE6FD 65%, #F0F9FF 100%)",
          opacity: isOpened ? 1 : 0,
          transition: "opacity 0.8s ease 0.3s",
        }}
      >
        {/* Animated Sky Clouds */}
        <div aria-hidden="true" className="absolute inset-0 pointer-events-none overflow-hidden">
          <Cloud top="5%" left="8%" scale={1.2} />
          <Cloud top="18%" left="75%" scale={0.9} />
          <Cloud top="35%" left="15%" scale={1.1} />
          <Cloud top="50%" left="82%" scale={1} />
          <Cloud top="68%" left="5%" scale={0.8} />
          <Cloud top="82%" left="78%" scale={1.1} />
        </div>

        {/* Woody cow-print top ribbon */}
        <div
          aria-hidden="true"
          className="w-full h-3 shrink-0 shadow-sm"
          style={{
            background:
              "repeating-linear-gradient(45deg, #F59E0B, #F59E0B 15px, #DC2626 15px, #DC2626 30px, #2563EB 30px, #2563EB 45px)",
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
          {/* ─── HERO SECTION ─── */}
          <section className="flex flex-col items-center gap-5 sm:gap-7 text-center py-2">
            {/* Sheriff Badge Tag */}
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-amber-400 text-amber-950 font-black text-xs sm:text-sm uppercase tracking-widest shadow-md border-2 border-amber-500 animate-bounce">
              <Star size={18} className="fill-amber-950 text-amber-950" />
              <span>¡Comisaría de Juguetes!</span>
              <Star size={18} className="fill-amber-950 text-amber-950" />
            </div>

            {/* Date Badge */}
            {invitation.badgeText && (
              <div className="inline-flex items-center justify-center px-6 py-2.5 rounded-2xl bg-white text-blue-900 font-black text-xs sm:text-sm border-2 border-blue-400 shadow-sm">
                <span>📅 {invitation.badgeText}</span>
              </div>
            )}

            {/* Main Headline */}
            <h1
              className="font-black text-blue-950 tracking-tight leading-tight"
              style={{
                fontSize: "clamp(2.8rem, 9.5vw, 5.2rem)",
                textShadow: "3px 3px 0px #FBBF24, 6px 6px 0px rgba(0,0,0,0.12)",
                fontFamily: "var(--font-jakarta)",
              }}
            >
              {invitation.headline}
            </h1>

            {/* Woody & Buzz Characters Illustration */}
            <WoodyAndBuzzCharacter />

            {/* Huge Event Number with Cowboy/Rocket Flair */}
            {invitation.eventNumber && (
              <div className="relative my-1">
                <div
                  className="font-black text-white px-8 py-3 rounded-3xl shadow-xl border-4 border-amber-400 transform -rotate-2"
                  style={{
                    background: "linear-gradient(135deg, #EF4444 0%, #DC2626 100%)",
                    fontSize: "clamp(4.5rem, 16vw, 8rem)",
                    lineHeight: 1,
                    textShadow: "4px 4px 0px #991B1B",
                  }}
                >
                  {invitation.eventNumber}
                </div>
                <div className="absolute -top-3 -right-3 bg-amber-400 text-amber-950 font-black px-3 py-1 rounded-full text-xs shadow-md border-2 border-white uppercase tracking-wider flex items-center gap-1">
                  <Rocket size={14} /> ¡Años!
                </div>
              </div>
            )}

            {/* Subheadline */}
            <p className="text-base sm:text-xl font-bold text-blue-900 max-w-lg leading-relaxed bg-white/90 p-5 rounded-3xl border-3 border-blue-200 shadow-sm">
              {invitation.subheadline}
            </p>

            {/* Woody catchphrase badge */}
            <div className="text-xs font-black uppercase tracking-wider text-amber-900 bg-amber-200/90 px-4 py-2 rounded-xl border border-amber-400 shadow-xs">
              🤠 ¡Al infinito y más allá! · Misión de Cumpleaños 🚀
            </div>
          </section>

          {/* ─── COUNTDOWN SECTION ─── */}
          <section className="bg-white rounded-3xl p-6 sm:p-10 border-4 border-amber-400 shadow-xl flex flex-col items-center gap-6">
            <div className="flex items-center gap-2 text-blue-950 font-black text-lg sm:text-2xl uppercase tracking-wider">
              <Rocket className="text-red-500 animate-pulse" size={26} />
              <span>Cuenta Regresiva del Despegue</span>
              <Rocket className="text-red-500 animate-pulse" size={26} />
            </div>
            <Countdown targetDate={invitation.targetDate} theme="toy-story" />
          </section>

          {/* ─── VENUE SECTION ─── */}
          <section className="flex flex-col gap-4">
            <div className="flex items-center justify-center gap-2 text-blue-950 font-black text-xl sm:text-2xl drop-shadow-sm">
              <MapPin size={24} className="text-blue-700" />
              <span>¿Dónde es la Base de Operaciones?</span>
            </div>
            <VenueCard
              venue={venueConfig}
              badgeText={invitation.badgeText}
              slug={invitation.slug}
              theme="toy-story"
            />
          </section>

          {/* ─── GIFTS SECTION (OPTIONAL) ─── */}
          {hasGifts && (
            <section className="flex flex-col gap-4">
              <div className="flex items-center justify-center gap-2 text-blue-950 font-black text-xl sm:text-2xl drop-shadow-sm">
                <span>🐷 La Alcancía de Hamm (Mesa de Regalos)</span>
              </div>
              <GiftCard gift={giftConfig} onChestOpen={handleChestOpen} theme="toy-story" />
            </section>
          )}

          {/* ─── RSVP SECTION ─── */}
          {canShowRsvp ? (
            <section className="flex flex-col gap-4">
              <div className="flex items-center justify-center gap-2 text-blue-950 font-black text-xl sm:text-2xl drop-shadow-sm">
                <Sparkles size={24} className="text-amber-500" />
                <span>Comando Estelar: Confirmá tu Asistencia</span>
              </div>
              <RsvpForm
                invitationSlug={invitation.slug}
                personName={invitation.personName}
                allowCompanions={invitation.allowCompanions}
                allowDietary={invitation.allowDietary}
                theme="toy-story"
              />

              {invitation.footerPhrase && (
                <footer className="text-center py-4">
                  <p className="font-black text-lg sm:text-2xl text-blue-950 bg-white p-5 rounded-2xl border-4 border-amber-400 shadow-md">
                    {invitation.footerPhrase}
                  </p>
                </footer>
              )}
            </section>
          ) : (
            <div className="flex flex-col items-center text-center p-6 bg-white rounded-3xl border-4 border-dashed border-amber-500 shadow-md gap-2">
              <span className="text-3xl">🔒</span>
              <p className="font-black text-sm text-blue-950">
                ¡Abrí la alcancía en la sección anterior para confirmar tu lugar en la misión!
              </p>
            </div>
          )}
        </div>
      </main>
    </>
  );
}

function Cloud({ top, left, scale = 1 }: { top: string; left: string; scale?: number }) {
  return (
    <div
      className="absolute bg-white/80 rounded-full shadow-xs"
      style={{
        top,
        left,
        width: `${120 * scale}px`,
        height: `${45 * scale}px`,
        filter: "drop-shadow(0 4px 10px rgba(0,0,0,0.06))",
      }}
    >
      <div
        className="absolute bg-white/80 rounded-full -top-4 left-4"
        style={{ width: `${55 * scale}px`, height: `${55 * scale}px` }}
      />
      <div
        className="absolute bg-white/80 rounded-full -top-6 left-12"
        style={{ width: `${65 * scale}px`, height: `${65 * scale}px` }}
      />
    </div>
  );
}

function ToyStoryEnvelopeModal({
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
        background: "radial-gradient(circle at center, #7DD3FC 0%, #0284C7 100%)",
        opacity: isOpening ? 0 : 1,
        transform: isOpening ? "scale(0.9)" : "scale(1)",
        transition: "opacity 0.7s ease, transform 0.7s ease",
      }}
    >
      <button
        onClick={handleOpen}
        className="group flex flex-col items-center gap-6 cursor-pointer border-none bg-transparent"
      >
        <div className="relative w-[340px] sm:w-[380px] h-[230px] rounded-3xl bg-amber-100 border-4 border-amber-500 shadow-2xl flex flex-col items-center justify-center p-6 text-center transform transition-transform group-hover:scale-105">
          <div className="absolute top-3 left-4 text-xs font-black uppercase text-amber-700 bg-amber-200 px-3 py-1 rounded-full">
            ⭐ Correo de Juguetes
          </div>

          <p className="text-xs font-bold text-amber-800 uppercase tracking-widest mt-2">
            ¡Invitación Especial para la Misión de!
          </p>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-blue-950 my-1">
            {personName}
          </h2>

          <div className="mt-2 w-16 h-16 rounded-full bg-amber-400 border-3 border-amber-600 shadow-lg flex flex-col items-center justify-center animate-bounce">
            <Star size={24} className="fill-amber-900 text-amber-900" />
            <span className="text-[10px] font-black text-amber-950 leading-none">
              {eventNumber || "★"}
            </span>
          </div>

          <span className="text-xs font-black text-blue-800 uppercase tracking-wider mt-3 underline">
            ¡Tocá la estrella para abrir la aventura! 🚀
          </span>
        </div>
      </button>
    </div>
  );
}
