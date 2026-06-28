# Plate — AI Calorie Tracker (frontend)

A mobile-first calorie & nutrition tracker. Log food by typing or photo, watch
an "AI" reply with the calorie/macro breakdown — like texting a nutrition
coach. Track water, see your streak on a calendar, and watch progress charts
over time.

This is the **frontend only**, wired to a mock backend (`src/services/api.js`)
that simulates network delay and returns JSON exactly like a real API would.
Swap that one file for real `fetch`/`axios` calls and nothing else in the app
needs to change.

## Stack

- Vue 3 (Composition API) + Vite
- Pinia (state) + Vue Router
- Tailwind CSS v4 + hand-rolled shadcn-style primitives on top of **reka-ui**
  (accessible Dialog/Select/Progress/Avatar/Label primitives)
- Chart.js + vue-chartjs (calorie/water trend, macro donut, weight line)
- lucide icons

## Getting started

```bash
npm install
npm run dev
```

Open the printed local URL. There's no seeded account — sign up first
(3 short steps), then start logging food from the **Today** tab.

`npm run build` produces a production build in `dist/`.

## How the mock "AI" works

`src/services/mockData.js` has a small lookup table of common foods
(rice, eggs, chicken, roti, dosa, etc.). `services/api.js`:

- **Text** — scans your sentence for known foods (handles simple quantities
  like "2 eggs"), sums up calories/macros. Anything unrecognized still
  returns a plausible estimate (marked "estimated" in the UI) rather than
  failing, so the flow never dead-ends.
- **Photo** — reads the file, waits like a real upload/inference call would,
  and returns one of a handful of sample recognized foods. About 1 in 16
  photos intentionally "fails" so you can see the error/retry state.

Both simulate genuine network latency (700ms–2s) so every loading state in
the UI is real, not instant.

## A few decisions worth knowing about

- **Added "sex" to signup.** Accurate calorie needs (Mifflin-St Jeor
  formula) require it; without it the daily target would be noticeably off
  for a lot of people. Kept as a single-tap field, not a big ask.
- **Activity level defaults to "light"** at signup (kept the signup short)
  and is editable later from Profile → Edit → Advanced.
- **Units are metric** (cm / kg) throughout — no imperial toggle. Easy to
  add later if needed.
- **Calendar dots:** a day is "logged" (amber) once anything is logged, and
  "goal hit" (green check) when that day's calories land within ±15% of
  target.
- Data persists to `localStorage` so the demo survives a refresh — this is
  purely a stand-in for a real database and lives entirely inside
  `services/api.js`.

## Structure

```
src/
  components/
    ui/         shadcn-style primitives (Button, Input, Dialog, Sheet, ...)
    layout/     AppShell, TopBar, BottomNav
    dashboard/  calorie ring, macro bars, water tracker, date navigator
    food/       chat-style log feed, composer, image sheet, edit dialog
    calendar/   month grid, streak card
    charts/     trend bar chart, weight line chart, macro donut
    common/     EmptyState, ConfirmDialog
  views/        one per route (auth/Login, auth/Signup, Dashboard, Calendar,
                Progress, Profile)
  stores/       auth.js, log.js, toast.js (Pinia)
  services/     api.js (mock backend), mockData.js (food knowledge base)
  utils/        date.js, calorie.js (BMR/TDEE/macro/water target math)
```

## Things you'd probably want before shipping

- Swap `services/api.js` for real HTTP calls (the function signatures are
  already shaped like a REST API, so this should be close to a drop-in).
- Real auth (hashed passwords, sessions/JWT) — current auth is mock-only.
- A real image-recognition model behind the photo upload.
- Optional: manual override for the calculated calorie target.
