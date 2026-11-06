import { redirect } from "next/navigation";
import { getAllInvitations } from "@/lib/dal/invitations";
import { getAllRsvps } from "@/lib/dal/rsvp";
import {
  isSuperadminAuthenticated,
  setSuperadminSession,
  timingSafePasswordCheck,
} from "@/lib/auth";
import SuperAdminClient from "./SuperAdminClient";
import SuperAdminLoginForm from "./SuperAdminLoginForm";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Superadmin — Gestor de Invitaciones",
  robots: { index: false, follow: false },
};

interface SuperAdminPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function SuperAdminPage({ searchParams }: SuperAdminPageProps) {
  // 1. Check if user already has an active secure HttpOnly session cookie
  const isAuth = await isSuperadminAuthenticated();

  if (!isAuth) {
    // 2. Backward compatibility: if an old URL with ?key=... was visited
    const params = await searchParams;
    const providedKey = Array.isArray(params.key) ? params.key[0] : params.key;

    if (providedKey && timingSafePasswordCheck(providedKey)) {
      // Set secure cookie and immediately redirect to clean URL to strip ?key= from address bar!
      await setSuperadminSession();
      redirect("/superadmin");
    }

    // Otherwise render the secure POST login form
    return <SuperAdminLoginForm />;
  }

  // 3. User is authorized via secure session cookie: Fetch data
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
    />
  );
}
