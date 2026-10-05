"use client";

import { useState, useMemo } from "react";
import type { MasterGuest } from "@/lib/dal/guest-list";
import type { RsvpRecord } from "@/lib/schemas/rsvp.schema";
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
} from "lucide-react";

interface GuestListManagerProps {
  masterGuests: MasterGuest[];
  rsvps: RsvpRecord[];
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
  const [filter, setFilter] = useState<"all" | "pending" | "confirmed" | "declined">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedPending, setCopiedPending] = useState(false);

  // Match master guests with RSVPs
  const matchedList = useMemo(() => {
    return masterGuests.map((guest) => {
      const guestNorm = normalizeName(guest.name);

      // Search RSVP by main name or companion names
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
      }

      return {
        guest,
        status,
        matchedRsvp,
      };
    });
  }, [masterGuests, rsvps]);

  // Statistics
  const pendingCount = matchedList.filter((m) => m.status === "pending").length;
  const confirmedCount = matchedList.filter((m) => m.status === "confirmed").length;
  const declinedCount = matchedList.filter((m) => m.status === "declined").length;
  
  // Real confirmed attendees count (titulares + acompañantes)
  const realConfirmedAttendees = useMemo(() => {
    return rsvps
      .filter((r) => r.attending === "yes")
      .reduce((sum, r) => sum + 1 + r.companionsCount, 0);
  }, [rsvps]);

  // Filtered display list
  const filteredList = useMemo(() => {
    return matchedList.filter(({ guest, status }) => {
      if (filter !== "all" && status !== filter) return false;
      if (searchQuery.trim()) {
        const q = normalizeName(searchQuery);
        return normalizeName(guest.name).includes(q);
      }
      return true;
    });
  }, [matchedList, filter, searchQuery]);

  // Pending guests names text for copying
  const pendingNames = useMemo(() => {
    return matchedList
      .filter((m) => m.status === "pending")
      .map((m) => m.guest.name)
      .join("\n");
  }, [matchedList]);

  const handleCopyPending = async () => {
    if (!pendingNames) return;
    try {
      await navigator.clipboard.writeText(pendingNames);
      setCopiedPending(true);
      setTimeout(() => setCopiedPending(null as unknown as boolean), 2500);
    } catch {
      // Fallback
    }
  };

  return (
    <div className="flex flex-col gap-6 sm:gap-8 w-full">
      {/* 3 Main KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        {/* CARD 1: EN LISTA */}
        <div
          className="rounded-2xl p-4 sm:p-5 flex flex-col gap-1.5 shadow-xs"
          style={{ background: "rgba(197,155,39,0.1)", border: "1.5px solid rgba(197,155,39,0.35)" }}
        >
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[var(--gold)]">
            <span>En Lista</span>
            <Users size={16} />
          </div>
          <span className="font-cormorant font-bold text-3xl sm:text-5xl text-[var(--dark-brown)] leading-none my-1">
            {masterGuests.length}
          </span>
          <span className="text-xs text-[var(--dark-brown-40)] font-medium">invitados cargados en lista</span>
        </div>

        {/* CARD 2: CONFIRMADOS REALES */}
        <div
          className="rounded-2xl p-4 sm:p-5 flex flex-col gap-1.5 shadow-xs"
          style={{ background: "rgba(22,163,74,0.12)", border: "1.5px solid rgba(22,163,74,0.35)" }}
        >
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#16a34a]">
            <span>Confirmados Reales</span>
            <CheckCircle size={16} />
          </div>
          <span className="font-cormorant font-bold text-3xl sm:text-5xl text-[#16a34a] leading-none my-1">
            {realConfirmedAttendees}
          </span>
          <span className="text-xs text-[var(--dark-brown-40)] font-medium">personas que van (titulares + acompañantes)</span>
        </div>

        {/* CARD 3: FALTAN CONFIRMAR */}
        <div
          className="rounded-2xl p-4 sm:p-5 flex flex-col gap-1.5 shadow-xs"
          style={{ background: "rgba(234,179,8,0.12)", border: "1.5px solid rgba(234,179,8,0.4)" }}
        >
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#ca8a04]">
            <span>Faltan Confirmar</span>
            <Clock size={16} />
          </div>
          <span className="font-cormorant font-bold text-3xl sm:text-5xl text-[var(--dark-brown)] leading-none my-1">
            {pendingCount}
          </span>
          <span className="text-xs text-[var(--dark-brown-40)] font-medium">invitados sin responder aún</span>
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4 sm:p-5 rounded-2xl bg-[rgba(197,155,39,0.06)] border border-[rgba(197,155,39,0.25)]">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setShowBulkModal(true)}
            className="btn-gold text-xs sm:text-sm py-3 sm:py-2.5 px-4 flex items-center justify-center gap-2 w-full sm:w-auto"
          >
            <ClipboardList size={16} />
            Cargar lista masiva
          </button>
          <button
            type="button"
            onClick={() => setShowSingleInput(!showSingleInput)}
            className="btn-outline text-xs sm:text-sm py-3 sm:py-2.5 px-4 flex items-center justify-center gap-2 w-full sm:w-auto"
          >
            <UserPlus size={16} />
            + Agregar individual
          </button>
        </div>

        {pendingCount > 0 && (
          <button
            type="button"
            onClick={handleCopyPending}
            className="flex items-center justify-center gap-2 px-4 py-3 sm:py-2.5 rounded-xl font-jakarta font-semibold text-xs sm:text-sm bg-[rgba(234,179,8,0.15)] text-[#854d0e] border border-[rgba(234,179,8,0.4)] hover:bg-[rgba(234,179,8,0.25)] transition-colors cursor-pointer w-full sm:w-auto"
          >
            {copiedPending ? (
              <>
                <Check size={16} color="#16a34a" /> ¡Nombres copiados!
              </>
            ) : (
              <>
                <Copy size={16} /> Copiar faltantes ({pendingCount})
              </>
            )}
          </button>
        )}
      </div>

      {/* Single Guest Add Form */}
      {showSingleInput && (
        <form action={addGuestAction} className="flex flex-col sm:flex-row gap-2 animate-scale-in p-4 rounded-2xl bg-[var(--cream-2)] border border-[rgba(197,155,39,0.3)]">
          <input
            name="name"
            type="text"
            required
            placeholder="Nombre y Apellido del invitado"
            className="form-input flex-1 text-sm py-2.5"
          />
          <button type="submit" className="btn-gold px-5 py-2.5 text-xs sm:text-sm shrink-0 justify-center">
            Guardar
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
              Pegá o escribí los nombres de tus invitados, <strong>un nombre por línea</strong>:
            </p>
            <form action={bulkAddGuestsAction} className="flex flex-col gap-4">
              <textarea
                name="rawList"
                rows={7}
                required
                placeholder="Juan Pérez&#10;María González&#10;Carlos Rodríguez..."
                className="form-input text-sm p-3.5 resize-none"
              />
              <div className="flex justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setShowBulkModal(false)}
                  className="btn-outline px-4 py-2 text-xs sm:text-sm"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  onClick={() => setShowBulkModal(false)}
                  className="btn-gold px-5 py-2 text-xs sm:text-sm"
                >
                  Cargar lista
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Search & Filter Controls */}
      <div className="flex flex-col gap-3">
        {/* Search */}
        <div className="relative w-full">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--dark-brown-40)]" />
          <input
            type="search"
            placeholder="Buscar en lista por nombre..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="form-input pl-10 py-2.5 text-sm w-full"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 w-full no-scrollbar">
          {(["all", "pending", "confirmed", "declined"] as const).map((f) => {
            const labels = {
              all: `Todos (${matchedList.length})`,
              pending: `Faltan (${pendingCount})`,
              confirmed: `Confirmados (${confirmedCount})`,
              declined: `No asisten (${declinedCount})`,
            };
            const isActive = filter === f;
            return (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-full font-jakarta text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer shrink-0 ${
                  isActive
                    ? "bg-[var(--gold)] text-white shadow-xs"
                    : "bg-[rgba(197,155,39,0.08)] text-[var(--dark-brown-70)] hover:bg-[rgba(197,155,39,0.18)]"
                }`}
              >
                {labels[f]}
              </button>
            );
          })}
        </div>
      </div>

      {/* ─── MOBILE VIEW: CARDS (DISPLAYED ONLY ON MOBILE < 640px) ─── */}
      <div className="flex flex-col gap-2.5 sm:hidden w-full">
        {filteredList.length === 0 ? (
          <div className="text-center py-8 px-4 rounded-2xl bg-[var(--cream-2)] border border-[rgba(197,155,39,0.2)] font-jakarta text-xs text-[var(--dark-brown-40)]">
            {masterGuests.length === 0
              ? "Aún no cargaste ninguna lista de invitados. Tocá 'Cargar lista masiva' para empezar."
              : "No se encontraron invitados con los filtros seleccionados."}
          </div>
        ) : (
          filteredList.map(({ guest, status, matchedRsvp }) => (
            <div
              key={guest.id}
              className="p-3.5 rounded-2xl border border-[rgba(197,155,39,0.25)] bg-[var(--cream-2)] flex flex-col gap-2 shadow-xs"
            >
              <div className="flex items-start justify-between gap-2">
                <span className="font-jakarta font-bold text-sm text-[var(--dark-brown)] break-words leading-snug">
                  {guest.name}
                </span>
                <form action={deleteGuestAction} className="shrink-0 pt-0.5">
                  <input type="hidden" name="id" value={guest.id} />
                  <button
                    type="submit"
                    className="p-1 text-[var(--dark-brown-40)] hover:text-red-600 transition-colors cursor-pointer"
                    title="Eliminar de la lista"
                  >
                    <Trash2 size={16} />
                  </button>
                </form>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[rgba(197,155,39,0.15)] text-xs">
                <div>
                  {status === "confirmed" && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700 border border-emerald-300">
                      <CheckCircle size={12} /> Confirmado
                    </span>
                  )}
                  {status === "declined" && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-700 border border-red-300">
                      <XCircle size={12} /> No asiste
                    </span>
                  )}
                  {status === "pending" && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-700 border border-amber-300">
                      <Clock size={12} /> Pendiente
                    </span>
                  )}
                </div>

                {matchedRsvp && (
                  <span className="font-jakarta text-[11px] text-[var(--dark-brown-70)] font-medium">
                    RSVP: <strong>{matchedRsvp.name}</strong>
                    {matchedRsvp.companionsCount > 0 ? ` (+${matchedRsvp.companionsCount})` : ""}
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* ─── DESKTOP VIEW: TABLE (DISPLAYED ONLY ON SCREENS >= 640px) ─── */}
      <div className="hidden sm:block rounded-2xl overflow-hidden border border-[rgba(197,155,39,0.2)] w-full">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[linear-gradient(135deg,rgba(197,155,39,0.12),rgba(212,163,115,0.12))] border-b border-[rgba(197,155,39,0.2)]">
                <th className="px-4 py-3.5 font-jakarta font-semibold text-xs uppercase tracking-wider text-[var(--dark-brown-70)]">
                  Invitado en Lista
                </th>
                <th className="px-4 py-3.5 font-jakarta font-semibold text-xs uppercase tracking-wider text-[var(--dark-brown-70)]">
                  Estado
                </th>
                <th className="px-4 py-3.5 font-jakarta font-semibold text-xs uppercase tracking-wider text-[var(--dark-brown-70)]">
                  Detalle RSVP
                </th>
                <th className="px-4 py-3.5 font-jakarta font-semibold text-xs uppercase tracking-wider text-[var(--dark-brown-70)] text-right">
                  Acción
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredList.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-10 font-jakarta text-sm text-[var(--dark-brown-40)]">
                    {masterGuests.length === 0
                      ? "Aún no cargaste ninguna lista de invitados. Tocá 'Cargar lista masiva' para empezar."
                      : "No se encontraron invitados con los filtros seleccionados."}
                  </td>
                </tr>
              ) : (
                filteredList.map(({ guest, status, matchedRsvp }, idx) => (
                  <tr
                    key={guest.id}
                    className={`border-b border-[rgba(197,155,39,0.1)] ${
                      idx % 2 === 0 ? "bg-[var(--cream)]" : "bg-[var(--cream-2)]"
                    }`}
                  >
                    <td className="px-4 py-3 font-jakarta font-semibold text-sm text-[var(--dark-brown)]">
                      {guest.name}
                    </td>

                    <td className="px-4 py-3">
                      {status === "confirmed" && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700 border border-emerald-300">
                          <CheckCircle size={12} /> Confirmado
                        </span>
                      )}
                      {status === "declined" && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700 border border-red-300">
                          <XCircle size={12} /> No asiste
                        </span>
                      )}
                      {status === "pending" && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-700 border border-amber-300">
                          <Clock size={12} /> Pendiente
                        </span>
                      )}
                    </td>

                    <td className="px-4 py-3 font-jakarta text-xs text-[var(--dark-brown-70)]">
                      {matchedRsvp ? (
                        <div className="flex flex-col gap-0.5">
                          <span>
                            RSVP por: <strong>{matchedRsvp.name}</strong>
                          </span>
                          {matchedRsvp.companionsCount > 0 && (
                            <span className="text-[11px] opacity-75">
                              (+{matchedRsvp.companionsCount} acompañantes)
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="opacity-40">— Sin respuesta —</span>
                      )}
                    </td>

                    <td className="px-4 py-3 text-right">
                      <form action={deleteGuestAction} className="inline">
                        <input type="hidden" name="id" value={guest.id} />
                        <button
                          type="submit"
                          className="p-1.5 text-[var(--dark-brown-40)] hover:text-red-600 transition-colors cursor-pointer"
                          title="Eliminar de la lista"
                        >
                          <Trash2 size={15} />
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
