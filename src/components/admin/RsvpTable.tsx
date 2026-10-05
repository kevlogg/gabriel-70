"use client";

import { useState, useMemo } from "react";
import { Search, Download, CheckCircle, XCircle } from "lucide-react";
import type { RsvpRecord } from "@/lib/schemas/rsvp.schema";
import { DIETARY_LABELS } from "@/lib/schemas/rsvp.schema";

interface RsvpTableProps {
  rsvps: RsvpRecord[];
}

function formatDate(isoString: string): string {
  try {
    const date = new Date(isoString);
    const day = String(date.getUTCDate()).padStart(2, "0");
    const month = String(date.getUTCMonth() + 1).padStart(2, "0");
    const year = date.getUTCFullYear();
    const hours = String(date.getUTCHours()).padStart(2, "0");
    const minutes = String(date.getUTCMinutes()).padStart(2, "0");
    return `${day}/${month}/${year} ${hours}:${minutes} HS`;
  } catch {
    return isoString;
  }
}

function buildCsv(rows: RsvpRecord[]): string {
  const headers = [
    "Fecha",
    "Nombre",
    "Asistencia",
    "Personas (con acompañantes)",
    "Restricción alimentaria",
    "Mensaje",
  ];

  const escapeCell = (value: string): string => {
    const escaped = value.replace(/"/g, '""');
    return `"${escaped}"`;
  };

  const dataRows = rows.map((r) => [
    escapeCell(formatDate(r.createdAt)),
    escapeCell(
      r.name +
        (r.companionNames && r.companionNames.length > 0
          ? ` (+ ${r.companionNames.join(", ")})`
          : "")
    ),
    escapeCell(r.attending === "yes" ? "Sí" : "No"),
    escapeCell(String(1 + r.companionsCount)),
    escapeCell(
      DIETARY_LABELS[r.dietaryRestrictions as keyof typeof DIETARY_LABELS] ??
        r.dietaryRestrictions
    ),
    escapeCell(r.message ?? ""),
  ]);

  return [headers.map((h) => escapeCell(h)).join(","), ...dataRows.map((r) => r.join(","))].join(
    "\r\n"
  );
}

export default function RsvpTable({ rsvps }: RsvpTableProps) {
  const [filterText, setFilterText] = useState("");

  const filteredRsvps = useMemo(() => {
    const q = filterText.trim().toLowerCase();
    if (!q) return rsvps;
    return rsvps.filter((r) => r.name.toLowerCase().includes(q));
  }, [filterText, rsvps]);

  const handleExportCsv = () => {
    const csv = buildCsv(filteredRsvps);
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `rsvp-gabriel-70-${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3 justify-between items-stretch sm:items-center w-full">
        <div className="relative flex-1 w-full sm:max-w-sm">
          <Search
            size={16}
            aria-hidden="true"
            className="absolute left-3.5 top-1/2 -translate-y-1/2"
            style={{ color: "var(--dark-brown-40)" }}
          />
          <input
            type="search"
            id="rsvp-search"
            placeholder="Buscar por nombre..."
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            className="form-input pl-10 py-2.5 text-sm w-full"
            aria-label="Buscar confirmaciones por nombre"
          />
        </div>
        <button
          onClick={handleExportCsv}
          className="btn-outline flex items-center justify-center gap-2 text-xs sm:text-sm py-2.5 px-4 w-full sm:w-auto"
          aria-label={`Exportar ${filteredRsvps.length} registros a CSV`}
          id="export-csv-btn"
        >
          <Download size={15} aria-hidden="true" />
          Exportar CSV ({filteredRsvps.length})
        </button>
      </div>

      {/* ─── MOBILE VIEW: CARDS (DISPLAYED ONLY ON MOBILE < 640px) ─── */}
      <div className="flex flex-col gap-3 sm:hidden w-full">
        {filteredRsvps.length === 0 ? (
          <div className="text-center py-8 px-4 rounded-2xl bg-[var(--cream-2)] border border-[rgba(197,155,39,0.2)] font-jakarta text-xs text-[var(--dark-brown-40)]">
            {filterText
              ? "No se encontraron coincidencias."
              : "Aún no hay confirmaciones."}
          </div>
        ) : (
          filteredRsvps.map((rsvp) => (
            <div
              key={rsvp.id}
              className="p-4 rounded-2xl border border-[rgba(197,155,39,0.25)] bg-[var(--cream-2)] flex flex-col gap-2.5 shadow-xs"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex flex-col">
                  <span className="font-jakarta font-bold text-sm text-[var(--dark-brown)]">
                    {rsvp.name}
                  </span>
                  {rsvp.companionNames && rsvp.companionNames.length > 0 && (
                    <span className="font-jakarta text-xs text-[var(--gold)] font-semibold mt-0.5">
                      + {rsvp.companionNames.join(", ")}
                    </span>
                  )}
                </div>
                <AttendanceBadge attending={rsvp.attending} />
              </div>

              <div className="flex items-center justify-between text-xs text-[var(--dark-brown-70)] pt-1 border-t border-[rgba(197,155,39,0.15)]">
                <span>Total personas: <strong>{1 + rsvp.companionsCount}</strong></span>
                <span>{formatDate(rsvp.createdAt)}</span>
              </div>

              {rsvp.dietaryRestrictions !== "ninguna" && (
                <div className="text-xs bg-amber-50 text-amber-900 border border-amber-200 rounded-lg p-2 font-medium">
                  🥗 Restricción: {DIETARY_LABELS[rsvp.dietaryRestrictions as keyof typeof DIETARY_LABELS] ?? rsvp.dietaryRestrictions}
                </div>
              )}

              {rsvp.message && (
                <div className="text-xs bg-[rgba(197,155,39,0.08)] text-[var(--dark-brown)] italic rounded-lg p-2 border border-[rgba(197,155,39,0.2)]">
                  “{rsvp.message}”
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* ─── DESKTOP VIEW: TABLE (DISPLAYED ONLY ON SCREENS >= 640px) ─── */}
      <div
        className="hidden sm:block rounded-2xl overflow-hidden w-full"
        style={{ border: "1px solid rgba(197,155,39,0.2)" }}
      >
        <div className="overflow-x-auto">
          <table
            className="w-full"
            style={{ borderCollapse: "collapse" }}
            aria-label="Tabla de confirmaciones de asistencia"
          >
            <thead>
              <tr
                style={{
                  background: "linear-gradient(135deg, rgba(197,155,39,0.12), rgba(212,163,115,0.12))",
                  borderBottom: "1px solid rgba(197,155,39,0.2)",
                }}
              >
                {["Fecha", "Nombre", "Asistencia", "Personas", "Restricción", "Mensaje"].map(
                  (col) => (
                    <th
                      key={col}
                      scope="col"
                      className="font-jakarta font-semibold text-left px-4 py-3"
                      style={{
                        fontSize: "0.75rem",
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                        color: "var(--dark-brown-70)",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {col}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody id="rsvp-table-body">
              {filteredRsvps.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="text-center py-12 font-jakarta"
                    style={{ color: "var(--dark-brown-40)" }}
                  >
                    {filterText
                      ? "No se encontraron coincidencias."
                      : "Aún no hay confirmaciones."}
                  </td>
                </tr>
              ) : (
                filteredRsvps.map((rsvp, index) => (
                  <tr
                    key={rsvp.id}
                    style={{
                      background: index % 2 === 0 ? "var(--cream)" : "var(--cream-2)",
                      borderBottom: "1px solid rgba(197,155,39,0.1)",
                    }}
                  >
                    <td
                      className="px-4 py-3 font-jakarta text-sm"
                      style={{ color: "var(--dark-brown-70)", whiteSpace: "nowrap" }}
                    >
                      {formatDate(rsvp.createdAt)}
                    </td>
                    <td
                      className="px-4 py-3 font-jakarta text-sm"
                      style={{ color: "var(--dark-brown)", whiteSpace: "nowrap" }}
                    >
                      <div className="flex flex-col gap-0.5">
                        <span className="font-semibold">{rsvp.name}</span>
                        {rsvp.companionNames && rsvp.companionNames.length > 0 && (
                          <span
                            className="text-xs font-medium"
                            style={{ color: "var(--dark-brown-70)" }}
                          >
                            + {rsvp.companionNames.join(", ")}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <AttendanceBadge attending={rsvp.attending} />
                    </td>
                    <td
                      className="px-4 py-3 font-jakarta font-semibold text-sm text-center"
                      style={{ color: "var(--dark-brown)" }}
                    >
                      {1 + rsvp.companionsCount}
                    </td>
                    <td
                      className="px-4 py-3 font-jakarta text-sm"
                      style={{ color: "var(--dark-brown-70)", whiteSpace: "nowrap" }}
                    >
                      {DIETARY_LABELS[rsvp.dietaryRestrictions as keyof typeof DIETARY_LABELS] ??
                        rsvp.dietaryRestrictions}
                    </td>
                    <td
                      className="px-4 py-3 font-jakarta text-sm"
                      style={{
                        color: "var(--dark-brown-70)",
                        maxWidth: "200px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                      title={rsvp.message ?? ""}
                    >
                      {rsvp.message ?? (
                        <span style={{ opacity: 0.3 }}>—</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <p
        className="font-jakarta text-xs text-right"
        style={{ color: "var(--dark-brown-40)" }}
        aria-live="polite"
      >
        Mostrando {filteredRsvps.length} de {rsvps.length} registros
      </p>
    </div>
  );
}

function AttendanceBadge({ attending }: { attending: "yes" | "no" }) {
  const isYes = attending === "yes";
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-jakarta font-semibold"
      style={{
        fontSize: "0.75rem",
        background: isYes ? "rgba(22,163,74,0.12)" : "rgba(220,38,38,0.1)",
        color: isYes ? "#16a34a" : "#dc2626",
        border: `1px solid ${isYes ? "rgba(22,163,74,0.3)" : "rgba(220,38,38,0.25)"}`,
        whiteSpace: "nowrap",
      }}
      aria-label={isYes ? "Asiste" : "No asiste"}
    >
      {isYes ? (
        <CheckCircle size={11} aria-hidden="true" />
      ) : (
        <XCircle size={11} aria-hidden="true" />
      )}
      {isYes ? "Asiste" : "No asiste"}
    </span>
  );
}
