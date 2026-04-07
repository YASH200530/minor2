function detectClashes(entries) {
  const clashes = [];
  const bySlot  = {};
  entries.forEach(e => {
    const k = `${e.day}||${e.time}`;
    (bySlot[k] = bySlot[k] || []).push(e);
  });

  Object.entries(bySlot).forEach(([key, slot]) => {
    const [day, time] = key.split("||");

    // 1. Venue clash
    const vm = {};
    slot.forEach(e => (vm[e.venue] = vm[e.venue] || []).push(e));
    Object.entries(vm).forEach(([venue, es]) => {
      if (es.length > 1)
        clashes.push({
          type: "venue", label: "Venue Clash", day, time,
          detail: `Room ${venue}`,
          desc: `Room ${venue} is double-booked by ${es.length} classes simultaneously`,
          suggestion: `Move ${es[1].subject}(${es[1].batches.join(",")}) to an available alternate room`,
          entries: es, status: "pending",
        });
    });

    // 2. Teacher clash
    const tm = {};
    slot.forEach(e => e.teacher.split("/").forEach(t => (tm[t.trim()] = tm[t.trim()] || []).push(e)));
    Object.entries(tm).forEach(([teacher, es]) => {
      if (es.length > 1)
        clashes.push({
          type: "teacher", label: "Teacher Clash", day, time,
          detail: `Teacher ${teacher}`,
          desc: `${teacher} is assigned to ${es.length} classes at the same time`,
          suggestion: `Assign a substitute teacher to ${es[1].subject}(${es[1].batches.join(",")})`,
          entries: es, status: "pending",
        });
    });

    // 3. Batch clash
    const bm = {};
    slot.forEach(e => e.batches.forEach(b => (bm[b] = bm[b] || []).push(e)));
    Object.entries(bm).forEach(([batch, es]) => {
      if (es.length > 1) {
        // Elective group heuristic: 
        // Open Electives (OE) or combined batches (e.g., LABC, LAB, LAC, AB, ABC) 
        // intentionally have multiple DIFFERENT subjects at the same time.
        const uniqueSubjects = new Set(es.map(x => x.subject)).size;

        // If it's a known alphabetic combination (like LABC, AB) - skip it if there are multiple subjects.
        // Also skip it for *any* batch if there are 3+ different subjects (that is definitely an elective block)
        if (uniqueSubjects > 1 && (/^[A-Za-z]+$/.test(batch) || es.length >= 3)) {
          return; // Ignore this elective block, it's not a real clash
        }

        clashes.push({
          type: "batch", label: "Batch Clash", day, time,
          detail: `Batch ${batch}`,
          desc: `Batch ${batch} has ${es.length} overlapping classes at the same time`,
          suggestion: `Reschedule ${es[1].subject} for batch ${batch} to a free time slot`,
          entries: es, status: "pending",
        });
      }
    });
  });

  return clashes;
}

module.exports = { detectClashes };
