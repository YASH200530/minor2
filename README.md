# SmartSched

> An intelligent scheduling and management system for JIIT with AI-powered clash detection

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![JavaScript](https://img.shields.io/badge/JavaScript-97.6%25-yellow?logo=javascript)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![React](https://img.shields.io/badge/React-18.2.0-blue?logo=react)](https://react.dev)
[![Node.js](https://img.shields.io/badge/Node.js-Backend-green?logo=nodedotjs)](https://nodejs.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-Database-green?logo=mongodb)](https://www.mongodb.com)

## Overview

SmartSched is a full-stack timetable management system designed for educational institutions. It provides separate portals for administrators and students with intelligent clash detection, real-time conflict resolution, and seamless Excel integration.

### Key Capabilities

- **Admin Portal** — Upload Excel timetables with automatic venue, teacher, and batch clash detection
- **Clash Detection & Resolution** — AI-powered conflict identification with manual or auto-resolve options
- **Student Portal** — Filter by branch, semester, and batch to view personalized timetables
- **Excel Integration** — Parse complex Excel formats and export resolved schedules
- **Secure Authentication** — JWT-based auth with role-based access control
- **Visual Timetable Grid** — Color-coded subjects with conflict highlighting

## Features

- 📅 **Intelligent Schedule Management** - Create, view, and manage timetables efficiently
- 🤖 **AI Clash Detection** - Automatic detection of venue/teacher/batch conflicts
- 👥 **Role-Based Access** - Separate admin and student portals with permissions
- 📊 **Excel Import/Export** - Sophisticated Excel parsing and generation
- 🔐 **Secure Authentication** - JWT tokens with bcrypt password hashing
- 🎨 **Responsive UI** - Beautiful, mobile-friendly interface with smooth animations
- 💾 **Persistent Storage** - MongoDB for reliable data management

## Tech Stack

### Frontend
- **React 18.2.0** - Modern UI library
- **Vite 5.1.4** - Lightning-fast build tool and dev server
- **Framer Motion 12.38.0** - Smooth animations and transitions
- **Lucide React 0.577.0** - Beautiful, consistent icons
- **XLSX 0.18.5** - Excel file handling

### Backend
- **Node.js** - JavaScript runtime environment
- **Express 4.18.2** - Fast, minimalist web framework
- **MongoDB + Mongoose 8.2.0** - NoSQL database with elegant schema validation
- **JWT (9.0.2)** - Secure token-based authentication
- **Bcryptjs 2.4.3** - Industry-standard password hashing
- **CORS** - Cross-origin request handling
- **Multer 1.4.5** - File upload middleware
- **ExcelJS 4.4.0** - Advanced Excel file generation

## Project Structure

```
smartsched/
├── jiit-smartsched/              # Frontend React application
│   ├── src/
│   │   ├── components/           # Reusable React components
│   │   ├── pages/                # Application pages
│   │   ├── utils/                # Helper functions
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   ├── vite.config.js
│   └── README.md
├── jiit-backend/                 # Backend Node.js server
│   ├── server.js                 # Express entry point
│   ├── routes/                   # API route definitions
│   ├── controllers/              # Business logic
│   ├── utils/                    # Helper functions & parsers
│   ├── models/                   # MongoDB schemas
│   ├── package.json
│   ├── .env.example
│   └── README.md
└── README.md                     # This file
```

## Excel Format Support

The system parses Excel cells in the format: `LA1,A2(PH211)-G1/ANU`

| Component | Meaning |
|-----------|---------|
| `L` | Type: L=Lecture, T=Tutorial, P=Practical |
| `A1,A2` | Batch(es) assigned |
| `PH211` | Subject code |
| `G1` | Venue/Room number |
| `ANU` | Teacher code |

## Quick Start

### Prerequisites

- **Node.js** 16.0 or higher
- **npm** or yarn
- **MongoDB** instance (local or MongoDB Atlas cloud)
- **Git** for version control

### Installation & Setup

#### Step 1: Backend Setup

```bash
cd jiit-backend
npm install
```

Create a `.env` file in the backend directory:

```env
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/smartsched
JWT_SECRET=your_super_secure_jwt_secret_key_min_32_chars
CORS_ORIGIN=http://localhost:5173
NODE_ENV=development
```

#### Step 2: Frontend Setup

```bash
cd jiit-smartsched
npm install
```

Create a `.env.local` file (optional):

```env
VITE_API_BASE_URL=http://localhost:5000
```

### Running the Application

#### Development Mode

**Terminal 1 - Backend:**
```bash
cd jiit-backend
npm run dev
# Backend running on http://localhost:5000
```

**Terminal 2 - Frontend:**
```bash
cd jiit-smartsched
npm run dev
# Frontend running on http://localhost:5173
```

#### Production Build

**Frontend:**
```bash
cd jiit-smartsched
npm run build      # Creates optimized build
npm run preview    # Preview production build locally
```

## Demo Credentials

| Role | Username | Password |
|------|----------|----------|
| Admin | admin | admin123 |
| Student | student1 | student123 |

## API Documentation

### Authentication Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | User login |
| POST | `/api/auth/register` | User registration |
| POST | `/api/auth/logout` | User logout |

### Admin Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/timetable/upload` | Upload and parse Excel file |
| GET | `/api/timetable/entries` | Get all parsed entries |
| GET | `/api/timetable/clashes` | Get all detected clashes |
| PATCH | `/api/timetable/clashes/:index/resolve` | Resolve individual clash |
| POST | `/api/timetable/clashes/resolve-all` | Auto-resolve all clashes |
| POST | `/api/timetable/publish` | Publish timetable to students |
| GET | `/api/timetable/download/full` | Download resolved Excel |

### Student Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/timetable/published` | Check if timetable is published |
| GET | `/api/timetable/student?batch=A1` | Get batch-specific entries |
| GET | `/api/timetable/download/batch/:batch` | Download batch Excel |

## Development Guide

### Available Scripts

**Frontend:**
```bash
npm run dev      # Start Vite dev server with hot reload
npm run build    # Production build
npm run preview  # Preview production build
```

**Backend:**
```bash
npm run dev      # Start with nodemon (auto-restart on changes)
npm start        # Start production server
```

### Code Standards

- **Consistent Naming** - camelCase for variables/functions, PascalCase for components
- **Modular Architecture** - Separated concerns (routes, controllers, utils)
- **RESTful Design** - Standard HTTP methods and status codes
- **Error Handling** - Try-catch blocks with informative error messages

## Workflow Guide

### Admin Workflow
1. Admin logs in to admin portal
2. Uploads Excel timetable file
3. System automatically detects clashes
4. Admin resolves clashes (manual or auto-resolve)
5. Admin clicks **Publish** to make timetable live
6. Admin can download the resolved timetable

### Student Workflow
1. Student logs in to student portal
2. Selects their Branch/Semester/Batch
3. Views their personalized timetable
4. Can download their batch timetable as Excel

## Contributing

We welcome contributions! To contribute:

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/YourFeature`
3. **Commit** your changes: `git commit -m 'Add YourFeature'`
4. **Push** to the branch: `git push origin feature/YourFeature`
5. **Open** a Pull Request with a clear description

### Development Tips

- Ensure code passes linting (if configured)
- Test thoroughly before submitting PR
- Update documentation for new features
- Keep commits atomic and descriptive

## License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

## Support & Troubleshooting

### Common Issues

**MongoDB Connection Error:**
```
Check your MONGODB_URI in .env is correct
Ensure MongoDB instance is running
Verify network access if using MongoDB Atlas
```

**Port Already in Use:**
```bash
# Change PORT in .env or kill the process
# On Windows: netstat -ano | findstr :5000
# On macOS/Linux: lsof -i :5000
```

**Frontend Cannot Reach Backend:**
```
Verify backend is running on correct port
Check CORS_ORIGIN in .env matches frontend URL
Clear browser cache and restart dev server
```

For more support, open an issue on GitHub or contact the development team.

## Acknowledgments

- **JIIT** (Jaypee Institute of Information Technology)
- **React Community** for excellent documentation and tools
- **Node.js Community** for robust backend infrastructure
- All contributors who have helped improve this project

## Project Status

| Component | Status |
|-----------|--------|
| Admin Portal | ✅ Complete |
| Student Portal | ✅ Complete |
| Clash Detection | ✅ Complete |
| Excel Integration | ✅ Complete |
| Authentication | ✅ Complete |

---

**Built with ❤️ by the SmartSched Team**

For detailed information about specific components, see the individual READMEs:
- [Backend Documentation](./jiit-backend/README.md)
- [Frontend Documentation](./jiit-smartsched/README.md)
