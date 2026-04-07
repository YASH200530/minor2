// All API calls to the backend
const BASE = "http://localhost:5000/api/timetable";

// Helper: trigger a file download from a Blob
export function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a   = document.createElement("a");
  a.href     = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// ── Admin ────────────────────────────────────────────────────

export async function uploadTimetable(file) {
  const fd = new FormData();
  fd.append("timetable", file);
  const res = await fetch(`${BASE}/upload`, { method: "POST", body: fd });
  if (!res.ok) throw new Error((await res.json()).error);
  return res.json();
}

export async function getEntries() {
  const res = await fetch(`${BASE}/entries`);
  if (!res.ok) throw new Error((await res.json()).error);
  return res.json();
}

export async function getClashes() {
  const res = await fetch(`${BASE}/clashes`);
  if (!res.ok) throw new Error((await res.json()).error);
  return res.json();
}

export async function resolveClash(index, options = {}) {
  const res = await fetch(`${BASE}/clashes/${index}/resolve`, { 
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(options)
  });
  if (!res.ok) throw new Error((await res.json()).error);
  return res.json();
}

export async function resolveAllClashes() {
  const res = await fetch(`${BASE}/clashes/resolve-all`, { method: "POST" });
  if (!res.ok) throw new Error((await res.json()).error);
  return res.json();
}


export async function publishTimetable() {
  const res = await fetch(`${BASE}/publish`, { method: "POST" });
  if (!res.ok) throw new Error((await res.json()).error);
  return res.json();
}

export async function downloadFullTimetable() {
  const res = await fetch(`${BASE}/download/full`);
  if (!res.ok) throw new Error((await res.json()).error);
  const blob = await res.blob();
  downloadBlob(blob, "JIIT_Timetable_Resolved.xlsx");
}

// ── Student ──────────────────────────────────────────────────

export async function getPublishedStatus() {
  const res = await fetch(`${BASE}/published`);
  if (!res.ok) throw new Error((await res.json()).error);
  return res.json();
}

export async function getStudentTimetable(batch) {
  const res = await fetch(`${BASE}/student?batch=${batch}`);
  if (!res.ok) throw new Error((await res.json()).error);
  return res.json();
}

export async function downloadBatchTimetable(batch) {
  const res = await fetch(`${BASE}/download/batch/${batch}`);
  if (!res.ok) throw new Error((await res.json()).error);
  const blob = await res.blob();
  downloadBlob(blob, `JIIT_Timetable_Batch_${batch}.xlsx`);
}