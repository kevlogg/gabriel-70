import { redirect } from "next/navigation";
import { getDefaultInvitation } from "@/lib/dal/invitations";

export const dynamic = "force-dynamic";

export default async function AdminRedirectPage() {
  const defaultInv = await getDefaultInvitation();
  redirect(`/${defaultInv.slug}/admin`);
}
