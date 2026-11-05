import { z } from "zod";

export const InvitationSchema = z.object({
  slug: z
    .string()
    .min(2, "El slug debe tener al menos 2 caracteres")
    .max(50, "El slug no puede superar 50 caracteres")
    .regex(/^[a-z0-9-]+$/, "El slug solo puede contener letras minúsculas, números y guiones (-)"),
  personName: z.string().min(1, "El nombre del homenajeado/a es obligatorio"),
  headline: z.string().min(1, "El título principal es obligatorio"),
  subheadline: z.string().min(1, "El subtítulo es obligatorio"),
  eventNumber: z.string().default(""),
  badgeText: z.string().min(1, "La fecha y hora visible es obligatoria"),
  targetDate: z.string().min(1, "La fecha para la cuenta regresiva es obligatoria"),
  venueName: z.string().min(1, "El nombre del salón o finca es obligatorio"),
  venueAddress: z.string().min(1, "La dirección es obligatoria"),
  venueMapsUrl: z.string().default(""),
  venueCalendarUrl: z.string().default(""),
  giftBankName: z.string().default(""),
  giftAlias: z.string().default(""),
  giftCbu: z.string().default(""),
  giftHolderName: z.string().default(""),
  audioTrackPath: z.string().default("/audio/LosAngelesAzules-LaCumbiadelInfinito.mp3"),
  footerPhrase: z.string().default(""),
  isDefault: z.boolean().default(false),
  clientToken: z.string().optional(),
});

export type InvitationFormData = z.infer<typeof InvitationSchema>;

export interface InvitationRecord extends InvitationFormData {
  id: string;
  createdAt: string;
  updatedAt: string;
}

