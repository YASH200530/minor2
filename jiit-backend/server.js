require("dotenv").config();
const express = require("express");
const cors    = require("cors");

const timetableRoutes = require("./routes/timetable");

const app  = express();
const PORT = process.env.PORT || 5000;

// ── Middleware ──────────────────────────────────────────────
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Routes ──────────────────────────────────────────────────
app.use("/api/timetable", timetableRoutes);

// Health check
app.get("/", (req, res) => {
  res.json({ message: "JIIT SmartSched API is running 🚀", version: "1.0.0" });
});

// 404
app.use((req, res) => {
  res.status(404).json({ error: `Route ${req.method} ${req.path} not found` });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message || "Internal server error" });
});

app.listen(PORT, () => {
  console.log(`✅ JIIT SmartSched backend running on http://localhost:${PORT}`);
});
