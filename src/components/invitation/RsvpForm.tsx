"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { submitRsvp, type RsvpActionState } from "@/app/actions/rsvp-actions";
import { DIETARY_LABELS } from "@/lib/schemas/rsvp.schema";
import type { TemplateId } from "@/lib/schemas/invitation.schema";
import { CheckCircle, Loader2, Send, Plus, Minus, Users } from "lucide-react";

const INITIAL_STATE: RsvpActionState = { status: "idle" };

interface RsvpFormProps {
  invitationSlug?: string;
  personName?: string;
  allowCompanions?: boolean;
  allowDietary?: boolean;
  theme?: TemplateId;
}

export default function RsvpForm({
  invitationSlug = "gabriel70",
  personName = "Gabriel",
  allowCompanions = true,
  allowDietary = true,
  theme = "classic-gold",
}: RsvpFormProps) {
  const [state, formAction, isPending] = useActionState(submitRsvp, INITIAL_STATE);
  const [companionsCount, setCompanionsCount] = useState<number>(0);
  const formRef = useRef<HTMLFormElement>(null);
  const successRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (state.status === "success") {
      formRef.current?.reset();
      const timer = setTimeout(() => setCompanionsCount(0), 0);
      successRef.current?.focus();
      return () => clearTimeout(timer);
    }
  }, [state.status]);

  // Theming classes and styles
  const isToyStory = theme === "toy-story";
  const isKpop = theme === "k-pop";
  const isPrincess = theme === "princesas";
  const isFootball = theme === "futbol-infantil";

  const cardContainerClass = isToyStory
    ? "bg-white rounded-3xl border-4 border-amber-400 shadow-xl p-6 sm:p-10 text-blue-950"
    : isKpop
    ? "bg-black/60 rounded-3xl border border-pink-500/50 shadow-[0_0_30px_rgba(236,72,153,0.3)] p-6 sm:p-10 text-white backdrop-blur-xl"
    : isPrincess
    ? "bg-white/95 rounded-3xl border-2 border-pink-300 shadow-xl p-6 sm:p-10 text-pink-950"
    : isFootball
    ? "bg-white rounded-3xl border-4 border-emerald-500 shadow-xl p-6 sm:p-10 text-emerald-950"
    : "glass-card p-6 sm:p-10 flex flex-col gap-6 text-[var(--dark-brown)]";

  const inputClass = isToyStory
    ? "w-full p-3.5 rounded-2xl border-2 border-blue-200 focus:border-blue-500 bg-sky-50/40 text-blue-950 font-medium text-sm outline-none transition-all"
    : isKpop
    ? "w-full p-3.5 rounded-2xl border border-pink-400/50 focus:border-pink-400 bg-white/10 text-white placeholder-gray-400 font-medium text-sm outline-none transition-all"
    : isPrincess
    ? "w-full p-3.5 rounded-2xl border border-pink-200 focus:border-pink-400 bg-pink-50/30 text-pink-950 font-medium text-sm outline-none transition-all"
    : isFootball
    ? "w-full p-3.5 rounded-2xl border-2 border-emerald-200 focus:border-emerald-500 bg-emerald-50/20 text-emerald-950 font-medium text-sm outline-none transition-all"
    : "form-input p-3.5 text-sm w-full";

  const labelClass = isToyStory
    ? "text-xs font-black uppercase tracking-wider text-blue-900"
    : isKpop
    ? "text-xs font-bold uppercase tracking-wider text-pink-300"
    : isPrincess
    ? "text-xs font-bold uppercase tracking-wider text-pink-900"
    : isFootball
    ? "text-xs font-black uppercase tracking-wider text-emerald-900"
    : "form-label text-xs";

  const submitButtonClass = isToyStory
    ? "w-full py-4 px-6 rounded-2xl font-black text-white text-base shadow-lg bg-blue-600 hover:bg-blue-700 border-2 border-blue-800 transition-all flex items-center justify-center gap-2 cursor-pointer"
    : isKpop
    ? "w-full py-4 px-6 rounded-2xl font-bold text-white text-base shadow-[0_0_20px_rgba(236,72,153,0.6)] bg-gradient-to-r from-pink-500 to-purple-600 hover:opacity-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
    : isPrincess
    ? "w-full py-4 px-6 rounded-2xl font-bold text-white text-base shadow-md bg-gradient-to-r from-pink-500 via-rose-400 to-amber-300 hover:opacity-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
    : isFootball
    ? "w-full py-4 px-6 rounded-2xl font-black text-white text-base shadow-lg bg-emerald-600 hover:bg-emerald-700 border-2 border-emerald-800 transition-all flex items-center justify-center gap-2 cursor-pointer"
    : "btn-gold mt-2 py-4 text-base shadow-md w-full flex items-center justify-center gap-2";

  if (state.status === "success") {
    return (
      <div
        ref={successRef}
        tabIndex={-1}
        className={`${cardContainerClass} flex flex-col items-center gap-6 text-center animate-scale-in`}
        role="alert"
        aria-live="polite"
      >
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center shadow-lg"
          style={{
            background: isToyStory
              ? "#2563EB"
              : isKpop
              ? "linear-gradient(135deg, #EC4899, #8B5CF6)"
              : isPrincess
              ? "linear-gradient(135deg, #F472B6, #FBBF24)"
              : isFootball
              ? "#16A34A"
              : "linear-gradient(135deg, #C59B27, #D4A373)",
          }}
        >
          <CheckCircle size={32} color="#fff" aria-hidden="true" />
        </div>

        <h3 className="font-bold text-2xl sm:text-3xl">
          ¡Confirmación recibida!
        </h3>
        <p className="text-sm sm:text-base opacity-85 max-w-md leading-relaxed">
          {state.message}
        </p>
      </div>
    );
  }

  return (
    <div className={cardContainerClass}>
      <div className="flex flex-col gap-1 mb-2">
        <h3 className="font-extrabold text-xl sm:text-2xl">
          ¿Venís a festejar?
        </h3>
        <p className="text-xs sm:text-sm opacity-80">
          Por favor completá los datos para poder reservar tu lugar en la celebración.
        </p>
      </div>

      {state.status === "error" && state.message && !state.errors && (
        <div
          role="alert"
          aria-live="assertive"
          className="mb-2 p-3.5 rounded-2xl text-xs sm:text-sm font-semibold bg-red-100/80 border border-red-300 text-red-800"
        >
          {state.message}
        </div>
      )}

      <form ref={formRef} action={formAction} noValidate className="flex flex-col gap-5">
        <input type="hidden" name="invitationSlug" value={invitationSlug} />
        <input type="hidden" name="attending" value="yes" />

        {/* Nombre y Apellido */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="rsvp-name" className={labelClass}>
            Tu Nombre y Apellido <span className="text-red-500">*</span>
          </label>
          <input
            id="rsvp-name"
            name="name"
            type="text"
            autoComplete="name"
            required
            placeholder="Ej: Sofía Gómez"
            className={`${inputClass} ${state.errors?.name ? "border-red-500 ring-2 ring-red-400" : ""}`}
            aria-invalid={!!state.errors?.name}
          />
          {state.errors?.name && (
            <p className="text-xs font-bold text-red-500" role="alert">
              {state.errors.name[0]}
            </p>
          )}
        </div>

        {/* Integrantes adicionales (SOLO SI allowCompanions ESTÁ HABILITADO) */}
        {allowCompanions && (
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-0.5">
              <label className={labelClass}>
                Integrantes adicionales de tu grupo / familia
              </label>
              <p className="text-[11px] opacity-70">
                Usá los botones + y - para agregar a los integrantes que asistirán con vos
              </p>
            </div>

            <input type="hidden" name="companionsCount" value={companionsCount} />

            <div className="flex items-center gap-3">
              <div
                className={`flex items-center rounded-2xl border-2 p-1 ${
                  isKpop
                    ? "border-pink-500/40 bg-white/10"
                    : isToyStory
                    ? "border-blue-300 bg-sky-50"
                    : isPrincess
                    ? "border-pink-300 bg-pink-50/50"
                    : isFootball
                    ? "border-emerald-400 bg-emerald-50/50"
                    : "border-[rgba(197,155,39,0.35)] bg-white"
                }`}
              >
                <button
                  type="button"
                  onClick={() => setCompanionsCount((prev) => Math.max(0, prev - 1))}
                  disabled={companionsCount === 0}
                  className="w-10 h-10 flex items-center justify-center font-bold text-lg rounded-xl hover:bg-black/10 disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed"
                  aria-label="Restar integrante"
                >
                  <Minus size={18} />
                </button>
                <div className="w-10 text-center font-black text-lg select-none">
                  {companionsCount}
                </div>
                <button
                  type="button"
                  onClick={() => setCompanionsCount((prev) => Math.min(10, prev + 1))}
                  disabled={companionsCount === 10}
                  className="w-10 h-10 flex items-center justify-center font-bold text-lg rounded-xl hover:bg-black/10 disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed"
                  aria-label="Sumar integrante"
                >
                  <Plus size={18} />
                </button>
              </div>

              <span className="text-xs sm:text-sm font-bold opacity-90">
                {companionsCount === 0
                  ? "Asistiré solo/a"
                  : companionsCount === 1
                  ? "+1 acompañante"
                  : `+${companionsCount} acompañantes`}
              </span>
            </div>

            {/* Nombres de los integrantes adicionados */}
            {companionsCount > 0 && (
              <div
                className={`flex flex-col gap-3 p-4 rounded-2xl border animate-scale-in ${
                  isKpop
                    ? "bg-purple-950/40 border-pink-500/30"
                    : isToyStory
                    ? "bg-amber-50/70 border-amber-300"
                    : isPrincess
                    ? "bg-pink-50/70 border-pink-200"
                    : isFootball
                    ? "bg-emerald-50/70 border-emerald-300"
                    : "bg-[rgba(197,155,39,0.08)] border-[rgba(197,155,39,0.3)]"
                }`}
              >
                <div className="flex items-center gap-1.5 pb-1 border-b border-gray-200/40 text-xs font-bold uppercase tracking-wider">
                  <Users size={15} />
                  <span>Nombres de los integrantes adicionales ({companionsCount})</span>
                </div>

                {Array.from({ length: companionsCount }).map((_, index) => (
                  <div key={index} className="flex flex-col gap-1">
                    <label htmlFor={`companion-${index}`} className="text-xs font-semibold opacity-90">
                      Nombre del acompañante #{index + 1} <span className="text-red-500">*</span>
                    </label>
                    <input
                      id={`companion-${index}`}
                      name="companionNames"
                      type="text"
                      required
                      placeholder={`Ej: Nombre del acompañante ${index + 1}`}
                      className={inputClass}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Restricciones alimentarias (SOLO SI allowDietary ESTÁ HABILITADO) */}
        {allowDietary && (
          <div className="flex flex-col gap-1.5">
            <label htmlFor="rsvp-dietary" className={labelClass}>
              Restricciones alimentarias / Menú especial
            </label>
            <select
              id="rsvp-dietary"
              name="dietaryRestrictions"
              defaultValue="ninguna"
              className={`${inputClass} cursor-pointer`}
            >
              {Object.entries(DIETARY_LABELS).map(([value, label]) => (
                <option key={value} value={value} className="text-gray-900 bg-white">
                  {label}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Mensaje / Dedicatoria */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="rsvp-message" className={labelClass}>
            Mensaje o dedicatoria para {personName}{" "}
            <span className="font-normal opacity-60">(opcional)</span>
          </label>
          <textarea
            id="rsvp-message"
            name="message"
            rows={3}
            maxLength={500}
            placeholder="¡Escribile un mensajito especial!"
            className={`${inputClass} resize-none`}
          />
        </div>

        {/* Botón de Enviar */}
        <button
          type="submit"
          disabled={isPending}
          className={submitButtonClass}
          aria-label={isPending ? "Enviando tu confirmación..." : "Confirmar mi asistencia"}
        >
          {isPending ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              <span>Enviando confirmación...</span>
            </>
          ) : (
            <>
              <Send size={18} />
              <span>Confirmar mi asistencia</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
