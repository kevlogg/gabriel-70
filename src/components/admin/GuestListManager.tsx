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
  const [filter, setFilter] = useState<"all" | "pending" | "confirmed" | "declined">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedPending, setCopiedPending] = useState(false);

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
    <div className="flex flex-col gap-5 sm:gap-6 w-full">
      {/* 3 Main KPI Cards - Side-by-side horizontally on ALL screen sizes */}
      <div className="grid grid-cols-3 gap-2 sm:gap-4 w-full">
        {/* CARD 1: EN LISTA */}
        <button
          type="button"
          onClick={() => setFilter("all")}
          className={`rounded-xl sm:rounded-2xl p-2.5 sm:p-5 flex flex-col justify-between text-left transition-all cursor-pointer ${
            filter === "all"
              ? "ring-2 ring-[var(--gold)] bg-[rgba(197,155,39,0.18)] shadow-sm scale-[1.01]"
              : "bg-[rgba(197,155,39,0.08)] hover:bg-[rgba(197,155,39,0.14)] border border-[rgba(197,155,39,0.25)]"
          }`}
        >
          <div className="flex items-center justify-between text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[var(--gold)]">
            <span className="truncate">EN LISTA</span>
            <Users size={14} className="hidden sm:block shrink-0" />
          </div>
          <span className="font-cormorant font-bold text-2xl sm:text-4xl text-[var(--dark-brown)] leading-none my-1">
            {masterGuests.length}
          </span>
          <span className="text-[10px] sm:text-xs text-[var(--dark-brown-70)] font-medium truncate">
            {masterGuests.length === 1 ? "invitado" : "invitados"}
          </span>
        </button>

        {/* CARD 2: CONFIRMADOS REALES */}
        <button
          type="button"
          onClick={() => setFilter("confirmed")}
          className={`rounded-xl sm:rounded-2xl p-2.5 sm:p-5 flex flex-col justify-between text-left transition-all cursor-pointer ${
            filter === "confirmed"
              ? "ring-2 ring-emerald-600 bg-emerald-100 shadow-sm scale-[1.01]"
              : "bg-emerald-50/70 hover:bg-emerald-100/60 border border-emerald-200"
          }`}
        >
          <div className="flex items-center justify-between text-[10px] sm:text-xs font-bold uppercase tracking-wider text-emerald-700">
            <span className="truncate">CONFIRMADOS</span>
            <CheckCircle size={14} className="hidden sm:block shrink-0" />
          </div>
          <span className="font-cormorant font-bold text-2xl sm:text-4xl text-emerald-700 leading-none my-1">
            {realConfirmedAttendees}
          </span>
          <span className="text-[10px] sm:text-xs text-emerald-800/80 font-medium truncate">
            reales (tit. + acomp.)
          </span>
        </button>

        {/* CARD 3: FALTAN CONFIRMAR */}
        <button
          type="button"
          onClick={() => setFilter("pending")}
          className={`rounded-xl sm:rounded-2xl p-2.5 sm:p-5 flex flex-col justify-between text-left transition-all cursor-pointer ${
            filter === "pending"
              ? "ring-2 ring-amber-600 bg-amber-100 shadow-sm scale-[1.01]"
              : "bg-amber-50/70 hover:bg-amber-100/60 border border-amber-200"
          }`}
        >
          <div className="flex items-center justify-between text-[10px] sm:text-xs font-bold uppercase tracking-wider text-amber-700">
            <span className="truncate">FALTAN</span>
            <Clock size={14} className="hidden sm:block shrink-0" />
          </div>
          <span className="font-cormorant font-bold text-2xl sm:text-4xl text-amber-800 leading-none my-1">
            {pendingCount}
          </span>
          <span className="text-[10px] sm:text-xs text-amber-800/80 font-medium truncate">
            sin responder
          </span>
        </button>
      </div>

      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 p-3.5 sm:p-4 rounded-2xl bg-[rgba(197,155,39,0.06)] border border-[rgba(197,155,39,0.25)]">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setShowBulkModal(true)}
            className="btn-gold text-xs sm:text-sm py-2.5 px-3.5 flex items-center justify-center gap-2 w-full sm:w-auto"
          >
            <ClipboardList size={15} />
            Cargar lista masiva
          </button>
          <button
            type="button"
            onClick={() => setShowSingleInput(!showSingleInput)}
            className="btn-outline text-xs sm:text-sm py-2.5 px-3.5 flex items-center justify-center gap-2 w-full sm:w-auto"
          >
            <UserPlus size={15} />
            + Agregar individual
          </button>
        </div>

        {pendingCount > 0 && (
          <button
            type="button"
            onClick={handleCopyPending}
            className="flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl font-jakarta font-semibold text-xs bg-[rgba(234,179,8,0.15)] text-[#854d0e] border border-[rgba(234,179,8,0.4)] hover:bg-[rgba(234,179,8,0.25)] transition-colors cursor-pointer w-full sm:w-auto"
          >
            {copiedPending ? (
              <>
                <Check size={14} color="#16a34a" /> ¡Nombres copiados!
              </>
            ) : (
              <>
                <Copy size={14} /> Copiar faltantes ({pendingCount})
              </>
            )}
          </button>
        )}
      </div>

      {/* Single Guest Add Form */}
      {showSingleInput && (
        <form action={addGuestAction} className="flex flex-col sm:flex-row gap-2 animate-scale-in p-3.5 rounded-2xl bg-[var(--cream-2)] border border-[rgba(197,155,39,0.3)]">
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

      {/* Search Bar */}
      <div className="relative w-full">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--dark-brown-40)]" />
        <input
          type="search"
          placeholder="Buscar invitado por nombre..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="form-input pl-10 py-2.5 text-sm w-full"
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
      <div className="flex flex-col gap-2.5 sm:hidden w-full">
        {filteredList.length === 0 ? (
          <div className="text-center py-8 px-4 rounded-2xl bg-[var(--cream-2)] border border-[rgba(197,155,39,0.2)] font-jakarta text-xs text-[var(--dark-brown-40)]">
            {masterGuests.length === 0 && rsvps.length === 0
              ? "Aún no cargaste ninguna lista de invitados ni hay respuestas. Tocá 'Cargar lista masiva' para empezar."
              : "No se encontraron invitados con el filtro seleccionado."}
          </div>
        ) : (
          filteredList.map(({ id, guestName, guestId, status, matchedRsvp, isMasterGuest }) => (
            <div
              key={id}
              className="p-3.5 rounded-2xl border border-[rgba(197,155,39,0.25)] bg-[var(--cream-2)] flex flex-col gap-2 shadow-xs"
            >
              <div className="flex items-start justify-between gap-2">
                <span className="font-jakarta font-bold text-sm text-[var(--dark-brown)] break-words leading-snug">
                  {guestName}
                </span>

                {isMasterGuest && guestId && (
                  <form action={deleteGuestAction} className="shrink-0 pt-0.5">
                    <input type="hidden" name="id" value={guestId} />
                    <button
                      type="submit"
                      className="p-1 text-[var(--dark-brown-40)] hover:text-red-600 transition-colors cursor-pointer"
                      title="Eliminar de la lista"
                    >
                      <Trash2 size={15} />
                    </button>
                  </form>
                )}
              </div>

              {/* Badges & RSVP info */}
              <div className="flex flex-col gap-1.5 pt-2 border-t border-[rgba(197,155,39,0.15)] text-xs">
                <div className="flex items-center justify-between">
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
                  <div className="flex flex-col gap-1 pt-1 text-[11px] text-[var(--dark-brown-70)]">
                    {matchedRsvp.companionsCount > 0 && (
                      <div className="font-medium text-[var(--dark-brown)]">
                        👥 Acompañantes ({matchedRsvp.companionsCount}):{" "}
                        <span className="font-normal">{matchedRsvp.companionNames?.join(", ") || "No especificado"}</span>
                      </div>
                    )}
                    {matchedRsvp.dietaryRestrictions && matchedRsvp.dietaryRestrictions !== "ninguna" && (
                      <div className="flex items-center gap-1 text-amber-800 font-medium">
                        <Utensils size={12} /> Dieta: {DIETARY_LABELS[matchedRsvp.dietaryRestrictions]}
                      </div>
                    )}
                    {matchedRsvp.message && (
                      <div className="flex items-start gap-1 italic text-[var(--dark-brown-70)]">
                        <MessageSquare size={12} className="shrink-0 mt-0.5" /> "{matchedRsvp.message}"
                      </div>
                    )}
                  </div>
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
                  Invitado
                </th>
                <th className="px-4 py-3.5 font-jakarta font-semibold text-xs uppercase tracking-wider text-[var(--dark-brown-70)]">
                  Estado
                </th>
                <th className="px-4 py-3.5 font-jakarta font-semibold text-xs uppercase tracking-wider text-[var(--dark-brown-70)]">
                  Detalle RSVP (Acompañantes / Menú Especial)
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
                    {masterGuests.length === 0 && rsvps.length === 0
                      ? "Aún no cargaste ninguna lista de invitados ni hay respuestas. Tocá 'Cargar lista masiva' para empezar."
                      : "No se encontraron invitados con los filtros seleccionados."}
                  </td>
                </tr>
              ) : (
                filteredList.map(({ id, guestName, guestId, status, matchedRsvp, isMasterGuest }, idx) => (
                  <tr
                    key={id}
                    className={`border-b border-[rgba(197,155,39,0.1)] ${
                      idx % 2 === 0 ? "bg-[var(--cream)]" : "bg-[var(--cream-2)]"
                    }`}
                  >
                    <td className="px-4 py-3 font-jakarta font-semibold text-sm text-[var(--dark-brown)]">
                      {guestName}
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
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2">
                            <span>
                              RSVP por: <strong>{matchedRsvp.name}</strong>
                            </span>
                            {matchedRsvp.companionsCount > 0 && (
                              <span className="px-2 py-0.5 rounded-md bg-[rgba(197,155,39,0.12)] text-[var(--dark-brown)] text-[11px] font-semibold">
                                +{matchedRsvp.companionsCount} acompañante{matchedRsvp.companionsCount > 1 ? "s" : ""}
                              </span>
                            )}
                          </div>

                          {matchedRsvp.companionNames && matchedRsvp.companionNames.length > 0 && (
                            <span className="text-[11px] text-[var(--dark-brown-70)]">
                              Nombres: {matchedRsvp.companionNames.join(", ")}
                            </span>
                          )}

                          {matchedRsvp.dietaryRestrictions && matchedRsvp.dietaryRestrictions !== "ninguna" && (
                            <span className="text-[11px] text-amber-800 font-semibold flex items-center gap-1">
                              <Utensils size={11} /> Dieta: {DIETARY_LABELS[matchedRsvp.dietaryRestrictions]}
                            </span>
                          )}

                          {matchedRsvp.message && (
                            <span className="text-[11px] italic text-[var(--dark-brown-70)]">
                              "{matchedRsvp.message}"
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="opacity-40">— Sin respuesta —</span>
                      )}
                    </td>

                    <td className="px-4 py-3 text-right">
                      {isMasterGuest && guestId ? (
                        <form action={deleteGuestAction} className="inline">
                          <input type="hidden" name="id" value={guestId} />
                          <button
                            type="submit"
                            className="p-1.5 text-[var(--dark-brown-40)] hover:text-red-600 transition-colors cursor-pointer"
                            title="Eliminar de la lista"
                          >
                            <Trash2 size={15} />
                          </button>
                        </form>
                      ) : (
                        <span className="text-[11px] text-[var(--dark-brown-40)]">Directo</span>
                      )}
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
