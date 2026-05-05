import { MapPin, Info, ArrowRight, X } from "lucide-react";
import { getRoomInfo, getDirections } from "../utils/campusMaps";

export default function MapModal({ roomStr, campus = "62", onClose }) {
  const info = getRoomInfo(roomStr, campus);
  const directions = getDirections(info);

  if (!info) return null;

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 10000,
      background: "rgba(0,0,0,.7)", backdropFilter: "blur(8px)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: 20
    }} onClick={onClose}>
      <div 
        style={{
          background: "#111", border: "1px solid rgba(255,255,255,.1)",
          borderRadius: 24, width: "100%", maxWidth: 500, overflow: "hidden",
          boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5)",
          animation: "scaleIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)"
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ 
          padding: "20px 24px", borderBottom: "1px solid rgba(255,255,255,.05)",
          display: "flex", justifyContent: "space-between", alignItems: "center",
          background: "linear-gradient(90deg, rgba(124,58,237,0.1), transparent)"
        }}>
          <div>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: "#fff", display: "flex", alignItems: "center", gap: 8 }}>
              <MapPin size={20} className="text-purple-500" /> {info.raw}
            </h3>
            <p style={{ fontSize: 12, color: "#6b7280", marginTop: 2 }}>{info.campus}</p>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "#6b7280", cursor: "pointer" }}>
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: 24 }}>
          {/* Map Mockup */}
          <div style={{ 
            width: "100%", height: 220, background: "#1a1a1a", borderRadius: 16,
            border: "1px solid rgba(255,255,255,0.05)", position: "relative",
            overflow: "hidden", marginBottom: 24,
            display: "flex", alignItems: "center", justifyContent: "center"
          }}>
            <div style={{ position: "absolute", inset: 0, opacity: 0.3, background: "radial-gradient(circle at 50% 50%, #7c3aed33, transparent)" }} />
            
            {/* Visual Floor Plan Representation */}
            <div style={{ 
              width: "80%", height: "70%", border: "2px dashed rgba(255,255,255,0.1)", 
              borderRadius: 8, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, padding: 15 
            }}>
              {[1,2,3,4,5,6].map(i => (
                <div key={i} style={{ 
                  background: (info.raw.includes(i) || (i===2 && info.floor==="2")) ? "rgba(124,58,237,0.2)" : "rgba(255,255,255,0.02)", 
                  border: (info.raw.includes(i) || (i===2 && info.floor==="2")) ? "1px solid #7c3aed" : "1px solid rgba(255,255,255,0.05)",
                  borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center"
                }}>
                  {(info.raw.includes(i) || (i===2 && info.floor==="2")) && (
                    <div style={{ width: 8, height: 8, background: "#7c3aed", borderRadius: "50%", boxShadow: "0 0 10px #7c3aed" }} />
                  )}
                </div>
              ))}
            </div>

            <div style={{ 
              position: "absolute", bottom: 12, right: 12, background: "rgba(0,0,0,0.6)",
              padding: "4px 10px", borderRadius: 6, fontSize: 10, color: "#9ca3af", border: "1px solid rgba(255,255,255,0.1)"
            }}>
              {info.building} · Floor {info.floor}
            </div>
          </div>

          {/* Details */}
          <div style={{ marginBottom: 24 }}>
             <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#fff", fontSize: 14, fontWeight: 600, marginBottom: 8 }}>
               <Info size={16} className="text-purple-400" /> Building Details
             </div>
             <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div style={{ background: "#1a1a1a", padding: "10px 14px", borderRadius: 12, border: "1px solid rgba(255,255,255,0.03)" }}>
                  <div style={{ fontSize: 10, color: "#6b7280", textTransform: "uppercase" }}>Block</div>
                  <div style={{ fontSize: 13, color: "#fff" }}>{info.buildingCode}</div>
                </div>
                <div style={{ background: "#1a1a1a", padding: "10px 14px", borderRadius: 12, border: "1px solid rgba(255,255,255,0.03)" }}>
                  <div style={{ fontSize: 10, color: "#6b7280", textTransform: "uppercase" }}>Type</div>
                  <div style={{ fontSize: 13, color: "#fff" }}>{info.description || "Academic"}</div>
                </div>
             </div>
          </div>

          {/* Directions */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#fff", fontSize: 14, fontWeight: 600, marginBottom: 12 }}>
               <ArrowRight size={16} className="text-green-400" /> Directions
             </div>
             <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {directions.map((step, idx) => (
                  <div key={idx} style={{ display: "flex", gap: 10, fontSize: 12.5, color: "#9ca3af", lineHeight: 1.5 }}>
                    <div style={{ color: "#22c55e", fontWeight: 700 }}>{idx + 1}.</div>
                    <div>{step}</div>
                  </div>
                ))}
             </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding: "16px 24px", background: "#0d0d0d", borderTop: "1px solid rgba(255,255,255,.05)", textAlign: "right" }}>
          <button 
            onClick={onClose}
            className="btn btn-purple" 
            style={{ padding: "8px 24px", fontSize: 13 }}
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}
