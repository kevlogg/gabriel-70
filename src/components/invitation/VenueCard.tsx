import { MapPin, CalendarPlus, Navigation } from "lucide-react";
import type { VenueConfig } from "@/config/event";

interface VenueCardProps {
  venue: VenueConfig;
}

export default function VenueCard({ venue }: VenueCardProps) {
  return (
    <div className="glass-card p-8 md:p-10 flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-start gap-4">
        <div
          className="shrink-0 w-12 h-12 rounded-full flex items-center justify-center"
          style={{ background: "linear-gradient(135deg, #C59B27, #D4A373)" }}
          aria-hidden="true"
        >
          <MapPin size={22} color="#fff" />
        </div>
        <div>
          <h3
            className="font-cormorant"
            style={{
              fontSize: "clamp(1.5rem, 3vw, 2rem)",
              fontWeight: 600,
              color: "var(--dark-brown)",
              lineHeight: 1.2,
            }}
          >
            {venue.name}
          </h3>
          <p
            className="font-jakarta mt-1"
            style={{
              fontSize: "0.95rem",
              color: "var(--dark-brown-70)",
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
            "linear-gradient(to right, transparent, var(--gold-pale), transparent)",
        }}
      />

      {/* Event datetime detail */}
      <div
        className="font-jakarta text-center py-2"
        style={{
          background: "rgba(197,155,39,0.08)",
          borderRadius: "0.75rem",
          padding: "0.875rem 1.25rem",
        }}
      >
        <p
          style={{
            fontSize: "clamp(1rem, 2vw, 1.2rem)",
            color: "var(--dark-brown)",
            fontWeight: 600,
            letterSpacing: "0.01em",
          }}
        >
          🗓 Sábado 14 de Noviembre de 2026
        </p>
        <p
          style={{
            fontSize: "clamp(0.95rem, 1.8vw, 1.1rem)",
            color: "var(--gold)",
            fontWeight: 600,
            marginTop: "0.25rem",
          }}
        >
          🕢 20:30 hs
        </p>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <a
          href={venue.mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-gold flex-1 justify-center"
          aria-label={`Ver cómo llegar a ${venue.name} en Google Maps`}
        >
          <Navigation size={16} aria-hidden="true" />
          Cómo llegar
        </a>
        <a
          href={venue.googleCalendarUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-outline flex-1 justify-center"
          aria-label="Agendar el evento en Google Calendar"
        >
          <CalendarPlus size={16} aria-hidden="true" />
          Agendar fecha
        </a>
      </div>

      {/* .ics download */}
      <a
        href="/api/calendar"
        download="gabriel-70.ics"
        className="font-jakarta text-center text-sm underline underline-offset-2 transition-opacity hover:opacity-70"
        style={{ color: "var(--dark-brown-70)" }}
        aria-label="Descargar archivo .ics para agregar a tu calendario"
      >
        ↓ Descargar para Apple Calendar / Outlook
      </a>
    </div>
  );
}
