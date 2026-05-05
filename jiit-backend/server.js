require("dotenv").config();
const express  = require("express");
const cors     = require("cors");
const mongoose = require("mongoose");

const timetableRoutes = require("./routes/timetable");
const authRoutes      = require("./routes/auth");

const app  = express();
const PORT = process.env.PORT || 5000;

// ── MongoDB Connection ──────────────────────────────────────
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected:", process.env.MONGO_URI))
  .catch(err => {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  });

// ── Middleware ──────────────────────────────────────────────
app.use(cors({ origin: "*", credentials: false }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Routes ──────────────────────────────────────────────────
app.use("/api/auth",      authRoutes);
app.use("/api/timetable", timetableRoutes);

// Health check
app.get("/", (req, res) => {
  res.json({
    message: "JIIT SmartSched API is running 🚀",
    version: "1.0.0",
    db: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
  });
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
