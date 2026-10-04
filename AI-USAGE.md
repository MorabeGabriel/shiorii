# AI usage

This project was built with AI assistance. This file is the record of it.

## 1. How I used AI

### 2026-09-27 - Planning docs (proposal, wireframes, design system)

- **Tool:** Claude
- **What I asked for:** Help turning my idea (a Tachiyomi-style game tracker) into the three required planning worksheets.
- **What it gave back:** Drafts of the app proposal, wireframes/component tree, and a visual design system PDF with color tokens, type scale, and spacing.
- **What I kept, what I changed, and why:** Kept the structure, but I was the one who decided to simplify from a full session log to a single "last played" note — AI's first draft had the fuller session-log version, which I cut down myself.
- **Commit:** https://github.com/MorabeGabriel/shiorii/commit/569e8f7

### 2026-09-27 - Scaffolding the frontend

- **Tool:** Claude
- **What I asked for:** Set up Vite + React + Tailwind inside the template's client/ folder, matching my design system tokens.
- **What it gave back:** tailwind.config.js with my color/spacing/type tokens, and a basic component structure (atoms/molecules/organisms).
- **What I kept, what I changed, and why:** Kept the token values as-is since they matched my design doc exactly. Had to pin Tailwind to v3 myself after v4 broke the config format.
- **Commit:** https://github.com/MorabeGabriel/shiorii/commit/ed46122

### 2026-09-27 - Adapting the template's mock API to games

- **Tool:** Claude
- **What I asked for:** The template ships with a generic "sightings" mock/real API pattern — I asked for it adapted to a games entity instead.
- **What it gave back:** mockApi.js, httpApi.js, index.js, and seed.json rewritten for games (listGames, getGame, createGame, updateGame, deleteGame), keeping the same mock/real-swap pattern.
- **What I kept, what I changed, and why:** Kept the pattern and function names as-is since the template's convention was solid. This is the part I understand best from the AI-written code — see Section 3.
- **Commit:** https://github.com/MorabeGabriel/shiorii/commit/ed46122

### 2026-09-27 - Library screen with working create/delete

- **Tool:** Claude
- **What I asked for:** A working Library screen wired to the games API — real fetch, loading state, an add-game form, delete.
- **What it gave back:** LibraryPage.jsx with the four-state pattern (loading/ready/error), optimistic delete, and a create form.
- **What I kept, what I changed, and why:** Kept it mostly as given, tested it myself in the browser (added and removed games) before committing.
- **Commit:** https://github.com/MorabeGabriel/shiorii/commit/ed46122

### 2026-09-27 - Presentation materials

- **Tool:** Claude
- **What I asked for:** A video script covering demo + code walkthrough, and slides covering problem/demo/tech/challenges/next-steps.
- **What it gave back:** A timed script and a slide outline.
- **What I kept, what I changed, and why:** Used the script as a guide while recording in my own voice, not read verbatim.
- **Commit:** (presentation assets, not part of the code repo)

### [DATE] - Game Detail screen

- **Tool:** Claude
- **What I asked for:** An explanation of how to build a fetch-on-load + save pattern in React, not finished code.
- **What it gave back:** A breakdown of the four pieces needed (state, useEffect fetch, save handler, JSX) with the reasoning for each, which I then wrote myself.
- **What I kept, what I changed, and why:** This is my own code — see Section 3.
- **Commit:** [fill in once you push]

## 2. Where the AI got it wrong

### Case 1 - Tailwind version mismatch

- **What it gave me:** Initial setup assumed Tailwind v4's default install.
- **What was wrong with it:** v4 doesn't use tailwind.config.js the way the course material and my design system doc expected — it moved to a CSS-based config, so my color/spacing tokens had nowhere to go.
- **What I did instead:** Had it pin the install to Tailwind v3 specifically, which matches the config file approach I'd already planned.
- **Commit:** https://github.com/MorabeGabriel/shiorii/commit/ed46122

### Case 2 - Body background not applying

- **What it gave me:** A tailwind.css file with bg-bg applied to the component tree, but the page background stayed white.
- **What was wrong with it:** Vite's default index.css was overriding it — the AI's first fix didn't account for that conflict.
- **What I did instead:** Had it add an explicit `body { @apply bg-bg text-text; }` rule in tailwind.css, which fixed it after I pointed out the screenshot still showed a white background.
- **Commit:** https://github.com/MorabeGabriel/shiorii/commit/ed46122

### Case 3 - Assumed I had a repo set up that I didn't

- **What it gave me:** Early in the finals project, it proceeded as if a project repo already existed.
- **What was wrong with it:** I hadn't actually created it yet — the assumption nearly led to a report describing setup that wasn't real.
- **What I did instead:** Stopped and confirmed actual status before writing anything, and we rebuilt the report to reflect what was really done vs. still pending.
- **Commit:** (process fix, not a code commit)

## 3. Who wrote what

### Written by me

- **File:** client/src/pages/GameDetailPage.jsx
- **Commit:** [fill in once you push]
- **What it does and why it is built this way:** [write this yourself once it's done — explain the fetch-on-load pattern, the status dropdown, the note textarea, and why updateGame is called on save]

### The AI-written part I understand best

- **File:** client/src/api/index.js and mockApi.js
- **Commit:** https://github.com/MorabeGabriel/shiorii/commit/ed46122
- **What it does and why we kept it:** index.js picks between the mock (localStorage-backed) and real HTTP implementations based on one environment variable, VITE_USE_MOCK_API, so every component just imports from api/index.js and never knows which one it's actually talking to. I understand this well enough to explain it because it's the same pattern I'll need when I wire up the real Express backend later — I just change the env var, not any component code.
