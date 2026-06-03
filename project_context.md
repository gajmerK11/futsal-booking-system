---
name: Project Context
description: Futsal Booking System — scope, stack, schema, mentor role
type: project
---

# Futsal Booking System — Project Context

## Project Overview
- **Goal:** Master backend development. Proof-of-work for backend role switch at current company.
- **Deadline:** ~June 19, 2026 (2 months from April 19, 2026)
- **Stack:** React (Vite) frontend + Node.js/Express backend + PostgreSQL database
- **Why:** Career switch proof-of-work. Two parts: (1) React+Node.js web app, (2) WordPress marketing site consuming web app REST APIs.
- **Status as of 2026-06-02:** Auth UI complete, basic login/register flow working, switching to industry-standard httpOnly cookie + refresh token auth

---

## Mentor Role (CRITICAL — always follow)
- **Socratic method** — never give code unless user explicitly asks. Ask questions that lead user to solutions.
- Guide user to read exact doc sections rather than explaining everything — build doc-reading habit.
- **Code quality standards — always enforce, never skip:**
  - Error handling (try/catch on all async operations)
  - Correct HTTP status codes
  - Input validation on backend
  - Separation of concerns (routes → controllers → models)
  - Security practices (never expose passwords, use env vars for secrets)
- Mentor must proactively raise these standards before moving to next step — never wait for user to ask.

---

## Learner Profile
- Location: Kathmandu, Nepal
- Calls mentor "brother" at moments of progress
- Sometimes asks for shortcuts — redirect, don't comply
- Uses Windows (cmd prompt, backslash paths)
- Chose PostgreSQL because company uses it (valid career reason)
- Raw SQL via `pg` driver — NOT Sequelize (to genuinely learn SQL)
- Prefers understanding concepts but tends to go deep — redirect when going too deep and deadline is close
- **Deadline pressure:** June 19, 2026 — guide accordingly, don't let perfectionism slow progress
- Showed demo to frontend team lead — positive feedback received ✅
- Decided to build industry-standard implementation (httpOnly cookies, refresh tokens) for job interviews

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
**Note:** Only `users` table created in PostgreSQL so far. Remaining 4 tables pending — `backend/sql/schema.sql` has users table, needs other 4.

---

## Project Structure
```
futsal-booking-system/
├── backend/
│   ├── controllers/
│   │   └── auth.js          ← register + login functions
│   ├── models/
│   │   └── db.js            ← pg Pool, dotenv config, exports pool
│   ├── routes/
│   │   └── auth.js          ← POST /register, POST /login wired to controllers
│   ├── sql/
│   │   └── schema.sql       ← CREATE TABLE IF NOT EXISTS users (others pending)
│   ├── .env                 ← DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD, JWT_SECRET
│   ├── index.js             ← Express server, middleware, routes mounted at /auth
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── assets/          ← sign-in.jpg, register.jpg, hero.png, react.svg, vite.svg
│   │   ├── components/
│   │   │   ├── Login.jsx    ← complete ✅
│   │   │   ├── Register.jsx ← complete ✅
│   │   │   └── Dashboard.jsx ← basic (shows Hello/Welcome message)
│   │   ├── App.jsx          ← Routes: /login, /register, /dashboard, * → /login
│   │   ├── main.jsx         ← BrowserRouter wraps App
│   │   ├── index.css        ← @import tailwindcss, Inter font, .input-animated, .btn-fill CSS
│   │   └── App.css          ← empty
│   ├── vite.config.js       ← Tailwind plugin configured
│   └── package.json
├── .gitignore               ← root level, covers both backend and frontend
└── project_context.md
```

---

## Backend — Current State

### Packages installed (backend/)
- **Production:** express, cors, dotenv, pg, bcrypt, jsonwebtoken, cookie-parser
- **Dev:** nodemon

### index.js
- Express server on port 3000
- Middleware: `express.json()`, `cors()`, `require("dotenv").config()`
- Routes: `authRoutes` mounted at `/auth`
- `testDBConnection()` — confirmed working

### controllers/auth.js
```
register:
  - Extract: username, email, password, phone_number, role from req.body
  - Validate: 400 if any missing
  - Check duplicate email: SELECT WHERE email = $1 → 409 if exists
  - Hash password: bcrypt.hash(password, 10)
  - INSERT into users RETURNING user_id, username, email, role
  - Return 201 + { message, user: result.rows[0] }

login:
  - Extract: email, password from req.body
  - Validate: 400 if missing
  - SELECT user by email → 401 if not found (vague message)
  - bcrypt.compare → 401 if no match (same vague message — security)
  - jwt.sign({ id: user.user_id, role: user.role }, JWT_SECRET, { expiresIn: "1h" })
  - Return 200 + { message: "Login successful", token, username: user.username }
```

### routes/auth.js
- `POST /register` → register controller
- `POST /login` → login controller

### .env variables
- DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD
- JWT_SECRET (generated with crypto.randomBytes(64).toString('hex'))

---

## Frontend — Current State

### Packages installed (frontend/)
- react, react-dom, react-router-dom, react-icons, tailwindcss, @tailwindcss/vite, jwt-decode

### Routing (App.jsx)
- `/login` → Login component
- `/register` → Register component
- `/dashboard` → Dashboard component
- `*` → Navigate to /login

### Login.jsx — COMPLETE ✅
- Split card layout: image left (sign-in.jpg), form right
- Background: `bg-stone-100`
- OAuth buttons (Google/Apple) with "Coming Soon" tooltip — `cursor-not-allowed`
- Divider: "Or continue with email"
- Inputs: controlled (useState), `.input-animated` wrapper for focus border animation
- Submit button: `.btn-fill` class — dark→indigo fill from bottom on hover
- State: `[email, setEmail]`, `[password, setPassword]`, `[loginMessage, setLoginMessage]`
- handleSubmit: fetch POST /auth/login → on success: navigate('/dashboard', { state: { username, from: 'login' } })
- Responsive: `flex-col md:flex-row`, `w-full md:w-1/2`

### Register.jsx — COMPLETE ✅
- Same layout as Login (register.jpg on left)
- Fields: username, email, password, phone_number, role (select dropdown)
- State: one useState per field + registerMessage
- handleSubmit: fetch POST /auth/register → on success: navigate('/dashboard', { state: { username: data.user.username, from: 'register' } })

### Dashboard.jsx — BASIC
- useLocation to get `{ username, from }` from navigate state
- Shows "Hello {username}" if from login, "Welcome onboard {username}" if from register
- Needs: proper auth protection, real content, token handling

### index.css — Custom CSS classes
```css
.input-animated — position: relative wrapper for focus border animation
.input-animated::after — animated bottom border (width 0 → 100% on focus-within)
.btn-fill — dark background button with indigo fill-from-bottom on hover
.btn-fill::after — position: absolute, height 0 → 100% on hover
.btn-fill span — position: relative, z-index: 1 (keeps text above fill)
```

---

## Auth — What's Done vs What's Needed

### ✅ Done
- Register endpoint tested (201, 409, 400 cases)
- Login endpoint tested (200+token, 401 cases)
- Frontend forms connected to backend APIs
- Navigate to dashboard after login/register
- Basic dashboard showing username

### ❌ NOT YET DONE — Next Priority
Industry-standard auth refactor:
1. Wire up `cookie-parser` in `backend/index.js`
2. Update login controller:
   - Issue **access token** (15min) — returned in JSON response
   - Issue **refresh token** (7 days) — set as httpOnly cookie
3. Create `POST /auth/refresh` — verify refresh token cookie → issue new access token
4. Create `POST /auth/logout` — clear refresh token cookie
5. Create `middleware/auth.js` — verify access token on protected routes
6. Frontend: store access token in memory (not localStorage)
7. Frontend: add `credentials: 'include'` to all fetch calls
8. Frontend: auto-refresh logic — if 401, call /auth/refresh, retry

---

## Weekly Plan (June 2026 — Week 1)
- [ ] Auth refactor — httpOnly cookies + refresh token ← NEXT
- [ ] Complete schema.sql — 4 remaining tables
- [ ] User dashboard (real content)
- [ ] Homepage
- OAuth — deferred (UI shows "Coming Soon" tooltip)

---

## Memory Update Protocol
- User says "update project_context.md" at end of each session
- Claude REWRITES the "Current State" sections — never appends duplicates
- **Usage limit reminder:** Two prompts before limit is hit, remind user to update the file

---

## Key Decisions Made
- Raw SQL via `pg` (not Sequelize) — to genuinely learn SQL
- PostgreSQL — company uses it
- httpOnly cookie for token storage (not localStorage) — more secure, industry standard
- Access token (15min) + Refresh token (7 days) — industry standard two-token flow
- OAuth deferred — UI shows "Coming Soon", actual implementation later
- React Router (not state toggle) — proper URLs, industry standard
- Tailwind CSS v4 with Vite plugin
- Inter font from Google Fonts
- Sports theme: indigo primary color, stone-100 background, split-card layout
