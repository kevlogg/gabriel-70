import { getClient } from "@/lib/db";

export interface MasterGuest {
  id: string;
  name: string;
  createdAt: string;
}

export async function initializeMasterGuestsDb(): Promise<void> {
  const client = getClient();
  await client.execute(`
    CREATE TABLE IF NOT EXISTS master_guests (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      createdAt TEXT NOT NULL
    )
  `);
}

function generateId(): string {
  const timestamp = Date.now().toString(36);
  const randomPart = Math.random().toString(36).slice(2, 9);
  return `${timestamp}${randomPart}`;
}

export async function getMasterGuests(): Promise<MasterGuest[]> {
  try {
    await initializeMasterGuestsDb();
    const client = getClient();
    const result = await client.execute(`SELECT id, name, createdAt FROM master_guests ORDER BY name ASC`);
    return result.rows.map((r) => ({
      id: String(r.id),
      name: String(r.name),
      createdAt: String(r.createdAt),
    }));
  } catch (err) {
    console.error("Error fetching master guests:", err);
    return [];
  }
}

export async function addMasterGuest(name: string): Promise<MasterGuest> {
  await initializeMasterGuestsDb();
  const client = getClient();
  const trimmed = name.trim();
  if (!trimmed) throw new Error("El nombre no puede estar vacío");

  const id = generateId();
  const createdAt = new Date().toISOString();

  await client.execute({
    sql: `INSERT INTO master_guests (id, name, createdAt) VALUES (?, ?, ?)`,
    args: [id, trimmed, createdAt],
  });

  return { id, name: trimmed, createdAt };
}

export async function addMasterGuestsBulk(rawNamesText: string): Promise<number> {
  await initializeMasterGuestsDb();
  const client = getClient();

  // Split by newlines, or by commas/semicolons if user pasted a single line with commas
  let rawLines = rawNamesText.split(/\r?\n/);
  if (rawLines.length === 1 && (rawNamesText.includes(",") || rawNamesText.includes(";"))) {
    rawLines = rawNamesText.split(/[,;]/);
  }

  const names = rawLines
    .map((line) => {
      return line
        // Remove leading numbers, dots, parentheses, bullets ("1.", "1)", "•", "-", "*", etc.)
        .replace(/^[\s\d.\-)•*+]+/, "")
        .trim();
    })
    .filter((n) => n.length > 0);

  if (names.length === 0) return 0;

  const createdAt = new Date().toISOString();

  try {
    const statements = names.map((name) => ({
      sql: `INSERT INTO master_guests (id, name, createdAt) VALUES (?, ?, ?)`,
      args: [generateId(), name, createdAt],
    }));

    await client.batch(statements, "write");
    return names.length;
  } catch (err) {
    console.error("Error in batch insert of master guests, falling back to sequential:", err);
    let count = 0;
    for (const name of names) {
      try {
        await client.execute({
          sql: `INSERT INTO master_guests (id, name, createdAt) VALUES (?, ?, ?)`,
          args: [generateId(), name, createdAt],
        });
        count++;
      } catch (innerErr) {
        console.error(`Failed to insert guest "${name}":`, innerErr);
      }
    }
    return count;
  }
}


export async function deleteMasterGuest(id: string): Promise<void> {
  await initializeMasterGuestsDb();
  const client = getClient();
  await client.execute({
    sql: `DELETE FROM master_guests WHERE id = ?`,
    args: [id],
  });
}

export async function clearAllMasterGuests(): Promise<void> {
  await initializeMasterGuestsDb();
  const client = getClient();
  await client.execute(`DELETE FROM master_guests`);
}
