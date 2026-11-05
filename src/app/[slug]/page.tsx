import { notFound } from "next/navigation";
import { getInvitationBySlug } from "@/lib/dal/invitations";
import InvitationView from "@/components/invitation/InvitationView";

export const dynamic = "force-dynamic";

interface DynamicInvitationPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: DynamicInvitationPageProps) {
  const { slug } = await params;
  const invitation = await getInvitationBySlug(slug);
  if (!invitation) return { title: "Invitación no encontrada" };
  return {
    title: invitation.headline,
    description: invitation.subheadline,
  };
}

export default async function DynamicInvitationPage({ params }: DynamicInvitationPageProps) {
  const { slug } = await params;
  const invitation = await getInvitationBySlug(slug);

  if (!invitation) {
    notFound();
  }

  return <InvitationView invitation={invitation} />;
}

