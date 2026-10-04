-- Sample data for development.
--
-- This starts with TRUNCATE. That is correct on your laptop and catastrophic
-- against the database your live demo depends on. Check which DATABASE_URL is
-- loaded before you run it.

TRUNCATE TABLE games RESTART IDENTITY CASCADE;

INSERT INTO games (title, platform, status, last_note, last_played_at) VALUES
  ('Elden Ring', 'PC', 'playing',
   'Left off at the boss fight, floor 3.',
   now() - interval '3 days'),
  ('Hollow Knight', 'Switch', 'backlog',
   '',
   NULL),
  ('Baldur''s Gate 3', 'PC', 'completed',
   'Finished the main story.',
   now() - interval '20 days'),
  ('Starfield', 'PC', 'dropped',
   'Lost interest after the first few main quests.',
   now() - interval '60 days'),
  ('Persona 5 Royal', 'PS5', 'backlog',
   '',
   NULL),
  ('Hades', 'Switch', 'playing',
   'Grinding for the last few mirror upgrades.',
   now() - interval '1 day');
