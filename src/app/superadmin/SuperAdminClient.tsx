"use client";

import { useState, useTransition } from "react";
import type { InvitationRecord, TemplateId } from "@/lib/schemas/invitation.schema";
import { TEMPLATES } from "@/lib/schemas/invitation.schema";
import {
  createInvitationAction,
  updateInvitationAction,
  deleteInvitationAction,
  setDefaultInvitationAction,
} from "@/app/actions/invitation-actions";
import {
  Plus,
  Edit2,
  Trash2,
  Star,
  ExternalLink,
  Copy,
  Check,
  Calendar,
  MapPin,
  Gift,
  Music,
  Users,
  ShieldCheck,
  X,
  Loader2,
  Sparkles,
  Upload,
  Palette,
  RefreshCw,
  Volume2,
  VolumeX,
} from "lucide-react";

interface SuperAdminClientProps {
  invitations: InvitationRecord[];
  rsvpsCounts: Record<string, number>;
  authKey: string;
}

export default function SuperAdminClient({
  invitations,
  rsvpsCounts,
  authKey,
}: SuperAdminClientProps) {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingInv, setEditingInv] = useState<InvitationRecord | null>(null);
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);
  const [copiedAdminSlug, setCopiedAdminSlug] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleCopyLink = (slug: string) => {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    navigator.clipboard.writeText(`${origin}/${slug}`);
    setCopiedSlug(slug);
    setTimeout(() => setCopiedSlug(null), 2000);
  };

  const handleCopyClientAdminLink = (slug: string) => {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    navigator.clipboard.writeText(`${origin}/${slug}/admin`);
    setCopiedAdminSlug(slug);
    setTimeout(() => setCopiedAdminSlug(null), 2000);
  };

  const handleSetDefault = (id: string) => {
    startTransition(async () => {
      const res = await setDefaultInvitationAction(id);
      if (res.success) {
        setSuccessMessage(res.message || "Invitación establecida como principal");
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        setErrorMessage(res.message || "Error al actualizar");
      }
    });
  };

  const handleDelete = (id: string, slug: string) => {
    if (slug === "gabriel70") {
      alert("La invitación 'gabriel70' está protegida y no puede ser eliminada.");
      return;
    }
    if (!confirm(`¿Estás seguro de que deseas eliminar la invitación "${slug}"?`)) {
      return;
    }
    startTransition(async () => {
      const res = await deleteInvitationAction(id);
      if (res.success) {
        setSuccessMessage("Invitación eliminada correctamente.");
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        setErrorMessage(res.message || "Error al eliminar");
      }
    });
  };

  return (
    <div className="min-h-screen w-full pb-20" style={{ background: "var(--cream)" }}>
      {/* Top Bar */}
      <div
        aria-hidden="true"
        className="w-full h-1.5"
        style={{
          background:
            "linear-gradient(90deg, #C59B27 0%, #D4A373 50%, #C59B27 100%)",
        }}
      />

      <header className="border-b border-[rgba(197,155,39,0.2)] bg-white/70 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[rgba(197,155,39,0.15)] flex items-center justify-center text-[var(--gold)]">
              <Sparkles size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-widest text-[var(--gold)]">
                  Panel Maestro
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold border border-amber-200">
                  SUPERADMIN
                </span>
              </div>
              <h1 className="font-cormorant font-bold text-2xl text-[var(--dark-brown)]">
                Gestor de Invitaciones Digitales
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={() => setIsCreateOpen(true)}
              className="btn-gold flex items-center justify-center gap-2 text-xs py-2.5 px-4 rounded-xl font-bold shadow-md w-full sm:w-auto"
            >
              <Plus size={16} />
              <span>Crear Nueva Invitación</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 flex flex-col gap-8">
        {/* Notifications */}
        {errorMessage && (
          <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-sm font-semibold flex items-center justify-between">
            <span>{errorMessage}</span>
            <button onClick={() => setErrorMessage(null)} className="text-red-600 hover:text-red-800">
              <X size={18} />
            </button>
          </div>
        )}
        {successMessage && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-semibold flex items-center justify-between">
            <span>{successMessage}</span>
            <button onClick={() => setSuccessMessage(null)} className="text-emerald-600 hover:text-emerald-800">
              <X size={18} />
            </button>
          </div>
        )}

        {/* Global KPI Cards */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-2xl p-5 bg-white border border-[rgba(197,155,39,0.25)] shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[rgba(197,155,39,0.15)] flex items-center justify-center text-[var(--gold)] shrink-0">
              <Sparkles size={24} />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-[var(--dark-brown-70)]">Total Invitaciones</span>
              <span className="font-cormorant font-bold text-3xl text-[var(--dark-brown)]">
                {invitations.length}
              </span>
            </div>
          </div>

          <div className="rounded-2xl p-5 bg-white border border-[rgba(197,155,39,0.25)] shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[rgba(212,163,115,0.15)] flex items-center justify-center text-[#D4A373] shrink-0">
              <Users size={24} />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-[var(--dark-brown-70)]">Total Confirmados</span>
              <span className="font-cormorant font-bold text-3xl text-[var(--dark-brown)]">
                {Object.values(rsvpsCounts).reduce((a, b) => a + b, 0)}
              </span>
            </div>
          </div>

          <div className="rounded-2xl p-5 bg-white border border-[rgba(197,155,39,0.25)] shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600 shrink-0">
              <Star size={24} className="fill-amber-500" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-[var(--dark-brown-70)]">Invitación en Home (/)</span>
              <span className="font-jakarta font-bold text-sm text-[var(--dark-brown)] truncate max-w-[200px]">
                {invitations.find((i) => i.isDefault)?.headline || "gabriel70"}
              </span>
            </div>
          </div>
        </section>

        {/* Invitations Grid / List */}
        <section className="flex flex-col gap-4">
          <h2 className="font-cormorant font-bold text-2xl text-[var(--dark-brown)] flex items-center gap-2">
            <span>Invitaciones Creadas</span>
            <span className="text-xs font-jakarta font-semibold px-2.5 py-0.5 rounded-full bg-[rgba(197,155,39,0.15)] text-[var(--gold)]">
              {invitations.length}
            </span>
          </h2>

          <div className="grid grid-cols-1 gap-4">
            {invitations.map((inv) => {
              const confirmados = rsvpsCounts[inv.slug] || 0;
              const isGabriel = inv.slug === "gabriel70";
              const currentTemplate =
                TEMPLATES.find((t) => t.id === inv.template) || TEMPLATES[0];

              return (
                <div
                  key={inv.id}
                  className="rounded-2xl p-5 sm:p-6 bg-white border border-[rgba(197,155,39,0.25)] shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-5 transition-all hover:shadow-md"
                >
                  {/* Left Column: Details */}
                  <div className="flex flex-col gap-2 max-w-xl">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-md bg-[rgba(197,155,39,0.12)] text-[var(--gold)]">
                        /{inv.slug}
                      </span>

                      {/* Plantilla Badge */}
                      <span className="inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-800 border border-purple-200">
                        <span>{currentTemplate.emoji}</span>
                        <span>{currentTemplate.name}</span>
                      </span>

                      {inv.isDefault && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                          <Star size={11} className="fill-amber-600 text-amber-600" />
                          Principal (Home /)
                        </span>
                      )}
                      {isGabriel && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                          <ShieldCheck size={12} />
                          Vigente / Protegida
                        </span>
                      )}
                    </div>

                    <h3 className="font-cormorant font-bold text-2xl text-[var(--dark-brown)]">
                      {inv.headline}
                    </h3>
                    <p className="text-xs text-[var(--dark-brown-70)] line-clamp-1">
                      {inv.subheadline}
                    </p>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-[var(--dark-brown-70)] pt-1">
                      <span className="flex items-center gap-1">
                        <Calendar size={13} className="text-[var(--gold)]" />
                        {inv.badgeText}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin size={13} className="text-[var(--gold)]" />
                        {inv.venueName}
                      </span>
                      <span className="flex items-center gap-1 font-semibold text-[var(--gold)]">
                        <Users size={13} />
                        {confirmados} confirmados
                      </span>
                      {inv.audioTrackPath ? (
                        <span className="flex items-center gap-1 text-emerald-700">
                          <Volume2 size={13} /> Con música
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-gray-400">
                          <VolumeX size={13} /> Sin música
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Right Column: Actions */}
                  <div className="flex flex-wrap items-center gap-2 w-full md:w-auto border-t md:border-t-0 pt-3 md:pt-0 border-[rgba(197,155,39,0.15)]">
                    {/* Copiar link invitación */}
                    <button
                      onClick={() => handleCopyLink(inv.slug)}
                      className="btn-outline text-xs py-2 px-3 flex items-center gap-1.5 flex-1 sm:flex-none justify-center"
                      title="Copiar link de la invitación pública"
                    >
                      {copiedSlug === inv.slug ? <Check size={13} color="#16a34a" /> : <Copy size={13} />}
                      {copiedSlug === inv.slug ? "Copiado" : "Link Invitación"}
                    </button>

                    {/* Copiar link para cliente */}
                    <button
                      onClick={() => handleCopyClientAdminLink(inv.slug)}
                      className="btn-gold text-xs py-2 px-3 flex items-center gap-1.5 flex-1 sm:flex-none justify-center"
                      title="Copiar link del Admin para enviarle al cliente"
                    >
                      {copiedAdminSlug === inv.slug ? <Check size={13} color="#fff" /> : <Copy size={13} />}
                      {copiedAdminSlug === inv.slug ? "Copiado" : "Link p/ Cliente"}
                    </button>

                    {/* Ver Admin Cliente */}
                    <a
                      href={`/${inv.slug}/admin`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-outline text-xs py-2 px-2.5 flex items-center justify-center text-[var(--dark-brown)]"
                      title="Abrir Admin del Cliente"
                    >
                      <ExternalLink size={14} />
                    </a>

                    {/* Editar */}
                    <button
                      onClick={() => setEditingInv(inv)}
                      className="p-2 rounded-xl text-[var(--dark-brown)] hover:bg-[rgba(197,155,39,0.15)] transition-colors cursor-pointer"
                      title="Editar toda la invitación"
                    >
                      <Edit2 size={16} />
                    </button>

                    {/* Marcar como Home */}
                    {!inv.isDefault && (
                      <button
                        onClick={() => handleSetDefault(inv.id)}
                        disabled={isPending}
                        className="p-2 rounded-xl text-amber-600 hover:bg-amber-50 transition-colors cursor-pointer"
                        title="Establecer como invitación de la página de inicio (/)"
                      >
                        <Star size={16} />
                      </button>
                    )}

                    {/* Eliminar */}
                    {!isGabriel && (
                      <button
                        onClick={() => handleDelete(inv.id, inv.slug)}
                        disabled={isPending}
                        className="p-2 rounded-xl text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                        title="Eliminar invitación"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Modal: Crear Invitación */}
        {isCreateOpen && (
          <InvitationFormModal
            title="Crear Nueva Invitación Digital"
            authKey={authKey}
            onClose={() => setIsCreateOpen(false)}
            onSaved={() => {
              setIsCreateOpen(false);
              setSuccessMessage("¡Invitación creada con éxito!");
              setTimeout(() => setSuccessMessage(null), 3000);
            }}
          />
        )}

        {/* Modal: Editar Invitación */}
        {editingInv && (
          <InvitationFormModal
            title={`Editar: ${editingInv.headline}`}
            invitation={editingInv}
            authKey={authKey}
            onClose={() => setEditingInv(null)}
            onSaved={() => {
              setEditingInv(null);
              setSuccessMessage("¡Invitación actualizada!");
              setTimeout(() => setSuccessMessage(null), 3000);
            }}
          />
        )}
      </main>
    </div>
  );
}

// Helpers for date/time conversion and formatting
function isoToDatetimeLocal(isoStr?: string): string {
  if (!isoStr) return "";
  try {
    const d = new Date(isoStr);
    if (isNaN(d.getTime())) return "";
    const pad = (n: number) => String(n).padStart(2, "0");
    const year = d.getFullYear();
    const month = pad(d.getMonth() + 1);
    const day = pad(d.getDate());
    const hours = pad(d.getHours());
    const minutes = pad(d.getMinutes());
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  } catch {
    return "";
  }
}

function formatBadgeFromDatetimeLocal(localVal: string): string {
  if (!localVal) return "";
  try {
    const [datePart, timePart] = localVal.split("T");
    if (!datePart) return "";
    const [year, month, day] = datePart.split("-").map(Number);
    const [hour, min] = (timePart || "20:00").split(":").map(Number);
    const d = new Date(year, month - 1, day, hour, min);

    const days = [
      "Domingo",
      "Lunes",
      "Martes",
      "Miércoles",
      "Jueves",
      "Viernes",
      "Sábado",
    ];
    const months = [
      "Enero",
      "Febrero",
      "Marzo",
      "Abril",
      "Mayo",
      "Junio",
      "Julio",
      "Agosto",
      "Septiembre",
      "Octubre",
      "Noviembre",
      "Diciembre",
    ];
    const dayName = days[d.getDay()];
    const monthName = months[d.getMonth()];
    const timeStr = `${String(hour).padStart(2, "0")}:${String(min).padStart(2, "0")} hs`;

    return `${dayName} · ${day} de ${monthName} · ${timeStr}`;
  } catch {
    return "";
  }
}

function datetimeLocalToIsoWithOffset(localVal: string): string {
  if (!localVal) return "";
  return `${localVal}:00-03:00`;
}

// Modal Form Component for Creating and Editing Invitations
interface InvitationFormModalProps {
  title: string;
  invitation?: InvitationRecord;
  authKey: string;
  onClose: () => void;
  onSaved: () => void;
}

function InvitationFormModal({
  title,
  invitation,
  onClose,
  onSaved,
}: InvitationFormModalProps) {
  const isEditing = !!invitation;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Template state
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateId>(
    (invitation?.template as TemplateId) || "classic-gold"
  );

  // Date and Badge state
  const initialLocal =
    isoToDatetimeLocal(invitation?.targetDate) || "2026-11-07T20:30";
  const [datetimeLocal, setDatetimeLocal] = useState<string>(initialLocal);
  const [badgeText, setBadgeText] = useState<string>(
    invitation?.badgeText || "Sábado · 7 de Noviembre · 20:30 hs"
  );

  // Optional Gifts Section State
  const initialHasGifts = Boolean(
    invitation?.giftAlias ||
      invitation?.giftCbu ||
      (invitation?.giftBankName &&
        invitation.giftBankName !== "Banco / Billetera Virtual")
  );
  const [includeGifts, setIncludeGifts] = useState<boolean>(
    isEditing ? initialHasGifts : false
  );

  // Audio state
  const [audioMode, setAudioMode] = useState<"preset" | "upload" | "none" | "keep">(
    isEditing && invitation?.audioTrackPath ? "keep" : "none"
  );
  const [uploadedAudioFileName, setUploadedAudioFileName] = useState<string>("");
  const [selectedPresetAudio, setSelectedPresetAudio] = useState<string>(
    invitation?.audioTrackPath || "/audio/LosAngelesAzules-LaCumbiadelInfinito.mp3"
  );

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVal = e.target.value;
    setDatetimeLocal(newVal);
    const autoBadge = formatBadgeFromDatetimeLocal(newVal);
    if (autoBadge) {
      setBadgeText(autoBadge);
    }
  };

  const handleRegenerateBadge = () => {
    const autoBadge = formatBadgeFromDatetimeLocal(datetimeLocal);
    if (autoBadge) {
      setBadgeText(autoBadge);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData(e.currentTarget);

    // Compute targetDate from datetimeLocal
    const targetDateIso = datetimeLocalToIsoWithOffset(datetimeLocal);
    formData.set("targetDate", targetDateIso);
    formData.set("template", selectedTemplate);

    // Audio handling in formData
    if (audioMode === "none") {
      formData.set("audioRemove", "true");
      formData.set("audioTrackPath", "");
    } else if (audioMode === "preset") {
      formData.set("audioTrackPath", selectedPresetAudio);
    } else if (audioMode === "keep" && invitation?.audioTrackPath) {
      formData.set("audioTrackPath", invitation.audioTrackPath);
    }

    // If gifts are not included, clear gift values
    if (!includeGifts) {
      formData.set("giftBankName", "");
      formData.set("giftAlias", "");
      formData.set("giftCbu", "");
      formData.set("giftHolderName", "");
    }

    try {
      if (isEditing) {
        formData.set("currentAudioTrackPath", invitation.audioTrackPath || "");
        const res = await updateInvitationAction(invitation.id, null, formData);
        if (res.success) {
          onSaved();
        } else {
          setError(res.message || "Error al actualizar la invitación.");
        }
      } else {
        const res = await createInvitationAction(null, formData);
        if (res.success) {
          onSaved();
        } else {
          setError(res.message || "Error al crear la invitación.");
        }
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error inesperado.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto"
    >
      <div className="relative w-full max-w-3xl my-8 bg-white rounded-3xl shadow-2xl border border-[rgba(197,155,39,0.3)] flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-6 border-b border-[rgba(197,155,39,0.2)] flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[11px] font-bold text-[var(--gold)] uppercase tracking-widest">
              Configurador de Invitación
            </span>
            <h3 className="font-cormorant font-bold text-2xl text-[var(--dark-brown)]">
              {title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full flex items-center justify-center text-[var(--dark-brown-70)] hover:bg-[rgba(197,155,39,0.1)] transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body: Scrollable Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex flex-col gap-6">
          {error && (
            <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs sm:text-sm font-semibold">
              {error}
            </div>
          )}

          {/* ─── SECCIÓN 0: ELECCIÓN DE PLANTILLA VISUAL ─── */}
          <fieldset className="flex flex-col gap-3 border-b border-[rgba(197,155,39,0.15)] pb-6">
            <legend className="font-jakarta font-bold text-sm text-[var(--gold)] uppercase tracking-wider flex items-center gap-2 mb-1">
              <Palette size={16} /> Plantilla de Diseño Temática
            </legend>
            <p className="text-xs text-[var(--dark-brown-70)] mb-2">
              Elegí la estética y animación visual de esta invitación:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {TEMPLATES.map((tmpl) => {
                const isSelected = selectedTemplate === tmpl.id;
                return (
                  <button
                    key={tmpl.id}
                    type="button"
                    onClick={() => setSelectedTemplate(tmpl.id)}
                    className={`relative p-3.5 rounded-2xl text-left border-2 transition-all flex flex-col gap-1.5 cursor-pointer ${
                      isSelected
                        ? "border-[var(--gold)] bg-[rgba(197,155,39,0.08)] shadow-md ring-2 ring-[var(--gold)]/20"
                        : "border-gray-200 hover:border-gray-300 bg-white"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-2xl">{tmpl.emoji}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">
                        {tmpl.category}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold text-sm text-[var(--dark-brown)]">
                        {tmpl.name}
                      </span>
                      <span className="text-[11px] text-[var(--dark-brown-70)] line-clamp-2 leading-tight">
                        {tmpl.description}
                      </span>
                    </div>

                    {isSelected && (
                      <span className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full bg-[var(--gold)] text-white flex items-center justify-center text-xs font-bold">
                        ✓
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
            <input type="hidden" name="template" value={selectedTemplate} />
          </fieldset>

          {/* ─── SECCIÓN 1: IDENTIFICACIÓN Y GENERAL ─── */}
          <fieldset className="flex flex-col gap-4 border-b border-[rgba(197,155,39,0.15)] pb-6">
            <legend className="font-jakarta font-bold text-sm text-[var(--gold)] uppercase tracking-wider flex items-center gap-2 mb-2">
              <Sparkles size={16} /> 1. Datos Generales del Evento
            </legend>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-[var(--dark-brown)]">
                  Identificador URL (Slug) <span className="text-red-600">*</span>
                </label>
                <input
                  name="slug"
                  type="text"
                  required
                  defaultValue={invitation?.slug || ""}
                  placeholder="ej: toystory-mateo, lucia15, princesas-sofia"
                  pattern="[a-z0-9\-]+"
                  className="form-input text-sm p-3 font-mono"
                  readOnly={invitation?.slug === "gabriel70"}
                />
                <span className="text-[11px] text-[var(--dark-brown-40)]">
                  Se verá en: tudominio.com/<b>slug</b>
                </span>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-[var(--dark-brown)]">
                  Nombre del Homenajeado/a <span className="text-red-600">*</span>
                </label>
                <input
                  name="personName"
                  type="text"
                  required
                  defaultValue={invitation?.personName || ""}
                  placeholder="ej: Mateo, Sofía, Gabriel"
                  className="form-input text-sm p-3"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2 flex flex-col gap-1">
                <label className="text-xs font-bold text-[var(--dark-brown)]">
                  Título Principal (Headline) <span className="text-red-600">*</span>
                </label>
                <input
                  name="headline"
                  type="text"
                  required
                  defaultValue={invitation?.headline || ""}
                  placeholder="ej: Los 5 Años de Mateo, Mis 15 Sofía"
                  className="form-input text-sm p-3"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-[var(--dark-brown)]">
                  Número Central o Edad
                </label>
                <input
                  name="eventNumber"
                  type="text"
                  defaultValue={invitation?.eventNumber ?? "5"}
                  placeholder="ej: 5, 10, 15, 70"
                  className="form-input text-sm p-3 text-center font-bold"
                />
                <span className="text-[11px] text-[var(--dark-brown-40)]">
                  Aparece en el sobre y en el número central
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-[var(--dark-brown)]">
                Subtítulo / Frase de bienvenida <span className="text-red-600">*</span>
              </label>
              <textarea
                name="subheadline"
                rows={2}
                required
                defaultValue={invitation?.subheadline || ""}
                placeholder="ej: ¡Vení a festejar y jugar conmigo una tarde inolvidable llena de sorpresas!"
                className="form-input text-sm p-3 resize-none"
              />
            </div>
          </fieldset>

          {/* ─── SECCIÓN 2: FECHA Y CUENTA REGRESIVA (CALENDARIO) ─── */}
          <fieldset className="flex flex-col gap-4 border-b border-[rgba(197,155,39,0.15)] pb-6">
            <legend className="font-jakarta font-bold text-sm text-[var(--gold)] uppercase tracking-wider flex items-center gap-2 mb-2">
              <Calendar size={16} /> 2. Fecha, Horario y Cuenta Regresiva
            </legend>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Calendario nativo */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-[var(--dark-brown)]">
                  Elegí Fecha y Hora en el Calendario <span className="text-red-600">*</span>
                </label>
                <input
                  type="datetime-local"
                  required
                  value={datetimeLocal}
                  onChange={handleDateChange}
                  className="form-input text-sm p-3 bg-white"
                />
                <span className="text-[11px] text-[var(--dark-brown-40)]">
                  Establece automáticamente la cuenta regresiva
                </span>
              </div>

              {/* Texto visible de la insignia */}
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-[var(--dark-brown)]">
                    Texto Visible de Fecha y Hora <span className="text-red-600">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={handleRegenerateBadge}
                    className="text-[11px] text-[var(--gold)] font-bold flex items-center gap-1 hover:underline cursor-pointer"
                    title="Regenerar texto a partir del calendario"
                  >
                    <RefreshCw size={11} /> Auto-generar
                  </button>
                </div>
                <input
                  name="badgeText"
                  type="text"
                  required
                  value={badgeText}
                  onChange={(e) => setBadgeText(e.target.value)}
                  placeholder="ej: Sábado · 7 de Noviembre · 20:30 hs"
                  className="form-input text-sm p-3"
                />
                <span className="text-[11px] text-[var(--dark-brown-40)]">
                  Texto elegante que verán los invitados en la tarjeta
                </span>
              </div>
            </div>
          </fieldset>

          {/* ─── SECCIÓN 3: UBICACIÓN Y SALÓN ─── */}
          <fieldset className="flex flex-col gap-4 border-b border-[rgba(197,155,39,0.15)] pb-6">
            <legend className="font-jakarta font-bold text-sm text-[var(--gold)] uppercase tracking-wider flex items-center gap-2 mb-2">
              <MapPin size={16} /> 3. Lugar de la Celebración
            </legend>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-[var(--dark-brown)]">
                  Nombre del Salón, Finca o Casa <span className="text-red-600">*</span>
                </label>
                <input
                  name="venueName"
                  type="text"
                  required
                  defaultValue={invitation?.venueName || ""}
                  placeholder="ej: Salón Planet Jump, Finca El Reencuentro"
                  className="form-input text-sm p-3"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-[var(--dark-brown)]">
                  Dirección y Localidad <span className="text-red-600">*</span>
                </label>
                <input
                  name="venueAddress"
                  type="text"
                  required
                  defaultValue={invitation?.venueAddress || ""}
                  placeholder="ej: Av. Colón 1234, Mar del Plata"
                  className="form-input text-sm p-3"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-[var(--dark-brown)]">
                  Link de Google Maps (Opcional)
                </label>
                <input
                  name="venueMapsUrl"
                  type="url"
                  defaultValue={invitation?.venueMapsUrl || ""}
                  placeholder="https://maps.google.com/..."
                  className="form-input text-sm p-3"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-[var(--dark-brown)]">
                  Link de Google Calendar / Agendar (Opcional)
                </label>
                <input
                  name="venueCalendarUrl"
                  type="url"
                  defaultValue={invitation?.venueCalendarUrl || ""}
                  placeholder="https://calendar.google.com/calendar/render?..."
                  className="form-input text-sm p-3"
                />
              </div>
            </div>
          </fieldset>

          {/* ─── SECCIÓN 4: REGALOS Y BANCO (TOTALMENTE OPCIONAL) ─── */}
          <fieldset className="flex flex-col gap-4 border-b border-[rgba(197,155,39,0.15)] pb-6">
            <div className="flex items-center justify-between">
              <legend className="font-jakarta font-bold text-sm text-[var(--gold)] uppercase tracking-wider flex items-center gap-2">
                <Gift size={16} /> 4. Mesa de Regalos / Datos Bancarios (Opcional)
              </legend>

              <label className="inline-flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeGifts}
                  onChange={(e) => setIncludeGifts(e.target.checked)}
                  className="w-4 h-4 text-[var(--gold)] rounded"
                />
                <span className="text-xs font-bold text-[var(--dark-brown)]">
                  Incluir Mesa de Regalos
                </span>
              </label>
            </div>

            {includeGifts ? (
              <div className="flex flex-col gap-4 p-4 rounded-2xl bg-amber-50/50 border border-amber-200/60 animate-fade-in">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-[var(--dark-brown)]">
                      Banco o Billetera Virtual
                    </label>
                    <input
                      name="giftBankName"
                      type="text"
                      defaultValue={invitation?.giftBankName || "Mercado Pago"}
                      placeholder="ej: Mercado Pago, Banco Galicia"
                      className="form-input text-sm p-3"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-[var(--dark-brown)]">
                      Titular de la cuenta
                    </label>
                    <input
                      name="giftHolderName"
                      type="text"
                      defaultValue={invitation?.giftHolderName || ""}
                      placeholder="ej: Mamá / Papá de Mateo"
                      className="form-input text-sm p-3"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-[var(--dark-brown)]">
                      Alias
                    </label>
                    <input
                      name="giftAlias"
                      type="text"
                      defaultValue={invitation?.giftAlias || ""}
                      placeholder="ej: MATEO.CUMPLE.5"
                      className="form-input text-sm p-3 uppercase font-mono"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-[var(--dark-brown)]">
                      CBU / CVU
                    </label>
                    <input
                      name="giftCbu"
                      type="text"
                      defaultValue={invitation?.giftCbu || ""}
                      placeholder="ej: 0000003100062663052871"
                      className="form-input text-sm p-3 font-mono"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-200 text-xs text-gray-600 flex items-center gap-2">
                <span className="text-base">ℹ️</span>
                <span>
                  <b>Sin regalos en dinero:</b> No se mostrará sección de banco/alcancía, y los invitados podrán confirmar su asistencia directamente sin bloqueos.
                </span>
              </div>
            )}
          </fieldset>

          {/* ─── SECCIÓN 5: AUDIO Y PIE DE PÁGINA (OPCIONAL) ─── */}
          <fieldset className="flex flex-col gap-4">
            <legend className="font-jakarta font-bold text-sm text-[var(--gold)] uppercase tracking-wider flex items-center gap-2 mb-1">
              <Music size={16} /> 5. Música de Fondo y Mensaje Final (Opcional)
            </legend>

            <div className="flex flex-col gap-3 p-4 rounded-2xl bg-amber-50/40 border border-amber-200/50">
              <span className="text-xs font-bold text-[var(--dark-brown)]">
                Música de Fondo:
              </span>

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setAudioMode("none")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                    audioMode === "none"
                      ? "bg-gray-800 text-white border-gray-800"
                      : "bg-white text-gray-700 border-gray-300"
                  }`}
                >
                  🔇 Sin Música
                </button>

                <button
                  type="button"
                  onClick={() => setAudioMode("upload")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors flex items-center gap-1.5 cursor-pointer ${
                    audioMode === "upload"
                      ? "bg-[var(--gold)] text-white border-[var(--gold)]"
                      : "bg-white text-gray-700 border-gray-300"
                  }`}
                >
                  <Upload size={13} /> Subir Archivo (.mp3)
                </button>

                <button
                  type="button"
                  onClick={() => setAudioMode("preset")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                    audioMode === "preset"
                      ? "bg-[var(--gold)] text-white border-[var(--gold)]"
                      : "bg-white text-gray-700 border-gray-300"
                  }`}
                >
                  📻 Canción Predeterminada
                </button>

                {isEditing && invitation?.audioTrackPath && (
                  <button
                    type="button"
                    onClick={() => setAudioMode("keep")}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                      audioMode === "keep"
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-white text-gray-700 border-gray-300"
                    }`}
                  >
                    🎵 Conservar Actual
                  </button>
                )}
              </div>

              {/* Subir archivo de audio desde PC */}
              {audioMode === "upload" && (
                <div className="flex flex-col gap-2 pt-2 animate-fade-in">
                  <label className="text-xs font-bold text-[var(--dark-brown)] flex items-center gap-1">
                    <Upload size={14} /> Seleccionar archivo de audio desde tu computadora:
                  </label>
                  <input
                    type="file"
                    name="audioFile"
                    accept="audio/*"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setUploadedAudioFileName(e.target.files[0].name);
                      }
                    }}
                    className="text-xs file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-[var(--gold)] file:text-white file:cursor-pointer p-2 border border-dashed border-[var(--gold)] rounded-xl bg-white"
                  />
                  {uploadedAudioFileName && (
                    <span className="text-[11px] text-emerald-700 font-bold">
                      ✓ Seleccionado: {uploadedAudioFileName}
                    </span>
                  )}
                </div>
              )}

              {/* Pista predeterminada */}
              {audioMode === "preset" && (
                <div className="flex flex-col gap-2 pt-2 animate-fade-in">
                  <label className="text-xs font-bold text-[var(--dark-brown)]">
                    Elegí una canción predeterminada:
                  </label>
                  <select
                    value={selectedPresetAudio}
                    onChange={(e) => setSelectedPresetAudio(e.target.value)}
                    className="form-input text-xs p-2.5 bg-white"
                  >
                    <option value="/audio/LosAngelesAzules-LaCumbiadelInfinito.mp3">
                      🎺 Los Ángeles Azules - La Cumbia del Infinito
                    </option>
                    <option value="/audio/celebration.mp3">
                      🎉 Celebration (Música Festiva Instrumental)
                    </option>
                  </select>
                </div>
              )}

              {/* Conservar actual */}
              {audioMode === "keep" && invitation?.audioTrackPath && (
                <div className="text-xs text-blue-800 font-medium pt-1">
                  Se mantendrá el audio actual: <code className="font-mono text-[11px] bg-blue-50 px-2 py-0.5 rounded">{invitation.audioTrackPath}</code>
                </div>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-[var(--dark-brown)]">
                Frase de Cierre (Pie de Página)
              </label>
              <textarea
                name="footerPhrase"
                rows={2}
                defaultValue={invitation?.footerPhrase || ""}
                placeholder="ej: ¡Te esperamos con muchas ganas de divertirnos y pasar un momento mágico!"
                className="form-input text-sm p-3 resize-none"
              />
            </div>

            {/* Checkbox: Default */}
            <div className="flex items-center gap-2 pt-2">
              <input
                id="isDefault-checkbox"
                name="isDefault"
                type="checkbox"
                defaultChecked={invitation?.isDefault || false}
                className="w-4 h-4 text-[var(--gold)] rounded"
              />
              <label
                htmlFor="isDefault-checkbox"
                className="text-xs sm:text-sm font-semibold text-[var(--dark-brown)] cursor-pointer"
              >
                Establecer como invitación principal del dominio (se cargará al entrar a /)
              </label>
            </div>
          </fieldset>

          {/* Footer Submit */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[rgba(197,155,39,0.2)]">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="btn-outline text-xs py-2.5 px-5"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-gold text-xs py-2.5 px-6 flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Guardando...
                </>
              ) : isEditing ? (
                "Guardar Cambios"
              ) : (
                "Crear Invitación"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
