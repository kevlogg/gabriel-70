import { getAllInvitations } from "@/lib/dal/invitations";
import { getAllRsvps } from "@/lib/dal/rsvp";
import SuperAdminClient from "./SuperAdminClient";
import { Lock } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Superadmin — Gestor de Invitaciones",
  robots: { index: false, follow: false },
};

interface SuperAdminPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function SuperAdminPage({ searchParams }: SuperAdminPageProps) {
  const params = await searchParams;
  const providedKey = Array.isArray(params.key) ? params.key[0] : params.key;
  const superadminKey = process.env.SUPERADMIN_SECRET_KEY || process.env.ADMIN_SECRET_KEY || "superadmin123";

  const isAuthorized = providedKey === superadminKey;

  if (!isAuthorized) {
    return (
      <div
        className="min-h-screen flex items-center justify-center px-4"
        style={{ background: "var(--cream)" }}
      >
        <div
          className="glass-card p-8 sm:p-10 w-full max-w-md flex flex-col gap-6 text-center"
          role="main"
        >
          <div
            className="mx-auto w-16 h-16 rounded-full flex items-center justify-center shadow-md"
            style={{ background: "linear-gradient(135deg,#C59B27,#D4A373)" }}
          >
            <Lock size={28} color="#fff" />
          </div>

          <div className="flex flex-col gap-1">
            <h1 className="font-cormorant font-bold text-3xl text-[var(--dark-brown)]">
              Acceso Superadmin
            </h1>
            <p className="font-jakarta text-xs sm:text-sm text-[var(--dark-brown-70)]">
              Ingresá la clave maestra para gestionar las invitaciones y clientes.
            </p>
          </div>

          <form action="/superadmin" method="GET" className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5 text-left">
              <label htmlFor="superadmin-key-input" className="form-label text-xs">
                Clave de Superadministrador
              </label>
              <input
                id="superadmin-key-input"
                name="key"
                type="password"
                required
                autoComplete="current-password"
                placeholder="••••••••••••"
                className="form-input"
              />
            </div>

            <button type="submit" className="btn-gold mt-1 py-3 text-sm">
              Entrar al Panel
            </button>
          </form>

          {providedKey && (
            <p className="font-jakarta text-xs font-semibold text-red-600" role="alert">
              Clave incorrecta. Intentá nuevamente.
            </p>
          )}
        </div>
      </div>
    );
  }

  // Authorized: Fetch data
  const invitations = await getAllInvitations();
  const allRsvps = await getAllRsvps();

  // Group RSVPs count by invitationSlug
  const rsvpsCounts: Record<string, number> = {};
  for (const r of allRsvps) {
    if (r.attending === "yes") {
      const slug = r.invitationSlug || "gabriel70";
      const totalInRsvp = 1 + (r.companionNames?.length ?? r.companionsCount ?? 0);
      rsvpsCounts[slug] = (rsvpsCounts[slug] || 0) + totalInRsvp;
    }
  }

  return (
    <SuperAdminClient
      invitations={invitations}
      rsvpsCounts={rsvpsCounts}
      authKey={superadminKey}
    />
  );
}
