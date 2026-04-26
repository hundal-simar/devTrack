# DevTrack

A personal developer productivity dashboard to track DSA practice, study time, daily goals, and streaks — with Google authentication and real-time sync across devices.

**[Live Demo](https://devtracker-web.vercel.app)** · **[GitHub](https://github.com/hundal-simar/devTrack)**

---

## Screenshot
<img width="1885" height="895" alt="image" src="https://github.com/user-attachments/assets/861d4af6-928c-4f52-8ec7-74a715ca3440" />



---

## Features

- **Google & email authentication** — secure login with Firebase Auth
- **Daily goals** — add, complete, and track daily intentions with a progress bar
- **DSA tracker** — log problems by topic and difficulty, visualize progress per topic
- **Study timer** — stopwatch with session saving and daily/weekly stats
- **Streak calendar** — GitHub-style contribution grid showing 30 days of activity
- **Dashboard** — unified view of all stats with a weekly study bar chart

---

## Tech stack

| Layer        | Technology                        |
|--------------|-----------------------------------|
| Frontend     | React 18, React Router v6         |
| Styling      | Tailwind CSS v4                   |
| Forms        | React Hook Form                   |
| Charts       | Recharts                          |
| Auth         | Firebase Authentication           |
| Database     | Cloud Firestore                   |
| Deployment   | Vercel                            |

---

## Getting started

### Prerequisites
- Node.js 18+
- A Firebase project with Authentication and Firestore enabled

### Installation

```bash
git clone https://github.com/hundal-simar/devTrack.git
cd devtrack
npm install
```

### Environment variables

Create a `.env` file in the root:

```
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

Fill in the values from your Firebase project settings.

### Run locally

```bash
npm run dev
```

Open `http://localhost:5173`

---

## Folder structure

```
src/
├── components/       # Reusable UI components
│   ├── Layout.jsx
│   ├── Sidebar.jsx
│   ├── EmptyState.jsx
│   ├── ErrorBoundary.jsx
│   ├── ProtectedRoute.jsx
│   └── skeletons/    # Loading skeleton components
│       ├── SkeletonDsa.jsx
│       ├── SkeletonGoals.jsx
│       ├── SkeletonStreaks.jsx
│       ├── SkeletonDashboard.jsx
│       └── SkeletonCard.jsx
├── context/
│   └── AuthContext.jsx
├── hooks/            # Custom React hooks
│   ├── useGoals.js
│   ├── useProblems.js
│   ├── useSessions.js
│   ├── useTimer.js
│   └── useStreak.js
├── pages/
│   ├── Dashboard.jsx
│   ├── DSA.jsx
│   ├── Goals.jsx
│   ├── Login.jsx
│   ├── Streaks.jsx
│   └── Timer.jsx
├── utils/
│   ├── authUtils.js
│   ├── chartUtils.js
│   ├── formatUtils.js
│   └── streakUtils.js
└── firebase.js
```

---

## Architecture decisions

**Custom hooks for data logic** — each page's Firestore logic lives in its own hook (`useGoals`, `useProblems`, etc.) completely separate from the UI. This makes components readable and logic testable.

**Firestore security rules** — all data lives under `users/{uid}/` and rules enforce that users can only access their own data.

**Derived state over stored state** — stats like streak count, topic progress percentages, and session totals are always computed from source data rather than stored separately, keeping the database simple and consistent.
