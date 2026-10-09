# Shiori

A game tracker for people with a backlog longer than their free time: see every game you own, what you are playing, and where you left off.

**Live site:** https://yourusername.github.io/shiori/
**API:** https://your-api.onrender.com/healthz
**Demo video:** (link)

> **This deployment is running in demo mode.** The interface is real; the backend
> is simulated in your browser so the site works without a server. See
> [Demo mode](#demo-mode) below. Delete this quote once your API is live.

![A screenshot of the Library screen](docs/assets/screenshot.png)

## What it does

- Keep a library of games, each with a title, a platform and a status: backlog, playing, completed or dropped
- See the whole library as a grid of cards, each with a status badge and a short "where I left off" note
- Add a game from the Library screen and remove it again
- Loading, empty and error states on the Library screen, so a slow or failed request never leaves a blank page

Shiori is modelled on Tachiyomi, the manga reader: one library, one status per item, and one note so you can pick up where you stopped. It deliberately keeps a single "last played" note per game rather than a full session log.

**Not built yet:** the Game Detail screen (edit status and note, set last played). See [What I would do next](#what-i-would-do-next).

## Built with

React 18 and Vite on the front end, styled with Tailwind CSS v3 using the design tokens in `client/tailwind.config.js`. Express 4 and PostgreSQL (through `pg`) on the back end. The client is on GitHub Pages, the API on (host), the database on (host).

## Demo mode

This repository can run two ways, chosen by one environment variable at **build**
time.

**Demo mode is the default.** Only the exact string `false` turns it off, so a
forgotten or mistyped variable leaves you on the simulated backend with a visible
notice rather than on a silently broken build.

| `VITE_USE_MOCK_API` | What happens |
| --- | --- |
| unset, or `true` | The client answers its own requests from `localStorage` (key `final-project:games`), starting from six sample games. No server, no database, nothing shared between visitors. |
| `false` | The client calls the Express API at `VITE_API_BASE_URL`, which reads and writes real PostgreSQL. |

Both modes expose the same five functions (`listGames`, `getGame`, `createGame`, `updateGame`, `deleteGame`) from `client/src/api/index.js`, so no component knows which one it is talking to.

GitHub Pages serves files and cannot run Node, so the API and the database live elsewhere:

| Piece | Host |
| --- | --- |
| **Client** | GitHub Pages |
| **API** | (host) |
| **Database** | (host) |

## Running it yourself

**The client only, in demo mode.** No database needed, and no `.env` file either:
an unset `VITE_USE_MOCK_API` means demo mode.

    cd client
    npm install
    npm run dev                 # http://localhost:5173

**The whole stack.** Needs a PostgreSQL, either local or hosted.

    # 1. the database
    docker run --name shiori-pg -e POSTGRES_PASSWORD=devpassword \
      -e POSTGRES_DB=shiori -p 5432:5432 -d postgres:17

    # 2. the API
    cd server
    npm install
    cp .env.example .env        # check DATABASE_URL
    npm run db:reset            # creates the games table and adds sample rows
    npm run dev                 # http://localhost:3000

    # 3. the client, in another terminal
    cd client
    npm install
    echo "VITE_USE_MOCK_API=false" > .env
    npm run dev

`npm run db:reset` runs `seed.sql`, which begins with `TRUNCATE`. Run it only against a database you are happy to wipe.

Check the API on its own before you blame the client:

    curl http://localhost:3000/healthz     # is the process alive
    curl http://localhost:3000/readyz      # is the database reachable
    curl http://localhost:3000/api/games

### API

| Method | Path | What it does |
| --- | --- | --- |
| GET | `/api/games` | All games, sorted by title |
| GET | `/api/games/:id` | One game, or 404 |
| POST | `/api/games` | Create a game. Returns 201 |
| PUT | `/api/games/:id` | Replace a game. Send every field |
| DELETE | `/api/games/:id` | Remove a game. Returns 204 |

A game is `{ id, title, platform, status, last_note, last_played_at, created_at }`. The server validates on every write: `title` is required (120 characters at most), `platform` 60, `last_note` 500, and `status` must be `backlog`, `playing`, `completed` or `dropped`.

## Environment variables

None of these are committed. `.env.example` in `server/` and in the repository root lists them with
placeholder values.

| Name | Where | What it is |
| --- | --- | --- |
| `DATABASE_URL` | server | PostgreSQL connection string. Contains a password |
| `CORS_ORIGINS` | server | comma-separated origins allowed to call the API |
| `NODE_ENV` | server | `production` on your host |
| `PORT` | server | **set by the host**, do not set it yourself |
| `VITE_USE_MOCK_API` | client, at build time | only `false` turns demo mode off; unset means on |
| `VITE_API_BASE_URL` | client, at build time | your API's public URL, no trailing slash |

Every `VITE_` value is compiled into the built JavaScript and is **public**.
Never put a key, a password or a connection string in one.

## Deploying

**Client, to GitHub Pages.** Already wired up in
`.github/workflows/deploy-pages.yml`. Two one-time steps:

1. **Settings > Pages > Build and deployment > Source: GitHub Actions.** Without
   this the workflow goes green and publishes nothing.
2. Nothing else, until your API is live. When it is, add `VITE_USE_MOCK_API` = `false`
   and `VITE_API_BASE_URL` under **Settings > Secrets and variables > Actions >
   Variables**, then re-run the workflow.

The repository must be **public** for Pages to serve it on a free account.

**API and database.** Point your host at the `server/` folder, set the environment variables in its dashboard (with `CORS_ORIGINS` set to your Pages origin, for example `https://yourusername.github.io`), and run `server/db/schema.sql` once against the hosted database. Do not run `seed.sql` there.

## Project structure

    client/                React front end, built by Vite
      src/api/             ONE interface, two implementations, chosen by a variable
      src/components/      atoms (Button, StatusBadge), molecules (GameCard),
                           organisms (GameGrid, Header)
      src/pages/           LibraryPage
    server/                Express API
      gamesRepo.js         every SQL query, all parameterised
      db/                  pool, schema.sql, seed.sql, and a runner for them
    compose.yml            only if you self-host
    docs/                  planning documents and weekly reports

## Architecture

The React client calls one module, `src/api/index.js`, which hands back either the localStorage-backed mock or the HTTP client depending on `VITE_USE_MOCK_API`. In real mode the HTTP client calls the Express API, which validates each request, runs parameterised queries through `gamesRepo.js`, and talks to a single `games` table in PostgreSQL. The client is on GitHub Pages, the API on (host) and the database on (host).

## What I would do next

- Build the Game Detail screen so a game's status and "where I left off" note can be edited, with routing so each game has its own URL
- Tighten the API: reject ids that are not numbers with a 404 instead of a 500, validate `last_played_at`, and add `helmet`
- Add accounts so each person has their own library, with every query scoped to the signed-in user

## Author

(Your name, with a link.) (Course and section.)

## AI use

![Built with AI assistance](https://img.shields.io/badge/built%20with-AI%20assistance-0b5fff)

I used Claude while building this: for the planning documents, the Tailwind and component scaffolding, the mock and HTTP API layers, and the Library screen. (Add one line on what you wrote yourself and what you changed.) The full account, including where the AI got things wrong, is in [AI-USAGE.md](AI-USAGE.md).

## Licence

MIT, see [LICENSE](LICENSE). Put your own name in it.