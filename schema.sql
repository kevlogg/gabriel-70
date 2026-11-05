-- Schema de inicialización para invitaciondigital
-- La app inicializa y migra las tablas automáticamente al conectarse.

CREATE TABLE IF NOT EXISTS invitations (
  id                  TEXT PRIMARY KEY,
  slug                TEXT NOT NULL UNIQUE,
  personName          TEXT NOT NULL,
  headline            TEXT NOT NULL,
  subheadline         TEXT NOT NULL,
  eventNumber         TEXT,
  badgeText           TEXT NOT NULL,
  targetDate          TEXT NOT NULL,
  venueName           TEXT NOT NULL,
  venueAddress        TEXT NOT NULL,
  venueMapsUrl        TEXT,
  venueCalendarUrl    TEXT,
  giftBankName        TEXT,
  giftAlias           TEXT,
  giftCbu             TEXT,
  giftHolderName      TEXT,
  audioTrackPath      TEXT,
  footerPhrase        TEXT,
  isDefault           INTEGER NOT NULL DEFAULT 0,
  clientToken         TEXT,
  createdAt           TEXT NOT NULL,
  updatedAt           TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_invitations_slug ON invitations (slug);

CREATE TABLE IF NOT EXISTS rsvps (
  id                  TEXT PRIMARY KEY,
  invitationSlug      TEXT NOT NULL DEFAULT 'gabriel70',
  name                TEXT NOT NULL,
  attending           INTEGER NOT NULL CHECK (attending IN (0, 1)),
  companionsCount     INTEGER NOT NULL DEFAULT 0 CHECK (companionsCount >= 0),
  companionNames      TEXT,
  dietaryRestrictions TEXT NOT NULL DEFAULT 'ninguna',
  message             TEXT,
  createdAt           TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_rsvps_slug ON rsvps (invitationSlug);
CREATE INDEX IF NOT EXISTS idx_rsvps_attending ON rsvps (attending);
CREATE INDEX IF NOT EXISTS idx_rsvps_created   ON rsvps (createdAt DESC);
