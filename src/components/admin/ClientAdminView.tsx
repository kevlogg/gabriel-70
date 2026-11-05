"use client";

import { useState, useMemo } from "react";
import type { InvitationRecord } from "@/lib/schemas/invitation.schema";
import type { RsvpRecord } from "@/lib/schemas/rsvp.schema";
import { DIETARY_LABELS } from "@/lib/schemas/rsvp.schema";
import {
  Users,
  MessageSquare,
  Utensils,
  XCircle,
  Search,
  Download,
  Copy,
  Check,
  RefreshCw,
  ExternalLink,
  AlertTriangle,
  LayoutGrid,
  Table as TableIcon,
  Heart,
} from "lucide-react";

interface ClientAdminViewProps {
  invitation: InvitationRecord;
  rsvps: RsvpRecord[];
}

function formatDate(isoString: string): string {
  try {
    const date = new Date(isoString);
    return date.toLocaleDateString("es-AR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return isoString;
  }
}

function normalizeName(str: string): string {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\p{L}\s]/gu, " ")
    .trim();
}

export default function ClientAdminView({ invitation, rsvps }: ClientAdminViewProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "messages" | "dietary" | "declined">("all");
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedSummary, setCopiedSummary] = useState(false);

  const attendingRsvps = useMemo(() => rsvps.filter((r) => r.attending === "yes"), [rsvps]);
  const declinedRsvps = useMemo(() => rsvps.filter((r) => r.attending === "no"), [rsvps]);

  // Total personas confirmadas (titulares + acompañantes)
  const totalConfirmedAttendees = useMemo(() => {
    return attendingRsvps.reduce((sum, r) => {
      const companions =
        r.companionNames && r.companionNames.length > 0
          ? r.companionNames.length
          : r.companionsCount || 0;
      return sum + 1 + companions;
    }, 0);
  }, [attendingRsvps]);

  // Mensajes recibidos
  const rsvpsWithMessages = useMemo(() => {
    return rsvps.filter((r) => r.message && r.message.trim().length > 0);
  }, [rsvps]);

  // Desglose de dietas
  const dietaryBreakdown = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const r of attendingRsvps) {
      if (r.dietaryRestrictions && r.dietaryRestrictions !== "ninguna") {
        counts[r.dietaryRestrictions] = (counts[r.dietaryRestrictions] || 0) + 1;
      }
    }
    return counts;
  }, [attendingRsvps]);

  // Detección de posibles duplicados
  const duplicates = useMemo(() => {
    const map = new Map<string, RsvpRecord[]>();
    for (const r of attendingRsvps) {
      const norm = normalizeName(r.name);
      if (!map.has(norm)) map.set(norm, []);
      map.get(norm)!.push(r);
    }
    const dupList: { name: string; records: RsvpRecord[] }[] = [];
    map.forEach((records) => {
      if (records.length > 1) {
        dupList.push({ name: records[0].name, records });
      }
    });
    return dupList;
  }, [attendingRsvps]);

  // Filtrado de la lista
  const filteredList = useMemo(() => {
    let list = rsvps;
    if (filter === "all") {
      list = attendingRsvps;
    } else if (filter === "messages") {
      list = rsvpsWithMessages;
    } else if (filter === "dietary") {
      list = attendingRsvps.filter(
        (r) => r.dietaryRestrictions && r.dietaryRestrictions !== "ninguna"
      );
    } else if (filter === "declined") {
      list = declinedRsvps;
    }

    if (!searchQuery.trim()) return list;

    const q = searchQuery.toLowerCase().trim();
    return list.filter((r) => {
      if (r.name.toLowerCase().includes(q)) return true;
      if (r.message && r.message.toLowerCase().includes(q)) return true;
      if (r.companionNames?.some((c) => c.toLowerCase().includes(q))) return true;
      return false;
    });
  }, [rsvps, attendingRsvps, declinedRsvps, rsvpsWithMessages, filter, searchQuery]);

  // Exportar CSV
  const handleExportCsv = () => {
    const headers = [
      "Fecha",
      "Titular",
      "Asistencia",
      "Lugares Totales",
      "Acompañantes",
      "Menú Especial",
      "Mensaje / Saludo",
    ];

    const escapeCell = (str: string) => `"${str.replace(/"/g, '""')}"`;

    const rows = filteredList.map((r) => [
      escapeCell(formatDate(r.createdAt)),
      escapeCell(r.name),
      escapeCell(r.attending === "yes" ? "Confirmado" : "No asiste"),
      escapeCell(String(1 + (r.companionNames?.length ?? r.companionsCount ?? 0))),
      escapeCell(r.companionNames?.join(", ") || "-"),
      escapeCell(DIETARY_LABELS[r.dietaryRestrictions as keyof typeof DIETARY_LABELS] || r.dietaryRestrictions || "Ninguna"),
      escapeCell(r.message || "-"),
    ]);

    const csvContent = "\uFEFF" + [headers.join(","), ...rows.map((row) => row.join(","))].join("\r\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `confirmados-${invitation.slug}-${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Copiar resumen de texto para WhatsApp
  const handleCopySummary = () => {
    const lines = [
      `📋 *RESUMEN DE CONFIRMADOS — ${invitation.headline.toUpperCase()}*`,
      `📅 Fecha: ${invitation.badgeText}`,
      `👥 Total de personas confirmadas: ${totalConfirmedAttendees}`,
      `✉️ Total respuestas: ${rsvps.length} (${attendingRsvps.length} sí / ${declinedRsvps.length} no)`,
      "",
      `*MENÚS ESPECIALES:*`,
      ...Object.entries(dietaryBreakdown).map(
        ([key, val]) => `• ${DIETARY_LABELS[key as keyof typeof DIETARY_LABELS] || key}: ${val}`
      ),
      "",
      `*LISTA DE CONFIRMADOS:*`,
      ...attendingRsvps.map((r, i) => {
        const companions = r.companionNames && r.companionNames.length > 0 ? ` (+ ${r.companionNames.join(", ")})` : "";
        const diet = r.dietaryRestrictions !== "ninguna" ? ` [${DIETARY_LABELS[r.dietaryRestrictions as keyof typeof DIETARY_LABELS] || r.dietaryRestrictions}]` : "";
        return `${i + 1}. ${r.name}${companions}${diet}`;
      }),
    ];

    navigator.clipboard.writeText(lines.join("\n"));
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2500);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="min-h-screen w-full pb-16" style={{ background: "var(--cream)" }}>
      {/* Top flourish */}
      <div
        aria-hidden="true"
        className="w-full h-1.5"
        style={{
          background: "linear-gradient(90deg, transparent, #C59B27 30%, #D4A373 50%, #C59B27 70%, transparent)",
        }}
      />

      <main className="max-w-6xl mx-auto px-4 sm:px-8 py-6 sm:py-10 flex flex-col gap-6 sm:gap-8">
        {/* Header */}
        <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span
                className="font-jakarta font-bold text-xs tracking-widest uppercase px-3 py-1 rounded-full text-[var(--gold)]"
                style={{ background: "rgba(197,155,39,0.12)", border: "1px solid rgba(197,155,39,0.3)" }}
              >
                REGISTRO DE INVITADOS
              </span>
              <span className="text-xs text-[var(--dark-brown-40)]">· Actualización automática</span>
            </div>
            <h1 className="font-cormorant font-bold text-3xl sm:text-4xl text-[var(--dark-brown)]">
              {invitation.headline}
            </h1>
            <p className="font-jakarta text-xs sm:text-sm text-[var(--dark-brown-70)]">
              {invitation.badgeText} · {invitation.venueName}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 self-stretch md:self-auto">
            <a
              href={`/${invitation.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline text-xs py-2.5 px-4 flex items-center gap-2 flex-1 sm:flex-none justify-center"
            >
              <ExternalLink size={14} />
              Ver Invitación
            </a>
            <button
              onClick={handleCopyLink}
              className="btn-outline text-xs py-2.5 px-4 flex items-center gap-2 flex-1 sm:flex-none justify-center"
            >
              {copiedLink ? <Check size={14} color="#16a34a" /> : <Copy size={14} />}
              {copiedLink ? "¡Link copiado!" : "Copiar link de este panel"}
            </button>
            <button
              onClick={() => window.location.reload()}
              className="btn-gold text-xs py-2.5 px-4 flex items-center gap-2 flex-1 sm:flex-none justify-center"
            >
              <RefreshCw size={14} />
              Actualizar
            </button>
          </div>
        </header>

        {/* KPI Metrics Cards */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {/* Card 1: Confirmados */}
          <div
            className="rounded-2xl p-4 sm:p-5 flex flex-col gap-2 shadow-xs"
            style={{ background: "rgba(197,155,39,0.12)", border: "1px solid rgba(197,155,39,0.3)" }}
          >
            <div className="flex items-center justify-between">
              <span className="font-jakarta text-xs font-semibold text-[var(--dark-brown-70)]">
                Personas confirmadas
              </span>
              <div className="w-8 h-8 rounded-full flex items-center justify-center bg-[#C59B27] text-white">
                <Users size={16} />
              </div>
            </div>
            <div className="font-cormorant font-bold text-3xl sm:text-4xl text-[var(--dark-brown)]">
              {totalConfirmedAttendees}
            </div>
            <span className="font-jakarta text-[11px] text-[var(--dark-brown-70)]">
              {attendingRsvps.length} titulares + {totalConfirmedAttendees - attendingRsvps.length} acompañantes
            </span>
          </div>

          {/* Card 2: Mensajes y Saludos */}
          <div
            className="rounded-2xl p-4 sm:p-5 flex flex-col gap-2 shadow-xs"
            style={{ background: "rgba(212,163,115,0.15)", border: "1px solid rgba(212,163,115,0.4)" }}
          >
            <div className="flex items-center justify-between">
              <span className="font-jakarta text-xs font-semibold text-[var(--dark-brown-70)]">
                Mensajes y Saludos
              </span>
              <div className="w-8 h-8 rounded-full flex items-center justify-center bg-[#D4A373] text-white">
                <MessageSquare size={16} />
              </div>
            </div>
            <div className="font-cormorant font-bold text-3xl sm:text-4xl text-[var(--dark-brown)]">
              {rsvpsWithMessages.length}
            </div>
            <span className="font-jakarta text-[11px] text-[var(--dark-brown-70)]">
              Dedicatorias dejadas con cariño
            </span>
          </div>

          {/* Card 3: Menús Especiales */}
          <div
            className="rounded-2xl p-4 sm:p-5 flex flex-col gap-2 shadow-xs"
            style={{ background: "rgba(180,83,9,0.08)", border: "1px solid rgba(180,83,9,0.25)" }}
          >
            <div className="flex items-center justify-between">
              <span className="font-jakarta text-xs font-semibold text-[var(--dark-brown-70)]">
                Menús especiales
              </span>
              <div className="w-8 h-8 rounded-full flex items-center justify-center bg-[#b45309] text-white">
                <Utensils size={16} />
              </div>
            </div>
            <div className="font-cormorant font-bold text-3xl sm:text-4xl text-[var(--dark-brown)]">
              {Object.values(dietaryBreakdown).reduce((a, b) => a + b, 0)}
            </div>
            <span className="font-jakarta text-[11px] text-[var(--dark-brown-70)]">
              Celíacos, vegetarianos, etc.
            </span>
          </div>

          {/* Card 4: No Asisten */}
          <div
            className="rounded-2xl p-4 sm:p-5 flex flex-col gap-2 shadow-xs"
            style={{ background: "rgba(220,38,38,0.06)", border: "1px solid rgba(220,38,38,0.2)" }}
          >
            <div className="flex items-center justify-between">
              <span className="font-jakarta text-xs font-semibold text-[var(--dark-brown-70)]">
                No podrán asistir
              </span>
              <div className="w-8 h-8 rounded-full flex items-center justify-center bg-[#dc2626] text-white">
                <XCircle size={16} />
              </div>
            </div>
            <div className="font-cormorant font-bold text-3xl sm:text-4xl text-[var(--dark-brown)]">
              {declinedRsvps.length}
            </div>
            <span className="font-jakarta text-[11px] text-[var(--dark-brown-70)]">
              Respuestas negativas
            </span>
          </div>
        </section>

        {/* Dietary breakdown detail pills */}
        {Object.keys(dietaryBreakdown).length > 0 && (
          <div
            className="rounded-2xl p-4 flex flex-wrap items-center gap-3"
            style={{ background: "rgba(253,251,247,0.9)", border: "1.5px solid rgba(197,155,39,0.25)" }}
          >
            <span className="font-jakarta font-bold text-xs uppercase tracking-wider text-[var(--gold)] flex items-center gap-1.5">
              <Utensils size={14} /> Detalle de menús para catering:
            </span>
            {Object.entries(dietaryBreakdown).map(([key, count]) => (
              <span
                key={key}
                className="font-jakarta text-xs px-3 py-1 rounded-full font-semibold bg-[#fff] border border-[rgba(197,155,39,0.3)] text-[var(--dark-brown)] shadow-2xs"
              >
                {DIETARY_LABELS[key as keyof typeof DIETARY_LABELS] || key}: <b>{count}</b>
              </span>
            ))}
          </div>
        )}

        {/* Duplicates Alert */}
        {duplicates.length > 0 && (
          <div
            className="rounded-2xl p-4 flex items-start gap-3 bg-amber-50 border border-amber-300 text-amber-900"
            role="alert"
          >
            <AlertTriangle size={20} className="text-amber-600 shrink-0 mt-0.5" />
            <div className="flex flex-col gap-1 text-xs sm:text-sm">
              <p className="font-bold">Posibles confirmaciones repetidas detectadas:</p>
              <p>
                Los siguientes nombres enviaron confirmación más de una vez:{" "}
                <span className="font-semibold">{duplicates.map((d) => `${d.name} (${d.records.length} veces)`).join(", ")}</span>.
                Revisá si son personas distintas o si confirmaron duplicado por error.
              </p>
            </div>
          </div>
        )}

        {/* Filters and Search Toolbar */}
        <section className="flex flex-col gap-3">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            {/* Search */}
            <div className="relative flex-1">
              <Search
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--dark-brown-40)]"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar por nombre, acompañante o saludo..."
                className="form-input text-xs sm:text-sm pl-10 pr-4 py-2.5 w-full"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[var(--dark-brown-40)] hover:text-[var(--dark-brown)]"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Actions: Export & Copy */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopySummary}
                className="btn-outline text-xs py-2 px-3.5 flex items-center gap-1.5 flex-1 sm:flex-none justify-center"
                title="Copiar lista para WhatsApp"
              >
                {copiedSummary ? <Check size={14} color="#16a34a" /> : <Copy size={14} />}
                {copiedSummary ? "Copiado" : "Copiar WhatsApp"}
              </button>
              <button
                onClick={handleExportCsv}
                className="btn-gold text-xs py-2 px-3.5 flex items-center gap-1.5 flex-1 sm:flex-none justify-center"
                title="Descargar planilla Excel/CSV"
              >
                <Download size={14} />
                Excel / CSV
              </button>

              {/* View mode toggle */}
              <div className="hidden md:flex items-center rounded-xl border border-[rgba(197,155,39,0.3)] bg-[rgba(253,251,247,0.8)] p-0.5">
                <button
                  onClick={() => setViewMode("cards")}
                  className={`p-1.5 rounded-lg transition-colors ${
                    viewMode === "cards" ? "bg-[var(--gold)] text-white" : "text-[var(--dark-brown-70)]"
                  }`}
                  title="Vista de Tarjetas"
                >
                  <LayoutGrid size={16} />
                </button>
                <button
                  onClick={() => setViewMode("table")}
                  className={`p-1.5 rounded-lg transition-colors ${
                    viewMode === "table" ? "bg-[var(--gold)] text-white" : "text-[var(--dark-brown-70)]"
                  }`}
                  title="Vista de Tabla"
                >
                  <TableIcon size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <button
              onClick={() => setFilter("all")}
              className={`text-xs px-3 py-1.5 rounded-full font-semibold transition-all ${
                filter === "all"
                  ? "bg-[var(--gold)] text-white shadow-xs"
                  : "bg-[rgba(197,155,39,0.1)] text-[var(--dark-brown)] hover:bg-[rgba(197,155,39,0.2)]"
              }`}
            >
              Todos los confirmados ({attendingRsvps.length})
            </button>
            <button
              onClick={() => setFilter("messages")}
              className={`text-xs px-3 py-1.5 rounded-full font-semibold transition-all ${
                filter === "messages"
                  ? "bg-[var(--gold)] text-white shadow-xs"
                  : "bg-[rgba(197,155,39,0.1)] text-[var(--dark-brown)] hover:bg-[rgba(197,155,39,0.2)]"
              }`}
            >
              Con dedicatorias ({rsvpsWithMessages.length})
            </button>
            <button
              onClick={() => setFilter("dietary")}
              className={`text-xs px-3 py-1.5 rounded-full font-semibold transition-all ${
                filter === "dietary"
                  ? "bg-[var(--gold)] text-white shadow-xs"
                  : "bg-[rgba(197,155,39,0.1)] text-[var(--dark-brown)] hover:bg-[rgba(197,155,39,0.2)]"
              }`}
            >
              Con menú especial ({Object.values(dietaryBreakdown).reduce((a, b) => a + b, 0)})
            </button>
            <button
              onClick={() => setFilter("declined")}
              className={`text-xs px-3 py-1.5 rounded-full font-semibold transition-all ${
                filter === "declined"
                  ? "bg-[#dc2626] text-white shadow-xs"
                  : "bg-red-50 text-red-700 hover:bg-red-100"
              }`}
            >
              No asisten ({declinedRsvps.length})
            </button>
          </div>
        </section>

        {/* Content list / cards */}
        {filteredList.length === 0 ? (
          <div className="rounded-3xl p-12 text-center flex flex-col items-center gap-3 bg-[rgba(253,251,247,0.8)] border border-[rgba(197,155,39,0.25)]">
            <span className="text-4xl">🔍</span>
            <p className="font-cormorant text-2xl font-bold text-[var(--dark-brown)]">
              No se encontraron resultados
            </p>
            <p className="font-jakarta text-xs text-[var(--dark-brown-70)]">
              Probá cambiando el filtro o término de búsqueda.
            </p>
          </div>
        ) : viewMode === "cards" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredList.map((rsvp) => {
              const companionsCount = rsvp.companionNames?.length ?? rsvp.companionsCount ?? 0;
              const totalLugares = 1 + companionsCount;
              const hasSpecialDiet = rsvp.dietaryRestrictions && rsvp.dietaryRestrictions !== "ninguna";

              return (
                <article
                  key={rsvp.id}
                  className="rounded-2xl p-5 flex flex-col justify-between gap-4 bg-[rgba(253,251,247,0.95)] border border-[rgba(197,155,39,0.25)] shadow-xs transition-transform hover:-translate-y-0.5"
                >
                  <div className="flex flex-col gap-2.5">
                    {/* Top row: Name & Lugares badge */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex flex-col">
                        <h3 className="font-jakarta font-bold text-base sm:text-lg text-[var(--dark-brown)]">
                          {rsvp.name}
                        </h3>
                        <span className="text-[11px] text-[var(--dark-brown-40)] font-medium">
                          {formatDate(rsvp.createdAt)}
                        </span>
                      </div>
                      <span
                        className={`text-xs px-2.5 py-1 rounded-full font-bold shrink-0 ${
                          rsvp.attending === "yes"
                            ? "bg-[rgba(197,155,39,0.15)] text-[var(--gold)] border border-[rgba(197,155,39,0.3)]"
                            : "bg-red-100 text-red-700 border border-red-200"
                        }`}
                      >
                        {rsvp.attending === "yes"
                          ? `${totalLugares} ${totalLugares === 1 ? "lugar" : "lugares"}`
                          : "No asiste"}
                      </span>
                    </div>

                    {/* Companions list */}
                    {companionsCount > 0 && (
                      <div className="text-xs text-[var(--dark-brown-70)] bg-[rgba(197,155,39,0.06)] rounded-xl p-2.5 border border-[rgba(197,155,39,0.15)]">
                        <span className="font-semibold text-[var(--gold)]">Acompañantes ({companionsCount}): </span>
                        {rsvp.companionNames && rsvp.companionNames.length > 0
                          ? rsvp.companionNames.join(", ")
                          : `+${companionsCount} integrantes`}
                      </div>
                    )}

                    {/* Dietary badge */}
                    {hasSpecialDiet && (
                      <div className="flex items-center gap-1.5">
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                          <Utensils size={11} />
                          {DIETARY_LABELS[rsvp.dietaryRestrictions as keyof typeof DIETARY_LABELS] || rsvp.dietaryRestrictions}
                        </span>
                      </div>
                    )}

                    {/* Message box */}
                    {rsvp.message && (
                      <div className="mt-1 rounded-xl p-3 bg-[rgba(212,163,115,0.08)] border-l-3 border-[var(--gold)] flex flex-col gap-1">
                        <div className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-[var(--gold)]">
                          <Heart size={11} className="fill-[var(--gold)]" />
                          Mensaje:
                        </div>
                        <p className="font-cormorant italic text-sm sm:text-base text-[var(--dark-brown)] leading-relaxed">
                          &ldquo;{rsvp.message}&rdquo;
                        </p>
                      </div>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          /* Table View */
          <div className="overflow-x-auto rounded-2xl border border-[rgba(197,155,39,0.25)] bg-[rgba(253,251,247,0.95)] shadow-xs">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-[rgba(197,155,39,0.2)] bg-[rgba(197,155,39,0.08)] font-jakarta text-[11px] uppercase tracking-wider text-[var(--dark-brown-70)]">
                  <th className="py-3 px-4">Titular</th>
                  <th className="py-3 px-4">Asistencia</th>
                  <th className="py-3 px-4">Lugares</th>
                  <th className="py-3 px-4">Acompañantes</th>
                  <th className="py-3 px-4">Menú</th>
                  <th className="py-3 px-4">Mensaje</th>
                  <th className="py-3 px-4">Fecha</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[rgba(197,155,39,0.15)] font-jakarta">
                {filteredList.map((r) => {
                  const compCount = r.companionNames?.length ?? r.companionsCount ?? 0;
                  return (
                    <tr key={r.id} className="hover:bg-[rgba(197,155,39,0.04)]">
                      <td className="py-3 px-4 font-bold text-[var(--dark-brown)]">{r.name}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`text-[11px] px-2 py-0.5 rounded-full font-semibold ${
                            r.attending === "yes" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                          }`}
                        >
                          {r.attending === "yes" ? "Sí" : "No"}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-bold">{1 + compCount}</td>
                      <td className="py-3 px-4 text-xs text-[var(--dark-brown-70)]">
                        {r.companionNames?.join(", ") || (compCount > 0 ? `+${compCount}` : "-")}
                      </td>
                      <td className="py-3 px-4">
                        {r.dietaryRestrictions && r.dietaryRestrictions !== "ninguna" ? (
                          <span className="text-[11px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-semibold">
                            {DIETARY_LABELS[r.dietaryRestrictions as keyof typeof DIETARY_LABELS] || r.dietaryRestrictions}
                          </span>
                        ) : (
                          <span className="text-xs text-[var(--dark-brown-40)]">Estándar</span>
                        )}
                      </td>
                      <td className="py-3 px-4 max-w-[240px] truncate text-xs italic text-[var(--dark-brown)]" title={r.message}>
                        {r.message || "-"}
                      </td>
                      <td className="py-3 px-4 text-[11px] text-[var(--dark-brown-40)] whitespace-nowrap">
                        {formatDate(r.createdAt)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
