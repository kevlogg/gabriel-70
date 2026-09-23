-- Schema de inicialización para gabriel70.db
-- Ejecutar con: sqlite3 gabriel70.db < schema.sql
-- O simplemente iniciar el servidor: la app crea la tabla automáticamente.

CREATE TABLE IF NOT EXISTS rsvps (
  id                  TEXT PRIMARY KEY,
  name                TEXT NOT NULL,
  attending           INTEGER NOT NULL CHECK (attending IN (0, 1)),
  companionsCount     INTEGER NOT NULL DEFAULT 0 CHECK (companionsCount >= 0),
  dietaryRestrictions TEXT NOT NULL DEFAULT 'ninguna',
  message             TEXT,
  createdAt           TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_rsvps_attending ON rsvps (attending);
CREATE INDEX IF NOT EXISTS idx_rsvps_created   ON rsvps (createdAt DESC);
