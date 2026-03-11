# JIIT SmartSched — Backend API

Node.js + Express backend for timetable parsing, clash detection, publish & download.

## Setup

```bash
npm install
# Create .env file:
cp .env.example .env
# Start:
npm run dev    # development (nodemon)
npm start      # production
```

Runs on http://localhost:5000

## API Endpoints

### Admin
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/timetable/upload | Upload .xlsx → parse + detect clashes |
| GET | /api/timetable/entries | Get all parsed entries |
| GET | /api/timetable/clashes | Get all clashes with status |
| PATCH | /api/timetable/clashes/:index/resolve | Resolve one clash |
| POST | /api/timetable/clashes/resolve-all | Resolve all pending clashes |
| POST | /api/timetable/publish | Publish timetable to students |
| GET | /api/timetable/download/full | Download full resolved timetable as Excel |

### Student
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/timetable/published | Check if timetable is published |
| GET | /api/timetable/student?batch=A1 | Get entries for a batch |
| GET | /api/timetable/download/batch/:batch | Download batch timetable as Excel |

## Project Structure
```
jiit-backend/
├── server.js              ← Express app entry point
├── routes/
│   └── timetable.js       ← All route definitions
├── controllers/
│   └── timetableController.js  ← Request handlers + in-memory store
└── utils/
    ├── parser.js           ← Excel → entries array
    ├── clashDetector.js    ← Venue/Teacher/Batch clash detection
    └── excelExporter.js    ← Generate formatted Excel downloads
```
