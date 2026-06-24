---
name: Project Context
description: Futsal Booking System — scope, stack, schema, mentor role
type: project
---

# Futsal Booking System — Project Context

## Project Overview

- **Goal:** Master backend development. Proof-of-work for backend role switch at current company.
- **Deadline:** June 19, 2026
- **Stack:** React (Vite) frontend + Node.js/Express backend + PostgreSQL database
- **Why:** Career switch proof-of-work. Two parts: (1) React+Node.js web app, (2) WordPress marketing site consuming web app REST APIs.
- **Status as of 2026-06-24:** Auth 100% complete. Dashboard layout shell complete. Location-based venue search feature: Steps 1–4 all COMPLETE ✅ (schema, geocoding, frontend autocomplete, Haversine SQL + controller + route). Owner Dashboard design almost finalized in Stitch (simple: My Venues + Add/Edit Venue + Booking Requests). Next: implement Owner Dashboard (starting 2026-06-25), frontend venue cards wired to real data, remaining DB tables.

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
│   │   │   │   └── DashboardLayout.jsx ← complete ✅ (Sidebar + Header + children)
│   │   │   ├── Login.jsx     ← complete ✅
│   │   │   ├── Register.jsx  ← complete ✅
│   │   │   └── Dashboard.jsx ← in progress (layout done, main content pending)
│   │   ├── context/
│   │   │   └── AuthContext.jsx ← createContext + AuthProvider + useState(accessToken) ✅
│   │   ├── App.jsx          ← Routes: /login, /register, /dashboard, * → /login
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
  - Return 201 + { message, user }

login:
  - Validate input → 400
  - SELECT user by email → 401 if not found
  - bcrypt.compare → 401 if mismatch
  - jwt.sign accessToken (15m, JWT_SECRET)
  - jwt.sign refreshToken (7d, REFRESH_TOKEN_SECRET)
  - res.cookie("refreshToken", ..., { httpOnly, secure:false, sameSite:"strict", maxAge:7d })
  - Return 200 + { message, accessToken, username }

refresh:
  - Read req.cookies.refreshToken → 401 if missing
  - jwt.verify(refreshToken, REFRESH_TOKEN_SECRET) → 403 if invalid/expired
  - jwt.sign new accessToken (15m, JWT_SECRET)
  - Return 200 + { newAccessToken }
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

- POST /register, POST /login, POST /refresh

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

- `createContext`, `AuthProvider` with `useState(null)` for accessToken
- Exports: `AuthContext`, `AuthProvider`
- Wraps entire app in `main.jsx`

### Login.jsx ✅

- `credentials: "include"` on fetch — stores httpOnly refreshToken cookie
- `setAccessToken(data.accessToken)` after login success
- navigate('/dashboard', { state: { username, from: 'login' } })

### Sidebar.jsx ✅ COMPLETE

- Fixed sidebar: w-64, bg-[#f5f5f4], full height, border-r border-outline-variant
- Brand: "FUTSALBOOK" — font-extrabold, uppercase, tracking-tighter
- Nav: Dashboard (active — text-primary + bg-primary-fixed + filled icon), Venues, Bookings, Profile
- Inactive links: text-on-surface-variant + hover:text-primary + hover:bg-surface-container (all 3)
- Logout button: pill, dark→indigo hover, flex centered, logout icon + text-xs tracking-widest

### DashboardHeader.jsx ✅ COMPLETE

- `sticky top-0 bg-surface-container-lowest border-b border-outline-variant px-6 py-4`
- Left: search bar — `relative` wrapper, Material Symbols search icon (absolute positioned), input `w-96 rounded-full bg-white border pl-10`
- Right: username span + avatar circle (`w-9 h-9 rounded-full bg-inverse-surface` with initials "AM")
- Hardcoded "ALEX MORGAN" — will be dynamic later

### DashboardLayout.jsx ✅ COMPLETE

- Imports Sidebar + DashboardHeader
- Returns: `<div>` → `<Sidebar />` + `<div className="pl-64 bg-surface min-h-screen">` → `<DashboardHeader />` + `{children}`
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

### Owner Dashboard Design (Stitch — almost finalized 2026-06-24)

Scope kept minimal — 3 features only:
1. **My Venues** — list owner's venues (name, location, phone), Edit button per venue, "+ Add New Venue" button
2. **Add/Edit Venue form** — fields: Venue Name, Location (autocomplete, same pattern as Register), Phone Number, Venue Image upload
3. **Booking Requests page** — table: Player Name, Ground, Date, Time Slot, Status badges (Pending/Approved/Rejected), Approve/Reject action buttons on pending rows

---

## Immediately Next

1. ~~**Haversine SQL** — write distance formula in raw SQL~~ ✅ DONE
2. ~~**GET /venues/nearby** — route + controller + query~~ ✅ DONE
3. **Owner Dashboard** — design almost finalized (2026-06-24), implementation starts 2026-06-25
4. Resume frontend: venue cards section (wire to real nearby-venues data, show distance in km) + bookings table
5. Create remaining DB tables: grounds, time_slots, bookings
6. Add `required` to all Register.jsx form fields (frontend validation cleanup)

---

## Memory Update Protocol

- User says "update project_context.md" → update `D:\futsal-booking-system\project_context.md`
- Rewrite "Current State" sections — never append duplicates
- Two prompts before context limit: remind user to update file
