import { createClient } from "@libsql/client";
import path from "path";
import os from "os";

export function getClient() {
  let url = process.env.DATABASE_URL;
  const authToken = process.env.DATABASE_AUTH_TOKEN || process.env.TURSO_AUTH_TOKEN;

  if (process.env.VERCEL && (!url || url.startsWith("file:"))) {
    const dbPath = path.join(os.tmpdir(), "gabriel70.db");
    url = `file:${dbPath}`;
  } else if (!url || url === "file:./gabriel70.db" || url.startsWith("file:./")) {
    const dbPath = path.resolve(process.cwd(), "gabriel70.db");
    url = `file:${dbPath}`;
  }

  return createClient({ url, authToken });
}
