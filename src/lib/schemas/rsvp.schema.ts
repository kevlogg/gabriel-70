import { z } from "zod";

export const DietaryRestriction = z.enum([
  "ninguna",
  "celiaco",
  "vegetariano",
  "vegano",
  "hipertenso",
  "alergias",
]);

export type DietaryRestrictionType = z.infer<typeof DietaryRestriction>;

export const DIETARY_LABELS: Record<DietaryRestrictionType, string> = {
  ninguna: "Ninguna",
  celiaco: "Celíaco / Sin TACC",
  vegetariano: "Vegetariano",
  vegano: "Vegano",
  hipertenso: "Hipertenso",
  alergias: "Alergias",
};

export const RsvpFormSchema = z.object({
  name: z
    .string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(100, "El nombre es demasiado largo"),
  attending: z.enum(["yes", "no"]).default("yes"),
  companionsCount: z.coerce
    .number()
    .int("Debe ser un número entero")
    .min(0, "No puede ser negativo")
    .max(10, "Máximo 10 integrantes"),
  dietaryRestrictions: DietaryRestriction,
  message: z.string().max(500, "El mensaje no puede superar los 500 caracteres").optional(),
});

export type RsvpFormData = z.infer<typeof RsvpFormSchema>;

export interface RsvpRecord extends RsvpFormData {
  id: string;
  createdAt: string;
}
