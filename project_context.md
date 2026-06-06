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
- **Status as of 2026-06-06:** Auth 100% complete. Dashboard layout shell complete — Sidebar ✅, DashboardHeader ✅, DashboardLayout ✅. Now building Dashboard main content.

---

## Mentor Role (CRITICAL — always follow)

- **Socratic method** — never give code unless user explicitly asks. Ask questions that lead user to solutions.
- **Deadline adjustment (2026-06-03):** Skip doc-reading detours, give just enough concept to implement, then build. No code handouts — explain concept, user writes code.
- **Code quality standards — always enforce, never skip:**
  - Error handling (try/catch on all async operations)
  - Correct HTTP status codes
  - Input validation on backend
  - Separation of concerns (routes → controllers → models)
  - Security practices (never expose passwords, use env vars for secrets)

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

## Database Schema (5 tables)

```sql
Users: user_id (PK SERIAL), username (VARCHAR NOT NULL), email (VARCHAR UNIQUE NOT NULL),
       password (VARCHAR hashed NOT NULL), phone_number (VARCHAR), role ('user'|'owner')

Futsal Venues: futsal_id (PK), futsal_name, location, phone_number, owner_id (FK→Users)

Grounds: ground_id (PK), futsal_id (FK→Venues), ground_name, price (DECIMAL),
         has_parking, has_shower, has_changing_room (BOOLEAN)

Time Slots: slot_id (PK), ground_id (FK→Grounds), start_time (TIME), end_time (TIME),
            status ('available'|'pending'|'approved'|'cancelled')

Bookings: booking_id (PK), user_id (FK→Users), slot_id (FK→TimeSlots),
          booking_date (DATE), notes (TEXT optional), status ('pending'|'approved'|'cancelled')
```

**Note:** Only `users` table created in PostgreSQL. Remaining 4 tables pending.

---

## Project Structure

```
futsal-booking-system/
├── backend/
│   ├── controllers/
│   │   ├── auth.js        ← register + login + refresh (all complete ✅)
│   │   └── user.js        ← getProfile (returns req.user) ✅
│   ├── middleware/
│   │   └── verifyToken.js ← reads Authorization header → jwt.verify → req.user → next() ✅
│   ├── models/
│   │   └── db.js          ← pg Pool, dotenv config, exports pool
│   ├── routes/
│   │   ├── auth.js        ← POST /register, POST /login, POST /refresh ✅
│   │   └── user.js        ← GET /profile (verifyToken + getProfile) ✅
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
- Routes: authRoutes at `/auth`, userRoutes at `/user`

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
  /* Custom font-size tokens */ --font-size-display-lg: 48px
  --font-size-headline-md: 24px --font-size-headline-section: 14px
  /* + others */;
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
- Returns: `<div>` → `<Sidebar />` + `<div className="pl-64">` → `<DashboardHeader />` + `{children}`
- `pl-64` offsets content from fixed sidebar

### Dashboard.jsx — IN PROGRESS

- Has auto-refresh logic: 401 → POST /auth/refresh → retry ✅
- Now uses `<DashboardLayout>` wrapper ✅ (Sidebar import removed)
- Currently renders placeholder `<h1>Hello testuser</h1>` inside layout
- **Next:** replace placeholder with hero section + venue cards + bookings table

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

---

## Immediately Next

1. Build hero section in Dashboard.jsx — `Hello, {username}` (text-display-lg font-extrabold) + tagline `Find a court. Book a slot. Play.`
2. Build venue cards section (3 static cards — name, location, phone, "VIEW GROUNDS" button)
3. Build bookings table (static rows — venue, ground, date, time slot, status badge)
4. Create remaining 4 DB tables via psql: futsal_venues, grounds, time_slots, bookings
5. Wire venue cards + bookings table to real DB data

---

## Memory Update Protocol

- User says "update project_context.md" → update `D:\futsal-booking-system\project_context.md`
- Rewrite "Current State" sections — never append duplicates
- Two prompts before context limit: remind user to update file
