"use client";

import { useState, useCallback, useEffect } from "react";
import type { InvitationRecord } from "@/lib/schemas/invitation.schema";
import Countdown from "@/components/invitation/Countdown";
import VenueCard from "@/components/invitation/VenueCard";
import GiftCard from "@/components/invitation/GiftCard";
import RsvpForm from "@/components/invitation/RsvpForm";
import AudioController from "@/components/invitation/AudioController";
import KpopIdolCharacter from "@/components/invitation/characters/KpopIdolCharacter";
import { Sparkles, Music, Star, Heart, Ticket, Radio } from "lucide-react";

interface TemplateProps {
  invitation: InvitationRecord;
}

export default function KpopTemplate({ invitation }: TemplateProps) {
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
      {/* ─── K-POP VIP ENVELOPE MODAL ─── */}
      {!isOpened && (
        <KpopEnvelopeModal
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
            "linear-gradient(180deg, #090614 0%, #170C2D 35%, #230F44 70%, #090614 100%)",
          opacity: isOpened ? 1 : 0,
          transition: "opacity 0.8s ease 0.3s",
        }}
      >
        {/* Glow Spheres in background */}
        <div
          aria-hidden="true"
          className="absolute -top-20 -left-20 w-96 h-96 rounded-full bg-pink-500/20 blur-3xl pointer-events-none"
        />
        <div
          aria-hidden="true"
          className="absolute top-1/3 -right-20 w-96 h-96 rounded-full bg-purple-500/25 blur-3xl pointer-events-none"
        />

        {/* Neon top line */}
        <div
          aria-hidden="true"
          className="w-full h-1.5 shrink-0"
          style={{
            background:
              "linear-gradient(90deg, #EC4899, #A855F7, #06B6D4, #EC4899)",
            boxShadow: "0 0 15px rgba(236,72,153,0.8)",
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
            {/* Holographic Badge */}
            <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-gradient-to-r from-pink-500/30 via-purple-500/30 to-cyan-500/30 border border-pink-400/60 shadow-[0_0_20px_rgba(236,72,153,0.4)] backdrop-blur-md">
              <Sparkles size={16} className="text-pink-400 animate-spin" />
              <span className="font-extrabold text-xs sm:text-sm tracking-widest uppercase text-pink-200">
                ★ WORLD TOUR · COMEBACK STAGE ★
              </span>
              <Sparkles size={16} className="text-cyan-400 animate-spin" />
            </div>

            {/* Date Badge */}
            {invitation.badgeText && (
              <div className="inline-flex items-center justify-center px-6 py-2.5 rounded-2xl bg-white/10 border border-purple-400/40 backdrop-blur-md text-pink-300 font-bold text-xs sm:text-sm shadow-md">
                <Radio size={15} className="mr-2 text-pink-400 animate-pulse" />
                <span>{invitation.badgeText}</span>
              </div>
            )}

            {/* Main Headline */}
            <h1
              className="font-black tracking-tight leading-tight uppercase"
              style={{
                fontSize: "clamp(2.6rem, 9vw, 5rem)",
                background:
                  "linear-gradient(135deg, #FFFFFF 0%, #F472B6 40%, #C084FC 80%, #38BDF8 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                filter: "drop-shadow(0 0 25px rgba(236,72,153,0.45))",
                fontFamily: "var(--font-jakarta)",
              }}
            >
              {invitation.headline}
            </h1>

            {/* K-Pop Idol Character Illustration */}
            <KpopIdolCharacter />

            {/* Neon Event Number */}
            {invitation.eventNumber && (
              <div className="relative my-1">
                <div
                  className="font-black px-8 py-2 rounded-3xl border-2 border-pink-400/80 shadow-[0_0_35px_rgba(236,72,153,0.5)]"
                  style={{
                    fontSize: "clamp(4.5rem, 16vw, 8rem)",
                    lineHeight: 1,
                    background: "rgba(236, 72, 153, 0.12)",
                    color: "#F472B6",
                    textShadow:
                      "0 0 10px #EC4899, 0 0 20px #EC4899, 0 0 40px #A855F7",
                  }}
                >
                  {invitation.eventNumber}
                </div>
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-extrabold px-4 py-1 rounded-full text-xs uppercase tracking-widest shadow-md">
                  ★ SPECIAL EDITION ★
                </div>
              </div>
            )}

            {/* Subheadline */}
            <p className="text-base sm:text-lg font-medium text-purple-200 max-w-lg leading-relaxed bg-white/5 p-4 rounded-2xl border border-white/10 backdrop-blur-md">
              {invitation.subheadline}
            </p>
          </section>

          {/* ─── COUNTDOWN SECTION ─── */}
          <section className="bg-black/40 rounded-3xl p-6 sm:p-10 border border-pink-500/40 shadow-[0_0_30px_rgba(236,72,153,0.2)] backdrop-blur-xl flex flex-col items-center gap-6">
            <div className="flex items-center gap-2 text-pink-300 font-extrabold text-lg sm:text-xl uppercase tracking-widest">
              <Music className="text-pink-400 animate-bounce" size={22} />
              <span>Conteo para el Live Show</span>
              <Music className="text-cyan-400 animate-bounce" size={22} />
            </div>
            <Countdown targetDate={invitation.targetDate} theme="k-pop" />
          </section>

          {/* ─── VENUE SECTION ─── */}
          <section className="flex flex-col gap-4">
            <div className="flex items-center justify-center gap-2 text-pink-300 font-extrabold text-lg sm:text-xl uppercase tracking-wider">
              <Ticket size={22} className="text-pink-400" />
              <span>Coordenadas del Concierto</span>
            </div>
            <VenueCard
              venue={venueConfig}
              badgeText={invitation.badgeText}
              slug={invitation.slug}
              theme="k-pop"
            />
          </section>

          {/* ─── GIFTS SECTION (OPTIONAL) ─── */}
          {hasGifts && (
            <section className="flex flex-col gap-4">
              <div className="flex items-center justify-center gap-2 text-pink-300 font-extrabold text-lg sm:text-xl uppercase tracking-wider">
                <span>🎁 VIP Backstage Pass (Mesa de Regalos)</span>
              </div>
              <GiftCard gift={giftConfig} onChestOpen={handleChestOpen} theme="k-pop" />
            </section>
          )}

          {/* ─── RSVP SECTION ─── */}
          {canShowRsvp ? (
            <section className="flex flex-col gap-4">
              <div className="flex items-center justify-center gap-2 text-pink-300 font-extrabold text-lg sm:text-xl uppercase tracking-wider">
                <Sparkles size={22} className="text-pink-400" />
                <span>Confirmá tu Entrada al Show</span>
              </div>
              <RsvpForm
                invitationSlug={invitation.slug}
                personName={invitation.personName}
                allowCompanions={invitation.allowCompanions}
                allowDietary={invitation.allowDietary}
                theme="k-pop"
              />

              {invitation.footerPhrase && (
                <footer className="text-center py-4">
                  <p className="font-extrabold text-base sm:text-xl text-pink-200 bg-black/40 p-5 rounded-2xl border border-pink-500/30 backdrop-blur-md">
                    {invitation.footerPhrase}
                  </p>
                </footer>
              )}
            </section>
          ) : (
            <div className="flex flex-col items-center text-center p-6 bg-black/50 rounded-3xl border border-pink-500/50 shadow-md gap-2">
              <span className="text-3xl">🔒</span>
              <p className="font-bold text-sm text-pink-200">
                Tocá el cofre en la sección anterior para desbloquear tu entrada VIP.
              </p>
            </div>
          )}
        </div>
      </main>
    </>
  );
}

function KpopEnvelopeModal({
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
        background: "radial-gradient(circle at center, #1E0B38 0%, #0A0517 100%)",
        opacity: isOpening ? 0 : 1,
        transform: isOpening ? "scale(0.9)" : "scale(1)",
        transition: "opacity 0.7s ease, transform 0.7s ease",
      }}
    >
      <button
        onClick={handleOpen}
        className="group flex flex-col items-center gap-6 cursor-pointer border-none bg-transparent"
      >
        <div className="relative w-[340px] sm:w-[380px] h-[230px] rounded-3xl bg-gradient-to-br from-pink-900/60 via-purple-900/60 to-black/80 border-2 border-pink-400 shadow-[0_0_50px_rgba(236,72,153,0.4)] backdrop-blur-xl flex flex-col items-center justify-center p-6 text-center transform transition-transform group-hover:scale-105">
          <div className="absolute top-3 right-4 text-[10px] font-black uppercase text-pink-300 bg-pink-500/20 px-3 py-1 rounded-full border border-pink-400/40">
            ★ OFFICIAL LIGHTSTICK PASS ★
          </div>

          <p className="text-[11px] font-bold text-purple-200 uppercase tracking-widest mt-2">
            Invitación Exclusiva
          </p>

          <h2 className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-200 via-white to-pink-400 my-1">
            {personName}
          </h2>

          <div className="mt-2 w-16 h-16 rounded-full bg-gradient-to-tr from-pink-500 to-purple-500 border-2 border-white shadow-[0_0_20px_rgba(236,72,153,0.8)] flex flex-col items-center justify-center animate-pulse">
            <Heart size={22} className="fill-white text-white" />
            <span className="text-[10px] font-black text-white leading-none">
              {eventNumber || "★"}
            </span>
          </div>

          <span className="text-xs font-bold text-pink-300 uppercase tracking-wider mt-3 underline">
            Tocá el corazón para ingresar al show ✨
          </span>
        </div>
      </button>
    </div>
  );
}
