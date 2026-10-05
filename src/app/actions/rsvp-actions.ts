"use server";

import { revalidatePath } from "next/cache";
import { RsvpFormSchema } from "@/lib/schemas/rsvp.schema";
import { createRsvp } from "@/lib/dal/rsvp";

export interface RsvpActionState {
  status: "idle" | "success" | "error";
  errors?: Partial<Record<string, string[]>>;
  message?: string;
}

export async function submitRsvp(
  _prevState: RsvpActionState,
  formData: FormData
): Promise<RsvpActionState> {
  const companionNamesRaw = formData.getAll("companionNames");
  const companionNames = companionNamesRaw
    .map((v) => (typeof v === "string" ? v.trim() : ""))
    .filter((v) => v.length > 0);

  const raw = {
    name: formData.get("name"),
    attending: formData.get("attending") ?? "yes",
    companionsCount: formData.get("companionsCount") ?? 0,
    companionNames: companionNames.length > 0 ? companionNames : undefined,
    dietaryRestrictions: formData.get("dietaryRestrictions"),
    message: formData.get("message"),
  };

  const parsed = RsvpFormSchema.safeParse(raw);

  if (!parsed.success) {
    const fieldErrors: Partial<Record<string, string[]>> = {};
    for (const [key, issues] of Object.entries(
      parsed.error.flatten().fieldErrors
    )) {
      fieldErrors[key] = issues;
    }
    return {
      status: "error",
      errors: fieldErrors,
      message: "Por favor corregí los errores en el formulario.",
    };
  }

  try {
    await createRsvp(parsed.data);
    revalidatePath("/admin");
    revalidatePath("/");
    return {
      status: "success",
      message: "¡Gracias! Tu confirmación fue recibida. ¡Nos vemos en la fiesta! 🎉",
    };
  } catch (err) {
    console.error("Error creating RSVP:", err);
    return {
      status: "error",
      message: "Ocurrió un error al guardar tu confirmación. Por favor intentá de nuevo.",
    };
  }
}
