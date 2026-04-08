import { useState, useRef } from "react";
import {
  Upload as UploadIcon, AlertTriangle, Calendar, CheckCircle, Rocket,
  Download as DownloadIcon, XCircle, FileSpreadsheet, Users,
  GraduationCap, Building2, Lightbulb, Wrench, BarChart2, LogOut
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  uploadTimetable, getEntries, getClashes,
  resolveClash, resolveAllClashes, moveEntry,
  publishTimetable, downloadFullTimetable,
} from "../utils/api";
import TimetableGrid from "../components/TimetableGrid";
import StatCard      from "../components/StatCard";
import Chip          from "../components/Chip";



// ── Main component ────────────────────────────────────────────────────────────
export default function AdminPortal({ user, onLogout }) {
  const [page,        setPage]       = useState("upload");
  const [entries,     setEntries]    = useState([]);
  const [clashes,     setClashes]    = useState([]);
  const [stats,       setStats]      = useState(null);
  const [fileName,    setFileName]   = useState("");
  const [analyzing,   setAnalyzing]  = useState(false);
  const [publishing,  setPublishing] = useState(false);
  const [downloading, setDownloading]= useState(false);
  const [published,   setPublished]  = useState(false);
  const [drag,        setDrag]       = useState(false);
  const [toast,       setToast]      = useState(null);
  const [resolveModalIdx, setResolveModalIdx] = useState(null);
  const fileRef = useRef();

  const pending  = clashes.filter(c => c.status === "pending").length;
  const resolved = clashes.filter(c => c.status === "resolved").length;

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  const refreshData = async () => {
    try {
      const [entriesData, clashesData] = await Promise.all([getEntries(), getClashes()]);
      setEntries(entriesData.entries);
      setClashes(clashesData.clashes);
    } catch (e) { console.error(e); }
  };

  const processFiles = async (files) => {
    if (!files || files.length === 0) return;
    const fileArray = Array.from(files);
    const nameStr = fileArray.map(f => f.name).join(", ");
    setFileName(nameStr.length > 40 ? `${fileArray.length} files selected` : nameStr);
    setAnalyzing(true);
    try {
      const result = await uploadTimetable(fileArray);
      setStats(result);
      const [entriesData, clashesData] = await Promise.all([getEntries(), getClashes()]);
      setEntries(entriesData.entries);
      setClashes(clashesData.clashes);
      setPublished(false);
      showToast(`✅ Parsed ${result.entries} entries, found ${result.clashes} clashes`);
      setPage("clashes");
    } catch (err) {
      showToast("❌ " + err.message, "error");
    } finally {
      setAnalyzing(false);
    }
  };

  const handleResolve = async (index) => {
    try {
      await resolveClash(index);
      await refreshData();
      setResolveModalIdx(null);
    } catch (e) { showToast("❌ " + e.message, "error"); }
  };

  const handleApplySuggestion = async (idx, slot) => {
    try {
      const clash = clashes[idx];
      const change = {
        classIndex: 0,
        field: slot.type === 'time_change' ? 'time' : 'venue',
        oldValue: slot.type === 'time_change' ? clash.time : clash.venue,
        newValue: slot.type === 'time_change' ? slot.day + " " + slot.time : slot.venue,
        reason: slot.description
      };
      await resolveClash(idx, { appliedChanges: [change], summary: "CSP Fix: " + slot.description });
      await refreshData();
      setResolveModalIdx(null);
      showToast("✅ Applied CSP suggestion successfully!");
    } catch (e) {
      showToast("❌ " + e.message, "error");
    }
  };

  const handleResolveAll = async () => {
    try {
      await resolveAllClashes();
      await refreshData();
      showToast("✅ All clashes resolved manually!");
    } catch (e) { showToast("❌ " + e.message, "error"); }
  };

  const handleMoveEntry = async (dragData, newDay, newTime) => {
    try {
      if (dragData.day === newDay && dragData.time === newTime) return; // No change
      setAnalyzing(true);
      await moveEntry(dragData, newDay, newTime);
      await refreshData();
      showToast(`🔄 Moved ${dragData.subject} to ${newDay} ${newTime}`, "success");
    } catch (e) {
      showToast("❌ " + e.message, "error");
    } finally {
      setAnalyzing(false);
    }
  };



  const handlePublish = async () => {
    setPublishing(true);
    try {
      await publishTimetable();
      setPublished(true);
      showToast("🚀 Timetable published! Students can now view and download it.");
    } catch (err) {
      showToast("❌ " + err.message, "error");
    } finally {
      setPublishing(false);
    }
  };

  const handleDownload = async () => {
    setDownloading(true);
    try {
      await downloadFullTimetable();
      showToast("📥 Download started!");
    } catch (err) {
      showToast("❌ " + err.message, "error");
    } finally {
      setDownloading(false);
    }
  };

  const navItems = [
    { id: "upload",  icon: <UploadIcon size={16} />, label: "Upload Timetable"                  },
    { id: "clashes", icon: <AlertTriangle size={16} />, label: "Clash Detection", badge: pending   },
    { id: "view",    icon: <Calendar size={16} />, label: "View Timetable"                    },
  ];

  return (
    <div style={{ display: "flex", height: "100vh", background: "#0a0a0a", overflow: "hidden" }}>

      {/* Toast */}
      {toast && (
        <div style={{
          position: "fixed", top: 18, right: 18, zIndex: 9999,
          background: toast.type === "error" ? "#1a0000" : "#0a1a0a",
          border: `1px solid ${toast.type === "error" ? "#ef4444" : "#22c55e"}`,
          borderRadius: 12, padding: "12px 18px", fontSize: 13,
          color: toast.type === "error" ? "#f87171" : "#4ade80",
          boxShadow: "0 8px 30px rgba(0,0,0,.5)", maxWidth: 420,
          animation: "fadeUp .25s ease",
        }}>
          {toast.msg}
        </div>
      )}

      {/* Manual Resolve Modal */}
      {resolveModalIdx !== null && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,.75)",
          backdropFilter: "blur(6px)", display: "flex", alignItems: "center",
          justifyContent: "center", zIndex: 9005,
        }}>
          <div style={{
            background: "#111", border: "1px solid rgba(255,255,255,.1)",
            borderRadius: 20, padding: 30, width: "100%", maxWidth: 450,
            boxShadow: "0 25px 60px rgba(0,0,0,.6)", position: "relative"
          }}>
            <button
               onClick={() => setResolveModalIdx(null)}
               style={{ position: "absolute", top: 15, right: 20, background: "none", border: "none", color: "#6b7280", fontSize: 20, cursor: "pointer" }}
            >
              ×
            </button>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: "#fff", marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ color: "#a855f7" }}><Lightbulb size={20} /></span> Resolution Options
            </h3>
            
            <p style={{ fontSize: 13, color: "#9ca3af", marginBottom: 20 }}>
              Below are intelligently computed available slots where <b>all batches, teachers, and rooms</b> do not collide.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 10, maxHeight: 400, overflowY: "auto", marginBottom: 20 }}>
              {clashes[resolveModalIdx]?.suggestedSlots?.length > 0 ? (
                clashes[resolveModalIdx].suggestedSlots.map((s, si) => {
                  const targetEntry = clashes[resolveModalIdx].entries[0];
                  const otherEntries = clashes[resolveModalIdx].entries.slice(1);
                  return (
                    <button
                      key={si}
                      onClick={() => handleApplySuggestion(resolveModalIdx, s)}
                      style={{
                        background: "#1a1a1a", border: "1px solid rgba(255,255,255,.05)",
                        borderRadius: 12, padding: 14, textAlign: "left", cursor: "pointer",
                        transition: "all .2s ease"
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(168,85,247,.4)"; e.currentTarget.style.background = "rgba(168,85,247,.05)" }}
                      onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,.05)"; e.currentTarget.style.background = "#1a1a1a" }}
                    >
                      <div style={{ fontSize: 14, color: "#a855f7", fontWeight: 700, marginBottom: 10 }}>💡 Alternate: {s.description}</div>
                      
                      <div style={{ background: "rgba(0,0,0,.25)", borderRadius: 8, padding: 10, marginBottom: 8 }}>
                        <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: .5, color: "#9ca3af", marginBottom: 4 }}>Subject to Move</div>
                        <div style={{ fontSize: 13, color: "#fff", fontWeight: 600, display: "flex", justifyContent: "space-between" }}>
                          <span>{targetEntry.subject} <span style={{ color: "#a855f7", fontWeight: 400 }}>({targetEntry.batches.join(", ")})</span></span>
                          <span style={{ fontSize: 11, color: "#6b7280" }}>{clashes[resolveModalIdx].day} @ {clashes[resolveModalIdx].time}</span>
                        </div>
                        <div style={{ fontSize: 11, color: "#d1d5db", marginTop: 2 }}>Teacher: {targetEntry.teacher} · Room: {targetEntry.venue}</div>
                      </div>

                      <div style={{ background: "rgba(239,68,68,.05)", borderLeft: "2px solid rgba(239,68,68,.3)", borderRadius: "0 8px 8px 0", padding: 10 }}>
                        <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: .5, color: "#f87171", marginBottom: 4 }}>Clashing With</div>
                        {otherEntries.map((cw, cidx) => (
                          <div key={cidx} style={{ fontSize: 12, color: "#e5e7eb", display: "flex", justifyContent: "space-between", marginTop: cidx===0?0:4 }}>
                            <span>{cw.subject} <span style={{ color: "#9ca3af" }}>({cw.batches.join(", ")})</span></span>
                            <span style={{ fontSize: 11, color: "#d1d5db" }}>{cw.teacher} · {cw.venue}</span>
                          </div>
                        ))}
                      </div>
                    </button>
                  );
                })
              ) : (
                <div style={{ textAlign: "center", padding: 20, color: "#6b7280", fontSize: 13 }}>
                  No automated slots available. You must manually force a change.
                </div>
              )}
            </div>

            <div style={{ display: "flex", gap: 10 }}>
              <button className="btn btn-ghost" style={{ flex: 1 }} onClick={() => handleResolve(resolveModalIdx)}>
                Just mark Resolved (Ignore fix)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Sidebar ─────────────────────────────────────────────────────────── */}
      <aside style={{ width: 218, minWidth: 218, background: "#0d0d0d", borderRight: "1px solid rgba(255,255,255,.05)", display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "16px 14px", borderBottom: "1px solid rgba(255,255,255,.05)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
            <div style={{ width: 34, height: 34, background: "#1e1a3a", border: "1px solid rgba(124,58,237,.4)", borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center", color: "#a855f7" }}>
              <Calendar size={18} />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 12, color: "#fff" }}>JIIT SmartSched</div>
              <div style={{ fontSize: 10, color: "#6b7280" }}>Admin Portal</div>
            </div>
          </div>
        </div>

        <nav style={{ flex: 1, padding: "10px 8px" }}>
          {navItems.map(n => (
            <button key={n.id} className={`nav-item${page === n.id ? " active" : ""}`} onClick={() => setPage(n.id)}>
              <span style={{ fontSize: 15 }}>{n.icon}</span>
              <span style={{ flex: 1, textAlign: "left" }}>{n.label}</span>
              {n.badge > 0 && <span style={{ background: "#ef4444", color: "#fff", borderRadius: 99, padding: "1px 7px", fontSize: 10, fontWeight: 700 }}>{n.badge}</span>}
            </button>
          ))}
        </nav>

        {entries.length > 0 && (
          <div style={{ padding: "10px", borderTop: "1px solid rgba(255,255,255,.05)", display: "flex", flexDirection: "column", gap: 6 }}>
            <button
              className="btn btn-purple"
              style={{ width: "100%", fontSize: 12, padding: "9px", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, opacity: published ? .6 : 1 }}
              onClick={handlePublish}
              disabled={publishing || published}
            >
              {publishing ? "Publishing…" : published ? <><CheckCircle size={14}/> Published</> : <><Rocket size={14}/> Publish to Students</>}
            </button>
            <button
              className="btn btn-green"
              style={{ width: "100%", fontSize: 12, padding: "9px", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}
              onClick={handleDownload}
              disabled={downloading}
            >
              {downloading ? "Generating…" : <><DownloadIcon size={14}/> Download Excel</>}
            </button>
          </div>
        )}

        <div style={{ padding: "12px 14px", borderTop: "1px solid rgba(255,255,255,.05)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 28, height: 28, background: "linear-gradient(135deg,#7c3aed,#4c1d95)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "#fff" }}>A</div>
            <span style={{ fontSize: 11, color: "#9ca3af" }}>{user.name}</span>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={onLogout}>Exit</button>
        </div>
      </aside>

      {/* ── Main ────────────────────────────────────────────────────────────── */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {/* Topbar */}
        <header style={{ padding: "12px 24px", borderBottom: "1px solid rgba(255,255,255,.05)", background: "#0d0d0d", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <button className="btn btn-ghost btn-sm" onClick={onLogout} style={{ display: "flex", alignItems: "center", gap: 5 }}>← Back</button>
            <div>
              <h2 style={{ fontSize: 15, fontWeight: 700, color: "#fff" }}>
                {page === "upload" ? "Upload Timetable" : page === "clashes" ? "⚠️ Clash Detection" : "📅 Timetable View"}
              </h2>
              <p style={{ fontSize: 11, color: "#6b7280", marginTop: 2 }}>B.Tech II Semester Even 2026</p>
            </div>
          </div>
          {entries.length > 0 && (
            <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
              <span style={{ fontSize: 11, color: "#6b7280", background: "#1a1a1a", border: "1px solid rgba(255,255,255,.06)", borderRadius: 8, padding: "5px 10px" }}>📄 {fileName}</span>
              <Chip text={`${entries.length} entries`} bg="#22c55e"/>
              {pending > 0 && <Chip text={`${pending} clashes`} bg="#ef4444"/>}
              {published && <Chip text="Published ✓" bg="#22c55e"/>}
            </div>
          )}
        </header>

        <main style={{ flex: 1, overflowY: "auto", padding: 24 }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={page}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
          {/* ── UPLOAD ─────────────────────────────────────── */}
          {page === "upload" && (
            <div className="glass-panel" style={{ padding: 24, borderRadius: 20 }}>
              <div
                className={`upload-zone${drag ? " drag" : ""}`}
                style={{ padding: "90px 40px", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}
                onClick={() => !analyzing && fileRef.current.click()}
                onDragOver={e => { e.preventDefault(); setDrag(true); }}
                onDragLeave={() => setDrag(false)}
                onDrop={e => { e.preventDefault(); setDrag(false); processFiles(e.dataTransfer.files); }}
              >
                <input ref={fileRef} type="file" multiple accept=".xlsx,.xls" style={{ display: "none" }} onChange={e => processFiles(e.target.files)}/>
                {analyzing ? (
                  <>
                    <div style={{ width: 68, height: 68, background: "#1e1a3a", borderRadius: 20, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
                      <div style={{ width: 30, height: 30, border: "3px solid rgba(167,139,250,.3)", borderTop: "3px solid #a78bfa", borderRadius: "50%", animation: "spin .8s linear infinite" }}/>
                    </div>
                    <h3 style={{ fontSize: 20, fontWeight: 700, color: "#fff", marginBottom: 8 }}>Analysing with Gemini AI…</h3>
                    <p style={{ fontSize: 13, color: "#6b7280", marginBottom: 22 }}>Parsing entries, detecting clashes, running AI analysis</p>
                    <div style={{ width: 260, height: 5, background: "rgba(255,255,255,.05)", borderRadius: 99, overflow: "hidden" }}>
                      <div style={{ width: "72%", height: "100%", background: "linear-gradient(90deg,#7c3aed,#a855f7)", borderRadius: 99, animation: "pulse 1.1s ease infinite" }}/>
                    </div>
                  </>
                ) : (
                  <>
                    <div style={{ width: 76, height: 76, background: "#1e1a3a", border: "1px solid rgba(124,58,237,.3)", borderRadius: 22, display: "flex", alignItems: "center", justifyContent: "center", color: "#a855f7", marginBottom: 20, animation: "float 3.5s ease infinite" }}>
                      <BarChart2 size={34}/>
                    </div>
                    <h3 style={{ fontSize: 22, fontWeight: 700, color: "#fff", marginBottom: 8 }}>Upload Timetable Excel</h3>
                    <p style={{ fontSize: 13, color: "#6b7280", marginBottom: 28 }}>Drag & drop your .xlsx files or click to browse</p>
                    <button className="btn btn-purple" style={{ fontSize: 14, padding: "12px 28px", display: "flex", alignItems: "center", gap: 8 }} onClick={e => { e.stopPropagation(); fileRef.current.click(); }}>
                      <FileSpreadsheet size={16}/> Choose Excel Files
                    </button>
                  </>
                )}
              </div>

              <div className="glass-panel" style={{ padding: 20, marginTop: 22, borderRadius: 16 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#fff", marginBottom: 14, display: "flex", alignItems: "center", gap: 6 }}><Rocket size={16}/> Automated Workflow</div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12 }}>
                  {[
                    ["1. Upload",   "Drop .xlsx files",         "Backend parses all entries"],
                    ["2. Resolve Clashes", "Review constraints", "CSP Engine suggests fixes"],
                    ["3. Publish",  "Students can view",       "They can download it"],
                  ].map(([step, title, desc]) => (
                    <div key={step} style={{ background: "#0d0d0d", borderRadius: 11, padding: 14 }}>
                      <div style={{ fontSize: 11, color: "#a78bfa", fontWeight: 700, marginBottom: 5 }}>{step}</div>
                      <div style={{ fontSize: 12, color: "#fff", fontWeight: 600, marginBottom: 4 }}>{title}</div>
                      <div style={{ fontSize: 11, color: "#4b5563" }}>{desc}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── CLASHES ────────────────────────────────────── */}
          {page === "clashes" && (
            <div>
              {!entries.length ? (
                <div className="glass-panel" style={{ textAlign: "center", padding: "80px 20px", borderRadius: 20 }}>
                  <div style={{ color: "#6b7280", marginBottom: 16, display: "flex", justifyContent: "center" }}><FileSpreadsheet size={48} /></div>
                  <h3 style={{ color: "#fff", marginBottom: 8, fontSize: 18 }}>No Timetable Uploaded Yet</h3>
                  <button className="btn btn-purple" style={{display:"inline-flex", alignItems:"center", gap:6}} onClick={() => setPage("upload")}><UploadIcon size={14}/> Upload Timetable</button>
                </div>
              ) : (
                <>
                  {/* Stats */}
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 14, marginBottom: 24 }}>
                    <StatCard icon="📋" label="Total Entries"     value={entries.length}                              sub="Parsed by backend"/>
                    <StatCard icon="⚠️" label="Total Clashes"    value={clashes.length}                              sub={`${pending} pending`}          subColor={pending > 0 ? "#f87171" : "#4ade80"}/>
                    <StatCard icon="🏢" label="Venue Clashes"    value={clashes.filter(c=>c.type==="venue").length}   sub="Room double-booked"            subColor="#f87171"/>
                    <StatCard icon="👨‍🏫" label="Teacher Clashes" value={clashes.filter(c=>c.type==="teacher").length} sub="Same time, same teacher"        subColor="#fb923c"/>
                    <StatCard icon="👥" label="Batch Clashes"    value={clashes.filter(c=>c.type==="batch").length}   sub="Overlapping schedule"          subColor="#c084fc"/>
                  </div>



                  {/* All-clear banner */}
                  {pending === 0 && entries.length > 0 && (
                    <div style={{ background: "rgba(34,197,94,.07)", border: "1px solid rgba(34,197,94,.2)", borderRadius: 14, padding: "14px 20px", marginBottom: 20, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: "#4ade80", marginBottom: 3 }}>
                          {published ? "✅ Timetable is Live — Students can view & download it" : "✅ All clashes resolved! Ready to publish."}
                        </div>
                        <div style={{ fontSize: 11, color: "#6b7280" }}>
                          {published ? "Students can filter by batch and download their schedule." : "Publish the timetable so students can access it."}
                        </div>
                      </div>
                      <div style={{ display: "flex", gap: 10 }}>
                        <button className="btn btn-green" onClick={handleDownload} disabled={downloading}>
                          {downloading ? "Generating…" : "📥 Download Excel"}
                        </button>
                        {!published && (
                          <button className="btn btn-purple" onClick={handlePublish} disabled={publishing}>
                            {publishing ? "Publishing…" : "🚀 Publish to Students"}
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="card" style={{ overflow: "hidden" }}>
                    {/* Clash list header */}
                    <div style={{ padding: "16px 20px", borderBottom: "1px solid rgba(255,255,255,.05)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
                      <div>
                        <h3 style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>Detected Clashes</h3>
                        <p style={{ fontSize: 11, color: "#6b7280", marginTop: 2 }}>{clashes.length} total · {pending} pending · {resolved} resolved</p>
                      </div>
                      {pending > 0 && (
                        <div style={{ display: "flex", gap: 8 }}>
                          <button className="btn btn-green" onClick={handleResolveAll}>
                            ✓ Manual Resolve All
                          </button>
                        </div>
                      )}
                    </div>

                    {clashes.length === 0 ? (
                      <div style={{ padding: "70px 20px", textAlign: "center" }}>
                        <div style={{ display: "flex", justifyContent: "center", marginBottom: 14, color: "#4ade80" }}><CheckCircle size={48} /></div>
                        <h3 style={{ color: "#4ade80", fontSize: 18, marginBottom: 6 }}>No Clashes Detected!</h3>
                        <p style={{ color: "#6b7280", fontSize: 13 }}>Your timetable is clean.</p>
                      </div>
                    ) : clashes.map((c, i) => (
                      <div key={i} className="clash-row" style={{ padding: "16px 20px", display: "flex", gap: 14, alignItems: "flex-start" }}>
                        {/* Type icon */}
                        <div style={{
                          width: 42, height: 42, borderRadius: 13, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0,
                          background: c.status === "resolved" ? "rgba(34,197,94,.1)" : c.type === "venue" ? "rgba(239,68,68,.1)" : c.type === "teacher" ? "rgba(251,146,60,.1)" : "rgba(168,85,247,.1)",
                        }}>
                          {c.status === "resolved" ? "✅" : c.type === "venue" ? "🏢" : c.type === "teacher" ? "👨‍🏫" : "👥"}
                        </div>

                        <div style={{ flex: 1, minWidth: 0 }}>
                          {/* Badge row */}
                          <div style={{ display: "flex", gap: 7, alignItems: "center", flexWrap: "wrap", marginBottom: 7 }}>
                            <span className={`tag tag-${c.status === "resolved" ? "ok" : c.type}`}>
                              {c.status === "resolved" ? "✓ Resolved" : c.label}
                            </span>
                            <span style={{ fontSize: 11, color: "#6b7280" }}>📅 {c.day} @ {c.time}</span>
                            <Chip text={c.detail} bg={c.type === "venue" ? "#f87171" : c.type === "teacher" ? "#fb923c" : "#c084fc"}/>
                          </div>

                          {/* Description */}
                          <p style={{ fontSize: 13, color: "#e5e7eb", marginBottom: 7, lineHeight: 1.5 }}>{c.desc}</p>

                          {/* Affected classes */}
                          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 8 }}>
                            {c.entries.map((e, ei) => {
                              const movedTime = (c.status === "resolved") && (e.day !== c.day || e.time !== c.time);
                              return (
                                <div key={ei} style={{ background: "#1a1a1a", border: `1px solid ${movedTime ? "rgba(74,222,128,.3)" : "rgba(255,255,255,.06)"}`, borderRadius: 9, padding: "5px 10px", fontSize: 11, display: "flex", gap: 5, alignItems: "center" }}>
                                  <span className={`tag tag-${e.type}`} style={{ fontSize: 9 }}>{e.type === "L" ? "Lec" : e.type === "T" ? "Tut" : "Lab"}</span>
                                  <span style={{ color: "#fff", fontWeight: 700 }}>{e.subject}</span>
                                  <span style={{ color: "#6b7280" }}>({e.batches.join(",")})</span>
                                  <span style={{ color: "#a78bfa" }}>@{e.venue}</span>
                                  <span style={{ color: "#6b7280" }}>·{e.teacher}</span>
                                  {movedTime && (
                                    <span style={{ color: "#4ade80", fontWeight: 700, marginLeft: 4 }}>→ Moved to {e.day} {e.time}</span>
                                  )}
                                </div>
                              );
                            })}
                          </div>

                          {c.status === "pending" && (
                            <div style={{ background: "rgba(124,58,237,.08)", border: "1px solid rgba(124,58,237,.2)", borderRadius: 10, padding: "9px 13px", fontSize: 12, color: "#c4b5fd", lineHeight: 1.5, marginTop: 8 }}>
                              💡 <strong>Suggestion:</strong> {c.suggestion}
                            </div>
                          )}
                          
                          {/* Fix Applied Panel */}
                          {c.status === "resolved" && c.appliedChanges?.length > 0 && (
                            <div style={{
                              marginTop: 10, background: "rgba(124,58,237,.06)",
                              border: "1px solid rgba(124,58,237,.2)", borderRadius: 10, padding: "10px 14px",
                            }}>
                              <div style={{ fontSize: 11, color: "#a78bfa", fontWeight: 700, marginBottom: 5 }}>
                                🔧 Resolved by CSP Constraints
                              </div>
                              <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 4 }}>
                                {c.appliedChanges.map((ch, idx) => (
                                  <div key={idx} style={{ fontSize: 11, color: "#9ca3af", background: "rgba(255,255,255,.04)", borderRadius: 7, padding: "5px 10px" }}>
                                    <span style={{ color: "#a78bfa" }}>{ch.field}:</span>{" "}
                                    <span style={{ textDecoration: "line-through", color: "#6b7280" }}>{ch.oldValue}</span>
                                    {" → "}
                                    <span style={{ color: "#4ade80", fontWeight: 600 }}>{ch.newValue}</span>
                                    {ch.reason && <span style={{ color: "#4b5563" }}> · {ch.reason}</span>}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Resolve button */}
                        <div style={{ flexShrink: 0 }}>
                          {c.status === "pending"
                            ? <button className="btn btn-green" onClick={() => setResolveModalIdx(i)}>✓ Resolve</button>
                            : <span style={{ fontSize: 11, color: "#4ade80", background: "rgba(34,197,94,.1)", border: "1px solid rgba(34,197,94,.2)", borderRadius: 8, padding: "6px 12px", display: "inline-block" }}>✓ Done</span>
                          }
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          {/* ── VIEW ───────────────────────────────────────── */}
          {page === "view" && (
            <div>
              {!entries.length ? (
                <div className="glass-panel" style={{ textAlign: "center", padding: "80px 20px", borderRadius: 20 }}>
                  <div style={{ color: "#6b7280", marginBottom: 16, display: "flex", justifyContent: "center" }}><FileSpreadsheet size={48} /></div>
                  <h3 style={{ color: "#fff", marginBottom: 8 }}>No Timetable Uploaded Yet</h3>
                  <button className="btn btn-purple" style={{display:"inline-flex", alignItems:"center", gap:6}} onClick={() => setPage("upload")}><UploadIcon size={14}/> Upload Timetable</button>
                </div>
              ) : (
                <div className="glass-panel" style={{ padding: 20, borderRadius: 16 }}>
                  <div style={{ marginBottom: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <h3 style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>Full Timetable — All Batches</h3>
                      <p style={{ fontSize: 11, color: "#6b7280", marginTop: 2 }}>{entries.length} entries · hover cells for details · 🔴 = clash</p>
                    </div>
                    <button className="btn btn-green" onClick={handleDownload} disabled={downloading} style={{ fontSize: 12 }}>
                      {downloading ? "Generating…" : "📥 Download Excel"}
                    </button>
                  </div>
                  <TimetableGrid entries={entries} clashes={clashes} onMoveEntry={handleMoveEntry} />
                </div>
              )}
            </div>
          )}

            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}