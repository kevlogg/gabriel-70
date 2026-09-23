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
    <div className="glass-card p-8 md:p-10">
      <div className="flex flex-col gap-2 mb-8">
        <h3
          className="font-cormorant"
          style={{
            fontSize: "clamp(1.6rem, 3.5vw, 2.2rem)",
            fontWeight: 600,
            color: "var(--dark-brown)",
          }}
        >
          Confirmá tu asistencia
        </h3>
        <p
          className="font-jakarta"
          style={{ fontSize: "0.95rem", color: "var(--dark-brown-70)" }}
        >
          Por favor completá el formulario para que podamos organizarnos.
        </p>
      </div>

      {state.status === "error" && state.message && !state.errors && (
        <div
          role="alert"
          aria-live="assertive"
          className="mb-5 rounded-xl px-4 py-3 font-jakarta text-sm"
          style={{
            background: "rgba(220,38,38,0.08)",
            border: "1px solid rgba(220,38,38,0.25)",
            color: "#b91c1c",
          }}
        >
          {state.message}
        </div>
      )}

      <form ref={formRef} action={formAction} noValidate className="flex flex-col gap-5">
        {/* Nombre */}
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

        {/* Asistencia */}
        <fieldset className="border-none p-0">
          <legend className="form-label mb-2">
            ¿Vas a asistir? <span aria-hidden="true" style={{ color: "#dc2626" }}>*</span>
          </legend>
          <div className="flex gap-3">
            {(["yes", "no"] as const).map((value) => (
              <label
                key={value}
                className="flex items-center gap-2.5 cursor-pointer group"
                style={{ flex: 1 }}
              >
                <input
                  type="radio"
                  name="attending"
                  value={value}
                  required
                  className="sr-only"
                  aria-required="true"
                />
                <span
                  className="flex items-center justify-center w-full rounded-xl py-3 font-jakarta font-semibold text-sm transition-all duration-200"
                  style={{
                    border: "1.5px solid rgba(197,155,39,0.4)",
                    background: "var(--cream-2)",
                    color: "var(--dark-brown)",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLSpanElement).style.background =
                      value === "yes"
                        ? "linear-gradient(135deg,#C59B27,#D4A373)"
                        : "rgba(139,69,19,0.12)";
                    (e.currentTarget as HTMLSpanElement).style.color =
                      value === "yes" ? "#fff" : "var(--terracotta)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLSpanElement).style.background = "var(--cream-2)";
                    (e.currentTarget as HTMLSpanElement).style.color = "var(--dark-brown)";
                  }}
                >
                  {value === "yes" ? "✓ Sí, voy!" : "✗ No puedo"}
                </span>
              </label>
            ))}
          </div>
          {state.errors?.attending && (
            <p className="form-error" role="alert">
              {state.errors.attending[0]}
            </p>
          )}
        </fieldset>

        {/* Acompañantes */}
        <fieldset className="border-none p-0">
          <label htmlFor="rsvp-companions" className="form-label">
            Cantidad de acompañantes (sin contarte a vos)
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
            aria-describedby={state.errors?.companionsCount ? "rsvp-companions-error" : undefined}
          />
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
            className="form-input"
            defaultValue="ninguna"
          >
            {Object.entries(DIETARY_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </fieldset>

        {/* Mensaje */}
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
          <p id="rsvp-message-hint" className="font-jakarta text-xs opacity-50 mt-1">
            Máximo 500 caracteres
          </p>
        </fieldset>

        {/* Submit */}
        <button
          type="submit"
          disabled={isPending}
          className="btn-gold mt-2"
          aria-label={isPending ? "Enviando tu confirmación..." : "Enviar confirmación"}
        >
          {isPending ? (
            <>
              <Loader2 size={16} aria-hidden="true" className="animate-spin" />
              Enviando...
            </>
          ) : (
            <>
              <Send size={16} aria-hidden="true" />
              Confirmar asistencia
            </>
          )}
        </button>
      </form>
    </div>
  );
}
