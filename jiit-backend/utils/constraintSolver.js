/**
 * constraintSolver.js
 * Implements a Constraint-Satisfaction Problem (CSP) approach for scheduling classes.
 */

/**
 * Extracts a complete domain (all unique days, times, and venues) from the existing schedule.
 */
function extractDomain(entries) {
  const days = new Set();
  const times = new Set();
  const venues = new Set();

  entries.forEach(e => {
    if (e.day) days.add(e.day);
    if (e.time) times.add(e.time);
    if (e.venue) venues.add(e.venue);
  });

  return {
    days: Array.from(days),
    times: Array.from(times),
    venues: Array.from(venues)
  };
}

/**
 * Checks if placing a specific entry at a given day/time/venue causes any conflicts.
 * Returns true if safe (no conflicts), false if there is a conflict.
 */
function isSafeSlot(entry, testDay, testTime, testVenue, allEntries) {
  // Helper to get normalized list of teachers
  const getTeachers = (t) => {
    if (Array.isArray(t)) return t;
    if (typeof t !== 'string') return [];
    return t.split(/[,/]/).map(s => s.trim()).filter(Boolean);
  };

  const testTeachers = getTeachers(entry.teacher);
  const testBatches = Array.isArray(entry.batches) ? entry.batches : [];

  for (const existing of allEntries) {
    // Skip checking against itself
    if (existing === entry || (existing.raw && entry.raw && existing.raw === entry.raw)) {
      continue;
    }

    // We only care about entries that happen at the exact same day and time
    if (existing.day === testDay && existing.time === testTime) {
      
      // 1. Venue Constraint: Cannot use the same room simultaneously
      if (existing.venue === testVenue && testVenue) return false;

      // 2. Teacher Constraint: Teacher cannot be in two places
      const existingTeachers = getTeachers(existing.teacher);
      if (testTeachers.some(t => existingTeachers.includes(t))) return false;

      // 3. Batch Constraint: Batches cannot attend two classes simultaneously
      const existingBatches = Array.isArray(existing.batches) ? existing.batches : [];
      if (testBatches.some(b => existingBatches.includes(b))) return false;
    }
  }
  return true;
}

function isSafeSlotFast(entry, testDay, testTime, testVenue, cellOccupants) {
  // 1. Check if the room itself is already occupied at this time
  if (testVenue && cellOccupants.some(e => e.venue === testVenue && e.raw !== entry.raw)) {
    return false;
  }

  // Helper to get normalized list of teachers
  const getTeachers = (t) => {
    if (Array.isArray(t)) return t;
    if (typeof t !== 'string') return [];
    // Split by comma or slash
    return t.split(/[,/]/).map(s => s.trim()).filter(Boolean);
  };

  const testTeachers = getTeachers(entry.teacher);
  const testBatches = Array.isArray(entry.batches) ? entry.batches : [];

  for (const existing of cellOccupants) {
    if (existing === entry || (existing.raw && entry.raw && existing.raw === entry.raw)) {
      continue;
    }

    // 2. Teacher Constraint: Teacher cannot be in two places
    const existingTeachers = getTeachers(existing.teacher);
    if (testTeachers.some(t => existingTeachers.includes(t))) return false;

    // 3. Batch Constraint: Batches cannot attend two classes simultaneously
    const existingBatches = Array.isArray(existing.batches) ? existing.batches : [];
    if (testBatches.some(b => existingBatches.includes(b))) return false;
  }
  return true;
}

function suggestSlots(entry, currentSchedule, precalcDomain = null, precalcBySlot = null) {
  const domain = precalcDomain || extractDomain(currentSchedule);
  const suggestions = [];

  // Build O(1) lookup
  const bySlot = precalcBySlot || {};
  if (!precalcBySlot) {
    for (const e of currentSchedule) {
      const k = e.day + '||' + e.time;
      if (!bySlot[k]) bySlot[k] = [];
      bySlot[k].push(e);
    }
  }

  // Suggest alternative time slots (Same Room)
  for (const day of domain.days) {
    for (const time of domain.times) {
      if (day === entry.day && time === entry.time) continue; 
      
      const occupants = bySlot[day + '||' + time] || [];
      if (isSafeSlotFast(entry, day, time, entry.venue, occupants)) {
        suggestions.push({
          type: 'time_change',
          day,
          time,
          venue: entry.venue,
          description: `Move to ${day} at ${time} (Same Room)`
        });
      }
    }
  }

  // Suggest alternative rooms (Same Time)
  const exactOccupants = bySlot[entry.day + '||' + entry.time] || [];
  for (const venue of domain.venues) {
    if (venue === entry.venue) continue; 
    
    if (isSafeSlotFast(entry, entry.day, entry.time, venue, exactOccupants)) {
      suggestions.push({
        type: 'venue_change',
        day: entry.day,
        time: entry.time,
        venue,
        description: `Stay at ${entry.time} on ${entry.day}, but move to ${venue}`
      });
    }
  }

  return suggestions;
}

/**
 * autoSchedule(entries)
 * A simple backtracking algorithm that tries to place all entries into valid slots.
 * This can be used for building timetables from scratch or resolving all pending issues.
 */
function autoSchedule(entries) {
  // Deep clone to avoid mutating the original until success
  const schedule = JSON.parse(JSON.stringify(entries));
  const domain = extractDomain(schedule);
  
  // Sort entries: those with conflicts go first, or process all.
  // For demonstration, we simply verify everything. If anything is invalid, we try to move it.
  
  // We'll reset all day/time for components that need scheduling, but since this
  // is usually applied to an uploaded grid, let's just attempt to fix the clashing ones.
  // Full auto-scheduling from scratch requires assigning every entry. 
  
  // To keep it safe and performant, we'll implement a basic resolver that iteratively fixes.
  for (let i = 0; i < schedule.length; i++) {
    const entry = schedule[i];
    if (!isSafeSlot(entry, entry.day, entry.time, entry.venue, schedule)) {
      // Find a new slot
      let found = false;
      for (const day of domain.days) {
        for (const time of domain.times) {
          if (isSafeSlot(entry, day, time, entry.venue, schedule)) {
            entry.day = day;
            entry.time = time;
            found = true;
            break;
          }
        }
        if (found) break;
      }
      
      // If we couldn't find a time, try changing room at the original time
      if (!found) {
        for (const venue of domain.venues) {
          if (isSafeSlot(entry, entry.day, entry.time, venue, schedule)) {
             entry.venue = venue;
             found = true;
             break;
          }
        }
      }
    }
  }
  
  return schedule;
}

module.exports = { suggestSlots, autoSchedule, isSafeSlot, extractDomain };
