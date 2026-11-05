"use server";

import { revalidatePath } from "next/cache";
import {
  createInvitation,
  updateInvitation,
  deleteInvitation,
  setDefaultInvitation,
} from "@/lib/dal/invitations";
import { InvitationSchema } from "@/lib/schemas/invitation.schema";

export interface ActionResult {
  success: boolean;
  message?: string;
  errors?: Record<string, string[]>;
}

export async function createInvitationAction(
  _prevState: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const raw = {
    slug: String(formData.get("slug") || "").trim().toLowerCase(),
    personName: String(formData.get("personName") || "").trim(),
    headline: String(formData.get("headline") || "").trim(),
    subheadline: String(formData.get("subheadline") || "").trim(),
    eventNumber: String(formData.get("eventNumber") || "").trim(),
    badgeText: String(formData.get("badgeText") || "").trim(),
    targetDate: String(formData.get("targetDate") || "").trim(),
    venueName: String(formData.get("venueName") || "").trim(),
    venueAddress: String(formData.get("venueAddress") || "").trim(),
    venueMapsUrl: String(formData.get("venueMapsUrl") || "").trim(),
    venueCalendarUrl: String(formData.get("venueCalendarUrl") || "").trim(),
    giftBankName: String(formData.get("giftBankName") || "").trim(),
    giftAlias: String(formData.get("giftAlias") || "").trim(),
    giftCbu: String(formData.get("giftCbu") || "").trim(),
    giftHolderName: String(formData.get("giftHolderName") || "").trim(),
    audioTrackPath: String(formData.get("audioTrackPath") || "/audio/LosAngelesAzules-LaCumbiadelInfinito.mp3").trim(),
    footerPhrase: String(formData.get("footerPhrase") || "").trim(),
    isDefault: formData.get("isDefault") === "on" || formData.get("isDefault") === "true",
  };

  const parsed = InvitationSchema.safeParse(raw);

  if (!parsed.success) {
    return {
      success: false,
      message: "Por favor revisá los campos del formulario.",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    await createInvitation(parsed.data);
    revalidatePath("/superadmin");
    revalidatePath("/");
    revalidatePath(`/${parsed.data.slug}`);
    return {
      success: true,
      message: `¡Invitación '${parsed.data.headline}' creada exitosamente!`,
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error("Error creating invitation:", err);
    return {
      success: false,
      message: errorMsg.includes("UNIQUE constraint")
        ? "Ya existe una invitación con ese identificador (slug). Por favor elegí otro."
        : `Error al crear la invitación: ${errorMsg}`,
    };
  }
}

export async function updateInvitationAction(
  id: string,
  _prevState: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const raw = {
    slug: String(formData.get("slug") || "").trim().toLowerCase(),
    personName: String(formData.get("personName") || "").trim(),
    headline: String(formData.get("headline") || "").trim(),
    subheadline: String(formData.get("subheadline") || "").trim(),
    eventNumber: String(formData.get("eventNumber") || "").trim(),
    badgeText: String(formData.get("badgeText") || "").trim(),
    targetDate: String(formData.get("targetDate") || "").trim(),
    venueName: String(formData.get("venueName") || "").trim(),
    venueAddress: String(formData.get("venueAddress") || "").trim(),
    venueMapsUrl: String(formData.get("venueMapsUrl") || "").trim(),
    venueCalendarUrl: String(formData.get("venueCalendarUrl") || "").trim(),
    giftBankName: String(formData.get("giftBankName") || "").trim(),
    giftAlias: String(formData.get("giftAlias") || "").trim(),
    giftCbu: String(formData.get("giftCbu") || "").trim(),
    giftHolderName: String(formData.get("giftHolderName") || "").trim(),
    audioTrackPath: String(formData.get("audioTrackPath") || "/audio/LosAngelesAzules-LaCumbiadelInfinito.mp3").trim(),
    footerPhrase: String(formData.get("footerPhrase") || "").trim(),
    isDefault: formData.get("isDefault") === "on" || formData.get("isDefault") === "true",
  };

  const parsed = InvitationSchema.safeParse(raw);

  if (!parsed.success) {
    return {
      success: false,
      message: "Por favor revisá los campos del formulario.",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    await updateInvitation(id, parsed.data);
    revalidatePath("/superadmin");
    revalidatePath("/");
    revalidatePath(`/${parsed.data.slug}`);
    revalidatePath(`/${parsed.data.slug}/admin`);
    return {
      success: true,
      message: "Invitación actualizada correctamente.",
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error("Error updating invitation:", err);
    return {
      success: false,
      message: `Error al actualizar: ${errorMsg}`,
    };
  }
}

export async function deleteInvitationAction(id: string): Promise<ActionResult> {
  try {
    await deleteInvitation(id);
    revalidatePath("/superadmin");
    return {
      success: true,
      message: "Invitación eliminada correctamente.",
    };
  } catch (err: unknown) {
    return {
      success: false,
      message: err instanceof Error ? err.message : String(err),
    };
  }
}

export async function setDefaultInvitationAction(id: string): Promise<ActionResult> {
  try {
    await setDefaultInvitation(id);
    revalidatePath("/superadmin");
    revalidatePath("/");
    return {
      success: true,
      message: "Invitación principal actualizada.",
    };
  } catch (err: unknown) {
    return {
      success: false,
      message: err instanceof Error ? err.message : String(err),
    };
  }
}
