"use client";

import { useActionState, useEffect, useRef } from "react";
import { submitRsvp, type RsvpActionState } from "@/app/actions/rsvp-actions";
import { DIETARY_LABELS } from "@/lib/schemas/rsvp.schema";
import { CheckCircle, Loader2, Send } from "lucide-react";

const INITIAL_STATE: RsvpActionState = { status: "idle" };

export default function RsvpForm() {
  const [state, formAction, isPending] = useActionState(submitRsvp, INITIAL_STATE);
  const formRef = useRef<HTMLFormElement>(null);
  const successRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (state.status === "success") {
      formRef.current?.reset();
      successRef.current?.focus();
    }
  }, [state.status]);

  if (state.status === "success") {
    return (
      <div
        ref={successRef}
        tabIndex={-1}
        className="glass-card p-10 flex flex-col items-center gap-6 text-center animate-scale-in"
        role="alert"
        aria-live="polite"
      >
        {/* Confetti particles */}
        <div aria-hidden="true" className="relative w-16 h-16">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 rounded-full"
              style={{
                background: ["#C59B27","#D4A373","#8B4513","#EDD9A3","#C59B27","#D4A373","#8B4513","#EDD9A3"][i],
                top: `${50 + 40 * Math.sin((i * Math.PI * 2) / 8)}%`,
                left: `${50 + 40 * Math.cos((i * Math.PI * 2) / 8)}%`,
                animation: `confettiFall ${0.8 + i * 0.1}s ease forwards`,
                animationDelay: `${i * 0.05}s`,
              }}
            />
          ))}
          <div
            className="absolute inset-0 flex items-center justify-center rounded-full"
            style={{ background: "linear-gradient(135deg, #C59B27, #D4A373)" }}
          >
            <CheckCircle size={30} color="#fff" aria-hidden="true" />
          </div>
        </div>

        <h3
          className="font-cormorant"
          style={{
            fontSize: "clamp(1.6rem, 3.5vw, 2.2rem)",
            fontWeight: 600,
            color: "var(--dark-brown)",
          }}
        >
          ¡Confirmación recibida!
        </h3>
        <p
          className="font-jakarta"
          style={{
            fontSize: "1rem",
            color: "var(--dark-brown-70)",
            maxWidth: "36ch",
            lineHeight: 1.6,
          }}
        >
          {state.message}
        </p>
      </div>
    );
  }

  return (
    <div className="glass-card p-6 sm:p-10 md:p-12">
      <div className="flex flex-col gap-3 mb-8">
        <h3
          className="font-cormorant"
          style={{
            fontSize: "clamp(1.75rem, 3.5vw, 2.25rem)",
            fontWeight: 600,
            color: "var(--dark-brown)",
            lineHeight: 1.15,
          }}
        >
          Confirmá tu asistencia
        </h3>
        <p
          className="font-jakarta text-sm sm:text-base"
          style={{ color: "var(--dark-brown-70)", lineHeight: 1.5 }}
        >
          Por favor completá el formulario para poder reservarte un lugar especial.
        </p>
      </div>

      {/* Adult Event Highlight Callout */}
      <div
        className="flex items-start sm:items-center gap-3.5 p-4 sm:p-5 rounded-2xl mb-8 shadow-xs"
        style={{
          background: "linear-gradient(135deg, rgba(197,155,39,0.12), rgba(212,163,115,0.12))",
          border: "1.5px solid rgba(197,155,39,0.35)",
        }}
      >
        <span className="text-2xl shrink-0 leading-none pt-0.5 sm:pt-0" role="img" aria-label="Adultos">🔞</span>
        <div className="flex flex-col gap-0.5">
          <p
            className="font-jakarta font-bold text-xs sm:text-sm uppercase tracking-wider"
            style={{ color: "var(--gold)" }}
          >
            Evento exclusivo para adultos
          </p>
          <p
            className="font-jakarta text-xs sm:text-sm font-medium"
            style={{ color: "var(--dark-brown-70)", lineHeight: 1.4 }}
          >
            Para que todos podamos celebrar libremente, este evento está destinado únicamente a adultos.
          </p>
        </div>
      </div>

      {state.status === "error" && state.message && !state.errors && (
        <div
          role="alert"
          aria-live="assertive"
          className="mb-8 rounded-2xl px-5 py-4 font-jakarta text-sm font-medium"
          style={{
            background: "rgba(220,38,38,0.08)",
            border: "1.5px solid rgba(220,38,38,0.25)",
            color: "#b91c1c",
          }}
        >
          {state.message}
        </div>
      )}

      <form ref={formRef} action={formAction} noValidate className="flex flex-col gap-6 sm:gap-7">
        {/* Hidden field for default attending status */}
        <input type="hidden" name="attending" value="yes" />

        {/* Nombre y Apellido */}
        <fieldset className="border-none p-0">
          <label htmlFor="rsvp-name" className="form-label">
            Nombre y Apellido <span aria-hidden="true" style={{ color: "#dc2626" }}>*</span>
          </label>
          <input
            id="rsvp-name"
            name="name"
            type="text"
            autoComplete="name"
            required
            placeholder="Ej: María García"
            className={`form-input ${state.errors?.name ? "error" : ""}`}
            aria-invalid={!!state.errors?.name}
            aria-describedby={state.errors?.name ? "rsvp-name-error" : undefined}
          />
          {state.errors?.name && (
            <p id="rsvp-name-error" className="form-error" role="alert">
              {state.errors.name[0]}
            </p>
          )}
        </fieldset>

        {/* Integrantes del mismo hogar */}
        <fieldset className="border-none p-0">
          <label htmlFor="rsvp-companions" className="form-label">
            Integrantes adicionales de tu mismo hogar
          </label>
          <input
            id="rsvp-companions"
            name="companionsCount"
            type="number"
            min="0"
            max="10"
            defaultValue="0"
            className={`form-input ${state.errors?.companionsCount ? "error" : ""}`}
            aria-invalid={!!state.errors?.companionsCount}
            aria-describedby={state.errors?.companionsCount ? "rsvp-companions-error" : "rsvp-companions-hint"}
          />
          <p id="rsvp-companions-hint" className="font-jakarta text-xs opacity-60 mt-1.5 font-medium">
            Ingresá la cantidad de integrantes que asistirán con vos (0 si venís solo/a)
          </p>
          {state.errors?.companionsCount && (
            <p id="rsvp-companions-error" className="form-error" role="alert">
              {state.errors.companionsCount[0]}
            </p>
          )}
        </fieldset>

        {/* Restricciones alimentarias */}
        <fieldset className="border-none p-0">
          <label htmlFor="rsvp-dietary" className="form-label">
            Restricciones alimentarias
          </label>
          <select
            id="rsvp-dietary"
            name="dietaryRestrictions"
            className="form-input cursor-pointer"
            defaultValue="ninguna"
          >
            {Object.entries(DIETARY_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </fieldset>

        {/* Mensaje / Dedicatoria */}
        <fieldset className="border-none p-0">
          <label htmlFor="rsvp-message" className="form-label">
            Dedicatoria o mensaje para Gabriel{" "}
            <span className="font-normal opacity-50">(opcional)</span>
          </label>
          <textarea
            id="rsvp-message"
            name="message"
            rows={4}
            maxLength={500}
            placeholder="Escribile algo especial..."
            className={`form-input resize-none ${state.errors?.message ? "error" : ""}`}
            aria-describedby="rsvp-message-hint"
          />
          <p id="rsvp-message-hint" className="font-jakarta text-xs opacity-50 mt-1.5 font-medium">
            Máximo 500 caracteres
          </p>
        </fieldset>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isPending}
          className="btn-gold mt-2 py-4 text-base shadow-md"
          aria-label={isPending ? "Enviando tu confirmación..." : "Enviar confirmación"}
        >
          {isPending ? (
            <>
              <Loader2 size={18} aria-hidden="true" className="animate-spin" />
              Enviando...
            </>
          ) : (
            <>
              <Send size={18} aria-hidden="true" />
              Confirmar mi asistencia
            </>
          )}
        </button>
      </form>
    </div>
  );
}
