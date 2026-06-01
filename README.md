# IronLog 🔥

**Production-grade strength training tracker built with Next.js 16, MongoDB, and a dark gym aesthetic.**

![IronLog Dashboard](dark gym aesthetic with power red accents)

## Features

- 🏋️ **Dashboard** — Today's workout, weekly progress ring, previous session stats
- 💪 **Active Workout** — Real-time timer, set logging with type (normal/warmup/drop/superset/failed), live 1RM estimation
- 📈 **Analytics** — Volume by muscle group, strength progression charts, estimated 1RM over time, muscle frequency radar
- 🗓️ **Calendar** — Monthly view with color-coded completed/rest/missed days and streak tracking
- 📚 **Exercise Library** — 30+ exercises with muscles, equipment, instructions, alternatives
- 📤 **Import/Export** — Full JSON backup/restore and template import
- 🏆 **PR Tracking** — Automatic personal record detection using Epley 1RM formula
- 🔄 **Smart Scheduling** — Rest days shift the plan forward; workout order is never skipped

## Tech Stack

| Layer     | Tech                                |
| --------- | ----------------------------------- |
| Framework | Next.js 16 (App Router, TypeScript) |
| Database  | MongoDB Native Driver               |
| Styling   | Tailwind CSS v4                     |
| Charts    | Recharts                            |
| Forms     | React Hook Form + Zod v4            |
| State     | Zustand                             |
| Icons     | Lucide React                        |

## Quick Start

### 1. Set up MongoDB

Create a `.env.local` file (already created for you):

```bash
# Local MongoDB
DB_URL=mongodb://localhost:27017/ironlog
DB_NAME="IronLog"

# OR MongoDB Atlas
DB_URL=mongodb+srv://<user>:<password>@cluster.mongodb.net/ironlog
DB_NAME="IronLog"
```

### 2. Install dependencies (already done)

```bash
npm install
```

### 3. Start the dev server

```bash
npm run dev
```

### 4. Seed the database

Visit `http://localhost:3000/import-export` and click **"Load Sample Data"**, or make a POST request:

```bash
curl -X POST http://localhost:3000/api/seed
```

This seeds:

- **30+ exercises** (chest, back, shoulders, legs, arms, core)
- **4-day Upper/Lower + Push/Pull split**

### 5. Start training!

Go to `http://localhost:3000/dashboard` → Click **Start Workout**

---

## Project Structure

```
app/
├── (app)/               # App shell with sidebar layout
│   ├── dashboard/       # 🏠 Main dashboard
│   ├── workout/
│   │   ├── active/      # 💪 Active session
│   │   ├── [id]/        # 📋 Session detail
│   │   └── history/     # 📜 All history
│   ├── analytics/       # 📊 Charts & stats
│   ├── exercises/       # 📚 Exercise library
│   ├── calendar/        # 🗓️ Calendar view
│   └── import-export/   # 📤 Data management
├── api/                 # 🔌 REST API routes
│   ├── seed/
│   ├── schedule/
│   ├── workout-logs/
│   ├── exercises/
│   ├── analytics/
│   ├── records/
│   └── import-export/
lib/
├── mongodb.ts           # Connection singleton
├── db/                  # Collection helpers
├── engine/
│   ├── scheduler.ts     # Workout rotation engine
│   └── progression.ts   # Epley 1RM + progression
└── validations/         # Zod schemas
store/
├── workoutStore.ts      # Active workout state
└── uiStore.ts           # Sidebar, modals
types/index.ts           # All TypeScript types
data/seed.ts             # Sample workout data
```

## Workout Engine

The scheduling engine follows these rules:

1. User follows a rotating split (A → B → C → D → A → ...)
2. Taking a rest day does NOT skip a workout — it shifts forward
3. Workout order is always preserved
4. The current workout index persists in MongoDB

## Progression Model (Strength-First)

- Hit **top of rep range** on all sets → **increase weight** (+2.5kg)
- In rep range but not maxed → aim for more reps
- **Failed below minimum** significantly → **deload 10%**
- 1RM estimated using the **Epley formula**: `weight × (1 + reps/30)`

## Database Collections

| Collection         | Purpose                              |
| ------------------ | ------------------------------------ |
| `users`            | User profile + current workout index |
| `workoutTemplates` | Workout plan templates               |
| `exerciseLibrary`  | Exercise database                    |
| `workoutLogs`      | Completed workout sessions           |
| `exerciseLogs`     | Per-exercise set data                |
| `personalRecords`  | PR history                           |
| `restDays`         | Rest day log                         |
| `settings`         | User preferences                     |
