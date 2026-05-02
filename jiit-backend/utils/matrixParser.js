function parseCellText(text, timeSlot, dayOrProgram) {
  if (!text || typeof text !== "string") return null;
  // Clean up hidden characters and normalize spaces
  text = text.replace(/[\r\n]+/g, " ").trim();
  if (!text || text.toUpperCase() === "LUNCH") return null;

  // Expected format: [Type?][Batches]([Subject])-[Venue]/[Teacher]
  // E.g., "L B1,B2(CS311)-G2/AST" or "LB1,B2(CS311)-G2/AST"
  
  // Relaxed regex to handle spaces around separators and optional subject parentheses
  const m = text.match(/^\s*(?:([LTP])\s*)?([^\(-]+?)(?:\s*\(\s*([^)]+)\s*\))?\s*-\s*([^\/]+)\s*\/\s*(.+)$/i);
  if (!m) {
    // If it doesn't match the valid timetable template, throw it away.
    // This prevents "Unknown" garbage from populating the frontend.
    return null;
  }

  const typeMatch  = m[1] ? m[1].toUpperCase() : null; // L, T, P
  const batchesStr = m[2] ? m[2].trim() : "";
  const subjectStr = m[3] ? m[3].trim() : "";
  const venueStr   = m[4] ? m[4].trim() : "";
  const teacherStr = m[5] ? m[5].trim() : "";

  // Parse type from batches if not explicitly separated (e.g. "LB1" -> L, B1)
  let type = typeMatch;
  let cleanBatchesStr = batchesStr;
  let cleanSubjectStr = subjectStr || batchesStr; // Fallback for combined OE classes like LABC

  // ── Auto-Swap Heuristic for Subject(Batch) format ──────
  // If batchesStr looks like a Subject Code (e.g., PH633, 21HS411, CS101) 
  // AND subjectStr looks like a Batch (e.g., AB, ABC, B1, B2)
  // we intelligently swap them.
  const looksLikeSubject = /[A-Z]{2,}[0-9]{3}|[0-9]{2}[A-Z]{2}[0-9]{3}/i.test(batchesStr);
  const looksLikeBatch   = /^[A-Z]{1,3}[0-9]?$/i.test(subjectStr) || subjectStr.includes(',');
  
  if (looksLikeSubject && looksLikeBatch) {
    cleanBatchesStr = subjectStr;
    cleanSubjectStr = batchesStr;
  }
  
  if (!type) {
    if (batchesStr.toUpperCase().startsWith("L")) {
      type = "L";
      cleanBatchesStr = batchesStr.substring(1);
    } else if (batchesStr.toUpperCase().startsWith("T")) {
      type = "T";
      cleanBatchesStr = batchesStr.substring(1);
    } else if (batchesStr.toUpperCase().startsWith("P")) {
      type = "P";
      cleanBatchesStr = batchesStr.substring(1);
    } else {
      type = "L"; // default to lecture
    }
  }

  const batches = cleanBatchesStr.split(",").map(b => b.trim()).filter(Boolean);

  return {
    type,
    batches,
    subject: cleanSubjectStr,
    venue: venueStr,
    teacher: teacherStr, 
    time: timeSlot,
    day: dayOrProgram, 
    raw: text
  };
}

function parseMatrixSheet(rows) {
  const entries = [];
  if (!rows || rows.length === 0) return { entries, orderedDays: [], orderedTimes: [] };

  let headerRowIdx = -1;
  let timeColMap = {};

  // Scan first few rows to find the time-slot header row
  for (let r = 0; r < Math.min(rows.length, 10); r++) {
    const row = rows[r];
    if (!row) continue;
    let foundTimeCount = 0;
    const candidate = {};

    // Sort column keys numerically so left-to-right order is preserved
    const colKeys = Object.keys(row).sort((a, b) => Number(a) - Number(b));

    for (const c of colKeys) {
      const val = row[c];
      if (val && typeof val === 'string') {
        const up = val.toUpperCase().replace(/\s/g, '');
        if (up.includes("AM") || up.includes("PM") || /\d{1,2}:\d{2}/.test(up) || /\d{1,2}-\d{1,2}/.test(up)) {
          foundTimeCount++;
          candidate[c] = val.trim();
        }
      }
    }

    if (foundTimeCount >= 2) {
      headerRowIdx = r;
      timeColMap = candidate;
      break;
    }
  }

  if (headerRowIdx === -1 || Object.keys(timeColMap).length === 0) {
    return { entries, orderedDays: [], orderedTimes: [] };
  }

  // Build orderedTimes in exact left-to-right Excel column order
  const orderedTimes = Object.keys(timeColMap)
    .sort((a, b) => Number(a) - Number(b))
    .map(k => timeColMap[k]);

  // ── Pre-scan: find the FIRST day label that appears in column 0 after the header ──
  // Entries that appear BEFORE the first explicit day label still belong to that first day
  // (typical for Excel merged-cell timetables where "MON" is in a lower sub-row)
  let firstDayLabel = null;
  for (let r = headerRowIdx + 1; r < Math.min(rows.length, headerRowIdx + 30); r++) {
    const row = rows[r];
    if (!row || !row[0] || typeof row[0] !== 'string' || timeColMap[0]) continue;
    const label = row[0].replace(/[\r\n]+/g, " ").trim();
    if (label && label.length > 0) {
      firstDayLabel = label;
      break;
    }
  }

  const orderedDays = [];
  const seenDays = new Set();

  // Start currentDay as the first detected label (not "Unspecified Day") so
  // rows before the first explicit day label also get the correct day name
  let currentDay = firstDayLabel || "Unspecified Day";
  if (currentDay !== "Unspecified Day") {
    seenDays.add(currentDay);
    orderedDays.push(currentDay);
  }

  for (let r = headerRowIdx + 1; r < rows.length; r++) {
    const row = rows[r];
    if (!row) continue;

    // Column 0 holds the day/program label when it's not a time-slot column
    if (row[0] && typeof row[0] === 'string' && !timeColMap[0]) {
      const label = row[0].replace(/[\r\n]+/g, " ").trim();
      if (label && label !== currentDay) {
        currentDay = label;
        if (!seenDays.has(label)) {
          seenDays.add(label);
          orderedDays.push(label);
        }
      }
    }

    const colKeys = Object.keys(row).sort((a, b) => Number(a) - Number(b));
    for (const c of colKeys) {
      if (!timeColMap[c]) continue;
      const cellVal = row[c];
      if (!cellVal) continue;

      const timeSlot = timeColMap[c];
      const lines = String(cellVal).split(/[\n|]/).map(s => s.trim()).filter(Boolean);

      for (const line of lines) {
        const parsed = parseCellText(line, timeSlot, currentDay);
        if (parsed) entries.push(parsed);
      }
    }
  }

  return { entries, orderedDays, orderedTimes };
}

module.exports = { parseMatrixSheet, parseCellText };

