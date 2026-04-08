const XLSX = require("xlsx");
const path = require("path");
const { parseMatrixSheet } = require("../utils/matrixParser");
const { detectClashes }       = require("../utils/clashDetector");
const { suggestSlots, autoSchedule } = require("../utils/constraintSolver");
const { exportFullTimetable, exportBatchTimetable } = require("../utils/excelExporter");

// In-memory store
let store = {
  entries:    [],
  clashes:    [],
  published:  false,
  fileName:   "",
  uploadedAt: null,
  publishedAt: null,
};



// ── POST /api/timetable/upload ────────────────────────────────────────────────
const uploadTimetable = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) return res.status(400).json({ error: "No files uploaded" });

    let entries = [];
    for (const file of req.files) {
      const wb   = XLSX.read(file.buffer, { type: "buffer" });
      const ws   = wb.Sheets[wb.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json(ws, { header: 1, defval: null });
      entries.push(...parseMatrixSheet(rows));
    }

    const clashes = detectClashes(entries);

    // Attach CSP solver suggestions to each clash instantly
    clashes.forEach(clash => {
      if (clash.entries.length > 0) {
        clash.suggestedSlots = suggestSlots(clash.entries[0], entries);
      }
    });



    store.entries    = entries;
    store.clashes    = clashes;
    store.published  = false;
    store.fileName   = req.files.map(f => f.originalname).join(", ");
    store.uploadedAt = new Date();

    res.json({
      message:        "Timetable uploaded and AI-analysed",
      entries:        entries.length,
      clashes:        clashes.length,
      venueClashes:   clashes.filter(c => c.type === "venue").length,
      teacherClashes: clashes.filter(c => c.type === "teacher").length,
      batchClashes:   clashes.filter(c => c.type === "batch").length,
      fileName:       store.fileName,
      uploadedAt:     store.uploadedAt,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to parse timetable: " + err.message });
  }
};

// ── GET /api/timetable/entries ────────────────────────────────────────────────
const getEntries = (req, res) => {
  res.json({ entries: store.entries, fileName: store.fileName, uploadedAt: store.uploadedAt });
};

// ── GET /api/timetable/clashes ────────────────────────────────────────────────
const getClashes = (req, res) => {
  res.json({
    clashes:  store.clashes,
    pending:  store.clashes.filter(c => c.status === "pending").length,
    resolved: store.clashes.filter(c => c.status === "resolved").length,
    total:    store.clashes.length,
  });
};

// ── PATCH /api/timetable/clashes/:id/resolve ─────────────────────────────────
const resolveClash = (req, res) => {
  const { id } = req.params;
  const idx = store.clashes.findIndex((_, i) => String(i) === id);
  if (idx === -1) return res.status(404).json({ error: "Clash not found" });
  
  const clash = store.clashes[idx];
  clash.status     = "resolved";
  clash.resolvedBy = "manual";

  if (req.body && req.body.appliedChanges) {
    clash.appliedChanges = req.body.appliedChanges;
    clash.appliedChanges = req.body.appliedChanges;

    // Physically mutate the store entries so the grid updates
    req.body.appliedChanges.forEach(change => {
      const targetClashEntry = clash.entries[change.classIndex || 0];
      if (!targetClashEntry) return;

      const storeEntry = store.entries.find(e => 
        e.raw === targetClashEntry.raw && 
        e.day === targetClashEntry.day && 
        e.time === targetClashEntry.time
      );

      if (storeEntry) {
        if (change.field === 'time') {
          // CSP frontend sends format "Day Time" in newValue (e.g. "MON 9:00AM")
          const parts = String(change.newValue).split(" ");
          if (parts.length >= 2) {
            const newDay = parts[0];
            const newTime = parts.slice(1).join(" ");
            storeEntry.day = newDay;
            storeEntry.time = newTime;
            targetClashEntry.day = newDay;
            targetClashEntry.time = newTime;
          }
        } else if (change.field === 'venue') {
          storeEntry.venue = change.newValue;
          targetClashEntry.venue = change.newValue;
        }
      }
    });
  }

  res.json({ message: "Clash resolved", clash });
};

// ── POST /api/timetable/clashes/resolve-all ──────────────────────────────────
const resolveAllClashes = (req, res) => {
  store.clashes = store.clashes.map(c => ({ ...c, status: "resolved", resolvedBy: "manual" }));
  res.json({ message: "All clashes resolved", total: store.clashes.length });
};

// ── NEW: PATCH /api/timetable/entries/move ────────────────────────────────────
const moveEntry = (req, res) => {
  const { raw, day, time, subject, newDay, newTime } = req.body;
  if (!raw || !newDay || !newTime) return res.status(400).json({ error: "Missing required fields" });

  let entryUpdated = false;
  
  // Find the exact entry in the store and update its day/time
  for (let e of store.entries) {
    if (e.raw === raw && e.day === day && e.time === time && e.subject === subject) {
      e.day = newDay;
      e.time = newTime;
      entryUpdated = true;
      break; 
    }
  }

  if (!entryUpdated) return res.status(404).json({ error: "Entry not found" });

  // Recalculate clashes
  const clashes = detectClashes(store.entries);

  // Attach CSP solver suggestions to new clashes so the UI can still show them
  clashes.forEach(clash => {
    if (clash.entries.length > 0) {
      clash.suggestedSlots = suggestSlots(clash.entries[0], store.entries);
    }
  });

  store.clashes = clashes;

  res.json({ message: "Entry moved successfully", clashes: store.clashes.length });
};



// ── NEW: POST /api/timetable/auto-schedule ──────────────────────────────────
const autoScheduleTimetable = (req, res) => {
  if (!store.entries.length)
    return res.status(400).json({ error: "No timetable to schedule. Upload first." });

  const resolvedEntries = autoSchedule(store.entries);
  const remainingClashes = detectClashes(resolvedEntries);
  
  // Apply changes to store
  store.entries = resolvedEntries;
  store.clashes = remainingClashes;

  res.json({
    message: "Auto-scheduler completed.",
    clashesRemaining: remainingClashes.length,
    totalEntries: resolvedEntries.length
  });
};


// ── POST /api/timetable/publish ───────────────────────────────────────────────
const publishTimetable = (req, res) => {
  if (!store.entries.length)
    return res.status(400).json({ error: "No timetable to publish. Upload first." });

  const pending = store.clashes.filter(c => c.status === "pending").length;
  if (pending > 0)
    return res.status(400).json({
      error: `Cannot publish with ${pending} unresolved clashes. Please resolve all clashes first.`,
      pendingClashes: pending,
    });

  store.published  = true;
  store.publishedAt = new Date();
  res.json({ message: "Timetable published successfully! Students can now view it.", publishedAt: store.publishedAt });
};

// ── GET /api/timetable/published ─────────────────────────────────────────────
const getPublishedStatus = (req, res) => {
  res.json({
    published:    store.published,
    publishedAt:  store.publishedAt || null,
    fileName:     store.fileName,
    totalEntries: store.entries.length,
  });
};

// ── GET /api/timetable/student?batch=A1 ──────────────────────────────────────
const getStudentTimetable = (req, res) => {
  if (!store.published)
    return res.status(403).json({ error: "Timetable has not been published yet by admin." });

  const { batch } = req.query;
  if (!batch) return res.status(400).json({ error: "Batch query param required e.g. ?batch=A1" });

  const entries = store.entries.filter(e => e.batches.includes(batch));
  res.json({ batch, entries, total: entries.length });
};

// ── GET /api/timetable/download/full ─────────────────────────────────────────
const downloadFullTimetable = async (req, res) => {
  try {
    if (!store.entries.length)
      return res.status(400).json({ error: "No timetable data. Upload first." });

    const buf = await exportFullTimetable(store.entries, store.clashes);
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", 'attachment; filename="JIIT_Timetable_Resolved.xlsx"');
    res.send(buf);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to generate Excel: " + err.message });
  }
};

// ── GET /api/timetable/download/batch/:batch ─────────────────────────────────
const downloadBatchTimetable = async (req, res) => {
  try {
    if (!store.published)
      return res.status(403).json({ error: "Timetable not published yet." });

    const { batch } = req.params;
    const buf = await exportBatchTimetable(store.entries, batch);
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", `attachment; filename="JIIT_Timetable_Batch_${batch}.xlsx"`);
    res.send(buf);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to generate Excel: " + err.message });
  }
};

module.exports = {
  uploadTimetable,
  getEntries,
  getClashes,
  resolveClash,
  resolveAllClashes,
  moveEntry,
  autoScheduleTimetable,
  publishTimetable,
  getPublishedStatus,
  getStudentTimetable,
  downloadFullTimetable,
  downloadBatchTimetable,
};