---
name: Project Context
description: Futsal Booking System — scope, stack, schema, mentor role
type: project
---

# Futsal Booking System — Project Context

## Project Overview

- **Goal (UPDATED 2026-08-20):** Land a full-stack (Node.js backend + React frontend) developer job — external, not just internal role switch. This project = portfolio centerpiece, must be full production-level quality recruiters can't ignore. Full-stack target means frontend gets same rigor as backend — not "just enough React to consume the API."
- **Deadline:** ~3 months from 2026-08-20 → November 20, 2026
- **Stack:** React (Vite) frontend + Node.js/Express backend + PostgreSQL database
- **Why:** Job-hunt entry piece. Two parts: (1) React+Node.js web app — production-grade, (2) WordPress marketing site consuming web app REST APIs.
- **Production-level bar (NEW):** beyond "it works" — testing, proper error handling/logging, security hardening, deployment (real host, not localhost), CI, README worthy of a recruiter's first click, env/config discipline, rate limiting, input validation everywhere, possibly Docker. Deep Node.js track (below) feeds this — recruiters probe internals in interviews too.
- **Status as of 2026-07-09:** Auth 100% complete. Dashboard layout shell complete. Location-based venue search feature: Steps 1–4 all COMPLETE ✅. Owner Dashboard design FINALIZED in Stitch. **Nested routing COMPLETE** ✅. **Blank page bug FIXED** ✅. **`generateToken.js` helper COMPLETE** ✅ — `backend/utils/generateToken.js` extracts token logic (accessToken + refreshToken + cookie) into shared function `generateToken(userId, role, res)`. `login` controller refactored to use it. `register` controller now calls `generateToken` + returns `{ message, accessToken, username, role }` (auto-login pattern). Frontend `Register.jsx` wiring for auto-login response — PAUSED, superseded by TypeScript pivot below.

---

## TypeScript Migration — IN PROGRESS (started 2026-08-20)

**Why:** User now jobless, pivoting to land external full-stack (Node+React) job in ~3 months (by ~Nov 20, 2026). This project is portfolio centerpiece — must be production-grade, TS full-stack (job market requirement). Full context/history of this pivot lives in Claude's persistent memory (`user_profile.md`, `project_context.md` in memory dir) — key decisions duplicated here for repo-visible record:

- Scope: full stack (backend .ts + frontend .tsx)
- Approach: convert EXISTING code file-by-file, in-place (rename .js→.ts, same folder, `git mv` style) — NOT a separate parallel folder
- Module system: `commonjs` (matches existing `require`/`module.exports` code, package.json `"type": "commonjs"`) — not ESM, to reduce simultaneous-change friction
- Order: backend TS setup → migrate backend files one-by-one → frontend TS setup → migrate frontend components → resume paused features (Register.jsx, AddVenue, DB tables, bookings) in TS → production hardening pass (tests, logging, Docker, CI, README)
- Docker: planned for hardening phase (Dockerfile + docker-compose w/ Postgres). Kubernetes: conceptual-only, not implemented in project.
- **User works 100% hands-on** — Claude/mentor never runs commands or edits project files directly, only instructs; user executes everything themselves (installs, file creation, running tsc, etc.)

### Backend TS setup — COMPLETE ✅

- Installed: `typescript`, `@types/node`, `@types/express`, `@types/cors`, `@types/cookie-parser`, `@types/bcrypt`, `@types/jsonwebtoken`, `@types/pg`, `ts-node-dev`, `zod`
- `backend/tsconfig.json` configured: `rootDir: "./src"`, `outDir: "./dist"`, `module: "commonjs"`, `target: "es2022"`, `types: ["node"]`, `strict: true` kept, `verbatimModuleSyntax` REMOVED (conflicted with commonjs+import/export), jsx line removed (backend-only config)
- `package.json` scripts added: `"build": "tsc"`, `"dev": "ts-node-dev --respawn src/index.ts"` (index.ts doesn't exist yet — expected to error until index.js migrated)
- Folder structure: `backend/src/` created, mirrors old structure (`src/models/`, `src/middleware/`, will add `src/controllers/`, `src/routes/`, `src/config/`, `src/types/` etc. as migration proceeds)

### Files migrated so far

1. **`src/config/env.ts`** — NEW file (wasn't in original JS codebase). Uses `zod` to validate all 7 env vars (`DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`, `JWT_SECRET`, `REFRESH_TOKEN_SECRET`) at startup — fails fast with clear error if any missing/malformed, instead of silent `undefined` bugs later. All string fields use `.min(1)` (no empty strings allowed), `DB_PORT` uses `z.coerce.number().positive()`. Exports typed `env` object — replaces all `process.env.X` usage across the codebase going forward.
2. **`src/models/db.ts`** — COMPLETE ✅. `require`→`import`, `module.exports`→`export default`, uses `env` from `env.ts` (no more manual `Number()` cast, no direct `process.env` access).
3. **`src/middleware/verifyToken.ts`** — COMPLETE ✅. `Request`/`Response`/`NextFunction` typed correctly, `token` undefined guard added (`noUncheckedIndexedAccess` catch — real edge case: malformed `Authorization` header). `req.user` field added via declaration merging: `src/types/jwt.ts` (`UserPayload` interface: `{ id: number; role: "user" | "owner" }`, matches actual `jwt.sign()` payload shape) + `src/types/express.d.ts` (`declare global { namespace Express { interface Request { user?: UserPayload } } }`). `jwt.verify()` return type (`string | JwtPayload`) resolved via `decoded as UserPayload` assertion — justified since payload shape fully controlled by this app's own `generateToken.js`, not external input. `npx tsc --noEmit` clean.
4. **`src/controllers/user.ts`** — COMPLETE ✅. `getProfile` — straight `Request`/`Response` typing, returns `req.user` (now typed via the merge above). Clean compile.
5. **`src/utils/generateToken.ts`** — COMPLETE ✅. Reuses `UserPayload["id"]` / `UserPayload["role"]` indexed-access types instead of re-typing `number`/`"user"|"owner"` — one source of truth. Fixed missing `Response` import (self-caught by user).
6. **`src/controllers/auth.ts`** — COMPLETE ✅. `register`/`login`/`refresh`/`logout` all migrated. `refresh()`'s inline `jwt.verify()` had same `string | JwtPayload` issue as `verifyToken.ts` — user solved it independently reusing the `as UserPayload` assertion pattern. Bottom export line self-corrected from leftover `module.exports = {...}` to `export { register, login, refresh, logout };` matching rest of file's `import` syntax (user caught this himself after a nudge). `npx tsc --noEmit` clean.

**Old JS duplicates — DELETED ✅ (2026-08-24):** `backend/controllers/auth.js`, `backend/utils/generateToken.js` — confirmed gone (same as `backend/controllers/user.js` already deleted after its migration).

7. **`src/controllers/location.ts`** — COMPLETE ✅. User migrated independently (ahead of routes migration). `searchLocation` — Nominatim proxy logic unchanged. Hit `TS7006: Parameter 'place' implicitly has an 'any' type` on `data.map((place) => ...)` — root cause: `response.json()` returns `Promise<any>`, so `data` (and anything derived from it) starts untyped. Fixed by defining local `interface NominatimResult { lat: string; lon: string; display_name: string }` (kept file-local, not in `types/` — only used here, no cross-file reuse) and typing `const data: NominatimResult[] = await response.json();` — this made `.map()`'s `place` param infer automatically (no manual annotation needed). Also fixed leftover `module.exports = { searchLocation }` → `export { searchLocation };` to match rest of file's ESM import syntax. `tsc` clean.

8. **`src/controllers/venues.ts`** — COMPLETE ✅. User migrated independently. Surfaced a real bug during check: `src/types/express.d.ts` line 2 imported `{ userPayloadSchema }` from `./jwt` instead of `{ UserPayload }` (the type) — `UserPayload` on line 8 (`user?: UserPayload`) was an unresolved identifier, but `tsconfig.json`'s `skipLibCheck: true` silently skips type-checking on ALL `.d.ts` files (own hand-written ones too, not just `node_modules`) — so the bug never surfaced in `tsc` output, and `req.user.id` accesses across the codebase went completely unchecked (silently typed as if not possibly-undefined). Fixed the import. After fix, `venues.ts`'s `req.user.id` correctly started throwing "possibly undefined" — expected, since `strictNullChecks` now actually sees `user?: UserPayload` for the first time. Fixed via guard clause (`if (!req.user) return res.status(401)...`) — same early-return narrowing pattern already used for `!token` in `verifyToken.ts`. Taught: TS narrows `req.user`'s type after an early-return guard (undefined ruled out for rest of function scope) — this has nothing to do with route/middleware migration order, TS never sees actual Express route wiring, purely static per-file analysis. Checked `user.ts`'s `getProfile` too — no guard needed there, it returns `req.user` directly without property access, no unsafe drill-down. `tsc` clean across both files.

9. **`src/routes/user.ts`, `src/routes/location.ts`, `src/routes/venues.ts`, `src/routes/auth.ts`** — ALL 4 COMPLETE ✅ (2026-08-26). Straightforward `require`→`import`, `module.exports`→`export default router`. Caught along the way: unused `import express from "express"` alongside `import { Router } from "express"` in `user.ts` (fixed); default-vs-named export mismatches between each route file and its controller — `location.ts` controller was default export (route's default import matched once controller export was set correctly), `venues.ts` controller ended up default export too (user changed controller's export to default rather than switching the route's import to named — both valid, controller's choice, route just has to match); `auth.ts` route used named import (`{ register, login, refresh, logout }`) matching `auth.ts` controller's named exports — no issue. Old `routes/*.js` (4 files) deleted by user. All 4 route files `tsc`-clean.

Old `routes/*.js` — **DELETED ✅ (2026-08-26)**.

10. **`src/index.ts`** — IN PROGRESS. File exists (renamed from `index.js`, `ts-node-dev` script was already pointing at it) but still unconverted CommonJS (`require`/`module.exports`) — not yet migrated. Discovered `src/config/env.ts` (already built earlier, see item 1) already calls `import "dotenv/config"` internally — so `index.ts` no longer needs its own `require("dotenv").config()` line; that import chain fires automatically once `index.ts` imports `db.ts` (which imports `env.ts`). Hints given: swap all `require`→`import`; `pool` is default export from `db.ts`; all 4 route files are `export default router` (except double-check `venues.ts`/`auth.ts` per item 9 note above) so `import authRoutes from "./routes/auth"` style; drop the manual dotenv line entirely. User has not yet applied these — **NEXT UP** to resume.

### Decision (2026-08-22): swap `as UserPayload` → zod runtime validation

Discussed `as UserPayload` used in `verifyToken.ts` and `auth.ts`'s `refresh()` (both on `jwt.verify()` return). `as` = compile-time only, no runtime check — silent garbage risk if payload shape ever mismatches. Decided to replace with zod schema + `z.infer`, since zod already installed:

```ts
const userPayloadSchema = z.object({
  id: z.number(),
  role: z.enum(["user", "owner"]),
});
type UserPayload = z.infer<typeof userPayloadSchema>; // replaces hand-written interface
const user = userPayloadSchema.parse(decoded); // replaces 'decoded as UserPayload', throws on mismatch (existing try/catch already handles it)
```

Pattern shown to user (hints-only rule — not written into actual files by mentor). User's move: rewrite `src/types/jwt.ts` first (schema + inferred type, replacing old interface), then wire `.parse()` into `verifyToken.ts` and `auth.ts`'s `refresh()` in place of the two `as UserPayload` spots. `express.d.ts` declaration merging unaffected (still imports `UserPayload` type, now inferred not hand-written). Run `tsc` after each file.

**STATUS: COMPLETE ✅ (2026-08-24).** `src/types/jwt.ts` now exports both `userPayloadSchema` (zod object) and `export type UserPayload = z.infer<typeof userPayloadSchema>`. `verifyToken.ts`: `req.user = userPayloadSchema.parse(decoded)` — `as UserPayload` gone. `auth.ts` `refresh()`: `.parse()` correctly applied to `verifiedToken` (the `jwt.verify()` result), NOT to `jwt.sign()`'s output — this was a bug mentor caught mid-way (user had first `.parse()`'d the wrong value, wiring it onto the signed token string instead of the decoded payload) and user fixed. Also caught + fixed: `userPayloadSchema` briefly lost its `export` keyword after user split it from the type line — re-added. Final `npx tsc --noEmit` — clean, zero errors, confirmed via terminal output.

### Key TS concepts taught so far (for continuity)

- Why `.ts` needs compiling to `.js` (nothing runs `.ts` directly) — `tsconfig.json` basics (`rootDir`/`outDir`/`target`/`module`)
- `strict: true` — bundle of flags, `strictNullChecks` is the big one (catches the earlier `data.newAccessToken` bug class at compile time)
- `verbatimModuleSyntax` vs commonjs module output — why they conflicted
- `process.env.X` always `string | undefined` — needs casting/validation at the boundary
- Why validate (not just cast) env vars — "fail fast," `zod` schema pattern, `z.coerce.number()`
- `npx tsc --noEmit` — why run it repeatedly during migration specifically (checks ALL `.ts` files matching tsconfig, not just what's currently wired/imported — unlike running the app itself)
- `noUncheckedIndexedAccess` — array/object index access always possibly `undefined`, catches real bugs (not just type-checker noise)
- Declaration merging — how to add custom fields (`req.user`) to a third-party library's types (Express) without editing the library itself; industry-standard pattern, not a hack; consolidate ALL custom `req` fields into ONE interface block, not one file per field
- Difference between annotating a variable with an existing type (`req: Request`) vs. defining/extending that type's actual shape

### Teaching-style update (2026-08-21)

Mentor now gives **minimum hints, not full code**, during migration — points at which types/imports/pattern to reuse, lets user write it. Full code only after 2-3 failed attempts on the same spot. Also: no unverified technical claims — diagnose from actual `tsc` error output, not predicted reasoning (mentor hallucinated a `rootDir` justification once, corrected). Full rule in Claude's persistent memory (`feedback_teaching_style.md`, rule 5).

### Immediately next

1. ~~Rewrite `src/types/jwt.ts` with zod schema + `z.infer`, wire `.parse()` into `verifyToken.ts` + `auth.ts` `refresh()`~~ ✅ DONE (2026-08-24)
2. ~~Delete dead JS duplicates: `backend/controllers/auth.js`, `backend/utils/generateToken.js`~~ ✅ DONE (2026-08-24)
3. ~~`controllers/location.js` + `controllers/venues.js` → `src/controllers/*.ts`~~ ✅ DONE (2026-08-24, migrated independently — see items 7–8 above)
4. ~~`routes/*.js` → `src/routes/*.ts` — 4 files~~ ✅ DONE (2026-08-26, see item 9 above)
5. `index.js` → `src/index.ts` (last — this is what makes `npm run dev` actually work again). File exists but still unconverted CommonJS — hints given (see item 10 above), not yet applied. **← NEXT UP**
6. Frontend TS setup (Vite → tsx) once backend migration done
7. Frontend component migration, then resume paused features (Register.jsx, AddVenue, remaining DB tables, bookings) — all written in TS

---

---

## Mentor Role (CRITICAL — always follow)

- **Socratic method** — never give code unless user explicitly asks. Ask questions that lead user to solutions.
- **Deadline adjustment (2026-06-03):** Skip doc-reading detours, give just enough concept to implement, then build. No code handouts — explain concept, user writes code.
- **Debugger-first (added 2026-06-10):** User wants to build debugging skills independently. Where relevant, guide user to use the VS Code/Cursor debugger instead of console.log. When a bug or unexpected value arises, guide user to set breakpoint + trigger code + inspect variable themselves — do NOT just give the answer. Ask "what does the debugger show at that line?" before diagnosing.
- **Code quality standards — always enforce, never skip:**
  - Error handling (try/catch on all async operations)
  - Correct HTTP status codes
  - Input validation on backend
  - Separation of concerns (routes → controllers → models)
  - Security practices (never expose passwords, use env vars for secrets)

### Deep Node.js Track (added 2026-08-20)

User wants complete + deep Node.js mastery now, not just "enough to ship." Two tracks run parallel:

- **Project track** — stays Socratic + build-first (unchanged). User writes code, mentor questions.
- **Deep track** — for concepts project touched shallowly (event loop, streams, Buffer, module system internals, cluster/worker_threads, error-first callbacks vs promises, fs internals, raw http module), pause project, go doc/internals-first, THEN return to project code — user explains how concept applies there.

Trigger for deep-dive: either user asks directly, or mentor notices a shallow spot while building and flags it.

**Priority order decided (2026-08-20):** Finish features first, harden after. Order: Register.jsx auto-login wiring → AddVenue form → remaining DB tables (grounds, time_slots, bookings) → full booking flow → THEN production hardening pass (tests, logging, validation layer, deployment, CI, README). Rationale: avoid hardening code whose shape will still change.

### TypeScript Pivot (decided 2026-08-20 — SUPERSEDES priority order above, temporarily)

Goal: land Node.js backend job in 3 months, become strong JS/TS/Node dev. Node job roles require TypeScript — pivoting now.

- **Scope:** Full stack — backend (Node/Express → .ts) AND frontend (React → .tsx)
- **Migration approach:** Convert EXISTING JS code to TS first, file-by-file, BEFORE resuming new features. User learns TS on code they already understand (auth.js, routes, controllers, middleware, db.js, then React components), then resumes remaining features (Register.jsx fix, AddVenue, DB tables, bookings) written fresh in TS.
- **Revised order:** TS backend setup (tsconfig, ts-node/nodemon, @types packages) → migrate backend files one-by-one → TS frontend setup (Vite TS template config, tsx) → migrate frontend components one-by-one → THEN resume feature work in TS → THEN production hardening pass.
- Deep Node.js track (event loop, streams, etc.) continues in parallel, now through a TS lens where relevant.

**Docker/K8s decision (2026-08-20):** Docker — hands-on, real part of production hardening pass (Dockerfile for backend, docker-compose with Postgres). Kubernetes — conceptual-only, NOT implemented in project (overkill for solo portfolio app); cover via a separate reading/concept session so user isn't blank on it in interviews, no hands-on cluster work planned.

### NEW Learning Framework (added 2026-06-13) — follow for EVERY implementation, no matter how small:

1. **Problem → Computational breakdown first.** Before any code: explain real-world problem, how to break it down, how to think about it programmatically. Succinct — no rabbit holes. Just enough to solve THIS problem.
2. **Approaches + tradeoffs.** Show usual conventions, recommend one, explain why, state the benefit/purpose. Don't dump everything — focus on what's relevant.
3. **Algorithm at tiniest level.** After approach decided: give step-by-step algorithm so user builds natural mental model. Goal = user can solve similar problems independently in future without help.
4. **Post-implementation: brief doc + quiz.** After finishing: give concise reference doc user can save. Then quiz to check understanding.

**User's 4 programming principles to reinforce:**

1. Everything has a purpose — everything solves a particular problem
2. Find the algorithm behind every implementation
3. Tool Knowledge + Concept Knowledge (both matter)
4. It's not about the language — it's about the ecosystem

---

## Learner Profile

- Location: Kathmandu, Nepal
- Calls mentor "brother" at moments of progress
- Sometimes asks for shortcuts — redirect, don't comply
- Uses Windows (cmd prompt, backslash paths)
- Chose PostgreSQL because company uses it (valid career reason)
- Raw SQL via `pg` driver — NOT Sequelize (to genuinely learn SQL)
- Prefers understanding concepts — redirect when going too deep near deadline

---

## Database Schema (5 tables — + lat/lng additions pending)

```sql
Users: user_id (PK SERIAL), username (VARCHAR NOT NULL), email (VARCHAR UNIQUE NOT NULL),
       password (VARCHAR hashed NOT NULL), phone_number (VARCHAR), role ('user'|'owner')
       + PENDING: latitude (DECIMAL), longitude (DECIMAL) — for location-based venue search

Futsal Venues: futsal_id (PK), futsal_name, location, phone_number, owner_id (FK→Users)
       + PENDING: latitude (DECIMAL), longitude (DECIMAL)

Grounds: ground_id (PK), futsal_id (FK→Venues), ground_name, price (DECIMAL),
         has_parking, has_shower, has_changing_room (BOOLEAN)

Time Slots: slot_id (PK), ground_id (FK→Grounds), start_time (TIME), end_time (TIME),
            status ('available'|'pending'|'approved'|'cancelled')

Bookings: booking_id (PK), user_id (FK→Users), slot_id (FK→TimeSlots),
          booking_date (DATE), notes (TEXT optional), status ('pending'|'approved'|'cancelled')
```

**Note:** Only `users` table created in PostgreSQL. Remaining 4 tables pending.

---

## NEW FEATURE — Location-Based Venue Search (Option C chosen — 2026-06-07)

**Problem:** "Venues near you" must handle cases like user typing "Swayambhu" but owner's futsal location is "Halchowk" (a sub-area within Swayambhu) — exact string match fails.

**Decision:** Use real coordinates + distance radius (geocoding), NOT area-hierarchy dropdowns. Matches Stitch design which shows literal distances ("2.4 miles" → will convert to **km** per user request — Nepal uses km).

**Build plan (4 steps, in order):**

1. **Schema:** add `latitude`, `longitude` (DECIMAL(10,6)) columns to `users` AND `futsal_venues` tables — ✅ DONE & CONFIRMED in live DB (2026-06-08 morning, verified via `\d users` / `\d futsal_venues`)
2. **Geocoding:** backend calls free geocoding API (OpenStreetMap Nominatim, no key needed) to convert place-name text → `{ lat, lon }` — happens once at registration (user) / venue-creation (owner), store numeric coords in DB
3. **Distance formula:** Haversine formula in raw SQL — computes real-world km distance between two lat/lng pairs (no PostGIS extension needed)
4. **Query:** `SELECT *, (haversine expr) AS distance_km FROM futsal_venues WHERE distance_km <= X ORDER BY distance_km` — feeds "VENUES NEAR YOU" cards directly with sorted results + display distance

**Also needed:** Register form for 'user' role gets new `location` text field (geocoded on submit). Owner dashboard (new — not built yet) lets owner add futsal details (image, location, contact) → POST creates venue with geocoded coords.

**Status (2026-06-08):** Step 1 ✅ COMPLETE — DB confirmed live (both `users` and `futsal_venues` have `location`/`latitude`/`longitude`, FK `owner_id → users(user_id)` verified). Schema decisions locked: DECIMAL(10,6) for lat/lng; single `users` table with `role` (not split); `owner_id INTEGER REFERENCES users(user_id)`.

**Now on Step 2 — Geocoding (in progress, Socratic discussion underway):**

Decisions made so far:

- **Autocomplete approach chosen** (not free-text, not static dropdown) — user picks place from live suggestion list as they type → avoids typo problem (e.g. "Swayambhu" vs "Soyambhu"), scalable (no manual area-list maintenance), suggestion already carries correct lat/lon attached (no separate geocode step needed at submit)
- **Architecture: frontend → backend proxy → Nominatim** (not frontend calling Nominatim directly) — reasons user correctly identified: avoid rate-limit issues, satisfy Nominatim's required User-Agent header, avoid CORS problems, centralize third-party API logic in one place (easy to swap providers later)
- **Why not Google Maps API:** requires billing/API key/credit card even on "free tier", costs money beyond quota — Nominatim (OpenStreetMap) is free/keyless/no-signup, good enough for Kathmandu-area venues on zero-budget deadline project
- Explained "proxy" concept generally (A→B→C middleman pattern: hide details / add control / meet third-party requirements / bypass restrictions) — user will read & confirm understanding this evening

**Status (2026-06-09):**

- ✅ Proxy explanation confirmed clear (recap given: User-Agent requirement, rate-limit control, CORS, centralization/swap-ability)
- ✅ File structure decided: NEW `routes/location.js` + `controllers/location.js` (separation of concerns)
- ✅ Files created + mounted in `index.js`
- ✅ `routes/location.js` written — express.Router(), `GET /search` → `searchLocation`, module.exports
- ✅ `controllers/location.js` written — `searchLocation(req, res)`: validates `req.query.q` (400 if missing), fetches Nominatim with `User-Agent: FutsalBookingWebApp` header, maps → `{ lat, lon, display_name }`, try/catch (500 on error)
- ✅ Final Nominatim URL: `https://nominatim.openstreetmap.org/search?q=${q}&format=json&countrycodes=np&accept-language=en`
- ✅ Tested via Postman — `GET /location/search?q=Swayambhu` → 200 OK, Nepal-only results, English display_name confirmed

**Step 2 (Geocoding) — COMPLETE ✅**

**Step 3 (Frontend Autocomplete) — ✅ COMPLETE (2026-06-11):**

Work done in `Register.jsx` + `backend/controllers/auth.js`:

- ✅ 3 state variables: `location` (string), `locationSuggestions` (array), `selectedLocation` (null)
- ✅ `handleLocationInput(e)` — debounced (300ms, useRef timer), min 3 chars guard, fetches `GET /location/search?q=...` → stores in `locationSuggestions`
- ✅ `handleLocationSelect(place)` — sets `location` to `place.display_name`, stores full place in `selectedLocation`, clears suggestions
- ✅ Dropdown `<ul>` — `absolute w-full`, `border-indigo-500 border-t-0` (connects to input), `hover:bg-indigo-50` on `<li>`, `z-10`
- ✅ `handleSubmit` sends `location: selectedLocation?.display_name`, `lat: selectedLocation?.lat`, `lon: selectedLocation?.lon`
- ✅ `backend/controllers/auth.js` — validates + stores `location`, `latitude`, `longitude` in DB
- ✅ `backend/controllers/location.js` — scoped to Kathmandu (`${q}, Kathmandu` appended to query); display_name truncated to 3 parts (`split(",").slice(0,3).join(",")`)
- ✅ Card height: `md:h-[600px]` (increased from 540 to fit extra location field)
- ✅ Tested end-to-end — DBeaver confirmed coords saved correctly

**Pending frontend validations (do all at once later):**

- `required` attribute on all form fields
- Show error if user types location but doesn't pick from dropdown (`!selectedLocation` check in `handleSubmit`)

**Step 4 (Haversine + Controller + Route) — COMPLETE ✅ (2026-06-22):**

Concepts covered + decided:

- No query params needed — frontend sends `GET /venues/nearby` with Bearer token only
- `verifyToken` middleware extracts `req.user.id` → backend fetches user lat/lon from `users` table
- Haversine formula in raw SQL (no PostGIS) — chosen approach
- SQL alias problem: `WHERE distance_km <= 10` fails — alias not available at WHERE stage
- Solution: subquery — inner query computes `distance_km`, outer query filters + sorts on it
- New files: `routes/venues.js` + `controllers/venues.js`, mounted at `/venues` in `index.js`
- `GET /venues/nearby` is a protected route (needs `verifyToken`)
- Export style: `module.exports = getNearbyVenues` (direct export, matches `controllers/user.js` pattern)

Post-implementation quiz completed ✅ — user correctly answered:

1. No-token request → `verifyToken.js` returns 401 "No authorization header."
2. Null lat/lon → Haversine fails → catch block returns 500 "Internal Server Error"
3. `$1`/`$2` parameterized queries prevent SQL injection

**`routes/venues.js` — WRITTEN ✅:**

```js
const express = require("express");
const router = express.Router();
const verifyTokenMiddleware = require("../middleware/verifyToken");
const getNearbyVenues = require("../controllers/venues");

router.get("/nearby", verifyTokenMiddleware, getNearbyVenues);

module.exports = router;
```

**Algorithm decided:**

```
1. Extract user_id from req.user.id (set by verifyToken)
2. SELECT latitude, longitude FROM users WHERE user_id = $1
3. Run subquery:
   SELECT * FROM (
     SELECT *, (haversine expression) AS distance_km
     FROM futsal_venues
   ) AS venues_with_distance
   WHERE distance_km <= 10
   ORDER BY distance_km ASC
4. Return results as JSON
```

**`controllers/venues.js` — COMPLETE ✅:**

- Step 1: Extract `user_id` from `req.user.id`
- Step 2: Fetch user lat/lon from `users` table
- Step 3: Haversine subquery with parameterized `$1`/`$2` (SQL injection safe)
- Step 4: Return `res.status(200).json({ message, data: venueResult.rows })`
- try/catch with `console.error(error)` + 500 response
- `module.exports = getNearbyVenues` (direct export pattern)

**Mounted in `index.js`** — `app.use("/venues", venueRoutes)` ✅

1. Step 5: `GET /venues/nearby` route + controller + query (returns sorted venues + distance_km)

After Steps 4+5: Owner Dashboard (add venue with geocoded location), resume frontend venue cards wired to real nearby-venues data.

User staying on Sonnet 4.6 model (not Opus) for this work — well-documented patterns, no need for frontier reasoning.

---

## Project Structure

```
futsal-booking-system/
├── backend/
│   ├── controllers/
│   │   ├── auth.js        ← register + login + refresh (all complete ✅)
│   │   ├── user.js        ← getProfile (returns req.user) ✅
│   │   ├── location.js    ← searchLocation (Nominatim proxy) ✅
│   │   └── venues.js      ← getNearbyVenues (Haversine query) ✅
│   ├── middleware/
│   │   └── verifyToken.js ← reads Authorization header → jwt.verify → req.user → next() ✅
│   ├── models/
│   │   └── db.js          ← pg Pool, dotenv config, exports pool
│   ├── routes/
│   │   ├── auth.js        ← POST /register, POST /login, POST /refresh ✅
│   │   ├── user.js        ← GET /profile (verifyToken + getProfile) ✅
│   │   ├── location.js    ← GET /search (Nominatim proxy) ✅
│   │   └── venues.js      ← GET /nearby (verifyToken + getNearbyVenues) ✅
│   ├── sql/
│   │   └── schema.sql     ← users table only (4 remaining tables pending)
│   ├── .env               ← DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD, JWT_SECRET, REFRESH_TOKEN_SECRET
│   ├── index.js           ← Express server, middleware, authRoutes + userRoutes mounted
│   └── package.json
├── frontend/
│   ├── index.html         ← Material Symbols Outlined font link added ✅
│   ├── src/
│   │   ├── assets/        ← sign-in.jpg, register.jpg
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   │   ├── Sidebar.jsx         ← complete ✅
│   │   │   │   ├── DashboardHeader.jsx ← complete ✅ (search bar + username/avatar)
│   │   │   │   └── DashboardLayout.jsx ← complete ✅ (Sidebar + Header + <Outlet />)
│   │   │   ├── Login.jsx     ← complete ✅ (role-based navigate: user→/dashboard, owner→/owner/dashboard)
│   │   │   ├── Register.jsx  ← complete ✅
│   │   │   ├── Dashboard.jsx ← in progress (layout done, main content pending)
│   │   │   ├── OwnerDashboard.jsx ← empty state UI complete ✅ (welcome + MY VENUE card, ADD VENUE navigates to /owner/add-venue)
│   │   │   └── AddVenue.jsx      ← IN PROGRESS (placeholder created, form sections pending)
│   │   ├── context/
│   │   │   └── AuthContext.jsx ← createContext + AuthProvider + useState(accessToken, role) ✅
│   │   ├── App.jsx          ← Routes: /login, /register, /dashboard, /owner (nested: index→OwnerDashboard, add-venue→AddVenue), * → /login
│   │   ├── main.jsx         ← BrowserRouter + AuthProvider wraps App
│   │   ├── index.css        ← @import tailwindcss, Inter font, @theme tokens, .input-animated, .btn-fill
│   │   └── App.css          ← empty
│   ├── vite.config.js
│   └── package.json
├── .vscode/
│   └── launch.json    ← Debugger config: Node.js backend, cwd=backend/, entry=index.js ✅
├── .gitignore
└── project_context.md
```

---

## Backend — Current State (COMPLETE ✅)

### Packages installed (backend/)

- **Production:** express, cors, dotenv, pg, bcrypt, jsonwebtoken, cookie-parser
- **Dev:** nodemon

### index.js

- Express server on port 3000
- Middleware: `express.json()`, `cors(corsOptions)`, `cookieParser()`
- corsOptions: `origin: "http://localhost:5173"`, `credentials: true`
- Routes: authRoutes at `/auth`, userRoutes at `/user`, locationRoutes at `/location`, venueRoutes at `/venues`

### controllers/auth.js — ALL COMPLETE ✅

```
register:
  - Validate input → 400
  - Check duplicate email → 409
  - bcrypt.hash(password, 10)
  - INSERT INTO users RETURNING user_id, username, email, role
  - generateToken(user.user_id, user.role, res) → accessToken
  - Return 201 + { message, accessToken, username, role }

login:
  - Validate input → 400
  - SELECT user by email → 401 if not found
  - bcrypt.compare → 401 if mismatch
  - jwt.sign accessToken (15m, JWT_SECRET)
  - jwt.sign refreshToken (7d, REFRESH_TOKEN_SECRET)
  - res.cookie("refreshToken", ..., { httpOnly, secure:false, sameSite:"strict", maxAge:7d })
  - Return 200 + { message, accessToken, username, role }

refresh:
  - Read req.cookies.refreshToken → 401 if missing
  - jwt.verify(refreshToken, REFRESH_TOKEN_SECRET) → 403 if invalid/expired
  - jwt.sign new accessToken (15m, JWT_SECRET)
  - Return 200 + { newAccessToken }

logout:
  - res.clearCookie("refreshToken") — clears httpOnly cookie
  - Return 200 + { message: "Logged out successfully" }
```

### middleware/verifyToken.js ✅

```
- Read Authorization header → 401 if missing
- Extract Bearer token (.split(" ")[1])
- jwt.verify(token, JWT_SECRET) → 401 if invalid/expired
- req.user = decoded payload ({ id, role, iat, exp })
- next()
```

### routes/auth.js ✅

- POST /register, POST /login, POST /refresh, POST /logout

### routes/user.js ✅

- GET /profile → [verifyToken, getProfile]

### .env variables

- DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD
- JWT_SECRET, REFRESH_TOKEN_SECRET

---

## Frontend — Current State

### Packages installed (frontend/)

- react, react-dom, react-router-dom, react-icons, tailwindcss, @tailwindcss/vite

### index.css — @theme tokens added

```css
/* Custom color tokens */
--color-primary: #4648d4 --color-on-surface: #1b1b23
  --color-on-surface-variant: #464554 --color-surface-container: #efecf8
  --color-surface-container-low: #f5f2fe --color-outline-variant: #c7c4d7
  --color-primary-fixed: #e1e0ff --color-inverse-surface: #303038 /* + others */
  /* Font-size tokens — MUST use --text-* prefix (not --font-size-*) for Tailwind v4
     to auto-generate text-{name} utility classes. Renamed after debugging session: */
  --text-display-lg: 48px --text-headline-md: 24px --text-headline-section: 14px
  --text-body-lg: 18px --text-body-md: 16px --text-label-sm: 12px /* + others */;
```

### AuthContext.jsx ✅

- `createContext`, `AuthProvider` with `useState("")` for accessToken + `useState("")` for role
- `useNavigate()` for post-logout redirect
- `logout()` function: `POST /auth/logout` with `credentials: "include"` → `setAccessToken(null)` + `setRole(null)` + `navigate("/login")`
- Provider value: `{ accessToken, setAccessToken, role, setRole, logout }`
- Exports: `AuthContext`, `AuthProvider`
- Wraps entire app in `main.jsx`

### Login.jsx ✅

- `credentials: "include"` on fetch — stores httpOnly refreshToken cookie
- `setAccessToken(data.accessToken)` + `setRole(data.role)` after login success
- Role-based navigation: `data.role === "user"` → `/dashboard`, else → `/owner/dashboard`
- Uses `data.role` (not context `role`) for navigate — avoids async state update bug

### Sidebar.jsx — ✅ COMPLETE (role-based nav + active styling)

- Fixed sidebar: w-64, bg-[#f5f5f4], full height, border-r border-outline-variant
- Brand: "FUTSALBOOK" — font-extrabold, uppercase, tracking-tighter
- **Decision: Option A — reuse single Sidebar, role-based nav items**
- Two nav arrays: `userNav` (Dashboard `/dashboard`, Venues `/venues`, Bookings `/bookings`, Profile `/profile`) and `ownerNav` (Dashboard `/owner/dashboard`, Edit Venue `/owner/edit-venue`, Booking Requests `/owner/booking-requests`, Profile `/owner/profile`)
- Owner icons: `dashboard`, `storefront`, `calendar_month`, `person`
- Pick array: `const navItems = role === "user" ? userNav : ownerNav` → `.map()` with `key={item.label}` inside `<nav>`
- **Active styling:** `useLocation()` + `pathname` comparison. Active item → `text-primary bg-primary-fixed`. Dashboard icon only → `fontVariationSettings: "'FILL' 1"` when active.
- **`<Link to={item.href}>`** (not `<a href>`) — prevents full page reload which would lose auth state
- `role` + `logout` from `useContext(AuthContext)`
- Import path: `../../context/AuthContext` (two levels up from `layout/`)
- Logout button: pill, dark→indigo hover, flex centered, logout icon + text-xs tracking-widest, `onClick={logout}` from AuthContext

### DashboardHeader.jsx ✅ COMPLETE (role-aware)

- `sticky top-0 bg-surface-container-lowest border-b border-outline-variant px-6 py-4`
- Left: search bar — hidden for owner (`role === "user" ? "" : "hidden"`), visible for user
- Right: username span + avatar circle (`w-9 h-9 rounded-full bg-inverse-surface` with initials "AM")
- Owner: shows "Venue Owner" label below name (inline `<span>`, not `<p>` inside `<span>`)
- Owner: `ml-auto` on right section pushes username/avatar right when search bar hidden
- **Dynamic username:** `useContext(AuthContext)` — set in AuthContext via `setUsername(data.username)` after login. No `location.state` dependency.
- **Dynamic initials:** `username.split(" ")` → 1 word: first char, 2+ words: first char of each word. Displayed in avatar circle.

### DashboardLayout.jsx ✅ COMPLETE

- Imports Sidebar + DashboardHeader
- Returns: `<div>` → `<Sidebar />` + `<div className="pl-64 bg-surface min-h-screen">` → `<DashboardHeader />` + `<Outlet />` (replaced `{children}` for nested routing)
- `pl-64` offsets content from fixed sidebar
- `bg-surface min-h-screen` here (not on `<main>`) — wrapper spans full viewport height so background tint covers entire content area; header's own white bg sits on top

### Dashboard.jsx — IN PROGRESS

- Has auto-refresh logic: 401 → POST /auth/refresh → retry ✅
- Uses `<DashboardLayout>` wrapper ✅
- **Hero section ✅ COMPLETE:**
  ```jsx
  <main className="p-8 max-w-7xl mx-auto">
    <section>
      <h1 className="text-display-lg font-extrabold tracking-tight text-on-surface">
        {message}
      </h1>
      <p className="text-body-lg text-on-surface-variant font-medium">
        Find a court. Book a slot. Play.
      </p>
    </section>
  </main>
  ```
- `bg-surface` + `min-h-screen` moved to wrapper div in DashboardLayout.jsx (not `<main>`) — so tint covers full content area height, not just hero's intrinsic content height
- **Next:** venue cards section + bookings table — PAUSED to build backend location-search feature first (see new section below)

---

## Auth Flow — 100% COMPLETE ✅

- Register ✅ | Login (bcrypt + JWT + httpOnly cookie) ✅
- verifyToken middleware ✅ | Protected route GET /user/profile ✅
- Frontend Bearer token ✅ | POST /auth/refresh ✅ | Auto-refresh on 401 ✅

---

## Dashboard UI — Design System (from Google Stitch)

- Stitch zip: `D:\stitch_futsalbook_user_dashboard.zip`
- Layout: left sidebar (fixed 256px) + sticky top header + main content
- Colors: primary `#4648d4`, bg `#fcf8ff`, near-black buttons `#111827`
- Icons: Google Material Symbols Outlined
- Cards: white, rounded-2xl, large drop shadow
- Status badges: green=approved, yellow=pending, gray=completed

### Owner Dashboard Design (Stitch — FINALIZED 2026-06-25)

**Stitch project:** "FutsalBook User Dashboard" (project ID: `18191911654176959109`)
**3 screens finalized** (all others hidden/cleaned):

#### Screen 1: "Owner Dashboard - Balanced Proportions" (main state, has data)

- **Sidebar nav:** Dashboard (active), Edit Venue, Booking Requests, Profile, Logout
- **User profile** in sidebar: avatar + name + "Venue Owner" label
- **Welcome section:** "Hello, {name}" + tagline "Manage your venues. Approve bookings. Grow."
- **MY VENUE card:** venue image + name + address + phone number
- **Stats row (3 cards):** Total Bookings (event_available icon), Pending Requests (pending_actions icon), Approved Today (check_circle icon)
- **Recent Booking Requests table:**
  - Columns: Player Name | Venue | Ground | Date | Time Slot | Status
  - Status badges: PENDING (yellow), APPROVED (green), REJECTED (red)

#### Screen 2: "Owner Dashboard - Simplified Empty State Schedule" (new owner, no venues yet)

- Same sidebar + welcome as Screen 1
- MY VENUE card → dashed border card, icon circle (add_business), "Add Your First Venue" title, subtitle, "+ ADD VENUE" button
- **Design change (2026-06-28):** Removed 3 stat cards. Replaced with two tables:
  - "TODAY'S BOOKED SLOTS" — empty state: calendar icon, "Your journey starts here.", "Once your venue is live, player bookings will appear right here."
  - "TODAY'S AVAILABLE SLOTS" — empty state: soccer icon, "Ready to kick off?", "Add your venue to start generating available slots for local players."

#### Screen 3: "Add Venue - Refined Layout & Pricing" (add venue form)

- **Breadcrumb:** Dashboard > Add Venue
- **Section 1 — General Information:**
  - Venue Name (text input)
  - Phone Number (text input)
  - Full Address (text input with location_on icon — reuse autocomplete pattern from Register)
- **Section 2 — Venue Details:**
  - Number of Pitches: radio buttons (1 / 2 / 4 / 5+)
  - Pitch Type: options (5-a-side / 7-a-side / Mixed)
  - Surface Type: options (Indoor Turf / Outdoor Turf / Hardwood Court)
- **Section 3 — Pricing:**
  - Price per Hour per pitch (dynamic fields based on pitch count)
- **Section 4 — Features & Amenities:**
  - Checkboxes: Parking, Changing Rooms, Showers, Cafe, Free WiFi, Lockers
- **Section 5 — Venue Imagery:**
  - Drag-drop file upload area (JPG/PNG, min 1920×1080, max 10 images)
  - "Select Files" button
- **CTA:** "Publish Venue" button

---

## Immediately Next

1. ~~**Haversine SQL** — write distance formula in raw SQL~~ ✅ DONE
2. ~~**GET /venues/nearby** — route + controller + query~~ ✅ DONE
3. **Owner Dashboard — IN PROGRESS (2026-06-27):**
   - ✅ Role-based routing: login response includes `role`, stored in AuthContext, `Login.jsx` navigates to `/owner/dashboard` for owners
   - ✅ `OwnerDashboard.jsx` wrapped in `<DashboardLayout>` — sidebar + header rendering
   - ✅ Sidebar refactor COMPLETE: role-based nav with `.map()` + `key` prop, import path fixed
   - ✅ DashboardHeader role-aware: search hidden for owner, "Venue Owner" label shown
   - ✅ Logout feature COMPLETE + TESTED end-to-end ✅
   - ✅ Sidebar active styling COMPLETE: `useLocation` + pathname match, `<Link>` migration, filled dashboard icon
   - ✅ DashboardHeader dynamic username + initials COMPLETE
   - ✅ Welcome section COMPLETE — greeting + subtitle, matches user Dashboard pattern
   - ✅ MY VENUE empty card COMPLETE — dashed border, icon circle, title, subtitle, "+ ADD VENUE" button
   - ✅ Design decision: removed stat cards, replaced with two tables (Today's Booked/Available Slots) — deferred until venue exists
   - ✅ Nested routing: DashboardLayout as parent route with `<Outlet />`, OwnerDashboard as index, AddVenue at `/owner/add-venue`
   - ✅ ADD VENUE button wired: `onClick={() => navigate("/owner/add-venue")}`
   - ✅ AddVenue.jsx created (placeholder)
   - ✅ Blank page bug FIXED — `username` moved to AuthContext, no more `location.state` dependency
   - ✅ `DashboardHeader` reads `username` from `useContext(AuthContext)` — works on direct URL, refresh, button nav
   - ✅ `OwnerDashboard` reads `username` from `useContext(AuthContext)`
   - ✅ `backend/utils/generateToken.js` COMPLETE — `generateToken(userId, role, res)` generates accessToken (15m) + refreshToken (7d) + sets httpOnly cookie, returns accessToken
   - ✅ `login` controller refactored — inline token logic replaced with `generateToken` call
   - ✅ `register` controller updated — calls `generateToken` after INSERT, returns `{ message, accessToken, username, role }` (auto-login response shape matches login)
   - ⏭️ **Next:** `Register.jsx` — read new response fields, call `setAccessToken` + `setRole` + `setUsername` + `setFrom("register")`, navigate to dashboard. Add `from` to AuthContext. Show "Welcome onboard" vs "Hello" ternary in `OwnerDashboard` + `Dashboard`.
4. Resume frontend: venue cards section (wire to real nearby-venues data, show distance in km) + bookings table
5. Create remaining DB tables: grounds, time_slots, bookings
6. Add `required` to all Register.jsx form fields (frontend validation cleanup)

---

## Memory Update Protocol

- User says "update project_context.md" → update `D:\futsal-booking-system\project_context.md`
- Rewrite "Current State" sections — never append duplicates
- Two prompts before context limit: remind user to update file
