-- Pilot requests from the website. One row per request; no patient information is ever collected.
CREATE TABLE signups (
  id              TEXT PRIMARY KEY,
  created_at      TEXT NOT NULL,                       -- ISO 8601, UTC
  name            TEXT NOT NULL,
  role            TEXT NOT NULL,
  organization    TEXT NOT NULL,
  email           TEXT NOT NULL COLLATE NOCASE,
  location        TEXT NOT NULL,
  message         TEXT NOT NULL DEFAULT '',
  consent_contact INTEGER NOT NULL CHECK (consent_contact = 1),   -- agreed to be stored and contacted about the pilot
  consent_updates INTEGER NOT NULL DEFAULT 0 CHECK (consent_updates IN (0, 1)),
  policy_version  TEXT NOT NULL,                       -- the privacy notice version they agreed to
  source          TEXT NOT NULL DEFAULT '',            -- the site origin the request came from
  status          TEXT NOT NULL DEFAULT 'new'          -- for the team: new, contacted, enrolled, declined
);
CREATE INDEX signups_created ON signups (created_at);
CREATE INDEX signups_email ON signups (email);

-- Abuse limits. The key is a keyed hash of the visitor's network address and the hour, never the address
-- itself, and rows are deleted after a day.
CREATE TABLE rate_limits (
  key          TEXT PRIMARY KEY,
  window_start INTEGER NOT NULL,
  count        INTEGER NOT NULL
);
CREATE INDEX rate_limits_window ON rate_limits (window_start);
