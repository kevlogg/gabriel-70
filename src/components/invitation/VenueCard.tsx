import { MapPin, CalendarPlus, Navigation, Calendar, Clock, Rocket, Ticket, Crown, Trophy } from "lucide-react";
import type { VenueConfig } from "@/config/event";
import type { TemplateId } from "@/lib/schemas/invitation.schema";

interface VenueCardProps {
  venue: VenueConfig;
  targetDate?: string;
  badgeText?: string;
  eventDateText?: string;
  eventTimeText?: string;
  slug?: string;
  theme?: TemplateId;
}

function parseVenueDateTime(
  targetDate?: string,
  badgeText?: string,
  explicitDate?: string,
  explicitTime?: string
) {
  if (explicitDate && explicitTime) {
    return { date: explicitDate, time: explicitTime };
  }

  // 1. Try parsing from badgeText (e.g. "Sábado · 7 de Noviembre · 20:30 hs")
  if (badgeText && badgeText.includes("·")) {
    const parts = badgeText.split("·").map((s) => s.trim());
    if (parts.length >= 3) {
      return {
        date: explicitDate || `${parts[0]} ${parts[1]}`, // "Sábado 7 de Noviembre"
        time: explicitTime || parts[2], // "20:30 hs"
      };
    } else if (parts.length === 2) {
      return {
        date: explicitDate || parts[0],
        time: explicitTime || parts[1],
      };
    }
  }

  // 2. Try parsing from targetDate (e.g. "2026-11-07T20:30:00-03:00")
  if (targetDate) {
    try {
      const cleanIso = targetDate.replace("Z", "").split("+")[0].split("-03:00")[0];
      const [datePart, timePart] = cleanIso.split("T");
      if (datePart) {
        const [year, month, day] = datePart.split("-").map(Number);
        const [hour, min] = (timePart || "20:00").split(":").map(Number);
        const d = new Date(year, month - 1, day, hour, min);

        const days = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
        const months = [
          "Enero",
          "Febrero",
          "Marzo",
          "Abril",
          "Mayo",
          "Junio",
          "Julio",
          "Agosto",
          "Septiembre",
          "Octubre",
          "Noviembre",
          "Diciembre",
        ];

        const dayName = days[d.getDay()] || "";
        const monthName = months[d.getMonth()] || "";
        const formattedDate = `${dayName} ${day} de ${monthName}`;
        const formattedTime = `${String(hour).padStart(2, "0")}:${String(min).padStart(2, "0")} hs`;

        return {
          date: explicitDate || formattedDate,
          time: explicitTime || formattedTime,
        };
      }
    } catch {
      // ignore
    }
  }

  return {
    date: explicitDate || badgeText || "Fecha a confirmar",
    time: explicitTime || "20:30 hs",
  };
}

export default function VenueCard({
  venue,
  targetDate,
  badgeText,
  eventDateText,
  eventTimeText,
  slug,
  theme = "classic-gold",
}: VenueCardProps) {
  const { date: displayDate, time: displayTime } = parseVenueDateTime(
    targetDate,
    badgeText,
    eventDateText,
    eventTimeText
  );

  const cleanDisplayTime = displayTime.replace(/\(?puntual\)?/gi, "").trim();

  const isToyStory = theme === "toy-story";
  const isKpop = theme === "k-pop";
  const isPrincess = theme === "princesas";
  const isFootball = theme === "futbol-infantil";

  // Card container styling
  const cardContainerClass = isToyStory
    ? "bg-white rounded-3xl border-4 border-amber-400 shadow-xl p-6 sm:p-10 flex flex-col gap-6 text-blue-950"
    : isKpop
    ? "bg-black/60 rounded-3xl border border-pink-500/50 shadow-[0_0_30px_rgba(236,72,153,0.3)] p-6 sm:p-10 flex flex-col gap-6 text-white backdrop-blur-xl"
    : isPrincess
    ? "bg-white/95 rounded-3xl border-2 border-pink-300 shadow-xl p-6 sm:p-10 flex flex-col gap-6 text-pink-950"
    : isFootball
    ? "bg-white rounded-3xl border-4 border-emerald-500 shadow-xl p-6 sm:p-10 flex flex-col gap-6 text-emerald-950"
    : "glass-card p-6 sm:p-10 flex flex-col gap-6 sm:gap-8 text-[var(--dark-brown)]";

  // Header icon background
  const iconBg = isToyStory
    ? "bg-blue-600 text-white shadow-md"
    : isKpop
    ? "bg-gradient-to-tr from-pink-500 to-purple-600 text-white shadow-[0_0_15px_rgba(236,72,153,0.6)]"
    : isPrincess
    ? "bg-gradient-to-tr from-pink-400 via-rose-400 to-amber-300 text-white shadow-md"
    : isFootball
    ? "bg-emerald-600 text-white shadow-md"
    : "bg-gradient-to-br from-[#C59B27] to-[#D4A373] text-white shadow-md";

  // Title styling
  const titleClass = isToyStory
    ? "font-black text-2xl sm:text-3xl text-blue-950 tracking-tight"
    : isKpop
    ? "font-black text-2xl sm:text-3xl text-transparent bg-clip-text bg-gradient-to-r from-pink-200 via-white to-pink-400 tracking-wide"
    : isPrincess
    ? "font-bold text-2xl sm:text-3xl text-pink-950"
    : isFootball
    ? "font-black text-2xl sm:text-3xl text-emerald-950 tracking-tight uppercase"
    : "font-cormorant font-bold text-2xl sm:text-3xl text-[var(--dark-brown)]";

  // Datetime block styling
  const datetimeBlockClass = isToyStory
    ? "flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-5 rounded-2xl bg-sky-50 border-2 border-sky-200 shadow-xs"
    : isKpop
    ? "flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white/5 border border-pink-500/30 shadow-xs"
    : isPrincess
    ? "flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-5 rounded-2xl bg-pink-50/70 border border-pink-200 shadow-xs"
    : isFootball
    ? "flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-5 rounded-2xl bg-emerald-50/70 border-2 border-emerald-200 shadow-xs"
    : "flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-5 sm:p-6 rounded-2xl bg-[rgba(197,155,39,0.08)] border-1.5 border-[rgba(197,155,39,0.3)] shadow-xs";

  // Action Buttons
  const mapBtnClass = isToyStory
    ? "flex-1 py-3.5 px-5 rounded-2xl font-black text-white text-sm shadow-md bg-blue-600 hover:bg-blue-700 transition-all flex items-center justify-center gap-2 cursor-pointer"
    : isKpop
    ? "flex-1 py-3.5 px-5 rounded-2xl font-bold text-white text-sm shadow-[0_0_15px_rgba(236,72,153,0.5)] bg-gradient-to-r from-pink-500 to-purple-600 hover:opacity-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
    : isPrincess
    ? "flex-1 py-3.5 px-5 rounded-2xl font-bold text-white text-sm shadow-md bg-gradient-to-r from-pink-500 via-rose-400 to-amber-400 hover:opacity-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
    : isFootball
    ? "flex-1 py-3.5 px-5 rounded-2xl font-black text-white text-sm shadow-md bg-emerald-600 hover:bg-emerald-700 transition-all flex items-center justify-center gap-2 cursor-pointer"
    : "btn-gold flex-1 justify-center py-4 flex items-center gap-2";

  const calendarBtnClass = isToyStory
    ? "flex-1 py-3.5 px-5 rounded-2xl font-black text-amber-950 text-sm shadow-sm bg-amber-400 hover:bg-amber-500 border-2 border-amber-500 transition-all flex items-center justify-center gap-2 cursor-pointer"
    : isKpop
    ? "flex-1 py-3.5 px-5 rounded-2xl font-bold text-pink-200 text-sm border border-pink-400/60 bg-white/5 hover:bg-white/10 transition-all flex items-center justify-center gap-2 cursor-pointer"
    : isPrincess
    ? "flex-1 py-3.5 px-5 rounded-2xl font-bold text-pink-900 text-sm border-2 border-pink-300 bg-white hover:bg-pink-50 transition-all flex items-center justify-center gap-2 cursor-pointer"
    : isFootball
    ? "flex-1 py-3.5 px-5 rounded-2xl font-black text-gray-950 text-sm shadow-sm bg-amber-400 hover:bg-amber-500 border-2 border-amber-500 transition-all flex items-center justify-center gap-2 cursor-pointer"
    : "btn-outline flex-1 justify-center py-4 flex items-center gap-2";

  return (
    <div className={cardContainerClass}>
      {/* Header */}
      <div className="flex items-center gap-4 sm:gap-6">
        <div
          className={`shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center ${iconBg}`}
          aria-hidden="true"
        >
          {isToyStory ? (
            <Rocket size={26} />
          ) : isKpop ? (
            <Ticket size={26} />
          ) : isPrincess ? (
            <Crown size={26} />
          ) : isFootball ? (
            <Trophy size={26} />
          ) : (
            <MapPin size={26} />
          )}
        </div>
        <div className="flex flex-col gap-1">
          <h3 className={titleClass}>{venue.name}</h3>
          <p className="text-sm sm:text-base opacity-80 leading-relaxed">
            {venue.address}
          </p>
        </div>
      </div>

      {/* Date & Time Block */}
      <div className={datetimeBlockClass}>
        {/* Fecha */}
        <div className="flex items-center gap-3.5 flex-1 text-left">
          <div
            className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
              isToyStory
                ? "bg-blue-100 text-blue-700"
                : isKpop
                ? "bg-purple-900/60 text-pink-400"
                : isPrincess
                ? "bg-pink-100 text-pink-600"
                : isFootball
                ? "bg-emerald-100 text-emerald-800"
                : "bg-[rgba(197,155,39,0.18)] text-[var(--gold)]"
            }`}
          >
            <Calendar size={20} aria-hidden="true" />
          </div>
          <div className="flex flex-col gap-0.5">
            <span
              className={`text-[11px] font-extrabold uppercase tracking-widest ${
                isToyStory
                  ? "text-blue-700"
                  : isKpop
                  ? "text-pink-400"
                  : isPrincess
                  ? "text-pink-600"
                  : isFootball
                  ? "text-emerald-700"
                  : "text-[var(--gold)]"
              }`}
            >
              Fecha del evento
            </span>
            <span className="font-bold text-base sm:text-lg">
              {displayDate}
            </span>
          </div>
        </div>

        {/* Divider desktop */}
        <div className="hidden sm:block w-px h-10 bg-gray-300/40" />

        {/* Horario */}
        <div className="flex items-center gap-3.5 flex-1 text-left">
          <div
            className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 shadow-xs ${
              isToyStory
                ? "bg-amber-400 text-amber-950"
                : isKpop
                ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white"
                : isPrincess
                ? "bg-rose-400 text-white"
                : isFootball
                ? "bg-amber-400 text-gray-950"
                : "bg-gradient-to-br from-[#C59B27] to-[#D4A373] text-white animate-pulse"
            }`}
          >
            <Clock size={20} aria-hidden="true" />
          </div>
          <div className="flex flex-col gap-0.5">
            <span
              className={`text-[11px] font-extrabold uppercase tracking-widest flex items-center gap-1 ${
                isToyStory
                  ? "text-red-600"
                  : isKpop
                  ? "text-pink-400"
                  : isPrincess
                  ? "text-rose-600"
                  : isFootball
                  ? "text-emerald-800"
                  : "text-[#dc2626]"
              }`}
            >
              <span>⏰ Horario importante</span>
            </span>
            <span className="font-black text-xl sm:text-2xl tracking-tight flex items-center gap-1.5">
              {cleanDisplayTime || displayTime}
              <span className="text-xs font-semibold uppercase opacity-75">
                (Puntual)
              </span>
            </span>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-1">
        <a
          href={venue.mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={mapBtnClass}
          aria-label={`Ver cómo llegar a ${venue.name} en Google Maps`}
        >
          <Navigation size={17} aria-hidden="true" />
          <span>Cómo llegar</span>
        </a>

        <a
          href={venue.googleCalendarUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={calendarBtnClass}
          aria-label="Agendar el evento en Google Calendar"
        >
          <CalendarPlus size={17} aria-hidden="true" />
          <span>Agendar fecha</span>
        </a>
      </div>

      {/* .ics download */}
      <a
        href={slug ? `/api/calendar?slug=${encodeURIComponent(slug)}` : "/api/calendar"}
        download={`${slug || "evento"}.ics`}
        className="text-center text-xs font-semibold underline underline-offset-4 opacity-75 hover:opacity-100 transition-opacity pt-1"
        aria-label="Descargar archivo .ics para agregar a tu calendario"
      >
        ↓ Descargar para Apple Calendar / Outlook
      </a>
    </div>
  );
}
