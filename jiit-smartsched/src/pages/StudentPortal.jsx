import { useState, useEffect } from "react";
import { ALL_BATCHES, BRANCHES } from "../utils/constants";
import { getPublishedStatus, getStudentTimetable, downloadBatchTimetable } from "../utils/api";
import TimetableGrid from "../components/TimetableGrid";
import Chip from "../components/Chip";

export default function StudentPortal({ user, onLogout }) {
  const [branch,      setBranch]      = useState("CSE");
  const [semester,    setSemester]    = useState("2");
  const [batch,       setBatch]       = useState("A1");
  const [entries,     setEntries]     = useState([]);
  const [searched,    setSearched]    = useState(false);
  const [loading,     setLoading]     = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [published,   setPublished]   = useState(null); // null = checking
  const [toast,       setToast]       = useState(null);
  const [error,       setError]       = useState("");

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Check if timetable is published on mount
  useEffect(() => {
    getPublishedStatus()
      .then(data => setPublished(data.published))
      .catch(() => setPublished(false));
  }, []);

  const search = async () => {
    setError("");
    setLoading(true);
    setSearched(false);
    try {
      const data = await getStudentTimetable(batch);
      setEntries(data.entries);
      setSearched(true);
      if (data.entries.length === 0) setError(`No classes found for Batch ${batch}. Try A1, A2, B1, B3, G1 etc.`);
    } catch (err) {
      setError(err.message);
      setSearched(true);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    setDownloading(true);
    try {
      await downloadBatchTimetable(batch);
      showToast(`📥 Downloading Batch ${batch} timetable…`);
    } catch (err) {
      showToast("❌ " + err.message, "error");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div style={{ minHeight:"100vh", background:"#0a0a0a" }}>

      {/* Toast */}
      {toast && (
        <div style={{
          position:"fixed", top:18, right:18, zIndex:9999,
          background: toast.type === "error" ? "#1a0000" : "#0a1a0a",
          border:`1px solid ${toast.type === "error" ? "#ef4444" : "#22c55e"}`,
          borderRadius:12, padding:"12px 18px", fontSize:13,
          color: toast.type === "error" ? "#f87171" : "#4ade80",
          boxShadow:"0 8px 30px rgba(0,0,0,.5)",
          animation:"fadeUp .25s ease",
        }}>
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <header style={{ padding:"13px 24px", borderBottom:"1px solid rgba(255,255,255,.05)", background:"#0d0d0d", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <button className="btn btn-ghost btn-sm" onClick={onLogout} style={{ display:"flex", alignItems:"center", gap:5 }}>← Back</button>
          <div style={{ display:"flex", alignItems:"center", gap:11 }}>
            <div style={{ width:34, height:34, background:"#1e1a3a", border:"1px solid rgba(124,58,237,.4)", borderRadius:9, display:"flex", alignItems:"center", justifyContent:"center", fontSize:16 }}>📅</div>
            <div>
              <div style={{ fontWeight:700, fontSize:13, color:"#fff" }}>JIIT SmartSched</div>
              <div style={{ fontSize:10, color:"#6b7280" }}>Student Portal · B.Tech II Sem Even 2026</div>
            </div>
          </div>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          {published === null && <span style={{ fontSize:11, color:"#6b7280" }}>Checking status…</span>}
          {published === true  && <Chip text="🟢 Timetable Live" bg="#22c55e"/>}
          {published === false && <Chip text="🔴 Not Published" bg="#ef4444"/>}
          <span style={{ fontSize:12, color:"#9ca3af" }}>👋 {user.name}</span>
          <button className="btn btn-ghost" onClick={onLogout}>Logout</button>
        </div>
      </header>

      <div style={{ maxWidth:1100, margin:"0 auto", padding:"28px 24px" }}>

        {/* Not published banner */}
        {published === false && (
          <div style={{ background:"rgba(239,68,68,.08)", border:"1px solid rgba(239,68,68,.2)", borderRadius:14, padding:"16px 20px", marginBottom:22, display:"flex", gap:14, alignItems:"center" }}>
            <span style={{ fontSize:28 }}>📭</span>
            <div>
              <div style={{ fontSize:14, fontWeight:700, color:"#f87171", marginBottom:3 }}>Timetable Not Published Yet</div>
              <div style={{ fontSize:12, color:"#6b7280" }}>The admin hasn't published the timetable yet. Please check back later.</div>
            </div>
          </div>
        )}

        {/* Search card */}
        <div className="card fadein" style={{ padding:24, marginBottom:24 }}>
          <h2 style={{ fontSize:16, fontWeight:700, color:"#fff", marginBottom:5 }}>🔍 Find Your Timetable</h2>
          <p style={{ fontSize:12, color:"#6b7280", marginBottom:20 }}>Select your Branch, Semester and Batch to view and download your weekly schedule</p>

          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr auto auto", gap:12, alignItems:"flex-end" }}>
            <div>
              <div style={{ fontSize:11, color:"#6b7280", marginBottom:5, fontWeight:500 }}>Branch</div>
              <select className="inp" value={branch} onChange={e => setBranch(e.target.value)}>
                {BRANCHES.map(b => <option key={b}>{b}</option>)}
              </select>
            </div>
            <div>
              <div style={{ fontSize:11, color:"#6b7280", marginBottom:5, fontWeight:500 }}>Semester</div>
              <select className="inp" value={semester} onChange={e => setSemester(e.target.value)}>
                {[1,2,3,4,5,6,7,8].map(s => <option key={s} value={s}>Semester {s}</option>)}
              </select>
            </div>
            <div>
              <div style={{ fontSize:11, color:"#6b7280", marginBottom:5, fontWeight:500 }}>Batch / Section</div>
              <select className="inp" value={batch} onChange={e => setBatch(e.target.value)}>
                {ALL_BATCHES.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>
            <button className="btn btn-purple" style={{ whiteSpace:"nowrap", padding:"11px 18px", display:"flex", alignItems:"center", gap:6 }}
              onClick={search} disabled={loading || !published}>
              {loading ? (
                <><span style={{ width:14, height:14, border:"2px solid rgba(255,255,255,.3)", borderTop:"2px solid #fff", borderRadius:"50%", animation:"spin .7s linear infinite", display:"inline-block" }}/> Loading</>
              ) : "View Schedule →"}
            </button>
            {searched && entries.length > 0 && (
              <button className="btn btn-green" style={{ whiteSpace:"nowrap", padding:"11px 18px" }} onClick={handleDownload} disabled={downloading}>
                {downloading ? "Generating…" : "📥 Download"}
              </button>
            )}
          </div>
        </div>

        {/* Results */}
        {searched && (
          <div className="fadein">
            {error ? (
              <div className="card" style={{ padding:"60px 20px", textAlign:"center" }}>
                <div style={{ fontSize:40, marginBottom:14 }}>🔍</div>
                <h3 style={{ color:"#fff", marginBottom:8 }}>{published === false ? "Timetable Not Published" : "No Classes Found"}</h3>
                <p style={{ color:"#6b7280", fontSize:13 }}>{error}</p>
              </div>
            ) : (
              <div className="card" style={{ overflow:"hidden" }}>
                <div style={{ padding:"16px 20px", borderBottom:"1px solid rgba(255,255,255,.05)", display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:10 }}>
                  <div>
                    <h3 style={{ fontSize:14, fontWeight:700, color:"#fff" }}>📅 {branch} — Semester {semester} — Batch {batch}</h3>
                    <p style={{ fontSize:11, color:"#6b7280", marginTop:2 }}>{entries.length} class entries this week</p>
                  </div>
                  <div style={{ display:"flex", gap:7, alignItems:"center" }}>
                    <Chip text={branch} bg="#a78bfa"/>
                    <Chip text={`Sem ${semester}`} bg="#60a5fa"/>
                    <Chip text={`Batch ${batch}`} bg="#34d399"/>
                    <button className="btn btn-green btn-sm" onClick={handleDownload} disabled={downloading}>
                      {downloading ? "Generating…" : "📥 Download Excel"}
                    </button>
                  </div>
                </div>
                <div style={{ padding:16 }}>
                  <TimetableGrid entries={entries} batchFilter={batch}/>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Info cards when nothing searched */}
        {!searched && (
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:14 }} className="fadein">
            {[
              ["📚","Weekly Schedule","See all Lectures, Tutorials and Practicals for the week in one grid"],
              ["📥","Download Excel","Download your personal timetable as a formatted Excel file"],
              ["👨‍🏫","Teacher & Room","Know which faculty and room for each of your classes"],
            ].map(([icon, title, desc]) => (
              <div key={title} className="card" style={{ padding:22, textAlign:"center" }}>
                <div style={{ fontSize:36, marginBottom:12 }}>{icon}</div>
                <div style={{ fontSize:14, fontWeight:700, color:"#fff", marginBottom:7 }}>{title}</div>
                <div style={{ fontSize:12, color:"#6b7280", lineHeight:1.65 }}>{desc}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
