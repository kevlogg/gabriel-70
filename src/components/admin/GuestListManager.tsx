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
  const confirmedCount = matchedList.filter((m) => m.status === "confirmed").length;
  const declinedCount = matchedList.filter((m) => m.status === "declined").length;
  const pendingCount = matchedList.filter((m) => m.status === "pending").length;

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
    <div className="flex flex-col gap-8">
      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div
          className="rounded-2xl p-5 flex flex-col gap-1"
          style={{ background: "rgba(197,155,39,0.1)", border: "1px solid rgba(197,155,39,0.3)" }}
        >
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[var(--gold)]">
            <span>Total en Lista</span>
            <Users size={16} />
          </div>
          <span className="font-cormorant font-bold text-4xl text-[var(--dark-brown)]">{masterGuests.length}</span>
          <span className="text-xs text-[var(--dark-brown-40)]">invitados cargados</span>
        </div>

        <div
          className="rounded-2xl p-5 flex flex-col gap-1"
          style={{ background: "rgba(22,163,74,0.1)", border: "1px solid rgba(22,163,74,0.3)" }}
        >
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#16a34a]">
            <span>Confirmados</span>
            <CheckCircle size={16} />
          </div>
          <span className="font-cormorant font-bold text-4xl text-[var(--dark-brown)]">{confirmedCount}</span>
          <span className="text-xs text-[var(--dark-brown-40)]">ya respondieron Sí</span>
        </div>

        <div
          className="rounded-2xl p-5 flex flex-col gap-1"
          style={{ background: "rgba(234,179,8,0.12)", border: "1px solid rgba(234,179,8,0.35)" }}
        >
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#ca8a04]">
            <span>Faltan Confirmar</span>
            <Clock size={16} />
          </div>
          <span className="font-cormorant font-bold text-4xl text-[var(--dark-brown)]">{pendingCount}</span>
          <span className="text-xs text-[var(--dark-brown-40)]">sin respuesta aún</span>
        </div>

        <div
          className="rounded-2xl p-5 flex flex-col gap-1"
          style={{ background: "rgba(220,38,38,0.1)", border: "1px solid rgba(220,38,38,0.3)" }}
        >
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#dc2626]">
            <span>No Asisten</span>
            <XCircle size={16} />
          </div>
          <span className="font-cormorant font-bold text-4xl text-[var(--dark-brown)]">{declinedCount}</span>
          <span className="text-xs text-[var(--dark-brown-40)]">ausencia confirmada</span>
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-5 rounded-2xl bg-[rgba(197,155,39,0.06)] border border-[rgba(197,155,39,0.25)]">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setShowBulkModal(true)}
            className="btn-gold text-xs sm:text-sm py-2.5 px-4 flex items-center gap-2"
          >
            <ClipboardList size={16} />
            Cargar lista masiva
          </button>
          <button
            type="button"
            onClick={() => setShowSingleInput(!showSingleInput)}
            className="btn-outline text-xs sm:text-sm py-2.5 px-4 flex items-center gap-2"
          >
            <UserPlus size={16} />
            + Agregar individual
          </button>
        </div>

        {pendingCount > 0 && (
          <button
            type="button"
            onClick={handleCopyPending}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-jakarta font-semibold text-xs sm:text-sm bg-[rgba(234,179,8,0.15)] text-[#854d0e] border border-[rgba(234,179,8,0.4)] hover:bg-[rgba(234,179,8,0.25)] transition-colors cursor-pointer"
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
        <form action={addGuestAction} className="flex gap-2 animate-scale-in p-4 rounded-2xl bg-[var(--cream-2)] border border-[rgba(197,155,39,0.3)]">
          <input
            name="name"
            type="text"
            required
            placeholder="Nombre y Apellido del invitado"
            className="form-input flex-1"
          />
          <button type="submit" className="btn-gold px-5 py-2.5 text-xs sm:text-sm shrink-0">
            Guardar
          </button>
        </form>
      )}

      {/* Bulk Add Modal */}
      {showBulkModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-in">
          <div className="glass-card max-w-lg w-full p-6 sm:p-8 flex flex-col gap-5 animate-scale-in">
            <h3 className="font-cormorant font-bold text-2xl text-[var(--dark-brown)]">
              Cargar lista masiva de invitados
            </h3>
            <p className="font-jakarta text-xs sm:text-sm text-[var(--dark-brown-70)]">
              Pegá o escribí los nombres de tus invitados, <strong>un nombre por línea</strong>:
            </p>
            <form action={bulkAddGuestsAction} className="flex flex-col gap-4">
              <textarea
                name="rawList"
                rows={8}
                required
                placeholder="Juan Pérez&#10;María González&#10;Carlos Rodríguez..."
                className="form-input text-sm p-3.5 resize-none"
              />
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowBulkModal(false)}
                  className="btn-outline px-4 py-2 text-sm"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  onClick={() => setShowBulkModal(false)}
                  className="btn-gold px-5 py-2 text-sm"
                >
                  Cargar lista
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Search & Filter Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--dark-brown-40)]" />
          <input
            type="search"
            placeholder="Buscar en lista..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="form-input pl-10 py-2.5 text-sm"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
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
                className={`px-3 py-1.5 rounded-full font-jakarta text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
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

      {/* Table */}
      <div className="rounded-2xl overflow-hidden border border-[rgba(197,155,39,0.2)]">
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
        <div className="flex justify-end">
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
