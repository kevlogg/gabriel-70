import { getClient } from "@/lib/db";
import type { RsvpRecord } from "@/lib/schemas/rsvp.schema";

async function initializeDb(): Promise<void> {
  const client = getClient();
  await client.execute(`
    CREATE TABLE IF NOT EXISTS rsvps (
      id              TEXT PRIMARY KEY,
      invitationSlug  TEXT NOT NULL DEFAULT 'gabriel70',
      name            TEXT NOT NULL,
      attending       INTEGER NOT NULL,
      companionsCount INTEGER NOT NULL DEFAULT 0,
      companionNames  TEXT,
      dietaryRestrictions TEXT NOT NULL DEFAULT 'ninguna',
      message         TEXT,
      createdAt       TEXT NOT NULL
    )
  `);

  try {
    await client.execute(`ALTER TABLE rsvps ADD COLUMN companionNames TEXT`);
  } catch {
    // Column already exists
  }

  try {
    await client.execute(`ALTER TABLE rsvps ADD COLUMN invitationSlug TEXT DEFAULT 'gabriel70'`);
  } catch {
    // Column already exists
  }

  try {
    await client.execute(`CREATE INDEX IF NOT EXISTS idx_rsvps_slug ON rsvps (invitationSlug)`);
  } catch {
    // Index already exists
  }
}

function generateId(): string {
  const timestamp = Date.now().toString(36);
  const randomPart = Math.random().toString(36).slice(2, 9);
  return `${timestamp}${randomPart}`;
}

export interface CreateRsvpInput {
  invitationSlug?: string;
  name: string;
  attending: "yes" | "no";
  companionsCount: number;
  companionNames?: string[];
  dietaryRestrictions: string;
  message?: string;
}

export async function createRsvp(data: CreateRsvpInput): Promise<RsvpRecord> {
  await initializeDb();
  const client = getClient();

  const id = generateId();
  const createdAt = new Date().toISOString();
  const namesJson =
    data.companionNames && data.companionNames.length > 0
      ? JSON.stringify(data.companionNames)
      : null;
  const invitationSlug = data.invitationSlug || "gabriel70";

  await client.execute({
    sql: `INSERT INTO rsvps (id, invitationSlug, name, attending, companionsCount, companionNames, dietaryRestrictions, message, createdAt)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    args: [
      id,
      invitationSlug,
      data.name,
      data.attending === "yes" ? 1 : 0,
      data.companionsCount,
      namesJson,
      data.dietaryRestrictions,
      data.message ?? null,
      createdAt,
    ],
  });

  return {
    id,
    invitationSlug,
    name: data.name,
    attending: data.attending,
    companionsCount: data.companionsCount,
    companionNames: data.companionNames,
    dietaryRestrictions: data.dietaryRestrictions as RsvpRecord["dietaryRestrictions"],
    message: data.message,
    createdAt,
  };
}

export async function getAllRsvps(slug?: string): Promise<RsvpRecord[]> {
  try {
    await initializeDb();
    const client = getClient();

    let sql = `SELECT id, invitationSlug, name, attending, companionsCount, companionNames, dietaryRestrictions, message, createdAt
               FROM rsvps`;
    const args: (string | number)[] = [];

    if (slug) {
      sql += ` WHERE invitationSlug = ?`;
      args.push(slug);
    }

    sql += ` ORDER BY createdAt DESC`;

    const result = await client.execute({ sql, args });

    return result.rows.map((row) => {
      let companionNames: string[] | undefined = undefined;
      if (row.companionNames && typeof row.companionNames === "string") {
        try {
          companionNames = JSON.parse(row.companionNames);
        } catch {
          companionNames = [row.companionNames];
        }
      }

      return {
        id: String(row.id),
        invitationSlug: String(row.invitationSlug || "gabriel70"),
        name: String(row.name),
        attending: row.attending === 1 ? "yes" : ("no" as "yes" | "no"),
        companionsCount: Number(row.companionsCount),
        companionNames,
        dietaryRestrictions: String(row.dietaryRestrictions) as RsvpRecord["dietaryRestrictions"],
        message: row.message != null ? String(row.message) : undefined,
        createdAt: String(row.createdAt),
      };
    });
  } catch (err) {
    console.error("Error fetching RSVPs:", err);
    return [];
  }
}

export async function deleteRsvp(id: string): Promise<void> {
  try {
    await initializeDb();
    const client = getClient();
    await client.execute({
      sql: `DELETE FROM rsvps WHERE id = ?`,
      args: [id],
    });
  } catch (err) {
    console.error("Error deleting RSVP:", err);
  }
}
