import { Users, CheckCircle, XCircle, UtensilsCrossed } from "lucide-react";
import type { RsvpRecord } from "@/lib/schemas/rsvp.schema";
import { DIETARY_LABELS } from "@/lib/schemas/rsvp.schema";

interface MetricsCardsProps {
  rsvps: RsvpRecord[];
}

export default function MetricsCards({ rsvps }: MetricsCardsProps) {
  const attending = rsvps.filter((r) => r.attending === "yes");
  const notAttending = rsvps.filter((r) => r.attending === "no");

  const totalPeople = attending.reduce(
    (sum, r) => sum + 1 + r.companionsCount,
    0
  );

  const dietaryBreakdown = attending.reduce<Record<string, number>>(
    (acc, r) => {
      const key = r.dietaryRestrictions;
      if (key !== "ninguna") {
        acc[key] = (acc[key] ?? 0) + 1;
      }
      return acc;
    },
    {}
  );

  const metrics = [
    {
      id: "total-people",
      icon: Users,
      label: "Personas confirmadas",
      value: totalPeople,
      sublabel: "titulares + acompañantes",
      color: "#C59B27",
      bg: "rgba(197,155,39,0.1)",
    },
    {
      id: "total-yes",
      icon: CheckCircle,
      label: "Respuestas positivas",
      value: attending.length,
      sublabel: `de ${rsvps.length} respuestas totales`,
      color: "#16a34a",
      bg: "rgba(22,163,74,0.1)",
    },
    {
      id: "total-no",
      icon: XCircle,
      label: "No asisten",
      value: notAttending.length,
      sublabel: "confirmaron ausencia",
      color: "#dc2626",
      bg: "rgba(220,38,38,0.1)",
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* KPI grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 w-full">
        {metrics.map(({ id, icon: Icon, label, value, sublabel, color, bg }) => (
          <div
            key={id}
            id={id}
            className="rounded-2xl p-4 sm:p-6 flex flex-col gap-2.5 shadow-xs"
            style={{
              background: bg,
              border: `1px solid ${color}30`,
            }}
          >
            <div className="flex items-center gap-2.5">
              <div
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shrink-0"
                style={{ background: color }}
                aria-hidden="true"
              >
                <Icon size={17} color="#fff" />
              </div>
              <p
                className="font-jakarta font-semibold text-xs sm:text-sm"
                style={{ color: "var(--dark-brown-70)" }}
              >
                {label}
              </p>
            </div>
            <p
              className="font-cormorant font-bold text-3xl sm:text-5xl"
              style={{ lineHeight: 1, color: "var(--dark-brown)" }}
              aria-label={`${value} ${label}`}
            >
              {value}
            </p>
            <p
              className="font-jakarta text-[11px] sm:text-xs"
              style={{ color: "var(--dark-brown-40)" }}
            >
              {sublabel}
            </p>
          </div>
        ))}
      </div>

      {/* Dietary breakdown */}
      {Object.keys(dietaryBreakdown).length > 0 && (
        <div
          className="rounded-2xl p-6"
          style={{
            background: "rgba(139,69,19,0.07)",
            border: "1px solid rgba(139,69,19,0.2)",
          }}
        >
          <div className="flex items-center gap-2 mb-4">
            <UtensilsCrossed
              size={18}
              aria-hidden="true"
              style={{ color: "var(--terracotta)" }}
            />
            <h3
              className="font-jakarta font-semibold"
              style={{ color: "var(--dark-brown)", fontSize: "0.95rem" }}
            >
              Menús especiales
            </h3>
          </div>
          <div className="flex flex-wrap gap-3">
            {Object.entries(dietaryBreakdown).map(([key, count]) => (
              <div
                key={key}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full"
                style={{
                  background: "rgba(139,69,19,0.12)",
                  border: "1px solid rgba(139,69,19,0.3)",
                }}
              >
                <span
                  className="font-jakarta font-bold text-sm"
                  style={{ color: "var(--terracotta)" }}
                >
                  {count}
                </span>
                <span
                  className="font-jakarta text-sm"
                  style={{ color: "var(--dark-brown-70)" }}
                >
                  {DIETARY_LABELS[key as keyof typeof DIETARY_LABELS]}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
