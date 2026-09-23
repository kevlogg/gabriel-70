import { MapPin, CalendarPlus, Navigation } from "lucide-react";
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

      {/* Event datetime detail */}
      <div
        className="font-jakarta text-center py-6 px-6 sm:px-8 my-1 flex flex-col gap-2 rounded-2xl"
        style={{
          background: "linear-gradient(135deg, rgba(197,155,39,0.08), rgba(212,163,115,0.08))",
          border: "1.5px solid rgba(197,155,39,0.25)",
        }}
      >
        <p
          style={{
            fontSize: "clamp(1.1rem, 2.2vw, 1.35rem)",
            color: "var(--dark-brown)",
            fontWeight: 600,
            letterSpacing: "0.01em",
          }}
        >
          🗓 Sábado 14 de Noviembre de 2026
        </p>
        <p
          style={{
            fontSize: "clamp(1.05rem, 2vw, 1.25rem)",
            color: "var(--gold)",
            fontWeight: 700,
          }}
        >
          🕢 20:30 hs
        </p>
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
