"use client";

import { useState, useCallback, useEffect } from "react";
import type { InvitationRecord } from "@/lib/schemas/invitation.schema";
import Countdown from "@/components/invitation/Countdown";
import VenueCard from "@/components/invitation/VenueCard";
import GiftCard from "@/components/invitation/GiftCard";
import RsvpForm from "@/components/invitation/RsvpForm";
import AudioController from "@/components/invitation/AudioController";
import FootballCharacter from "@/components/invitation/characters/FootballCharacter";
import { Trophy, MapPin, Sparkles, CheckCircle2 } from "lucide-react";

interface TemplateProps {
  invitation: InvitationRecord;
}

export default function FutbolInfantilTemplate({ invitation }: TemplateProps) {
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
      {/* ─── FOOTBALL MATCH TICKET ENVELOPE MODAL ─── */}
      {!isOpened && (
        <FootballEnvelopeModal
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
        className="min-h-screen w-full flex flex-col items-center justify-start relative overflow-hidden text-white"
        style={{
          background:
            "linear-gradient(180deg, #15803D 0%, #166534 40%, #14532D 85%, #052E16 100%)",
          opacity: isOpened ? 1 : 0,
          transition: "opacity 0.8s ease 0.3s",
        }}
      >
        {/* Stadium turf lines */}
        <div aria-hidden="true" className="absolute inset-0 pointer-events-none opacity-15">
          <div className="w-full h-full border-x-8 border-white mx-auto max-w-4xl" />
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-white" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full border-4 border-white" />
        </div>

        {/* Top referee/champions ribbon */}
        <div
          aria-hidden="true"
          className="w-full h-3 shrink-0 shadow-md"
          style={{
            background:
              "repeating-linear-gradient(90deg, #FFFFFF, #FFFFFF 20px, #000000 20px, #000000 40px, #EAB308 40px, #EAB308 60px)",
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
            {/* Matchday tag */}
            <div className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-amber-400 text-gray-950 font-black text-xs sm:text-sm uppercase tracking-widest shadow-lg border-2 border-amber-300">
              <span>⚽ ¡HOY SE JUEGA EL GRAN PARTIDO! ⚽</span>
            </div>

            {/* Date Badge */}
            {invitation.badgeText && (
              <div className="inline-flex items-center justify-center px-6 py-2.5 rounded-2xl bg-white text-emerald-950 font-extrabold text-xs sm:text-sm border-2 border-emerald-400 shadow-md">
                <span>⏱️ {invitation.badgeText}</span>
              </div>
            )}

            {/* Main Headline */}
            <h1
              className="font-black tracking-tight leading-tight uppercase"
              style={{
                fontSize: "clamp(2.8rem, 9.5vw, 5.2rem)",
                textShadow: "3px 3px 0px #047857, 6px 6px 0px rgba(0,0,0,0.3)",
                fontFamily: "var(--font-jakarta)",
              }}
            >
              {invitation.headline}
            </h1>

            {/* Football Champion Character Illustration */}
            <FootballCharacter jerseyNumber={invitation.eventNumber || "10"} />

            {/* Jersey Number */}
            {invitation.eventNumber && (
              <div className="relative my-1">
                <div
                  className="font-black px-10 py-3 rounded-3xl bg-white border-4 border-amber-400 shadow-2xl flex flex-col items-center justify-center"
                  style={{
                    fontSize: "clamp(4.5rem, 16vw, 8.5rem)",
                    lineHeight: 0.9,
                    color: "#047857",
                    textShadow: "3px 3px 0px #A7F3D0",
                  }}
                >
                  <span className="text-xs uppercase font-extrabold tracking-widest text-gray-500 mb-1">
                    DORSAL OFICIAL
                  </span>
                  {invitation.eventNumber}
                </div>
                <div className="absolute -top-3 -right-3 bg-amber-400 text-gray-950 font-black px-3 py-1 rounded-full text-xs shadow-md border-2 border-white flex items-center gap-1">
                  <Trophy size={14} /> Campeón
                </div>
              </div>
            )}

            {/* Subheadline */}
            <p className="text-base sm:text-xl font-bold text-emerald-950 max-w-lg leading-relaxed bg-white/95 p-5 rounded-3xl border-3 border-emerald-300 shadow-lg">
              {invitation.subheadline}
            </p>

            <div className="text-xs font-black uppercase tracking-wider text-amber-300 bg-emerald-900/80 px-4 py-2 rounded-xl border border-emerald-600">
              🏟️ Vení con ropa cómoda / zapatillas para jugar 👟
            </div>
          </section>

          {/* ─── COUNTDOWN SECTION ─── */}
          <section className="bg-white rounded-3xl p-6 sm:p-10 border-4 border-amber-400 shadow-2xl text-emerald-950 flex flex-col items-center gap-6">
            <div className="flex items-center gap-2 font-black text-lg sm:text-2xl uppercase tracking-wider">
              <span>⏱️ Minutos para el Pitazo Inicial ⏱️</span>
            </div>
            <Countdown targetDate={invitation.targetDate} theme="futbol-infantil" />
          </section>

          {/* ─── VENUE SECTION ─── */}
          <section className="flex flex-col gap-4">
            <div className="flex items-center justify-center gap-2 font-black text-xl sm:text-2xl drop-shadow-md">
              <MapPin size={24} className="text-amber-400" />
              <span>El Estadio / La Cancha</span>
            </div>
            <VenueCard
              venue={venueConfig}
              badgeText={invitation.badgeText}
              slug={invitation.slug}
              theme="futbol-infantil"
            />
          </section>

          {/* ─── GIFTS SECTION (OPTIONAL) ─── */}
          {hasGifts && (
            <section className="flex flex-col gap-4">
              <div className="flex items-center justify-center gap-2 font-black text-xl sm:text-2xl drop-shadow-md">
                <Trophy size={24} className="text-amber-400" />
                <span>Mesa de Regalos / Copa del Homenajeado</span>
              </div>
              <GiftCard gift={giftConfig} onChestOpen={handleChestOpen} theme="futbol-infantil" />
            </section>
          )}

          {/* ─── RSVP SECTION ─── */}
          {canShowRsvp ? (
            <section className="flex flex-col gap-4">
              <div className="flex items-center justify-center gap-2 font-black text-xl sm:text-2xl drop-shadow-md">
                <CheckCircle2 size={24} className="text-amber-400" />
                <span>Formación Titular: Confirmá si Jugás</span>
              </div>
              <RsvpForm
                invitationSlug={invitation.slug}
                personName={invitation.personName}
                allowCompanions={invitation.allowCompanions}
                allowDietary={invitation.allowDietary}
                theme="futbol-infantil"
              />

              {invitation.footerPhrase && (
                <footer className="text-center py-4">
                  <p className="font-black text-lg sm:text-2xl text-emerald-950 bg-white p-5 rounded-2xl border-3 border-amber-400 shadow-xl">
                    {invitation.footerPhrase}
                  </p>
                </footer>
              )}
            </section>
          ) : (
            <div className="flex flex-col items-center text-center p-6 bg-white rounded-3xl border-3 border-dashed border-emerald-500 text-emerald-950 shadow-md gap-2">
              <span className="text-3xl">🔒</span>
              <p className="font-bold text-sm">
                Tocá el cofre en la sección anterior para confirmar tu lugar en el equipo titular.
              </p>
            </div>
          )}
        </div>
      </main>
    </>
  );
}

function FootballEnvelopeModal({
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
        background: "radial-gradient(circle at center, #166534 0%, #052E16 100%)",
        opacity: isOpening ? 0 : 1,
        transform: isOpening ? "scale(0.9)" : "scale(1)",
        transition: "opacity 0.7s ease, transform 0.7s ease",
      }}
    >
      <button
        onClick={handleOpen}
        className="group flex flex-col items-center gap-6 cursor-pointer border-none bg-transparent"
      >
        <div className="relative w-[340px] sm:w-[380px] h-[230px] rounded-3xl bg-white border-4 border-amber-400 shadow-2xl flex flex-col items-center justify-center p-6 text-center transform transition-transform group-hover:scale-105">
          <div className="absolute top-3 left-4 text-xs font-black uppercase text-white bg-emerald-700 px-3 py-1 rounded-full">
            ⚽ TICKET OFICIAL DE PARTIDO
          </div>

          <p className="text-xs font-bold text-emerald-800 uppercase tracking-widest mt-2">
            Pase Oficial para la Celebración de
          </p>

          <h2 className="text-3xl sm:text-4xl font-black text-emerald-950 my-1">
            {personName}
          </h2>

          <div className="mt-2 w-16 h-16 rounded-full bg-emerald-600 border-3 border-amber-400 shadow-lg flex flex-col items-center justify-center animate-bounce">
            <span className="text-2xl leading-none">⚽</span>
            <span className="text-[10px] font-black text-white leading-none mt-0.5">
              N° {eventNumber || "10"}
            </span>
          </div>

          <span className="text-xs font-black text-emerald-800 uppercase tracking-wider mt-3 underline">
            ¡Tocá la pelota para entrar a la cancha! 🏟️
          </span>
        </div>
      </button>
    </div>
  );
}
