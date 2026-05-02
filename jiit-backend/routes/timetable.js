const express = require("express");
const multer  = require("multer");
const router  = express.Router();

const {
  uploadTimetable,
  getEntries,
  getClashes,
  moveEntry,
  resolveClash,
  resolveAllClashes,

  autoScheduleTimetable,
  publishTimetable,
  getTimetableVersions,
  getVersionEntries,
  restoreTimetable,
  deleteTimetable,
  getPublishedStatus,
  getStudentTimetable,
  downloadFullTimetable,
  downloadBatchTimetable,
} = require("../controllers/timetableController");

// Multer: store file in memory
const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    if (file.mimetype.includes("spreadsheet") || file.originalname.endsWith(".xlsx") || file.originalname.endsWith(".xls")) {
      cb(null, true);
    } else {
      cb(new Error("Only Excel files (.xlsx/.xls) are allowed"));
    }
  },
  limits: { fileSize: 10 * 1024 * 1024 },
});

// ── Static routes MUST come before /:id wildcard ────────────
router.get("/published",             getPublishedStatus);
router.get("/student",               getStudentTimetable);

// ── Admin routes ─────────────────────────────────────────────
router.post("/upload",               upload.array("timetable", 20), uploadTimetable);
router.get("/versions",              getTimetableVersions);

router.get("/:id/entries",               getEntries);
router.get("/:id/clashes",               getClashes);
router.patch("/:id/entries/move",        moveEntry);
router.patch("/:id/clashes/:clashId/resolve", resolveClash);
router.post("/:id/clashes/resolve-all",  resolveAllClashes);

router.post("/:id/auto-schedule",        autoScheduleTimetable);
router.post("/:id/publish",              publishTimetable);
router.get("/:id/download/full",         downloadFullTimetable);
router.get("/:id/download/batch/:batch", downloadBatchTimetable);

router.get("/:id",                   getVersionEntries);
router.post("/:id/restore",          restoreTimetable);
router.delete("/:id",                deleteTimetable);

module.exports = router;