-- The complete shape of the database. Safe to run against an empty database,
-- and safe to run twice.
--
-- This file is committed on purpose. Your schema is a fact about your
-- application, not a runtime concern: it should be readable by opening a file
-- rather than by connecting to a server. It is also what lets you move to a
-- hosted database in one command.

CREATE TABLE IF NOT EXISTS games (
  id              SERIAL PRIMARY KEY,
  title           TEXT        NOT NULL,
  platform        TEXT        NOT NULL DEFAULT '',
  status          TEXT        NOT NULL DEFAULT 'backlog'
                    CHECK (status IN ('backlog', 'playing', 'completed', 'dropped')),
  last_note       TEXT        NOT NULL DEFAULT '',
  last_played_at  TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- The Library screen always sorts alphabetically by title. Without this the
-- database reads every row and sorts it on each request.
CREATE INDEX IF NOT EXISTS games_title_idx
  ON games (title);
