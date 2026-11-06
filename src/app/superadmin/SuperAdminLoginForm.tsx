"use client";

import { useActionState, useState } from "react";
import { loginSuperadminAction, type AuthState } from "@/app/actions/auth-actions";
import { Lock, Eye, EyeOff, Loader2, ShieldCheck } from "lucide-react";

export default function SuperAdminLoginForm() {
  const [state, formAction, isPending] = useActionState(loginSuperadminAction, null);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: "var(--cream)" }}
    >
      <div
        className="glass-card p-8 sm:p-10 w-full max-w-md flex flex-col gap-6 text-center shadow-xl border border-[rgba(197,155,39,0.3)] bg-white/90 backdrop-blur-md rounded-3xl"
        role="main"
      >
        <div
          className="mx-auto w-16 h-16 rounded-full flex items-center justify-center shadow-md animate-bounce"
          style={{ background: "linear-gradient(135deg, #C59B27, #D4A373)" }}
        >
          <Lock size={28} color="#fff" />
        </div>

        <div className="flex flex-col gap-1.5">
          <span className="text-[11px] font-bold uppercase tracking-widest text-[var(--gold)] flex items-center justify-center gap-1">
            <ShieldCheck size={14} /> Acceso Seguro
          </span>
          <h1 className="font-cormorant font-bold text-3xl text-[var(--dark-brown)]">
            Panel Superadmin
          </h1>
          <p className="font-jakarta text-xs sm:text-sm text-[var(--dark-brown-70)]">
            Ingresá tu clave maestra para gestionar las invitaciones.
          </p>
        </div>

        <form action={formAction} className="flex flex-col gap-4 text-left">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="superadmin-password" className="text-xs font-bold text-[var(--dark-brown)]">
              Contraseña de Administrador
            </label>
            <div className="relative">
              <input
                id="superadmin-password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                autoComplete="current-password"
                placeholder="••••••••••••"
                className="form-input pr-10 text-sm"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                aria-label={showPassword ? "Ocultar contraseña" : "Ver contraseña"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {state?.error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold animate-shake">
              {state.error}
            </div>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="btn-gold mt-2 py-3 text-sm font-bold flex items-center justify-center gap-2 cursor-pointer"
          >
            {isPending ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                <span>Verificando...</span>
              </>
            ) : (
              <span>Entrar al Panel</span>
            )}
          </button>
        </form>

        <p className="text-[11px] text-gray-400 font-medium">
          Acceso protegido con cookies de sesión seguras (HttpOnly). No se expone información en la URL.
        </p>
      </div>
    </div>
  );
}
