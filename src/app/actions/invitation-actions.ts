"use server";

import { revalidatePath } from "next/cache";
import path from "path";
import fs from "fs/promises";
import {
  createInvitation,
  updateInvitation,
  deleteInvitation,
  setDefaultInvitation,
} from "@/lib/dal/invitations";
import { InvitationSchema, type TemplateId } from "@/lib/schemas/invitation.schema";
import { isSuperadminAuthenticated } from "@/lib/auth";

export interface ActionResult {
  success: boolean;
  message?: string;
  errors?: Record<string, string[]>;
}

async function extractAudioPath(formData: FormData, existingPath: string = ""): Promise<string> {
  const audioRemove = formData.get("audioRemove") === "true";
  if (audioRemove) {
    return "";
  }

  // 1. Direct text path, preset audio URL, or client-side Base64 Data URI
  const audioTrackPath = String(formData.get("audioTrackPath") || "").trim();
  if (audioTrackPath) {
    return audioTrackPath;
  }

  // 2. Uploaded audio file fallback
  const audioFile = formData.get("audioFile");
  if (
    audioFile &&
    typeof audioFile === "object" &&
    "size" in audioFile &&
    (audioFile as File).size > 0
  ) {
    try {
      const file = audioFile as File;
      const mimeType = file.type || "audio/mpeg";
      const buffer = Buffer.from(await file.arrayBuffer());

      // On Vercel, the filesystem is read-only. We store as Data URI so it works reliably in serverless
      const isServerless = Boolean(process.env.VERCEL || process.env.VERCEL_ENV);
      if (!isServerless) {
        try {
          const originalName = file.name || "audio.mp3";
          const ext = path.extname(originalName).toLowerCase() || ".mp3";
          const safeBase = path
            .basename(originalName, ext)
            .replace(/[^a-zA-Z0-9_-]/g, "_")
            .slice(0, 40);
          const fileName = `${Date.now()}_${safeBase}${ext}`;
          const dir = path.join(process.cwd(), "public", "audio");

          await fs.mkdir(dir, { recursive: true });
          await fs.writeFile(path.join(dir, fileName), buffer);
          return `/audio/${fileName}`;
        } catch (fsErr) {
          console.warn("Could not save to public/audio, falling back to data URL:", fsErr);
        }
      }

      // Safe Data URL stored in database:
      const base64Audio = buffer.toString("base64");
      return `data:${mimeType};base64,${base64Audio}`;
    } catch (err) {
      console.error("Error saving uploaded audio:", err);
    }
  }

  return existingPath;
}

export async function createInvitationAction(
  _prevState: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  try {
    const isAuth = await isSuperadminAuthenticated();
    if (!isAuth) {
      return {
        success: false,
        message: "No autorizado. Tu sesión expiró o no tenés permisos de administrador.",
      };
    }

    const audioTrackPath = await extractAudioPath(formData, "");

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
      audioTrackPath,
      footerPhrase: String(formData.get("footerPhrase") || "").trim(),
      carouselImages: String(formData.get("carouselImages") || "").trim(),
      template: (String(formData.get("template") || "classic-gold").trim() as TemplateId),
      allowCompanions: formData.get("allowCompanions") === "on" || formData.get("allowCompanions") === "true",
      allowDietary: formData.get("allowDietary") === "on" || formData.get("allowDietary") === "true",
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
  try {
    const isAuth = await isSuperadminAuthenticated();
    if (!isAuth) {
      return {
        success: false,
        message: "No autorizado. Tu sesión expiró o no tenés permisos de administrador.",
      };
    }

    const currentAudio = String(formData.get("currentAudioTrackPath") || "").trim();
    const audioTrackPath = await extractAudioPath(formData, currentAudio);

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
      audioTrackPath,
      footerPhrase: String(formData.get("footerPhrase") || "").trim(),
      carouselImages: String(formData.get("carouselImages") || "").trim(),
      template: (String(formData.get("template") || "classic-gold").trim() as TemplateId),
      allowCompanions: formData.get("allowCompanions") === "on" || formData.get("allowCompanions") === "true",
      allowDietary: formData.get("allowDietary") === "on" || formData.get("allowDietary") === "true",
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
  const isAuth = await isSuperadminAuthenticated();
  if (!isAuth) {
    return {
      success: false,
      message: "No autorizado. Tu sesión expiró o no tenés permisos de administrador.",
    };
  }

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
  const isAuth = await isSuperadminAuthenticated();
  if (!isAuth) {
    return {
      success: false,
      message: "No autorizado. Tu sesión expiró o no tenés permisos de administrador.",
    };
  }

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
