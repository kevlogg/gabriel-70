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
  ShieldCheck,
  AlertTriangle,
  LayoutGrid,
  Table as TableIcon,
} from "lucide-react";

interface GuestListManagerProps {
  masterGuests: MasterGuest[];
  rsvps: RsvpRecord[];
}

interface DisplayItem {
  id: string;
  type: "rsvp" | "master";
  guestName: string;
  masterGuestId: string | null;
  rsvpId: string | null;
  status: "confirmed" | "declined" | "pending";
  companionNames: string[];
  companionsCount: number;
  dietaryRestrictions?: string;
  message?: string;
  createdAt?: string;
  hasDuplicates?: boolean;
  attendeeStart?: number;
  attendeeEnd?: number;
}

interface DuplicateOccurrence {
  rawName: string;
  role: "titular" | "acompanante";
  rsvpId: string;
  rsvpOwner: string;
  createdAt?: string;
}

interface DuplicateGroup {
  key: string;
  name: string;
  occurrences: DuplicateOccurrence[];
}

function normalizeName(str: string): string {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

/**
 * Normaliza nombres para detección exacta de personas repetidas:
 * Quita aclaraciones entre paréntesis (ej: "(vegetariana)"), remueve tildes,
 * y ordena las palabras alfabéticamente ("Vallejos Matias" === "Matias Vallejos").
 */
function normalizePersonName(str: string): string {
  if (!str) return "";
  const clean = str.replace(/\([^)]*\)/g, "");
  const norm = clean
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\p{L}\s]/gu, " ")
    .trim();
  const tokens = norm.split(/\s+/).filter(Boolean).sort();
  return tokens.join(" ");
}

/**
 * Diccionario de apodos y equivalencias comunes para cruzar los nombres
 * informales de la planilla precargada con los nombres y apellidos reales enviados en el RSVP.
 */
const NICKNAMES_MAP: Record<string, string[]> = {
  ale: ["alejandro", "alejandra"],
  alejandro: ["ale"],
  alejandra: ["ale"],
  gaby: ["gabriel", "gabriela"],
  gabriel: ["gaby"],
  gabriela: ["gaby"],
  jesy: ["jesica", "jessica"],
  jessi: ["jesica", "jessica"],
  jesica: ["jesy", "jessi"],
  jessica: ["jesy", "jessi"],
  stefi: ["stefania", "estefania"],
  stefy: ["stefania", "estefania"],
  stefania: ["stefi", "stefy"],
  estefania: ["stefi", "stefy"],
  aimara: ["ayma", "aymara"],
  ayma: ["aimara", "aymara"],
  aymara: ["aimara", "ayma"],
  maxi: ["maximiliano"],
  maximiliano: ["maxi"],
  jony: ["jonatan", "jonathan"],
  joni: ["jonatan", "jonathan"],
  jonatan: ["jony", "joni"],
  jonathan: ["jony", "joni"],
  moli: ["molina"],
  molina: ["moli"],
  kari: ["karina"],
  karina: ["kari"],
  tito: ["alberto"],
  alberto: ["tito"],
  inaqui: ["inaki"],
  inaki: ["inaqui"],
  naty: ["natalia"],
  natalia: ["naty"],
  leo: ["leonardo"],
  leonardo: ["leo"],
  moni: ["monica"],
  monica: ["moni"],
  bety: ["beatriz"],
  beti: ["beatriz"],
  beatriz: ["bety", "beti"],
  fran: ["francisco"],
  francisco: ["fran"],
  seba: ["sebastian"],
  sebastian: ["seba"],
  mauri: ["mauricio"],
  mauricio: ["mauri"],
  pato: ["patricia", "patricio"],
  patricia: ["pato"],
  patricio: ["pato"],
  delfi: ["delfina"],
  delfina: ["delfi"],
  nacho: ["ignacio"],
  ignacio: ["nacho"],
  rody: ["rodolfo"],
  rodolfo: ["rody"],
  santi: ["santiago"],
  santiago: ["santi"],
  mati: ["matias"],
  matias: ["mati"],
  lili: ["liliana"],
  liliana: ["lili"],
  evelin: ["evelyn"],
  evelyn: ["evelin"],
  carlos: ["charly"],
  charly: ["carlos"],
  kelo: ["marcelo"],
  marcelo: ["kelo"],
  lu: ["lujan", "lucia", "luciana"],
  juanjo: ["juan", "jose", "diaz"],
};

function expandToken(token: string): Set<string> {
  const set = new Set([token]);
  if (NICKNAMES_MAP[token]) {
    NICKNAMES_MAP[token].forEach((n) => set.add(n));
  }
  return set;
}

function isNameMatch(a: string, b: string): boolean {
  const normA = normalizeName(a);
  const normB = normalizeName(b);
  if (!normA || !normB) return false;

  if (normA === normB) return true;

  const rawTokensA = normA.split(/\s+/).filter(Boolean);
  const rawTokensB = normB.split(/\s+/).filter(Boolean);

  if (rawTokensA.length === 0 || rawTokensB.length === 0) return false;

  const shorter = rawTokensA.length <= rawTokensB.length ? rawTokensA : rawTokensB;
  const longer = rawTokensA.length <= rawTokensB.length ? rawTokensB : rawTokensA;

  // Cada palabra del nombre más corto debe coincidir exactamente o vía apodo con alguna del más largo
  return shorter.every((st) => {
    const validMatches = expandToken(st);
    return longer.some((lt) => validMatches.has(lt));
  });
}

export default function GuestListManager({ masterGuests, rsvps }: GuestListManagerProps) {
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [showSingleInput, setShowSingleInput] = useState(false);
  const [isSubmittingBulk, setIsSubmittingBulk] = useState(false);
  const [isSubmittingSingle, setIsSubmittingSingle] = useState(false);
  const [filter, setFilter] = useState<"all" | "pending" | "confirmed" | "declined" | "duplicates">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedPending, setCopiedPending] = useState(false);
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");

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

  // Total de asistentes confirmados brutos (titulares + acompañantes)
  const realConfirmedAttendees = useMemo(() => {
    return rsvps
      .filter((r) => r.attending === "yes")
      .reduce((sum, r) => sum + 1 + (r.companionsCount || 0), 0);
  }, [rsvps]);

  // Cálculo de duplicados en confirmaciones (titulares y acompañantes que coinciden en nombre y apellido)
  const { duplicateGroups, duplicatesMap, duplicateRsvpIds, totalDuplicateExcess, uniqueConfirmedCount } = useMemo(() => {
    const map = new Map<string, DuplicateOccurrence[]>();
    let totalConfirmedInstances = 0;

    rsvps
      .filter((r) => r.attending === "yes")
      .forEach((r) => {
        // 1. Titular
        totalConfirmedInstances += 1;
        const keyTitular = normalizePersonName(r.name);
        if (keyTitular) {
          if (!map.has(keyTitular)) map.set(keyTitular, []);
          map.get(keyTitular)!.push({
            rawName: r.name.trim(),
            role: "titular",
            rsvpId: r.id,
            rsvpOwner: r.name.trim(),
            createdAt: r.createdAt,
          });
        }

        // 2. Acompañantes
        if (r.companionNames && r.companionNames.length > 0) {
          r.companionNames.forEach((cName) => {
            if (cName && typeof cName === "string" && cName.trim()) {
              totalConfirmedInstances += 1;
              const keyComp = normalizePersonName(cName);
              if (keyComp) {
                if (!map.has(keyComp)) map.set(keyComp, []);
                map.get(keyComp)!.push({
                  rawName: cName.trim(),
                  role: "acompanante",
                  rsvpId: r.id,
                  rsvpOwner: r.name.trim(),
                  createdAt: r.createdAt,
                });
              }
            }
          });
        } else if (r.companionsCount && r.companionsCount > 0) {
          totalConfirmedInstances += r.companionsCount;
        }
      });

    const groups: DuplicateGroup[] = [];
    let excess = 0;
    const dupsLookup = new Map<string, DuplicateGroup>();
    const dupRsvps = new Set<string>();

    map.forEach((occurrences, key) => {
      if (occurrences.length > 1) {
        excess += occurrences.length - 1;
        const canonicalName = occurrences[0].rawName;
        const group: DuplicateGroup = {
          key,
          name: canonicalName,
          occurrences,
        };
        groups.push(group);
        dupsLookup.set(key, group);
        occurrences.forEach((occ) => dupRsvps.add(occ.rsvpId));
      }
    });

    // Ordenar de mayor cantidad de repeticiones a menor
    groups.sort((a, b) => b.occurrences.length - a.occurrences.length || a.name.localeCompare(b.name));

    return {
      duplicateGroups: groups,
      duplicatesMap: dupsLookup,
      duplicateRsvpIds: dupRsvps,
      totalDuplicateExcess: excess,
      uniqueConfirmedCount: Math.max(0, realConfirmedAttendees - excess),
    };
  }, [rsvps, realConfirmedAttendees]);

  // Construye la lista de visualización limpia con rango de personas confirmadas para enumeración exacta
  const displayItems = useMemo<DisplayItem[]>(() => {
    const items: DisplayItem[] = [];
    const respondedMasterGuestIds = new Set<string>();
    let runningAttendee = 0;

    // 1. Mapea todos los RSVPs directamente
    rsvps.forEach((rsvp) => {
      // Cruzar titular con la lista base
      const matchedPrimaryMaster = masterGuests.find((g) => isNameMatch(g.name, rsvp.name));
      if (matchedPrimaryMaster) {
        respondedMasterGuestIds.add(matchedPrimaryMaster.id);
      }

      // Cruzar acompañantes con la lista base
      if (rsvp.companionNames && rsvp.companionNames.length > 0) {
        rsvp.companionNames.forEach((cName) => {
          const matchedCompanionMaster = masterGuests.find((g) => isNameMatch(g.name, cName));
          if (matchedCompanionMaster) {
            respondedMasterGuestIds.add(matchedCompanionMaster.id);
          }
        });
      }

      const isAttending = rsvp.attending === "yes";
      let startAtt: number | undefined = undefined;
      let endAtt: number | undefined = undefined;
      if (isAttending) {
        const count = 1 + (rsvp.companionNames?.length || rsvp.companionsCount || 0);
        startAtt = runningAttendee + 1;
        endAtt = runningAttendee + count;
        runningAttendee += count;
      }

      items.push({
        id: `rsvp-${rsvp.id}`,
        type: "rsvp",
        guestName: rsvp.name,
        masterGuestId: matchedPrimaryMaster ? matchedPrimaryMaster.id : null,
        rsvpId: rsvp.id,
        status: isAttending ? "confirmed" : "declined",
        companionNames: rsvp.companionNames || [],
        companionsCount: rsvp.companionsCount || 0,
        dietaryRestrictions: rsvp.dietaryRestrictions,
        message: rsvp.message,
        createdAt: rsvp.createdAt,
        hasDuplicates: duplicateRsvpIds.has(rsvp.id),
        attendeeStart: startAtt,
        attendeeEnd: endAtt,
      });
    });

    // 2. Mapea invitados base que todavía no respondieron como pendientes
    masterGuests.forEach((guest) => {
      if (!respondedMasterGuestIds.has(guest.id)) {
        items.push({
          id: `master-${guest.id}`,
          type: "master",
          guestName: guest.name,
          masterGuestId: guest.id,
          rsvpId: null,
          status: "pending",
          companionNames: [],
          companionsCount: 0,
          hasDuplicates: false,
        });
      }
    });

    return items;
  }, [masterGuests, rsvps, duplicateRsvpIds]);

  // Estadísticas
  const pendingCount = displayItems.filter((m) => m.status === "pending").length;

  // Lista filtrada
  const filteredList = useMemo(() => {
    return displayItems.filter((item) => {
      if (filter === "duplicates") {
        if (!item.hasDuplicates) return false;
      } else if (filter !== "all" && item.status !== filter) {
        return false;
      }

      if (searchQuery.trim()) {
        const q = normalizeName(searchQuery);
        const mainMatch = normalizeName(item.guestName).includes(q);
        const companionMatch = item.companionNames.some((c) => normalizeName(c).includes(q));
        return mainMatch || companionMatch;
      }
      return true;
    });
  }, [displayItems, filter, searchQuery]);

  // Texto de nombres faltantes para copiar al portapapeles
  const pendingNames = useMemo(() => {
    return displayItems
      .filter((m) => m.status === "pending")
      .map((m) => m.guestName)
      .join("\n");
  }, [displayItems]);

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
      {/* 5 Main KPI Cards - Responsive Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 w-full">
        {/* CARD 1: EN LISTA */}
        <button
          type="button"
          onClick={() => setFilter("all")}
          className={`rounded-3xl p-4 sm:p-6 flex flex-col items-center justify-center text-center transition-all cursor-pointer border-2 w-full min-w-0 ${
            filter === "all"
              ? "border-[var(--gold)] bg-[rgba(197,155,39,0.18)] shadow-md scale-[1.02] ring-2 ring-[var(--gold)]/40"
              : "border-[rgba(197,155,39,0.35)] bg-[rgba(197,155,39,0.06)] hover:bg-[rgba(197,155,39,0.14)] hover:border-[var(--gold)]"
          }`}
        >
          <div className="flex items-center justify-center text-center gap-1.5 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[var(--gold)] mb-1.5 w-full">
            <Users size={16} className="shrink-0" />
            <span>EN LISTA</span>
          </div>
          <span className="font-cormorant font-bold text-3xl sm:text-4xl text-[var(--dark-brown)] leading-none my-1.5 text-center w-full block">
            {masterGuests.length}
          </span>
          <span className="text-[11px] sm:text-xs text-[var(--dark-brown-70)] font-medium leading-tight text-center w-full block">
            {masterGuests.length === 1 ? "invitado" : "invitados en total"}
          </span>
        </button>

        {/* CARD 2: CONFIRMADOS (TOTAL BRUTO) */}
        <button
          type="button"
          onClick={() => setFilter("confirmed")}
          className={`rounded-3xl p-4 sm:p-6 flex flex-col items-center justify-center text-center transition-all cursor-pointer border-2 w-full min-w-0 ${
            filter === "confirmed"
              ? "border-emerald-500 bg-emerald-100 shadow-md scale-[1.02] ring-2 ring-emerald-500/40"
              : "border-emerald-300 bg-emerald-50/80 hover:bg-emerald-100/70 hover:border-emerald-400"
          }`}
        >
          <div className="flex items-center justify-center text-center gap-1.5 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-emerald-700 mb-1.5 w-full">
            <CheckCircle size={16} className="shrink-0" />
            <span>CONFIRMADOS</span>
          </div>
          <span className="font-cormorant font-bold text-3xl sm:text-4xl text-emerald-700 leading-none my-1.5 text-center w-full block">
            {realConfirmedAttendees}
          </span>
          <span className="text-[11px] sm:text-xs text-emerald-800/90 font-medium leading-tight text-center w-full block">
            personas en total
          </span>
        </button>

        {/* CARD 3: REPETIDOS */}
        <button
          type="button"
          onClick={() => setFilter("duplicates")}
          className={`rounded-3xl p-4 sm:p-6 flex flex-col items-center justify-center text-center transition-all cursor-pointer border-2 w-full min-w-0 ${
            filter === "duplicates"
              ? "border-rose-500 bg-rose-100 shadow-md scale-[1.02] ring-2 ring-rose-500/40 text-rose-900"
              : "border-rose-300 bg-rose-50/80 hover:bg-rose-100/70 hover:border-rose-400 text-rose-800"
          }`}
        >
          <div className="flex items-center justify-center text-center gap-1.5 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-rose-700 mb-1.5 w-full">
            <Copy size={16} className="shrink-0" />
            <span>REPETIDOS</span>
          </div>
          <span className="font-cormorant font-bold text-3xl sm:text-4xl text-rose-700 leading-none my-1.5 text-center w-full block">
            {totalDuplicateExcess}
          </span>
          <span className="text-[11px] sm:text-xs text-rose-800/90 font-medium leading-tight text-center w-full block">
            {duplicateGroups.length} personas duplicadas
          </span>
        </button>

        {/* CARD 4: REALES ÚNICOS (CONFIRMADOS - REPETIDOS) */}
        <button
          type="button"
          onClick={() => setFilter("confirmed")}
          className="rounded-3xl p-4 sm:p-6 flex flex-col items-center justify-center text-center transition-all cursor-pointer border-2 w-full min-w-0 border-emerald-500 bg-emerald-100/90 hover:bg-emerald-200/80 hover:border-emerald-600 shadow-xs ring-1 ring-emerald-500/30"
          title="Confirmados reales únicos (Total de confirmados menos los repetidos)"
        >
          <div className="flex items-center justify-center text-center gap-1.5 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-emerald-800 mb-1.5 w-full">
            <ShieldCheck size={16} className="shrink-0 text-emerald-700" />
            <span>REALES ÚNICOS</span>
          </div>
          <span className="font-cormorant font-bold text-3xl sm:text-4xl text-emerald-900 leading-none my-1.5 text-center w-full block">
            {uniqueConfirmedCount}
          </span>
          <span className="text-[11px] sm:text-xs text-emerald-900/90 font-bold leading-tight text-center w-full block">
            confirmados − repetidos
          </span>
        </button>

        {/* CARD 5: FALTAN CONFIRMAR */}
        <button
          type="button"
          onClick={() => setFilter("pending")}
          className={`rounded-3xl p-4 sm:p-6 flex flex-col items-center justify-center text-center transition-all cursor-pointer border-2 w-full min-w-0 col-span-2 sm:col-span-1 ${
            filter === "pending"
              ? "border-amber-500 bg-amber-100 shadow-md scale-[1.02] ring-2 ring-amber-500/40"
              : "border-amber-300 bg-amber-50/80 hover:bg-amber-100/70 hover:border-amber-400"
          }`}
        >
          <div className="flex items-center justify-center text-center gap-1.5 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-amber-700 mb-1.5 w-full">
            <Clock size={16} className="shrink-0" />
            <span>FALTAN</span>
          </div>
          <span className="font-cormorant font-bold text-3xl sm:text-4xl text-amber-800 leading-none my-1.5 text-center w-full block">
            {pendingCount}
          </span>
          <span className="text-[11px] sm:text-xs text-amber-800/90 font-medium leading-tight text-center w-full block">
            sin responder
          </span>
        </button>
      </div>

      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4 sm:p-5 rounded-3xl bg-[rgba(197,155,39,0.06)] border-2 border-[rgba(197,155,39,0.3)] shadow-xs">
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

        <div className="flex flex-wrap items-center gap-2.5 self-stretch sm:self-auto justify-between sm:justify-end">
          {/* View Mode Toggle (Cards vs Table) */}
          <div className="inline-flex rounded-full p-1 bg-white border border-[rgba(197,155,39,0.3)] shadow-2xs">
            <button
              type="button"
              onClick={() => setViewMode("cards")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                viewMode === "cards"
                  ? "bg-[var(--gold)] text-white shadow-2xs"
                  : "text-[var(--dark-brown-70)] hover:text-[var(--dark-brown)]"
              }`}
              title="Ver en tarjetas centradas"
            >
              <LayoutGrid size={14} />
              <span>Tarjetas</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode("table")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                viewMode === "table"
                  ? "bg-[var(--gold)] text-white shadow-2xs"
                  : "text-[var(--dark-brown-70)] hover:text-[var(--dark-brown)]"
              }`}
              title="Ver en tabla compacta"
            >
              <TableIcon size={14} />
              <span>Tabla</span>
            </button>
          </div>

          {pendingCount > 0 && (
            <button
              type="button"
              onClick={handleCopyPending}
              className="flex items-center justify-center gap-2 px-4 py-2 rounded-full font-jakarta font-semibold text-xs bg-amber-100 text-amber-900 border-2 border-amber-300 hover:bg-amber-200 transition-colors cursor-pointer shadow-xs"
            >
              {copiedPending ? (
                <>
                  <Check size={15} color="#16a34a" /> ¡Copiados!
                </>
              ) : (
                <>
                  <Copy size={15} /> Copiar faltantes ({pendingCount})
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Single Guest Add Form */}
      {showSingleInput && (
        <form action={handleSingleSubmit} className="flex flex-col sm:flex-row gap-2.5 animate-scale-in p-4 sm:p-5 rounded-3xl bg-[var(--cream-2)] border-2 border-[rgba(197,155,39,0.35)] shadow-xs">
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
          placeholder="Buscar invitado o acompañante por nombre..."
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
              : filter === "duplicates"
              ? "Repetidos / Duplicados"
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
            Ver todos ({displayItems.length})
          </button>
        )}
      </div>

      {/* ─── DESGLOSE DETALLADO DE REPETIDOS ─── */}
      {filter === "duplicates" && (
        <div className="rounded-3xl p-5 sm:p-7 bg-rose-50/70 border-2 border-rose-300 shadow-xs flex flex-col gap-5 animate-scale-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-rose-200/80 pb-3">
            <div className="flex items-start gap-3">
              <span className="p-2.5 rounded-2xl bg-rose-100 text-rose-700 shrink-0">
                <AlertTriangle size={20} />
              </span>
              <div>
                <h3 className="font-cormorant font-bold text-xl sm:text-2xl text-rose-950">
                  Desglose de Personas Repetidas
                </h3>
                <p className="font-jakarta text-xs sm:text-sm text-rose-900/80">
                  Detectamos <strong>{totalDuplicateExcess} repeticiones</strong> en <strong>{duplicateGroups.length} personas</strong>. Revisá en qué respuestas figura cada una y podés eliminar el RSVP sobrante con un clic.
                </p>
              </div>
            </div>
            <span className="text-xs font-bold text-rose-800 bg-rose-100 px-3 py-1 rounded-full border border-rose-300 self-start sm:self-center shrink-0">
              {totalDuplicateExcess} repetición{totalDuplicateExcess !== 1 ? "es" : ""}
            </span>
          </div>

          {duplicateGroups.length === 0 ? (
            <div className="text-center py-6 text-xs text-rose-800 font-jakarta">
              No hay personas repetidas en este momento.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {duplicateGroups.map((group) => (
                <div
                  key={group.key}
                  className="p-5 rounded-2xl bg-white border border-rose-200/90 shadow-2xs flex flex-col gap-3.5"
                >
                  <div className="flex items-center justify-between gap-2 border-b border-rose-100 pb-2.5">
                    <span className="font-jakarta font-bold text-base text-[var(--dark-brown)] flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shrink-0" />
                      {group.name}
                    </span>
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-200">
                      Aparece {group.occurrences.length} veces
                    </span>
                  </div>

                  <div className="flex flex-col gap-2 text-xs text-[var(--dark-brown-70)]">
                    {group.occurrences.map((occ, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between gap-2 p-3 rounded-xl bg-rose-50/50 border border-rose-100"
                      >
                        <div className="flex flex-col">
                          <span className="font-semibold text-rose-950">
                            {occ.role === "titular"
                              ? `• Titular en su propio RSVP`
                              : `• Acompañante de "${occ.rsvpOwner}"`}
                          </span>
                          {occ.createdAt && (
                            <span className="text-[10px] text-rose-700/80">
                              Enviado:{" "}
                              {new Date(occ.createdAt).toLocaleDateString("es-AR", {
                                day: "2-digit",
                                month: "short",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          )}
                        </div>

                        <form
                          action={deleteGuestAction}
                          onSubmit={(e) => {
                            if (
                              !confirm(
                                `¿Seguro que querés eliminar la confirmación enviada por "${occ.rsvpOwner}"?`
                              )
                            ) {
                              e.preventDefault();
                            }
                          }}
                        >
                          <input type="hidden" name="rsvpId" value={occ.rsvpId} />
                          <button
                            type="submit"
                            title={`Eliminar el RSVP de "${occ.rsvpOwner}"`}
                            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold bg-rose-100 text-rose-800 hover:bg-rose-200 hover:text-rose-900 transition-colors cursor-pointer border border-rose-300"
                          >
                            <Trash2 size={12} /> Borrar este RSVP
                          </button>
                        </form>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ─── VISTA 1: CARDS CENTRADAS CON MÁRGENES Y ESPACIOS ─── */}
      {viewMode === "cards" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 w-full">
          {filteredList.length === 0 ? (
            <div className="col-span-full text-center py-12 px-6 rounded-3xl bg-[var(--cream-2)] border-2 border-dashed border-[rgba(197,155,39,0.3)] font-jakarta text-sm text-[var(--dark-brown-40)]">
              {masterGuests.length === 0 && rsvps.length === 0
                ? "Aún no cargaste ninguna lista de invitados ni hay respuestas. Tocá 'Cargar lista masiva' para empezar."
                : "No se encontraron invitados con el filtro seleccionado."}
            </div>
          ) : (
            filteredList.map((item, itemIdx) => {
              const titularDup =
                item.status === "confirmed"
                  ? duplicatesMap.get(normalizePersonName(item.guestName))
                  : null;

              return (
                <div
                  key={item.id}
                  className={`rounded-3xl p-6 sm:p-7 flex flex-col justify-between gap-5 shadow-sm border-2 transition-all text-center relative overflow-hidden ${
                    item.hasDuplicates
                      ? "bg-gradient-to-b from-rose-50/90 via-white to-rose-50/50 border-rose-300 hover:border-rose-400 hover:shadow-md"
                      : item.status === "confirmed"
                      ? "bg-gradient-to-b from-emerald-50/80 via-white to-emerald-50/40 border-emerald-300 hover:border-emerald-500 hover:shadow-md"
                      : item.status === "declined"
                      ? "bg-gradient-to-b from-red-50/80 via-white to-red-50/40 border-red-300 hover:border-red-400"
                      : "bg-gradient-to-b from-[var(--cream-2)] via-white to-[var(--cream)] border-[rgba(197,155,39,0.35)] hover:border-[var(--gold)] hover:shadow-md"
                  }`}
                >
                  {/* Delete button (Top Right Floating) */}
                  <form
                    action={deleteGuestAction}
                    onSubmit={(e) => {
                      if (!confirm(`¿Seguro que querés eliminar el registro de ${item.guestName}?`)) {
                        e.preventDefault();
                      }
                    }}
                    className="absolute top-4 right-4 z-10"
                  >
                    {item.type === "master" && item.masterGuestId && (
                      <input type="hidden" name="id" value={item.masterGuestId} />
                    )}
                    {item.rsvpId && <input type="hidden" name="rsvpId" value={item.rsvpId} />}
                    <button
                      type="submit"
                      className="p-2 rounded-xl text-[var(--dark-brown-40)] hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                      title={item.type === "rsvp" ? "Eliminar confirmación RSVP" : "Eliminar de la lista"}
                      aria-label={`Eliminar ${item.guestName}`}
                    >
                      <Trash2 size={16} />
                    </button>
                  </form>

                  {/* Header: Centered Enumeration & Status Pills */}
                  <div className="flex flex-col items-center justify-center gap-2 pt-1 w-full">
                    {/* Item Number Badge */}
                    <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold tracking-widest uppercase bg-[rgba(197,155,39,0.15)] text-[var(--dark-brown)] border border-[rgba(197,155,39,0.35)] shadow-2xs font-jakarta">
                      <span>N° {itemIdx + 1}</span>
                    </div>

                    {/* Status Pill */}
                    <div className="flex items-center justify-center gap-2 flex-wrap">
                      {item.status === "confirmed" && (
                        <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 shadow-2xs">
                          <CheckCircle size={14} className="text-emerald-700" />
                          <span>
                            Confirmado{" "}
                            {item.companionsCount > 0
                              ? `(${1 + item.companionsCount} pers.)`
                              : "(1 pers.)"}
                          </span>
                        </span>
                      )}
                      {item.status === "declined" && (
                        <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800 border border-red-300 shadow-2xs">
                          <XCircle size={14} className="text-red-700" />
                          <span>No asiste</span>
                        </span>
                      )}
                      {item.status === "pending" && (
                        <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300 shadow-2xs">
                          <Clock size={14} className="text-amber-700" />
                          <span>Falta confirmar</span>
                        </span>
                      )}
                      {item.hasDuplicates && (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-bold bg-rose-100 text-rose-800 border border-rose-300 shadow-2xs">
                          ⚠️ Tiene repetidos
                        </span>
                      )}
                    </div>

                    {/* Attendee headcount indicator (for confirmed guests) */}
                    {item.status === "confirmed" && item.attendeeStart && (
                      <span className="text-[11px] font-bold text-emerald-900/90 bg-emerald-100/70 px-3 py-0.5 rounded-full border border-emerald-300 tracking-wide">
                        {item.attendeeStart === item.attendeeEnd
                          ? `Persona confirmada #${item.attendeeStart}`
                          : `Personas confirmadas #${item.attendeeStart} a #${item.attendeeEnd}`}
                      </span>
                    )}
                  </div>

                  {/* Subtle Ornamental Divider */}
                  <div className="w-16 h-0.5 mx-auto bg-gradient-to-r from-transparent via-[rgba(197,155,39,0.4)] to-transparent my-0.5" />

                  {/* Centered Names & Roles Block */}
                  <div className="flex flex-col items-center justify-center gap-3 w-full my-auto">
                    {/* Primary Guest (Titular) */}
                    <div className="flex flex-col items-center justify-center gap-1.5 w-full">
                      <h4 className="font-jakarta font-bold text-lg sm:text-xl text-[var(--dark-brown)] text-center leading-snug break-words px-2">
                        {item.guestName}
                      </h4>
                      <div className="flex items-center justify-center gap-1.5 flex-wrap">
                        <span className="text-[10px] font-bold tracking-widest uppercase px-2.5 py-0.5 rounded-full bg-[rgba(197,155,39,0.12)] text-[var(--gold)] border border-[rgba(197,155,39,0.25)]">
                          {item.type === "rsvp" ? "Titular" : "En Lista"}
                        </span>
                        {item.status === "confirmed" && item.attendeeStart && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100/80 text-emerald-800 border border-emerald-200">
                            Persona #{item.attendeeStart}
                          </span>
                        )}
                        {titularDup && (
                          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-300">
                            ⚠️ Repetido ({titularDup.occurrences.length}x)
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Companions (if any) */}
                    {item.companionNames.length > 0 ? (
                      <div className="flex flex-col items-center justify-center gap-2.5 w-full pt-1">
                        {item.companionNames.map((companionName, cIdx) => {
                          const compDup =
                            item.status === "confirmed"
                              ? duplicatesMap.get(normalizePersonName(companionName))
                              : null;
                          const personNum = item.attendeeStart
                            ? item.attendeeStart + 1 + cIdx
                            : null;

                          return (
                            <div
                              key={cIdx}
                              className="flex flex-col items-center justify-center gap-1 w-full pt-2 border-t border-dashed border-[rgba(197,155,39,0.25)]"
                            >
                              <h5 className="font-jakarta font-semibold text-base sm:text-lg text-[var(--dark-brown)] text-center break-words px-2">
                                {companionName}
                              </h5>
                              <div className="flex items-center justify-center gap-1.5 flex-wrap">
                                <span className="text-[10px] font-bold tracking-widest uppercase px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                                  Acompañante
                                </span>
                                {personNum && (
                                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100/80 text-emerald-800 border border-emerald-200">
                                    Persona #{personNum}
                                  </span>
                                )}
                                {compDup && (
                                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-300">
                                    ⚠️ Repetido ({compDup.occurrences.length}x)
                                  </span>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : item.companionsCount > 0 ? (
                      <div className="flex flex-col items-center justify-center gap-1 w-full pt-2 border-t border-dashed border-[rgba(197,155,39,0.25)]">
                        <span className="font-jakarta font-semibold text-base text-[var(--dark-brown)] text-center">
                          + {item.companionsCount} Acompañante{item.companionsCount > 1 ? "s" : ""}
                        </span>
                        <span className="text-[10px] font-bold tracking-widest uppercase px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                          Acompañante
                        </span>
                      </div>
                    ) : null}
                  </div>

                  {/* Centered RSVP Details (Diet & Message) */}
                  {item.type === "rsvp" && (item.dietaryRestrictions || item.message) && (
                    <div className="flex flex-col items-center justify-center gap-3 pt-3 border-t border-[rgba(197,155,39,0.2)] w-full">
                      {item.dietaryRestrictions && item.dietaryRestrictions !== "ninguna" && (
                        <div className="inline-flex items-center justify-center gap-2 text-xs text-amber-950 bg-amber-50/90 px-4 py-2 rounded-2xl border border-amber-200/90 font-medium mx-auto shadow-2xs">
                          <Utensils size={14} className="text-amber-700 shrink-0" />
                          <span>
                            Menú especial:{" "}
                            <strong>
                              {DIETARY_LABELS[item.dietaryRestrictions as keyof typeof DIETARY_LABELS] ||
                                item.dietaryRestrictions}
                            </strong>
                          </span>
                        </div>
                      )}

                      {item.message && (
                        <div className="p-4 rounded-2xl bg-[rgba(197,155,39,0.06)] border border-[rgba(197,155,39,0.2)] flex flex-col items-center justify-center gap-2 w-full text-center shadow-2xs">
                          <MessageSquare size={16} className="text-[var(--gold)] shrink-0" />
                          <p className="font-cormorant italic text-sm sm:text-base text-[var(--dark-brown)] leading-relaxed text-center px-2">
                            &ldquo;{item.message}&rdquo;
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      ) : (
        /* ─── VISTA 2: TABLA ENUMERADA CON PADDING AMPLIO ─── */
        <div className="rounded-3xl border-2 border-[rgba(197,155,39,0.3)] w-full shadow-xs bg-white overflow-hidden">
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[linear-gradient(135deg,rgba(197,155,39,0.15),rgba(212,163,115,0.15))] border-b-2 border-[rgba(197,155,39,0.25)]">
                  <th className="px-4 py-4 font-jakarta font-bold text-xs uppercase tracking-wider text-[var(--dark-brown)] text-center w-16">
                    #
                  </th>
                  <th className="px-6 py-4 font-jakarta font-bold text-xs uppercase tracking-wider text-[var(--dark-brown)]">
                    Invitados (Titular / Acompañante)
                  </th>
                  <th className="px-6 py-4 font-jakarta font-bold text-xs uppercase tracking-wider text-[var(--dark-brown)]">
                    Estado
                  </th>
                  <th className="px-6 py-4 font-jakarta font-bold text-xs uppercase tracking-wider text-[var(--dark-brown)]">
                    Detalles RSVP (Menú / Mensaje)
                  </th>
                  <th className="px-6 py-4 font-jakarta font-bold text-xs uppercase tracking-wider text-[var(--dark-brown)] text-right">
                    Acción
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredList.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-12 font-jakarta text-sm text-[var(--dark-brown-40)]">
                      {masterGuests.length === 0 && rsvps.length === 0
                        ? "Aún no cargaste ninguna lista de invitados ni hay respuestas. Tocá 'Cargar lista masiva' para empezar."
                        : "No se encontraron invitados con los filtros seleccionados."}
                    </td>
                  </tr>
                ) : (
                  filteredList.map((item, idx) => {
                    const titularDup =
                      item.status === "confirmed"
                        ? duplicatesMap.get(normalizePersonName(item.guestName))
                        : null;

                    return (
                      <tr
                        key={item.id}
                        className={`border-b border-[rgba(197,155,39,0.15)] transition-colors hover:bg-[rgba(197,155,39,0.04)] ${
                          item.hasDuplicates
                            ? "bg-rose-50/40"
                            : idx % 2 === 0
                            ? "bg-[var(--cream)]"
                            : "bg-[var(--cream-2)]"
                        }`}
                      >
                        {/* Number column */}
                        <td className="px-4 py-4.5 text-center font-jakarta align-top">
                          <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[rgba(197,155,39,0.15)] text-[var(--dark-brown)] font-bold text-xs border border-[rgba(197,155,39,0.3)] shadow-2xs">
                            {idx + 1}
                          </span>
                          {item.status === "confirmed" && item.attendeeStart && (
                            <span className="block text-[10px] font-semibold text-emerald-800 mt-1 whitespace-nowrap">
                              {item.attendeeStart === item.attendeeEnd
                                ? `#${item.attendeeStart}`
                                : `#${item.attendeeStart}–${item.attendeeEnd}`}
                            </span>
                          )}
                        </td>

                        {/* Names column */}
                        <td className="px-6 py-4.5 font-jakarta align-top">
                          <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-bold text-base text-[var(--dark-brown)]">
                                {item.guestName}
                              </span>
                              {item.type === "rsvp" && (
                                <span className="text-[10px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-md bg-[rgba(197,155,39,0.12)] text-[var(--gold)] border border-[rgba(197,155,39,0.25)]">
                                  Titular
                                </span>
                              )}
                              {item.status === "confirmed" && item.attendeeStart && (
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-100/80 text-emerald-800 border border-emerald-200">
                                  Persona #{item.attendeeStart}
                                </span>
                              )}
                              {titularDup && (
                                <span
                                  className="text-[10px] font-bold tracking-wider px-2 py-0.5 rounded-md bg-rose-100 text-rose-800 border border-rose-300 flex items-center gap-1"
                                  title={`Esta persona figura ${titularDup.occurrences.length} veces en total en las confirmaciones`}
                                >
                                  ⚠️ Repetido ({titularDup.occurrences.length}x)
                                </span>
                              )}
                            </div>

                            {item.companionNames.length > 0 ? (
                              item.companionNames.map((companionName, i) => {
                                const compDup =
                                  item.status === "confirmed"
                                    ? duplicatesMap.get(normalizePersonName(companionName))
                                    : null;
                                const personNum = item.attendeeStart
                                  ? item.attendeeStart + 1 + i
                                  : null;

                                return (
                                  <div key={i} className="flex items-center gap-2 flex-wrap pt-1 border-t border-dashed border-[rgba(197,155,39,0.2)]">
                                    <span className="font-semibold text-base text-[var(--dark-brown)]">
                                      {companionName}
                                    </span>
                                    <span className="text-[10px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-md bg-amber-100 text-amber-900 border border-amber-300">
                                      Acompañante
                                    </span>
                                    {personNum && (
                                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-100/80 text-emerald-800 border border-emerald-200">
                                        Persona #{personNum}
                                      </span>
                                    )}
                                    {compDup && (
                                      <span
                                        className="text-[10px] font-bold tracking-wider px-2 py-0.5 rounded-md bg-rose-100 text-rose-800 border border-rose-300 flex items-center gap-1"
                                        title={`Esta persona figura ${compDup.occurrences.length} veces en total en las confirmaciones`}
                                      >
                                        ⚠️ Repetido ({compDup.occurrences.length}x)
                                      </span>
                                    )}
                                  </div>
                                );
                              })
                            ) : item.companionsCount > 0 ? (
                              <div className="flex items-center gap-2 pt-1 border-t border-dashed border-[rgba(197,155,39,0.2)]">
                                <span className="font-semibold text-base text-[var(--dark-brown)]">
                                  + {item.companionsCount} Acompañante{item.companionsCount > 1 ? "s" : ""}
                                </span>
                                <span className="text-[10px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-md bg-amber-100 text-amber-900 border border-amber-300">
                                  Acompañante
                                </span>
                              </div>
                            ) : null}
                          </div>
                        </td>

                        {/* Status column */}
                        <td className="px-6 py-4.5 align-top">
                          <div className="flex flex-col gap-1 items-start">
                            {item.status === "confirmed" && (
                              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                                <CheckCircle size={13} /> Confirmado
                              </span>
                            )}
                            {item.status === "declined" && (
                              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800 border border-red-300">
                                <XCircle size={13} /> No asiste
                              </span>
                            )}
                            {item.status === "pending" && (
                              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
                                <Clock size={13} /> Pendiente
                              </span>
                            )}
                            {item.hasDuplicates && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200">
                                ⚠️ Con duplicados
                              </span>
                            )}
                          </div>
                        </td>

                        {/* RSVP Details column */}
                        <td className="px-6 py-4.5 font-jakarta text-xs text-[var(--dark-brown-70)] align-top">
                          {item.type === "rsvp" ? (
                            <div className="flex flex-col gap-2">
                              {item.dietaryRestrictions && item.dietaryRestrictions !== "ninguna" && (
                                <span className="text-xs text-amber-900 font-semibold flex items-center gap-1.5 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200/80 w-fit">
                                  <Utensils size={13} className="text-amber-700" /> Dieta:{" "}
                                  {DIETARY_LABELS[item.dietaryRestrictions as keyof typeof DIETARY_LABELS] ||
                                    item.dietaryRestrictions}
                                </span>
                              )}

                              {item.message ? (
                                <span className="text-xs italic text-[var(--dark-brown-70)] flex items-start gap-1.5 bg-[rgba(197,155,39,0.05)] p-2.5 rounded-xl border border-[rgba(197,155,39,0.15)]">
                                  <MessageSquare size={13} className="shrink-0 mt-0.5 text-[var(--gold)]" />
                                  &ldquo;{item.message}&rdquo;
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
                        <td className="px-6 py-4.5 text-right align-top">
                          <form
                            action={deleteGuestAction}
                            onSubmit={(e) => {
                              if (!confirm(`¿Seguro que querés eliminar el registro de ${item.guestName}?`)) {
                                e.preventDefault();
                              }
                            }}
                            className="inline"
                          >
                            {item.type === "master" && item.masterGuestId && (
                              <input type="hidden" name="id" value={item.masterGuestId} />
                            )}
                            {item.rsvpId && <input type="hidden" name="rsvpId" value={item.rsvpId} />}
                            <button
                              type="submit"
                              className="p-2 rounded-xl text-[var(--dark-brown-40)] hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                              title={item.type === "rsvp" ? "Eliminar confirmación RSVP" : "Eliminar de la lista"}
                              aria-label={`Eliminar ${item.guestName}`}
                            >
                              <Trash2 size={16} />
                            </button>
                          </form>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {masterGuests.length > 0 && (
        <div className="flex justify-end pt-2">
          <form
            action={clearAllGuestsAction}
            onSubmit={(e) => {
              if (!confirm("¿Seguro que querés vaciar toda la lista de invitados?")) {
                e.preventDefault();
              }
            }}
          >
            <button
              type="submit"
              className="text-xs font-semibold text-red-600 opacity-60 hover:opacity-100 flex items-center gap-1 cursor-pointer transition-opacity"
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
