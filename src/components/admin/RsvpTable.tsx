"use client";

import { useState, useMemo } from "react";
import { Search, Download, CheckCircle, XCircle } from "lucide-react";
import type { RsvpRecord } from "@/lib/schemas/rsvp.schema";
import { DIETARY_LABELS } from "@/lib/schemas/rsvp.schema";

interface RsvpTableProps {
  rsvps: RsvpRecord[];
}

function formatDate(isoString: string): string {
  const date = new Date(isoString);
  return new Intl.DateTimeFormat("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
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
    escapeCell(r.name),
    escapeCell(r.attending === "yes" ? "Sí" : "No"),
    escapeCell(String(1 + r.companionsCount)),
    escapeCell(DIETARY_LABELS[r.dietaryRestrictions as keyof typeof DIETARY_LABELS] ?? r.dietaryRestrictions),
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
      <div className="flex flex-col sm:flex-row gap-3 justify-between items-stretch sm:items-center">
        <div className="relative flex-1 max-w-sm">
          <Search
            size={16}
            aria-hidden="true"
            className="absolute left-3 top-1/2 -translate-y-1/2"
            style={{ color: "var(--dark-brown-40)" }}
          />
          <input
            type="search"
            id="rsvp-search"
            placeholder="Buscar por nombre..."
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            className="form-input pl-9"
            aria-label="Buscar confirmaciones por nombre"
            aria-controls="rsvp-table-body"
          />
        </div>
        <button
          onClick={handleExportCsv}
          className="btn-outline flex items-center gap-2"
          aria-label={`Exportar ${filteredRsvps.length} registros a CSV`}
          id="export-csv-btn"
        >
          <Download size={15} aria-hidden="true" />
          Exportar CSV ({filteredRsvps.length})
        </button>
      </div>

      {/* Table */}
      <div
        className="rounded-2xl overflow-hidden"
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
                      className="px-4 py-3 font-jakarta font-semibold text-sm"
                      style={{ color: "var(--dark-brown)", whiteSpace: "nowrap" }}
                    >
                      {rsvp.name}
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
