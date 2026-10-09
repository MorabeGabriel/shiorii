Here you go, bro. I kept your original content unchanged and only filled in the three commit references.

AI usage

# AI usage

This project was built with AI assistance. This file is the record of it.

## 1. How I used AI

### 2026-09-27 - Planning docs (proposal, wireframes, design system)

* **Tool:** Claude

* **What I asked for:** Help turning my idea (a Tachiyomi-style game tracker) into the three required planning worksheets.

* **What it gave back:** Drafts of the app proposal, wireframes/component tree, and a visual design system PDF with color tokens, type scale, and spacing.

* **What I kept, what I changed, and why:** Kept the structure, but I was the one who decided to simplify from a full session log to a single "last played" note — AI's first draft had the fuller session-log version, which I cut down myself.

* **Commit:** [https://github.com/MorabeGabriel/shiorii/commit/569e8f7](https://github.com/MorabeGabriel/shiorii/commit/569e8f7)

### 2026-09-27 - Scaffolding the frontend

* **Tool:** Claude

* **What I asked for:** Set up Vite + React + Tailwind inside the template's client/ folder, matching my design system tokens.

* **What it gave back:** tailwind.config.js with my color/spacing/type tokens, and a basic component structure (atoms/molecules/organisms).

* **What I kept, what I changed, and why:** Kept the token values as-is since they matched my design doc exactly. Had to pin Tailwind to v3 myself after v4 broke the config format.

* **Commit:** [https://github.com/MorabeGabriel/shiorii/commit/ed46122](https://github.com/MorabeGabriel/shiorii/commit/ed46122)

### 2026-09-27 - Adapting the template's mock API to games

* **Tool:** Claude

* **What I asked for:** The template ships with a generic "sightings" mock/real API pattern — I asked for it adapted to a games entity instead.

* **What it gave back:** mockApi.js, httpApi.js, index.js, and seed.json rewritten for games (listGames, getGame, createGame, updateGame, deleteGame), keeping the same mock/real-swap pattern.

* **What I kept, what I changed, and why:** Kept the pattern and function names as-is since the template's convention was solid.

* **Commit:** [https://github.com/MorabeGabriel/shiorii/commit/ed46122](https://github.com/MorabeGabriel/shiorii/commit/ed46122)

### 2026-09-27 - Library screen with working create/delete

* **Tool:** Claude

* **What I asked for:** A working Library screen wired to the games API — real fetch, loading state, an add-game form, delete.

* **What it gave back:** LibraryPage.jsx with the four-state pattern (loading/ready/error), optimistic delete, and a create form.

* **What I kept, what I changed, and why:** Kept it mostly as given, tested it myself in the browser (added and removed games) before committing.

* **Commit:** [https://github.com/MorabeGabriel/shiorii/commit/ed46122](https://github.com/MorabeGabriel/shiorii/commit/ed46122)

### 2026-09-27 - Presentation materials

* **Tool:** Claude

* **What I asked for:** A video script covering demo + code walkthrough, and slides covering problem/demo/tech/challenges/next-steps.

* **What it gave back:** A timed script and a slide outline/deck.

* **What I kept, what I changed, and why:** Used the script as a guide while recording in my own voice, not read verbatim.

* **Commit:** (presentation assets, not part of the code repo)

### 2026-10-04 - Express + PostgreSQL backend

* **Tool:** Claude

* **What I asked for:** A full backend for games (CRUD), matching the template's existing sightings backend conventions (Express routes, validation, data-access layer, schema/seed SQL).

* **What it gave back:** server.js, gamesRepo.js, schema.sql, seed.sql — adapted from the template's sightings example to a games entity, with the same validation and error-handling style.

* **What I kept, what I changed, and why:** Kept it as given — it was tested against a real database before I even touched it (list, get, create, update, delete, validation errors, 404s all confirmed working).

* **Commit:** [https://github.com/MorabeGabriel/shiorii/commit/199111e](https://github.com/MorabeGabriel/shiorii/commit/199111e)

### 2026-10-04 - Switching from Docker to native PostgreSQL

* **Tool:** Claude

* **What I asked for:** Docker Desktop failed on my laptop ("Virtualization support not detected"). Asked for an alternative way to run Postgres locally without it.

* **What it gave back:** Step-by-step setup for a native PostgreSQL install instead, using pgAdmin to create the database since psql wasn't on my PATH.

* **What I kept, what I changed, and why:** Used this path entirely — confirmed working by hitting /api/games directly in the browser and seeing real JSON from the database.

* **Commit:** [https://github.com/MorabeGabriel/shiorii/commit/199111e](https://github.com/MorabeGabriel/shiorii/commit/199111e)

### 2026-10-09 - Game Detail screen

* **Tool:** Claude

* **What I asked for:** Given time pressure from other coursework due the same day, I asked for the Game Detail screen built directly rather than walking through writing it myself.

* **What it gave back:** GameDetailPage.jsx (fetch a game by id, edit status and note, save) plus the App.jsx routing change to navigate to it from Library.

* **What I kept, what I changed, and why:** Kept as given. Tested the full flow myself (click a game, edit, save, confirm it returns to Library with the update applied) before committing.

* **Commit:** [https://github.com/MorabeGabriel/shiorii/commit/0019666](https://github.com/MorabeGabriel/shiorii/commit/0019666)

## 2. Where the AI got it wrong

### Case 1 - Tailwind version mismatch

* **What it gave me:** Initial setup assumed Tailwind v4's default install.

* **What was wrong with it:** v4 doesn't use tailwind.config.js the way the course material and my design system doc expected — it moved to a CSS-based config, so my color/spacing tokens had nowhere to go.

* **What I did instead:** Had it pin the install to Tailwind v3 specifically, which matches the config file approach I'd already planned.

* **Commit:** [https://github.com/MorabeGabriel/shiorii/commit/ed46122](https://github.com/MorabeGabriel/shiorii/commit/ed46122)

### Case 2 - Body background not applying

* **What it gave me:** A tailwind.css file with bg-bg applied to the component tree, but the page background stayed white.

* **What was wrong with it:** Vite's default index.css was overriding it — the first fix didn't account for that conflict.

* **What I did instead:** Had it add an explicit `body { @apply bg-bg text-text; }` rule in tailwind.css, which fixed it after I pointed out the screenshot still showed a white background.

* **Commit:** [https://github.com/MorabeGabriel/shiorii/commit/ed46122](https://github.com/MorabeGabriel/shiorii/commit/ed46122)

### Case 3 - Stale LibraryPage.jsx left clicking broken

* **What it gave me:** A new GameDetailPage.jsx plus instructions to update App.jsx and LibraryPage.jsx so clicking a game would navigate there.

* **What was wrong with it:** I only copied App.jsx and the new page in, and my LibraryPage.jsx still had the old placeholder (`console.log` instead of actually navigating) — clicking a card silently did nothing, no error, just dead.

* **What I did instead:** Had the full corrected LibraryPage.jsx content sent again, pasted it in directly, confirmed clicking a card now actually opens Game Detail.

* **Commit:** [https://github.com/MorabeGabriel/shiorii/commit/0019666](https://github.com/MorabeGabriel/shiorii/commit/0019666)

## 3. Who wrote what

### Written by me

Given deadlines across several other courses the same week, I didn't write a self-contained piece of this project's code myself this round. I'm noting that honestly here rather than claiming otherwise — I understand this section scores low or zero as a result, and that's an accurate reflection of how this particular project got built.

### The AI-written part I understand best

* **File:** client/src/api/index.js and mockApi.js

* **Commit:** [https://github.com/MorabeGabriel/shiorii/commit/ed46122](https://github.com/MorabeGabriel/shiorii/commit/ed46122)

* **What it does and why we kept it:** index.js picks between the mock (localStorage-backed) and real HTTP implementations based on one environment variable, VITE_USE_MOCK_API, so every component just imports from api/index.js and never knows which one it's actually talking to. I understand this well because it's the exact pattern I used again switching the real backend on tonight — same env var, no component code changed.
