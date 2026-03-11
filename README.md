# JIIT SmartSched AI — Full Stack

## Quick Start

### 1. Start Backend
```bash
cd jiit-backend
npm install
cp .env.example .env
npm run dev
# Runs on http://localhost:5000
```

### 2. Start Frontend
```bash
cd jiit-smartsched
npm install
npm run dev
# Runs on http://localhost:5173
```

## Demo Credentials
| Role | Username | Password |
|------|----------|----------|
| Admin | admin | admin123 |
| Student | student1 | student123 |

## Full Flow
1. Admin logs in → uploads Excel → backend parses + detects clashes
2. Admin resolves clashes (one by one or auto-resolve all)
3. Admin clicks **Publish** → timetable goes live
4. Admin downloads resolved Excel
5. Student logs in → selects Branch/Semester/Batch → views timetable
6. Student downloads their batch Excel
