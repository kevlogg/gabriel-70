import { z } from "zod";

export const TEMPLATE_IDS = [
  "classic-gold",
  "toy-story",
  "k-pop",
  "princesas",
  "futbol-infantil",
] as const;

export type TemplateId = (typeof TEMPLATE_IDS)[number];

export interface TemplateDefinition {
  id: TemplateId;
  name: string;
  category: string;
  description: string;
  emoji: string;
  previewBg: string;
  accentColor: string;
}

export const TEMPLATES: TemplateDefinition[] = [
  {
    id: "classic-gold",
    name: "Clásico Gala",
    category: "Adultos / Formal",
    description: "Tonos dorados y crema, sobre con sello de lacre, tipografía Cormorant Garamond",
    emoji: "👑",
    previewBg: "linear-gradient(135deg, #FAF5EE 0%, #F5EDD9 100%)",
    accentColor: "#C59B27",
  },
  {
    id: "toy-story",
    name: "Toy Story",
    category: "Infantil / Aventura",
    description: "Cielo celeste con nubes, estrella de sheriff dorada, colores Woody & Buzz",
    emoji: "🚀",
    previewBg: "linear-gradient(135deg, #38BDF8 0%, #0284C7 100%)",
    accentColor: "#F59E0B",
  },
  {
    id: "k-pop",
    name: "K-Pop Idol",
    category: "Teens & Fans",
    description: "Estilo idol aesthetic, destellos holográficos, luces neón rosa y lila",
    emoji: "💖",
    previewBg: "linear-gradient(135deg, #0F172A 0%, #3B0764 100%)",
    accentColor: "#EC4899",
  },
  {
    id: "princesas",
    name: "Princesas",
    category: "Infantil / Magia",
    description: "Castillo de cuento de hadas, corona mágica, tonos rosa pastel y lila encantado",
    emoji: "🏰",
    previewBg: "linear-gradient(135deg, #FCE7F3 0%, #F3E8FF 100%)",
    accentColor: "#E11D48",
  },
  {
    id: "futbol-infantil",
    name: "Fútbol Infantil",
    category: "Infantil / Deportes",
    description: "Césped de estadio, dorsal de camiseta, silbato y pasión de campeones",
    emoji: "⚽",
    previewBg: "linear-gradient(135deg, #15803D 0%, #166534 100%)",
    accentColor: "#EAB308",
  },
];

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
  audioTrackPath: z.string().default(""),
  footerPhrase: z.string().default(""),
  template: z.enum(TEMPLATE_IDS).default("classic-gold"),
  isDefault: z.boolean().default(false),
  clientToken: z.string().optional(),
});

export type InvitationFormData = z.infer<typeof InvitationSchema>;

export interface InvitationRecord extends InvitationFormData {
  id: string;
  createdAt: string;
  updatedAt: string;
}
