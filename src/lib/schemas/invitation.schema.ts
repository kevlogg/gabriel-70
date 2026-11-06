import { z } from "zod";

export const TEMPLATE_IDS = [
  "classic-gold",
  "toy-story",
  "k-pop",
  "princesas",
  "futbol-infantil",
  "boda-botanica",
  "boda-clasica",
  "boda-boho",
] as const;

export type TemplateId = (typeof TEMPLATE_IDS)[number];

export type TemplateCategoryKey = "all" | "bodas" | "infantiles" | "fiestas" | "gala";

export interface TemplateCategory {
  id: TemplateCategoryKey;
  label: string;
  emoji: string;
}

export const TEMPLATE_CATEGORIES: TemplateCategory[] = [
  { id: "all", label: "Todas", emoji: "✨" },
  { id: "bodas", label: "Bodas & Casamientos", emoji: "💍" },
  { id: "infantiles", label: "Cumpleaños Infantiles", emoji: "🎈" },
  { id: "fiestas", label: "Jóvenes & Fiesta", emoji: "🪩" },
  { id: "gala", label: "Gala & Adultos", emoji: "👑" },
];

export interface TemplateDefinition {
  id: TemplateId;
  name: string;
  category: TemplateCategoryKey;
  categoryLabel: string;
  description: string;
  emoji: string;
  previewBg: string;
  accentColor: string;
  badge?: string;
}

export const TEMPLATES: TemplateDefinition[] = [
  // ─── BODAS & CASAMIENTOS ───
  {
    id: "boda-botanica",
    name: "Boda Botánica & Floral",
    category: "bodas",
    categoryLabel: "Bodas & Casamientos",
    description: "Verde eucalipto, marfil suave, destellos dorados y carrusel de fotos romántico",
    emoji: "🌿",
    previewBg: "linear-gradient(135deg, #F4F7F4 0%, #D8E2D8 100%)",
    accentColor: "#556B2F",
    badge: "Nueva",
  },
  {
    id: "boda-clasica",
    name: "Boda Clásica Black Tie",
    category: "bodas",
    categoryLabel: "Bodas & Casamientos",
    description: "Negro de noche, blanco puro, oro champaña, marco de lujo para fotos y alta etiqueta",
    emoji: "🥂",
    previewBg: "linear-gradient(135deg, #18181B 0%, #27272A 100%)",
    accentColor: "#D4AF37",
    badge: "Nueva",
  },
  {
    id: "boda-boho",
    name: "Boda Boho Chic & Sunset",
    category: "bodas",
    categoryLabel: "Bodas & Casamientos",
    description: "Tonos terracota, arena cálida, pampas secas, luces cálidas y carrusel polaroid",
    emoji: "🌾",
    previewBg: "linear-gradient(135deg, #FDF8F5 0%, #EBD5C8 100%)",
    accentColor: "#C86D51",
    badge: "Nueva",
  },

  // ─── CUMPLEAÑOS INFANTILES ───
  {
    id: "toy-story",
    name: "Toy Story Aventura",
    category: "infantiles",
    categoryLabel: "Cumpleaños Infantiles",
    description: "Cielo celeste con nubes, estrella de sheriff dorada y los personajes Woody & Buzz reales",
    emoji: "🚀",
    previewBg: "linear-gradient(135deg, #38BDF8 0%, #0284C7 100%)",
    accentColor: "#F59E0B",
  },
  {
    id: "princesas",
    name: "Princesas de Cuento",
    category: "infantiles",
    categoryLabel: "Cumpleaños Infantiles",
    description: "Castillo de cuento de hadas, corona mágica, Cenicienta y princesas Disney reales",
    emoji: "🏰",
    previewBg: "linear-gradient(135deg, #FCE7F3 0%, #F3E8FF 100%)",
    accentColor: "#E11D48",
  },
  {
    id: "futbol-infantil",
    name: "Fútbol Campeones",
    category: "infantiles",
    categoryLabel: "Cumpleaños Infantiles",
    description: "Césped de estadio, dorsal de camiseta, ticket de partido y Messi campeón",
    emoji: "⚽",
    previewBg: "linear-gradient(135deg, #15803D 0%, #166534 100%)",
    accentColor: "#EAB308",
  },

  // ─── JÓVENES & FIESTA ───
  {
    id: "k-pop",
    name: "K-Pop Idol & Tour",
    category: "fiestas",
    categoryLabel: "Jóvenes & Fiesta",
    description: "Estilo idol concert stage, destellos holográficos, luces neón rosa y grupo Blackpink",
    emoji: "💖",
    previewBg: "linear-gradient(135deg, #0F172A 0%, #3B0764 100%)",
    accentColor: "#EC4899",
  },

  // ─── GALA & ADULTOS ───
  {
    id: "classic-gold",
    name: "Clásico Gala Dorado",
    category: "gala",
    categoryLabel: "Gala & Adultos",
    description: "Tonos dorados y crema, sobre con sello de lacre, tipografía Cormorant Garamond",
    emoji: "👑",
    previewBg: "linear-gradient(135deg, #FAF5EE 0%, #F5EDD9 100%)",
    accentColor: "#C59B27",
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
  allowCompanions: z.boolean().default(true),
  allowDietary: z.boolean().default(true),
  isDefault: z.boolean().default(false),
  clientToken: z.string().optional(),
});

export type InvitationFormData = z.infer<typeof InvitationSchema>;

export interface InvitationRecord extends InvitationFormData {
  id: string;
  createdAt: string;
  updatedAt: string;
}
