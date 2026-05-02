// Parses a single raw timetable cell string
// e.g. "LA1,A2(PH211)-G1/ANU"
export function parseEntryRaw(raw) {
  if (!raw || typeof raw !== "string") return null;
  raw = raw.trim().replace(/\n/g, "");
  const m = raw.match(/^([LTP])([\w,]+)\((\w+)\)-([^/\s,]+)\/(.+)$/);
  if (!m) return null;
  return {
    type: m[1],                                          // L / T / P
    batches: m[2].split(",").map(b => b.trim()).filter(Boolean),
    subject: m[3],
    venue: m[4],
    teacher: m[5].trim(),
    raw,
  };
}

// Parses all rows from sheet_to_json(ws, {header:1})
export function parseTimetableSheet(rows) {
  const TIME_MAP = {
    1: "9:00", 2: "10:00", 3: "11:00", 4: "12", 5: "LUNCH",
    6: "1:00", 7: "2:00", 8: "3:00", 9: "4:00",
  };
  const DAY_MAP = {
    MON: "Monday", TUE: "Tuesday", WED: "Wednesday",
    THU: "Thursday", FRI: "Friday", SAT: "Saturday",
  };

  const entries = [];
  let day = null;

  for (const row of rows) {
    if (!row) continue;
    const first = row[0] ? String(row[0]).trim() : "";
    if (DAY_MAP[first]) day = DAY_MAP[first];
    if (!day) continue;

    for (let c = 1; c <= 8; c++) {
      const cell = row[c];
      if (!cell) continue;
      const timeSlot = TIME_MAP[c];
      if (timeSlot === "LUNCH") continue;

      // A cell can have multiple entries separated by newlines
      const rawEntries = String(cell).split(/[\n|]/).map(s => s.trim()).filter(Boolean);
      for (const raw of rawEntries) {
        const parsed = parseEntryRaw(raw);
        if (parsed) entries.push({ ...parsed, day, time: timeSlot });
      }
    }
  }
  return entries;
}
