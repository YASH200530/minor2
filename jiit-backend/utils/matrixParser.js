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
  if (!rows || rows.length === 0) return entries;
  
  let headerRowIdx = 0;
  let timeColumns = {}; 
  
  // Scan first few rows to find the true time slot header mappings
  for (let r = 0; r < Math.min(rows.length, 10); r++) {
    const row = rows[r];
    if (!row) continue;
    let foundTimeCount = 0;
    
    for (const c of Object.keys(row)) {
      const val = row[c];
      if (val && typeof val === 'string') {
        const up = val.toUpperCase().replace(/\s/g, '');
        // strict check: contains AM, PM, or matches digit-digit pattern
        if (up.includes("AM") || up.includes("PM") || /\d{1,2}:\d{2}/.test(up) || /\d{1,2}-\d{1,2}/.test(up)) {
          foundTimeCount++;
          timeColumns[c] = val.trim();
        }
      }
    }
    // We assume it's the header row if we find at least 2 time slots
    if (foundTimeCount >= 2) {
      headerRowIdx = r;
      break;
    } else {
      // reset if it was a false positive row
      timeColumns = {};
    }
  }
  
  // Default fallback if we didn't firmly find a header row
  if (Object.keys(timeColumns).length === 0) {
    return entries; // Could not find a valid time grid
  }

  let currentDayOrProg = "Unspecified Day";
  
  // Loop through rows below the header
  for (let r = headerRowIdx + 1; r < rows.length; r++) {
    const row = rows[r];
    if (!row) continue;
    
    // Check if column 0 holds a row banner (like a Day or Program)
    if (row[0] && typeof row[0] === 'string' && !timeColumns[0]) {
       currentDayOrProg = row[0].replace(/[\r\n]+/g, " ").trim();
    }
    
    for (const c of Object.keys(row)) {
      if (!timeColumns[c]) continue; 
      const cellVal = row[c];
      if (!cellVal) continue;
      
      const timeSlot = timeColumns[c];
      const lines = String(cellVal).split(/[\n|]/).map(s => s.trim()).filter(Boolean);
      
      for (const line of lines) {
        const parsed = parseCellText(line, timeSlot, currentDayOrProg);
        if (parsed) entries.push(parsed);
      }
    }
  }
  
  return entries;
}

module.exports = { parseMatrixSheet, parseCellText };
