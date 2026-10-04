"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { submitRsvp, type RsvpActionState } from "@/app/actions/rsvp-actions";
import { DIETARY_LABELS } from "@/lib/schemas/rsvp.schema";
import { CheckCircle, Loader2, Send, Plus, Minus, Users } from "lucide-react";

const INITIAL_STATE: RsvpActionState = { status: "idle" };

export default function RsvpForm() {
  const [state, formAction, isPending] = useActionState(submitRsvp, INITIAL_STATE);
  const [companionsCount, setCompanionsCount] = useState<number>(0);
  const formRef = useRef<HTMLFormElement>(null);
  const successRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (state.status === "success") {
      formRef.current?.reset();
      setCompanionsCount(0);
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
    <div
      className="glass-card flex flex-col gap-6"
      style={{
        padding: "clamp(1.75rem, 5vw, 3rem)",
        boxSizing: "border-box",
        width: "100%",
      }}
    >
      <div className="flex flex-col gap-2 mb-1">
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
          className="font-jakarta font-bold text-sm sm:text-base"
          style={{ color: "#dc2626", letterSpacing: "0.01em" }}
        >
          Por favor confirmar antes del 20/10
        </p>
        <p
          className="font-jakarta text-sm sm:text-base"
          style={{ color: "var(--dark-brown-70)", lineHeight: 1.5 }}
        >
          Completá el formulario para poder reservarte un lugar especial.
        </p>
      </div>

      {/* Adult Event Highlight Callout */}
      <div
        className="flex items-start sm:items-center gap-3.5 rounded-2xl mb-2 shadow-xs"
        style={{
          padding: "1.15rem 1.25rem",
          background: "linear-gradient(135deg, rgba(197,155,39,0.14), rgba(212,163,115,0.14))",
          border: "1.5px solid rgba(197,155,39,0.4)",
          boxSizing: "border-box",
          width: "100%",
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
          className="mb-2 rounded-2xl font-jakarta text-sm font-medium"
          style={{
            padding: "1rem 1.25rem",
            background: "rgba(220,38,38,0.08)",
            border: "1.5px solid rgba(220,38,38,0.25)",
            color: "#b91c1c",
            boxSizing: "border-box",
          }}
        >
          {state.message}
        </div>
      )}

      <form ref={formRef} action={formAction} noValidate className="flex flex-col gap-6">
        {/* Hidden field for default attending status */}
        <input type="hidden" name="attending" value="yes" />

        {/* Nombre y Apellido */}
        <fieldset className="border-none p-0 flex flex-col gap-1.5" style={{ width: "100%", boxSizing: "border-box" }}>
          <label htmlFor="rsvp-name" className="form-label" style={{ marginBottom: "0.25rem" }}>
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
            style={{
              padding: "0.9rem 1.25rem",
              width: "100%",
              boxSizing: "border-box",
            }}
            aria-invalid={!!state.errors?.name}
            aria-describedby={state.errors?.name ? "rsvp-name-error" : undefined}
          />
          {state.errors?.name && (
            <p id="rsvp-name-error" className="form-error" role="alert">
              {state.errors.name[0]}
            </p>
          )}
        </fieldset>

        {/* Integrantes adicionales con contador +/- y campos dinámicos */}
        <fieldset className="border-none p-0 flex flex-col gap-3" style={{ width: "100%", boxSizing: "border-box" }}>
          <div className="flex flex-col gap-1">
            <label className="form-label" style={{ marginBottom: 0 }}>
              Integrantes adicionales de tu mismo hogar
            </label>
            <p id="rsvp-companions-hint" className="font-jakarta text-xs opacity-65 font-medium">
              Usá los botones + y - para agregar a los integrantes que asistirán con vos
            </p>
          </div>

          {/* Hidden input for companionsCount */}
          <input type="hidden" name="companionsCount" value={companionsCount} />

          {/* Contador +/- */}
          <div className="flex items-center gap-3.5 py-1">
            <div className="flex items-center rounded-2xl border-2 border-[rgba(197,155,39,0.35)] bg-[rgba(253,251,247,0.8)] overflow-hidden shadow-xs">
              <button
                type="button"
                onClick={() => setCompanionsCount((prev) => Math.max(0, prev - 1))}
                disabled={companionsCount === 0}
                className="w-11 h-11 flex items-center justify-center font-bold text-xl transition-colors hover:bg-[rgba(197,155,39,0.15)] disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer disabled:cursor-not-allowed"
                style={{ color: "var(--dark-brown)" }}
                aria-label="Restar integrante"
              >
                <Minus size={18} aria-hidden="true" />
              </button>
              <div
                className="w-12 text-center font-jakarta font-bold text-lg select-none"
                style={{ color: "var(--dark-brown)" }}
              >
                {companionsCount}
              </div>
              <button
                type="button"
                onClick={() => setCompanionsCount((prev) => Math.min(10, prev + 1))}
                disabled={companionsCount === 10}
                className="w-11 h-11 flex items-center justify-center font-bold text-xl transition-colors hover:bg-[rgba(197,155,39,0.15)] disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer disabled:cursor-not-allowed"
                style={{ color: "var(--dark-brown)" }}
                aria-label="Sumar integrante"
              >
                <Plus size={18} aria-hidden="true" />
              </button>
            </div>
            <span className="font-jakarta text-xs sm:text-sm font-semibold text-[var(--dark-brown)]">
              {companionsCount === 0
                ? "Asistiré solo/a"
                : companionsCount === 1
                ? "+1 integrante adicional"
                : `+${companionsCount} integrantes adicionales`}
            </span>
          </div>

          {/* Campos dinámicos para el nombre de cada integrante */}
          {companionsCount > 0 && (
            <div
              className="flex flex-col gap-3.5 p-4 sm:p-5 rounded-2xl animate-scale-in mt-1"
              style={{
                background: "linear-gradient(135deg, rgba(197,155,39,0.08), rgba(212,163,115,0.08))",
                border: "1.5px solid rgba(197,155,39,0.3)",
                boxSizing: "border-box",
              }}
            >
              <div className="flex items-center gap-2 pb-2 border-b border-[rgba(197,155,39,0.25)]">
                <Users size={16} style={{ color: "var(--gold)" }} aria-hidden="true" />
                <p className="font-jakarta font-bold text-xs uppercase tracking-wider text-[var(--gold)]">
                  Nombres de los integrantes adicionales ({companionsCount})
                </p>
              </div>

              {Array.from({ length: companionsCount }).map((_, index) => (
                <div key={index} className="flex flex-col gap-1.5">
                  <label
                    htmlFor={`companion-name-${index}`}
                    className="font-jakarta text-xs font-semibold text-[var(--dark-brown)]"
                  >
                    Nombre y Apellido del integrante #{index + 1}{" "}
                    <span aria-hidden="true" style={{ color: "#dc2626" }}>*</span>
                  </label>
                  <input
                    id={`companion-name-${index}`}
                    name="companionNames"
                    type="text"
                    required
                    placeholder={`Ej: Nombre del integrante ${index + 1}`}
                    className="form-input"
                    style={{
                      padding: "0.85rem 1.1rem",
                      width: "100%",
                      boxSizing: "border-box",
                      fontSize: "0.9rem",
                    }}
                  />
                </div>
              ))}
            </div>
          )}

          {state.errors?.companionsCount && (
            <p id="rsvp-companions-error" className="form-error" role="alert">
              {state.errors.companionsCount[0]}
            </p>
          )}
        </fieldset>

        {/* Restricciones alimentarias */}
        <fieldset className="border-none p-0 flex flex-col gap-1.5" style={{ width: "100%", boxSizing: "border-box" }}>
          <label htmlFor="rsvp-dietary" className="form-label" style={{ marginBottom: "0.25rem" }}>
            Restricciones alimentarias
          </label>
          <select
            id="rsvp-dietary"
            name="dietaryRestrictions"
            className="form-input cursor-pointer"
            defaultValue="ninguna"
            style={{
              padding: "0.9rem 1.25rem",
              width: "100%",
              boxSizing: "border-box",
            }}
          >
            {Object.entries(DIETARY_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </fieldset>

        {/* Mensaje / Dedicatoria */}
        <fieldset className="border-none p-0 flex flex-col gap-1.5" style={{ width: "100%", boxSizing: "border-box" }}>
          <label htmlFor="rsvp-message" className="form-label" style={{ marginBottom: "0.25rem" }}>
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
            style={{
              padding: "0.9rem 1.25rem",
              width: "100%",
              boxSizing: "border-box",
            }}
            aria-describedby="rsvp-message-hint"
          />
          <p id="rsvp-message-hint" className="font-jakarta text-xs opacity-50 font-medium" style={{ marginTop: "0.2rem" }}>
            Máximo 500 caracteres
          </p>
        </fieldset>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isPending}
          className="btn-gold mt-2 text-base shadow-md"
          style={{
            padding: "1rem 2rem",
            width: "100%",
            boxSizing: "border-box",
          }}
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
