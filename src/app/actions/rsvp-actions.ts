"use server";

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
  const raw = {
    name: formData.get("name"),
    attending: formData.get("attending") ?? "yes",
    companionsCount: formData.get("companionsCount") ?? 0,
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
    return {
      status: "success",
      message: "¡Gracias! Tu confirmación fue recibida. ¡Nos vemos en la fiesta! 🎉",
    };
  } catch {
    return {
      status: "error",
      message: "Ocurrió un error al guardar tu confirmación. Por favor intentá de nuevo.",
    };
  }
}
