# Start here

This is Shiori: a Tachiyomi-style tracker for your game library. This file is the
first hour with the repository as it stands today, and the map for what is left.
Delete it once you have worked through it.

## What you have

A working full-stack skeleton, with one screen built.

```
client/     React + Vite + Tailwind v3. Deploys to GitHub Pages already.
server/     Express + PostgreSQL. Written, but deployed nowhere yet.
docs/       proposal, mockup, design system, weekly reports (still templates)
```

**Where the app is right now**

| Piece | State |
| --- | --- |
| Library screen | Works. Loading, ready and error states, add a game, remove a game |
| Game Detail screen | **Not built.** `handleSelectGame` in `LibraryPage.jsx` only does `console.log` |
| Routing | **None.** `App.jsx` renders `<LibraryPage />` and nothing else |
| `api/` layer | Done: `listGames`, `getGame`, `createGame`, `updateGame`, `deleteGame`, in both `mockApi.js` and `httpApi.js` |
| Express API | Done: `/api/games` CRUD, validation, `/healthz`, `/readyz` |
| Database | `schema.sql` and `seed.sql` written for a `games` table. Never run against real Postgres yet |

**It runs right now, with no database and no server**, because the client defaults
to the simulated backend (`mockApi.js`, stored in your browser's `localStorage`).
That is what makes the GitHub Pages link work on day one.

It is also **not** a finished project. Your finals submission is the React client,
your Express API and your PostgreSQL database, all three deployed and talking to
each other.

## The first hour

### 1. Make it yours

Parts of the template are still showing. None of them are broken, all of them are
visible to a grader.

- [ ] **Rename the repository** to `shiori`.
- [ ] Put your name in `LICENSE`.
- [ ] Replace `README.md`. It still says "Your Project Name" and describes ghost
      sightings and a `haunted` database. Yours is `shiori`.
- [ ] `client/index.html`: the `<title>` is still "Final Project" and the
      description is the template's placeholder.
- [ ] `client/package.json` and `server/package.json` are still named
      `final-project-client` and `final-project-server`.
- [ ] `docs/` files are still the template's instructions. Replace them with your
      own content as you go.
- [ ] Delete this file when you are finished with it.

### 2. Run it

```bash
cd client
npm install
npm run dev
```

Open http://localhost:5173. Add a game, reload, see it persist.

There is no `client/.env.example` in the repository, and you do not need one: an
unset `VITE_USE_MOCK_API` means demo mode, which is what you want for now. When
you connect the real API you will create `client/.env` yourself (see below).

### 3. Deploy it, today

Do not save this for December.

- [ ] **Settings > General > Danger Zone:** make the repository **public**.
- [ ] **Settings > Pages > Build and deployment > Source: GitHub Actions.**
      Miss this and the workflow runs green and publishes nothing.
- [ ] Push to `main`. Watch the Actions tab. The deploy job prints your URL.
- [ ] Open that URL **in a private browsing window**, on your phone as well as
      your laptop.

Put the live link at the top of your README.

### 4. Link it to your workspace

Your project repository carries nothing that identifies you. The private pointer
that connects it to you for grading lives in your **workspace** repository. Create
`project/README.md` there:

```markdown
# My final project

**Repository:** https://github.com/yourusername/shiori
**Live site:** https://yourusername.github.io/shiori/
**API:** https://your-api.onrender.com/healthz
```

## The rest of the term

### Week one to two: finish the interface, in demo mode

Work entirely in `client/`. Two jobs:

**Build the Game Detail screen.** `src/pages/GameDetailPage.jsx`. It needs four
pieces:

1. State for the loading, ready and error states, plus the game itself.
2. A `useEffect` that calls `getGame(id)` when the page opens.
3. A form with a status dropdown and a note textarea, filled from the game.
4. A save handler that calls `updateGame(id, {...})`, then shows that it worked.

Send the **whole** game object when you save: `title`, `platform`, `status`,
`last_note`, `last_played_at`. The mock merges partial updates, but the real
server replaces the row and rejects a missing title. If you only send
`{ status }`, it works in demo mode and returns a 400 the day you switch. See
"Things that will catch you" below.

**Add routing, then wire up the Library.** Right now there is one screen and no
way to reach a second. Pick a router, give Game Detail a URL like `/games/:id`,
replace the `console.log` in `handleSelectGame` with a navigation, and make the
back arrow in `Header.jsx` do something. The build already copies `index.html` to
`404.html`, so refreshing on a nested route survives on Pages. Do not remove that
step.

**Keep the shape of `src/api/`.** If you add a function (say `listRecentGames`),
add it to `mockApi.js`, `httpApi.js` **and** the export list in `index.js`, or the
switch to the real API breaks one screen at a time.

### Week two to three: a real database

You have probably never run PostgreSQL itself, only `pg-mem`. Close that gap early.

```bash
docker run --name shiori-pg -e POSTGRES_PASSWORD=devpassword \
  -e POSTGRES_DB=shiori -p 5432:5432 -d postgres:17

cd server
npm install
cp .env.example .env     # DATABASE_URL already points at a database called shiori
npm run db:reset         # creates the games table, adds six sample rows
npm run dev
curl http://localhost:3000/readyz
curl http://localhost:3000/api/games
```

Careful: `seed.sql` starts with `TRUNCATE`. That is right on your laptop and
catastrophic against the database your live demo depends on. Check which
`DATABASE_URL` is loaded before you run `db:reset`.

Then point the client at it:

```
# client/.env
VITE_USE_MOCK_API=false
VITE_API_BASE_URL=http://localhost:3000
```

(In dev, Vite also proxies `/api` to port 3000, so leaving the base URL empty
works locally too.)

### Week three to four: get all three online

Pick a database host and an API host, deploy both, then flip the client:

- `VITE_USE_MOCK_API` to `false` (repository variable)
- `VITE_API_BASE_URL` to your API's URL, no trailing slash (repository variable)
- `CORS_ORIGINS` on the API to your Pages origin, e.g.
  `https://yourusername.github.io` (no path, no trailing slash)
- Run `server/db/schema.sql` once against the hosted database. Do **not** run
  `seed.sql` there unless you mean to wipe it.

Rebuild the client, because those values are compiled in at build time. The demo
notice disappears by itself.

### The rest of the term: build your project

One new thing at a time. Working, committed, deployed, then the next one.

## Things that will catch you

These are specific to this codebase.

| Symptom | Cause |
| --- | --- |
| Saving works in demo mode, then returns `400 title is required` on the real API | `PUT /api/games/:id` replaces the whole row. Send every field, not just the one that changed. The mock merges partial updates, so it hides this |
| `/api/games/abc` returns 500 instead of 404 | the `id` column is an integer and the repo passes the URL value straight in. Postgres throws on `'abc'`. Check the id is a number in `server.js` and return 404 |
| A request with a nonsense `last_played_at` returns 500 | `validate()` checks every field except this one. A bad date string reaches Postgres and fails there. Validate it (a `Date` that is not `NaN`) before it gets that far |
| Library order changes after a reload | the API sorts by title, but `handleSubmit` puts the new game at the **top** of the local list. Either sort locally the same way or reload the list after a save |
| Your data vanished when you renamed something | `mockApi.js` stores everything under the localStorage key `final-project:games`. Change the key and every visitor starts from the seed again |
| An error message stays on screen after you retry | `LibraryPage` clears `error` when it reloads, but not after a successful add or delete |
| Mock ids look like `seed-1` or a UUID, the server's are `1, 2, 3` | harmless today, because every comparison goes through `String()`. Keep doing that in new code |
| Buttons have a faint purple border or sit left-aligned in forms | rules from the template's `styles.css` (the plain `button`, `label` and `input` selectors) leak in under Tailwind. Delete the ones you no longer use |
| Tailwind classes stop working after an `npm install` | the project is pinned to **Tailwind v3**. Tailwind v4 moved config into CSS and your `tailwind.config.js` tokens would have nowhere to go. Do not upgrade it |
| `p-1`, `p-2`, `p-4` are not what you expect | your config overrides them to 8px, 16px and 32px. `p-3` is still Tailwind's default 12px, so mixing them looks inconsistent |
| Blank white page on Pages, 404s on the JavaScript | the base path. The workflow sets it; do not hardcode it |
| `CORS policy` in the console | `CORS_ORIGINS` on the API does not name your Pages origin exactly |
| First request takes 45 seconds | your free-tier API was asleep. Expected. Say so in the interface |
| `DATABASE_URL is not set` | you set it locally and not in the host's dashboard |
| Deploy fails on an import that obviously exists | capitalisation. The runner is Linux and your laptop probably is not |

## Before you submit

- [ ] Work through `docs/06-security-and-privacy.md`. One item you will not have
      yet: `helmet` is on the checklist and is **not installed** in `server/`.
      `npm install helmet`, then `app.use(helmet())`.
- [ ] Seed data is invented. The sample games are fine; do not put a friend's
      library in a public repository.
- [ ] `AI-USAGE.md`: the Game Detail entry still has `[DATE]` and
      `[fill in once you push]` in it. Fill those in, and make sure the file you
      list under "Written by me" really is yours. If an assistant wrote any part
      of a screen, say so in that entry.
- [ ] README: replace the template, add the screenshot at `docs/assets/screenshot.png`
      and the demo video link.

## The one rule

**Never commit a secret.** This repository is public and permanent, and deleting a
file does not remove it from the history. Keys, passwords and connection strings go
in `.env`, which is git-ignored, and in your host's dashboard. If you ever commit
one, rotate it first and clean up second.