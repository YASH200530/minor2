// All API calls to the backend
const BASE = "http://localhost:5000/api/timetable";

// Helper: download a blob as a file
export function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a   = document.createElement("a");
  a.href    = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// ── Admin ────────────────────────────────────────────────────

// Upload Excel file → backend parses + detects clashes
export async function uploadTimetable(file) {
  const fd = new FormData();
  fd.append("timetable", file);
  const res = await fetch(`${BASE}/upload`, { method:"POST", body: fd });
  if (!res.ok) throw new Error((await res.json()).error);
  return res.json();
}

// Get all parsed entries
export async function getEntries() {
  const res = await fetch(`${BASE}/entries`);
  if (!res.ok) throw new Error((await res.json()).error);
  return res.json();
}

// Get all clashes with their current status
export async function getClashes() {
  const res = await fetch(`${BASE}/clashes`);
  if (!res.ok) throw new Error((await res.json()).error);
  return res.json();
}

// Resolve a single clash by its index
export async function resolveClash(index) {
  const res = await fetch(`${BASE}/clashes/${index}/resolve`, { method:"PATCH" });
  if (!res.ok) throw new Error((await res.json()).error);
  return res.json();
}

// Resolve all pending clashes at once
export async function resolveAllClashes() {
  const res = await fetch(`${BASE}/clashes/resolve-all`, { method:"POST" });
  if (!res.ok) throw new Error((await res.json()).error);
  return res.json();
}

// Publish timetable so students can see it
export async function publishTimetable() {
  const res = await fetch(`${BASE}/publish`, { method:"POST" });
  if (!res.ok) throw new Error((await res.json()).error);
  return res.json();
}

// Admin downloads full resolved timetable as Excel
export async function downloadFullTimetable() {
  const res = await fetch(`${BASE}/download/full`);
  if (!res.ok) throw new Error((await res.json()).error);
  const blob = await res.blob();
  downloadBlob(blob, "JIIT_Timetable_Resolved.xlsx");
}

// ── Student ──────────────────────────────────────────────────

// Check if timetable has been published by admin
export async function getPublishedStatus() {
  const res = await fetch(`${BASE}/published`);
  if (!res.ok) throw new Error((await res.json()).error);
  return res.json();
}

// Get timetable entries for a specific batch
export async function getStudentTimetable(batch) {
  const res = await fetch(`${BASE}/student?batch=${batch}`);
  if (!res.ok) throw new Error((await res.json()).error);
  return res.json();
}

// Student downloads their batch timetable as Excel
export async function downloadBatchTimetable(batch) {
  const res = await fetch(`${BASE}/download/batch/${batch}`);
  if (!res.ok) throw new Error((await res.json()).error);
  const blob = await res.blob();
  downloadBlob(blob, `JIIT_Timetable_Batch_${batch}.xlsx`);
}
