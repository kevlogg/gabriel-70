import { redirect } from "next/navigation";
import { getAllRsvps } from "@/lib/dal/rsvp";
import { getMasterGuests } from "@/lib/dal/guest-list";
import { EVENT_DATA } from "@/config/event";
import MetricsCards from "@/components/admin/MetricsCards";
import RsvpTable from "@/components/admin/RsvpTable";
import GuestListManager from "@/components/admin/GuestListManager";
import { ShieldCheck, RefreshCw } from "lucide-react";

interface AdminPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export const metadata = {
  title: "Admin — Los 70 de Gabriel",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminPage({ searchParams }: AdminPageProps) {
  const params = await searchParams;
  const providedKey = Array.isArray(params.key) ? params.key[0] : params.key;
  const adminKey = process.env.ADMIN_SECRET_KEY ?? "gabriel70admin";

  const isAuthorized = providedKey === adminKey;

  if (!isAuthorized) {
    return (
      <div
        className="min-h-screen flex items-center justify-center px-4"
        style={{ background: "var(--cream)" }}
      >
        <div
          className="glass-card p-10 w-full max-w-md flex flex-col gap-6 text-center"
          role="main"
          aria-labelledby="admin-auth-title"
        >
          <div
            className="mx-auto w-14 h-14 rounded-full flex items-center justify-center"
            style={{ background: "linear-gradient(135deg,#C59B27,#D4A373)" }}
            aria-hidden="true"
          >
            <ShieldCheck size={26} color="#fff" />
          </div>
          <h1
            id="admin-auth-title"
            className="font-cormorant"
            style={{ fontSize: "2rem", fontWeight: 600, color: "var(--dark-brown)" }}
          >
            Panel Admin
          </h1>
          <p
            className="font-jakarta text-sm"
            style={{ color: "var(--dark-brown-70)" }}
          >
            Accedé con la clave de administrador:
          </p>
          <form
            action="/admin"
            method="GET"
            className="flex flex-col gap-3"
          >
            <label htmlFor="admin-key-input" className="form-label text-left">
              Clave de acceso
            </label>
            <input
              id="admin-key-input"
              name="key"
              type="password"
              autoComplete="current-password"
              required
              placeholder="••••••••••"
              className="form-input"
              aria-required="true"
            />
            <button
              type="submit"
              className="btn-gold mt-1"
            >
              Ingresar
            </button>
          </form>
          {providedKey && (
            <p
              className="font-jakarta text-sm font-semibold"
              role="alert"
              style={{ color: "#dc2626" }}
            >
              Clave incorrecta. Intentá de nuevo.
            </p>
          )}
        </div>
      </div>
    );
  }

  const rsvps = await getAllRsvps();
  const masterGuests = await getMasterGuests();

  return (
    <div
      className="min-h-screen"
      style={{ background: "var(--cream)" }}
    >
      {/* Top bar */}
      <div
        aria-hidden="true"
        className="w-full h-1.5"
        style={{
          background: "linear-gradient(90deg, transparent, #C59B27 30%, #D4A373 50%, #C59B27 70%, transparent)",
        }}
      />

      <main
        className="max-w-6xl mx-auto px-4 sm:px-6 py-10 flex flex-col gap-10"
        aria-label="Panel de administración de confirmaciones"
      >
        {/* Header */}
        <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p
              className="font-jakarta font-semibold text-xs tracking-widest uppercase mb-1"
              style={{ color: "var(--gold)" }}
            >
              Panel de Administración
            </p>
            <h1
              className="font-cormorant"
              style={{
                fontSize: "clamp(1.8rem, 4vw, 2.5rem)",
                fontWeight: 700,
                color: "var(--dark-brown)",
                lineHeight: 1.1,
              }}
            >
              {EVENT_DATA.headline}
            </h1>
            <p
              className="font-jakarta text-sm mt-1"
              style={{ color: "var(--dark-brown-70)" }}
            >
              Gestión de lista de invitados y confirmaciones
            </p>
          </div>
          <a
            href={`/admin?key=${adminKey}`}
            className="btn-outline flex items-center gap-2 shrink-0"
            aria-label="Recargar datos"
            id="admin-refresh-btn"
          >
            <RefreshCw size={14} aria-hidden="true" />
            Actualizar
          </a>
        </header>

        {/* Divider */}
        <div
          aria-hidden="true"
          style={{
            height: "1px",
            background: "linear-gradient(to right, transparent, var(--gold-pale), transparent)",
          }}
        />

        {/* SECTION 1: MASTER GUEST LIST & RSVP MATCHING */}
        <section aria-labelledby="guest-list-heading" className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <h2
              id="guest-list-heading"
              className="font-cormorant text-2xl font-bold text-[var(--dark-brown)]"
            >
              📋 Control de Invitados (Lista General vs Confirmaciones)
            </h2>
            <p className="font-jakarta text-xs sm:text-sm text-[var(--dark-brown-70)]">
              Cargá la lista completa de invitados esperados para comparar en tiempo real quiénes ya confirmaron y quiénes faltan.
            </p>
          </div>
          <GuestListManager masterGuests={masterGuests} rsvps={rsvps} />
        </section>

        {/* Divider */}
        <div
          aria-hidden="true"
          style={{
            height: "1px",
            background: "linear-gradient(to right, transparent, rgba(197,155,39,0.25), transparent)",
          }}
        />

        {/* SECTION 2: RSVP RESPONSES & METRICS */}
        <section aria-labelledby="metrics-heading" className="flex flex-col gap-6">
          <h2
            id="metrics-heading"
            className="font-cormorant text-2xl font-bold text-[var(--dark-brown)]"
          >
            📊 Resumen de Respuestas y Menús Especiales
          </h2>
          <MetricsCards rsvps={rsvps} />
        </section>

        {/* Table */}
        <section aria-labelledby="table-heading" className="flex flex-col gap-4">
          <h2
            id="table-heading"
            className="font-cormorant text-2xl font-bold text-[var(--dark-brown)]"
          >
            ✉️ Todas las confirmaciones recibidas (RSVPs)
          </h2>
          <RsvpTable rsvps={rsvps} />
        </section>
      </main>

      <div
        aria-hidden="true"
        className="w-full h-1.5 mt-10"
        style={{
          background: "linear-gradient(90deg, transparent, #C59B27 30%, #D4A373 50%, #C59B27 70%, transparent)",
        }}
      />
    </div>
  );
}
