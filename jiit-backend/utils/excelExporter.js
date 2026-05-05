const ExcelJS = require("exceljs");

const SUBJECT_NAMES = {
  CI121:"Computing Fundamentals", PH211:"Engineering Physics",
  MA211:"Engineering Maths", HS111:"Communication Skills",
  GE112:"Workshop/Sport", PH271:"Physics Lab", CS121:"Computing Lab",
  MA212:"Maths-II", PH212:"Physics-II",
};

const TIME_SLOTS = ["9:00","10:00","11:00","LUNCH","1:00","2:00","3:00","4:00"];
const DAYS = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

// Build grid from entries
function buildGrid(entries, days, times) {
  const grid = {};
  days.forEach(d => times.forEach(t => { grid[`${d}||${t}`] = []; }));
  entries.forEach(e => {
    const k = `${e.day}||${e.time}`;
    if (grid[k] !== undefined) grid[k].push(e);
  });
  return grid;
}

// Export full timetable (all batches) - for admin download
async function exportFullTimetable(entries, clashes = [], orderedDays, orderedTimes) {
  const finalDays = (orderedDays && orderedDays.length) ? orderedDays : DAYS;
  const finalTimes = (orderedTimes && orderedTimes.length) ? orderedTimes : TIME_SLOTS;

  const wb = new ExcelJS.Workbook();
  wb.creator = "JIIT SmartSched AI";
  wb.created = new Date();

  const clashSet = new Set();
  clashes.filter(c => c.status === "pending")
    .forEach(c => c.entries.forEach(e => clashSet.add(`${e.day}||${e.time}||${e.raw}`)));

  const ws = wb.addWorksheet("B.TECH II SEM - RESOLVED", {
    pageSetup: { paperSize: 9, orientation: "landscape", fitToPage: true },
  });

  // Title row
  ws.mergeCells("A1:I1");
  ws.getCell("A1").value = "B.TECH II SEMESTER EVEN 2026 — JIIT SMARTSCHED AI (RESOLVED)";
  ws.getCell("A1").font = { bold: true, size: 14, color: { argb: "FFFFFFFF" } };
  ws.getCell("A1").fill = { type:"pattern", pattern:"solid", fgColor:{ argb:"FF7C3AED" } };
  ws.getCell("A1").alignment = { horizontal:"center", vertical:"middle" };
  ws.getRow(1).height = 32;

  // Header row
  const headers = ["Day", ...finalTimes];
  const headerRow = ws.addRow(headers);
  headerRow.eachCell(cell => {
    cell.font = { bold: true, color: { argb: "FFFFFFFF" }, size: 10 };
    cell.fill = { type:"pattern", pattern:"solid", fgColor:{ argb:"FF1E1A3A" } };
    cell.alignment = { horizontal:"center", vertical:"middle", wrapText: true };
    cell.border = {
      top:{style:"thin",color:{argb:"FF7C3AED"}},
      bottom:{style:"thin",color:{argb:"FF7C3AED"}},
      left:{style:"thin",color:{argb:"FF333333"}},
      right:{style:"thin",color:{argb:"FF333333"}},
    };
  });
  ws.getRow(2).height = 24;

  const grid = buildGrid(entries, finalDays, finalTimes);

  // Day rows
  for (const day of finalDays) {
    // Find max entries in any slot for this day
    let maxEntries = 1;
    finalTimes.forEach(t => {
      const cells = grid[`${day}||${t}`] || [];
      if (cells.length > maxEntries) maxEntries = cells.length;
    });

    for (let i = 0; i < maxEntries; i++) {
      const rowData = [i === 0 ? day : ""];
      for (const time of finalTimes) {
        if (time.toUpperCase() === "LUNCH") { rowData.push(i === 0 ? "LUNCH BREAK" : ""); continue; }
        const cells = grid[`${day}||${time}`] || [];
        const cell  = cells[i];
        rowData.push(cell
          ? `${cell.type}${cell.batches.join(",")}(${cell.subject})-${cell.venue}/${cell.teacher}`
          : "");
      }
      const row = ws.addRow(rowData);

      row.eachCell((cell, colNum) => {
        const isLunch = headers[colNum - 1] === "LUNCH";
        const isDay   = colNum === 1;
        const isClash = (() => {
          const timeSlot = headers[colNum - 1];
          const entries2 = grid[`${day}||${timeSlot}`] || [];
          const e = entries2[i];
          return e && clashSet.has(`${e.day}||${e.time}||${e.raw}`);
        })();

        cell.font = {
          size: 9,
          bold: isDay,
          color: { argb: isClash ? "FFFF0000" : isDay ? "FFFFFFFF" : "FFE5E7EB" },
        };
        cell.fill = {
          type:"pattern", pattern:"solid",
          fgColor: { argb: isClash ? "FF2D0000" : isDay ? "FF1E1A3A" : isLunch ? "FF111111" : "FF0D0D0D" },
        };
        cell.alignment = { horizontal:"center", vertical:"middle", wrapText: true };
        cell.border = {
          top:{style:"hair",color:{argb:"FF222222"}},
          bottom:{style:"hair",color:{argb:"FF222222"}},
          left:{style:"hair",color:{argb:"FF222222"}},
          right:{style:"hair",color:{argb:"FF222222"}},
        };
      });
      row.height = 28;
    }
  }

  // Column widths
  ws.getColumn(1).width = 12;
  for (let c = 2; c <= headers.length; c++) ws.getColumn(c).width = 22;

  const buf = await wb.xlsx.writeBuffer();
  return buf;
}

// Export timetable for a specific batch - for student download
async function exportBatchTimetable(entries, batch, orderedDays, orderedTimes) {
  const finalDays = (orderedDays && orderedDays.length) ? orderedDays : DAYS;
  const finalTimes = (orderedTimes && orderedTimes.length) ? orderedTimes : TIME_SLOTS;

  const filtered = entries.filter(e => e.batches.includes(batch));
  const wb = new ExcelJS.Workbook();
  wb.creator = "JIIT SmartSched AI";

  const ws = wb.addWorksheet(`Batch ${batch}`, {
    pageSetup: { paperSize: 9, orientation: "landscape" },
  });

  // Title
  ws.mergeCells("A1:I1");
  ws.getCell("A1").value = `B.TECH II SEM EVEN 2026 — BATCH ${batch} — JIIT SmartSched`;
  ws.getCell("A1").font = { bold: true, size: 13, color: { argb: "FFFFFFFF" } };
  ws.getCell("A1").fill = { type:"pattern", pattern:"solid", fgColor:{ argb:"FF7C3AED" } };
  ws.getCell("A1").alignment = { horizontal:"center", vertical:"middle" };
  ws.getRow(1).height = 30;

  // Header
  const headers = ["Day", ...finalTimes];
  const headerRow = ws.addRow(headers);
  headerRow.eachCell(cell => {
    cell.font = { bold: true, color: { argb: "FFFFFFFF" }, size: 10 };
    cell.fill = { type:"pattern", pattern:"solid", fgColor:{ argb:"FF1E1A3A" } };
    cell.alignment = { horizontal:"center", vertical:"middle" };
    cell.border = {
      top:{style:"thin",color:{argb:"FF7C3AED"}},
      bottom:{style:"thin",color:{argb:"FF7C3AED"}},
      left:{style:"thin",color:{argb:"FF333333"}},
      right:{style:"thin",color:{argb:"FF333333"}},
    };
  });
  ws.getRow(2).height = 22;

  const grid = buildGrid(filtered, finalDays, finalTimes);

  // Colour map for subjects
  const SUBJECT_COLORS = {
    CI121:"FF22C55E", PH211:"FF3B82F6", MA211:"FF8B5CF6",
    HS111:"FFF59E0B", GE112:"FFEC4899", PH271:"FF06B6D4",
    CS121:"FF14B8A6", MA212:"FFA855F7", PH212:"FF6366F1",
  };

  for (const day of finalDays) {
    let maxEntries = 1;
    finalTimes.forEach(t => {
      const cells = grid[`${day}||${t}`] || [];
      if (cells.length > maxEntries) maxEntries = cells.length;
    });

    for (let i = 0; i < maxEntries; i++) {
      const rowData = [i === 0 ? day : ""];
      for (const time of finalTimes) {
        if (time.toUpperCase() === "LUNCH") { rowData.push(i === 0 ? "LUNCH BREAK" : ""); continue; }
        const cells = grid[`${day}||${time}`] || [];
        const cell  = cells[i];
        if (cell) {
          const typeLabel = cell.type === "L" ? "Lecture" : cell.type === "T" ? "Tutorial" : "Practical";
          rowData.push(`${typeLabel}\n${SUBJECT_NAMES[cell.subject] || cell.subject}\nRoom: ${cell.venue}\nTeacher: ${cell.teacher}`);
        } else {
          rowData.push("");
        }
      }
      const row = ws.addRow(rowData);

      row.eachCell((cell, colNum) => {
        const time = headers[colNum - 1];
        const isLunch = time === "LUNCH";
        const isDay   = colNum === 1;
        const entries2 = grid[`${day}||${time}`] || [];
        const entry = entries2[i];
        const subjectColor = entry ? (SUBJECT_COLORS[entry.subject] || "FF7C3AED") : null;

        cell.font = {
          size: 9, bold: isDay,
          color: { argb: isDay ? "FFFFFFFF" : "FF111111" },
        };
        cell.fill = {
          type:"pattern", pattern:"solid",
          fgColor: { argb: isDay ? "FF1E1A3A" : isLunch ? "FFFFFBEB" : subjectColor ? `${subjectColor}33` : "FFFFFFFF" },
        };
        cell.alignment = { horizontal:"center", vertical:"middle", wrapText: true };
        cell.border = {
          top:{style:"thin",color:{argb:"FFE5E7EB"}},
          bottom:{style:"thin",color:{argb:"FFE5E7EB"}},
          left:{style:"thin",color:{argb:"FFE5E7EB"}},
          right:{style:"thin",color:{argb:"FFE5E7EB"}},
        };
        if (entry && subjectColor) {
          cell.font.color = { argb: `FF${subjectColor.slice(2)}` };
          cell.font.bold  = true;
        }
      });
      row.height = 52;
    }
  }

  ws.getColumn(1).width = 12;
  for (let c = 2; c <= headers.length; c++) ws.getColumn(c).width = 20;

  const buf = await wb.xlsx.writeBuffer();
  return buf;
}

module.exports = { exportFullTimetable, exportBatchTimetable };
