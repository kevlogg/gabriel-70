"use client";

import { useState, useTransition } from "react";
import type { InvitationRecord } from "@/lib/schemas/invitation.schema";
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
            "linear-gradient(90deg, transparent, #C59B27 30%, #D4A373 50%, #C59B27 70%, transparent)",
        }}
      />

      <main className="max-w-6xl mx-auto px-4 sm:px-8 py-8 flex flex-col gap-8">
        {/* Header */}
        <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span
                className="font-jakarta font-bold text-xs tracking-widest uppercase px-3 py-1 rounded-full text-white bg-[var(--gold)]"
              >
                SUPERADMIN
              </span>
              <span className="text-xs text-[var(--dark-brown-40)] font-medium">
                Gestor global de invitaciones digitales
              </span>
            </div>
            <h1 className="font-cormorant font-bold text-3xl sm:text-4xl text-[var(--dark-brown)]">
              Panel Superadministrador
            </h1>
            <p className="font-jakarta text-xs sm:text-sm text-[var(--dark-brown-70)]">
              Creá, editá y gestioná cada invitación digital y los links de sus clientes.
            </p>
          </div>

          <button
            onClick={() => {
              setErrorMessage(null);
              setIsCreateOpen(true);
            }}
            className="btn-gold text-sm py-3 px-6 flex items-center gap-2 shadow-md cursor-pointer self-stretch sm:self-auto justify-center"
          >
            <Plus size={18} />
            Nueva Invitación
          </button>
        </header>

        {/* Alerts */}
        {successMessage && (
          <div className="rounded-2xl p-4 bg-green-50 border border-green-300 text-green-900 text-sm font-jakarta font-semibold animate-scale-in">
            {successMessage}
          </div>
        )}
        {errorMessage && (
          <div className="rounded-2xl p-4 bg-red-50 border border-red-300 text-red-900 text-sm font-jakarta font-semibold animate-scale-in">
            {errorMessage}
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData(e.currentTarget);

    try {
      if (isEditing) {
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

          {/* SECCIÓN 1: IDENTIFICACIÓN Y GENERAL */}
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
                  placeholder="ej: martina15, boda-ana-y-lucas"
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
                  placeholder="ej: Gabriel, Martina, Sofía & Mateo"
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
                  placeholder="ej: Los 70 de Gabriel, Mis 15 Sofía"
                  className="form-input text-sm p-3"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-[var(--dark-brown)]">
                  Número o Símbolo Central
                </label>
                <input
                  name="eventNumber"
                  type="text"
                  defaultValue={invitation?.eventNumber ?? "70"}
                  placeholder="ej: 70, 15, XV, &"
                  className="form-input text-sm p-3 text-center font-bold"
                />
                <span className="text-[11px] text-[var(--dark-brown-40)]">
                  Aparece gigante en dorado y en el sello del sobre
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
                placeholder="ej: ¡Acompañanos a celebrar una vida llena de momentos inolvidables!"
                className="form-input text-sm p-3 resize-none"
              />
            </div>
          </fieldset>

          {/* SECCIÓN 2: FECHA Y CUENTA REGRESIVA */}
          <fieldset className="flex flex-col gap-4 border-b border-[rgba(197,155,39,0.15)] pb-6">
            <legend className="font-jakarta font-bold text-sm text-[var(--gold)] uppercase tracking-wider flex items-center gap-2 mb-2">
              <Calendar size={16} /> 2. Fecha, Horario y Cuenta Regresiva
            </legend>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-[var(--dark-brown)]">
                  Texto visible de Fecha y Hora (Badge) <span className="text-red-600">*</span>
                </label>
                <input
                  name="badgeText"
                  type="text"
                  required
                  defaultValue={invitation?.badgeText || "Sábado · 7 de Noviembre · 20:30 hs"}
                  placeholder="ej: Sábado · 7 de Noviembre · 20:30 hs"
                  className="form-input text-sm p-3"
                />
                <span className="text-[11px] text-[var(--dark-brown-40)]">
                  Se muestra en la cabecera y en la tarjeta del salón
                </span>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-[var(--dark-brown)]">
                  Fecha y Hora exacta (para Cuenta Regresiva) <span className="text-red-600">*</span>
                </label>
                <input
                  name="targetDate"
                  type="text"
                  required
                  defaultValue={invitation?.targetDate || "2026-11-07T20:30:00-03:00"}
                  placeholder="ej: 2026-11-07T20:30:00-03:00"
                  className="form-input text-sm p-3 font-mono"
                />
                <span className="text-[11px] text-[var(--dark-brown-40)]">
                  Formato ISO (AAAA-MM-DDTHH:MM:SS-03:00)
                </span>
              </div>
            </div>
          </fieldset>

          {/* SECCIÓN 3: UBICACIÓN Y SALÓN */}
          <fieldset className="flex flex-col gap-4 border-b border-[rgba(197,155,39,0.15)] pb-6">
            <legend className="font-jakarta font-bold text-sm text-[var(--gold)] uppercase tracking-wider flex items-center gap-2 mb-2">
              <MapPin size={16} /> 3. Lugar de la Celebración
            </legend>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-[var(--dark-brown)]">
                  Nombre del Salón o Finca <span className="text-red-600">*</span>
                </label>
                <input
                  name="venueName"
                  type="text"
                  required
                  defaultValue={invitation?.venueName || ""}
                  placeholder="ej: Finca 'El Reencuentro', Salón Los Robles"
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
                  placeholder="ej: Mar del Plata, Provincia de Buenos Aires"
                  className="form-input text-sm p-3"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-[var(--dark-brown)]">
                  Link de Google Maps
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
                  Link de Google Calendar (Agendar)
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

          {/* SECCIÓN 4: REGALOS Y BANCO (COFRE) */}
          <fieldset className="flex flex-col gap-4 border-b border-[rgba(197,155,39,0.15)] pb-6">
            <legend className="font-jakarta font-bold text-sm text-[var(--gold)] uppercase tracking-wider flex items-center gap-2 mb-2">
              <Gift size={16} /> 4. Mesa de Regalos / Datos Bancarios (Cofre)
            </legend>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-[var(--dark-brown)]">
                  Banco o Billetera Virtual
                </label>
                <input
                  name="giftBankName"
                  type="text"
                  defaultValue={invitation?.giftBankName || "Banco / Billetera Virtual"}
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
                  placeholder="ej: Gabriel Pérez"
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
                  placeholder="ej: GABRIEL.70.CUMPLE"
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
          </fieldset>

          {/* SECCIÓN 5: AUDIO Y PIE DE PÁGINA */}
          <fieldset className="flex flex-col gap-4">
            <legend className="font-jakarta font-bold text-sm text-[var(--gold)] uppercase tracking-wider flex items-center gap-2 mb-2">
              <Music size={16} /> 5. Música y Mensaje Final
            </legend>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-[var(--dark-brown)]">
                Ruta o URL del archivo de Audio (Música de fondo)
              </label>
              <input
                name="audioTrackPath"
                type="text"
                defaultValue={invitation?.audioTrackPath || "/audio/LosAngelesAzules-LaCumbiadelInfinito.mp3"}
                placeholder="/audio/mimusica.mp3 o URL"
                className="form-input text-sm p-3 font-mono"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-[var(--dark-brown)]">
                Frase de Cierre (Pie de Página)
              </label>
              <textarea
                name="footerPhrase"
                rows={2}
                defaultValue={invitation?.footerPhrase || ""}
                placeholder="ej: 70 vueltas al sol merecen una fiesta a la altura. Vení listo para disfrutar sin mirar el reloj. 🥂"
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
