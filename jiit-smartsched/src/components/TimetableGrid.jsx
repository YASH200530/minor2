import { useState } from "react";
import { getSubjectColor, getSubjectName } from "../utils/constants";
import Chip from "./Chip";

export default function TimetableGrid({ entries = [], clashes = [], batchFilter = null, onMoveEntry, isStudent = false }) {
  const [subFilter, setSubFilter] = useState("all");

  // Build a set of (day||time||raw) for pending clashes to highlight cells
  const clashSet = new Set();
  clashes
    .filter(c => c.status === "pending")
    .forEach(c => c.entries.forEach(e => clashSet.add(`${e.day}||${e.time}||${e.raw}`)));

  const allSubjects = [...new Set(entries.map(e => e.subject))].sort();

  // Dynamically extract unique days and times from the actual data so 
  // it seamlessly adapts to ANY excel file format (like "MON" or "Monday", "8-9AM" or "9:00")
  const dynamicDays = [...new Set(entries.map(e => e.day))].filter(Boolean);

  const parseTime = (timeStr) => {
    const numMatch = timeStr.match(/\d+/);
    if (!numMatch) return 0;
    let hour = parseInt(numMatch[0], 10);
    // Adjust for PM
    if (timeStr.toUpperCase().includes("PM") && hour < 12) hour += 12;
    // Assume 1 to 7 are PM (13:00 - 19:00) in university contexts if AM isn't specified
    if (!timeStr.toUpperCase().includes("AM") && hour >= 1 && hour <= 7) hour += 12;
    if (timeStr.toUpperCase().includes("LUNCH")) return 12.5; 
    return hour;
  };

  const dynamicTimes = [...new Set(entries.map(e => e.time))]
    .filter(Boolean)
    .sort((a, b) => parseTime(a) - parseTime(b));

  // Build grid: key = "Day||Time" → array of entries
  const grid = {};
  dynamicDays.forEach(d => dynamicTimes.forEach(t => { grid[`${d}||${t}`] = []; }));
  entries.forEach(e => {
    if (batchFilter && !e.batches.includes(batchFilter)) return;
    if (subFilter !== "all" && e.subject !== subFilter) return;
    const k = `${e.day}||${e.time}`;
    if (grid[k] !== undefined) grid[k].push(e);
  });

  return (
    <div>
      {/* Filter bar */}
      <div style={{ display:"flex", gap:10, marginBottom:16, alignItems:"center", flexWrap:"wrap" }}>
        <span style={{ fontSize:12, color:"#6b7280", fontWeight:500 }}>Subject:</span>
        <select
          className="inp"
          style={{ width:"auto", padding:"6px 12px", fontSize:12 }}
          value={subFilter}
          onChange={e => setSubFilter(e.target.value)}
        >
          <option value="all">All Subjects</option>
          {allSubjects.map(s => (
            <option key={s} value={s}>{isStudent ? getSubjectName(s) : `${s} — ${getSubjectName(s)}`}</option>
          ))}
        </select>
        {batchFilter && <Chip text={`Batch: ${batchFilter}`} bg="#a78bfa" />}
        {clashes.filter(c => c.status === "pending").length > 0 && (
          <span style={{ display:"flex", alignItems:"center", gap:5, fontSize:11, color:"#f87171" }}>
            <span style={{ width:7, height:7, background:"#ef4444", borderRadius:"50%", display:"inline-block", boxShadow:"0 0 5px #ef4444" }} />
            🔴 = Clash
          </span>
        )}
      </div>

      {/* Legend */}
      <div style={{ display:"flex", gap:14, marginBottom:12, flexWrap:"wrap" }}>
        {[["L","Lecture"],["T","Tutorial"],["P","Practical / Lab"]].map(([t,l]) => (
          <span key={t} className={`tag tag-${t}`}>{l}</span>
        ))}
      </div>

      {/* Grid table */}
      <div style={{ overflowX:"auto" }}>
        <table style={{
          width:"100%", borderCollapse:"collapse", minWidth:860,
          background:"#111", borderRadius:16, overflow:"hidden",
          border:"1px solid rgba(255,255,255,.05)",
        }}>
          <thead>
            <tr style={{ background:"rgba(20,15,45,.9)" }}>
              <th style={{ padding:"12px 14px", textAlign:"left", fontSize:11, color:"#6b7280", fontWeight:500, width:78 }}>
                Time
              </th>
              {dynamicDays.map(d => (
                <th key={d} style={{
                  padding:"12px 6px", fontSize:11, fontWeight:700, color:"#fff",
                  borderLeft:"1px solid rgba(255,255,255,.04)", textAlign:"center",
                  letterSpacing:".05em", textTransform: "uppercase"
                }}>
                  {d}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {dynamicTimes.map(time => (
              <tr key={time} className="time-row" style={{ borderTop:"1px solid rgba(255,255,255,.04)" }}>
                <td style={{ padding:"6px 14px", fontSize:11, color:"#6b7280", whiteSpace:"nowrap", fontWeight:500 }}>
                  {time.toUpperCase() === "LUNCH" ? "🍽 Lunch" : time}
                </td>
                {dynamicDays.map(d => {
                  const cells = grid[`${d}||${time}`] || [];
                  return (
                    <td key={d} 
                      onDragOver={time.toUpperCase() !== "LUNCH" ? (e) => e.preventDefault() : undefined}
                      onDrop={time.toUpperCase() !== "LUNCH" ? (e) => {
                        e.preventDefault();
                        try {
                          const dragData = JSON.parse(e.dataTransfer.getData("application/json"));
                          if (onMoveEntry) {
                            onMoveEntry(dragData, d, time);
                          } else {
                            console.log("Moved", dragData, "to", d, time);
                          }
                        } catch (err) { console.error("Drag err:", err) }
                      } : undefined}
                      style={{
                      padding:3,
                      borderLeft:"1px solid rgba(255,255,255,.04)",
                      verticalAlign:"top", minWidth:108,
                      background: time.toUpperCase() === "LUNCH" ? "rgba(255,255,255,.015)" : "transparent",
                    }}>
                      {time.toUpperCase() === "LUNCH"
                        ? <div style={{ textAlign:"center", padding:"10px 0", fontSize:11, color:"#2a2a2a" }}>—</div>
                        : (
                          <div style={{ display:"flex", flexDirection:"column", gap:2, minHeight: "40px" }}>
                            {cells.map((cell, ci) => {
                              const isClash = clashSet.has(`${cell.day}||${cell.time}||${cell.raw}`);
                              const col = getSubjectColor(cell.subject);
                              return (
                                <div
                                  key={ci}
                                  draggable
                                  onDragStart={(e) => {
                                    e.target.style.opacity = '0.5';
                                    e.dataTransfer.setData("application/json", JSON.stringify({ 
                                      raw: cell.raw, day: cell.day, time: cell.time, subject: cell.subject 
                                    }));
                                  }}
                                  onDragEnd={(e) => {
                                    e.target.style.opacity = '1';
                                  }}
                                  className="tt-cell cursor-move hover:scale-[1.02] transition-transform duration-200"
                                  title={`${getSubjectName(cell.subject)} | Batches: ${cell.batches.join(",")} | Room: ${cell.venue} | Teacher: ${cell.teacher}`}
                                  style={{
                                    borderRadius:9,
                                    border:`1px solid ${isClash ? "#ef4444" : col}55`,
                                    background: isClash ? "rgba(239,68,68,.13)" : `${col}1c`,
                                    padding:"5px 7px",
                                    cursor: "grab"
                                  }}
                                >
                                  {isClash && (
                                    <span style={{
                                      position:"absolute", top:3, right:4,
                                      width:7, height:7, background:"#ef4444",
                                      borderRadius:"50%", boxShadow:"0 0 6px #ef4444",
                                    }} />
                                  )}
                                  <div style={{ display:"flex", alignItems:"center", gap:3, marginBottom:3 }}>
                                    <span className={`tag tag-${cell.type}`} style={{ fontSize:9, padding:"1px 5px" }}>
                                      {cell.type === "L" ? "Lec" : cell.type === "T" ? "Tut" : "Lab"}
                                    </span>
                                    <span style={{ fontSize:10, fontWeight:700, color: isClash ? "#f87171" : col }}>
                                      {cell.subject}
                                    </span>
                                  </div>
                                  <div style={{ fontSize:9, color:"rgba(255,255,255,.55)", marginBottom:1 }}>
                                    {cell.batches.join(",")}
                                  </div>
                                  <div style={{ fontSize:9, color:"rgba(255,255,255,.38)" }}>
                                    📍{cell.venue} · {cell.teacher}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )
                      }
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
