const XLSX = require("xlsx");
const path = require("path");
const { parseMatrixSheet } = require("../utils/matrixParser");
const { detectClashes } = require("../utils/clashDetector");
const { suggestSlots, autoSchedule, extractDomain } = require("../utils/constraintSolver");
const { exportFullTimetable, exportBatchTimetable } = require("../utils/excelExporter");
const TimetableVersion = require("../models/TimetableVersion");

// ── Helper to detect clashes and add suggestions efficiently ────────────────────
function detectClashesWithSuggestions(entries) {
  const clashes = detectClashes(entries);
  if (clashes.length === 0) return clashes;

  // Pre-calculate domain and slot index ONCE for all suggestions
  const domain = extractDomain(entries);
  const bySlot = {};
  for (const e of entries) {
    const k = e.day + '||' + e.time;
    if (!bySlot[k]) bySlot[k] = [];
    bySlot[k].push(e);
  }

  clashes.forEach(clash => {
    if (clash.entries.length > 0) {
      clash.suggestedSlots = suggestSlots(clash.entries[0], entries, domain, bySlot);
    }
  });

  return clashes;
}

// ── Order helpers (used when DB records lack stored orderedDays/orderedTimes) ──
function parseTimeValue(str) {
  if (!str) return 0;
  const up = str.toUpperCase();
  if (up.includes('LUNCH')) return 12.5;
  // HH:MM with optional AM/PM
  const colonMatch = str.match(/(\d{1,2}):(\d{2})/);
  if (colonMatch) {
    let h = parseInt(colonMatch[1], 10);
    const m = parseInt(colonMatch[2], 10);
    if (up.includes('PM') && h < 12) h += 12;
    if (up.includes('AM') && h === 12) h = 0;
    return h + m / 60;
  }
  // Plain range like "8-9", "11-12PM", "1-2PM"
  const numMatch = str.match(/\d+/);
  if (!numMatch) return 99;
  let hour = parseInt(numMatch[0], 10);
  if (up.includes('AM')) return hour; // explicit AM — trust it
  if (up.includes('PM') && hour < 12) {
    // "11-12PM": PM refers to end of range; start hour >= 8 is a morning slot
    if (hour >= 8) return hour; // e.g. 11-12PM → 11 (not 23)
    hour += 12;                  // e.g. 1-2PM → 13
  }
  // No AM/PM: heuristic — hours 1-7 are afternoon slots
  if (hour >= 1 && hour <= 7) hour += 12;
  return hour;
}

function smartSortTimes(times) {
  return [...times].sort((a, b) => parseTimeValue(a) - parseTimeValue(b));
}

const DAY_ORDER = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
function smartSortDays(days) {
  return [...days].sort((a, b) => {
    // "Unspecified Day" always comes first (it's the unlabelled first day)
    const aSpec = a.toLowerCase().includes('Mon');
    const bSpec = b.toLowerCase().includes('Mon');
    if (aSpec && !bSpec) return -1;
    if (!aSpec && bSpec) return 1;
    const ai = DAY_ORDER.findIndex(d => a.toLowerCase().startsWith(d));
    const bi = DAY_ORDER.findIndex(d => b.toLowerCase().startsWith(d));
    if (ai !== -1 && bi !== -1) return ai - bi;
    if (ai !== -1) return -1;
    if (bi !== -1) return 1;
    return a.localeCompare(b);
  });
}

// ── POST /api/timetable/upload ────────────────────────────────────────────────
const uploadTimetable = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) return res.status(400).json({ error: "No files uploaded" });

    let entries = [];
    let orderedDays = [];
    let orderedTimes = [];

    for (const file of req.files) {
      const wb = XLSX.read(file.buffer, { type: "buffer" });
      const ws = wb.Sheets[wb.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json(ws, { header: 1, defval: null });
      const parsed = parseMatrixSheet(rows);
      entries.push(...parsed.entries);
      // Merge ordered lists — keep first file's structure as primary, add new days/times not yet seen
      for (const d of parsed.orderedDays) { if (!orderedDays.includes(d)) orderedDays.push(d); }
      for (const t of parsed.orderedTimes) { if (!orderedTimes.includes(t)) orderedTimes.push(t); }
    }

    const clashes = detectClashesWithSuggestions(entries);

    const fileName = req.files.map(f => f.originalname).join(", ");
    const title = req.body.title || fileName || "Uploaded Timetable";

    const version = new TimetableVersion({
      title,
      fileName,
      entries,
      clashes,
      orderedDays,
      orderedTimes,
      status: 'draft'
    });
    version.save().catch(err => console.error("Background DB Save Error:", err));

    res.json({
      message: "Timetable uploaded and AI-analysed",
      id: version._id,
      entries: entries.length,
      clashes: clashes.length,
      venueClashes: clashes.filter(c => c.type === "venue").length,
      teacherClashes: clashes.filter(c => c.type === "teacher").length,
      batchClashes: clashes.filter(c => c.type === "batch").length,
      fileName: fileName,
      uploadedAt: version.uploadedAt,
      parsedEntries: entries,
      parsedClashes: clashes,
      orderedDays,
      orderedTimes,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to parse timetable: " + err.message });
  }
};

// ── GET /api/timetable/:id/entries ────────────────────────────────────────────────
const getEntries = async (req, res) => {
  try {
    const version = await TimetableVersion.findById(req.params.id);
    if (!version) return res.status(404).json({ error: "Not found" });

    // Use stored order if available; otherwise derive from entry data (backwards compat)
    let orderedDays = version.orderedDays && version.orderedDays.length ? version.orderedDays : null;
    let orderedTimes = version.orderedTimes && version.orderedTimes.length ? version.orderedTimes : null;

    if (!orderedTimes) {
      const allTimes = [...new Set(version.entries.map(e => e.time))].filter(Boolean);
      orderedTimes = smartSortTimes(allTimes);
    }
    if (!orderedDays) {
      const allDays = [...new Set(version.entries.map(e => e.day))].filter(Boolean);
      orderedDays = smartSortDays(allDays);
    }

    res.json({
      entries: version.entries,
      fileName: version.fileName,
      uploadedAt: version.uploadedAt,
      status: version.status,
      orderedDays,
      orderedTimes,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ── GET /api/timetable/:id/clashes ────────────────────────────────────────────────
const getClashes = async (req, res) => {
  try {
    const version = await TimetableVersion.findById(req.params.id);
    if (!version) return res.status(404).json({ error: "Not found" });
    res.json({
      clashes: version.clashes,
      pending: version.clashes.filter(c => c.status === "pending").length,
      resolved: version.clashes.filter(c => c.status === "resolved").length,
      total: version.clashes.length,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ── PATCH /api/timetable/:id/clashes/:clashId/resolve ────────────────────────
const resolveClash = async (req, res) => {
  try {
    const { id, clashId } = req.params;
    const version = await TimetableVersion.findById(id);
    if (!version) return res.status(404).json({ error: "Timetable not found" });

    const idx = parseInt(clashId, 10);
    if (idx < 0 || idx >= version.clashes.length) return res.status(404).json({ error: "Clash not found" });

    version.clashes[idx].status = "resolved";
    version.clashes[idx].resolvedBy = "manual";

    if (req.body && req.body.appliedChanges) {
      version.clashes[idx].appliedChanges = req.body.appliedChanges;

      req.body.appliedChanges.forEach(change => {
        const targetClashEntry = version.clashes[idx].entries[change.classIndex || 0];
        if (!targetClashEntry) return;

        const storeEntry = version.entries.find(e =>
          e.raw === targetClashEntry.raw &&
          e.day === targetClashEntry.day &&
          e.time === targetClashEntry.time
        );

        if (storeEntry) {
          if (change.field === 'time') {
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

    // Recalculate clashes dynamically with suggestions (optimized)
    const updatedClashes = detectClashesWithSuggestions(version.entries);
    version.clashes = updatedClashes;

    version.markModified('clashes');
    version.markModified('entries');
    await version.save();

    res.json({ 
      message: "Clash resolved", 
      clash: version.clashes[idx],
      clashes: version.clashes,
      entries: version.entries
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ── POST /api/timetable/:id/clashes/resolve-all ──────────────────────────────────
const resolveAllClashes = async (req, res) => {
  try {
    const version = await TimetableVersion.findById(req.params.id);
    if (!version) return res.status(404).json({ error: "Not found" });

    version.clashes = version.clashes.map(c => ({ ...c, status: "resolved", resolvedBy: "manual" }));
    version.markModified('clashes');
    await version.save();

    res.json({ 
      message: "All clashes resolved", 
      total: version.clashes.length,
      clashes: version.clashes,
      entries: version.entries
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ── PATCH /api/timetable/:id/entries/move ────────────────────────────────────
const moveEntry = async (req, res) => {
  try {
    const { raw, day, time, subject, newDay, newTime } = req.body;
    if (!raw || !newDay || !newTime) return res.status(400).json({ error: "Missing required fields" });

    const version = await TimetableVersion.findById(req.params.id);
    if (!version) return res.status(404).json({ error: "Not found" });

    let entryUpdated = false;
    for (let e of version.entries) {
      if (e.raw === raw && e.day === day && e.time === time && e.subject === subject) {
        e.day = newDay;
        e.time = newTime;
        entryUpdated = true;
        break;
      }
    }

    if (!entryUpdated) return res.status(404).json({ error: "Entry not found" });

    // Recalculate clashes dynamically with suggestions (optimized)
    const clashes = detectClashesWithSuggestions(version.entries);

    version.clashes = clashes;
    version.markModified('entries');
    version.markModified('clashes');
    await version.save();

    res.json({ 
      message: "Entry moved successfully", 
      clashes: clashes,
      entries: version.entries,
      totalClashes: clashes.length 
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ── POST /api/timetable/:id/auto-schedule ──────────────────────────────────
const autoScheduleTimetable = async (req, res) => {
  try {
    const version = await TimetableVersion.findById(req.params.id);
    if (!version) return res.status(404).json({ error: "Not found" });

    const resolvedEntries = autoSchedule(version.entries);
    const remainingClashes = detectClashes(resolvedEntries);

    version.entries = resolvedEntries;
    version.clashes = remainingClashes;
    version.markModified('entries');
    version.markModified('clashes');
    await version.save();

    res.json({
      message: "Auto-scheduler completed.",
      clashesRemaining: remainingClashes.length,
      totalEntries: resolvedEntries.length
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// ── POST /api/timetable/:id/publish ───────────────────────────────────────────────
const publishTimetable = async (req, res) => {
  try {
    const version = await TimetableVersion.findById(req.params.id);
    if (!version) return res.status(404).json({ error: "Not found" });

    const pending = version.clashes.filter(c => c.status === "pending").length;
    if (pending > 0)
      return res.status(400).json({
        error: `Cannot publish with ${pending} unresolved clashes. Please resolve all clashes first.`,
        pendingClashes: pending,
      });

    version.status = "published";
    version.publishedAt = new Date();
    await version.save();

    res.json({ message: "Timetable published successfully! Students can now view it.", publishedAt: version.publishedAt });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to publish to database: " + err.message });
  }
};

// ── GET /api/timetable/published ─────────────────────────────────────────────
const getPublishedStatus = async (req, res) => {
  try {
    // Legacy support
    const version = await TimetableVersion.findOne({ status: "published" });
    if (version) res.json({ published: true });
    else res.json({ published: false });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ── GET /api/timetable/student?batch=A1 ──────────────────────────────────────
const getStudentTimetable = async (req, res) => {
  const { batch, versionId } = req.query;
  if (!batch) return res.status(400).json({ error: "Batch query param required e.g. ?batch=A1" });

  try {
    let version;
    if (versionId && versionId !== "active") {
      version = await TimetableVersion.findById(versionId);
    } else {
      version = await TimetableVersion.findOne({ status: "published" }).sort({ publishedAt: -1 });
    }

    if (!version || version.status !== "published") return res.status(403).json({ error: "Timetable has not been published yet by admin." });

    const entries = version.entries.filter(e => e.batches.includes(batch));

    let orderedDays = version.orderedDays && version.orderedDays.length ? version.orderedDays : null;
    let orderedTimes = version.orderedTimes && version.orderedTimes.length ? version.orderedTimes : null;

    if (!orderedTimes) {
      const allTimes = [...new Set(version.entries.map(e => e.time))].filter(Boolean);
      orderedTimes = smartSortTimes(allTimes);
    }
    if (!orderedDays) {
      const allDays = [...new Set(version.entries.map(e => e.day))].filter(Boolean);
      orderedDays = smartSortDays(allDays);
    }

    res.json({
      batch,
      entries,
      total: entries.length,
      title: version.title,
      orderedDays,
      orderedTimes,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ── GET /api/timetable/versions ──────────────────────────────────────────────
const getTimetableVersions = async (req, res) => {
  try {
    const versions = await TimetableVersion.find({}, 'title fileName uploadedAt publishedAt status').sort({ uploadedAt: -1 });
    res.json(versions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ── GET /api/timetable/:id ──────────────────────────────────────────
const getVersionEntries = async (req, res) => {
  try {
    const version = await TimetableVersion.findById(req.params.id);
    if (!version) return res.status(404).json({ error: "Version not found" });
    res.json({ entries: version.entries, version });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ── POST /api/timetable/:id/restore ─────────────────────────────────
const restoreTimetable = async (req, res) => {
  res.json({ message: "Not implemented. Timetables are standalone." });
};

// ── DELETE /api/timetable/:id ─────────────────────────────────────────────────
const deleteTimetable = async (req, res) => {
  try {
    const version = await TimetableVersion.findByIdAndDelete(req.params.id);
    if (!version) return res.status(404).json({ error: "Timetable not found" });
    res.json({ message: "Timetable deleted successfully", id: req.params.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ── GET /api/timetable/:id/download/full ─────────────────────────────────────────
const downloadFullTimetable = async (req, res) => {
  try {
    const version = await TimetableVersion.findById(req.params.id);
    if (!version) return res.status(404).json({ error: "Not found" });

    const buf = await exportFullTimetable(version.entries, version.clashes, version.orderedDays, version.orderedTimes);
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", `attachment; filename="Timetable_${version.title}.xlsx"`);
    res.send(buf);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to generate Excel: " + err.message });
  }
};

// ── GET /api/timetable/:id/download/batch/:batch ─────────────────────────────────
const downloadBatchTimetable = async (req, res) => {
  try {
    const version = await TimetableVersion.findById(req.params.id);
    if (!version || version.status !== "published")
      return res.status(403).json({ error: "Timetable not published yet." });

    const { batch } = req.params;
    const buf = await exportBatchTimetable(version.entries, batch, version.orderedDays, version.orderedTimes);
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", `attachment; filename="${version.title}_Batch_${batch}.xlsx"`);
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
  getTimetableVersions,
  getVersionEntries,
  restoreTimetable,
  deleteTimetable,
};