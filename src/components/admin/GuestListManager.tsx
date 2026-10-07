"use client";

import { useState, useMemo } from "react";
import type { MasterGuest } from "@/lib/dal/guest-list";
import type { RsvpRecord } from "@/lib/schemas/rsvp.schema";
import { DIETARY_LABELS } from "@/lib/schemas/rsvp.schema";
import {
  addGuestAction,
  bulkAddGuestsAction,
  deleteGuestAction,
  clearAllGuestsAction,
} from "@/app/actions/guest-list-actions";
import {
  UserPlus,
  ClipboardList,
  Trash2,
  CheckCircle,
  Clock,
  XCircle,
  Copy,
  Check,
  Search,
  Users,
  Utensils,
  MessageSquare,
} from "lucide-react";

interface GuestListManagerProps {
  masterGuests: MasterGuest[];
  rsvps: RsvpRecord[];
}

interface MatchedGuestItem {
  id: string;
  guestName: string;
  guestId: string | null;
  status: "confirmed" | "declined" | "pending";
  matchedRsvp?: RsvpRecord;
  isMasterGuest: boolean;
}

function normalizeName(str: string): string {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

export default function GuestListManager({ masterGuests, rsvps }: GuestListManagerProps) {
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [showSingleInput, setShowSingleInput] = useState(false);
  const [isSubmittingBulk, setIsSubmittingBulk] = useState(false);
  const [isSubmittingSingle, setIsSubmittingSingle] = useState(false);
  const [filter, setFilter] = useState<"all" | "pending" | "confirmed" | "declined">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedPending, setCopiedPending] = useState(false);

  const handleBulkSubmit = async (formData: FormData) => {
    setIsSubmittingBulk(true);
    try {
      await bulkAddGuestsAction(formData);
      setShowBulkModal(false);
    } catch (err) {
      console.error("Error al cargar lista masiva:", err);
      alert("Ocurrió un error al guardar la lista. Intentá de nuevo.");
    } finally {
      setIsSubmittingBulk(false);
    }
  };

  const handleSingleSubmit = async (formData: FormData) => {
    setIsSubmittingSingle(true);
    try {
      await addGuestAction(formData);
      setShowSingleInput(false);
    } catch (err) {
      console.error("Error al agregar invitado:", err);
    } finally {
      setIsSubmittingSingle(false);
    }
  };


  // Match master guests with RSVPs AND include unmatched RSVPs
  const matchedList = useMemo<MatchedGuestItem[]>(() => {
    const matchedRsvpIds = new Set<string>();

    // 1. Map master guests
    const list: MatchedGuestItem[] = masterGuests.map((guest) => {
      const guestNorm = normalizeName(guest.name);

      const matchedRsvp = rsvps.find((r) => {
        const mainNorm = normalizeName(r.name);
        if (mainNorm === guestNorm || mainNorm.includes(guestNorm) || guestNorm.includes(mainNorm)) {
          return true;
        }

        if (r.companionNames && r.companionNames.length > 0) {
          return r.companionNames.some((c) => {
            const compNorm = normalizeName(c);
            return compNorm === guestNorm || compNorm.includes(guestNorm) || guestNorm.includes(compNorm);
          });
        }

        return false;
      });

      let status: "confirmed" | "declined" | "pending" = "pending";
      if (matchedRsvp) {
        status = matchedRsvp.attending === "yes" ? "confirmed" : "declined";
        matchedRsvpIds.add(matchedRsvp.id);
      }

      return {
        id: `master-${guest.id}`,
        guestName: guest.name,
        guestId: guest.id,
        status,
        matchedRsvp,
        isMasterGuest: true,
      };
    });

    // 2. Add unmatched RSVPs (so direct RSVPs always show up even if master list is empty)
    rsvps.forEach((rsvp) => {
      if (!matchedRsvpIds.has(rsvp.id)) {
        list.push({
          id: `rsvp-${rsvp.id}`,
          guestName: rsvp.name,
          guestId: null,
          status: rsvp.attending === "yes" ? "confirmed" : "declined",
          matchedRsvp: rsvp,
          isMasterGuest: false,
        });
      }
    });

    return list;
  }, [masterGuests, rsvps]);

  // Statistics
  const pendingCount = matchedList.filter((m) => m.status === "pending").length;

  // Real confirmed attendees count (titulares + acompañantes)
  const realConfirmedAttendees = useMemo(() => {
    return rsvps
      .filter((r) => r.attending === "yes")
      .reduce((sum, r) => sum + 1 + r.companionsCount, 0);
  }, [rsvps]);

  // Filtered display list
  const filteredList = useMemo(() => {
    return matchedList.filter(({ guestName, status }) => {
      if (filter !== "all" && status !== filter) return false;
      if (searchQuery.trim()) {
        const q = normalizeName(searchQuery);
        return normalizeName(guestName).includes(q);
      }
      return true;
    });
  }, [matchedList, filter, searchQuery]);

  // Pending guests names text for copying
  const pendingNames = useMemo(() => {
    return matchedList
      .filter((m) => m.status === "pending")
      .map((m) => m.guestName)
      .join("\n");
  }, [matchedList]);

  const handleCopyPending = async () => {
    if (!pendingNames) return;
    try {
      await navigator.clipboard.writeText(pendingNames);
      setCopiedPending(true);
      setTimeout(() => setCopiedPending(false), 2500);
    } catch {
      // Fallback
    }
  };

  return (
    <div className="flex flex-col gap-6 sm:gap-8 w-full">
      {/* 3 Main KPI Cards - Centered info & numbers, enhanced borders & margins */}
      <div className="grid grid-cols-3 gap-2.5 sm:gap-5 w-full">
        {/* CARD 1: EN LISTA */}
        <button
          type="button"
          onClick={() => setFilter("all")}
          className={`rounded-2xl p-3.5 sm:p-6 flex flex-col items-center justify-center text-center transition-all cursor-pointer border-2 w-full min-w-0 ${
            filter === "all"
              ? "border-[var(--gold)] bg-[rgba(197,155,39,0.18)] shadow-md scale-[1.02] ring-2 ring-[var(--gold)]/40"
              : "border-[rgba(197,155,39,0.35)] bg-[rgba(197,155,39,0.06)] hover:bg-[rgba(197,155,39,0.14)] hover:border-[var(--gold)]"
          }`}
        >
          <div className="flex items-center justify-center text-center gap-1.5 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[var(--gold)] mb-1.5 w-full">
            <Users size={15} className="shrink-0" />
            <span>EN LISTA</span>
          </div>
          <span className="font-cormorant font-bold text-3xl sm:text-5xl text-[var(--dark-brown)] leading-none my-1.5 text-center w-full block">
            {masterGuests.length}
          </span>
          <span className="text-[10px] sm:text-xs text-[var(--dark-brown-70)] font-medium leading-tight text-center w-full block">
            {masterGuests.length === 1 ? "invitado" : "invitados en total"}
          </span>
        </button>

        {/* CARD 2: CONFIRMADOS REALES */}
        <button
          type="button"
          onClick={() => setFilter("confirmed")}
          className={`rounded-2xl p-3.5 sm:p-6 flex flex-col items-center justify-center text-center transition-all cursor-pointer border-2 w-full min-w-0 ${
            filter === "confirmed"
              ? "border-emerald-500 bg-emerald-100 shadow-md scale-[1.02] ring-2 ring-emerald-500/40"
              : "border-emerald-300 bg-emerald-50/80 hover:bg-emerald-100/70 hover:border-emerald-400"
          }`}
        >
          <div className="flex items-center justify-center text-center gap-1.5 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-emerald-700 mb-1.5 w-full">
            <CheckCircle size={15} className="shrink-0" />
            <span>CONFIRMADOS</span>
          </div>
          <span className="font-cormorant font-bold text-3xl sm:text-5xl text-emerald-700 leading-none my-1.5 text-center w-full block">
            {realConfirmedAttendees}
          </span>
          <span className="text-[10px] sm:text-xs text-emerald-800/90 font-medium leading-tight text-center w-full block">
            asistentes (tit. + acomp.)
          </span>
        </button>

        {/* CARD 3: FALTAN CONFIRMAR */}
        <button
          type="button"
          onClick={() => setFilter("pending")}
          className={`rounded-2xl p-3.5 sm:p-6 flex flex-col items-center justify-center text-center transition-all cursor-pointer border-2 w-full min-w-0 ${
            filter === "pending"
              ? "border-amber-500 bg-amber-100 shadow-md scale-[1.02] ring-2 ring-amber-500/40"
              : "border-amber-300 bg-amber-50/80 hover:bg-amber-100/70 hover:border-amber-400"
          }`}
        >
          <div className="flex items-center justify-center text-center gap-1.5 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-amber-700 mb-1.5 w-full">
            <Clock size={15} className="shrink-0" />
            <span>FALTAN</span>
          </div>
          <span className="font-cormorant font-bold text-3xl sm:text-5xl text-amber-800 leading-none my-1.5 text-center w-full block">
            {pendingCount}
          </span>
          <span className="text-[10px] sm:text-xs text-amber-800/90 font-medium leading-tight text-center w-full block">
            sin responder
          </span>
        </button>
      </div>

      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4 rounded-2xl bg-[rgba(197,155,39,0.06)] border-2 border-[rgba(197,155,39,0.3)] shadow-xs">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setShowBulkModal(true)}
            className="btn-gold text-xs sm:text-sm py-2.5 px-4 flex items-center justify-center gap-2 w-full sm:w-auto"
          >
            <ClipboardList size={16} />
            Cargar lista masiva
          </button>
          <button
            type="button"
            onClick={() => setShowSingleInput(!showSingleInput)}
            className="btn-outline text-xs sm:text-sm py-2.5 px-4 flex items-center justify-center gap-2 w-full sm:w-auto"
          >
            <UserPlus size={16} />
            + Agregar individual
          </button>
        </div>

        {pendingCount > 0 && (
          <button
            type="button"
            onClick={handleCopyPending}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-full font-jakarta font-semibold text-xs bg-amber-100 text-amber-900 border-2 border-amber-300 hover:bg-amber-200 transition-colors cursor-pointer w-full sm:w-auto shadow-xs"
          >
            {copiedPending ? (
              <>
                <Check size={15} color="#16a34a" /> ¡Nombres copiados!
              </>
            ) : (
              <>
                <Copy size={15} /> Copiar faltantes ({pendingCount})
              </>
            )}
          </button>
        )}
      </div>

      {/* Single Guest Add Form */}
      {showSingleInput && (
        <form action={handleSingleSubmit} className="flex flex-col sm:flex-row gap-2.5 animate-scale-in p-4 rounded-2xl bg-[var(--cream-2)] border-2 border-[rgba(197,155,39,0.35)] shadow-xs">
          <input
            name="name"
            type="text"
            required
            disabled={isSubmittingSingle}
            placeholder="Nombre y Apellido del invitado"
            className="form-input flex-1 text-sm py-2.5"
          />
          <button type="submit" disabled={isSubmittingSingle} className="btn-gold px-5 py-2.5 text-xs sm:text-sm shrink-0 justify-center">
            {isSubmittingSingle ? "Guardando..." : "Guardar"}
          </button>
        </form>
      )}

      {/* Bulk Add Modal */}
      {showBulkModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="glass-card max-w-lg w-full p-5 sm:p-8 flex flex-col gap-4 sm:gap-5 animate-scale-in max-h-[90vh] overflow-y-auto">
            <h3 className="font-cormorant font-bold text-xl sm:text-2xl text-[var(--dark-brown)]">
              Cargar lista masiva de invitados
            </h3>
            <p className="font-jakarta text-xs sm:text-sm text-[var(--dark-brown-70)]">
              Pegá o escribí los nombres de tus invitados, <strong>un nombre por línea</strong> (o separados por coma):
            </p>
            <form action={handleBulkSubmit} className="flex flex-col gap-4">
              <textarea
                name="rawList"
                rows={7}
                required
                disabled={isSubmittingBulk}
                placeholder="Juan Pérez&#10;María González&#10;Carlos Rodríguez..."
                className="form-input text-sm p-3.5 resize-none"
              />
              <div className="flex justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  disabled={isSubmittingBulk}
                  onClick={() => setShowBulkModal(false)}
                  className="btn-outline px-4 py-2 text-xs sm:text-sm"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingBulk}
                  className="btn-gold px-5 py-2 text-xs sm:text-sm"
                >
                  {isSubmittingBulk ? "Cargando lista..." : "Cargar lista"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Search Bar */}
      <div className="relative w-full">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--dark-brown-40)]" />
        <input
          type="search"
          placeholder="Buscar invitado por nombre..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="form-input pl-11 pr-4 py-3 text-sm w-full border-2 border-[rgba(197,155,39,0.35)] rounded-2xl shadow-xs"
        />
      </div>

      {/* Filter status indicator header */}
      <div className="flex items-center justify-between px-1 text-xs font-jakarta text-[var(--dark-brown-70)] font-semibold">
        <span>
          Viendo:{" "}
          <strong className="text-[var(--gold)] capitalize">
            {filter === "all"
              ? "Todos los invitados"
              : filter === "confirmed"
              ? "Confirmados"
              : filter === "pending"
              ? "Faltan confirmar"
              : "No asisten"}
          </strong>{" "}
          ({filteredList.length})
        </span>

        {filter !== "all" && (
          <button
            type="button"
            onClick={() => setFilter("all")}
            className="text-[var(--gold)] underline text-xs font-semibold cursor-pointer hover:opacity-80"
          >
            Ver todos ({matchedList.length})
          </button>
        )}
      </div>

      {/* ─── MOBILE VIEW: CARDS (DISPLAYED ONLY ON MOBILE < 640px) ─── */}
      <div className="flex flex-col gap-4 sm:hidden w-full">
        {filteredList.length === 0 ? (
          <div className="text-center py-10 px-4 rounded-2xl bg-[var(--cream-2)] border-2 border-dashed border-[rgba(197,155,39,0.3)] font-jakarta text-xs text-[var(--dark-brown-40)]">
            {masterGuests.length === 0 && rsvps.length === 0
              ? "Aún no cargaste ninguna lista de invitados ni hay respuestas. Tocá 'Cargar lista masiva' para empezar."
              : "No se encontraron invitados con el filtro seleccionado."}
          </div>
        ) : (
          filteredList.map(({ id, guestName, guestId, status, matchedRsvp }) => (
            <div
              key={id}
              className={`rounded-2xl p-4 sm:p-5 flex flex-col gap-3.5 shadow-xs border-2 transition-all ${
                status === "confirmed"
                  ? "bg-emerald-50/40 border-emerald-300 hover:border-emerald-500"
                  : status === "declined"
                  ? "bg-red-50/40 border-red-300 hover:border-red-500"
                  : "bg-[var(--cream-2)] border-[rgba(197,155,39,0.35)] hover:border-[var(--gold)]"
              }`}
            >
              {/* Header: Badge & Delete Button */}
              <div className="flex items-center justify-between gap-2 border-b border-dashed border-[rgba(197,155,39,0.2)] pb-2.5">
                <div className="flex items-center gap-2">
                  {status === "confirmed" && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                      <CheckCircle size={13} /> Confirmado {matchedRsvp && matchedRsvp.companionsCount > 0 ? `(${1 + matchedRsvp.companionsCount} pers.)` : "(1 pers.)"}
                    </span>
                  )}
                  {status === "declined" && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800 border border-red-300">
                      <XCircle size={13} /> No asiste
                    </span>
                  )}
                  {status === "pending" && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
                      <Clock size={13} /> Pendiente
                    </span>
                  )}
                </div>

                {/* Delete form for ANY guest or RSVP entry */}
                <form
                  action={deleteGuestAction}
                  onSubmit={(e) => {
                    if (!confirm(`¿Seguro que querés eliminar a ${guestName}?`)) {
                      e.preventDefault();
                    }
                  }}
                  className="shrink-0"
                >
                  {guestId && <input type="hidden" name="id" value={guestId} />}
                  {matchedRsvp?.id && <input type="hidden" name="rsvpId" value={matchedRsvp.id} />}
                  <button
                    type="submit"
                    className="p-1.5 rounded-lg text-[var(--dark-brown-40)] hover:text-red-600 hover:bg-red-100 transition-colors cursor-pointer"
                    title="Eliminar registro"
                  >
                    <Trash2 size={16} />
                  </button>
                </form>
              </div>

              {/* NAMES BLOCK - ALL NAMES RENDERED WITH EQUAL FONT SIZE (text-base sm:text-lg font-bold) */}
              <div className="flex flex-col gap-2">
                {/* Principal Guest Name */}
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-jakarta font-bold text-base sm:text-lg text-[var(--dark-brown)] break-words leading-snug">
                    {guestName}
                  </span>
                  <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-md bg-[rgba(197,155,39,0.12)] text-[var(--gold)] border border-[rgba(197,155,39,0.25)]">
                    Titular
                  </span>
                </div>

                {/* Companion Names (SAME FONT SIZE AND WEIGHT) */}
                {matchedRsvp?.companionNames && matchedRsvp.companionNames.length > 0 ? (
                  matchedRsvp.companionNames.map((companionName, idx) => (
                    <div key={idx} className="flex items-center gap-2 flex-wrap pt-1.5 border-t border-dashed border-[rgba(197,155,39,0.15)]">
                      <span className="font-jakarta font-bold text-base sm:text-lg text-[var(--dark-brown)] break-words leading-snug">
                        {companionName}
                      </span>
                      <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 border border-amber-300">
                        Acompañante
                      </span>
                    </div>
                  ))
                ) : matchedRsvp && matchedRsvp.companionsCount > 0 ? (
                  <div className="flex items-center gap-2 flex-wrap pt-1.5 border-t border-dashed border-[rgba(197,155,39,0.15)]">
                    <span className="font-jakarta font-bold text-base sm:text-lg text-[var(--dark-brown)] break-words leading-snug">
                      + {matchedRsvp.companionsCount} Acompañante{matchedRsvp.companionsCount > 1 ? "s" : ""}
                    </span>
                    <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 border border-amber-300">
                      Acompañante
                    </span>
                  </div>
                ) : null}
              </div>

              {/* RSVP Details (Dietary restrictions & Messages) */}
              {matchedRsvp && (
                <div className="flex flex-col gap-2 pt-2 border-t border-[rgba(197,155,39,0.15)] text-xs">
                  {matchedRsvp.dietaryRestrictions && matchedRsvp.dietaryRestrictions !== "ninguna" && (
                    <div className="flex items-center gap-2 text-amber-900 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200/80 font-medium">
                      <Utensils size={14} className="shrink-0 text-amber-700" />
                      <span>Menú especial: <strong>{DIETARY_LABELS[matchedRsvp.dietaryRestrictions]}</strong></span>
                    </div>
                  )}
                  {matchedRsvp.message && (
                    <div className="flex items-start gap-2 italic text-[var(--dark-brown-70)] bg-[rgba(197,155,39,0.06)] p-2.5 rounded-xl border border-[rgba(197,155,39,0.18)]">
                      <MessageSquare size={14} className="shrink-0 mt-0.5 text-[var(--gold)]" />
                      <span>"{matchedRsvp.message}"</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* ─── DESKTOP VIEW: TABLE (DISPLAYED ONLY ON SCREENS >= 640px) ─── */}
      <div className="hidden sm:block rounded-2xl overflow-hidden border-2 border-[rgba(197,155,39,0.3)] w-full shadow-xs bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[linear-gradient(135deg,rgba(197,155,39,0.15),rgba(212,163,115,0.15))] border-b-2 border-[rgba(197,155,39,0.25)]">
                <th className="px-5 py-4 font-jakarta font-bold text-xs uppercase tracking-wider text-[var(--dark-brown)]">
                  Invitados (Titular / Acompañante)
                </th>
                <th className="px-5 py-4 font-jakarta font-bold text-xs uppercase tracking-wider text-[var(--dark-brown)]">
                  Estado
                </th>
                <th className="px-5 py-4 font-jakarta font-bold text-xs uppercase tracking-wider text-[var(--dark-brown)]">
                  Detalles RSVP (Menú / Mensaje)
                </th>
                <th className="px-5 py-4 font-jakarta font-bold text-xs uppercase tracking-wider text-[var(--dark-brown)] text-right">
                  Acción
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredList.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-10 font-jakarta text-sm text-[var(--dark-brown-40)]">
                    {masterGuests.length === 0 && rsvps.length === 0
                      ? "Aún no cargaste ninguna lista de invitados ni hay respuestas. Tocá 'Cargar lista masiva' para empezar."
                      : "No se encontraron invitados con los filtros seleccionados."}
                  </td>
                </tr>
              ) : (
                filteredList.map(({ id, guestName, guestId, status, matchedRsvp }, idx) => (
                  <tr
                    key={id}
                    className={`border-b border-[rgba(197,155,39,0.15)] transition-colors hover:bg-[rgba(197,155,39,0.04)] ${
                      idx % 2 === 0 ? "bg-[var(--cream)]" : "bg-[var(--cream-2)]"
                    }`}
                  >
                    {/* Names column with EQUAL FONT SIZES for principal and companion */}
                    <td className="px-5 py-4 font-jakarta">
                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-base text-[var(--dark-brown)]">
                            {guestName}
                          </span>
                          <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-md bg-[rgba(197,155,39,0.12)] text-[var(--gold)] border border-[rgba(197,155,39,0.25)]">
                            Titular
                          </span>
                        </div>

                        {matchedRsvp?.companionNames && matchedRsvp.companionNames.length > 0 ? (
                          matchedRsvp.companionNames.map((companionName, i) => (
                            <div key={i} className="flex items-center gap-2 pt-0.5">
                              <span className="font-bold text-base text-[var(--dark-brown)]">
                                {companionName}
                              </span>
                              <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 border border-amber-300">
                                Acompañante
                              </span>
                            </div>
                          ))
                        ) : matchedRsvp && matchedRsvp.companionsCount > 0 ? (
                          <div className="flex items-center gap-2 pt-0.5">
                            <span className="font-bold text-base text-[var(--dark-brown)]">
                              + {matchedRsvp.companionsCount} Acompañante{matchedRsvp.companionsCount > 1 ? "s" : ""}
                            </span>
                            <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 border border-amber-300">
                              Acompañante
                            </span>
                          </div>
                        ) : null}
                      </div>
                    </td>

                    {/* Status column */}
                    <td className="px-5 py-4">
                      {status === "confirmed" && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                          <CheckCircle size={13} /> Confirmado
                        </span>
                      )}
                      {status === "declined" && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800 border border-red-300">
                          <XCircle size={13} /> No asiste
                        </span>
                      )}
                      {status === "pending" && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
                          <Clock size={13} /> Pendiente
                        </span>
                      )}
                    </td>

                    {/* RSVP Details column */}
                    <td className="px-5 py-4 font-jakarta text-xs text-[var(--dark-brown-70)]">
                      {matchedRsvp ? (
                        <div className="flex flex-col gap-1.5">
                          {matchedRsvp.dietaryRestrictions && matchedRsvp.dietaryRestrictions !== "ninguna" && (
                            <span className="text-xs text-amber-900 font-semibold flex items-center gap-1.5 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200/80 w-fit">
                              <Utensils size={13} className="text-amber-700" /> Dieta: {DIETARY_LABELS[matchedRsvp.dietaryRestrictions]}
                            </span>
                          )}

                          {matchedRsvp.message ? (
                            <span className="text-xs italic text-[var(--dark-brown-70)] flex items-start gap-1">
                              <MessageSquare size={13} className="shrink-0 mt-0.5 text-[var(--gold)]" />
                              "{matchedRsvp.message}"
                            </span>
                          ) : (
                            <span className="opacity-40">— Sin mensaje —</span>
                          )}
                        </div>
                      ) : (
                        <span className="opacity-40">— Sin respuesta —</span>
                      )}
                    </td>

                    {/* Action column */}
                    <td className="px-5 py-4 text-right">
                      <form
                        action={deleteGuestAction}
                        onSubmit={(e) => {
                          if (!confirm(`¿Seguro que querés eliminar a ${guestName}?`)) {
                            e.preventDefault();
                          }
                        }}
                        className="inline"
                      >
                        {guestId && <input type="hidden" name="id" value={guestId} />}
                        {matchedRsvp?.id && <input type="hidden" name="rsvpId" value={matchedRsvp.id} />}
                        <button
                          type="submit"
                          className="p-1.5 rounded-lg text-[var(--dark-brown-40)] hover:text-red-600 hover:bg-red-100 transition-colors cursor-pointer"
                          title="Eliminar registro"
                        >
                          <Trash2 size={16} />
                        </button>
                      </form>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {masterGuests.length > 0 && (
        <div className="flex justify-end pt-1">
          <form action={clearAllGuestsAction} onSubmit={(e) => {
            if (!confirm("¿Seguro que querés vaciar toda la lista de invitados?")) {
              e.preventDefault();
            }
          }}>
            <button
              type="submit"
              className="text-xs font-semibold text-red-600 opacity-60 hover:opacity-100 flex items-center gap-1 cursor-pointer"
            >
              <Trash2 size={13} />
              Vaciar lista completa de invitados
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
