# JIIT SmartSched AI 📅

A timetable management system for JIIT B.Tech II Semester Even 2026.

## Features
- 🛡️ **Admin Portal** — Upload Excel timetable → AI detects venue / teacher / batch clashes
- 🎓 **Student Portal** — Filter by Branch + Semester + Batch → View weekly timetable
- ⚠️ **Clash Detection** — Automatic detection with AI-suggested resolutions
- 📅 **Visual Timetable Grid** — Colour-coded subjects, hover for details, clash highlights

## Setup

```bash
npm install
npm run dev
```

Open http://localhost:5173

## Demo Credentials
| Role    | Username | Password    |
|---------|----------|-------------|
| Admin   | admin    | admin123    |
| Student | student1 | student123  |

## Excel Format
Each cell follows the pattern: `LA1,A2(PH211)-G1/ANU`

| Part     | Meaning                        |
|----------|--------------------------------|
| `L`      | Type: L=Lecture T=Tutorial P=Practical |
| `A1,A2`  | Batch(es)                      |
| `PH211`  | Subject code                   |
| `G1`     | Venue / Room                   |
| `ANU`    | Teacher code                   |

## Project Structure
```
src/
├── App.jsx
├── main.jsx
├── index.css
├── components/
│   ├── Chip.jsx
│   ├── Spinner.jsx
│   ├── StatCard.jsx
│   └── TimetableGrid.jsx
├── pages/
│   ├── LoginPage.jsx
│   ├── AdminPortal.jsx
│   └── StudentPortal.jsx
└── utils/
    ├── constants.js
    ├── parser.js
    └── clashDetector.js
```
