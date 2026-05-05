/**
 * JIIT Campus Map Data & Logic
 * This utility maps room codes (from Excel) to physical locations on campus.
 */

export const CAMPUS_CONFIG = {
  "62": {
    name: "Sector 62 (Main Campus)",
    buildings: {
      "ABB-1": { name: "Aryabhatt Bhawan 1", floors: 5, type: "Academic" },
      "ABB-2": { name: "Aryabhatt Bhawan 2", floors: 5, type: "Academic" },
      "ABB-3": { name: "Aryabhatt Bhawan 3", floors: 6, type: "Academic/Admin" },
      "LT-1":  { name: "Lecture Theatre 1", floors: 1, type: "Lecture Hall" },
      "LT-2":  { name: "Lecture Theatre 2", floors: 1, type: "Lecture Hall" },
      "LRC":   { name: "Learning Resource Centre", floors: 3, type: "Library" },
      "ANNAPURNA": { name: "Mess Hall", floors: 2, type: "Dining" },
    }
  },
  "128": {
    name: "Sector 128 Campus",
    buildings: {
      "ABB-1": { name: "Integrated Academic Block", floors: 3, type: "Academic" },
      "LRC":   { name: "Learning Resource Centre", floors: 1, type: "Library" },
    }
  }
};

/**
 * Parses a room string (e.g. "ABB-1 102" or "LT-1") 
 * and returns building and floor info.
 */
export function getRoomInfo(roomStr, campus = "62") {
  if (!roomStr) return null;

  const upperStr = roomStr.toUpperCase();
  const config = CAMPUS_CONFIG[campus];
  
  let building = "Unknown";
  let floor = "G"; // Default Ground
  let description = "";

  // 1. Identify Building
  for (const bKey of Object.keys(config.buildings)) {
    if (upperStr.includes(bKey)) {
      building = bKey;
      break;
    }
  }

  // 2. Identify Floor (Heuristic)
  // Look for 3-digit numbers. First digit is usually the floor.
  const roomNumMatch = upperStr.match(/\b([1-6])\d{2}\b/);
  if (roomNumMatch) {
    floor = roomNumMatch[1];
  } else if (upperStr.includes("G") || upperStr.includes("GROUND")) {
    floor = "G";
  }

  // 3. Special Cases
  if (upperStr.includes("LT-")) description = "Lecture Theatre";
  if (upperStr.includes("LAB") || upperStr.includes("CL-")) description = "Laboratory";

  return {
    raw: roomStr,
    building: config.buildings[building] ? config.buildings[building].name : building,
    buildingCode: building,
    floor: floor,
    campus: config.name,
    description: description || (config.buildings[building] ? config.buildings[building].type : "")
  };
}

/**
 * Returns a set of mock directions for a room.
 */
export function getDirections(roomInfo) {
  if (!roomInfo) return [];

  const directions = [];
  
  if (roomInfo.campus.includes("62")) {
    directions.push("Enter via Main Gate (Gate 1).");
    directions.push(`Locate ${roomInfo.building} near the ${roomInfo.buildingCode === 'ABB-3' ? 'Admin' : 'Central OAT'} area.`);
  } else {
    directions.push("Enter Sector 128 Integrated Block.");
  }

  if (roomInfo.floor === "G") {
    directions.push("Stay on the Ground Floor.");
  } else {
    directions.push(`Take the stairs or lift to Floor ${roomInfo.floor}.`);
  }

  directions.push(`Follow the signage to Room ${roomInfo.raw}.`);
  
  return directions;
}
