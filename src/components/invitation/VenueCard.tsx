import { MapPin, CalendarPlus, Navigation, Calendar, Clock } from "lucide-react";
import type { VenueConfig } from "@/config/event";

interface VenueCardProps {
  venue: VenueConfig;
}

export default function VenueCard({ venue }: VenueCardProps) {
  return (
    <div
      className="glass-card flex flex-col gap-6 sm:gap-8"
      style={{
        padding: "clamp(1.75rem, 5vw, 3rem)",
        boxSizing: "border-box",
        width: "100%",
      }}
    >
      {/* Header */}
      <div className="flex items-center gap-4 sm:gap-6">
        <div
          className="shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center shadow-md"
          style={{ background: "linear-gradient(135deg, #C59B27, #D4A373)" }}
          aria-hidden="true"
        >
          <MapPin size={26} color="#fff" />
        </div>
        <div className="flex flex-col gap-1">
          <h3
            className="font-cormorant"
            style={{
              fontSize: "clamp(1.75rem, 3.5vw, 2.25rem)",
              fontWeight: 600,
              color: "var(--dark-brown)",
              lineHeight: 1.15,
            }}
          >
            {venue.name}
          </h3>
          <p
            className="font-jakarta text-base"
            style={{
              color: "var(--dark-brown-70)",
              lineHeight: 1.5,
            }}
          >
            {venue.address}
          </p>
        </div>
      </div>

      {/* Decorative line */}
      <div
        aria-hidden="true"
        style={{
          height: "1px",
          background:
            "linear-gradient(to right, transparent, rgba(197,155,39,0.35), transparent)",
        }}
      />

      {/* Event datetime detail - High visibility for time */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-5 sm:p-6 rounded-2xl bg-[rgba(197,155,39,0.08)] border-1.5 border-[rgba(197,155,39,0.3)] shadow-xs">
        {/* FECHA */}
        <div className="flex items-center gap-3.5 text-left flex-1">
          <div className="w-12 h-12 rounded-xl bg-[rgba(197,155,39,0.18)] flex items-center justify-center shrink-0">
            <Calendar size={22} className="text-[var(--gold)]" aria-hidden="true" />
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="font-jakarta font-bold text-xs uppercase tracking-widest text-[var(--gold)]">
              Fecha del evento
            </span>
            <span className="font-jakarta font-bold text-base sm:text-lg text-[var(--dark-brown)]">
              Sábado 7 de Noviembre
            </span>
          </div>
        </div>

        {/* Divider desktop */}
        <div className="hidden sm:block w-px h-12 bg-[rgba(197,155,39,0.3)]" />

        {/* HORARIO (DESTACADO Y VISIBLE) */}
        <div className="flex items-center gap-3.5 text-left flex-1 p-3.5 sm:p-0 rounded-xl bg-[rgba(197,155,39,0.12)] sm:bg-transparent border sm:border-none border-[rgba(197,155,39,0.3)]">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#C59B27] to-[#D4A373] flex items-center justify-center shrink-0 shadow-sm animate-pulse">
            <Clock size={22} color="#fff" aria-hidden="true" />
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="font-jakarta font-bold text-xs uppercase tracking-widest text-[#dc2626] flex items-center gap-1">
              <span>⏰ Horario importante</span>
            </span>
            <span className="font-jakarta font-black text-xl sm:text-2xl text-[var(--dark-brown)] tracking-tight flex items-center gap-2">
              20:30 hs <span className="font-semibold text-xs text-[var(--gold)] uppercase tracking-wider">(Puntual)</span>
            </span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4 pt-2">
        <a
          href={venue.mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-gold flex-1 justify-center py-4"
          aria-label={`Ver cómo llegar a ${venue.name} en Google Maps`}
        >
          <Navigation size={18} aria-hidden="true" />
          Cómo llegar
        </a>
        <a
          href={venue.googleCalendarUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-outline flex-1 justify-center py-4"
          aria-label="Agendar el evento en Google Calendar"
        >
          <CalendarPlus size={18} aria-hidden="true" />
          Agendar fecha
        </a>
      </div>

      {/* .ics download */}
      <a
        href="/api/calendar"
        download="gabriel-70.ics"
        className="font-jakarta text-center text-sm font-medium underline underline-offset-4 transition-opacity hover:opacity-75 pt-1"
        style={{ color: "var(--dark-brown-70)" }}
        aria-label="Descargar archivo .ics para agregar a tu calendario"
      >
        ↓ Descargar para Apple Calendar / Outlook
      </a>
    </div>
  );
}
