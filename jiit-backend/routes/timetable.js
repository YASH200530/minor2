const express = require("express");
const multer  = require("multer");
const router  = express.Router();

const {
  uploadTimetable,
  getEntries,
  getClashes,
  resolveClash,
  resolveAllClashes,
  publishTimetable,
  getPublishedStatus,
  getStudentTimetable,
  downloadFullTimetable,
  downloadBatchTimetable,
} = require("../controllers/timetableController");

// Multer: store file in memory (no disk write needed)
const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    if (file.mimetype.includes("spreadsheet") || file.originalname.endsWith(".xlsx") || file.originalname.endsWith(".xls")) {
      cb(null, true);
    } else {
      cb(new Error("Only Excel files (.xlsx/.xls) are allowed"));
    }
  },
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max
});

// ── Admin routes ────────────────────────────────────────────
router.post("/upload",             upload.single("timetable"), uploadTimetable);
router.get("/entries",             getEntries);
router.get("/clashes",             getClashes);
router.patch("/clashes/:id/resolve", resolveClash);
router.post("/clashes/resolve-all",  resolveAllClashes);
router.post("/publish",            publishTimetable);
router.get("/download/full",       downloadFullTimetable);

// ── Student routes ──────────────────────────────────────────
router.get("/published",           getPublishedStatus);
router.get("/student",             getStudentTimetable);       // ?batch=A1
router.get("/download/batch/:batch", downloadBatchTimetable);

module.exports = router;
