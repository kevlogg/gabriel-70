import { notFound } from "next/navigation";
import { getInvitationBySlug } from "@/lib/dal/invitations";
import { getAllRsvps } from "@/lib/dal/rsvp";
import ClientAdminView from "@/components/admin/ClientAdminView";

export const dynamic = "force-dynamic";

interface ClientAdminPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ClientAdminPageProps) {
  const { slug } = await params;
  const invitation = await getInvitationBySlug(slug);
  if (!invitation) return { title: "Admin — Invitación no encontrada" };

  return {
    title: `Confirmados — ${invitation.headline}`,
    robots: { index: false, follow: false },
  };
}

export default async function ClientAdminPage({ params }: ClientAdminPageProps) {
  const { slug } = await params;
  const invitation = await getInvitationBySlug(slug);

  if (!invitation) {
    notFound();
  }

  const rsvps = await getAllRsvps(slug);

  return <ClientAdminView invitation={invitation} rsvps={rsvps} />;
}

