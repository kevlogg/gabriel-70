import { getClient } from "@/lib/db";
import { EVENT_DATA } from "@/config/event";
import type { InvitationRecord, InvitationFormData } from "@/lib/schemas/invitation.schema";

let isDbInitialized = false;

export async function initializeInvitationsDb(): Promise<void> {
  if (isDbInitialized) return;
  const client = getClient();

  // Create invitations table
  await client.execute(`
    CREATE TABLE IF NOT EXISTS invitations (
      id               TEXT PRIMARY KEY,
      slug             TEXT NOT NULL UNIQUE,
      personName       TEXT NOT NULL,
      headline         TEXT NOT NULL,
      subheadline      TEXT NOT NULL,
      eventNumber      TEXT,
      badgeText        TEXT NOT NULL,
      targetDate       TEXT NOT NULL,
      venueName        TEXT NOT NULL,
      venueAddress     TEXT NOT NULL,
      venueMapsUrl     TEXT,
      venueCalendarUrl TEXT,
      giftBankName     TEXT,
      giftAlias        TEXT,
      giftCbu          TEXT,
      giftHolderName   TEXT,
      audioTrackPath   TEXT,
      footerPhrase     TEXT,
      template         TEXT NOT NULL DEFAULT 'classic-gold',
      allowCompanions  INTEGER NOT NULL DEFAULT 1,
      allowDietary     INTEGER NOT NULL DEFAULT 1,
      isDefault        INTEGER NOT NULL DEFAULT 0,
      clientToken      TEXT,
      createdAt        TEXT NOT NULL,
      updatedAt        TEXT NOT NULL
    )
  `);

  try {
    await client.execute(`CREATE INDEX IF NOT EXISTS idx_invitations_slug ON invitations (slug)`);
  } catch {
    // Index already exists
  }

  // Ensure rsvps has invitationSlug column
  try {
    await client.execute(`ALTER TABLE rsvps ADD COLUMN invitationSlug TEXT DEFAULT 'gabriel70'`);
  } catch {
    // Column already exists
  }

  // Ensure master_guests has invitationSlug column
  try {
    await client.execute(`ALTER TABLE master_guests ADD COLUMN invitationSlug TEXT DEFAULT 'gabriel70'`);
  } catch {
    // Column already exists
  }

  // Ensure invitations has template column
  try {
    await client.execute(`ALTER TABLE invitations ADD COLUMN template TEXT DEFAULT 'classic-gold'`);
  } catch {
    // Column already exists
  }

  // Ensure invitations has allowCompanions column
  try {
    await client.execute(`ALTER TABLE invitations ADD COLUMN allowCompanions INTEGER DEFAULT 1`);
  } catch {
    // Column already exists
  }

  // Ensure invitations has allowDietary column
  try {
    await client.execute(`ALTER TABLE invitations ADD COLUMN allowDietary INTEGER DEFAULT 1`);
  } catch {
    // Column already exists
  }

  // Ensure invitations has carouselImages column
  try {
    await client.execute(`ALTER TABLE invitations ADD COLUMN carouselImages TEXT DEFAULT ''`);
  } catch {
    // Column already exists
  }

  // Auto-seed gabriel70 if it doesn't exist
  const existing = await client.execute({
    sql: `SELECT id FROM invitations WHERE slug = ? LIMIT 1`,
    args: ["gabriel70"],
  });

  if (existing.rows.length === 0) {
    const id = "inv_gabriel70";
    const now = new Date().toISOString();
    await client.execute({
      sql: `INSERT INTO invitations (
        id, slug, personName, headline, subheadline, eventNumber, badgeText,
        targetDate, venueName, venueAddress, venueMapsUrl, venueCalendarUrl,
        giftBankName, giftAlias, giftCbu, giftHolderName, audioTrackPath,
        footerPhrase, isDefault, createdAt, updatedAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        id,
        "gabriel70",
        EVENT_DATA.personName,
        EVENT_DATA.headline,
        EVENT_DATA.subheadline,
        "70",
        "Sábado · 7 de Noviembre · 20:30 hs",
        EVENT_DATA.targetDate,
        EVENT_DATA.venue.name,
        EVENT_DATA.venue.address,
        EVENT_DATA.venue.mapsUrl,
        EVENT_DATA.venue.googleCalendarUrl,
        EVENT_DATA.gift.bankName,
        EVENT_DATA.gift.alias,
        EVENT_DATA.gift.cbu,
        EVENT_DATA.gift.holderName,
        EVENT_DATA.audioTrackPath,
        "70 vueltas al sol merecen una fiesta a la altura. Vení listo para disfrutar sin mirar el reloj. 🥂",
        1, // isDefault = true
        now,
        now,
      ],
    });
  }

  isDbInitialized = true;
}

function rowToInvitation(row: Record<string, unknown>): InvitationRecord {
  return {
    id: String(row.id),
    slug: String(row.slug),
    personName: String(row.personName ?? ""),
    headline: String(row.headline ?? ""),
    subheadline: String(row.subheadline ?? ""),
    eventNumber: String(row.eventNumber ?? ""),
    badgeText: String(row.badgeText ?? ""),
    targetDate: String(row.targetDate ?? ""),
    venueName: String(row.venueName ?? ""),
    venueAddress: String(row.venueAddress ?? ""),
    venueMapsUrl: String(row.venueMapsUrl ?? ""),
    venueCalendarUrl: String(row.venueCalendarUrl ?? ""),
    giftBankName: String(row.giftBankName ?? ""),
    giftAlias: String(row.giftAlias ?? ""),
    giftCbu: String(row.giftCbu ?? ""),
    giftHolderName: String(row.giftHolderName ?? ""),
    audioTrackPath: String(row.audioTrackPath ?? ""),
    footerPhrase: String(row.footerPhrase ?? ""),
    carouselImages: String(row.carouselImages ?? ""),
    template: ((row.template as string) || "classic-gold") as any,
    allowCompanions: Number(row.allowCompanions ?? 1) === 1,
    allowDietary: Number(row.allowDietary ?? 1) === 1,
    isDefault: Number(row.isDefault) === 1,
    clientToken: row.clientToken ? String(row.clientToken) : undefined,
    createdAt: String(row.createdAt),
    updatedAt: String(row.updatedAt),
  };
}

export async function getAllInvitations(): Promise<InvitationRecord[]> {
  await initializeInvitationsDb();
  const client = getClient();
  const res = await client.execute(`SELECT * FROM invitations ORDER BY isDefault DESC, createdAt DESC`);
  return res.rows.map(rowToInvitation);
}

export async function getInvitationBySlug(slug: string): Promise<InvitationRecord | null> {
  await initializeInvitationsDb();
  const client = getClient();
  const res = await client.execute({
    sql: `SELECT * FROM invitations WHERE slug = ? LIMIT 1`,
    args: [slug],
  });

  if (res.rows.length === 0) return null;
  return rowToInvitation(res.rows[0]);
}

export async function getDefaultInvitation(): Promise<InvitationRecord> {
  await initializeInvitationsDb();
  const client = getClient();
  const res = await client.execute(`SELECT * FROM invitations WHERE isDefault = 1 LIMIT 1`);
  if (res.rows.length > 0) {
    return rowToInvitation(res.rows[0]);
  }

  // Fallback to gabriel70 or first
  const first = await client.execute(`SELECT * FROM invitations LIMIT 1`);
  if (first.rows.length > 0) {
    return rowToInvitation(first.rows[0]);
  }

  // Absolute fallback to mock record from EVENT_DATA
  return {
    id: "inv_gabriel70",
    slug: "gabriel70",
    personName: EVENT_DATA.personName,
    headline: EVENT_DATA.headline,
    subheadline: EVENT_DATA.subheadline,
    eventNumber: "70",
    badgeText: "Sábado · 7 de Noviembre · 20:30 hs",
    targetDate: EVENT_DATA.targetDate,
    venueName: EVENT_DATA.venue.name,
    venueAddress: EVENT_DATA.venue.address,
    venueMapsUrl: EVENT_DATA.venue.mapsUrl,
    venueCalendarUrl: EVENT_DATA.venue.googleCalendarUrl,
    giftBankName: EVENT_DATA.gift.bankName,
    giftAlias: EVENT_DATA.gift.alias,
    giftCbu: EVENT_DATA.gift.cbu,
    giftHolderName: EVENT_DATA.gift.holderName,
    audioTrackPath: EVENT_DATA.audioTrackPath,
    footerPhrase: "70 vueltas al sol merecen una fiesta a la altura. Vení listo para disfrutar sin mirar el reloj. 🥂",
    template: "classic-gold",
    allowCompanions: true,
    allowDietary: true,
    isDefault: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

export async function createInvitation(data: InvitationFormData): Promise<InvitationRecord> {
  await initializeInvitationsDb();
  const client = getClient();

  const id = `inv_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`;
  const now = new Date().toISOString();

  if (data.isDefault) {
    // Remove previous default
    await client.execute(`UPDATE invitations SET isDefault = 0`);
  }

  await client.execute({
    sql: `INSERT INTO invitations (
      id, slug, personName, headline, subheadline, eventNumber, badgeText,
      targetDate, venueName, venueAddress, venueMapsUrl, venueCalendarUrl,
      giftBankName, giftAlias, giftCbu, giftHolderName, audioTrackPath,
      footerPhrase, carouselImages, template, allowCompanions, allowDietary, isDefault, clientToken, createdAt, updatedAt
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    args: [
      id,
      data.slug,
      data.personName,
      data.headline,
      data.subheadline,
      data.eventNumber || "",
      data.badgeText,
      data.targetDate,
      data.venueName,
      data.venueAddress,
      data.venueMapsUrl || "",
      data.venueCalendarUrl || "",
      data.giftBankName || "",
      data.giftAlias || "",
      data.giftCbu || "",
      data.giftHolderName || "",
      data.audioTrackPath || "",
      data.footerPhrase || "",
      data.carouselImages || "",
      data.template || "classic-gold",
      data.allowCompanions !== false ? 1 : 0,
      data.allowDietary !== false ? 1 : 0,
      data.isDefault ? 1 : 0,
      data.clientToken || null,
      now,
      now,
    ],
  });

  return {
    ...data,
    id,
    createdAt: now,
    updatedAt: now,
  };
}

export async function updateInvitation(
  id: string,
  data: Partial<InvitationFormData>
): Promise<void> {
  await initializeInvitationsDb();
  const client = getClient();
  const now = new Date().toISOString();

  if (data.isDefault) {
    await client.execute(`UPDATE invitations SET isDefault = 0`);
  }

  const existingRes = await client.execute({
    sql: `SELECT * FROM invitations WHERE id = ? LIMIT 1`,
    args: [id],
  });
  if (existingRes.rows.length === 0) {
    throw new Error("Invitación no encontrada");
  }

  const current = rowToInvitation(existingRes.rows[0]);
  const updated = { ...current, ...data };

  await client.execute({
    sql: `UPDATE invitations SET
      slug = ?, personName = ?, headline = ?, subheadline = ?,
      eventNumber = ?, badgeText = ?, targetDate = ?,
      venueName = ?, venueAddress = ?, venueMapsUrl = ?, venueCalendarUrl = ?,
      giftBankName = ?, giftAlias = ?, giftCbu = ?, giftHolderName = ?,
      audioTrackPath = ?, footerPhrase = ?, carouselImages = ?, template = ?,
      allowCompanions = ?, allowDietary = ?,
      isDefault = ?, clientToken = ?,
      updatedAt = ?
      WHERE id = ?`,
    args: [
      updated.slug,
      updated.personName,
      updated.headline,
      updated.subheadline,
      updated.eventNumber || "",
      updated.badgeText,
      updated.targetDate,
      updated.venueName,
      updated.venueAddress,
      updated.venueMapsUrl || "",
      updated.venueCalendarUrl || "",
      updated.giftBankName || "",
      updated.giftAlias || "",
      updated.giftCbu || "",
      updated.giftHolderName || "",
      updated.audioTrackPath || "",
      updated.footerPhrase || "",
      updated.carouselImages || "",
      updated.template || "classic-gold",
      updated.allowCompanions !== false ? 1 : 0,
      updated.allowDietary !== false ? 1 : 0,
      updated.isDefault ? 1 : 0,
      updated.clientToken || null,
      now,
      id,
    ],
  });
}

export async function setDefaultInvitation(id: string): Promise<void> {
  await initializeInvitationsDb();
  const client = getClient();
  await client.execute(`UPDATE invitations SET isDefault = 0`);
  await client.execute({
    sql: `UPDATE invitations SET isDefault = 1 WHERE id = ?`,
    args: [id],
  });
}

export async function deleteInvitation(id: string): Promise<void> {
  await initializeInvitationsDb();
  const client = getClient();

  const res = await client.execute({
    sql: `SELECT slug, isDefault FROM invitations WHERE id = ?`,
    args: [id],
  });
  if (res.rows.length === 0) return;

  const slug = String(res.rows[0].slug);
  if (slug === "gabriel70") {
    throw new Error("No se puede eliminar la invitación protegida 'gabriel70'.");
  }

  await client.execute({
    sql: `DELETE FROM invitations WHERE id = ?`,
    args: [id],
  });
}
