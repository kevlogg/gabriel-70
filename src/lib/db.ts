import { createClient } from "@libsql/client";
import path from "path";
import os from "os";

export function getClient() {
  let url = process.env.DATABASE_URL;

  // On Vercel / serverless environment, local SQLite files must be located in /tmp directory
  if (!url || url === "file:./gabriel70.db" || (process.env.VERCEL && url.startsWith("file:./"))) {
    if (process.env.VERCEL || process.env.NODE_ENV === "production") {
      const dbPath = path.join(os.tmpdir(), "gabriel70.db");
      url = `file:${dbPath}`;
    } else {
      url = "file:./gabriel70.db";
    }
  }

  return createClient({ url });
}
