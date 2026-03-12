import { useState } from "react";

const features = [
  {
    icon: "📤",
    title: "Upload Excel Timetable",
    desc: "Admin uploads the .xlsx timetable file directly. The system instantly parses all lectures, tutorials, and practicals across every batch and semester.",
    tag: "Admin",
    tagColor: "#7c3aed",
  },
  {
    icon: "⚠️",
    title: "3-Type Clash Detection",
    desc: "Detects all three clash types automatically — Venue (double-booked room), Teacher (faculty in two classes), and Batch (students overlapping).",
    tag: "Core",
    tagColor: "#ef4444",
  },
  {
    icon: "✨",
    title: "AI Suggestions & Auto-Resolve",
    desc: "Every detected clash gets an AI-generated fix. Resolve clashes individually with one click, or hit Auto-Resolve All to clear every conflict instantly.",
    tag: "AI",
    tagColor: "#f59e0b",
  },
  {
    icon: "🚀",
    title: "Publish to Students",
    desc: "Once the timetable is clash-free, admin publishes it live. Students immediately gain access to view and download their personal schedule.",
    tag: "Admin",
    tagColor: "#7c3aed",
  },
  {
    icon: "🎓",
    title: "Student Timetable View",
    desc: "Students log in and filter by Branch, Semester, and Batch to see their full colour-coded weekly grid — subject, room, teacher, and class type per slot.",
    tag: "Student",
    tagColor: "#22c55e",
  },
  {
    icon: "📥",
    title: "Download as Excel",
    desc: "Admin exports the complete resolved timetable. Students download their own batch schedule. Both get neatly formatted .xlsx files ready to use.",
    tag: "Export",
    tagColor: "#06b6d4",
  },
];

const stats = [
  { label: "Faculty Members", value: "450+" },
  { label: "Classrooms", value: "120+" },
  { label: "Subjects Managed", value: "800+" },
  { label: "Clashes Resolved", value: "99%" },
];

export default function LandingPage({ onGetStarted }) {
  const [hoveredFeature, setHoveredFeature] = useState(null);

  return (
    <div style={{ background: "#0a0a0a", color: "#fff", fontFamily: "'Inter', sans-serif", minHeight: "100vh", overflowX: "hidden" }}>

      {/* ── Navbar ── */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "14px 40px",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
        background: "rgba(10,10,10,0.85)", backdropFilter: "blur(12px)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 36, height: 36, background: "#1e1a3a",
            border: "1px solid rgba(124,58,237,0.4)", borderRadius: 10,
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16,
          }}>📅</div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 14, color: "#fff" }}>JIIT SmartSched AI</div>
            <div style={{ fontSize: 10, color: "#6b7280" }}>Sector 128 & 62</div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 32, fontSize: 13 }}>
          {["Features", "About", "Contact"].map(l => (
            <a key={l} href={`#${l.toLowerCase()}`}
              style={{ color: "#9ca3af", textDecoration: "none", transition: "color 0.15s", cursor: "pointer" }}
              onMouseEnter={e => e.target.style.color = "#fff"}
              onMouseLeave={e => e.target.style.color = "#9ca3af"}
            >{l}</a>
          ))}
        </div>

        <button onClick={onGetStarted} style={{
          background: "#7c3aed", color: "#fff", border: "none",
          borderRadius: 10, padding: "9px 20px", fontSize: 13,
          fontWeight: 600, cursor: "pointer", transition: "all 0.18s",
        }}
          onMouseEnter={e => { e.target.style.background = "#6d28d9"; e.target.style.transform = "translateY(-1px)"; }}
          onMouseLeave={e => { e.target.style.background = "#7c3aed"; e.target.style.transform = "translateY(0)"; }}
        >Sign In</button>
      </nav>

      {/* ── Hero ── */}
      <section style={{
        position: "relative", minHeight: "100vh",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        textAlign: "center", padding: "120px 16px 80px",
        background: "radial-gradient(ellipse at 65% 45%, rgba(109,40,217,0.28) 0%, rgba(15,10,30,0.5) 55%, #0a0a0a 100%)",
        overflow: "hidden",
      }}>
        <div style={{ position: "absolute", top: 80, right: 80, width: 320, height: 320, background: "radial-gradient(circle, rgba(124,58,237,0.15) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: 120, left: 60, width: 240, height: 240, background: "radial-gradient(circle, rgba(59,130,246,0.08) 0%, transparent 70%)", pointerEvents: "none" }} />

        <div style={{
          display: "inline-flex", alignItems: "center", gap: 7,
          background: "rgba(30,26,58,0.85)", border: "1px solid rgba(124,58,237,0.35)",
          color: "#c4b5fd", fontSize: 13, padding: "7px 18px", borderRadius: 99, marginBottom: 28,
        }}>✨ AI-Powered Scheduling</div>

        <h1 style={{ fontSize: "clamp(42px, 7vw, 72px)", fontWeight: 800, color: "#fff", marginBottom: 20, lineHeight: 1.1, letterSpacing: "-0.02em" }}>
          JIIT SmartSched AI
        </h1>
        <p style={{ fontSize: 18, color: "#9ca3af", marginBottom: 8, maxWidth: 540 }}>
          AI-powered timetable clash detection and optimization for
        </p>
        <p style={{ fontSize: 18, color: "#a78bfa", fontWeight: 600, marginBottom: 10 }}>
          Jaypee Institute of Information Technology
        </p>
        <p style={{ fontSize: 13, color: "#4b5563", marginBottom: 48 }}>
          Sector 128, Noida &nbsp;•&nbsp; Sector 62, Noida
        </p>

        <button onClick={onGetStarted} style={{
          display: "inline-flex", alignItems: "center", gap: 10,
          background: "#7c3aed", color: "#fff", border: "none",
          borderRadius: 14, padding: "15px 38px", fontSize: 15, fontWeight: 700, cursor: "pointer",
          boxShadow: "0 8px 30px rgba(124,58,237,0.4)", transition: "all 0.2s cubic-bezier(.4,0,.2,1)",
        }}
          onMouseEnter={e => { e.currentTarget.style.background = "#6d28d9"; e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 12px 40px rgba(124,58,237,0.55)"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "#7c3aed"; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 8px 30px rgba(124,58,237,0.4)"; }}
        >
          Get Started <span style={{ fontSize: 18 }}>→</span>
        </button>
      </section>

      {/* ── Stats ── */}
      <section style={{ borderTop: "1px solid rgba(255,255,255,0.05)", borderBottom: "1px solid rgba(255,255,255,0.05)", padding: "36px 40px", background: "#0d0d0d" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20 }}>
          {stats.map(s => (
            <div key={s.label} style={{ textAlign: "center" }}>
              <div style={{ fontSize: 32, fontWeight: 700, color: "#fff", marginBottom: 5 }}>{s.value}</div>
              <div style={{ fontSize: 13, color: "#6b7280" }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" style={{ padding: "80px 40px", background: "#0a0a0a" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <h2 style={{ fontSize: 38, fontWeight: 700, color: "#fff", marginBottom: 12 }}>Powerful Features</h2>
            <p style={{ color: "#6b7280", fontSize: 16 }}>Everything you need to manage JIIT timetables efficiently</p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
            {features.map((f, i) => (
              <div key={f.title}
                onMouseEnter={() => setHoveredFeature(i)}
                onMouseLeave={() => setHoveredFeature(null)}
                style={{
                  background: "#111111",
                  border: hoveredFeature === i ? "1px solid rgba(124,58,237,0.45)" : "1px solid rgba(255,255,255,0.06)",
                  borderRadius: 18, padding: "26px 24px", cursor: "default",
                  transition: "all 0.22s cubic-bezier(.4,0,.2,1)",
                  transform: hoveredFeature === i ? "translateY(-6px)" : "translateY(0)",
                  boxShadow: hoveredFeature === i ? "0 20px 48px rgba(124,58,237,0.18)" : "none",
                }}>

                {/* Icon box */}
                <div style={{
                  width: 52, height: 52,
                  background: hoveredFeature === i ? "#7c3aed" : "#1a1730",
                  borderRadius: 14, display: "flex", alignItems: "center",
                  justifyContent: "center", fontSize: 22, marginBottom: 18,
                  transition: "background 0.2s",
                  border: hoveredFeature === i ? "none" : "1px solid rgba(124,58,237,0.2)",
                }}>{f.icon}</div>

                {/* Title + Role tag */}
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10, flexWrap: "wrap" }}>
                  <span style={{ fontSize: 15, fontWeight: 700, color: "#fff" }}>{f.title}</span>
                  <span style={{
                    fontSize: 10, fontWeight: 700, padding: "2px 9px", borderRadius: 99,
                    background: `${f.tagColor}18`, color: f.tagColor,
                    border: `1px solid ${f.tagColor}40`, whiteSpace: "nowrap", letterSpacing: "0.03em",
                  }}>{f.tag}</span>
                </div>

                <div style={{ fontSize: 13, color: "#6b7280", lineHeight: 1.7 }}>{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Campuses ── */}
      <section id="about" style={{ padding: "80px 40px", background: "#0d0d0d", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 52 }}>
            <h2 style={{ fontSize: 36, fontWeight: 700, color: "#fff", marginBottom: 10 }}>Our Campuses</h2>
            <p style={{ color: "#6b7280", fontSize: 15 }}>Serving both JIIT campuses with unified scheduling</p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
            {[
              {
                sector: "Sector 128", label: "JIIT Sector 128",
                addr: "A-10, Sector 128, Noida, UP 201304",
                depts: ["Computer Science & Engineering", "Electronics & Communication", "Biotechnology", "Humanities & Social Sciences"],
                borderColor: "rgba(124,58,237,0.4)", tagBg: "rgba(88,28,135,0.5)", tagColor: "#c4b5fd",
              },
              {
                sector: "Sector 62", label: "JIIT Sector 62",
                addr: "H-165, Sector 63, Noida, UP 201307",
                depts: ["Information Technology", "Computer Science", "Electronics", "Mathematics & Computing"],
                borderColor: "rgba(59,130,246,0.3)", tagBg: "rgba(30,58,138,0.5)", tagColor: "#93c5fd",
              },
            ].map(c => (
              <div key={c.sector} style={{ background: "#111111", border: `1px solid ${c.borderColor}`, borderRadius: 18, padding: 28 }}>
                <div style={{ display: "inline-block", background: c.tagBg, color: c.tagColor, fontSize: 11, fontWeight: 600, padding: "4px 14px", borderRadius: 99, marginBottom: 14 }}>{c.sector}</div>
                <h3 style={{ fontSize: 20, fontWeight: 700, color: "#fff", marginBottom: 8 }}>{c.label}</h3>
                <p style={{ color: "#6b7280", fontSize: 13, marginBottom: 18 }}>📍 {c.addr}</p>
                {c.depts.map(d => (
                  <div key={d} style={{ display: "flex", alignItems: "center", gap: 9, fontSize: 13, color: "#9ca3af", marginBottom: 9 }}>
                    <div style={{ width: 6, height: 6, background: "#7c3aed", borderRadius: "50%", flexShrink: 0 }} />{d}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer id="contact" style={{ borderTop: "1px solid rgba(255,255,255,0.05)", padding: "56px 40px 28px", background: "#0a0a0a" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 48, marginBottom: 48 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
              <div style={{ width: 34, height: 34, background: "#1e1a3a", border: "1px solid rgba(124,58,237,0.4)", borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15 }}>📅</div>
              <span style={{ fontWeight: 700, fontSize: 14, color: "#fff" }}>JIIT SmartSched AI</span>
            </div>
            <p style={{ fontSize: 12, color: "#4b5563", lineHeight: 1.8 }}>Intelligent timetable management for JIIT — Sector 128 & Sector 62, Noida.</p>
          </div>

          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#fff", marginBottom: 18 }}>Contact Us</div>
            {[["✉️", "support@jiit.ac.in"], ["📞", "+91 120 234-3000"], ["📍", "Sector 128 & Sector 62, Noida, UP"]].map(([icon, text]) => (
              <div key={text} style={{ display: "flex", gap: 10, fontSize: 13, color: "#6b7280", marginBottom: 11 }}>
                <span>{icon}</span><span>{text}</span>
              </div>
            ))}
          </div>

          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#fff", marginBottom: 18 }}>Quick Links</div>
            {["Documentation", "API Reference", "Privacy Policy", "Terms of Service"].map(l => (
              <div key={l} style={{ fontSize: 13, color: "#6b7280", marginBottom: 10, cursor: "pointer" }}
                onMouseEnter={e => e.target.style.color = "#a78bfa"}
                onMouseLeave={e => e.target.style.color = "#6b7280"}
              >{l}</div>
            ))}
          </div>
        </div>
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: 22, textAlign: "center", fontSize: 12, color: "#374151" }}>
          © 2024 JIIT SmartSched AI. All rights reserved.
        </div>
      </footer>
    </div>
  );
}