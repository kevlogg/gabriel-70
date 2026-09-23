import { createClient } from "@libsql/client";
import type { RsvpRecord } from "@/lib/schemas/rsvp.schema";

function getClient() {
  const url = process.env.DATABASE_URL ?? "file:./gabriel70.db";
  return createClient({ url });
}

async function initializeDb(): Promise<void> {
  const client = getClient();
  await client.execute(`
    CREATE TABLE IF NOT EXISTS rsvps (
      id          TEXT PRIMARY KEY,
      name        TEXT NOT NULL,
      attending   INTEGER NOT NULL,
      companionsCount INTEGER NOT NULL DEFAULT 0,
      dietaryRestrictions TEXT NOT NULL DEFAULT 'ninguna',
      message     TEXT,
      createdAt   TEXT NOT NULL
    )
  `);
}

function generateId(): string {
  const timestamp = Date.now().toString(36);
  const randomPart = Math.random().toString(36).slice(2, 9);
  return `${timestamp}${randomPart}`;
}

export interface CreateRsvpInput {
  name: string;
  attending: "yes" | "no";
  companionsCount: number;
  dietaryRestrictions: string;
  message?: string;
}

export async function createRsvp(data: CreateRsvpInput): Promise<RsvpRecord> {
  await initializeDb();
  const client = getClient();

  const id = generateId();
  const createdAt = new Date().toISOString();

  await client.execute({
    sql: `INSERT INTO rsvps (id, name, attending, companionsCount, dietaryRestrictions, message, createdAt)
          VALUES (?, ?, ?, ?, ?, ?, ?)`,
    args: [
      id,
      data.name,
      data.attending === "yes" ? 1 : 0,
      data.companionsCount,
      data.dietaryRestrictions,
      data.message ?? null,
      createdAt,
    ],
  });

  return {
    id,
    name: data.name,
    attending: data.attending,
    companionsCount: data.companionsCount,
    dietaryRestrictions: data.dietaryRestrictions as RsvpRecord["dietaryRestrictions"],
    message: data.message,
    createdAt,
  };
}

export async function getAllRsvps(): Promise<RsvpRecord[]> {
  await initializeDb();
  const client = getClient();

  const result = await client.execute(
    `SELECT id, name, attending, companionsCount, dietaryRestrictions, message, createdAt
     FROM rsvps ORDER BY createdAt DESC`
  );

  return result.rows.map((row) => ({
    id: String(row.id),
    name: String(row.name),
    attending: row.attending === 1 ? "yes" : ("no" as "yes" | "no"),
    companionsCount: Number(row.companionsCount),
    dietaryRestrictions: String(row.dietaryRestrictions) as RsvpRecord["dietaryRestrictions"],
    message: row.message != null ? String(row.message) : undefined,
    createdAt: String(row.createdAt),
  }));
}
