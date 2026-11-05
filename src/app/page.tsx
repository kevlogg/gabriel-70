import { getDefaultInvitation } from "@/lib/dal/invitations";
import InvitationView from "@/components/invitation/InvitationView";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const invitation = await getDefaultInvitation();
  return {
    title: invitation.headline,
    description: invitation.subheadline,
  };
}

export default async function HomePage() {
  const invitation = await getDefaultInvitation();
  return <InvitationView invitation={invitation} />;
}
