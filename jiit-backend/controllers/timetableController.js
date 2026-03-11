const XLSX = require("xlsx");
const path = require("path");
const { parseTimetableSheet } = require("../utils/parser");
const { detectClashes }       = require("../utils/clashDetector");
const { exportFullTimetable, exportBatchTimetable } = require("../utils/excelExporter");

// In-memory store (replace with MongoDB in production)
let store = {
  entries:   [],
  clashes:   [],
  published: false,
  fileName:  "",
  uploadedAt: null,
};

// POST /api/timetable/upload
const uploadTimetable = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const wb   = XLSX.read(req.file.buffer, { type: "buffer" });
    const ws   = wb.Sheets[wb.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(ws, { header: 1, defval: null });

    const entries = parseTimetableSheet(rows);
    const clashes = detectClashes(entries);

    store.entries    = entries;
    store.clashes    = clashes;
    store.published  = false;
    store.fileName   = req.file.originalname;
    store.uploadedAt = new Date();

    res.json({
      message:   "Timetable uploaded and analyzed",
      entries:   entries.length,
      clashes:   clashes.length,
      venueClashes:   clashes.filter(c => c.type === "venue").length,
      teacherClashes: clashes.filter(c => c.type === "teacher").length,
      batchClashes:   clashes.filter(c => c.type === "batch").length,
      fileName:  store.fileName,
      uploadedAt: store.uploadedAt,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to parse timetable: " + err.message });
  }
};

// GET /api/timetable/entries
const getEntries = (req, res) => {
  res.json({ entries: store.entries, fileName: store.fileName, uploadedAt: store.uploadedAt });
};

// GET /api/timetable/clashes
const getClashes = (req, res) => {
  res.json({
    clashes:   store.clashes,
    pending:   store.clashes.filter(c => c.status === "pending").length,
    resolved:  store.clashes.filter(c => c.status === "resolved").length,
    total:     store.clashes.length,
  });
};

// PATCH /api/timetable/clashes/:id/resolve  — resolve one clash
const resolveClash = (req, res) => {
  const { id } = req.params;
  const clash = store.clashes.find(c => c.type + "-" + c.day + "-" + c.time + "-" + c.detail === id
    || c._id === id);

  // Find by index if direct match fails
  const idx = store.clashes.findIndex((_, i) => String(i) === id);
  if (idx === -1) return res.status(404).json({ error: "Clash not found" });

  store.clashes[idx].status = "resolved";
  res.json({ message: "Clash resolved", clash: store.clashes[idx] });
};

// POST /api/timetable/clashes/resolve-all  — resolve all pending clashes
const resolveAllClashes = (req, res) => {
  store.clashes = store.clashes.map(c => ({ ...c, status: "resolved" }));
  res.json({ message: "All clashes resolved", total: store.clashes.length });
};

// POST /api/timetable/publish  — admin publishes timetable to students
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

// GET /api/timetable/published  — students check if timetable is published
const getPublishedStatus = (req, res) => {
  res.json({
    published:   store.published,
    publishedAt: store.publishedAt || null,
    fileName:    store.fileName,
    totalEntries: store.entries.length,
  });
};

// GET /api/timetable/student?batch=A1  — student gets their timetable
const getStudentTimetable = (req, res) => {
  if (!store.published)
    return res.status(403).json({ error: "Timetable has not been published yet by admin." });

  const { batch } = req.query;
  if (!batch) return res.status(400).json({ error: "Batch query param required e.g. ?batch=A1" });

  const entries = store.entries.filter(e => e.batches.includes(batch));
  res.json({ batch, entries, total: entries.length });
};

// GET /api/timetable/download/full  — admin downloads full resolved timetable
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

// GET /api/timetable/download/batch/:batch  — student downloads their batch timetable
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
  publishTimetable,
  getPublishedStatus,
  getStudentTimetable,
  downloadFullTimetable,
  downloadBatchTimetable,
};
